const fs = require('fs');
const path = require('path');

const counselingsData = [
  { name: "JoSAA", url: "https://josaa.nic.in", slug: "josaa" },
  { name: "CSAB", url: "https://csab.nic.in", slug: "csab" },
  { name: "JAC Delhi", url: "https://jacdelhi.admissions.nic.in", slug: "jac-delhi" },
  { name: "MHT CET", url: "https://cetcell.mahacet.org", slug: "mht-cet" },
  { name: "COMEDK UGET", url: "https://www.comedk.org", slug: "comedk-uget" },
  { name: "KCET", url: "https://cetonline.karnataka.gov.in/kea", slug: "kcet" },
  { name: "WBJEE", url: "https://wbjeeb.nic.in", slug: "wbjee" },
  { name: "KEAM", url: "https://cee.kerala.gov.in", slug: "keam" },
  { name: "AP EAPCET", url: "https://cets.apsche.ap.gov.in", slug: "ap-eamcet" },
  { name: "TS EAMCET", url: "https://eamcet.tsche.ac.in", slug: "ts-eamcet" },
  { name: "GUJCET", url: "https://gujcet.gseb.org", slug: "gujcet" },
  { name: "OJEE", url: "https://ojee.nic.in", slug: "ojee" },
  { name: "UPTAC", url: "https://uptac.admissions.nic.in", slug: "upsee" },
  { name: "REAP", url: "https://hte.rajasthan.gov.in", slug: "reap" },
  { name: "MP DTE", url: "https://dte.mponline.gov.in", slug: "mp-be" },
  { name: "HSTES", url: "https://techadmissionshry.gov.in", slug: "hstes" },
  { name: "PTU", url: "https://ptu.ac.in/admissions", slug: "ptu" },
  { name: "TNEA", url: "https://www.tneaonline.org", slug: "tnea" },
  { name: "BITSAT", url: "https://www.bitsadmission.com", slug: "bitsat" },
  { name: "VITEEE", url: "https://viteee.vit.ac.in", slug: "viteee" },
  { name: "SRMJEEE", url: "https://www.srmist.edu.in", slug: "srmjeee" },
  { name: "MET", url: "https://manipal.edu/mu/admission", slug: "met" },
  { name: "KIITEE", url: "https://kiitee.kiit.ac.in", slug: "kiitee" },
  { name: "AEEE", url: "https://amrita.edu/admissions/btech", slug: "aeee" },
  { name: "Thapar", url: "https://admission.thapar.edu", slug: "thapar" },
  { name: "JIIT", url: "https://www.jiit.ac.in/admissions", slug: "jiit" },
  { name: "Nirma", url: "https://nirmauni.ac.in/admissions", slug: "nirma" },
  { name: "DA-IICT", url: "https://www.daiict.ac.in/admissions", slug: "daiict" },
  { name: "LNMIIT", url: "https://admissions.lnmiit.ac.in", slug: "lnmiit" },
  { name: "Jadavpur", url: "http://www.jaduniv.edu.in", slug: "jadavpur" },
  { name: "GGSIPU", url: "https://ipu.admissions.nic.in", slug: "ipu-cet" },
  { name: "JAC Chandigarh", url: "https://jacchd.admissions.nic.in", slug: "jac-chandigarh" },
  { name: "CUSAT CAT", url: "https://admissions.cusat.ac.in", slug: "cusat-cat" },
  { name: "CG PET", url: "https://vyapam.cgstate.gov.in", slug: "cg-pet" },
  { name: "JCECE", url: "https://jceceb.jharkhand.gov.in", slug: "jcece" },
  { name: "BCECE", url: "https://bceceboard.bihar.gov.in", slug: "bcece" },
  { name: "TJEE", url: "https://tbjee.nic.in", slug: "tbjee" },
  { name: "UKSEE", url: "https://uktech.ac.in", slug: "uksee" },
  { name: "Assam CEE", url: "https://astu.ac.in", slug: "assam-cee" },
  { name: "GCET", url: "https://dte.goa.gov.in", slug: "gcet" },
  { name: "HPCET", url: "https://himtu.ac.in", slug: "hpcet" },
  { name: "JKCET", url: "https://jkbopee.gov.in", slug: "jkcet" },
  { name: "PESSAT", url: "https://www.pessat.com", slug: "pessat" },
  { name: "SITEEE", url: "https://www.set-test.org", slug: "siteee" },
  { name: "Kalinga", url: "https://kalingauniversity.ac.in", slug: "kalinga" },
  { name: "ICAR AIEEA", url: "https://icar.nta.nic.in", slug: "icar-aieea" },
  { name: "NMIMS NPAT", url: "https://npat.in", slug: "npat" },
  { name: "SAAT", url: "https://www.admission.soa.ac.in", slug: "saat" },
  { name: "IAT", url: "https://iiseradmission.in", slug: "iat" },
  { name: "AAT", url: "https://jeeadv.ac.in", slug: "aat" }
];

const colors = ["blue", "purple", "orange", "emerald", "indigo", "rose", "amber"];

let resources = [];

counselingsData.forEach((cData, index) => {
  const c = cData.name;
  const slug = cData.slug;
  const url = cData.url;
  const color = colors[index % colors.length];
  
  // Real official website URL
  resources.push(`  { title: "${c} Official Website", category: "${c}", type: "Link", iconName: "Globe", color: "${color}", link: "${url}" },`);
  
  // Shiksha / Careers360 Links which are highly authoritative
  resources.push(`  { title: "${c} Last 3 Years Cutoffs", category: "${c}", type: "PDF", iconName: "FileText", color: "${color}", link: "https://www.shiksha.com/engineering/${slug}-exam-cutoff" },`);
  resources.push(`  { title: "${c} Preparation & Exam Criteria", category: "${c}", type: "PDF", iconName: "BookOpen", color: "${color}", link: "https://www.careers360.com/exams/${slug}" },`);
  resources.push(`  { title: "${c} Documents Required Checklist", category: "${c}", type: "Sheet", iconName: "CheckCircle", color: "${color}", link: "https://www.shiksha.com/engineering/${slug}-exam-counselling" },`);
  resources.push(`  { title: "${c} Eligibility & Fee Structure", category: "${c}", type: "PDF", iconName: "FileText", color: "${color}", link: "https://www.collegepravesh.com/exams/${slug}/" },`);
});

const fileContent = `// Automatically generated resources with real aggregator direct links

export const allResources = [
${resources.join('\n')}
];
`;

fs.writeFileSync(path.join(__dirname, '../lib/data/counseling-resources.ts'), fileContent);
console.log("File generated successfully with direct links!");
