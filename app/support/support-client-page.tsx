"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  ChevronDown, 
  Send,
  HelpCircle,
  FileText,
  Clock,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

const FAQS = [
  {
    question: "How accurate is the College Predictor?",
    answer: "Our College Predictor uses official past 3-year cutoff data from JoSAA, CSAB, and State Counselings (like MHT-CET, COMEDK). We analyze trends, category ranks, and seat matrix changes to provide highly accurate probability assessments."
  },
  {
    question: "How does the 1-on-1 Mentorship work?",
    answer: "Once you subscribe, you are paired with a senior mentor from an IIT/NIT/Top Medical College. They will guide you through choice filling, document verification, and strategy calls until you secure your admission."
  },
  {
    question: "What if I face a payment issue?",
    answer: "If your payment is deducted but the subscription is not activated, please email us with your Transaction ID at support@apnacounsellor.in. Our billing team will resolve it within 2-4 working hours."
  },
  {
    question: "Can I upgrade my subscription later?",
    answer: "Yes! You can easily upgrade from a basic data plan to a personalized mentorship plan directly from your dashboard. The remaining balance of your previous plan will be adjusted."
  }
];

export function SupportClientPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Message Sent Successfully!", {
        description: "Our support team will get back to you within 24 hours."
      })
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-widest"
          >
            <HelpCircle className="h-4 w-4" /> Help & Support Center
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            How can we <span className="text-primary">help you?</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed"
          >
            Whether you have a question about our counseling tools, need technical assistance, or want to explore our mentorship plans, our expert team is here for you.
          </motion.p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Mail, title: "Email Support", desc: "Drop us an email anytime", value: "support@apnacounsellor.in", action: "mailto:support@apnacounsellor.in", color: "text-blue-500", bg: "bg-blue-500/10" },
            { icon: Phone, title: "Call Us", desc: "Mon-Sat from 10am to 7pm", value: "+91 9340059530", action: "tel:+919340059530", color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { icon: MapPin, title: "Office HQ", desc: "Visit our headquarters", value: "Jabalpur, Madhya Pradesh", action: "#", color: "text-purple-500", bg: "bg-purple-500/10" }
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.action}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="block group"
            >
              <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900 rounded-[2rem]">
                <CardContent className="p-8 text-center space-y-4">
                  <div className={`h-16 w-16 mx-auto rounded-2xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                  <div className={`text-sm font-black ${item.color} pt-2 border-t border-slate-100 dark:border-slate-800`}>
                    {item.value}
                  </div>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* FAQ Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" /> Frequently Asked Questions
              </h2>
              <p className="text-slate-500 font-medium text-sm">Quick answers to common queries regarding our platform.</p>
            </div>
            
            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <div 
                  key={index} 
                  className={`border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 ${
                    openFaq === index ? "bg-white dark:bg-slate-900 shadow-md" : "bg-slate-50 dark:bg-slate-900/50"
                  }`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-bold text-slate-900 dark:text-white">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${openFaq === index ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 mt-2">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
              <Clock className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">Standard Response Time</h4>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                  Our official working hours are 10:00 AM to 7:00 PM (Mon-Sat). Queries raised outside these hours will be addressed on the next working day. Priority support is available for Premium users.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary" /> Send us a message
                </h2>
                <p className="text-slate-500 font-medium text-sm">Fill out the form below and our counseling experts will reach out to you.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Your Name</label>
                    <Input 
                      required
                      placeholder="John Doe" 
                      className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                    <Input 
                      required
                      type="email"
                      placeholder="john@example.com" 
                      className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Subject</label>
                  <select 
                    required
                    className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 font-semibold text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none text-slate-700 dark:text-slate-300"
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                  >
                    <option value="" disabled>Select a query type...</option>
                    <option value="admissions">College Admissions & Cutoffs</option>
                    <option value="mentorship">1-on-1 Mentorship Plans</option>
                    <option value="billing">Payment & Billing Issue</option>
                    <option value="technical">Technical Support</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Your Message</label>
                  <textarea 
                    required
                    placeholder="Please describe your query in detail..." 
                    className="w-full min-h-[150px] p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-slate-900 dark:text-slate-100"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-xl text-base font-black bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Submit Ticket <Send className="h-5 w-5" />
                    </>
                  )}
                </Button>
                
                <p className="text-center text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1.5 mt-4">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Information securely encrypted
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
