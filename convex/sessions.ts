import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByMentor = query({
  args: { mentorId: v.string() },
  handler: async (ctx, args) => {
    if (!args.mentorId) return [];
    
    return await ctx.db
      .query("sessions")
      .withIndex("by_mentor", (q) => q.eq("mentorId", args.mentorId))
      .order("desc")
      .take(50);
  },
});

export const listByStudent = query({
  args: { studentId: v.string() },
  handler: async (ctx, args) => {
    if (!args.studentId) return [];
    
    return await ctx.db
      .query("sessions")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .order("desc")
      .take(50);
  },
});

export const createSession = mutation({
  args: {
    mentorId: v.string(),
    mentorName: v.string(),
    studentId: v.string(),
    studentName: v.string(),
    date: v.string(),
    timeSlot: v.string(),
    price: v.number(),
    topic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", {
      ...args,
      status: "booked",
      createdAt: new Date().toISOString(),
    });
  },
});
