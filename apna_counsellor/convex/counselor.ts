import { query } from "./_generated/server";
import { v } from "convex/values";

export const searchContext = query({
  args: { 
    searchTerm: v.string(),
    category: v.optional(v.string()), // Engineering / Medical
  },
  handler: async (ctx, args) => {
    // 1. Search Counselings
    const counselings = await ctx.db
      .query("counselings")
      .withSearchIndex("by_name", (q) => q.search("name", args.searchTerm))
      .take(5);

    // 2. Search Colleges
    const colleges = await ctx.db
      .query("colleges")
      .withSearchIndex("by_name", (q) => q.search("name", args.searchTerm))
      .take(10);

    return {
      counselings,
      colleges,
    };
  },
});
