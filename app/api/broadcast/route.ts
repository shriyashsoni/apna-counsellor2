import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await req.json()
    const { subject, html, audience, courseId } = body
    // audience: 'all' | 'course'

    if (!subject || !html || !audience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch recipients from Supabase
    let emails: string[] = []

    if (audience === 'course' && courseId) {
      // All students enrolled in a specific course
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('student:student_id ( email )')
        .eq('course_id', courseId)
        .eq('status', 'active')

      if (error) throw error
      emails = (data || [])
        .map((e: any) => e.student?.email)
        .filter(Boolean)
    } else {
      // All enrolled students across all courses
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('student:student_id ( email )')
        .eq('status', 'active')

      if (error) throw error
      // Deduplicate
      const emailSet = new Set<string>()
      ;(data || []).forEach((e: any) => {
        if (e.student?.email) emailSet.add(e.student.email)
      })
      emails = Array.from(emailSet)
    }

    if (emails.length === 0) {
      return NextResponse.json({ error: 'No enrolled students found for this audience' }, { status: 404 })
    }

    // Resend supports up to 100 recipients per batch call
    // Chunk into batches of 50 for safety
    const CHUNK_SIZE = 50
    const chunks: string[][] = []
    for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
      chunks.push(emails.slice(i, i + CHUNK_SIZE))
    }

    let totalSent = 0
    for (const chunk of chunks) {
      const batchPayload = chunk.map(email => ({
        from: 'Apna Counsellor <onboarding@resend.dev>',
        to: [email],
        subject,
        html,
      }))

      const { data, error } = await resend.batch.send(batchPayload)
      if (error) throw error
      totalSent += chunk.length
    }

    // Log the broadcast in Supabase
    await supabase.from('course_audit_logs').insert({
      action: 'broadcast_sent',
      details: `Broadcast email "${subject}" sent to ${totalSent} students. Audience: ${audience}${courseId ? ` (Course ID: ${courseId})` : ''}`
    })

    return NextResponse.json({ success: true, sent: totalSent, total: emails.length })
  } catch (err: any) {
    console.error('Broadcast error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
