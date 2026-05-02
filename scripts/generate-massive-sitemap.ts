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
  
  // Also get counselings from filesystem to ensure all 200+ are included
  const dataDir = path.join(__dirname, '..', 'apna_counsellor', 'counselings_data');
  let fsCounselingIds: string[] = [];
  if (fs.existsSync(dataDir)) {
    fsCounselingIds = fs.readdirSync(dataDir).filter(dir => fs.statSync(path.join(dataDir, dir)).isDirectory());
  }

  // Merge unique IDs and filter out falsy/undefined values
  const allCounselingIds = Array.from(new Set([
    ...counselings.map((c: any) => c.id),
    ...fsCounselingIds
  ])).filter(Boolean);

  const colleges = await client.query(api.colleges.list, {}) || [];
  
  // Also get colleges from local JSON files
  let allColleges = [...colleges.map((c: any) => ({ ...c, id: c._id }))];
  const stateDirs = fs.readdirSync(dataDir).filter(dir => fs.statSync(path.join(dataDir, dir)).isDirectory());
  
  stateDirs.forEach(state => {
    const collegesPath = path.join(dataDir, state, 'colleges.json');
    if (fs.existsSync(collegesPath)) {
      try {
        const localColleges = JSON.parse(fs.readFileSync(collegesPath, 'utf8'));
        localColleges.forEach((c: any) => {
          // Use a slug-based ID if real ID is missing
          const slugId = (c.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
          if (slugId) {
            allColleges.push({
              id: slugId,
              name: c.name,
              state: state.replace(/_/g, ' '),
              ...c
            });
          }
        });
      } catch (e) {
        console.error(`Error parsing ${collegesPath}: ${e}`);
      }
    }
  });

  // Unique by ID
  const uniqueColleges = Array.from(new Map(allColleges.map(c => [c.id, c])).values());
  
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

  // 1. Counselings & Tools (Priority 1.0)
  let indexXml = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  
  // 2. Colleges (5,000 per sitemap)
  const CHUNK_SIZE = 5000;
  for (let i = 0; i < uniqueColleges.length; i += CHUNK_SIZE) {
    const chunk = uniqueColleges.slice(i, i + CHUNK_SIZE);
    const fileName = `sitemap-colleges-${i / CHUNK_SIZE + 1}.xml`;
    let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    chunk.forEach((c: any) => {
      xml += `\n  <url><loc>${BASE_URL}/college/${c.id}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`;
    });
    
    xml += `\n</urlset>`;
    fs.writeFileSync(path.join(publicDir, fileName), xml);
    indexXml += `\n  <sitemap><loc>${BASE_URL}/${fileName}</loc></sitemap>`;
  }

  // 3. Cutoffs & Branches (The "70,000" scale)
  // We'll generate pages for every major college and its branches
  let cutoffCount = 0;
  let cutoffXml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  
  uniqueColleges.forEach((c: any) => {
    // If college has branches, add them
    if (c.branches && c.branches.length > 0) {
      c.branches.forEach((branch: string) => {
        const branchSlug = encodeURIComponent(branch);
        cutoffXml += `\n  <url><loc>${BASE_URL}/cutoff/${c.id}/${branchSlug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`;
        cutoffCount++;
      });
    } else {
      // Fallback: common engineering branches for SEO
      ['Computer-Science', 'IT', 'Electronics', 'Mechanical', 'Civil'].forEach(b => {
        cutoffXml += `\n  <url><loc>${BASE_URL}/cutoff/${c.id}/${b}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`;
        cutoffCount++;
      });
    }
  });

  cutoffXml += `\n</urlset>`;
  fs.writeFileSync(path.join(publicDir, 'sitemap-cutoffs.xml'), cutoffXml);
  indexXml += `\n  <sitemap><loc>${BASE_URL}/sitemap-cutoffs.xml</loc></sitemap>`;

  // 4. Manual / Strategic Pages
  const counselingXml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${allCounselingIds.map((id: string) => `\n  <url><loc>${BASE_URL}/counselling/${id}</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>`).join('')}\n</urlset>`;
  fs.writeFileSync(path.join(publicDir, 'sitemap-counseling.xml'), counselingXml);
  
  const blogsXml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>`; // Placeholder for now
  fs.writeFileSync(path.join(publicDir, 'sitemap-blogs.xml'), blogsXml);

  indexXml += `\n  <sitemap><loc>${BASE_URL}/sitemap-0.xml</loc></sitemap>`;
  indexXml += `\n  <sitemap><loc>${BASE_URL}/sitemap-counseling.xml</loc></sitemap>`;
  indexXml += `\n  <sitemap><loc>${BASE_URL}/sitemap-blogs.xml</loc></sitemap>`;
  indexXml += `\n</sitemapindex>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml);
  
  console.log(`✅ Successfully mapped ${uniqueColleges.length} Colleges and ${cutoffCount} Cutoff/Branch pages.`);
  console.log(`📊 Total estimated indexed pages: ${uniqueColleges.length + cutoffCount + allCounselingIds.length + 300}+`);
}

generateMassiveSitemaps().catch(console.error);
