import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

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

// Alias used by mentor/[id] page - lists sessions posted by a mentor for students to book
export const listPostedSessions = query({
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

export const createSession = mutation({
  args: {
    date: v.string(),
    timeSlot: v.string(),
    price: v.number(),
    topic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "mentor") {
      throw new Error("Only mentors can create sessions");
    }

    return await ctx.db.insert("sessions", {
      ...args,
      mentorId: userId,
      mentorName: user.name || "Mentor",
      status: "available", // Changed from "booked" to "available" as this is creating a slot
      createdAt: new Date().toISOString(),
    });
  },
});

// Used by mentor/[id] page booking flow
export const bookSession = mutation({
  args: {
    mentorId: v.string(),
    mentorName: v.string(),
    date: v.string(),
    timeSlot: v.string(),
    price: v.number(),
    topic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    return await ctx.db.insert("sessions", {
      ...args,
      studentId: userId,
      studentName: user.name || "Student",
      status: "booked",
      createdAt: new Date().toISOString(),
    });
  },
});
