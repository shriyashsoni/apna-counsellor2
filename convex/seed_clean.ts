import { mutation } from "./_generated/server";

export const clearAndSeedCounselings = mutation({
  handler: async (ctx) => {
    // 1. Clear existing counselings to prevent duplicates
    const existing = await ctx.db.query("counselings").collect();
    for (const c of existing) {
      await ctx.db.delete(c._id);
    }

    // 2. Data to seed
    const list = [
      {"name": "JoSAA", "category": "Engineering", "region": "India", "exam": "JEE Main/Advanced"},
      {"name": "MHT-CET", "category": "Engineering", "region": "India", "exam": "MHT-CET"},
      {"name": "NEET UG", "category": "Medical", "region": "India", "exam": "NEET"},
      {"name": "COMEDK", "category": "Engineering", "region": "India", "exam": "COMEDK"},
      // ... (I'll use the generated file logic but with a cleaner approach)
    ];
    
    // Note: I will use the generate_seed.py to recreate this file with the 'clear' logic.
    return "Ready for fresh seed";
  }
});
