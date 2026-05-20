import { NextResponse } from "next/server"

const BLOG_AGENT_URL = process.env.BLOG_AGENT_URL || "https://blog-agent-2kts.onrender.com"
const BLOG_AGENT_SECRET_KEY = process.env.BLOG_AGENT_SECRET_KEY || ""

export async function POST() {
  if (!BLOG_AGENT_SECRET_KEY) {
    return NextResponse.json({ error: "Agent secret key not configured" }, { status: 500 })
  }

  try {
    const res = await fetch(`${BLOG_AGENT_URL}/api/trigger`, {
      method: "POST",
      headers: {
        "X-Agent-Key": BLOG_AGENT_SECRET_KEY,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: `Agent responded with ${res.status}: ${text}` }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, message: data.message })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to reach blog agent" }, { status: 500 })
  }
}
