import { action } from "./_generated/server";
import { v } from "convex/values";

export const predictAI = action({
  args: {
    exam: v.string(),
    rank: v.number(),
    category: v.string(),
    homeState: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn("GROQ_API_KEY not set, skipping AI prediction");
      return null;
    }

    const prompt = `
      You are an expert Indian college admission counselor. 
      Based on the following student details, predict the top 10 best colleges and branches they might get:
      - Exam: ${args.exam}
      - Rank: ${args.rank}
      - Category: ${args.category}
      - Home State: ${args.homeState || "Not Specified"}
      
      Return the results as a JSON array of objects with the following fields:
      - name: Full college name
      - shortName: Short name or abbreviation
      - branch: Recommended engineering/medical branch
      - probability: Number from 30-95 representing admission chance
      - state: State of the college
      - type: Government or Private
      - annualFee: Estimated annual fee in INR (e.g. "₹2.5L")
      - avgPackage: Estimated average package (e.g. "₹12 LPA")
      - nirfRank: Approximate NIRF rank
      
      Only return the JSON array, no other text.
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

      const data = await response.json();
      const content = data.choices[0].message.content;
      // Some models might wrap it in a root object
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : (parsed.colleges || parsed.results || []);
    } catch (error) {
      console.error("Groq AI prediction failed:", error);
      return null;
    }
  },
});
