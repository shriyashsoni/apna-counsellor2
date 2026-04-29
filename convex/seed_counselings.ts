import { mutation } from "./_generated/server";

export const seedCounselingsOnly = mutation({
  handler: async (ctx) => {
    const counselings = [
       // Previous list of ~30 counselings
      { name: "JoSAA 2026", category: "Engineering", region: "India", exam: "JEE Main / Advanced", officialUrl: "https://josaa.nic.in", description: "Centralized counselling for IITs, NITs, IIITs, and GFTIs." },
      { name: "CSAB 2026", category: "Engineering", region: "India", exam: "JEE Main", officialUrl: "https://csab.nic.in", description: "Special rounds for NIT+ system seat allocation." },
      { name: "MCC AIQ NEET", category: "Medical", region: "India", exam: "NEET UG", officialUrl: "https://mcc.nic.in", description: "Medical Counselling Committee for 15% All India Quota seats." },
      { name: "MHT-CET Cell (Maharashtra)", category: "Combined", region: "Maharashtra", exam: "MHT-CET", officialUrl: "https://cetcell.mahacet.org", description: "State Common Entrance Test Cell, Maharashtra." },
      { name: "UPTAC (Uttar Pradesh)", category: "Engineering", region: "Uttar Pradesh", exam: "JEE Main", officialUrl: "https://uptac.admissions.nic.in", description: "Technical admission counselling for UP (AKTU)." },
      { name: "KEA (Karnataka)", category: "Combined", region: "Karnataka", exam: "KCET / NEET", officialUrl: "https://kea.kar.nic.in", description: "Karnataka Examinations Authority portal." },
      { name: "WBJEEB (West Bengal)", category: "Engineering", region: "West Bengal", exam: "WBJEE / JEE Main", officialUrl: "https://wbjeeb.nic.in", description: "West Bengal Joint Entrance Examinations Board." },
      { name: "GUJCET (Gujarat)", category: "Engineering", region: "Gujarat", exam: "GUJCET", officialUrl: "https://acpc.gujarat.gov.in", description: "Admission Committee for Professional Courses, Gujarat." },
      { name: "MP DTE (Madhya Pradesh)", category: "Engineering", region: "Madhya Pradesh", exam: "JEE Main", officialUrl: "https://dte.mponline.gov.in", description: "Directorate of Technical Education, MP." },
      { name: "REAP Rajasthan", category: "Engineering", region: "Rajasthan", exam: "JEE Main", officialUrl: "https://reap2024.com", description: "Rajasthan Engineering Admission Process." },
      { name: "OJEE (Odisha)", category: "Combined", region: "Odisha", exam: "OJEE / JEE Main", officialUrl: "https://ojee.nic.in", description: "Odisha Joint Entrance Examination." },
      { name: "CEE Kerala (KEAM)", category: "Combined", region: "Kerala", exam: "KEAM", officialUrl: "https://cee.kerala.gov.in", description: "Commissioner for Entrance Examinations, Kerala." },
      { name: "JCECEB (Jharkhand)", category: "Combined", region: "Jharkhand", exam: "JCECE / JEE Main", officialUrl: "https://jceceb.jharkhand.gov.in", description: "Jharkhand Combined Entrance Competitive Examination Board." },
      { name: "BCECEB (Bihar)", category: "Combined", region: "Bihar", exam: "BCECE", officialUrl: "https://bceceboard.bihar.gov.in", description: "Bihar Combined Entrance Competitive Examination Board." },
      { name: "HSTES (Haryana)", category: "Engineering", region: "Haryana", exam: "JEE Main", officialUrl: "https://hstes.org.in", description: "Haryana State Technical Education Society." },
      { name: "IP University Delhi", category: "Combined", region: "Delhi", exam: "JEE Main / IPU CET", officialUrl: "https://ipu.admissions.nic.in", description: "GGSIPU Admission Portal." },
    ];

    for (const c of counselings) {
      // Just insert without checking to avoid scan limits for now, 
      // or use a more efficient check if needed.
      await ctx.db.insert("counselings", c);
    }

    return `Inserted ${counselings.length} counselings.`;
  },
});
