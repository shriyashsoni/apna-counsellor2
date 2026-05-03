import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    // 1. Try finding by current userId (Convex ID)
    let profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    
    if (profile) return profile;

    // 2. Fallback: Find by email if user has email
    const user = await ctx.db.get(userId);
    if (user && user.email) {
      profile = await ctx.db
        .query("profiles")
        .withIndex("by_email", (q) => q.eq("email", user.email))
        .unique();
        
      if (profile) return profile;
    }

    // 3. Last Resort: Construct a "Virtual Profile" from the users table 
    if (user && user.onboardingComplete) {
      return {
        _id: user._id,
        userId: userId,
        fullName: user.name || "User",
        phone: user.phone || "",
        city: user.city || "",
        examType: user.exam || "JEE",
        targetYear: 2026,
        category: user.category || "General",
        interestedStates: user.interestedStates || [],
        onboarded: true,
      };
    }

    return null;
  },
});

export const createProfile = mutation({
  args: {
    fullName: v.string(),
    phone: v.string(),
    city: v.string(),
    examType: v.string(),
    targetYear: v.number(),
    rank: v.optional(v.number()),
    category: v.string(),
    interestedStates: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);

    let existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!existing && user?.email) {
      existing = await ctx.db
        .query("profiles")
        .withIndex("by_email", (q) => q.eq("email", user.email))
        .unique();
    }

    if (existing) {
      return await ctx.db.patch(existing._id, {
        ...args,
        userId: userId, // Ensure userId is updated to the new Convex ID format
        onboarded: true,
      });
    }

    return await ctx.db.insert("profiles", {
      userId: userId,
      email: user?.email,
      ...args,
      onboarded: true,
    });
  },
});
