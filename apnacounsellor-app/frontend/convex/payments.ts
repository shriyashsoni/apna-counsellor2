import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createPayment = mutation({
  args: {
    paymentId: v.string(),
    razorpayLinkId: v.optional(v.string()),
    shortUrl: v.optional(v.string()),
    amount: v.number(),
    currency: v.string(),
    status: v.string(),
    userId: v.string(),
    userName: v.string(),
    mentorId: v.string(),
    mentorName: v.string(),
    sessionId: v.optional(v.string()),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("payments", args);
  },
});

export const updateStatus = mutation({
  args: { paymentId: v.string(), status: v.string() },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_payment_id", (q) => q.eq("paymentId", args.paymentId))
      .first();
    if (!payment) throw new Error("Payment not found");
    await ctx.db.patch(payment._id, { status: args.status });
  },
});

export const listByUser = query({
  args: { userId: v.string(), role: v.string(), mentorId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.role === "mentor" && args.mentorId) {
      return await ctx.db
        .query("payments")
        .withIndex("by_mentor", (q) => q.eq("mentorId", args.mentorId!))
        .collect();
    }
    return await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getByPaymentId = query({
  args: { paymentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_payment_id", (q) => q.eq("paymentId", args.paymentId))
      .first();
  },
});

export const totalPaid = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("payments").collect();
    return all.filter((p) => p.status === "paid").length;
  },
});
