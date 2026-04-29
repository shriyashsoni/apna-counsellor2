import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
    return await ctx.db.insert("colleges", args);
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
