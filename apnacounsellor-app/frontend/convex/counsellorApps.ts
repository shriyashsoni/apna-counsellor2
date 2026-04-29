import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let apps = await ctx.db.query("counsellorApps").collect();
    if (args.status) {
      apps = apps.filter((a) => a.status === args.status);
    }
    return apps.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
});

export const create = mutation({
  args: {
    appId: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    qualification: v.string(),
    experience: v.string(),
    specialization: v.array(v.string()),
    bio: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("counsellorApps")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existing) throw new Error("Already applied");
    return await ctx.db.insert("counsellorApps", { ...args, status: "pending" });
  },
});

export const updateStatus = mutation({
  args: { appId: v.string(), status: v.string() },
  handler: async (ctx, args) => {
    const app = await ctx.db
      .query("counsellorApps")
      .withIndex("by_app_id", (q) => q.eq("appId", args.appId))
      .first();
    if (!app) throw new Error("Not found");
    await ctx.db.patch(app._id, { status: args.status });
  },
});

export const pendingCount = query({
  args: {},
  handler: async (ctx) => {
    const apps = await ctx.db.query("counsellorApps").collect();
    return apps.filter((a) => a.status === "pending").length;
  },
});
