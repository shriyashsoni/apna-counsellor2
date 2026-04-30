import { action } from "./_generated/server";
import { v } from "convex/values";

export const createOrder = action({
  args: {
    amount: v.number(),
    currency: v.string(),
    receipt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
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
        amount: args.amount * 100, // Convert to paise
        currency: args.currency,
        receipt: args.receipt,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Razorpay Order Creation Failed: ${error.error.description}`);
    }

    return await response.json();
  },
});
