// Apna Counsellor College Harvester - Background Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log("🌟 Apna Counsellor - College Harvester Extension Agent Active!");
});

// Manage connections and state across multiple tabs if necessary
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Can be used for cross-tab communication or session storage
  return true;
});
