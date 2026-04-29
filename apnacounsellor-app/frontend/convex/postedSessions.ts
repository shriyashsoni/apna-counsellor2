import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByMentor = query({
  args: { mentorId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("postedSessions")
      .withIndex("by_mentor", (q) => q.eq("mentorId", args.mentorId))
      .order("desc")
      .take(50);
  },
});

export const create = mutation({
  args: { data: v.any() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("postedSessions", args.data);
  },
});

export const deleteSession = mutation({
  args: { sessionId: v.string(), mentorId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("postedSessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.mentorId !== args.mentorId) throw new Error("Not found");
    await ctx.db.delete(session._id);
  },
});
