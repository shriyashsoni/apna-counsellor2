"use server"

import crypto from "crypto"

export async function createRazorpayOrder({ amount, currency, receipt }: { amount: number, currency: string, receipt?: string }) {
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
        amount: amount * 100, // Convert to paise
        currency: currency,
        receipt: receipt,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Razorpay Order Creation Failed: ${error.error.description}`);
    }

    return await response.json();
}

export async function verifyRazorpayPayment({ orderId, paymentId, signature }: { orderId: string, paymentId: string, signature: string }) {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error("Razorpay secret not configured");

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");

    return generatedSignature === signature;
}
