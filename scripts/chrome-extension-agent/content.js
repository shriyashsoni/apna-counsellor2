// Apna Counsellor College Harvester - Content script
let activeScraping = false;
let config = null;
let pagesCount = 0;

// Listen for popup instructions
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "ping") {
    sendResponse({ status: "alive" });
    return true;
  }
  
  if (message.action === "start_scraping") {
    activeScraping = true;
    config = message.config;
    pagesCount = 0;
    sendPopupLog(`🚀 Harvesting sequence initialized in active page content.`, "success");
    runScrapingLoop();
  }
  
  if (message.action === "stop_scraping") {
    activeScraping = false;
    sendPopupLog("⚠️ Scraping sequence interrupted by worker.", "warning");
  }
});

// Helper to log back to the popup
function sendPopupLog(msg, type = "info") {
  chrome.runtime.sendMessage({
    action: "log",
    data: msg,
    logType: type
  }).catch(() => {});
}

// Scraping core loop
async function runScrapingLoop() {
  if (!activeScraping) return;
  pagesCount++;
  
  sendPopupLog(`📄 Starting parsing process on page #${pagesCount}`, "info");
  
  // Smooth scroll to bottom of the page first to trigger lazy-loaded images/content
  await smoothScrollToBottom();
  
  // Throttle slightly
  await sleep(1000);
  
  // Extract data based on preset
  let colleges = [];
  try {
    if (config.preset === "aishe") {
      colleges = extractAISHEData();
    } else if (config.preset === "shiksha") {
      colleges = extractShikshaData();
    } else if (config.preset === "collegedekho") {
      colleges = extractCollegeDekhoData();
    } else if (config.preset === "custom") {
      colleges = extractCustomSelectorsData(config.selectors);
    }
    
    sendPopupLog(`✅ Extraction completed: found ${colleges.length} colleges on this page.`, "success");
    
    // Send batch data to popup
    chrome.runtime.sendMessage({
      action: "batch_extracted",
      data: colleges,
      pagesCount: pagesCount
    }).catch(() => {});
    
  } catch (error) {
    sendPopupLog(`❌ Extraction error: ${error.message}`, "error");
    chrome.runtime.sendMessage({ action: "scraping_error", data: error.message }).catch(() => {});
  }
  
  // Advance to next page if possible
  if (activeScraping) {
    const hasNext = await navigateToNextPage();
    if (hasNext) {
      sendPopupLog(`⏳ Navigation triggered. Waiting ${config.delayMs / 1000}s for next page load...`, "info");
      await sleep(config.delayMs);
      runScrapingLoop(); // Recursive loop
    } else {
      sendPopupLog(`🏁 End of list reached or Next button not found. Wrapping up task.`, "success");
      chrome.runtime.sendMessage({ action: "scraping_complete" }).catch(() => {});
    }
  }
}

// Helper to wait
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Scroll page helper to trigger dynamic DOM generation
async function smoothScrollToBottom() {
  sendPopupLog("Scrolling page to load dynamic details...", "info");
  const distance = 100;
  const delay = 50;
  while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
    if (!activeScraping) break;
    window.scrollBy(0, distance);
    await sleep(delay);
  }
  // Scroll back to top
  window.scrollTo(0, 0);
}

// -------------------------------------------------------------
// EXTRACTION RULES FOR TARGETS
// -------------------------------------------------------------

// 1. Official AISHE Higher Education Directory Extractor
function extractAISHEData() {
  const colleges = [];
  
  // AISHE HE Directory usually loads data in table rows (TR)
  const rows = document.querySelectorAll("table.table tr, .table-responsive tr, table tr");
  
  if (rows.length <= 1) {
    // If no tables, try generic card structure
    const cards = document.querySelectorAll(".card, .panel, .institution-row");
    if (cards.length > 0) {
      cards.forEach(card => {
        const textContent = card.innerText;
        if (textContent.includes("AISHE") || textContent.includes("College") || textContent.includes("University")) {
          colleges.push(cleanExtractedCollege({
            name: card.querySelector(".name, h4, h5, .title")?.innerText || "",
            aishe_code: textContent.match(/C-\d+/)?.[0] || "",
            type: textContent.match(/(Affiliated|Autonomous|Constituent|Government|Private)/i)?.[0] || "",
            state: card.querySelector(".state")?.innerText || "",
            city: card.querySelector(".city")?.innerText || ""
          }));
        }
      });
      return colleges.filter(c => c.name);
    }
    throw new Error("No tables or data grids found on this AISHE directory page.");
  }
  
  // Parse rows (index 0 is typically header)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.querySelectorAll("td");
    
    if (cells.length >= 3) {
      // Standard cells mapping
      const aisheCode = cells[0]?.innerText.trim() || "";
      const name = cells[1]?.innerText.trim() || "";
      const type = cells[2]?.innerText.trim() || "";
      const state = cells.length > 3 ? cells[3]?.innerText.trim() : "";
      const city = cells.length > 4 ? cells[4]?.innerText.trim() : "";
      
      if (name && (aisheCode.startsWith("C-") || aisheCode.startsWith("U-") || name.length > 3)) {
        colleges.push(cleanExtractedCollege({
          aishe_code: aisheCode,
          name: name,
          type: type,
          state: state,
          city: city
        }));
      }
    }
  }
  
  return colleges;
}

// 2. Shiksha Listing Extractor
function extractShikshaData() {
  const colleges = [];
  // Shiksha search results cards
  const cards = document.querySelectorAll(".tuple-box, .college-tuple, .card, [id^='tuple']");
  
  cards.forEach(card => {
    const nameEl = card.querySelector("h2, h3, a.title, .collegeName, .tuple-title");
    if (!nameEl) return;
    
    const name = nameEl.innerText.trim();
    const locationText = card.querySelector(".location, .city-state, .tuple-sub-title")?.innerText || "";
    const parts = locationText.split(",").map(p => p.trim());
    const city = parts[0] || "";
    const state = parts[1] || "";
    
    const websiteEl = card.querySelector("a[href*='http']");
    const website = websiteEl ? websiteEl.href : "";
    
    const feeText = card.querySelector(".fee, .tuition-fee, .price, .course-fee")?.innerText || "";
    const packageText = card.querySelector(".package, .salary, .placement, .salary-package")?.innerText || "";
    
    colleges.push(cleanExtractedCollege({
      name: name,
      city: city,
      state: state,
      annual_fee: feeText,
      avg_package: packageText,
      website: website
    }));
  });
  
  return colleges.filter(c => c.name);
}

// 3. CollegeDekho Listing Extractor
function extractCollegeDekhoData() {
  const colleges = [];
  const cards = document.querySelectorAll(".collegeCard, .card-box, .colg-card");
  
  cards.forEach(card => {
    const nameEl = card.querySelector(".collegeName, h3, .title, a");
    if (!nameEl) return;
    
    const name = nameEl.innerText.trim();
    const location = card.querySelector(".location, .colg-loc, .city")?.innerText || "";
    const parts = location.split(",").map(p => p.trim());
    
    const fee = card.querySelector(".feeAmount, .fee, .price")?.innerText || "";
    
    colleges.push(cleanExtractedCollege({
      name: name,
      city: parts[0] || "",
      state: parts[1] || "",
      annual_fee: fee,
      website: card.querySelector("a.btn, a.visit")?.href || ""
    }));
  });
  
  return colleges.filter(c => c.name);
}

// 4. Custom CSS Selector Mode Extractor
function extractCustomSelectorsData(selectors) {
  const colleges = [];
  const items = document.querySelectorAll(selectors.item);
  
  items.forEach(item => {
    const nameEl = item.querySelector(selectors.name);
    if (!nameEl) return;
    
    const name = nameEl.innerText.trim();
    const state = selectors.state ? item.querySelector(selectors.state)?.innerText.trim() : "";
    const city = selectors.city ? item.querySelector(selectors.city)?.innerText.trim() : "";
    
    let website = "";
    if (selectors.website) {
      const webEl = item.querySelector(selectors.website);
      website = webEl ? (webEl.href || webEl.innerText.trim()) : "";
    }
    
    colleges.push(cleanExtractedCollege({
      name: name,
      state: state,
      city: city,
      website: website
    }));
  });
  
  return colleges;
}

// Cleanup helper to sanitize data fields
function cleanExtractedCollege(raw) {
  return {
    name: raw.name ? raw.name.replace(/[\n\t]+/g, " ").replace(/\s+/g, " ").trim() : "Unknown College",
    state: raw.state ? raw.state.replace(/[\n\t]+/g, "").trim() : "",
    city: raw.city ? raw.city.replace(/[\n\t]+/g, "").trim() : "",
    aishe_code: raw.aishe_code ? raw.aishe_code.trim() : "",
    type: raw.type ? raw.type.trim() : "Private",
    established: raw.established ? parseInt(raw.established) : null,
    annual_fee: raw.annual_fee ? raw.annual_fee.replace(/[\n\t]+/g, " ").trim() : "",
    avg_package: raw.avg_package ? raw.avg_package.replace(/[\n\t]+/g, " ").trim() : "",
    website: raw.website && raw.website.startsWith("http") ? raw.website : "#",
    description: ""
  };
}

// -------------------------------------------------------------
// NAVIGATION & PAGINATION
// -------------------------------------------------------------

async function navigateToNextPage() {
  sendPopupLog("Locating next page pagination button...", "info");
  
  let nextButton = null;
  
  if (config.preset === "aishe") {
    // Try standard pagination buttons
    nextButton = findButtonByText(["Next", "»", "Forward", ">"]) || document.querySelector("a.next, li.next a, li.active + li a");
  } else if (config.preset === "shiksha") {
    nextButton = document.querySelector(".next, .pagination-next, a[title='Next Page']");
  } else if (config.preset === "collegedekho") {
    nextButton = document.querySelector(".nextBtn, a.next, .pagination li:last-child a");
  } else if (config.preset === "custom" && config.selectors.next) {
    nextButton = document.querySelector(config.selectors.next);
  }
  
  // Generic fallback if not matched
  if (!nextButton) {
    nextButton = findButtonByText(["Next", "Next Page", "»", ">", "next"]);
  }
  
  if (nextButton && isElementClickable(nextButton)) {
    sendPopupLog(`🖱️ Next page button found! Clicking: "${nextButton.innerText.trim() || 'Next'}"`, "success");
    nextButton.click();
    return true;
  }
  
  // Check for infinite scroll triggers instead of pagination
  const scrollHeightBefore = document.scrollingElement.scrollHeight;
  window.scrollTo(0, scrollHeightBefore);
  await sleep(1000);
  const scrollHeightAfter = document.scrollingElement.scrollHeight;
  
  if (scrollHeightAfter > scrollHeightBefore) {
    sendPopupLog("🔄 Dynamic content detected via scroll loading! Scrolling triggered next batch.", "success");
    return true;
  }
  
  return false;
}

// Helper to search button elements by text
function findButtonByText(candidates) {
  const elements = document.querySelectorAll("a, button, li, span");
  for (let el of elements) {
    const text = el.innerText.trim().toLowerCase();
    for (let candidate of candidates) {
      if (text === candidate.toLowerCase() || el.title.toLowerCase() === candidate.toLowerCase()) {
        return el;
      }
    }
  }
  return null;
}

// Check if element is active/enabled
function isElementClickable(el) {
  if (el.disabled || el.classList.contains("disabled") || el.getAttribute("aria-disabled") === "true") {
    return false;
  }
  return true;
}
