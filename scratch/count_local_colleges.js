const fs = require('fs');
const path = require('path');

function countLocalColleges() {
  const basePath = 'e:/projects/apna-counsellor2/apna_counsellor/counselings_data';
  if (!fs.existsSync(basePath)) {
    console.error('Counseling data directory not found:', basePath);
    return;
  }
  
  const folders = fs.readdirSync(basePath);
  let totalColleges = 0;
  let foldersWithColleges = 0;

  for (const folder of folders) {
    const folderPath = path.join(basePath, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const jsonPath = path.join(folderPath, 'colleges.json');
    if (fs.existsSync(jsonPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        if (Array.isArray(data)) {
          totalColleges += data.length;
          foldersWithColleges++;
        }
      } catch (e) {
        console.error(`Error parsing ${jsonPath}:`, e.message);
      }
    }
  }

  console.log(`Total Counseling Folders: ${folders.length}`);
  console.log(`Folders with colleges.json: ${foldersWithColleges}`);
  console.log(`Total colleges in JSON files: ${totalColleges}`);
}

countLocalColleges();
