"use client"

import { motion } from "framer-motion"
import { Shield, Eye, Lock, FileText, Scale } from "lucide-react"

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Data We Collect",
      content: "We collect personal information such as your name, email, phone number, and academic details (ranks, exam scores) to provide personalized admission predictions and mentorship."
    },
    {
      title: "How We Use Your Data",
      content: "Your data is used to calculate admission probabilities, connect you with appropriate mentors, and process payments for premium services via Razorpay."
    },
    {
      title: "Data Security",
      content: "We implement industry-standard encryption to protect your rank cards and personal identity. We do not sell your data to third-party coaching institutes or universities."
    },
    {
      title: "Third-Party Services",
      content: "We use Convex for database management, Clerk/Convex-Auth for authentication, and Razorpay for payment processing. Each service has its own privacy standards."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Privacy <span className="text-primary">Policy.</span></h1>
          <p className="text-slate-500 font-medium">Last updated: May 2024</p>
        </div>

        <div className="space-y-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <h2 className="text-xl font-black mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                {section.title}
              </h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                {section.content}
              </p>
            </motion.div>
          ))}
          
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-400 font-medium">
              By using Apna Counsellor, you agree to the collection and use of information in accordance with this policy. For any privacy-related queries, please contact us at <span className="text-primary font-bold">apnacounsellor@gmail.com</span>.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
