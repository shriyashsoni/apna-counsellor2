export async function predictAI(args: {
  exam: string;
  rank: number;
  category: string;
  homeState?: string;
  preferredBranches?: string[];
}) {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("GROQ_API_KEY not set");
    return null;
  }

  const prompt = `
    You are an expert Indian college admission counselor with deep knowledge of JoSAA, CSAB, MHT-CET, WBJEE, COMEDK, and State DTE counselings.
    Based on the following student details, predict the top 15 best-fit colleges and branches they might get:
    - Exam: ${args.exam}
    - Score/Rank: ${args.rank}
    - Category: ${args.category}
    - Home State: ${args.homeState || "Not Specified"}
    - Preferred Branches: ${args.preferredBranches?.join(", ") || "Any"}
    
    Consider Home State Quota (HS) vs Other State Quota (OS) logic. 
    For JEE Mains, consider NITs, IIITs, and GFTIs. 
    For MHT-CET, consider top private and government colleges in Maharashtra.
    
    Return the results as a JSON object with a key "colleges" containing an array of objects with these fields:
    - name: Full college name
    - branch: Recommended branch
    - probability: Percentage chance (40-98)
    - state: College state
    - type: Government/Private
    - avgPackage: e.g., "₹12 LPA"
    - nirfRank: Approximate NIRF rank (if applicable)
    - reason: Brief 1-sentence reason why this is a good match
  `;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    if (Array.isArray(parsed)) return parsed;
    if (parsed.colleges && Array.isArray(parsed.colleges)) return parsed.colleges;
    
    const firstArray = Object.values(parsed).find(v => Array.isArray(v));
    return (firstArray as any[]) || [];
  } catch (error) {
    console.error("AI prediction failed:", error);
    return null;
  }
}
