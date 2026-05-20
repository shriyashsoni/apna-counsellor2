const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleAiKey = process.env.GOOGLE_AI_API_KEY;
const groqKey = process.env.GROQ_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing required Supabase environment variables in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// High-fidelity college details parsing via Groq (Primary & Resilient) or Gemini (Alternative)
async function enrichCollegeData(collegeName, collegeCity, collegeState) {
  const prompt = `You are a high-fidelity Indian college data retrieval agent.
Find the real-world, verified facts for: "${collegeName}" located in "${collegeCity || ''}, ${collegeState || ''}".
Provide:
1. Established Year (exact year as an integer, e.g. 1996)
2. Official website URL (homepage of the college, e.g. https://www.vjti.ac.in)
3. Average package in placements (in LPA, e.g. '8.5 LPA')
4. Average annual tuition fee for B.Tech/equivalent (e.g. '₹1,30,000' or '₹2.5 Lakhs')
5. A professional 3-sentence institutional description.
6. List 3-4 top academic engineering/technical branches.

Return EXACTLY a JSON object matching this schema:
{
  "established": integer or null,
  "website": string or null,
  "avg_package": string or null,
  "annual_fee": string or null,
  "description": string,
  "branches": string[]
}`;

  // Try Groq first as it has excellent rate limits and JSON mode
  if (groqKey) {
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            "Authorization": `Bearer ${groqKey}`,
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );
      
      const content = response.data?.choices?.[0]?.message?.content;
      if (content) {
        return JSON.parse(content);
      }
    } catch (e) {
      console.log(`   ⚠️ Groq query failed (${e.message}). Trying Gemini...`);
    }
  }

  // Fallback to Gemini if Groq fails or is missing
  if (googleAiKey) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleAiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                established: { type: "INTEGER" },
                website: { type: "STRING" },
                avg_package: { type: "STRING" },
                annual_fee: { type: "STRING" },
                description: { type: "STRING" },
                branches: { type: "ARRAY", items: { type: "STRING" } }
              },
              required: ["established", "website", "avg_package", "annual_fee", "description", "branches"]
            }
          }
        },
        { headers: { "Content-Type": "application/json" }, timeout: 10000 }
      );

      const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textResponse) {
        return JSON.parse(textResponse);
      }
    } catch (e) {
      throw new Error(`Enrichment failed for both Groq and Gemini: ${e.message}`);
    }
  }

  throw new Error("Missing both GROQ_API_KEY and GOOGLE_AI_API_KEY!");
}

async function enrichCollegeDataWithRetry(collegeName, collegeCity, collegeState, retries = 5, delay = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await enrichCollegeData(collegeName, collegeCity, collegeState);
    } catch (e) {
      const isRateLimit = e.message.includes("429") || e.message.toLowerCase().includes("rate limit") || e.message.toLowerCase().includes("too many requests") || e.message.includes("503") || e.message.toLowerCase().includes("quota");
      
      if (attempt === retries) {
        throw e;
      }
      
      const waitTime = isRateLimit ? delay * attempt * 4 : delay * attempt;
      console.log(`   ⚠️ Attempt ${attempt} failed: ${e.message}. Retrying in ${waitTime / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

async function startAgent() {
  console.log("\n=======================================================");
  console.log("🌟   WELCOME TO THE APNA COUNSELLOR LOCAL AI DATA AGENT   🌟");
  console.log("=======================================================");
  console.log("✨ Ground-truths & enriches real college details using LLMs!");
  console.log("🚀 Upgrades your Supabase database in real-time.\n");

  const limit = parseInt(process.argv[2]) || 10;
  const stateFilter = process.argv[3] || null;

  console.log(`Config: Target = ${limit} colleges | State Filter = ${stateFilter || "None"}`);
  console.log(`Provider Status: Groq = ${groqKey ? "ACTIVE" : "OFFLINE"} | Gemini = ${googleAiKey ? "ACTIVE" : "OFFLINE"}`);

  // Fetch colleges that are missing established or website or package details
  let query = supabase
    .from("colleges")
    .select("id, name, city, state, established, website, avg_package")
    .or("established.is.null,website.eq.#,website.is.null,avg_package.is.null");

  if (stateFilter) {
    query = query.eq("state", stateFilter);
  }

  query = query.limit(limit);

  const { data: targetColleges, error: fetchError } = await query;

  if (fetchError) {
    console.error("❌ Failed to query target colleges:", fetchError.message);
    process.exit(1);
  }

  if (!targetColleges || targetColleges.length === 0) {
    console.log("🎉 Outstanding! All colleges already have populated real data!");
    return;
  }

  console.log(`📋 Found ${targetColleges.length} colleges requiring data enrichment.`);

  let successCount = 0;

  for (let i = 0; i < targetColleges.length; i++) {
    const col = targetColleges[i];
    console.log(`\n-------------------------------------------------------`);
    console.log(`🔍 [${i + 1}/${targetColleges.length}] Enriching: "${col.name}"`);
    console.log(`📍 Location: ${col.city || "Unknown City"}, ${col.state || "Unknown State"}`);
    
    try {
      const realData = await enrichCollegeDataWithRetry(col.name, col.city, col.state);
      
      console.log("💡 Real Details Retrieved:");
      console.log(` - Website: ${realData.website || "N/A"}`);
      console.log(` - Established: ${realData.established || "N/A"}`);
      console.log(` - Avg Package: ${realData.avg_package || "N/A"}`);
      console.log(` - Annual Fee: ${realData.annual_fee || "N/A"}`);
      console.log(` - Top Branches: ${realData.branches?.slice(0, 3).join(", ") || "None"}`);
      console.log(` - Profile Excerpt: "${realData.description?.substring(0, 60)}..."`);

      console.log("💾 Upgrading database row...");
      
      const updatePayload = {
        website: realData.website || col.website || '#',
        established: realData.established || col.established,
        avg_package: realData.avg_package || col.avg_package,
        annual_fee: realData.annual_fee,
        description: realData.description,
        branches: realData.branches
      };

      const { error: updateError } = await supabase
        .from("colleges")
        .update(updatePayload)
        .eq("id", col.id);

      if (updateError) {
        console.error(`❌ Failed to update Supabase row: ${updateError.message}`);
      } else {
        console.log(`✅ Supabase row updated successfully!`);
        successCount++;
      }

    } catch (e) {
      console.error(`❌ Agent failed to enrich "${col.name}":`, e.message);
    }

    // Delay 1 second to be gentle on APIs and DB connections
    if (i < targetColleges.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n=======================================================`);
  console.log(`🎉 AGENT TASK COMPLETED!`);
  console.log(`📈 Successfully enriched & upgraded: ${successCount}/${targetColleges.length} colleges.`);
  console.log(`=======================================================\n`);
}

startAgent();
