const axios = require("axios");

async function test() {
  try {
    const url = "https://html.duckduckgo.com/html/?q=COEP+Pune+established+year";
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      }
    });
    const html = response.data;
    console.log("HTML length:", html.length);
    // Find some snippets or look at the structure
    // Let's search if the class "result__snippet" is in the HTML
    console.log("Contains result__snippet:", html.includes("result__snippet"));
    console.log("First 1000 characters of body:");
    const bodyIndex = html.indexOf("<body");
    if (bodyIndex !== -1) {
      console.log(html.substring(bodyIndex, bodyIndex + 2000));
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

test();
