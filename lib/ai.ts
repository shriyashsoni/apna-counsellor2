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
    You are an elite Indian college admission counselor with access to 2024-2025 cutoff data for JoSAA, CSAB, MHT-CET, WBJEE, COMEDK, and State DTE counselings.
    Based on the following student details, predict the top 15-20 best-fit colleges and branches:
    - Exam: ${args.exam}
    - Score/Rank: ${args.rank}
    - Category: ${args.category}
    - Home State: ${args.homeState || "Not Specified"}
    - Preferred Branches: ${args.preferredBranches?.join(", ") || "Any Engineering Branch"}
    
    Logic Requirements:
    1. HS (Home State) vs OS (Other State) Quota analysis.
    2. Category Reservation impact (OBC/SC/ST/EWS/PWD).
    3. Historical 2024 Rank Shifts (e.g., CSE cutoffs moving 10-15%).
    4. Consider NIRF ranking and placement records.
    
    Reference Benchmarks:
    - IIT Bombay CSE: < 60 (Gen)
    - NIT Trichy CSE: < 1500 (Gen)
    - VJTI/COEP (MHT-CET): < 200 Rank
    - Top Private (BITS/VIT): Competitive ranks
    
    Return EXACTLY a JSON object with a "colleges" key. Each college object must have:
    - name (Full name)
    - branch (Specific branch)
    - probability (40-99 as integer)
    - state (Location)
    - type (Government/Private/IIT/NIT)
    - avgPackage (e.g., "₹15 LPA")
    - nirfRank (Number or null)
    - reason (1 sentence explaining the fit)
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      return null;
    }

    const data = await response.json();
    if (!data.candidates || !data.candidates[0].content) {
      console.error("Gemini API Unexpected Response:", JSON.stringify(data));
      return null;
    }

    let content = data.candidates[0].content.parts[0].text;
    
    // Clean content if it contains markdown code blocks
    content = content.replace(/```json\n?/, "").replace(/```\n?/, "").trim();
    
    try {
      const parsed = JSON.parse(content);
      
      if (parsed.colleges && Array.isArray(parsed.colleges)) {
        return parsed.colleges;
      }
      
      if (Array.isArray(parsed)) return parsed;

      const firstArray = Object.values(parsed).find(v => Array.isArray(v));
      return (firstArray as any[]) || [];
    } catch (parseError) {
      console.error("AI Response Parsing Failed:", content);
      return null;
    }
  } catch (error) {
    console.error("AI prediction failed:", error);
    return null;
  }
}
