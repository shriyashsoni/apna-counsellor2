import { api } from '../convex/_generated/api';
import { createConvexClient } from 'convex/browser';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;
const client = createConvexClient(CONVEX_URL);
const BASE_URL = 'https://apnacounsellor.in';

async function generateCategorySitemaps() {
  console.log('Generating massive category sitemaps...');

  const counselings = await client.query(api.counselings.list as any) || [];
  const colleges = await client.query(api.colleges.list, {}) || [];

  // 1. Counseling Sitemap
  let counselingXml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  counselings.forEach((c: any) => {
    counselingXml += `\n  <url><loc>${BASE_URL}/counseling-details/${c._id}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`;
  });
  // Add static ones from turn 1
  ['josaa-counseling', 'mht-cet-counseling', 'neet-mcc-counseling'].forEach(s => {
    counselingXml += `\n  <url><loc>${BASE_URL}/counseling/${s}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`;
  });
  counselingXml += `\n</urlset>`;

  // 2. Colleges Sitemap (7000+)
  let collegesXml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  colleges.forEach((c: any) => {
    collegesXml += `\n  <url><loc>${BASE_URL}/college/${c._id}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`;
  });
  collegesXml += `\n</urlset>`;

  // Write files
  const publicDir = path.join(__dirname, '..', 'public');
  fs.writeFileSync(path.join(publicDir, 'sitemap-counseling.xml'), counselingXml);
  fs.writeFileSync(path.join(publicDir, 'sitemap-colleges.xml'), collegesXml);

  // 3. Comparisons & Tools (Placeholder for scale)
  let toolsXml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  ['college-predictor', 'rank-predictor', 'cutoff-predictor'].forEach(t => {
    toolsXml += `\n  <url><loc>${BASE_URL}/tools/${t}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`;
  });
  toolsXml += `\n</urlset>`;
  fs.writeFileSync(path.join(publicDir, 'sitemap-tools.xml'), toolsXml);

  console.log('Massive sitemaps generated successfully.');
}

generateCategorySitemaps().catch(console.error);
