import { query } from "./_generated/server";

export const getCounts = query({
  handler: async (ctx) => {
    // Instead of collect() which scans the whole DB, we use a limited take(1000)
    // for stats to stay within platform limits.
    const counselings = await ctx.db.query("counselings").take(100);
    const colleges = await ctx.db.query("colleges").take(100);
    
    return {
      counselings: counselings.length,
      colleges: colleges.length,
      isApproximate: true
    };
  },
});

