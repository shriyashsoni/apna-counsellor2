import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addCounseling = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    region: v.string(),
    exam: v.optional(v.string()),
    officialUrl: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("counselings", args);
    return id;
  },
});

export const listCounselings = query({
  handler: async (ctx) => {
    return await ctx.db.query("counselings").collect();
  },
});
