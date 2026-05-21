import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const maxDuration = 60; // Allow more time for AI generation

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const topic = body.topic || "MHT-CET or JEE Counselling Process in India"

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured in .env" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemInstruction = `You are an expert India education writer for 'Apna Counsellor'. 
Your task is to generate a comprehensive, in-depth, SEO-optimized blog post about the given topic. 

Output your response ONLY as a JSON object with NO OTHER TEXT WHATSOEVER. 
Format of JSON:
{
  "title": "A catchy, SEO-friendly H1 title",
  "subtitle": "A short, engaging excerpt (max 150 characters)",
  "body": "The full blog post content in Markdown. Must be detailed (at least 500-800 words), with multiple H2 and H3 tags, bullet points, and a concluding FAQ section. Naturally include mentions to Apna Counsellor's expert guidance.",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"]
}
Do not wrap the JSON in Markdown backticks. Provide only RAW valid JSON.`

    const prompt = `${systemInstruction}\n\nWrite an in-depth blog post about: ${topic}. Please return ONLY valid JSON as requested.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textContent = response.text();
    
    let generatedBlog;
    try {
      // Attempt to parse JSON, removing markdown codeblock formatting if Gemini added it
      const cleanJson = textContent.replace(/^```[a-zA-Z]*\n/, '').replace(/^```/, '').replace(/```$/, '').replace(/\n```$/, '').trim()
      generatedBlog = JSON.parse(cleanJson)
    } catch (parseError) {
      console.error("Failed to parse JSON from AI response:", textContent)
      return NextResponse.json({ error: "AI response was not valid JSON format." }, { status: 500 })
    }

    return NextResponse.json({ success: true, blog: generatedBlog })
  } catch (err: any) {
    console.error("Blog generation error:", err)
    return NextResponse.json({ error: err.message || "Failed to generate blog with AI" }, { status: 500 })
  }
}
