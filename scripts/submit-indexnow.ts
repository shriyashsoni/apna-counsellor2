import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const HOST = 'apnacounsellor.in';
const CACHE_FILE = path.join(__dirname, 'submitted-urls.json');

async function submitToIndexNow(urls: string[]) {
  if (!INDEXNOW_KEY) {
    console.error('INDEXNOW_KEY not found in .env');
    return;
  }

  try {
    const response = await axios.post('https://api.indexnow.org/indexnow', {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    });
    console.log('IndexNow submission successful:', response.status);
    return true;
  } catch (error) {
    console.error('IndexNow submission failed:', error);
    return false;
  }
}

async function main() {
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap-index.xml');
  // Simple regex to extract <loc> URLs from sitemaps
  // In a real script, we would recursively fetch sitemaps
  
  // This is a placeholder logic for the demo
  const urlsToSubmit = [
    `https://${HOST}/`,
    `https://${HOST}/counseling/mht-cet-counseling`,
    `https://${HOST}/counseling/josaa-counseling`,
  ];

  const newOnly = process.argv.includes('--new-only');
  let submitted: string[] = [];

  if (fs.existsSync(CACHE_FILE)) {
    submitted = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  }

  const finalUrls = newOnly 
    ? urlsToSubmit.filter(u => !submitted.includes(u))
    : urlsToSubmit;

  if (finalUrls.length === 0) {
    console.log('No new URLs to submit.');
    return;
  }

  // Batching 100 urls at a time
  for (let i = 0; i < finalUrls.length; i += 100) {
    const batch = finalUrls.slice(i, i + 100);
    const success = await submitToIndexNow(batch);
    if (success) {
      submitted = Array.from(new Set([...submitted, ...batch]));
      fs.writeFileSync(CACHE_FILE, JSON.stringify(submitted, null, 2));
    }
  }
}

main();
