import { api } from '../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;
const client = new ConvexHttpClient(CONVEX_URL);
const BASE_URL = 'https://apnacounsellor.in';

async function generateMassiveSitemaps() {
  console.log('🚀 Initiating 70,000+ Page Sitemap Generation...');

  const counselings = await client.query(api.counselings.list as any) || [];
  const colleges = await client.query(api.colleges.list, {}) || [];
  
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

  // 1. Counselings & Tools (Priority 1.0)
  let indexXml = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  
  // 2. Colleges (5,000 per sitemap)
  const CHUNK_SIZE = 5000;
  for (let i = 0; i < colleges.length; i += CHUNK_SIZE) {
    const chunk = colleges.slice(i, i + CHUNK_SIZE);
    const fileName = `sitemap-colleges-${i / CHUNK_SIZE + 1}.xml`;
    let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    chunk.forEach((c: any) => {
      xml += `\n  <url><loc>${BASE_URL}/college/${c._id}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`;
    });
    
    xml += `\n</urlset>`;
    fs.writeFileSync(path.join(publicDir, fileName), xml);
    indexXml += `\n  <sitemap><loc>${BASE_URL}/${fileName}</loc></sitemap>`;
  }

  // 3. Cutoffs & Branches (The "70,000" scale)
  // We'll generate pages for every major college and its branches
  let cutoffCount = 0;
  let cutoffXml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  
  colleges.forEach((c: any) => {
    // If college has branches, add them
    if (c.branches && c.branches.length > 0) {
      c.branches.forEach((branch: string) => {
        const branchSlug = encodeURIComponent(branch);
        cutoffXml += `\n  <url><loc>${BASE_URL}/cutoff/${c._id}/${branchSlug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`;
        cutoffCount++;
      });
    } else {
      // Fallback: common engineering branches for SEO
      ['Computer-Science', 'IT', 'Electronics', 'Mechanical', 'Civil'].forEach(b => {
        cutoffXml += `\n  <url><loc>${BASE_URL}/cutoff/${c._id}/${b}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`;
        cutoffCount++;
      });
    }
  });

  fs.writeFileSync(path.join(publicDir, 'sitemap-cutoffs.xml'), cutoffXml);
  indexXml += `\n  <sitemap><loc>${BASE_URL}/sitemap-cutoffs.xml</loc></sitemap>`;

  // 4. Manual / Strategic Pages
  const counselingXml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${counselings.map((c: any) => `\n  <url><loc>${BASE_URL}/counselling/${c.id}</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>`).join('')}\n</urlset>`;
  fs.writeFileSync(path.join(publicDir, 'sitemap-counseling.xml'), counselingXml);
  
  const blogsXml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>`; // Placeholder for now
  fs.writeFileSync(path.join(publicDir, 'sitemap-blogs.xml'), blogsXml);

  indexXml += `\n  <sitemap><loc>${BASE_URL}/sitemap-0.xml</loc></sitemap>`;
  indexXml += `\n  <sitemap><loc>${BASE_URL}/sitemap-counseling.xml</loc></sitemap>`;
  indexXml += `\n  <sitemap><loc>${BASE_URL}/sitemap-blogs.xml</loc></sitemap>`;
  indexXml += `\n</sitemapindex>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml);
  
  console.log(`✅ Successfully mapped ${colleges.length} Colleges and ${cutoffCount} Cutoff/Branch pages.`);
  console.log(`📊 Total estimated indexed pages: ${colleges.length + cutoffCount + counselings.length + 300}+`);
}

generateMassiveSitemaps().catch(console.error);
