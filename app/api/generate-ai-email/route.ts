import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url, companyName, purpose, additionalContext, emailLength } = await req.json()

    let websiteContent = ""
    if (url) {
      console.log(`Scraping URL: ${url}`);
      try {
        const response = await fetch(`https://r.jina.ai/${url}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
          }
        });
        if (response.ok) {
          websiteContent = await response.text();
          // Truncate to first 5000 characters to save tokens
          websiteContent = websiteContent.substring(0, 5000);
        }
      } catch (e) {
        console.warn("Jina Reader failed", e);
      }
    }

    const systemPrompt = `You are an expert partnership email copywriter for Apna Counsellor (apnacounsellor.in), a leading platform providing career counselling, cut-off predictors, mentoring, and academic resource hubs.
Our organization wants to build meaningful partnerships with colleges, schools, companies, and student organizations.
Our theme: Providing transparent, tech-driven counselling, mentoring, cut-off prediction, and developer training.
Your task is to write 3 short, simple, and effective email templates (Formal, Friendly, Creative) to initiate a partnership based on the provided context.
IMPORTANT: Keep the templates simple. DO NOT use funky designs. Output the templates in clean HTML (use <p>, <br>, <strong>).
Do not include the outer HTML skeleton, just the content body.

Output exactly a JSON object matching this structure:
{
  "subject": "Main Subject",
  "content": "Main HTML content",
  "templates": {
    "formal": { "subject": "Formal Subject", "content": "Formal HTML content" },
    "friendly": { "subject": "Friendly Subject", "content": "Friendly HTML content" },
    "creative": { "subject": "Creative Subject", "content": "Creative HTML content" }
  }
}
`;

    const userPrompt = `
Target Company/College/Organization: ${companyName || 'Not provided'}
Website Context: ${websiteContent ? websiteContent : 'Not provided'}
Purpose: ${purpose}
Additional Context: ${additionalContext || 'None'}
Preferred Length: ${emailLength}

Write the email templates focusing on collaboration. Make them simple and direct.
`;

    // Try GROK API first, then fallback to Google Gemini
    let resultJsonStr = "";
    const grokKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
    
    if (grokKey) {
      const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${grokKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "grok-beta",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7
        })
      });
      
      if (!grokResponse.ok) {
        const errorText = await grokResponse.text();
        throw new Error(`Grok API Error: ${errorText}`);
      }
      
      const data = await grokResponse.json();
      resultJsonStr = data.choices[0].message.content;
    } else {
      // Fallback to Google Gemini
      const googleKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;
      if (!googleKey) {
        throw new Error("No AI API key found (GROK_API_KEY, GOOGLE_AI_API_KEY, GEMINI_API_KEY, or GOOGLE_AI_KEY). Please add one to your environment variables.");
      }
      
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${googleKey}`;
      const geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          }
        })
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        throw new Error(`Gemini API Error: ${errorText}`);
      }
      
      const data = await geminiResponse.json();
      resultJsonStr = data.candidates[0].content.parts[0].text;
    }

    const emailData = JSON.parse(resultJsonStr);

    return NextResponse.json({ success: true, data: emailData });
  } catch (error: any) {
    console.error("AI Email Generation Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
