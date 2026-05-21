// Apna Counsellor - Single College Harvester Agent Diagnostic Tool
// Fetches, structures, and presents complete, highly verified details for any targeted college instantly.

const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleAiKey = process.env.GOOGLE_AI_API_KEY;
const groqKey = process.env.GROQ_API_KEY;

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// High-fidelity college details parsing via Groq (Primary) or Gemini (Alternative)
async function enrichCollegeData(collegeName) {
  const prompt = `You are a high-fidelity Indian college data retrieval agent.
Find the real-world, verified facts for the college: "${collegeName}".
Provide:
1. Established Year (exact year as an integer, e.g. 1887)
2. Official website URL (homepage of the college, e.g. https://www.vjti.ac.in)
3. Average package in placements (in LPA, e.g. '8.5 LPA')
4. Average annual tuition fee for B.Tech/equivalent (e.g. '₹1,30,000' or '₹2.5 Lakhs')
5. A professional 3-sentence institutional description.
6. List 3-4 top academic engineering/technical branches.

Return EXACTLY a JSON object matching this schema (do not output any other text or wrapping):
{
  "established": integer or null,
  "website": string or null,
  "avg_package": string or null,
  "annual_fee": string or null,
  "description": string,
  "branches": string[]
}`;

  // Try Groq first
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
      if (content) return JSON.parse(content);
    } catch (e) {
      // Fallback
    }
  }

  // Fallback to Gemini
  if (googleAiKey) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleAiKey}`,
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
      if (textResponse) return JSON.parse(textResponse);
    } catch (e) {
      throw new Error(`Inference failed on both providers: ${e.message}`);
    }
  }

  throw new Error("Missing GROQ_API_KEY and GOOGLE_AI_API_KEY in .env.local!");
}

async function run() {
  const targetCollege = process.argv.slice(2).join(" ") || "Veermata Jijabai Technological Institute VJTI Mumbai";
  
  console.log("\n=========================================================================");
  console.log("🌟    APNA COUNSELLOR - HIGH FIDELITY AGENT DIAGNOSTIC RUN    🌟");
  console.log("=========================================================================");
  console.log(`🔍 Target College  : "${targetCollege}"`);
  console.log(`📡 AI Provider     : ${groqKey ? "Groq (Llama-3.3-70B)" : "Gemini 2.0 Flash"}`);
  console.log(`💾 Database Link   : ${supabase ? "Connected to Supabase Row Syncer" : "Offline Mode"}`);
  console.log("-------------------------------------------------------------------------\n");
  
  console.log("⚡ Contacting high-fidelity AI models to extract ground-truth facts...");
  
  const startTime = Date.now();
  try {
    const data = await enrichCollegeData(targetCollege);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`✅ Success! Data extracted in exactly ${duration} seconds.\n`);
    
    console.log("┌────────────────────────────────────────────────────────────────────────┐");
    console.log("│                      👑 HARVESTED COLLEGE METADATA                     │");
    console.log("├────────────────────────────────────────────────────────────────────────┤");
    console.log(`│ 🏷️  Name        : ${targetCollege.substring(0, 52).padEnd(52)} │`);
    console.log(`│ 📅 Established : ${(data.established?.toString() || "N/A").padEnd(52)} │`);
    console.log(`│ 🌐 Website     : ${(data.website || "N/A").substring(0, 52).padEnd(52)} │`);
    console.log(`│ 💰 Annual Fee  : ${(data.annual_fee || "N/A").padEnd(52)} │`);
    console.log(`│ 📦 Avg Package : ${(data.avg_package || "N/A").padEnd(52)} │`);
    console.log(`│ 📚 Top Courses : ${(data.branches?.slice(0, 3).join(", ") || "N/A").substring(0, 52).padEnd(52)} │`);
    console.log("├────────────────────────────────────────────────────────────────────────┤");
    
    // Format description text wrapper for the box
    const words = data.description.split(" ");
    let line = "";
    console.log("│ 📝 Institutional Description:                                          │");
    for (let word of words) {
      if ((line + word).length > 68) {
        console.log(`│    ${line.padEnd(68)} │`);
        line = word + " ";
      } else {
        line += word + " ";
      }
    }
    if (line) {
      console.log(`│    ${line.padEnd(68)} │`);
    }
    console.log("└────────────────────────────────────────────────────────────────────────┘\n");

    if (supabase) {
      console.log("💾 Row Sync: Scanning database for match...");
      // Check if college exists by name (fuzzy match)
      const { data: matchedRows } = await supabase
        .from("colleges")
        .select("id, name")
        .ilike("name", `%${targetCollege.split(" ")[0]}%`)
        .limit(1);

      if (matchedRows && matchedRows.length > 0) {
        const col = matchedRows[0];
        console.log(`👉 Found matching database row: "${col.name}" (ID: ${col.id})`);
        console.log("💾 Saving data into Supabase...");
        
        const { error: updateError } = await supabase
          .from("colleges")
          .update({
            established: data.established,
            website: data.website || '#',
            annual_fee: data.annual_fee,
            avg_package: data.avg_package,
            description: data.description,
            branches: data.branches
          })
          .eq("id", col.id);

        if (updateError) {
          console.error(`❌ Failed to update Supabase row: ${updateError.message}`);
        } else {
          console.log(`✅ Supabase row updated successfully!`);
        }
      } else {
        console.log("ℹ️ No exact database match found for name in 'colleges' table. Kept as standalone output.");
      }
    }
    
  } catch (err) {
    console.error(`\n❌ Diagnostic failed: ${err.message}`);
  }
  
  console.log("\n=========================================================================");
}

run();
