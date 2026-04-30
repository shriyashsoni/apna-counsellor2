"use client"

import { motion } from "framer-motion"
import { RefreshCcw, CheckCircle2, AlertCircle } from "lucide-react"

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-20 w-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <RefreshCcw className="h-10 w-10" />
          </div>
          <h1 className="text-5xl font-black mb-4">Refund <span className="text-primary">Policy.</span></h1>
          <p className="text-slate-500 font-medium">Clear and transparent refund guidelines.</p>
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800">
          <h3 className="font-black">Subscription Refunds</h3>
          <p>We offer a 48-hour "No Questions Asked" refund for our **Pro** and **Elite** membership plans, provided that you haven't initiated more than 2 personal counselor sessions.</p>
          <h3 className="font-black">Booking Cancellations</h3>
          <p>For 1-on-1 expert consultations, you can cancel or reschedule up to 24 hours before the session for a full refund. Cancellations within 24 hours are subject to a 50% convenience fee.</p>
          <h3 className="font-black">How to Request?</h3>
          <p>Please email your payment ID and registered email to **apnacounsellor@gmail.com**. Our team will process your request within 5-7 business days.</p>
        </div>
      </div>
    </div>
  )
}
