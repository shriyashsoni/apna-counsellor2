"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  User, 
  Star, 
  Award, 
  MessageSquare, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  ArrowLeft,
  Sparkles,
  Zap,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

export default function MentorBookingPage() {
  const params = useParams()
  const mentorId = params.id as any
  const router = useRouter()
  
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedSlot, setSelectedSlot] = useState<string>("")

  const mentorsData = useQuery(api.users.listMentors, {})
  const mentor = mentorsData?.find(m => m._id === mentorId)
  
  const handleBooking = () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot")
      return
    }
    toast.success("Redirecting to payment...")
    // Simulate booking flow
    setTimeout(() => router.push("/dashboard"), 1500)
  }

  if (mentor === undefined) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const slots = ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-12">
          <Link href="/mentors">
            <Button variant="ghost" className="mb-8 rounded-xl font-bold text-slate-500 hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Mentors
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-grow space-y-8">
              <div className="flex items-center gap-8">
                <div className="h-32 w-32 rounded-[3rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative shadow-2xl">
                   <User className="h-16 w-16 text-slate-300" />
                   <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 flex items-center justify-center text-white">
                     <ShieldCheck className="h-6 w-6" />
                   </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-black tracking-tight">{mentor.name}</h1>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-black uppercase tracking-wider border border-orange-500/10">
                      <Star className="h-3 w-3 fill-current" /> {mentor.rating || "4.9"}
                    </div>
                  </div>
                  <p className="text-primary font-bold text-xl mb-4">{mentor.expertise}</p>
                  <div className="flex flex-wrap gap-4 text-slate-500 font-medium text-sm">
                    <span className="flex items-center gap-2"><Award className="h-4 w-4" /> IIT Bombay Alumnus</span>
                    <span className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> English, Hindi</span>
                    <span className="flex items-center gap-2"><Zap className="h-4 w-4" /> Top 1% Mentor</span>
                  </div>
                </div>
              </div>

              <Card className="border-none rounded-[3rem] shadow-sm bg-white dark:bg-slate-900 p-10">
                <h2 className="text-2xl font-black mb-6">About the Mentor</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
                  {mentor.bio || `Specialized in ${mentor.expertise} with over 5 years of experience in guiding students through the complex Indian admission landscape. I focus on data-driven branch selection and preference order optimization.`}
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                   {["Choice Filling", "Rank Analysis", "Branch Trends", "Scholarships"].map(tag => (
                     <div key={tag} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 font-bold text-slate-700 dark:text-slate-300">
                       <CheckCircle2 className="h-5 w-5 text-emerald-500" /> {tag}
                     </div>
                   ))}
                </div>
              </Card>
            </div>

            <aside className="w-full lg:w-[400px] shrink-0">
               <Card className="border-none rounded-[3rem] shadow-2xl bg-white dark:bg-slate-900 overflow-hidden sticky top-32">
                 <div className="bg-primary p-8 text-white">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Session Price</p>
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black">₹{mentor.pricing || "999"}</span>
                     <span className="text-sm font-bold opacity-70">/ 45-min session</span>
                   </div>
                 </div>
                 <div className="p-8 space-y-8">
                   <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Select a Slot</label>
                     <div className="grid grid-cols-2 gap-3">
                       {slots.map(slot => (
                         <button
                           key={slot}
                           onClick={() => setSelectedSlot(slot)}
                           className={`p-3 rounded-xl border-2 font-bold text-sm transition-all ${
                             selectedSlot === slot 
                               ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" 
                               : "border-slate-100 dark:border-slate-800 hover:border-primary/50 text-slate-600 dark:text-slate-400"
                           }`}
                         >
                           {slot}
                         </button>
                       ))}
                     </div>
                   </div>

                   <Button 
                     onClick={handleBooking}
                     className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 font-black text-xl shadow-xl shadow-primary/20"
                   >
                     Continue to Pay
                   </Button>

                   <div className="flex items-center gap-4 text-xs text-slate-400 font-bold justify-center">
                     <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Secure Payment</span>
                     <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Instant Confirm</span>
                   </div>
                 </div>
               </Card>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
