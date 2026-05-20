const axios = require("axios");
require("dotenv").config({ path: ".env.local" });

const apiKey = process.env.GOOGLE_AI_API_KEY;

async function test() {
  console.log("Listing models with key...");
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    console.log("SUCCESS!");
    const models = response.data?.models || [];
    for (const m of models) {
      console.log(` - Model: ${m.name} | Methods: ${m.supportedGenerationMethods.join(", ")}`);
    }
  } catch (error) {
    console.log("ERROR status:", error.response?.status);
    console.log("ERROR data:", JSON.stringify(error.response?.data, null, 2));
  }
}

test();
