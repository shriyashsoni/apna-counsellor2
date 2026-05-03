import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const listRecent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);
  },
});

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
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
    mentorId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("payments", {
      ...args,
      userId: userId,
      createdAt: new Date().toISOString(),
    });
  },
});
