import { query } from "./_generated/server";

export const getCounts = query({
  handler: async (ctx) => {
    const counselings = await ctx.db.query("counselings").take(100);
    const colleges = await ctx.db.query("colleges").take(100);
    const users = await ctx.db.query("users").take(1000);
    const mentors = await ctx.db.query("users").withIndex("by_role", q => q.eq("role", "mentor")).take(500);
    const payments = await ctx.db.query("payments").take(500);

    const revenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    
    return {
      counselings: counselings.length,
      colleges: colleges.length,
      users: users.length,
      mentors: mentors.length,
      revenue,
      isApproximate: true
    };
  },
});


