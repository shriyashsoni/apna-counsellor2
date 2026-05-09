import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendBookingConfirmation, sendAdminNotification } from '@/lib/actions/emails'
import { createMeetEvent } from '@/lib/google-calendar'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  
  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body)
  const { payload } = event

  if (event.event === 'order.paid') {
    const order = payload.order.entity
    const payment = payload.payment.entity
    const { notes } = order
    console.log("🔔 Processing order.paid event for order:", order.id, "Notes:", notes)

    try {
      // 1. Record the payment
      const { data: paymentData, error: paymentError } = await supabaseAdmin
        .from('payments')
        .upsert({
          payment_id: payment.id,
          order_id: order.id,
          amount: order.amount / 100,
          currency: order.currency,
          status: 'captured',
          user_id: notes.user_id,
          mentor_id: notes.mentor_id,
          session_id: notes.session_id,
          type: notes.type || 'mentorship_session',
          created_at: new Date().toISOString()
        }, { onConflict: 'payment_id' })

      if (paymentError) throw paymentError

      // 2. Handle specific payment types
      if (notes.type === 'mentorship_session' && notes.session_id) {
        // Update session status
        const { error: sessionError } = await supabaseAdmin
          .from('sessions')
          .update({
            student_id: notes.user_id,
            status: 'confirmed'
          })
          .eq('id', notes.session_id)
        
        if (sessionError) throw sessionError

        // Fetch user and mentor data
        const { data: userData } = await supabaseAdmin.from('profiles').select('name, email').eq('id', notes.user_id).single()
        const { data: mentorData } = await supabaseAdmin.from('profiles').select('name, google_refresh_token').eq('id', notes.mentor_id).single()

        if (userData && mentorData) {
          let meetingLink = "https://meet.google.com/apna-counsellor"; // Fallback

          // 3. Create Google Meet link if mentor has linked calendar
          if (mentorData.google_refresh_token) {
            try {
              // Get session details for the event
              const { data: sessionData } = await supabaseAdmin.from('sessions').select('*').eq('id', notes.session_id).single()
              
              if (sessionData) {
                // Extract start time from slot (e.g., "10:00 - 11:00" -> "10:00")
                const timePart = (notes.time || sessionData.time_slot || '10:00').split(' ')[0]
                const startTime = new Date(`${sessionData.date}T${timePart}:00`).toISOString()
                const endTime = new Date(new Date(startTime).getTime() + 45 * 60000).toISOString() // 45 mins

                const event = await createMeetEvent(mentorData.google_refresh_token, {
                  summary: `Counselling Session: ${userData.name} with ${mentorData.name}`,
                  description: `One-on-one counselling session booked via Apna Counsellor.\nStudent: ${userData.name}\nTopic: ${sessionData.topic || 'General Consultation'}`,
                  startTime,
                  endTime,
                  attendeeEmail: userData.email
                })

                if (event.hangoutLink) {
                  meetingLink = event.hangoutLink
                  
                  // Update session with the actual meeting link
                  await supabaseAdmin.from('sessions').update({ 
                    meeting_link: meetingLink,
                    google_event_id: event.id
                  }).eq('id', notes.session_id)
                }
              }
            } catch (googleError) {
              console.error("Failed to create Google Meet event:", googleError)
            }
          }

          await sendBookingConfirmation(
            userData.email,
            mentorData.name,
            notes.date || 'TBD',
            notes.time || 'TBD',
            meetingLink
          )

          await sendAdminNotification(
            "New Mentorship Booking",
            `Student ${userData.name} booked a session with ${mentorData.name} for ₹${order.amount / 100}.`
          )
        }

      } else if (notes.type === 'counseling_booking') {
        // Create booking record
        const { error: bookingError } = await supabaseAdmin
          .from('bookings')
          .insert({
            student_id: notes.user_id,
            mentor_id: notes.mentor_id,
            total_price: order.amount / 100,
            status: 'confirmed',
            payment_id: payment.id,
            scheduled_date: notes.date || new Date().toISOString().split('T')[0],
            scheduled_time: notes.time || '10:00:00',
            duration_minutes: parseInt(notes.duration || '45'),
            service_price: notes.service_price || (order.amount / 100),
            platform_fee: 0
          })
        
        if (bookingError) throw bookingError

        const { data: userData } = await supabaseAdmin.from('profiles').select('name, email').eq('id', notes.user_id).single()
        if (userData) {
          await sendAdminNotification(
            "New Counseling Enrollment",
            `Student ${userData.name} enrolled in ${notes.service_name} for ₹${order.amount / 100}.`
          )
        }
      }


      return NextResponse.json({ received: true })
    } catch (error: any) {
      console.error('❌ Webhook processing error:', error)
      
      // Notify admin about the failure
      try {
        await supabaseAdmin.from('notifications').insert({
          title: "Payment Webhook Error",
          message: `Critical error processing payment for order ${event.payload?.order?.entity?.id}: ${error.message}`,
          type: 'error',
          target_group: 'admin'
        })
      } catch (notifyErr) {
        console.error("Failed to log error notification:", notifyErr)
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
