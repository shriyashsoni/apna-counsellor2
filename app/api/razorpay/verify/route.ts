import { NextResponse } from "next/server"
import { verifyRazorpayPayment } from "@/lib/actions/razorpay"

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, notes } = await req.json()

    const isValid = await verifyRazorpayPayment({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount: 499, // Fallback if amount not in notes
      notes: notes
    })

    if (isValid) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Razorpay verification error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
