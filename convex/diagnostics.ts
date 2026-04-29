import { query } from "./_generated/server";

export const getCounts = query({
  handler: async (ctx) => {
    const counselings = await ctx.db.query("counselings").collect();
    const colleges = await ctx.db.query("colleges").collect();
    return {
      counselings: counselings.length,
      colleges: colleges.length
    };
  },
});
