import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import crypto from "crypto"

// Environment variables needed:
// CAL_WEBHOOK_SECRET (optional but recommended)
// NEXT_PUBLIC_SUPABASE_URL
// SUPABASE_SERVICE_ROLE_KEY

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const signature = req.headers.get("x-cal-signature-256")

    // Verify signature if secret is provided
    if (process.env.CAL_WEBHOOK_SECRET && signature) {
      const hmac = crypto.createHmac("sha256", process.env.CAL_WEBHOOK_SECRET)
      const digest = Buffer.from(hmac.update(JSON.stringify(body)).digest("hex"), "utf8")
      const checksum = Buffer.from(signature, "utf8")
      
      if (digest.length !== checksum.length || !crypto.timingSafeEqual(digest, checksum)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const { triggerEvent, payload } = body
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log(`Cal.com Webhook received: ${triggerEvent}`)

    if (triggerEvent === "BOOKING_CREATED" || triggerEvent === "BOOKING_PAID") {
      const { 
        startTime, 
        attendees, 
        user, 
        id: bookingId,
        eventTypeId,
        paymentStatus
      } = payload

      // Extract user info
      const studentEmail = attendees[0].email
      const studentName = attendees[0].name
      
      // Find mentor by cal_link or email
      const { data: mentor } = await supabase
        .from('profiles')
        .select('id, name')
        .or(`cal_link.ilike.%${user.username}%,email.eq.${user.email}`)
        .single()

      // Find student by email
      const { data: student } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', studentEmail)
        .single()

      // Upsert into sessions table
      const sessionStatus = triggerEvent === "BOOKING_PAID" || !paymentStatus ? 'confirmed' : 'pending_payment'
      
      const { error } = await supabase.from('sessions').upsert({
        student_id: student?.id || null,
        mentor_id: mentor?.id || null,
        student_name: studentName,
        mentor_name: mentor?.name || user.name,
        date: startTime.split('T')[0],
        scheduled_at: startTime,
        time_slot: new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        meeting_link: payload.metadata?.videoCallUrl || payload.location || null,
        status: sessionStatus,
        title: `Cal.com Booking #${bookingId}`,
        description: `Event Type ID: ${eventTypeId}`
      }, { onConflict: 'title' })

      if (error) console.error("Error syncing session from webhook:", error)
    }

    if (triggerEvent === "BOOKING_CANCELLED") {
      // Handle cancellation
      const { id: bookingId } = payload
      await supabase
        .from('sessions')
        .update({ status: 'cancelled' })
        .ilike('title', `%#${bookingId}%`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Cal.com Webhook Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
