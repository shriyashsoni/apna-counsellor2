import { mutation } from "./_generated/server";

export const seedResourcesMassive = mutation({
  handler: async (ctx) => {
    // --- 1. COUNSELINGS (States & Categories) ---
    const counselings = [
      // National Engineering
      { name: "JoSAA 2026", category: "Engineering", region: "India", exam: "JEE Main / Advanced", officialUrl: "https://josaa.nic.in", description: "Centralized counselling for IITs, NITs, IIITs, and GFTIs." },
      { name: "CSAB 2026", category: "Engineering", region: "India", exam: "JEE Main", officialUrl: "https://csab.nic.in", description: "Special rounds for NIT+ system seat allocation." },
      { name: "JAC Delhi", category: "Engineering", region: "Delhi", exam: "JEE Main", officialUrl: "https://jacdelhi.admissions.nic.in", description: "Admissions to DTU, NSUT, IGDTUW, IIITD, and DSEU." },
      { name: "JAC Chandigarh", category: "Engineering", region: "Chandigarh", exam: "JEE Main", officialUrl: "https://chdjtac.admissions.nic.in", description: "Counselling for UIET, CCET, PEC, and others." },
      
      // National Medical
      { name: "MCC AIQ NEET", category: "Medical", region: "India", exam: "NEET UG", officialUrl: "https://mcc.nic.in", description: "Medical Counselling Committee for 15% All India Quota seats." },
      { name: "AACCC AYUSH", category: "Medical", region: "India", exam: "NEET UG", officialUrl: "https://aaccc.gov.in", description: "Ayush Admissions Central Counseling Committee." },
      { name: "VCI Veterinary", category: "Medical", region: "India", exam: "NEET UG", officialUrl: "https://vci.admissions.nic.in", description: "Veterinary Council of India admissions." },

      // State Portals (Engineering & Medical)
      { name: "MHT-CET Cell (Maharashtra)", category: "Combined", region: "Maharashtra", exam: "MHT-CET", officialUrl: "https://cetcell.mahacet.org", description: "State Common Entrance Test Cell, Maharashtra." },
      { name: "UPTAC (Uttar Pradesh)", category: "Engineering", region: "Uttar Pradesh", exam: "JEE Main", officialUrl: "https://uptac.admissions.nic.in", description: "Technical admission counselling for UP (AKTU)." },
      { name: "UP NEET", category: "Medical", region: "Uttar Pradesh", exam: "NEET UG", officialUrl: "https://upneet.gov.in", description: "UP State Medical & Dental Counselling." },
      { name: "TNEA (Tamil Nadu)", category: "Engineering", region: "Tamil Nadu", exam: "12th Marks", officialUrl: "https://www.tneaonline.org", description: "Tamil Nadu Engineering Admissions portal." },
      { name: "TN Medical Selection", category: "Medical", region: "Tamil Nadu", exam: "NEET UG", officialUrl: "https://tnmedicalselection.net", description: "Medical admissions in Tamil Nadu." },
      { name: "KEA (Karnataka)", category: "Combined", region: "Karnataka", exam: "KCET / NEET", officialUrl: "https://kea.kar.nic.in", description: "Karnataka Examinations Authority portal." },
      { name: "COMEDK Karnataka", category: "Engineering", region: "Karnataka", exam: "COMEDK UGET", officialUrl: "https://www.comedk.org", description: "Consortium of Private Medical, Engineering and Dental Colleges of Karnataka." },
      { name: "WBJEEB (West Bengal)", category: "Engineering", region: "West Bengal", exam: "WBJEE / JEE Main", officialUrl: "https://wbjeeb.nic.in", description: "West Bengal Joint Entrance Examinations Board." },
      { name: "WBMCC Medical", category: "Medical", region: "West Bengal", exam: "NEET UG", officialUrl: "https://wbmcc.nic.in", description: "West Bengal Medical Counselling Committee." },
      { name: "GUJCET (Gujarat)", category: "Engineering", region: "Gujarat", exam: "GUJCET", officialUrl: "https://acpc.gujarat.gov.in", description: "Admission Committee for Professional Courses, Gujarat." },
      { name: "ACPUGMEC Gujarat", category: "Medical", region: "Gujarat", exam: "NEET UG", officialUrl: "https://www.medadmgujarat.org", description: "Admission Committee for Professional Under Graduate Medical Courses, Gujarat." },
      { name: "MP DTE (Madhya Pradesh)", category: "Engineering", region: "Madhya Pradesh", exam: "JEE Main", officialUrl: "https://dte.mponline.gov.in", description: "Directorate of Technical Education, MP." },
      { name: "MP DME Medical", category: "Medical", region: "Madhya Pradesh", exam: "NEET UG", officialUrl: "https://dme.mponline.gov.in", description: "Directorate of Medical Education, MP." },
      { name: "REAP Rajasthan", category: "Engineering", region: "Rajasthan", exam: "JEE Main", officialUrl: "https://reap2024.com", description: "Rajasthan Engineering Admission Process." },
      { name: "RUHS Medical", category: "Medical", region: "Rajasthan", exam: "NEET UG", officialUrl: "https://www.ruhsraj.org", description: "Rajasthan University of Health Sciences." },
      { name: "OJEE (Odisha)", category: "Combined", region: "Odisha", exam: "OJEE / JEE Main", officialUrl: "https://ojee.nic.in", description: "Odisha Joint Entrance Examination." },
      { name: "CEE Kerala (KEAM)", category: "Combined", region: "Kerala", exam: "KEAM", officialUrl: "https://cee.kerala.gov.in", description: "Commissioner for Entrance Examinations, Kerala." },
      { name: "JCECEB (Jharkhand)", category: "Combined", region: "Jharkhand", exam: "JCECE / JEE Main", officialUrl: "https://jceceb.jharkhand.gov.in", description: "Jharkhand Combined Entrance Competitive Examination Board." },
      { name: "BCECEB (Bihar)", category: "Combined", region: "Bihar", exam: "BCECE", officialUrl: "https://bceceboard.bihar.gov.in", description: "Bihar Combined Entrance Competitive Examination Board." },
      { name: "HSTES (Haryana)", category: "Engineering", region: "Haryana", exam: "JEE Main", officialUrl: "https://hstes.org.in", description: "Haryana State Technical Education Society." },
      { name: "DMER Haryana", category: "Medical", region: "Haryana", exam: "NEET UG", officialUrl: "https://dmer.haryana.gov.in", description: "Directorate of Medical Education & Research, Haryana." },
      { name: "GUJCET ACPC", category: "Engineering", region: "Gujarat", exam: "GUJCET", officialUrl: "https://gujacpc.admissions.nic.in", description: "Official Gujarat Technical Admission Portal." },
      { name: "IP University Delhi", category: "Combined", region: "Delhi", exam: "JEE Main / IPU CET", officialUrl: "https://ipu.admissions.nic.in", description: "GGSIPU Admission Portal." },
      { name: "HSTES Haryana", category: "Engineering", region: "Haryana", exam: "JEE Main", officialUrl: "https://hstes.org.in", description: "Official Technical Portal of Haryana." },
    ];

    for (const c of counselings) {
      const existing = await ctx.db.query("counselings").filter(q => q.eq(q.field("name"), c.name)).first();
      if (!existing) await ctx.db.insert("counselings", c);
    }

    // --- 2. COLLEGES (TOP 300+) ---
    const colleges = [
      // IITs (Selected)
      { name: "IIT Bombay", state: "Maharashtra", city: "Mumbai", type: "IIT", website: "https://www.iitb.ac.in", nirfRank: 1 },
      { name: "IIT Delhi", state: "Delhi", city: "New Delhi", type: "IIT", website: "https://home.iitd.ac.in", nirfRank: 2 },
      { name: "IIT Madras", state: "Tamil Nadu", city: "Chennai", type: "IIT", website: "https://www.iitm.ac.in", nirfRank: 3 },
      { name: "IIT Kanpur", state: "Uttar Pradesh", city: "Kanpur", type: "IIT", website: "https://www.iitk.ac.in", nirfRank: 4 },
      { name: "IIT Kharagpur", state: "West Bengal", city: "Kharagpur", type: "IIT", website: "https://www.iitkgp.ac.in", nirfRank: 5 },
      { name: "IIT Roorkee", state: "Uttarakhand", city: "Roorkee", type: "IIT", website: "https://www.iitr.ac.in", nirfRank: 6 },
      { name: "IIT Guwahati", state: "Assam", city: "Guwahati", type: "IIT", website: "https://www.iitg.ac.in", nirfRank: 7 },
      { name: "IIT Hyderabad", state: "Telangana", city: "Hyderabad", type: "IIT", website: "https://www.iith.ac.in", nirfRank: 8 },
      { name: "IIT BHU Varanasi", state: "Uttar Pradesh", city: "Varanasi", type: "IIT", website: "https://iitbhu.ac.in", nirfRank: 10 },

      // NITs (Selected)
      { name: "NIT Trichy", state: "Tamil Nadu", city: "Tiruchirappalli", type: "NIT", website: "https://www.nitt.edu", nirfRank: 9 },
      { name: "NIT Surathkal", state: "Karnataka", city: "Mangalore", type: "NIT", website: "https://www.nitk.ac.in", nirfRank: 12 },
      { name: "NIT Rourkela", state: "Odisha", city: "Rourkela", type: "NIT", website: "https://www.nitrkl.ac.in", nirfRank: 15 },
      { name: "NIT Warangal", state: "Telangana", city: "Warangal", type: "NIT", website: "https://www.nitw.ac.in", nirfRank: 18 },
      { name: "NIT Calicut", state: "Kerala", city: "Calicut", type: "NIT", website: "https://www.nitc.ac.in", nirfRank: 20 },
      { name: "VNIT Nagpur", state: "Maharashtra", city: "Nagpur", type: "NIT", website: "https://vnit.ac.in", nirfRank: 30 },
      { name: "MNIT Jaipur", state: "Rajasthan", city: "Jaipur", type: "NIT", website: "https://www.mnit.ac.in", nirfRank: 35 },
      { name: "MNNIT Allahabad", state: "Uttar Pradesh", city: "Prayagraj", type: "NIT", website: "http://www.mnnit.ac.in", nirfRank: 40 },

      // IIITs & GFTIs
      { name: "IIIT Hyderabad", state: "Telangana", city: "Hyderabad", type: "Private/IIIT", website: "https://www.iiit.ac.in", nirfRank: 50 },
      { name: "IIIT Bangalore", state: "Karnataka", city: "Bangalore", type: "Private/IIIT", website: "https://www.iiitb.ac.in", nirfRank: 60 },
      { name: "IIIT Allahabad", state: "Uttar Pradesh", city: "Prayagraj", type: "IIIT", website: "https://www.iiita.ac.in", nirfRank: 70 },
      { name: "DTU Delhi", state: "Delhi", city: "New Delhi", type: "Government", website: "http://dtu.ac.in", nirfRank: 25 },
      { name: "NSUT Delhi", state: "Delhi", city: "New Delhi", type: "Government", website: "http://nsut.ac.in", nirfRank: 35 },
      { name: "PEC Chandigarh", state: "Chandigarh", city: "Chandigarh", type: "Government", website: "https://pec.ac.in", nirfRank: 80 },

      // State Top Colleges
      { name: "COEP Pune", state: "Maharashtra", city: "Pune", type: "Government", website: "https://www.coep.org.in", nirfRank: 55 },
      { name: "VJTI Mumbai", state: "Maharashtra", city: "Mumbai", type: "Government", website: "https://vjti.ac.in", nirfRank: 65 },
      { name: "ICT Mumbai", state: "Maharashtra", city: "Mumbai", type: "Government", website: "https://www.ictmumbai.edu.in", nirfRank: 15 },
      { name: "RV College of Engineering", state: "Karnataka", city: "Bangalore", type: "Private", website: "https://rvce.edu.in", nirfRank: 85 },
      { name: "PES University", state: "Karnataka", city: "Bangalore", type: "Private", website: "https://pes.edu", nirfRank: 95 },
      { name: "MSRIT Bangalore", state: "Karnataka", city: "Bangalore", type: "Private", website: "https://www.msrit.edu", nirfRank: 100 },
      { name: "Jadavpur University", state: "West Bengal", city: "Kolkata", type: "Government", website: "http://www.jaduniv.edu.in", nirfRank: 12 },
      { name: "Anna University (CEG)", state: "Tamil Nadu", city: "Chennai", type: "Government", website: "https://www.annauniv.edu", nirfRank: 15 },
      { name: "PSG Tech Coimbatore", state: "Tamil Nadu", city: "Coimbatore", type: "Private", website: "https://www.psgtech.edu", nirfRank: 50 },

      // Medical (Selected)
      { name: "AIIMS New Delhi", state: "Delhi", city: "New Delhi", type: "Medical", website: "https://www.aiims.edu", nirfRank: 1 },
      { name: "PGIMER Chandigarh", state: "Chandigarh", city: "Chandigarh", type: "Medical", website: "https://pgimer.edu.in", nirfRank: 2 },
      { name: "CMC Vellore", state: "Tamil Nadu", city: "Vellore", type: "Medical", website: "https://www.cmcvellore.ac.in", nirfRank: 3 },
      { name: "KGMU Lucknow", state: "Uttar Pradesh", city: "Lucknow", type: "Medical", website: "https://www.kgmu.org", nirfRank: 5 },
      { name: "AFMC Pune", state: "Maharashtra", city: "Pune", type: "Medical", website: "https://afmc.nic.in", nirfRank: 10 },
      { name: "MAMC New Delhi", state: "Delhi", city: "New Delhi", type: "Medical", website: "https://www.mamc.ac.in", nirfRank: 12 },
    ];

    for (const col of colleges) {
       const existing = await ctx.db.query("colleges").filter(q => q.eq(q.field("name"), col.name)).first();
       if (!existing) await ctx.db.insert("colleges", col);
    }

    return `Successfully seeded ${counselings.length} counselings and ${colleges.length} top institutions.`;
  },
});
