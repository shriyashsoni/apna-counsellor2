import { query } from "./_generated/server";

export const getCounts = query({
  handler: async (ctx) => {
    // AVOID .collect() on large tables like colleges (70k+ records will crash Convex)
    // For now we use a hardcoded or approximate count for display
    const users = await ctx.db.query("users").collect();
    const counselings = await ctx.db.query("counselings").collect();
    const mentors = users.filter(u => u.role === "mentor");
    
    return {
      counselings: counselings.length,
      colleges: 72400, // Hardcoded high-performance count
      users: users.length,
      mentors: mentors.length,
      revenue: 0,
      isApproximate: true
    };
  },
});



