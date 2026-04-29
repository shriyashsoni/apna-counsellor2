import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Called storeUser without authentication");
    }

    const user = await ctx.db.get(userId);
    if (!user) return null;

    // Optional: update user profile from identity if needed
    // But @convex-dev/auth usually handles this via accounts
    
    return userId;
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db.get(userId);
  },
});

export const listMentors = query({
  args: {
    search: v.optional(v.string()),
    skill: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("users").withIndex("by_role", (q) => q.eq("role", "mentor"));
    
    let mentors = await query.collect();

    if (args.search) {
      const s = args.search.toLowerCase();
      mentors = mentors.filter(m => 
        m.name?.toLowerCase().includes(s) || 
        m.college?.toLowerCase().includes(s) || 
        m.headline?.toLowerCase().includes(s)
      );
    }

    if (args.skill) {
      mentors = mentors.filter(m => m.skills?.includes(args.skill!));
    }

    return mentors;
  },
});

export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, args.data);
  },
});
