export async function predictAI(args: {
  exam: string;
  rank: number;
  category: string;
  homeState?: string;
  preferredBranches?: string[];
}) {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("AI API Key not set");
    return null;
  }

  const prompt = `
    You are an elite Indian college admission counselor (Apna Counsellor AI).
    Based on the following student details:
    - Exam: ${args.exam}
    - Score/Rank: ${args.rank}
    - Category: ${args.category}
    - Home State: ${args.homeState || "Not Specified"}
    - Preferred Branches: ${args.preferredBranches?.join(", ") || "Any Engineering Branch"}
    
    Tasks:
    1. Predict top 10-15 best-fit colleges.
    2. Provide a 3-line personalized recommendation in Hinglish. Mention their best safe pick, best moderate pick, and one reach college.

    Return EXACTLY a JSON object with two keys:
    1. "colleges": Array of objects {name, branch, probability (40-99), state, type, avgPackage, nirfRank, reason, tag ("Safe"|"Moderate"|"Reach")}
    2. "summary": String (The 3-line Hinglish recommendation)
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
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
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
        colleges: parsed.colleges || [],
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

