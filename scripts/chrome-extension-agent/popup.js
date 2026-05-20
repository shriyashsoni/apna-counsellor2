// Apna Counsellor College Harvester - Popup script
let isScraping = false;
let scrapedData = [];
let pagesScraped = 0;
let successRate = 100;
let maxLimit = 1000;
let delaySec = 2.5;

// DOM Elements
const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");
const btnClearLogs = document.getElementById("btn-clear-logs");
const btnExportCsv = document.getElementById("btn-export-csv");
const btnExportJson = document.getElementById("btn-export-json");
const scrapedCountText = document.getElementById("scraped-count");
const pagesCountText = document.getElementById("pages-count");
const successRateText = document.getElementById("success-rate");
const statusText = document.getElementById("status-text");
const progressPercentText = document.getElementById("progress-percent");
const progressBar = document.getElementById("scraper-progress");
const consoleLogs = document.getElementById("console-logs");
const scraperPreset = document.getElementById("scraper-preset");
const presetTooltip = document.getElementById("preset-tooltip");
const customSelectorsDrawer = document.getElementById("custom-selectors");
const limitItemsInput = document.getElementById("limit-items");
const delaySecInput = document.getElementById("delay-sec");

// Presets Tooltips Map
const tooltips = {
  aishe: "Scrapes AISHE codes, names, states, cities, types and details from official government directory.",
  shiksha: "Extracts college details, fees, ranking, courses and user ratings from Shiksha colleges search.",
  collegedekho: "Harvests colleges listings, locations, average fees, and established dates from CollegeDekho.",
  custom: "Runs customized extraction using CSS selectors that you define on any page."
};

// Preset Change Listener
scraperPreset.addEventListener("change", () => {
  const selected = scraperPreset.value;
  presetTooltip.innerText = tooltips[selected] || "Harvest college details.";
  
  if (selected === "custom") {
    customSelectorsDrawer.style.display = "block";
  } else {
    customSelectorsDrawer.style.display = "none";
  }
});

// Logger Helper
function log(message, type = "info") {
  const entry = document.createElement("div");
  entry.className = `log-entry ${type}`;
  
  const timestamp = new Date().toLocaleTimeString();
  entry.innerText = `[${timestamp}] ${message}`;
  
  consoleLogs.appendChild(entry);
  consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

btnClearLogs.addEventListener("click", () => {
  consoleLogs.innerHTML = "";
  log("Console logs cleared.", "info");
});

// Update Statistics UI
function updateStats() {
  scrapedCountText.innerText = scrapedData.length;
  pagesCountText.innerText = pagesScraped;
  
  // Calculate Progress
  const percent = Math.min(Math.round((scrapedData.length / maxLimit) * 100), 100);
  progressPercentText.innerText = `${percent}%`;
  progressBar.style.width = `${percent}%`;
  
  if (scrapedData.length > 0) {
    btnExportCsv.disabled = false;
    btnExportJson.disabled = false;
  }
}

// Start Scraper Trigger
btnStart.addEventListener("click", async () => {
  maxLimit = parseInt(limitItemsInput.value) || 1000;
  delaySec = parseFloat(delaySecInput.value) || 2.5;

  log(`Initializing Harvester Agent...`, "info");
  log(`Configurations: Target=${maxLimit} | Speed Interval=${delaySec}s`, "info");
  log(`Checking current active tab status...`, "info");

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    log("❌ Error: No active browser tab found!", "error");
    return;
  }

  if (tab.url.startsWith("chrome://")) {
    log("❌ Error: Cannot run scraping agent on internal chrome:// pages!", "error");
    log("👉 Please navigate to your college directory listing website first.", "warning");
    return;
  }

  isScraping = true;
  btnStart.disabled = true;
  btnStop.disabled = false;
  scraperPreset.disabled = true;
  limitItemsInput.disabled = true;
  delaySecInput.disabled = true;

  statusText.innerText = "Harvesting college data in progress...";
  log(`🔗 Target Website Detected: ${new URL(tab.url).hostname}`, "success");
  
  // Send message to background script or inject directly
  startScrapingFlow(tab.id);
});

// Stop Scraper Trigger
btnStop.addEventListener("click", () => {
  isScraping = false;
  btnStart.disabled = false;
  btnStop.disabled = true;
  scraperPreset.disabled = false;
  limitItemsInput.disabled = false;
  delaySecInput.disabled = false;

  statusText.innerText = "Harvesting paused.";
  log("🛑 Scraping agent execution suspended by user.", "warning");
  
  // Send stop instruction to active tab
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (tab) {
      chrome.tabs.sendMessage(tab.id, { action: "stop_scraping" }).catch(() => {});
    }
  });
});

// Run Scraping Flow inside Active Tab
async function startScrapingFlow(tabId) {
  const preset = scraperPreset.value;
  const config = {
    preset: preset,
    maxLimit: maxLimit,
    delayMs: delaySec * 1000,
    selectors: {}
  };

  if (preset === "custom") {
    config.selectors = {
      item: document.getElementById("selector-item").value,
      name: document.getElementById("selector-name").value,
      state: document.getElementById("selector-state").value,
      city: document.getElementById("selector-city").value,
      website: document.getElementById("selector-website").value,
      next: document.getElementById("selector-next").value
    };
    
    if (!config.selectors.item || !config.selectors.name) {
      log("❌ Error: Item and Name CSS Selectors are mandatory in custom mode!", "error");
      btnStop.click();
      return;
    }
  }

  log(`💉 Injecting harvester content scripts...`, "info");
  
  try {
    // Ensure content script is running by sending ping, if not inject it
    await chrome.tabs.sendMessage(tabId, { action: "ping" });
  } catch (e) {
    // Inject scripts manually if they are not already loaded
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["content.js"]
      });
      log("✅ Scraper scripts injected successfully.", "success");
    } catch (injectError) {
      log(`❌ Dynamic injection failed: ${injectError.message}`, "error");
      btnStop.click();
      return;
    }
  }

  log("🚀 Executing data collection loop...", "info");
  chrome.tabs.sendMessage(tabId, {
    action: "start_scraping",
    config: config
  }).catch(err => {
    log(`❌ Failed to deliver start instruction: ${err.message}`, "error");
    btnStop.click();
  });
}

// Receive messages from Content Script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!isScraping) return;

  switch (message.action) {
    case "log":
      log(message.data, message.logType || "info");
      break;
      
    case "batch_extracted":
      const batch = message.data || [];
      pagesScraped = message.pagesCount || pagesScraped + 1;
      
      // Merge unique colleges by Name + State/City to avoid duplicates
      batch.forEach(col => {
        const duplicate = scrapedData.find(d => d.name.toLowerCase() === col.name.toLowerCase() && d.city === col.city);
        if (!duplicate) {
          scrapedData.push(col);
        }
      });
      
      log(`📦 Extracted batch of ${batch.length} colleges. Total unique harvested: ${scrapedData.length}`, "success");
      updateStats();
      
      if (scrapedData.length >= maxLimit) {
        log(`🎉 Reached target maximum limit of ${maxLimit} colleges!`, "success");
        statusText.innerText = "Completed successfully!";
        btnStop.click();
      }
      break;
      
    case "scraping_complete":
      log(`🏁 Scraping loop completed. Scraped ${pagesScraped} pages, harvested ${scrapedData.length} colleges total.`, "success");
      statusText.innerText = "Task completed.";
      btnStop.click();
      break;

    case "scraping_error":
      log(`⚠️ Active page reports error: ${message.data}`, "error");
      break;
  }
});

// CSV Export Utility
btnExportCsv.addEventListener("click", () => {
  if (scrapedData.length === 0) return;
  
  log("Generating CSV file representation...", "info");
  
  // Extract unique headers
  const headers = ["name", "state", "city", "aishe_code", "type", "established", "annual_fee", "avg_package", "website", "description"];
  
  let csvContent = headers.join(",") + "\n";
  
  scrapedData.forEach(row => {
    const formattedRow = headers.map(header => {
      let val = row[header] || "";
      if (typeof val === "object") val = JSON.stringify(val);
      
      // Clean string for CSV escaping
      val = val.toString().replace(/"/g, '""');
      return `"${val}"`;
    });
    csvContent += formattedRow.join(",") + "\n";
  });
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `apna_counsellor_colleges_${Date.now()}.csv`;
  a.click();
  log(`💾 Download triggered: ${a.download}`, "success");
});

// JSON Export Utility
btnExportJson.addEventListener("click", () => {
  if (scrapedData.length === 0) return;
  
  log("Packaging JSON representation...", "info");
  
  const blob = new Blob([JSON.stringify(scrapedData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `apna_counsellor_colleges_${Date.now()}.json`;
  a.click();
  log(`💾 Download triggered: ${a.download}`, "success");
});
