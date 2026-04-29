import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addRank = mutation({
  args: {
    collegeId: v.id("colleges"),
    courseName: v.string(),
    category: v.string(),
    year: v.number(),
    openingRank: v.number(),
    closingRank: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ranks", args);
  },
});

export const getRanksByCollege = query({
  args: { collegeId: v.id("colleges") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ranks")
      .filter((q) => q.eq(q.field("collegeId"), args.collegeId))
      .collect();
  },
});

export const predictColleges = query({
  args: { rank: v.number(), category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ranks")
      .filter((q) => 
        q.and(
          q.eq(q.field("category"), args.category),
          q.gte(q.field("closingRank"), args.rank)
        )
      )
      .order("asc")
      .take(20);
  },
});
