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
    let q = ctx.db.query("colleges");

    if (args.type && args.type !== "All") {
      const type = args.type;
      const all = await q.collect();
      let filtered = all.filter(c => c.type?.toLowerCase().includes(type.toLowerCase()));
      
      if (args.search) {
        const search = args.search.toLowerCase();
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(search) || 
          c.shortName?.toLowerCase().includes(search) ||
          c.city?.toLowerCase().includes(search) ||
          c.aisheCode?.toLowerCase().includes(search)
        );
      }
      return filtered.slice(0, 50);
    }

    if (args.search) {
      const search = args.search.toLowerCase();
      const all = await q.collect();
      return all.filter(c => 
        c.name.toLowerCase().includes(search) || 
        c.shortName?.toLowerCase().includes(search) ||
        c.city?.toLowerCase().includes(search) ||
        c.aisheCode?.toLowerCase().includes(search)
      ).slice(0, 50);
    }

    // Default return if no filters applied
    return await q.order("desc").take(50);
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
