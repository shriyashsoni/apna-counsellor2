export async function predictAI(args: {
  exam: string;
  rank: number;
  category: string;
  homeState?: string;
  preferredBranches?: string[];
  verifiedData?: any[]; // Pass top DB results here
}) {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("AI API Key not set");
    return null;
  }

  const verifiedContext = args.verifiedData?.map(d => `${d.name} (${d.branch}) - Cutoff: ${d.cutoffRank}, Tag: ${d.tag}`).join("\n") || "No database matches found.";

  const prompt = `
    You are the elite Apna Counsellor AI Agent, trained on 1.7 Lakh+ Indian college records.
    
    Student Profile:
    - Exam: ${args.exam}
    - Rank: ${args.rank}
    - Category: ${args.category}
    - Home State: ${args.homeState || "Not Specified"}
    - Preferences: ${args.preferredBranches?.join(", ") || "Any"}

    VERIFIED DATABASE RESULTS (Top Matches):
    ${verifiedContext}

    TASK:
    1. Analyze the student's chances based on the VERIFIED DATA above.
    2. Provide a 3-line personalized strategy in Hinglish (Hindi + English). 
    3. If the DB results are empty, advise the student on alternative counselings they should look into.
    
    CRITICAL: 
    - Do NOT suggest colleges not present in the Verified Data list unless you are giving general advice.
    - Your summary must mention 1 Safe, 1 Moderate, and 1 Reach college from the list.

    Return EXACTLY a JSON object:
    {
      "summary": "Your 3-line Hinglish advice here"
    }
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3, // Lower temperature for higher accuracy
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
        }
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    let content = data.candidates[0].content.parts[0].text;
    content = content.replace(/```json\n?/, "").replace(/```\n?/, "").trim();
    
    try {
      const parsed = JSON.parse(content);
      return {
        summary: parsed.summary || ""
      };
    } catch (parseError) {
      console.error("AI Response Parsing Failed:", content);
      return null;
    }
  } catch (error) {
    console.error("AI prediction failed:", error);
    return null;
  }
}


