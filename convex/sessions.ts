import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listPostedSessions = query({
  args: { mentorId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("counsellorId"), args.mentorId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
  },
});

export const bookSession = mutation({
  args: {
    sessionId: v.id("sessions"),
    studentId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.status !== "pending") throw new Error("Session already booked");

    await ctx.db.patch(args.sessionId, {
      studentId: args.studentId,
      status: "confirmed",
      updatedAt: Date.now(),
    });

    // Create a notification for the mentor
    await ctx.db.insert("notifications", {
      userId: session.counsellorId,
      title: "New Booking!",
      body: "A student has booked a session with you.",
      type: "session_reminder",
      isRead: false,
      createdAt: Date.now(),
    });

    return args.sessionId;
  },
});

export const getMySessions = query({
  args: { userId: v.id("users"), role: v.string() },
  handler: async (ctx, args) => {
    if (args.role === "student") {
      return await ctx.db
        .query("sessions")
        .filter((q) => q.eq(q.field("studentId"), args.userId))
        .collect();
    } else {
      return await ctx.db
        .query("sessions")
        .filter((q) => q.eq(q.field("counsellorId"), args.userId))
        .collect();
    }
  },
});
