"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Lock, Eye, AlertCircle } from "lucide-react"

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-20 w-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-primary">
            <Lock className="h-10 w-10" />
          </div>
          <h1 className="text-5xl font-black mb-4">Platform <span className="text-primary">Security.</span></h1>
          <p className="text-slate-500 font-medium">Your data safety is our highest priority.</p>
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800">
          <h3 className="font-black">Data Encryption</h3>
          <p>All sensitive information, including your admission documents and rank cards, is encrypted using industry-standard AES-256 encryption. We use SSL/TLS for all data in transit.</p>
          <h3 className="font-black">Privacy by Design</h3>
          <p>We do not share your contact information with any third-party universities or coaching institutes without your explicit consent. Your profile is strictly for admission prediction purposes.</p>
          <h3 className="font-black">Security Audits</h3>
          <p>Our platform undergoes regular security audits to ensure that your financial transactions (via Razorpay) and personal data remain protected against unauthorized access.</p>
        </div>
      </div>
    </div>
  )
}
