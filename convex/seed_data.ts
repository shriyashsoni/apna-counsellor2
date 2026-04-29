import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// This mutation can be run manually to seed the database with core counselling and college data.
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Seed Counselings
    const counselings = [
      { name: "JoSAA (Joint Seat Allocation Authority)", category: "Engineering", region: "National", exam: "JEE Main / Advanced", officialUrl: "https://josaa.nic.in", description: "Centralized counselling for IITs, NITs, IIITs, and GFTIs." },
      { name: "CSAB (Central Seat Allocation Board)", category: "Engineering", region: "National", exam: "JEE Main", officialUrl: "https://csab.nic.in", description: "Special rounds for NIT+ system and CSAB NEUT/Supernumerary rounds." },
      { name: "MCC (Medical Counselling Committee)", category: "Medical", region: "National", exam: "NEET UG", officialUrl: "https://mcc.nic.in", description: "All India Quota (15%) for MBBS/BDS and 100% for Deemed/Central Universities." },
      { name: "MHT-CET CAP (Maharashtra)", category: "Engineering", region: "State", exam: "MHT-CET / JEE Main", officialUrl: "https://cetcell.mahacet.org", description: "Centralized Admission Process for engineering colleges in Maharashtra." },
      { name: "JAC Delhi (Joint Admission Committee)", category: "Engineering", region: "State", exam: "JEE Main", officialUrl: "https://jacdelhi.admissions.nic.in", description: "Admissions to DTU, NSUT, IGDTUW, IIIT-D, and DSEU." },
      { name: "MP DTE (Madhya Pradesh)", category: "Engineering", region: "State", exam: "JEE Main", officialUrl: "https://dte.mponline.gov.in", description: "Technical education admission portal for Madhya Pradesh." },
      { name: "TNEA (Tamil Nadu Engineering Admissions)", category: "Engineering", region: "State", exam: "12th Marks", officialUrl: "https://www.tneaonline.org", description: "Counselling for engineering colleges in Tamil Nadu." },
      { name: "WBJEE (West Bengal Joint Entrance)", category: "Engineering", region: "State", exam: "WBJEE / JEE Main", officialUrl: "https://wbjeeb.nic.in", description: "Engineering admissions in West Bengal." },
      { name: "KCET (Karnataka CET)", category: "Engineering", region: "State", exam: "KCET", officialUrl: "https://kea.kar.nic.in", description: "Karnataka Examinations Authority for state engineering seats." },
      { name: "COMEDK UGET", category: "Engineering", region: "Private", exam: "COMEDK UGET", officialUrl: "https://www.comedk.org", description: "Consortium of Medical, Engineering and Dental Colleges of Karnataka." },
      { name: "GUJCET (Gujarat)", category: "Engineering", region: "State", exam: "GUJCET", officialUrl: "https://acpc.gujarat.gov.in", description: "Admission Committee for Professional Courses, Gujarat." },
      { name: "OJEE (Odisha)", category: "Engineering", region: "State", exam: "OJEE / JEE Main", officialUrl: "https://ojee.nic.in", description: "Odisha Joint Entrance Examination counselling." },
      { name: "KEAM (Kerala)", category: "Engineering", region: "State", exam: "KEAM", officialUrl: "https://cee.kerala.gov.in", description: "Commissioner for Entrance Examinations, Kerala." },
      { name: "HSTES (Haryana)", category: "Engineering", region: "State", exam: "JEE Main", officialUrl: "https://hstes.org.in", description: "Haryana State Technical Education Society." },
      { name: "REAP (Rajasthan)", category: "Engineering", region: "State", exam: "JEE Main / 12th", officialUrl: "https://cegreap2024.com", description: "Rajasthan Engineering Admission Process." },
      { name: "JAC Chandigarh", category: "Engineering", region: "State", exam: "JEE Main", officialUrl: "https://chdjtac.admissions.nic.in", description: "Admissions to PEC, UIET, CCET, and AITH." },
      { name: "GGSIPU (IP University)", category: "Engineering", region: "State", exam: "JEE Main / IPU CET", officialUrl: "https://ipu.admissions.nic.in", description: "Guru Gobind Singh Indraprastha University admissions." },
      { name: "UPTAC (Uttar Pradesh)", category: "Engineering", region: "State", exam: "JEE Main / CUET", officialUrl: "https://uptac.admissions.nic.in", description: "Uttar Pradesh Technical Admission Counselling (AKTU)." },
      { name: "AYUSH (AACCC)", category: "Medical", region: "National", exam: "NEET UG", officialUrl: "https://aaccc.gov.in", description: "Counselling for BAMS, BUMS, BSMS, and BHMS courses." },
      { name: "VCI (Veterinary)", category: "Medical", region: "National", exam: "NEET UG", officialUrl: "https://vci.admissions.nic.in", description: "Counselling for B.V.Sc. & A.H. courses." },
    ];

    for (const c of counselings) {
      const existing = await ctx.db.query("counselings").withSearchIndex("by_name", (q) => q.search("name", c.name)).collect();
      if (existing.length === 0) {
        await ctx.db.insert("counselings", c);
      }
    }

    // 2. Seed Top Colleges
    const colleges = [
      { name: "Indian Institute of Technology, Bombay (IITB)", state: "Maharashtra", city: "Mumbai", type: "IIT", nirfRank: 1, website: "https://www.iitb.ac.in", description: "Premier engineering institute in India." },
      { name: "Indian Institute of Technology, Delhi (IITD)", state: "Delhi", city: "New Delhi", type: "IIT", nirfRank: 2, website: "https://home.iitd.ac.in", description: "Top-tier research and engineering institution." },
      { name: "Indian Institute of Technology, Madras (IITM)", state: "Tamil Nadu", city: "Chennai", type: "IIT", nirfRank: 3, website: "https://www.iitm.ac.in", description: "Consistent NIRF #1 in Engineering." },
      { name: "National Institute of Technology, Trichy", state: "Tamil Nadu", city: "Tiruchirappalli", type: "NIT", nirfRank: 9, website: "https://www.nitt.edu", description: "Best performing NIT in India." },
      { name: "National Institute of Technology, Surathkal", state: "Karnataka", city: "Mangalore", type: "NIT", nirfRank: 12, website: "https://www.nitk.ac.in", description: "Top NIT with excellent placement records." },
      { name: "COEP Technological University", state: "Maharashtra", city: "Pune", type: "Government", website: "https://www.coep.org.in", description: "One of the oldest and most prestigious engineering colleges." },
      { name: "VJTI Mumbai", state: "Maharashtra", city: "Mumbai", type: "Government", website: "https://vjti.ac.in", description: "Top choice for MHT-CET students." },
      { name: "BITS Pilani", state: "Rajasthan", city: "Pilani", type: "Private", website: "https://www.bits-pilani.ac.in", description: "Premier private engineering university." },
      { name: "VIT Vellore", state: "Tamil Nadu", city: "Vellore", type: "Private", website: "https://vit.ac.in", description: "Top ranked private institution with global outlook." },
      { name: "Manipal Institute of Technology", state: "Karnataka", city: "Manipal", type: "Private", website: "https://manipal.edu/mit.html", description: "Renowned for campus life and placements." },
      { name: "DTU (Delhi Technological University)", state: "Delhi", city: "New Delhi", type: "State Government", website: "http://dtu.ac.in", description: "Formerly DCE, a top choice via JAC Delhi." },
      { name: "NSUT (Netaji Subhas University of Technology)", state: "Delhi", city: "New Delhi", type: "State Government", website: "http://www.nsut.ac.in", description: "Top-tier university in New Delhi." },
      { name: "Jadavpur University", state: "West Bengal", city: "Kolkata", type: "State Government", website: "http://www.jaduniv.edu.in", description: "Best ROI engineering college in India." },
      { name: "HBTU Kanpur", state: "Uttar Pradesh", city: "Kanpur", type: "State Government", website: "https://hbtu.ac.in", description: "Legacy institution in Uttar Pradesh." },
      { name: "ICT Mumbai", state: "Maharashtra", city: "Mumbai", type: "Government", website: "https://www.ictmumbai.edu.in", description: "Global leader in Chemical Engineering research." },
    ];

    for (const col of colleges) {
       const existing = await ctx.db.query("colleges").withSearchIndex("by_name", (q) => q.search("name", col.name)).collect();
       if (existing.length === 0) {
         await ctx.db.insert("colleges", col);
       }
    }

    return "Seed data successfully added to the database!";
  },
});
