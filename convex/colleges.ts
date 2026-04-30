import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      const normalizedId = ctx.db.normalizeId("colleges", args.id);
      if (!normalizedId) return null;
      return await ctx.db.get(normalizedId);
    } catch (e) {
      return null;
    }
  },
});

export const addCollege = mutation({
  args: {
    counselingId: v.id("counselings"),
    name: v.string(),
    location: v.optional(v.string()),
    type: v.string(),
    fees: v.optional(v.string()),
    placementStats: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("colleges", args as any);
  },
});
export const list = query({
  args: { 
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    state: v.optional(v.string()),
    ranking: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let results: any[] = [];

    // 1. Primary Query Method
    if (args.search && args.search.trim().length > 0) {
      // Search index is most specific
      results = await ctx.db
        .query("colleges")
        .withSearchIndex("by_name", (q) => q.search("name", args.search!.trim()))
        .take(100);
    } else if (args.state && args.state !== "All") {
      // State index is next best
      results = await ctx.db
        .query("colleges")
        .withIndex("by_state", (q) => q.eq("state", args.state!))
        .take(100);
    } else if (args.category && args.category !== "All") {
      // Category fallback to keyword search if no search term
      let keyword = args.category;
      if (args.category.toLowerCase() === "iit") keyword = "Indian Institute of Technology";
      if (args.category.toLowerCase() === "nit") keyword = "National Institute of Technology";
      if (args.category.toLowerCase() === "iiit") keyword = "Indian Institute of Information";

      results = await ctx.db
        .query("colleges")
        .withSearchIndex("by_name", (q) => q.search("name", keyword))
        .take(100);
    } else {
      // Default: Return top ranked colleges if no filters
      results = await ctx.db.query("colleges").order("desc").take(50);
    }

    // 2. Secondary Filtering (Refining the 100 results)
    let filtered = results;

    if (args.category && args.category !== "All") {
      const cat = args.category.toLowerCase();
      filtered = filtered.filter(c => {
        const name = c.name.toLowerCase();
        const type = (c.type || "").toLowerCase();
        if (cat === "iit") return name.includes("indian institute of technology") || name.includes(" iit ");
        if (cat === "nit") return name.includes("national institute of technology") || name.includes(" nit ");
        if (cat === "iiit") return name.includes("indian institute of information technology") || name.includes(" iiit ");
        return type.includes(cat) || name.includes(cat);
      });
    }

    if (args.state && args.state !== "All" && !args.search) {
      // Already filtered by state index if no search, but if search exists we filter here
    } else if (args.state && args.state !== "All") {
       filtered = filtered.filter(c => c.state === args.state);
    }

    if (args.ranking && args.ranking !== "All") {
      const rankLimit = parseInt(args.ranking.replace(/\D/g, ""));
      if (!isNaN(rankLimit)) {
        filtered = filtered.filter(c => c.nirfRank && c.nirfRank <= rankLimit);
      }
    }

    return filtered.slice(0, 50).map(c => {
      // Exclude large fields like cutoffs to save bandwidth and bytes read
      const { cutoffs, ...rest } = c;
      return rest;
    });
  },
});

export const getCollegesByCounseling = query({
  args: { counselingId: v.id("counselings") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("colleges")
      .withIndex("by_counseling", (q) => q.eq("counselingId", args.counselingId))
      .take(1000); // Limit to 1000 to prevent crashing with 70k+ total records
  },
});

export const getByIds = query({
  args: { ids: v.array(v.id("colleges")) },
  handler: async (ctx, args) => {
    const colleges = await Promise.all(args.ids.map(id => ctx.db.get(id)));
    return colleges.filter(Boolean);
  },
});

export const predict = query({
  args: {
    exam: v.string(),
    rank: v.optional(v.number()),
    percentile: v.optional(v.number()),
    category: v.string(),
    preferredBranches: v.optional(v.array(v.string())),
    preferredStates: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    let rank = args.rank || 0;
    const percentile = args.percentile || 0;

    // Rank Normalization Logic from Android Backend
    if (args.exam.toUpperCase() === "JEE MAINS" && percentile > 0) {
      rank = Math.max(1, Math.floor((100 - percentile) * 12000));
    } else if (args.exam.toUpperCase() === "JEE ADVANCED" && rank === 0) {
      rank = 50000;
    }

    // Optimized Query: Use index if filtering by state to avoid full scans
    let query = ctx.db.query("colleges");
    
    if (args.preferredStates && args.preferredStates.length === 1) {
      // If user only wants one state, we can use the index perfectly
      query = query.withIndex("by_state", (q) => q.eq("state", args.preferredStates![0]));
    } else if (args.preferredStates && args.preferredStates.length > 1) {
      // If multiple, we still use the first one's index as a starting point 
      // or just take more records and filter in memory
      query = query.withIndex("by_state", (q) => q.eq("state", args.preferredStates![0]));
    }

    const colleges = await query.take(500);
    const results: any[] = [];


    for (const c of colleges) {
      if (args.preferredStates && args.preferredStates.length > 0 && !args.preferredStates.includes(c.state)) {
        continue;
      }

      const cutoffs = (c.cutoffs as any) || {};
      for (const [branch, data] of Object.entries(cutoffs)) {
        const branchName = branch;
        const branchData = data as any;

        if (args.preferredBranches && args.preferredBranches.length > 0 && !args.preferredBranches.includes(branchName)) {
          continue;
        }

        // Get cutoff for category or fallback to General
        const catCutoff = branchData[args.category] || branchData["General"] || 99999;

        if (rank <= catCutoff) {
          // Probability calculation formula from Android logic
          const prob = Math.min(95, Math.max(30, Math.floor(100 - (rank / Math.max(catCutoff, 1)) * 60)));
          
          results.push({
            id: c.collegeId || c._id,
            name: c.name,
            shortName: c.shortName || c.name,
            state: c.state,
            type: c.type,
            branch: branchName,
            cutoffRank: catCutoff,
            yourRank: rank,
            probability: prob,
            annualFee: c.annualFee,
            avgPackage: c.avgPackage,
            nirfRank: c.nirfRank || 999,
          });
          // Only take the first branch that matches for this college to avoid duplicates in results
          break; 
        }
      }
    }

    return results
      .sort((a, b) => b.probability - a.probability || a.nirfRank - b.nirfRank)
      .slice(0, 15);
  },
});

export const updateCollegeMetadata = mutation({
  args: {
    collegeId: v.id("colleges"),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updateData: any = {};
    if (args.imageUrl !== undefined) updateData.imageUrl = args.imageUrl;
    if (args.description !== undefined) updateData.description = args.description;
    
    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(args.collegeId, updateData);
    }
  },
});
