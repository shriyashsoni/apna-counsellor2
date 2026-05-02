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

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("counselings").collect();
  },
});

// Used by counseling-details/[id] dynamic page
export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      const normalizedId = ctx.db.normalizeId("counselings", args.id);
      if (!normalizedId) return null;
      return await ctx.db.get(normalizedId);
    } catch (e) {
      return null;
    }
  },
});
