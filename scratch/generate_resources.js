const fs = require('fs');
const path = require('path');

const counselings = [
  "JoSAA", "CSAB", "JAC Delhi", "MHT CET", "COMEDK UGET", "KCET", "WBJEE", "KEAM", 
  "AP EAPCET", "TS EAMCET", "GUJCET", "OJEE", "UPTAC", "REAP", "MP DTE", "HSTES", 
  "PTU", "TNEA", "BITSAT", "VITEEE", "SRMJEEE", "MET (Manipal)", "KIITEE", "AEEE (Amrita)", 
  "Thapar", "JIIT", "Nirma University", "DA-IICT", "LNMIIT", "Jadavpur University", 
  "GGSIPU", "JAC Chandigarh", "CUSAT CAT", "CG PET", "JCECE", "BCECE", "TJEE", "UKSEE", 
  "Assam CEE", "GCET", "HPCET", "JKCET", "PESSAT", "SITEEE (Symbiosis)", "Kalinga University", 
  "NTA ICAR AIEEA", "NMIMS NPAT", "SAAT", "IAT (IISER)", "AAT (Architecture)"
];

const colors = ["blue", "purple", "orange", "emerald", "indigo", "rose", "amber"];

let resources = [];

counselings.forEach((c, index) => {
  const color = colors[index % colors.length];
  
  resources.push(`  { title: "${c} Official Website", category: "${c}", type: "Link", iconName: "Globe", color: "${color}" },`);
  resources.push(`  { title: "${c} Last 3 Years Cutoffs", category: "${c}", type: "PDF", iconName: "FileText", color: "${color}" },`);
  resources.push(`  { title: "${c} Preparation & Exam Criteria", category: "${c}", type: "PDF", iconName: "BookOpen", color: "${color}" },`);
  resources.push(`  { title: "${c} Documents Required Checklist", category: "${c}", type: "Sheet", iconName: "CheckCircle", color: "${color}" },`);
  resources.push(`  { title: "${c} Eligibility & Fee Structure", category: "${c}", type: "PDF", iconName: "FileText", color: "${color}" },`);
});

const fileContent = `// Automatically generated resources for top 50 counselings

export const allResources = [
${resources.join('\n')}
];
`;

fs.writeFileSync(path.join(__dirname, '../lib/data/counseling-resources.ts'), fileContent);
console.log("File generated successfully!");
