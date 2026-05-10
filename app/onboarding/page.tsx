"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, ArrowRight, ArrowLeft, GraduationCap, MapPin, Search, Loader2 } from "lucide-react"

const states = [
  "Maharashtra", "Madhya Pradesh", "Delhi", "Uttar Pradesh", "Rajasthan", 
  "Karnataka", "Tamil Nadu", "Gujarat", "West Bengal", "Punjab", "Haryana"
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    examType: "JEE",
    targetYear: 2026,
    rank: "",
    category: "General",
    interestedStates: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const handleNext = () => setStep(s => s + 1)
  const handlePrev = () => setStep(s => s - 1)

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = "/login"
        return
      }

      // Direct upsert - much safer and faster
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: formData.fullName,
          email: user.email,
          phone: formData.phone,
          city: formData.city,
          exam: formData.examType,
          target_year: formData.targetYear,
          rank: formData.rank,
          category: formData.category,
          interested_states: formData.interestedStates,
          onboarding_complete: true,
          // Default to student, if they are admin, the Admin SQL will restore it
          role: user.email === 'apnacounsellor@gmail.com' || user.email === 'sonishriyash@gmail.com' ? 'admin' : 'student'
        })
      
      if (error) throw error
      
      const { toast } = await import("sonner")
      toast.success("Profile saved! Redirecting...")
      
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1000)

    } catch (error: any) {
      console.error("Onboarding Error:", error)
      const { toast } = await import("sonner")
      toast.error(error.message || "Could not save profile. Check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleState = (state: string) => {
    setFormData(prev => ({
      ...prev,
      interestedStates: prev.interestedStates.includes(state)
        ? prev.interestedStates.filter(s => s !== state)
        : [...prev.interestedStates, state]
    }))
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Sparkles className="h-40 w-40 text-primary" />
        </div>

        <div className="mb-12">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-slate-100 dark:bg-slate-800"}`} />
            ))}
          </div>
          <h1 className="text-3xl font-black tracking-tight">Complete Your <span className="text-primary">Profile</span></h1>
          <p className="text-slate-500 mt-2">Help us personalize your counselling journey.</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    placeholder="John Doe" 
                    value={formData.fullName} 
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input 
                    placeholder="+91 9876543210" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input 
                  placeholder="Mumbai" 
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <Button onClick={handleNext} className="w-full h-12 rounded-xl text-lg font-bold">
                Next Step <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Exam Type</Label>
                  <Select value={formData.examType} onValueChange={v => setFormData({...formData, examType: v})}>
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JEE">JEE Mains / Advanced</SelectItem>
                      <SelectItem value="NEET">NEET UG</SelectItem>
                      <SelectItem value="MHT-CET">MHT-CET</SelectItem>
                      <SelectItem value="COMEDK">COMEDK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Year</Label>
                  <Input type="number" value={formData.targetYear} onChange={e => setFormData({...formData, targetYear: Number(e.target.value)})} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Current Rank (Optional)</Label>
                  <Input placeholder="Enter Rank" value={formData.rank} onChange={e => setFormData({...formData, rank: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="OBC">OBC</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="ST">ST</SelectItem>
                      <SelectItem value="EWS">EWS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handlePrev} className="flex-1 h-12 rounded-xl font-bold">
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button onClick={handleNext} className="flex-2 h-12 rounded-xl text-lg font-bold">
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
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
              className="space-y-6"
            >
              <Label className="text-lg">Select Interested States</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {states.map(state => (
                  <div 
                    key={state} 
                    onClick={() => toggleState(state)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                      formData.interestedStates.includes(state) 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-slate-100 dark:border-slate-800 hover:border-primary/50"
                    }`}
                  >
                    <MapPin className="h-5 w-5" />
                    <span className="text-xs font-bold">{state}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handlePrev} className="flex-1 h-12 rounded-xl font-bold">
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="flex-2 h-12 rounded-xl text-lg font-bold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      Saving... <Loader2 className="animate-spin h-5 w-5" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Finish Profile <Sparkles className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
