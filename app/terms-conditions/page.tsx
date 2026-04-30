"use client"

import { motion } from "framer-motion"
import { Scale, FileText, CheckCircle2, AlertTriangle } from "lucide-react"

export default function TermsConditionsPage() {
  const terms = [
    {
      title: "Platform Usage",
      content: "Apna Counsellor provides AI-driven admission predictions. While our data is highly accurate, it should be used as a guidance tool. The final admission decision rests with the respective counseling authorities (JoSAA, MCC, etc.)."
    },
    {
      title: "Subscription & Payments",
      content: "Premium features require a paid subscription. All payments are processed securely via Razorpay. We offer a 48-hour refund policy as outlined in our Refund Policy page."
    },
    {
      title: "User Conduct",
      content: "Users must provide accurate rank and category information. Misrepresentation of data to manipulate predictions is strictly prohibited and may lead to account suspension."
    },
    {
      title: "Intellectual Property",
      content: "All content, including the AI prediction engine, counseling data, and UI design, is the intellectual property of APNA COUNSELLOR TECH SOLUTIONS PRIVATE LIMITED."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
            <Scale className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Terms & <span className="text-primary">Conditions.</span></h1>
          <p className="text-slate-500 font-medium">Agreement for Apna Counsellor Services</p>
        </div>

        <div className="space-y-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          {terms.map((term, i) => (
            <motion.div
              key={term.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <h2 className="text-xl font-black mb-3 flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                {term.title}
              </h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                {term.content}
              </p>
            </motion.div>
          ))}
          
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
            <p className="text-sm text-slate-400 font-medium italic">
              Limitation of Liability: Apna Counsellor is not responsible for any admission failures or incorrect choice filling by the user. Our tools are for estimation and guidance only.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
