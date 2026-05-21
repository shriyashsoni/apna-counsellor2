import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import { createMeetEvent } from '@/lib/google-calendar';
import { sendBookingConfirmation, sendMentorBookingNotification } from '@/lib/actions/emails';

export async function POST(req: Request) {
  // Read raw body text first for accurate HMAC verification
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature');

  // 1. Verify Webhook Signature using raw body (NOT re-serialized JSON)
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (secret && signature) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  }

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const event = body.event;

  // Guard: only process payment events with expected payload shape
  if (!body.payload?.payment?.entity) {
    return NextResponse.json({ status: 'ignored' });
  }

  const payload = body.payload.payment.entity;
  const metadata = payload.notes; // This contains our user_id, mentor_id, etc.

  if (event === 'payment.captured') {
    const supabase = createClient();

    if (metadata?.courseId) {
       console.log("Course payment captured. Fulfillment is handled by /api/courses/enroll route.");
       return NextResponse.json({ status: 'success', note: 'course_ignored' });
    }

    const {
      user_id,
      mentor_id,
      session_id,
      date,
      time
    } = metadata;

    try {
      // 2. Fetch Mentor & Student Details
      const [{ data: mentor }, { data: student }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', mentor_id).single(),
        supabase.from('profiles').select('*').eq('id', user_id).single()
      ]);

      if (!mentor || !student) throw new Error("Mentor or Student not found");

      // 3. Generate Google Meet Link (if mentor has linked calendar)
      let meetingLink = "";
      if (mentor.google_refresh_token) {
        try {
          const startTime = new Date(`${date}T${time.split(' - ')[0]}:00`).toISOString();
          const endTime = new Date(new Date(startTime).getTime() + 45 * 60000).toISOString();

          const meetData = await createMeetEvent(mentor.google_refresh_token, {
            summary: `Mentorship: ${student.name} x ${mentor.name}`,
            description: `Admission consultancy session booked via Apna Counsellor.`,
            startTime,
            endTime,
            attendeeEmail: student.email
          });
          
          meetingLink = meetData.hangoutLink || "";
        } catch (err) {
          console.error("Google Meet creation failed:", err);
        }
      }

      // 4. Update Session Status
      await supabase.from('sessions').update({
        student_id: user_id,
        student_name: student.name,
        status: 'confirmed',
        meeting_link: meetingLink
      }).eq('id', session_id);

      // 5. Record Payment for Admin Dashboard
      await supabase.from('payments').upsert({
        user_id,
        mentor_id,
        session_id,
        amount: payload.amount / 100, // Convert from paisa to rupees
        status: 'captured',
        payment_id: payload.id, // Correct column name for unique constraint
        order_id: payload.order_id
      }, { onConflict: 'payment_id' });

      // 6. Send Notifications
      await Promise.all([
        sendBookingConfirmation(student.email, mentor.name, date, time, meetingLink || "/dashboard"),
        sendMentorBookingNotification(mentor.email, student.name, date, time, meetingLink || "/mentor/dashboard")
      ]);

      return NextResponse.json({ status: 'success' });
    } catch (err) {
      console.error("Webhook processing error:", err);
      return NextResponse.json({ error: 'Internal processing failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ status: 'ignored' });
}
