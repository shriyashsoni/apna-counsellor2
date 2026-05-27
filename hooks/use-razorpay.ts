"use client"

import { useState } from "react"
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/actions/razorpay"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function useRazorpay() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const initiatePayment = async ({
    amount,
    name,
    description,
    prefill,
    metadata,
    onSuccess,
  }: {
    amount: number
    name: string
    description: string
    prefill: { name: string; email: string; contact?: string }
    metadata: Record<string, string>
    onSuccess?: (response: any) => void
  }) => {
    setIsLoading(true)
    const scriptLoaded = await loadRazorpay()

    if (!scriptLoaded) {
      toast.error("Failed to load payment gateway")
      setIsLoading(false)
      return
    }

    try {
      // 1. Create order on server
      const result = await createRazorpayOrder({
        amount,
        currency: "INR",
        notes: metadata,
        mentor_id: metadata.mentor_id
      })

      if (!result.success || !result.order) {
        toast.error(result.error || "Failed to create payment order")
        setIsLoading(false)
        return
      }

      const order = result.order;

      // 2. Configure checkout options
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      
      if (!keyId) {
        console.error("RAZORPAY_KEY_ID is missing in the browser environment. Ensure NEXT_PUBLIC_RAZORPAY_KEY_ID is set in .env.local and Vercel.");
        toast.error("Payment configuration error: Key missing");
        setIsLoading(false);
        return;
      }

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: name,
        description: description,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment on server for immediate feedback
            const isVerified = await verifyRazorpayPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: amount,
              notes: metadata
            })

            if (isVerified) {
              toast.success("Payment successful!")
              if (onSuccess) onSuccess(response)
            } else {
              toast.error("Payment verification failed")
            }
          } catch (err) {
            toast.error("Error verifying payment")
          }
        },
        prefill: prefill,
        theme: { color: "#6d28d9" },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
          }
        }
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()
    } catch (error: any) {
      toast.error(error.message || "Payment initiation failed")
    } finally {
      setIsLoading(false)
    }
  }

  return { initiatePayment, isLoading }
}
