import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// --- Mentor Actions ---

export const createMentor = mutation({
  args: {
    name: v.string(),
    expertise: v.string(),
    bio: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("mentors", args);
  },
});

export const postSession = mutation({
  args: {
    mentorId: v.id("mentors"),
    title: v.string(),
    description: v.string(),
    date: v.string(),
    price: v.number(),
    availableSlots: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", args);
  },
});

// --- Student Actions ---

export const bookSession = mutation({
  args: {
    sessionId: v.id("sessions"),
    studentId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.availableSlots <= 0) {
      throw new Error("No slots available");
    }

    // Decrement slots
    await ctx.db.patch(args.sessionId, {
      availableSlots: session.availableSlots - 1,
    });

    return await ctx.db.insert("bookings", {
      sessionId: args.sessionId,
      studentId: args.studentId,
      status: "booked",
      bookingDate: new Date().toISOString(),
    });
  },
});

// --- Queries ---

export const getAvailableSessions = query({
  handler: async (ctx) => {
    const sessions = await ctx.db.query("sessions").collect();
    // In a real app, we'd join with mentors
    const results = await Promise.all(
      sessions.map(async (s) => {
        const mentor = await ctx.db.get(s.mentorId);
        return { ...s, mentorName: mentor?.name, expertise: mentor?.expertise };
      })
    );
    return results;
  },
});

export const getStudentBookings = query({
  args: { studentId: v.string() },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .collect();

    const results = await Promise.all(
      bookings.map(async (b) => {
        const session = await ctx.db.get(b.sessionId);
        const mentor = session ? await ctx.db.get(session.mentorId) : null;
        return { ...b, session, mentorName: mentor?.name };
      })
    );
    return results;
  },
});

export const listMentors = query({
  handler: async (ctx) => {
    return await ctx.db.query("mentors").collect();
  },
});
