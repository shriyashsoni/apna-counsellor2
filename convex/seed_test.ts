import { mutation } from "./_generated/server";

export const seedTestCollege = mutation({
  args: {},
  handler: async (ctx) => {
    await ctx.db.insert("colleges", {
      name: "TEST_COLLEGE_PROD",
      shortName: "TCP",
      state: "Maharashtra",
      city: "Mumbai",
      type: "Government",
      nirfRank: 1,
    });
    return "Seed complete";
  },
});
