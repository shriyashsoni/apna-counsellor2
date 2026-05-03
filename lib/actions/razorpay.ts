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

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to paise and ensure it's an integer
        currency: currency,
        receipt: receipt,
        notes: notes
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Razorpay Error:", error);
      throw new Error(`Razorpay Order Creation Failed: ${error.error?.description || "Unknown error"}`);
    }

    return await response.json();
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

