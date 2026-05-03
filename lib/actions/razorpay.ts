"use server"

import crypto from "crypto"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function createRazorpayOrder({ 
  amount, 
  currency = "INR", 
  receipt,
  notes 
}: { 
  amount: number, 
  currency?: string, 
  receipt?: string,
  notes?: Record<string, string>
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
          notes: notes
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
  signature 
}: { 
  orderId: string, 
  paymentId: string, 
  signature: string 
}) {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error("Razorpay secret not configured");

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");

    return generatedSignature === signature;
}

