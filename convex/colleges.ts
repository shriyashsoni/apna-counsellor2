import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getById = query({
  args: { id: v.id("colleges") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
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
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Search State
    if (args.search && args.search.trim().length > 0) {
      const searchTerm = args.search.trim();
      let results = await ctx.db
        .query("colleges")
        .withSearchIndex("by_name", (q) => q.search("name", searchTerm))
        .take(50); // Hard limit to 50 for extreme performance

      if (args.type && args.type !== "All") {
        const filterType = args.type.toLowerCase();
        results = results.filter(c => {
          const type = (c.type || "").toLowerCase();
          return type.includes(filterType) || c.name.toLowerCase().includes(filterType);
        });
      }
      return results;
    }

    // 2. Category / Type State (No search term)
    if (args.type && args.type !== "All") {
      const filterType = args.type.toLowerCase();
      let keyword = args.type;
      
      // Map categories to highly specific search keywords to utilize the search index
      if (filterType === "iit") keyword = "Indian Institute of Technology";
      if (filterType === "nit") keyword = "National Institute of Technology";
      if (filterType === "iiit") keyword = "Indian Institute of Information";
      
      // Use the search index instead of a full table scan
      const results = await ctx.db
        .query("colleges")
        .withSearchIndex("by_name", (q) => q.search("name", keyword))
        .take(50);
        
      return results;
    }

    // 3. Default "Zero-Load" State
    // Return an empty array so we don't load 70,000 colleges into memory.
    // The frontend will prompt the user to search.
    return [];
  },
});
export const getCollegesByCounseling = query({
  args: { counselingId: v.id("counselings") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("colleges")
      .filter((q) => q.eq(q.field("counselingId"), args.counselingId))
      .collect();
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

    const colleges = await ctx.db.query("colleges").collect();
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
