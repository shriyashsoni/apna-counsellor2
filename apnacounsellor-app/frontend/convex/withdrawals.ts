import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByMentor = query({
  args: { mentorId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("withdrawals")
      .withIndex("by_mentor", (q) => q.eq("mentorId", args.mentorId))
      .order("desc")
      .take(50);
  },
});

export const listAll = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let all = await ctx.db.query("withdrawals").collect();
    if (args.status) all = all.filter((w) => w.status === args.status);
    return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
});

export const create = mutation({
  args: {
    withdrawalId: v.string(),
    mentorId: v.string(),
    mentorName: v.string(),
    amount: v.number(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("withdrawals", { ...args, status: "pending" });
  },
});

export const updateStatus = mutation({
  args: {
    withdrawalId: v.string(),
    status: v.string(),
    approvedAt: v.optional(v.string()),
    rejectedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const w = await ctx.db
      .query("withdrawals")
      .withIndex("by_withdrawal_id", (q) => q.eq("withdrawalId", args.withdrawalId))
      .first();
    if (!w) throw new Error("Not found");
    await ctx.db.patch(w._id, {
      status: args.status,
      approvedAt: args.approvedAt,
      rejectedAt: args.rejectedAt,
    });
  },
});

export const pendingCount = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("withdrawals").collect();
    return all.filter((w) => w.status === "pending").length;
  },
});
