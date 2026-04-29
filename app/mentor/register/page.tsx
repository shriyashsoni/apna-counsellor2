"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  GraduationCap, 
  Linkedin, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Banknote
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function MentorRegisterPage() {
  const router = useRouter()
  // Clerk removed to unblock local host
  const dbUser = useQuery(api.users.currentUser)
  const updateUser = useMutation(api.users.updateUser)

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [form, setForm] = useState({
    college: "",
    branch: "",
    year: "",
    headline: "",
    bio: "",
    skills: "",
    pricing: "499",
    linkedin: "",
  })

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const handleSubmit = async () => {
    if (!dbUser) return
    
    setLoading(true)
    try {
      const skillsArray = form.skills.split(',').map(s => s.trim()).filter(Boolean)
      
      await updateUser({
        id: dbUser._id,
        data: {
          role: "mentor",
          college: form.college,
          branch: form.branch,
          year: form.year,
          headline: form.headline,
          bio: form.bio,
          skills: skillsArray,
          pricing: parseInt(form.pricing),
          linkedin: form.linkedin,
          verified: false, // Admin approval required
          onboardingCompleted: true,
        }
      })
      
      toast.success("Registration submitted!", {
        description: "An admin will review your profile within 24 hours.",
      })
      router.push("/dashboard")
    } catch (e) {
      toast.error("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 1, title: "Academic Background", icon: <GraduationCap className="h-6 w-6" /> },
    { id: 2, title: "Mentor Profile", icon: <User className="h-6 w-6" /> },
    { id: 3, title: "Pricing & Socials", icon: <Banknote className="h-6 w-6" /> },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Tracker */}
        <div className="mb-12">
           <div className="flex justify-between items-center mb-8 px-4">
              {steps.map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-2">
                   <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${
                     step >= s.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white dark:bg-slate-900 text-slate-400"
                   }`}>
                      {step > s.id ? <CheckCircle2 className="h-6 w-6" /> : s.icon}
                   </div>
                   <span className={`text-[10px] font-black uppercase tracking-widest ${
                     step >= s.id ? "text-primary" : "text-slate-400"
                   }`}>{s.title}</span>
                </div>
              ))}
           </div>
           <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: "33%" }}
                animate={{ width: `${(step / 3) * 100}%` }}
              />
           </div>
        </div>

        <Card className="border-none rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
           <CardContent className="p-8 md:p-16">
              
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                       <h2 className="text-3xl font-black mb-2">Academic Background</h2>
                       <p className="text-slate-500 font-medium">Let students know where you studied.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">College Name</label>
                          <Input 
                            placeholder="e.g. IIT Bombay" 
                            className="h-14 rounded-xl font-bold bg-slate-50 dark:bg-slate-950"
                            value={form.college}
                            onChange={(e) => setForm({...form, college: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Branch</label>
                          <Input 
                            placeholder="e.g. Computer Science" 
                            className="h-14 rounded-xl font-bold bg-slate-50 dark:bg-slate-950"
                            value={form.branch}
                            onChange={(e) => setForm({...form, branch: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Year of Study</label>
                          <Input 
                            placeholder="e.g. 3rd Year" 
                            className="h-14 rounded-xl font-bold bg-slate-50 dark:bg-slate-950"
                            value={form.year}
                            onChange={(e) => setForm({...form, year: e.target.value})}
                          />
                       </div>
                    </div>

                    <Button onClick={handleNext} className="w-full h-16 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/20">
                       Next Step <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                       <h2 className="text-3xl font-black mb-2">Mentor Profile</h2>
                       <p className="text-slate-500 font-medium">Tell students why they should book you.</p>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profile Headline</label>
                          <Input 
                            placeholder="e.g. Expert in JEE Mains Strategy" 
                            className="h-14 rounded-xl font-bold bg-slate-50 dark:bg-slate-950"
                            value={form.headline}
                            onChange={(e) => setForm({...form, headline: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bio / About Me</label>
                          <Textarea 
                            placeholder="Tell your story, achievements, and counseling style..." 
                            className="min-h-[150px] rounded-xl font-medium bg-slate-50 dark:bg-slate-950"
                            value={form.bio}
                            onChange={(e) => setForm({...form, bio: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Skills (Comma separated)</label>
                          <Input 
                            placeholder="JEE Advanced, Physics, Career Guidance..." 
                            className="h-14 rounded-xl font-bold bg-slate-50 dark:bg-slate-950"
                            value={form.skills}
                            onChange={(e) => setForm({...form, skills: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="flex gap-4">
                       <Button variant="ghost" onClick={handleBack} className="h-16 rounded-2xl font-black text-lg gap-2 px-8">
                          Back
                       </Button>
                       <Button onClick={handleNext} className="flex-1 h-16 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/20">
                          Next Step <ArrowRight className="h-5 w-5" />
                       </Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                       <h2 className="text-3xl font-black mb-2">Final Details</h2>
                       <p className="text-slate-500 font-medium">Set your pricing and social proof.</p>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Session Price (₹)</label>
                          <div className="relative">
                             <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xl">₹</span>
                             <Input 
                               type="number"
                               placeholder="499" 
                               className="h-16 pl-10 rounded-xl font-black text-2xl bg-slate-50 dark:bg-slate-950"
                               value={form.pricing}
                               onChange={(e) => setForm({...form, pricing: e.target.value})}
                             />
                          </div>
                          <p className="text-xs font-bold text-slate-400">Platform fee of 15% applies.</p>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">LinkedIn Profile URL</label>
                          <div className="relative">
                             <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                             <Input 
                               placeholder="linkedin.com/in/yourname" 
                               className="h-14 pl-12 rounded-xl font-bold bg-slate-50 dark:bg-slate-950"
                               value={form.linkedin}
                               onChange={(e) => setForm({...form, linkedin: e.target.value})}
                             />
                          </div>
                       </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-amber-500/10 border border-amber-500/20">
                       <div className="flex gap-4">
                          <ShieldCheck className="h-8 w-8 text-amber-500 shrink-0" />
                          <div>
                             <h4 className="font-black text-amber-700 dark:text-amber-400">Verification Pending</h4>
                             <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                               After submission, our team will verify your credentials. Once approved, your profile will be live for students to book.
                             </p>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-4">
                       <Button variant="ghost" onClick={handleBack} className="h-16 rounded-2xl font-black text-lg gap-2 px-8">
                          Back
                       </Button>
                       <Button 
                         onClick={handleSubmit} 
                         disabled={loading}
                         className="flex-1 h-16 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/20 bg-emerald-600 hover:bg-emerald-700"
                       >
                          {loading ? <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <Sparkles className="h-6 w-6" />}
                          Submit Registration
                       </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

           </CardContent>
        </Card>

      </div>
    </div>
  )
}
