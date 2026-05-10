import { NextResponse } from "next/server"
import { createRazorpayOrder } from "@/lib/actions/razorpay"

export async function POST(req: Request) {
  try {
    const { amount, notes } = await req.json()

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 })
    }

    const order = await createRazorpayOrder({
      amount: Number(amount),
      notes: notes
    })

    return NextResponse.json(order)
  } catch (error: any) {
    console.error("Razorpay order creation error:", error)
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 })
  }
}
