"use client"

import { useState, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2,
  CreditCard,
  AlertCircle,
  Loader2,
  Sparkles,
  User,
  ArrowLeft,
  ArrowRight,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Script from "next/script"

export default function BookCallPage() {
  return (
    <AuthGuard message="Please login to book a consultation call with our experts.">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
      }>
        <BookCallContent />
      </Suspense>
    </AuthGuard>
  )
}

function BookCallContent() {
  const [step, setStep] = useState<'SELECT' | 'DETAILS' | 'PAYMENT' | 'SCHEDULE'>('SELECT')
  const [selectedMentor, setSelectedMentor] = useState<any>(null)
  const [mentors, setMentors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    examType: "",
    fullName: "",
    email: "",
    phone: "",
    duration: "30"
  })
  
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Prefill from search params if any
    const mentorId = searchParams.get('mentor')
    const exam = searchParams.get('exam')
    if (exam) setFormData(prev => ({ ...prev, examType: exam }))

    async function fetchMentors() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'mentor')
        .not('cal_link', 'is', null)
        .limit(6)
      
      if (data) {
        setMentors(data)
        if (mentorId) {
          const mentor = data.find(m => m.id === mentorId)
          if (mentor) setSelectedMentor(mentor)
        }
      }
      setLoading(false)
    }

    // Get user email
    async function getUserEmail() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setFormData(prev => ({ ...prev, email: user.email ?? prev.email, fullName: user.user_metadata?.full_name || prev.fullName }))
    }

    fetchMentors()
    getUserEmail()
  }, [searchParams])

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.examType || !formData.fullName || !formData.email) {
      toast.error("Please fill all details")
      return
    }
    setStep('PAYMENT')
  }

  const initiatePayment = async () => {
    if (!(window as any).Razorpay) {
      toast.error("Razorpay SDK not loaded. Please refresh.")
      return
    }

    setIsProcessing(true)
    try {
      const amount = selectedMentor?.pricing || 499
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          notes: {
            user_name: formData.fullName,
            user_email: formData.email,
            exam_type: formData.examType,
            type: 'consultancy',
            mentor_id: selectedMentor?.id || 'admin'
          }
        })
      })

      const order = await res.json()
      if (order.error) throw new Error(order.error)

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Apna Counsellor",
        description: `Consultancy with ${selectedMentor?.name || "Expert"}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                notes: {
                  full_name: formData.fullName,
                  email: formData.email,
                  exam_type: formData.examType,
                  mentor_id: selectedMentor?.id || 'admin'
                }
              })
            })

            const result = await verifyRes.json()
            if (result.success) {
              setStep('SCHEDULE')
              toast.success("Payment Successful!")
            } else {
              toast.error("Verification failed")
            }
          } catch (err) {
            toast.error("Payment verification failed")
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: "#7c3aed" }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error: any) {
      console.error("Payment error:", error)
      toast.error(error.message || "Failed to initiate payment")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Progress Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
             <div className="sticky top-24">
                <div className="space-y-6 mb-12">
                   {[
                     { id: 'SELECT', label: 'Choose Expert', icon: Sparkles },
                     { id: 'DETAILS', label: 'Your Details', icon: User },
                     { id: 'PAYMENT', label: 'Payment', icon: CreditCard },
                     { id: 'SCHEDULE', label: 'Schedule', icon: CalendarIcon },
                   ].map((s, i) => (
                     <div key={s.id} className="flex items-center gap-4 group">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                          step === s.id ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : 
                          ['SELECT', 'DETAILS', 'PAYMENT', 'SCHEDULE'].indexOf(step) > i ? "bg-emerald-500 text-white" : "bg-white text-slate-300"
                        }`}>
                           {['SELECT', 'DETAILS', 'PAYMENT', 'SCHEDULE'].indexOf(step) > i ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                        </div>
                        <div className="flex flex-col">
                           <span className={`text-[10px] font-black uppercase tracking-widest ${step === s.id ? "text-primary" : "text-slate-400"}`}>Step 0{i+1}</span>
                           <span className={`font-bold text-sm ${step === s.id ? "text-slate-900" : "text-slate-400"}`}>{s.label}</span>
                        </div>
                     </div>
                   ))}
                </div>

                {step === 'SELECT' && (
                  <div className="space-y-3">
                     <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 px-2">Available Experts</h3>
                     {loading ? (
                        [1,2,3].map(i => (
                           <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
                        ))
                     ) : (
                        <>
                           <button
                              onClick={() => {
                                setSelectedMentor({ name: "General Consultancy", cal_link: "apna-counsellor/consultation", pricing: 499 })
                                setStep('DETAILS')
                              }}
                              className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                                selectedMentor?.name === "General Consultancy" ? "border-primary bg-primary/5" : "border-transparent bg-white hover:bg-slate-50"
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
                                 onClick={() => {
                                   setSelectedMentor(mentor)
                                   setStep('DETAILS')
                                 }}
                                 className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                                   selectedMentor?.id === mentor.id ? "border-primary bg-primary/5" : "border-transparent bg-white hover:bg-slate-50"
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
                )}
             </div>
          </aside>

          {/* Dynamic Content Area */}
          <main className="lg:col-span-8">
             <AnimatePresence mode="wait">
                {step === 'SELECT' ? (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 rounded-[3rem] bg-white border-2 border-dashed border-slate-200"
                  >
                     <div className="h-24 w-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary mb-8 animate-bounce">
                        <CalendarIcon className="h-12 w-12" />
                     </div>
                     <h3 className="text-3xl font-black mb-4">Start your Journey.</h3>
                     <p className="text-slate-400 font-medium max-w-sm mb-12">Select an expert from the sidebar to view their availability and book your session instantly.</p>
                  </motion.div>
                ) : step === 'DETAILS' ? (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                     <Card className="border-none rounded-[3rem] bg-white shadow-2xl p-10 md:p-16 border border-slate-100">
                        <div className="mb-10 flex items-center justify-between">
                           <div>
                              <h2 className="text-3xl font-black mb-2 tracking-tight">Tell us more.</h2>
                              <p className="text-slate-500 font-medium italic">Help {selectedMentor?.name} prepare for your session.</p>
                           </div>
                           <Button variant="ghost" onClick={() => setStep('SELECT')} className="rounded-full h-12 w-12 bg-slate-50">
                              <ArrowLeft className="h-5 w-5" />
                           </Button>
                        </div>

                        <form onSubmit={handleDetailsSubmit} className="space-y-8">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Exam Counseling</label>
                              <Select value={formData.examType} onValueChange={(v) => setFormData({...formData, examType: v})}>
                                 <SelectTrigger className="h-16 rounded-2xl border-slate-100 font-bold text-lg bg-slate-50/50">
                                    <SelectValue placeholder="Which exam are you targeting?" />
                                 </SelectTrigger>
                                 <SelectContent className="rounded-2xl border-slate-100 font-medium">
                                    <SelectItem value="JoSAA">JoSAA (IIT/NIT/IIIT)</SelectItem>
                                    <SelectItem value="MHT-CET">MHT-CET (Maharashtra)</SelectItem>
                                    <SelectItem value="CSAB">CSAB (Special Rounds)</SelectItem>
                                    <SelectItem value="JAC Delhi">JAC Delhi</SelectItem>
                                    <SelectItem value="COMEDK">COMEDK / UGEE</SelectItem>
                                    <SelectItem value="Other">Other Counseling</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>

                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Full Name</label>
                              <Input 
                                 placeholder="Enter your name"
                                 className="h-16 rounded-2xl border-slate-100 font-bold text-lg bg-slate-50/50"
                                 value={formData.fullName}
                                 onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                              />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                                 <Input 
                                    type="email"
                                    placeholder="your@email.com"
                                    className="h-16 rounded-2xl border-slate-100 font-bold text-lg bg-slate-50/50"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                 />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                                 <Input 
                                    placeholder="+91 00000 00000"
                                    className="h-16 rounded-2xl border-slate-100 font-bold text-lg bg-slate-50/50"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                 />
                              </div>
                           </div>

                           <Button type="submit" className="w-full h-18 rounded-2xl font-black text-xl shadow-2xl shadow-primary/20 py-8">
                              Continue to Payment <ArrowRight className="ml-2 h-6 w-6" />
                           </Button>
                        </form>
                     </Card>
                  </motion.div>
                ) : step === 'PAYMENT' ? (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                     <Card className="border-none rounded-[3rem] bg-slate-900 text-white shadow-2xl p-12 md:p-20 overflow-hidden relative group">
                        <div className="relative z-10 text-center space-y-8">
                           <div className="h-20 w-20 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-primary/20">
                              <CreditCard className="h-10 w-10 text-primary" />
                           </div>
                           <h2 className="text-4xl font-black tracking-tight">Complete Payment.</h2>
                           <div className="py-8 border-y border-white/10 space-y-4">
                              <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                 <span>Consultancy Fee</span>
                                 <span className="text-white text-xl font-black">₹{selectedMentor?.pricing || 499}</span>
                              </div>
                              <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                 <span>Platform Secure Fee</span>
                                 <span className="text-white">Included</span>
                              </div>
                           </div>
                           <div className="pt-8">
                              <Button 
                                 onClick={initiatePayment}
                                 disabled={isProcessing}
                                 className="w-full h-18 rounded-2xl bg-primary hover:bg-primary/90 font-black text-xl shadow-2xl shadow-primary/20 py-8"
                              >
                                 {isProcessing ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : <Zap className="h-6 w-6 mr-2 fill-current" />}
                                 {isProcessing ? "Initiating Secure Gateway..." : "Unlock Booking Access"}
                              </Button>
                           </div>
                        </div>
                        <div className="absolute top-0 right-0 p-8">
                           <Button variant="ghost" onClick={() => setStep('DETAILS')} className="text-white hover:bg-white/10 rounded-full h-10 w-10">
                              <ArrowLeft className="h-4 w-4" />
                           </Button>
                        </div>
                     </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="schedule"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                     <div className="flex items-center justify-between px-4">
                        <div>
                           <h2 className="text-2xl font-black">Schedule Session</h2>
                           <p className="text-slate-500 font-medium text-sm">Choose a slot that works for you.</p>
                        </div>
                        <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] uppercase px-4 py-1 animate-pulse">Payment Verified</Badge>
                     </div>
                     <Card className="border-none rounded-[3rem] bg-white shadow-2xl overflow-hidden min-h-[650px] border border-slate-100">
                        <iframe 
                          src={`https://cal.com/${selectedMentor?.cal_link?.replace("https://cal.com/", "").replace("http://cal.com/", "").replace(/\/$/, "")}?embed=true&name=${encodeURIComponent(formData.fullName)}&email=${encodeURIComponent(formData.email)}`}
                          className="w-full h-[650px] border-none"
                          title="Booking Calendar"
                        />
                     </Card>
                  </motion.div>
                )}
             </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  )
}
