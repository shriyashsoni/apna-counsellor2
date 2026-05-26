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

CRITICAL CALL-TO-ACTION REQUIREMENT: You must ensure that every single email template ends with this exact message right before your sign-off:
"If you are interested to do that partnership, please reply to this email saying 'I am interested' and my team will contact you soon."
This CTA makes it extremely easy for partners to reply directly from their mobile phones. Do not omit this.

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

    // Try GROQ API (groq.com) or x.ai Grok API
    let resultJsonStr = "";
    const groqKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY || process.env.XAI_API_KEY;
    
    if (!groqKey) {
      throw new Error("No AI API key found. Please define GROQ_API_KEY (with a Q) or GROK_API_KEY in your environment variables.");
    }

    if (groqKey.startsWith("gsk_")) {
      // User has a Groq key (groq.com)
      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7
        })
      });
      
      if (!groqResponse.ok) {
        const errorText = await groqResponse.text();
        throw new Error(`Groq API Error: ${errorText}`);
      }
      
      const data = await groqResponse.json();
      resultJsonStr = data.choices[0].message.content;
    } else {
      // User has an x.ai Grok key
      const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
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
    }

    const emailData = JSON.parse(resultJsonStr);

    return NextResponse.json({ success: true, data: emailData });
  } catch (error: any) {
    console.error("AI Email Generation Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
