import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // 1. Try finding by current userId (Convex ID)
    let profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();
    
    if (profile) return profile;

    // 2. Fallback: Find by email
    if (identity.email) {
      profile = await ctx.db
        .query("profiles")
        .withIndex("by_email", (q) => q.eq("email", identity.email))
        .unique();
        
      if (profile) return profile;
    }

    // 3. Last Resort: Construct a "Virtual Profile" from the users table 
    // (since some data might have been stored there during previous migrations)
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();

    if (user && user.onboardingComplete) {
      return {
        _id: user._id,
        userId: identity.subject,
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    let existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (!existing && identity.email) {
      existing = await ctx.db
        .query("profiles")
        .withIndex("by_email", (q) => q.eq("email", identity.email))
        .unique();
    }


    if (existing) {
      return await ctx.db.patch(existing._id, {
        ...args,
        onboarded: true,
      });
    }

    return await ctx.db.insert("profiles", {
      userId: identity.subject,
      ...args,
      onboarded: true,
    });
  },
});
