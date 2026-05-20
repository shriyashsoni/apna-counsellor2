const axios = require("axios");
require("dotenv").config({ path: ".env.local" });

const groqKey = process.env.GROQ_API_KEY;

async function testCollege(name) {
  console.log(`Querying Llama 3.3 for: "${name}"...`);
  
  const prompt = `You are a high-fidelity Indian college data retrieval agent.
Find the real-world, verified facts for: "${name}".
Provide:
1. Established Year (exact year)
2. Official website URL (homepage)
3. Average package in placements (in LPA, e.g. '8.5 LPA')
4. Annual tuition fee (e.g. '₹1,30,000')
5. A professional 3-sentence description.
6. List 3-4 top academic engineering branches.

Return EXACTLY a JSON object matching this schema:
{
  "established": integer or null,
  "website": string or null,
  "avg_package": string or null,
  "annual_fee": string or null,
  "description": string,
  "branches": string[]
}`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    console.log("SUCCESS!");
    const content = response.data?.choices?.[0]?.message?.content;
    console.log(JSON.stringify(JSON.parse(content), null, 2));
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }
}

async function run() {
  await testCollege("College of Engineering, Pune");
  console.log("\n-------------------------------------------------\n");
  await testCollege("Walchand College of Engineering, Sangli");
}

run();
