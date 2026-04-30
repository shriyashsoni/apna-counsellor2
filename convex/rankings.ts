import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * AI Scoring Heuristic: Automatically assigns a score and tier to colleges
 * based on their NIRF rank, average package, and establishment year.
 */
export const runAIRanking = mutation({
  args: { limit: v.optional(v.number()), cursor: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 500;
    const results = await ctx.db
      .query("colleges")
      .paginate({ cursor: args.cursor || null, numItems: limit });

    let updatedCount = 0;

    for (const college of results.page) {
      let score = 50; // Base score
      
      // 1. NIRF Rank Bonus
      if (college.nirfRank) {
        if (college.nirfRank <= 50) score += 40;
        else if (college.nirfRank <= 100) score += 30;
        else if (college.nirfRank <= 200) score += 20;
        else if (college.nirfRank <= 500) score += 10;
      }

      // 2. Package Bonus (heuristic)
      if (college.avgPackage) {
        const pkg = parseInt(college.avgPackage.replace(/\D/g, ""));
        if (pkg >= 20) score += 30;
        else if (pkg >= 12) score += 20;
        else if (pkg >= 6) score += 10;
      }

      // 3. Category Bonus
      const name = (college.name || "").toLowerCase();
      if (name.includes("indian institute of technology")) score += 50;
      else if (name.includes("national institute of technology")) score += 30;
      else if (name.includes("iiit")) score += 25;

      // Normalize score to 0-100
      score = Math.min(100, score);

      // Assign Tier
      let tier = "Standard";
      if (score >= 90) tier = "Elite (Top 50)";
      else if (score >= 80) tier = "Premium (Top 100)";
      else if (score >= 70) tier = "Superior (Top 200)";
      else if (score >= 60) tier = "Value (Top 500)";

      await ctx.db.patch(college._id, {
        aiScore: score,
        tier: tier
      });
      updatedCount++;
    }

    return {
      updated: updatedCount,
      nextCursor: results.continueCursor,
      isDone: results.isDone
    };
  },
});

/**
 * Fetches colleges by AI Tier or Rank
 */
export const getTopColleges = query({
  args: { 
    tier: v.optional(v.string()), 
    state: v.optional(v.string()),
    limit: v.optional(v.number()) 
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("colleges");
    
    if (args.state && args.state !== "All") {
      q = q.withIndex("by_state", (q) => q.eq("state", args.state));
    }

    const colleges = await q.collect();
    
    let filtered = colleges;
    if (args.tier && args.tier !== "All") {
      filtered = colleges.filter(c => c.tier === args.tier);
    }

    return filtered
      .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
      .slice(0, args.limit || 50);
  },
});
