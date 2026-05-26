import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html, replyTo } = await req.json()

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required email fields (to, subject, html)" }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "RESEND_API_KEY is not configured" }, { status: 500 })
    }

    // Use the specific email requested by the user
    const fromEmail = "Apna Counsellor <shriyash.soni@apnacounsellor.in>";
    // Use the same for replyTo if not explicitly provided
    const replyToEmail = replyTo || "shriyash.soni@apnacounsellor.in";

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: to,
      reply_to: replyToEmail,
      subject: subject,
      html: html,
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Email Sending Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
