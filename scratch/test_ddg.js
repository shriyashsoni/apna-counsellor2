const axios = require("axios");

async function searchDDG(query) {
  console.log(`Searching DuckDuckGo for: "${query}"...`);
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      }
    });
    
    const html = response.data;
    // Extract search snippets
    const snippets = [];
    const regex = /<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    while ((match = regex.exec(html)) !== null && snippets.length < 5) {
      let snippet = match[1]
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/\s+/g, " ")     // Normalize whitespace
        .trim();
      snippets.push(snippet);
    }
    
    return snippets;
  } catch (error) {
    console.error("DDG Search Error:", error.message);
    return [];
  }
}

async function test() {
  const snippets = await searchDDG("COEP Technological University Pune established year average package website");
  console.log("Found search results:");
  snippets.forEach((s, i) => console.log(`[Snippet ${i + 1}]: ${s}\n`));
}

test();
