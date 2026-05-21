import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await req.json()
    const { subject, html, audience, courseId } = body
    // audience: 'all_users' | 'enrolled' | 'course'

    if (!subject || !html || !audience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let emails: string[] = []
    const emailSet = new Set<string>()

    if (audience === 'all_users') {
      // ─── ALL registered users on the platform (from profiles table) ───
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .not('email', 'is', null)

      if (error) throw error
      ;(data || []).forEach((p: any) => {
        if (p.email) emailSet.add(p.email)
      })
      emails = Array.from(emailSet)

    } else if (audience === 'course' && courseId) {
      // ─── Students enrolled in a specific course ───
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('student:student_id ( email )')
        .eq('course_id', courseId)
        .eq('status', 'active')

      if (error) throw error
      ;(data || []).forEach((e: any) => {
        if (e.student?.email) emailSet.add(e.student.email)
      })
      emails = Array.from(emailSet)

    } else {
      // ─── All enrolled students across all courses ───
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('student:student_id ( email )')
        .eq('status', 'active')

      if (error) throw error
      ;(data || []).forEach((e: any) => {
        if (e.student?.email) emailSet.add(e.student.email)
      })
      emails = Array.from(emailSet)
    }

    if (emails.length === 0) {
      return NextResponse.json({ error: 'No recipients found for this audience' }, { status: 404 })
    }

    // Chunk into batches of 50 for Resend safety
    const CHUNK_SIZE = 50
    const chunks: string[][] = []
    for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
      chunks.push(emails.slice(i, i + CHUNK_SIZE))
    }

    let totalSent = 0
    for (const chunk of chunks) {
      const batchPayload = chunk.map(email => ({
        from: 'Apna Counsellor <noreply@apnacounsellor.in>',
        to: [email],
        subject,
        html,
      }))

      const { data, error } = await resend.batch.send(batchPayload)
      if (error) throw error
      totalSent += chunk.length
    }

    // Log it
    const audienceLabel =
      audience === 'all_users' ? 'ALL Platform Users' :
      audience === 'course' ? `Course Enrollees (ID: ${courseId})` :
      'All Enrolled Students'

    await supabase.from('course_audit_logs').insert({
      action: 'broadcast_sent',
      details: `Broadcast "${subject}" sent to ${totalSent} recipients. Audience: ${audienceLabel}`
    })

    return NextResponse.json({ success: true, sent: totalSent, total: emails.length })
  } catch (err: any) {
    console.error('Broadcast error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
