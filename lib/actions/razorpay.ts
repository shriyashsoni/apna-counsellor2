"use server"

import crypto from "crypto"

// Helper: lazily create admin client only when env vars are confirmed present
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error("Supabase admin credentials not configured")
  }
  const { createClient } = require('@supabase/supabase-js')
  return createClient(url, key)
}

export async function createRazorpayOrder({ 
  amount, 
  currency = "INR", 
  receipt,
  notes 
}: { 
  amount: number, 
  currency?: string, 
  receipt?: string,
  notes?: Record<string, string>,
  mentor_id?: string
}) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    console.log("Creating Razorpay Order for amount:", amount);
    
    if (isNaN(amount) || amount <= 0) {
      throw new Error(`Invalid amount: ${amount}`);
    }

    let transfers = undefined;
    if (mentor_id) {
      try {
        const supabaseAdmin = getAdminClient()
        const { data: mentor } = await supabaseAdmin
          .from('profiles')
          .select('razorpay_account_id')
          .eq('id', mentor_id)
          .maybeSingle();

        if (mentor?.razorpay_account_id) {
          // Apna Counsellor keeps 30%, Mentor gets 70%
          const mentorShare = Math.round(Number(amount) * 100 * 0.70);
          transfers = [
            {
              account: mentor.razorpay_account_id,
              amount: mentorShare,
              currency: currency,
              notes: { split: "70% to mentor" },
              linked_account_notes: ["split"],
              on_hold: 0
            }
          ];
          console.log(`Razorpay Route: Transferring ${mentorShare / 100} to ${mentor.razorpay_account_id}`);
        }
      } catch (adminErr) {
        console.error("Could not fetch mentor razorpay account, proceeding without route:", adminErr);
      }
    }



    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    
    try {
      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(Number(amount) * 100), 
          currency: currency,
          receipt: receipt,
          notes: notes,
          ...(transfers && { transfers })
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Razorpay API Error Response:", JSON.stringify(errorData, null, 2));
        throw new Error(errorData.error?.description || "Razorpay API error");
      }

      const order = await response.json();
      console.log("Razorpay Order Created Successfully:", order.id);
      return order;
    } catch (err: any) {
      console.error("Fetch Error in createRazorpayOrder:", err);
      throw err;
    }
}

export async function verifyRazorpayPayment({ 
  orderId, 
  paymentId, 
  signature,
  amount,
  notes
}: { 
  orderId: string, 
  paymentId: string, 
  signature: string,
  amount?: number,
  notes?: any
}) {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error("Razorpay secret not configured");

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");

    const isValid = generatedSignature === signature;

    if (isValid && amount && notes) {
      // Save payment to database using upsert to avoid duplicates from webhook
      try {
        const supabaseAdmin = getAdminClient()
        const { error: payError } = await supabaseAdmin
          .from('payments')
          .upsert({
            order_id: orderId,
            payment_id: paymentId,
            amount: amount,
            status: 'captured',
            user_id: notes.user_id,
            mentor_id: notes.mentor_id,
            service_id: notes.service_id,
            type: notes.type || 'mentorship',
            metadata: notes
          }, { onConflict: 'payment_id' });

        if (payError) console.error("Payment upsert error:", payError);

        // Also create a pending session record for tracking
        if (notes.type === 'mentorship' || notes.type === 'consultancy') {
          const sessionTitle = notes.type === 'consultancy' 
            ? `Consultancy: ${notes.exam_type || 'General'}` 
            : `Mentorship: ${notes.full_name || 'Expert Session'}`;
            
          await supabaseAdmin
            .from('sessions')
            .upsert({
              student_id: notes.user_id,
              mentor_id: notes.mentor_id,
              student_name: notes.full_name || 'Student',
              status: 'paid_unscheduled',
              title: sessionTitle,
              description: `Paid via Razorpay. Order: ${orderId}`,
              date: new Date().toISOString().split('T')[0],
              time_slot: 'Awaiting Schedule',
              payment_id: paymentId,
              amount: Number(amount) || 0
            }, { onConflict: 'payment_id' }); // Use payment_id which should be unique
        }
      } catch (dbErr) {
        console.error("Critical: Failed to update DB after payment:", dbErr);
      }
    }

    return isValid;
}

