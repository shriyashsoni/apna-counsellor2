import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    state: v.optional(v.string()),
    type: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let colleges = await ctx.db.query("colleges").collect();
    if (args.state) {
      colleges = colleges.filter((c) => c.state === args.state);
    }
    if (args.type) {
      colleges = colleges.filter((c) => c.type === args.type);
    }
    if (args.search) {
      const s = args.search.toLowerCase();
      colleges = colleges.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.shortName.toLowerCase().includes(s) ||
          c.state.toLowerCase().includes(s)
      );
    }
    return colleges.sort((a, b) => (a.nirfRank || 999) - (b.nirfRank || 999));
  },
});

export const getById = query({
  args: { collegeId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("colleges")
      .withIndex("by_college_id", (q) => q.eq("collegeId", args.collegeId))
      .first();
  },
});

export const getStates = query({
  args: {},
  handler: async (ctx) => {
    const colleges = await ctx.db.query("colleges").collect();
    const states = [...new Set(colleges.map((c) => c.state))].sort();
    return states;
  },
});

export const upsertCollege = mutation({
  args: { data: v.any() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("colleges")
      .withIndex("by_college_id", (q) => q.eq("collegeId", args.data.collegeId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args.data);
      return existing._id;
    }
    return await ctx.db.insert("colleges", args.data);
  },
});

export const deleteCollege = mutation({
  args: { collegeId: v.string() },
  handler: async (ctx, args) => {
    const college = await ctx.db
      .query("colleges")
      .withIndex("by_college_id", (q) => q.eq("collegeId", args.collegeId))
      .first();
    if (college) {
      await ctx.db.delete(college._id);
      return true;
    }
    return false;
  },
});

export const totalCount = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("colleges").collect();
    return all.length;
  },
});
