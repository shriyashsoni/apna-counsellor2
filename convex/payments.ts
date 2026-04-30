import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listRecent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("payments")
      .order("desc")
      .take(10);
  },
});

export const listByUser = query({
  args: { userId: v.string(), role: v.optional(v.string()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const savePayment = mutation({
  args: {
    paymentId: v.string(),
    orderId: v.optional(v.string()),
    signature: v.optional(v.string()),
    amount: v.number(),
    currency: v.string(),
    status: v.string(),
    userId: v.string(),
    mentorId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("payments", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});
