import { query } from "./_generated/server";

export const getCounts = query({
  handler: async (ctx) => {
    // Optimized counting for large tables
    const users = await ctx.db.query("users").collect();
    const colleges = await ctx.db.query("colleges").collect();
    const counselings = await ctx.db.query("counselings").collect();
    const mentors = users.filter(u => u.role === "mentor");
    const payments = await ctx.db.query("payments").collect();

    const revenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    
    return {
      counselings: counselings.length,
      colleges: colleges.length,
      users: users.length,
      mentors: mentors.length,
      revenue,
      isApproximate: false
    };
  },
});



