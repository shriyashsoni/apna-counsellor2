import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const getActive = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    if (!args.userId) return null;
    
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .unique();
  },
});

export const createSubscription = mutation({
  args: {
    userId: v.string(),
    planId: v.string(),
    razorpaySubscriptionId: v.optional(v.string()),
    durationMonths: v.number(),
  },
  handler: async (ctx, args) => {
    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + args.durationMonths * 30 * 24 * 60 * 60 * 1000).toISOString();

    return await ctx.db.insert("subscriptions", {
      userId: args.userId,
      planId: args.planId,
      status: "active",
      startDate,
      endDate,
      razorpaySubscriptionId: args.razorpaySubscriptionId,
    });
  },
});
