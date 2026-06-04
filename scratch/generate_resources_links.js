const fs = require('fs');
const path = require('path');

const counselingsData = [
  { name: "JoSAA", url: "https://josaa.nic.in" },
  { name: "CSAB", url: "https://csab.nic.in" },
  { name: "JAC Delhi", url: "https://jacdelhi.admissions.nic.in" },
  { name: "MHT CET", url: "https://cetcell.mahacet.org" },
  { name: "COMEDK UGET", url: "https://www.comedk.org" },
  { name: "KCET", url: "https://cetonline.karnataka.gov.in/kea" },
  { name: "WBJEE", url: "https://wbjeeb.nic.in" },
  { name: "KEAM", url: "https://cee.kerala.gov.in" },
  { name: "AP EAPCET", url: "https://cets.apsche.ap.gov.in" },
  { name: "TS EAMCET", url: "https://eamcet.tsche.ac.in" },
  { name: "GUJCET", url: "https://gujcet.gseb.org" },
  { name: "OJEE", url: "https://ojee.nic.in" },
  { name: "UPTAC", url: "https://uptac.admissions.nic.in" },
  { name: "REAP", url: "https://hte.rajasthan.gov.in" },
  { name: "MP DTE", url: "https://dte.mponline.gov.in" },
  { name: "HSTES", url: "https://techadmissionshry.gov.in" },
  { name: "PTU", url: "https://ptu.ac.in/admissions" },
  { name: "TNEA", url: "https://www.tneaonline.org" },
  { name: "BITSAT", url: "https://www.bitsadmission.com" },
  { name: "VITEEE", url: "https://viteee.vit.ac.in" },
  { name: "SRMJEEE", url: "https://www.srmist.edu.in" },
  { name: "MET (Manipal)", url: "https://manipal.edu/mu/admission" },
  { name: "KIITEE", url: "https://kiitee.kiit.ac.in" },
  { name: "AEEE (Amrita)", url: "https://amrita.edu/admissions/btech" },
  { name: "Thapar", url: "https://admission.thapar.edu" },
  { name: "JIIT", url: "https://www.jiit.ac.in/admissions" },
  { name: "Nirma University", url: "https://nirmauni.ac.in/admissions" },
  { name: "DA-IICT", url: "https://www.daiict.ac.in/admissions" },
  { name: "LNMIIT", url: "https://admissions.lnmiit.ac.in" },
  { name: "Jadavpur University", url: "http://www.jaduniv.edu.in" },
  { name: "GGSIPU", url: "https://ipu.admissions.nic.in" },
  { name: "JAC Chandigarh", url: "https://jacchd.admissions.nic.in" },
  { name: "CUSAT CAT", url: "https://admissions.cusat.ac.in" },
  { name: "CG PET", url: "https://vyapam.cgstate.gov.in" },
  { name: "JCECE", url: "https://jceceb.jharkhand.gov.in" },
  { name: "BCECE", url: "https://bceceboard.bihar.gov.in" },
  { name: "TJEE", url: "https://tbjee.nic.in" },
  { name: "UKSEE", url: "https://uktech.ac.in" },
  { name: "Assam CEE", url: "https://astu.ac.in" },
  { name: "GCET", url: "https://dte.goa.gov.in" },
  { name: "HPCET", url: "https://himtu.ac.in" },
  { name: "JKCET", url: "https://jkbopee.gov.in" },
  { name: "PESSAT", url: "https://www.pessat.com" },
  { name: "SITEEE (Symbiosis)", url: "https://www.set-test.org" },
  { name: "Kalinga University", url: "https://kalingauniversity.ac.in" },
  { name: "NTA ICAR AIEEA", url: "https://icar.nta.nic.in" },
  { name: "NMIMS NPAT", url: "https://npat.in" },
  { name: "SAAT", url: "https://www.admission.soa.ac.in" },
  { name: "IAT (IISER)", url: "https://iiseradmission.in" },
  { name: "AAT (Architecture)", url: "https://jeeadv.ac.in" }
];

const colors = ["blue", "purple", "orange", "emerald", "indigo", "rose", "amber"];

let resources = [];

counselingsData.forEach((cData, index) => {
  const c = cData.name;
  const color = colors[index % colors.length];
  
  // Real official website URL
  resources.push(`  { title: "${c} Official Website", category: "${c}", type: "Link", iconName: "Globe", color: "${color}", link: "${cData.url}" },`);
  
  // For PDFs and Documents, search links are the most reliable way to provide real access to constantly updating government docs
  resources.push(`  { title: "${c} Last 3 Years Cutoffs", category: "${c}", type: "PDF", iconName: "FileText", color: "${color}", link: "https://www.google.com/search?q=${encodeURIComponent(c + ' last 3 years cutoff pdf')}" },`);
  resources.push(`  { title: "${c} Preparation & Exam Criteria", category: "${c}", type: "PDF", iconName: "BookOpen", color: "${color}", link: "https://www.google.com/search?q=${encodeURIComponent(c + ' exam criteria and syllabus pdf')}" },`);
  resources.push(`  { title: "${c} Documents Required Checklist", category: "${c}", type: "Sheet", iconName: "CheckCircle", color: "${color}", link: "https://www.google.com/search?q=${encodeURIComponent(c + ' counseling documents required checklist pdf')}" },`);
  resources.push(`  { title: "${c} Eligibility & Fee Structure", category: "${c}", type: "PDF", iconName: "FileText", color: "${color}", link: "https://www.google.com/search?q=${encodeURIComponent(c + ' eligibility and fee structure pdf')}" },`);
});

const fileContent = `// Automatically generated resources with real official links and dynamic search links for PDFs

export const allResources = [
${resources.join('\n')}
];
`;

fs.writeFileSync(path.join(__dirname, '../lib/data/counseling-resources.ts'), fileContent);
console.log("File generated successfully with links!");
