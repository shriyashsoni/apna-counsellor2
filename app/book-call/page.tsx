"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2,
  CreditCard,
  AlertCircle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Script from "next/script"
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/actions/razorpay"

export default function BookCallPage() {
  return (
    <AuthGuard message="Please login to book a consultation call with our experts.">
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <ShieldCheck className="h-3 w-3" /> Certified Expert Counselors
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
              Book your <span className="text-primary text-glow">Consultation.</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Get personalized guidance from India's top counselors.
            </p>
          </div>

          <BookingFlow />

          {/* Info */}
          <div className="mt-12 p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 text-center">
             <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
               Need something else? Call us directly at <span className="text-primary font-black">+91 91724 10300</span> or email <span className="text-primary font-black">apnacounsellor@gmail.com</span>
             </p>
          </div>

        </div>
      </div>
    </AuthGuard>
  )
}

function BookingFlow() {
  const [selectedMentor, setSelectedMentor] = useState<any>(null)
  const [mentors, setMentors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMentors() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'mentor')
        .not('cal_link', 'is', null)
        .limit(6)
      
      if (data) setMentors(data)
      setLoading(false)
    }
    fetchMentors()
  }, [])

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-12">
        
        {/* Mentor Selection Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
           <div className="sticky top-24">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 px-2">Choose an Expert</h3>
              <div className="space-y-3">
                 {loading ? (
                    [1,2,3].map(i => (
                       <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
                    ))
                 ) : (
                    <>
                       {/* General Consultancy Option */}
                       <button
                          onClick={() => setSelectedMentor({ name: "General Consultancy", cal_link: "apna-counsellor/consultation" })}
                          className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                             selectedMentor?.name === "General Consultancy" 
                             ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                             : "border-transparent bg-white hover:bg-slate-50"
                          }`}
                       >
                          <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg">
                             <Sparkles className="h-6 w-6" />
                          </div>
                          <div>
                             <p className="font-black text-sm">General Consultancy</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">Best for overall guidance</p>
                          </div>
                       </button>

                       {mentors.map((mentor) => (
                          <button
                             key={mentor.id}
                             onClick={() => setSelectedMentor(mentor)}
                             className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                                selectedMentor?.id === mentor.id 
                                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                                : "border-transparent bg-white hover:bg-slate-50"
                             }`}
                          >
                             <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden border-2 border-white shadow-md">
                                <img src={mentor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`} alt={mentor.name} className="h-full w-full object-cover" />
                             </div>
                             <div className="flex-1">
                                <p className="font-black text-sm">{mentor.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase line-clamp-1">{mentor.college || "Expert Counselor"}</p>
                             </div>
                          </button>
                       ))}
                    </>
                 )}
              </div>
           </div>
        </aside>

        {/* Booking Embed Area */}
        <main className="lg:col-span-8">
           {selectedMentor ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                 <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-black">Book with {selectedMentor.name}</h2>
                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase">Live Availability</Badge>
                 </div>
                 <Card className="border-none rounded-[3rem] bg-white shadow-2xl overflow-hidden min-h-[650px] border border-slate-100 relative">
                    <iframe 
                      src={`https://cal.com/${selectedMentor.cal_link?.replace("https://cal.com/", "").replace("http://cal.com/", "").replace(/\/$/, "")}?embed=true`}
                      className="w-full h-[650px] border-none"
                      title="Booking Calendar"
                    />
                 </Card>
              </motion.div>
           ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 rounded-[3rem] bg-white border-2 border-dashed border-slate-200">
                 <div className="h-20 w-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-200 mb-6">
                    <CalendarIcon className="h-10 w-10" />
                 </div>
                 <h3 className="text-2xl font-black mb-4 text-slate-900">Ready to start?</h3>
                 <p className="text-slate-400 font-medium max-w-sm mb-8">Select an expert from the sidebar to view their availability and book your session instantly.</p>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instant Confirmation
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <ShieldCheck className="h-4 w-4 text-primary" /> Verified Mentors
                    </div>
                 </div>
              </div>
           )}
        </main>

      </div>
    </div>
  )
}

import { Sparkles } from "lucide-react"
