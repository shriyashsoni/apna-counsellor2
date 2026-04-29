import { query } from "./_generated/server";
import { v } from "convex/values";

export const listBatches = query({
  handler: async (ctx) => {
    return await ctx.db.query("batches").collect();
  },
});
