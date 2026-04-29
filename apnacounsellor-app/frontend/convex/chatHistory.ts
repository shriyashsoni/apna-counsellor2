import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatHistory")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .take(20);
  },
});

export const addMessage = mutation({
  args: {
    sessionId: v.string(),
    userId: v.string(),
    role: v.string(),
    content: v.string(),
    timestamp: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chatHistory", args);
  },
});
