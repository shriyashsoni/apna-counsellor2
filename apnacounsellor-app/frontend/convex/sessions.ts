import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByUser = query({
  args: { userId: v.string(), role: v.string() },
  handler: async (ctx, args) => {
    if (args.role === "mentor") {
      return await ctx.db
        .query("sessions")
        .withIndex("by_mentor", (q) => q.eq("mentorId", args.userId))
        .collect();
    }
    return await ctx.db
      .query("sessions")
      .withIndex("by_student", (q) => q.eq("studentId", args.userId))
      .collect();
  },
});

export const createSession = mutation({
  args: {
    sessionId: v.string(),
    studentId: v.string(),
    studentName: v.string(),
    mentorId: v.string(),
    mentorName: v.string(),
    date: v.string(),
    timeSlot: v.string(),
    topic: v.string(),
    status: v.string(),
    price: v.number(),
    paymentId: v.optional(v.string()),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", args);
  },
});

export const updateStatus = mutation({
  args: { sessionId: v.string(), status: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session) throw new Error("Session not found");
    await ctx.db.patch(session._id, { status: args.status });
  },
});

export const totalCount = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("sessions").collect();
    return all.length;
  },
});
