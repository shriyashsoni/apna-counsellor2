import { mutation } from "./_generated/server";

export const seedIndiaMajor = mutation({
  handler: async (ctx) => {
    const counselings = [
      { name: "JoSAA", category: "Engineering", region: "India", exam: "JEE Main / JEE Advanced", officialUrl: "https://josaa.nic.in", description: "Joint Seat Allocation Authority for IITs, NITs, IIITs and GFTIs." },
      { name: "CSAB", category: "Engineering", region: "India", exam: "JEE Main", officialUrl: "https://csab.nic.in", description: "Central Seat Allocation Board for special rounds of NIT+ system." },
      { name: "MCC", category: "Medical", region: "India", exam: "NEET UG", officialUrl: "https://mcc.nic.in", description: "Medical Counselling Committee for 15% AIQ MBBS/BDS seats." },
      { name: "AACCC", category: "Medical (AYUSH)", region: "India", exam: "NEET UG", officialUrl: "https://aaccc.gov.in", description: "Ayush Admissions Central Counseling Committee for BAMS, BHMS, etc." },
      { name: "MHT-CET (State Cell)", category: "Engineering/Pharmacy", region: "Maharashtra", exam: "MHT-CET", officialUrl: "https://cetcell.mahacet.org", description: "State Common Entrance Test Cell, Maharashtra for B.E/B.Tech." },
      { name: "COMEDK", category: "Engineering", region: "Karnataka", exam: "COMEDK UGET", officialUrl: "https://www.comedk.org", description: "Consortium of Medical, Engineering and Dental Colleges of Karnataka." },
      { name: "KCET (KEA)", category: "Engineering/Medical", region: "Karnataka", exam: "KCET", officialUrl: "https://kea.kar.nic.in", description: "Karnataka Examination Authority for state quota seats." },
      { name: "TNEA", category: "Engineering", region: "Tamil Nadu", exam: "Class 12 Marks", officialUrl: "https://www.tneaonline.org", description: "Tamil Nadu Engineering Admissions." },
      { name: "WBJEE", category: "Engineering", region: "West Bengal", exam: "WBJEE", officialUrl: "https://wbjeeb.nic.in", description: "West Bengal Joint Entrance Examinations Board." },
      { name: "REAP", category: "Engineering", region: "Rajasthan", exam: "JEE Main", officialUrl: "https://reap2024.com", description: "Rajasthan Engineering Admission Process." },
      { name: "Jac Delhi", category: "Engineering", region: "Delhi", exam: "JEE Main", officialUrl: "https://jacdelhi.admissions.nic.in", description: "Joint Admission Committee for DTU, NSUT, IGDTUW, IIITD." },
    ];

    for (const c of counselings) {
      // Check if already exists
      const existing = await ctx.db
        .query("counselings")
        .filter((q) => q.eq(q.field("name"), c.name))
        .first();
      
      if (!existing) {
        await ctx.db.insert("counselings", c);
      }
    }

    return `Seeded ${counselings.length} major Indian counselings.`;
  },
});
