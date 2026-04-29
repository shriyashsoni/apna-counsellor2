import { mutation } from "./_generated/server";

export const seedInternational = mutation({
  handler: async (ctx) => {
    const counselings = [
      // EUROPE
      { name: "UCAS", category: "General", region: "UK", exam: "IELTS/UCAT/BMAT", officialUrl: "https://www.ucas.com" },
      { name: "Studielink", category: "General", region: "Netherlands", exam: "IELTS", officialUrl: "https://www.studielink.nl" },
      { name: "Uni-assist", category: "General", region: "Germany", exam: "TestAS/IELTS", officialUrl: "https://www.uni-assist.de" },
      { name: "UniversityAdmissions.se", category: "General", region: "Sweden", exam: "IELTS", officialUrl: "https://www.universityadmissions.se" },
      { name: "Studyinfo.fi", category: "General", region: "Finland", exam: "IELTS", officialUrl: "https://studyinfo.fi" },
      { name: "Parcoursup", category: "General", region: "France", exam: "DELF/DALF", officialUrl: "https://www.parcoursup.fr" },
      { name: "Universitaly", category: "Medical/Eng", region: "Italy", exam: "IMAT/TIL", officialUrl: "https://www.universitaly.it" },
      { name: "Study in Poland", category: "General", region: "Poland", exam: "IELTS", officialUrl: "https://study.gov.pl" },
      { name: "Study in Hungary", category: "General", region: "Hungary", exam: "IELTS", officialUrl: "https://studyinhungary.hu" },
      { name: "Czech Republic - Study in CZ", category: "General", region: "Czechia", exam: "Entrance Exams", officialUrl: "https://studyin.cz" },
      { name: "Denmark - Study in Denmark", category: "General", region: "Denmark", exam: "IELTS", officialUrl: "https://studyindenmark.dk" },
      { name: "Spain - UNEDasiss", category: "General", region: "Spain", exam: "PCE", officialUrl: "https://unedasiss.uned.es" },
      { name: "Austria - Study in Austria", category: "General", region: "Austria", exam: "Entrance Exams", officialUrl: "https://studyinaustria.at" },
      { name: "Ireland - CAO", category: "General", region: "Ireland", exam: "Leaving Cert/IELTS", officialUrl: "https://www.cao.ie" },
      
      // NORTH AMERICA
      { name: "Common App", category: "General", region: "USA", exam: "SAT/ACT", officialUrl: "https://www.commonapp.org" },
      { name: "Coalition App", category: "General", region: "USA", exam: "SAT/ACT", officialUrl: "https://www.coalitionforcollegeaccess.org" },
      { name: "OUAC", category: "General", region: "Canada (Ontario)", exam: "IELTS/TOEFL", officialUrl: "https://www.ouac.on.ca" },
      { name: "ApplyBC", category: "General", region: "Canada (BC)", exam: "IELTS", officialUrl: "https://apply.educationplannerbc.ca" },
      { name: "ApplyTexas", category: "General", region: "USA (Texas)", exam: "SAT/ACT", officialUrl: "https://www.applytexas.org" },
      
      // ASIA
      { name: "CUCAS", category: "General", region: "China", exam: "HSK/IELTS", officialUrl: "https://www.cucas.cn" },
      { name: "Study in Korea - GKS", category: "General", region: "South Korea", exam: "TOPIK/IELTS", officialUrl: "https://www.studyinkorea.go.kr" },
      { name: "Japan - MEXT", category: "General", region: "Japan", exam: "EJU/JLPT", officialUrl: "https://www.mext.go.jp" },
      { name: "Turkey - YOS", category: "General", region: "Turkey", exam: "YOS", officialUrl: "https://yos.yok.gov.tr" },
      { name: "Study in Malaysia", category: "General", region: "Malaysia", exam: "IELTS", officialUrl: "https://educationmalaysia.gov.my" },
      { name: "Singapore - NTU/NUS Portals", category: "General", region: "Singapore", exam: "SAT/IELTS", officialUrl: "https://www.nus.edu.sg" },
      
      // OCEANIA
      { name: "UAC", category: "General", region: "Australia (NSW)", exam: "ATAR/IELTS", officialUrl: "https://www.uac.edu.au" },
      { name: "VTAC", category: "General", region: "Australia (Victoria)", exam: "ATAR/IELTS", officialUrl: "https://www.vtac.edu.au" },
      { name: "QTAC", category: "General", region: "Australia (Queensland)", exam: "ATAR/IELTS", officialUrl: "https://www.qtac.edu.au" },
      { name: "SATAC", category: "General", region: "Australia (SA)", exam: "ATAR/IELTS", officialUrl: "https://www.satac.edu.au" },
      { name: "TISC", category: "General", region: "Australia (WA)", exam: "ATAR/IELTS", officialUrl: "https://www.tisc.edu.au" },
      
      // MIDDLE EAST
      { name: "Study in Saudi Arabia", category: "General", region: "Saudi Arabia", exam: "GAT", officialUrl: "https://studyinsaudi.moe.gov.sa" },
      { name: "UAE - Ministry of Education", category: "General", region: "UAE", exam: "EmSAT", officialUrl: "https://www.moe.gov.ae" },
      { name: "Israel - Study in Israel", category: "General", region: "Israel", exam: "Psychometric", officialUrl: "https://studyisrael.org.il" }
    ];

    for (const c of counselings) {
      await ctx.db.insert("counselings", {
        ...c,
        description: `Official admission portal for ${c.region}.`
      });
    }
    
    return `Seeded ${counselings.length} international counselings.`;
  },
});
