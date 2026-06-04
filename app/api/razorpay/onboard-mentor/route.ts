import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const { mentor_id, name, email, account_number, ifsc_code } = await req.json()

    if (!mentor_id || !name || !account_number || !ifsc_code) {
      return NextResponse.json({ error: "Missing required bank details." }, { status: 400 })
    }

    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay credentials missing on server." }, { status: 500 })
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64")

    // Call Razorpay API to create a Linked Account (Route)
    // We use the standard /beta/accounts endpoint which accepts bank details
    const response = await fetch("https://api.razorpay.com/beta/accounts", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email || "mentor@apnacounsellor.in",
        tnc_accepted: true,
        account_details: {
          business_name: name,
          business_type: "individual"
        },
        bank_account: {
          ifsc_code: ifsc_code.toUpperCase(),
          beneficiary_name: name,
          account_type: "savings",
          account_number: account_number
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Razorpay Route Error:", data)
      return NextResponse.json({ error: data.error?.description || "Failed to create Razorpay account." }, { status: 400 })
    }

    const accountId = data.id // This is the acc_XXXXXXXX ID

    // Save this ID to the mentor's profile in Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error: dbError } = await supabase
      .from('profiles')
      .update({ razorpay_account_id: accountId })
      .eq('id', mentor_id)

    if (dbError) {
      throw dbError
    }

    return NextResponse.json({ success: true, account_id: accountId })

  } catch (error: any) {
    console.error("Mentor Onboarding Error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
