import fs from 'fs';
import path from 'path';

const inputFile = 'public/sitemap-cutoffs.xml';
const content = fs.readFileSync(inputFile, 'utf8');

// Simple regex to extract <url> blocks
const urlRegex = /<url>[\s\S]*?<\/url>/g;
const urls = content.match(urlRegex) || [];

console.log(`Found ${urls.length} URLs in ${inputFile}`);

const CHUNK_SIZE = 45000; // Stay safe below 50k
for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
  const chunk = urls.slice(i, i + CHUNK_SIZE);
  const partNumber = Math.floor(i / CHUNK_SIZE) + 1;
  const fileName = `public/sitemap-cutoffs-${partNumber}.xml`;
  
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunk.join('\n')}
</urlset>`;
  
  fs.writeFileSync(fileName, xmlContent);
  console.log(`Created ${fileName} with ${chunk.length} URLs`);
}

// Update sitemap-index.xml and sitemap.xml
// We'll do this in the next step
