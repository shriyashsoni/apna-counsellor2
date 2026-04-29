import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(50);
  },
});

export const unreadCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const notifs = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return notifs.filter((n) => !n.read).length;
  },
});

export const createNotification = mutation({
  args: {
    notifId: v.string(),
    userId: v.string(),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      ...args,
      read: false,
    });
  },
});

export const markRead = mutation({
  args: { notifId: v.string() },
  handler: async (ctx, args) => {
    const notif = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("notifId"), args.notifId))
      .first();
    if (notif) await ctx.db.patch(notif._id, { read: true });
  },
});
