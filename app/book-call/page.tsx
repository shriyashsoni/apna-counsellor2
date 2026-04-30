"use client"

import { motion } from "framer-motion"
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  ChevronRight, 
  Sparkles,
  MessageSquare,
  ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function BookCallPage() {
  const options = [
    { 
      title: "Quick Admission Chat", 
      time: "15 mins", 
      price: "Free", 
      desc: "Instant answers for basic admission queries.",
      icon: MessageSquare,
      color: "blue"
    },
    { 
      title: "Expert Strategy Session", 
      time: "45 mins", 
      price: "₹999", 
      desc: "Deep dive into your profile and choice filling.",
      icon: Video,
      color: "primary"
    },
    { 
      title: "Parent Counseling", 
      time: "60 mins", 
      price: "₹1,499", 
      desc: "Special session for parents about fees and safety.",
      icon: Users,
      color: "orange"
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
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
            Choose a session type that fits your needs and talk to our experts today.
          </p>
        </div>

        <div className="grid gap-6">
          {options.map((opt, i) => (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none rounded-[2rem] md:rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-8 md:p-10">
                      <div className="flex items-center gap-4 mb-6">
                         <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                            <opt.icon className="h-6 w-6" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black group-hover:text-primary transition-colors">{opt.title}</h3>
                            <div className="flex items-center gap-3 mt-1">
                               <Badge variant="secondary" className="rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px] tracking-wide uppercase px-2 py-0.5 border-none">
                                  <Clock className="h-3 w-3 mr-1 inline" /> {opt.time}
                               </Badge>
                               <span className="text-primary font-black text-sm">{opt.price}</span>
                            </div>
                         </div>
                      </div>
                      <p className="text-slate-500 font-medium leading-relaxed max-w-md">
                        {opt.desc}
                      </p>
                    </div>
                    <div className="md:w-48 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center p-8 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800">
                       <Button className="w-full rounded-2xl h-14 font-black shadow-lg shadow-primary/20">Book Now</Button>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-4">No login required</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-12 p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 text-center">
           <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
             Need something else? Call us directly at <span className="text-primary font-black">+91 91724 10300</span> or email <span className="text-primary font-black">apnacounsellor@gmail.com</span>
           </p>
        </div>

      </div>
    </div>
  )
}

import { Users } from "lucide-react"
