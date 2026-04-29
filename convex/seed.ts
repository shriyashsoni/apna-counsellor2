import { mutation } from "./_generated/server";
import { api } from "./_generated/api";

export const runAllSeeds = mutation({
  handler: async (ctx) => {
    console.log("Starting master seed process...");
    
    // We can't call other mutations directly from a mutation easily with 'ctx' 
    // but we can import the logic or just run them sequentially here if we refactor.
    // For now, let's just trigger the ones we have.
    
    return "Please run individual seed mutations via: npx convex run seed_india_major, etc.";
  },
});
