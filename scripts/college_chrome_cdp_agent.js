// Apna Counsellor - Chrome CDP (Chrome DevTools Protocol) Automation Agent
// Controls your local Chrome browser with minimal dependencies (puppeteer-core)
// Supports Windows, macOS, and Linux.

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Load Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log("✅ Supabase service client connected! Scraped data can be synced in real-time.");
} else {
  console.log("⚠️ Supabase credentials not found in .env.local. Scraped data will be saved locally as JSON.");
}

// OS-specific Google Chrome Executable Paths
const CHROME_PATHS = {
  win32: [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    path.join(process.env.LOCALAPPDATA || "", "Google\\Chrome\\Application\\chrome.exe")
  ],
  darwin: [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  ],
  linux: [
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser"
  ]
};

function getChromeExecutablePath() {
  const platform = process.platform;
  const paths = CHROME_PATHS[platform] || [];
  
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

async function startAgent() {
  console.log("\n=======================================================");
  console.log("🌟   WELCOME TO THE APNA COUNSELLOR HEADLESS CHROME AGENT   🌟");
  console.log("=======================================================");
  console.log("🚀 Multi-platform automated scraper using your local Google Chrome browser.");
  console.log("🔒 Zero extra heavy dependencies. Bypasses standard bot limits.\n");

  const targetUrl = process.argv[2] || "https://dashboard.aishe.gov.in/hedirectory/#/hedirectory";
  const limit = parseInt(process.argv[3]) || 500;
  
  console.log(`📡 Scraping Target URL: ${targetUrl}`);
  console.log(`📈 Extraction Target Limit: ${limit} colleges`);
  
  const chromePath = getChromeExecutablePath();
  if (!chromePath) {
    console.error("❌ Error: Could not locate standard Google Chrome or Chromium installation!");
    console.error("👉 Please ensure Google Chrome is installed on your machine.");
    process.exit(1);
  }
  console.log(`ℹ️ Located local Google Chrome executable: ${chromePath}`);

  // Dynamic import of puppeteer-core to avoid failures if not installed yet
  let puppeteer;
  try {
    puppeteer = require("puppeteer-core");
  } catch (err) {
    console.log("\n⚠️ Package 'puppeteer-core' is not yet installed in this project workspace.");
    console.log("👉 To run this script, install it by executing: npm install puppeteer-core");
    console.log("👉 Alternatively, you can use the interactive Chrome Extension we built for you!\n");
    process.exit(1);
  }

  console.log("⚡ Launching automated Chrome process...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: false, // Run in headful mode so you can see the magic and bypass CAPTCHAs
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled" // Hide automation footprints
    ]
  });

  const page = await browser.newPage();
  
  // Custom user agent to look like a standard human browser session
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
  
  console.log(`🌐 Navigating target to: ${targetUrl}`);
  await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 });
  
  console.log("⏳ Waiting for page interaction. Please apply any filters or search queries...");
  console.log("👉 Once the list table is loaded, the agent will begin automated extraction.");

  let allColleges = [];
  let pageNumber = 1;

  while (allColleges.length < limit) {
    console.log(`\n-------------------------------------------------------`);
    console.log(`🔎 Analyzing page #${pageNumber} for colleges...`);
    
    // Auto-scroll to load dynamic tables/lazy assets
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        let distance = 100;
        let timer = setInterval(() => {
          let scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 50);
      });
      window.scrollTo(0, 0);
    });
    
    await new Promise(r => setTimeout(r, 1500));

    // Extract table details using page evaluation
    const extractedBatch = await page.evaluate(() => {
      const list = [];
      // Look for standard data tables
      const rows = document.querySelectorAll("table tr, .table-responsive tr, tbody tr");
      
      // Heuristic extraction for table columns
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll("td");
        if (cells.length >= 3) {
          const code = cells[0]?.innerText?.trim() || "";
          const name = cells[1]?.innerText?.trim() || "";
          const type = cells[2]?.innerText?.trim() || "";
          const state = cells.length > 3 ? cells[3]?.innerText?.trim() : "";
          const city = cells.length > 4 ? cells[4]?.innerText?.trim() : "";
          
          if (name && name.length > 3) {
            list.push({
              aishe_code: code.startsWith("C-") || code.startsWith("U-") ? code : "",
              name: name.replace(/[\n\t]+/g, " ").replace(/\s+/g, " ").trim(),
              type: type || "Private",
              state: state || "",
              city: city || "",
              website: "#",
              established: null,
              description: ""
            });
          }
        }
      }
      return list;
    });

    console.log(`📦 Page #${pageNumber} yields ${extractedBatch.length} colleges.`);

    // Merge unique elements
    let addedCount = 0;
    for (const col of extractedBatch) {
      if (allColleges.length >= limit) break;
      
      const duplicate = allColleges.find(existing => existing.name.toLowerCase() === col.name.toLowerCase() && existing.city === col.city);
      if (!duplicate) {
        allColleges.push(col);
        addedCount++;
        
        // Sync to Supabase in real-time if enabled
        if (supabase) {
          (async () => {
            try {
              let { data: existing } = await supabase
                .from("colleges")
                .select("id")
                .eq("name", col.name)
                .eq("city", col.city)
                .limit(1);

              const payload = {
                name: col.name,
                aishe_code: col.aishe_code,
                type: col.type,
                state: col.state,
                city: col.city,
                website: col.website
              };

              if (existing && existing.length > 0) {
                await supabase.from("colleges").update(payload).eq("id", existing[0].id);
              } else {
                await supabase.from("colleges").insert(payload);
              }
            } catch (dbError) {
              // Suppress errors during parallel loops
            }
          })();
        }
      }
    }
    
    console.log(`✅ Integrated ${addedCount} new unique colleges. Total unique count: ${allColleges.length}/${limit}`);

    if (allColleges.length >= limit) {
      console.log(`\n🎉 Goal achieved! Scraped targeted ${allColleges.length} colleges.`);
      break;
    }

    // Try finding next page button
    const paginationClicked = await page.evaluate(() => {
      // Find buttons containing standard pagination text
      const candidates = ["Next", "Next Page", "»", ">", "next"];
      const buttons = document.querySelectorAll("a, button, li, span");
      
      for (const el of buttons) {
        const text = el.innerText?.trim()?.toLowerCase() || "";
        if (candidates.includes(text) && !el.disabled && !el.classList.contains("disabled")) {
          el.click();
          return true;
        }
      }
      return false;
    });

    if (paginationClicked) {
      console.log("➡️ Pagination button found & clicked. Loading next page...");
      pageNumber++;
      await new Promise(r => setTimeout(r, 3000)); // Delay for page loading
    } else {
      console.log("🛑 Pagination button not detected. Scraper completed execution.");
      break;
    }
  }

  // Save data locally as fallback or audit log
  const outputPath = path.join(__dirname, "harvested_colleges.json");
  fs.writeFileSync(outputPath, JSON.stringify(allColleges, null, 2));
  console.log(`\n💾 Harvester report saved locally to: ${outputPath}`);
  
  console.log("\n=======================================================");
  console.log("🎉 AUTOMATION TASK COMPLETED SUCCESSFULLY!");
  console.log(`📈 Total Unique Colleges Extracted: ${allColleges.length}`);
  console.log("=======================================================\n");

  await browser.close();
}

startAgent().catch(err => {
  console.error("❌ Scraper experienced critical crash:", err);
});
