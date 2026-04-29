import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();
  },
});

export const createProfile = mutation({
  args: {
    fullName: v.string(),
    phone: v.string(),
    city: v.string(),
    examType: v.string(),
    targetYear: v.number(),
    rank: v.optional(v.number()),
    category: v.string(),
    interestedStates: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        ...args,
        onboarded: true,
      });
    }

    return await ctx.db.insert("profiles", {
      userId: identity.subject,
      ...args,
      onboarded: true,
    });
  },
});
