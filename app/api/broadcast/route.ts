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

    let finalUsers: { id: string, email: string }[] = []
    const uniqueUsersMap = new Map<string, { id: string, email: string }>()

    if (audience === 'all_users') {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email')
        .not('email', 'is', null)

      if (error) throw error
      ;(data || []).forEach((p: any) => {
        if (p.email && p.id) uniqueUsersMap.set(p.id, p)
      })

    } else if (audience === 'course' && courseId) {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('student:student_id ( id, email )')
        .eq('course_id', courseId)
        .eq('status', 'active')

      if (error) throw error
      ;(data || []).forEach((e: any) => {
        if (e.student?.email && e.student?.id) uniqueUsersMap.set(e.student.id, e.student)
      })

    } else {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('student:student_id ( id, email )')
        .eq('status', 'active')

      if (error) throw error
      ;(data || []).forEach((e: any) => {
        if (e.student?.email && e.student?.id) uniqueUsersMap.set(e.student.id, e.student)
      })
    }

    finalUsers = Array.from(uniqueUsersMap.values())
    const emails = finalUsers.map(u => u.email)

    if (finalUsers.length === 0) {
      return NextResponse.json({ error: 'No recipients found for this audience' }, { status: 404 })
    }

    // Insert into notifications table
    const notificationPayloads = finalUsers.map(u => ({
      user_id: u.id,
      title: subject,
      message: 'New batch broadcast received. Please check your email for full details and links.',
      type: 'info',
      is_broadcast: true,
      link: courseId ? \`/dashboard\` : null
    }))

    for (let i = 0; i < notificationPayloads.length; i += 500) {
      await supabase.from('notifications').insert(notificationPayloads.slice(i, i + 500))
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
