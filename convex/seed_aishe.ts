import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedGeneralDirectory = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("counselings")
      .filter((q) => q.eq(q.field("name"), "Global College Directory"))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("counselings", {
      name: "Global College Directory",
      category: "General",
      region: "Global",
      description: "A comprehensive directory of colleges and universities worldwide.",
    });
  },
});

export const bulkAddColleges = mutation({
  args: {
    colleges: v.array(
      v.object({
        counselingId: v.id("counselings"),
        name: v.string(),
        location: v.optional(v.string()),
        type: v.string(),
        aisheCode: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const college of args.colleges) {
      await ctx.db.insert("colleges", college);
    }
  },
});
