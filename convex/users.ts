import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Called storeUser without authentication");
    }

    const user = await ctx.db.get(userId);
    if (!user) return null;

    return userId;
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // 1. Try getting user ID from convex-auth session
    let user = null;
    const userId = await auth.getUserId(ctx);
    if (userId) {
      user = await ctx.db.get(userId);
    }

    // 2. Fallback: Search by email if session lookup failed or returned no user
    if (!user && identity.email) {
      user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", identity.email))
        .unique();
    }

    if (user) {
      // Strict Admin Enforcement
      const isAdmin = user.email === "apnacounsellor@gmail.com" || 
                      user.email === "sonishriyash@gmail.com" || 
                      user.role === "admin";
      return { ...user, isAdmin };
    }

    return null;
  },
});

// Helper function for internal checks
async function isAdminCheck(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.email) return false;
  
  if (identity.email === "apnacounsellor@gmail.com" || identity.email === "sonishriyash@gmail.com") {
    return true;
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", identity.email))
    .unique();
  
  return user?.role === "admin";
}

export const checkAdmin = query({
  args: {},
  handler: async (ctx) => {
    return await isAdminCheck(ctx);
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
      mentors = mentors?.filter(m => 
        (m.name || "").toLowerCase().includes(s) || 
        (m.college || "").toLowerCase().includes(s) || 
        (m.headline || "").toLowerCase().includes(s) ||
        (m.expertise || "").toLowerCase().includes(s)
      ) || [];
    }

    if (args.skill) {
      mentors = mentors.filter(m => m.skills?.includes(args.skill!));
    }

    return mentors;
  },
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const userId = ctx.db.normalizeId("users", args.id);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});


export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const admin = await isAdminCheck(ctx);
    if (!admin) return [];
    return await ctx.db.query("users").order("desc").collect();
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
