import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    status: v.optional(v.string()),
    mentorId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let batches = await ctx.db.query("batches").collect();
    if (args.status) batches = batches.filter((b) => b.status === args.status);
    if (args.mentorId) batches = batches.filter((b) => b.mentorId === args.mentorId);
    return batches.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
});

export const getById = query({
  args: { batchId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("batches")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .first();
  },
});

export const create = mutation({
  args: { data: v.any() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("batches", args.data);
  },
});

export const joinBatch = mutation({
  args: { batchId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const batch = await ctx.db
      .query("batches")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .first();
    if (!batch) throw new Error("Batch not found");
    if (batch.currentStudents >= batch.maxStudents) throw new Error("Batch is full");
    const students = batch.students || [];
    if (students.includes(args.userId)) throw new Error("Already joined");
    await ctx.db.patch(batch._id, {
      students: [...students, args.userId],
      currentStudents: batch.currentStudents + 1,
    });
  },
});

export const deleteBatch = mutation({
  args: { batchId: v.string(), mentorId: v.string() },
  handler: async (ctx, args) => {
    const batch = await ctx.db
      .query("batches")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .first();
    if (!batch || batch.mentorId !== args.mentorId) throw new Error("Not found");
    await ctx.db.delete(batch._id);
  },
});
