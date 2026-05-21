import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getContactQueryEmail, getContactAutoReplyEmail } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = 'apnacounsellor@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message, queryType = 'general' } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Send notification to admin
    await resend.emails.send({
      from: 'Apna Counsellor Contact <noreply@apnacounsellor.in>',
      to: [ADMIN_EMAIL],
      subject: `[${queryType.toUpperCase()}] New Query: ${subject}`,
      html: getContactQueryEmail({ name, email, phone, subject, message, queryType }),
    })

    // 2. Send auto-reply to user
    await resend.emails.send({
      from: 'Apna Counsellor <noreply@apnacounsellor.in>',
      to: [email],
      subject: `We received your query: "${subject}"`,
      html: getContactAutoReplyEmail({ name, subject }),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Contact email error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
