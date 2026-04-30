import { mutation } from "./_generated/server";

export const linkEmailsToProfiles = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let count = 0;
    
    for (const user of users) {
      if (!user.email) continue;
      
      // Try to find a profile that doesn't have an email but belongs to this user's old ID
      // This is tricky because we don't know the old ID.
      // HOWEVER, if the user record itself is the one we want to link...
      
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .unique();
        
      if (profile && !profile.email) {
        await ctx.db.patch(profile._id, { email: user.email });
        count++;
      }
    }
    
    return `Updated ${count} profiles with emails.`;
  },
});
