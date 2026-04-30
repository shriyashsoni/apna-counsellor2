import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Sync Counselings: Imports the list of counselings from a provided list.
 * This should be called with the 100+ counseling IDs found in the data folders.
 */
export const syncCounselings = mutation({
  args: {
    counselingList: v.array(v.object({
      id: v.string(),
      name: v.string(),
      category: v.string(),
      region: v.string(),
      exam: v.optional(v.string())
    }))
  },
  handler: async (ctx, args) => {
    let created = 0;
    for (const item of args.counselingList) {
      const existing = await ctx.db
        .query("counselings")
        .filter(q => q.eq(q.field("name"), item.name))
        .unique();
      
      if (!existing) {
        await ctx.db.insert("counselings", {
          name: item.name,
          category: item.category || "Engineering",
          region: item.region || "India",
          exam: item.exam || item.name
        });
        created++;
      }
    }
    return `Synced ${args.counselingList.length} counselings. Created ${created} new ones.`;
  }
});
