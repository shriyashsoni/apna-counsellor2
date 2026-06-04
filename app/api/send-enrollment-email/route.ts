import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getEnrollmentWelcomeEmail } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { studentName, studentEmail, courseTitle, startDate, whatsappUrl, googleFormUrl } = body

    if (!studentEmail || !courseTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Apna Counsellor <noreply@apnacounsellor.in>',
      to: [studentEmail],
      subject: `🎉 Welcome to ${courseTitle} — You're Enrolled!`,
      html: getEnrollmentWelcomeEmail({ studentName, courseTitle, startDate, whatsappUrl, googleFormUrl }),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Enrollment email error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
