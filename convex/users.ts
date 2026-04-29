import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication identity");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user !== null) {
      if (user.name !== identity.name || user.image !== identity.pictureUrl) {
        await ctx.db.patch(user._id, {
          name: identity.name,
          image: identity.pictureUrl,
        });
      }
      return user._id;
    }

    return await ctx.db.insert("users", {
      name: identity.name || "Anonymous",
      email: identity.email,
      tokenIdentifier: identity.tokenIdentifier,
      image: identity.pictureUrl,
      role: "student", // Default role
      createdAt: new Date().toISOString(),
    });
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
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
