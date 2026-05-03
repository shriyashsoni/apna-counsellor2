import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    // Initialize new user with default role if missing
    if (!user.role) {
      await ctx.db.patch(userId, { 
        role: "student",
        createdAt: new Date().toISOString(),
      });
    }

    return userId;
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    // Strict Admin Enforcement
    const isAdmin = user.email === "apnacounsellor@gmail.com" || 
                    user.email === "sonishriyash@gmail.com" || 
                    user.role === "admin";
    
    return { ...user, isAdmin };
  },
});

// Helper function for internal checks
async function isAdminCheck(ctx: any) {
  const userId = await auth.getUserId(ctx);
  if (!userId) return false;

  const user = await ctx.db.get(userId);
  if (!user) return false;
  
  return (
    user.email === "apnacounsellor@gmail.com" || 
    user.email === "sonishriyash@gmail.com" || 
    user.role === "admin"
  );
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
