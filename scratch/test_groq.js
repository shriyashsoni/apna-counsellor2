const axios = require("axios");
require("dotenv").config({ path: ".env.local" });

const groqKey = process.env.GROQ_API_KEY;

async function test() {
  console.log("Testing Groq API with key:", groqKey ? "FOUND" : "MISSING");
  
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "user", content: "Hello! Give me a 1-sentence greeting." }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("SUCCESS! Response status:", response.status);
    console.log("Response text:", response.data?.choices?.[0]?.message?.content);
  } catch (error) {
    console.log("ERROR status:", error.response?.status);
    console.log("ERROR data:", JSON.stringify(error.response?.data, null, 2));
  }
}

test();
