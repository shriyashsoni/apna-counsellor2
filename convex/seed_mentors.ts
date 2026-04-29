import { mutation } from "./_generated/server";

export const seedMentors = mutation({
  handler: async (ctx) => {
    // 1. Create Mentors
    const m1 = await ctx.db.insert("mentors", {
      name: "Dr. Aditya Sharma",
      expertise: "IIT & NIT Admissions",
      bio: "Former admission committee member with 10+ years experience.",
      rating: 4.9,
    });

    const m2 = await ctx.db.insert("mentors", {
      name: "Er. Sneha Kapoor",
      expertise: "Medical (NEET UG) Specialist",
      bio: "Helped 500+ students secure seats in top AIIMS and State Medical Colleges.",
      rating: 4.8,
    });

    // 2. Post Sample Sessions
    await ctx.db.insert("sessions", {
      mentorId: m1,
      title: "JoSAA Strategy 2026",
      description: "How to rank your choices for the best seat allocation.",
      date: "2026-06-10T10:00:00Z",
      price: 999,
      availableSlots: 20,
    });

    await ctx.db.insert("sessions", {
      mentorId: m2,
      title: "NEET Document Verification Guide",
      description: "Everything you need for a smooth physical verification process.",
      date: "2026-07-05T15:00:00Z",
      price: 499,
      availableSlots: 50,
    });

    return "Sample mentors and sessions seeded!";
  },
});
