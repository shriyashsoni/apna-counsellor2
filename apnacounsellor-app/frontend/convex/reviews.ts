import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByMentor = query({
  args: { mentorId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_mentor", (q) => q.eq("mentorId", args.mentorId))
      .order("desc")
      .take(50);
  },
});

export const createReview = mutation({
  args: {
    reviewId: v.string(),
    mentorId: v.string(),
    sessionId: v.optional(v.string()),
    reviewerId: v.string(),
    reviewerName: v.string(),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already reviewed
    const existing = await ctx.db
      .query("reviews")
      .withIndex("by_reviewer", (q) => q.eq("reviewerId", args.reviewerId))
      .filter((q) => q.eq(q.field("mentorId"), args.mentorId))
      .first();
    if (existing) throw new Error("Already reviewed");
    return await ctx.db.insert("reviews", args);
  },
});
