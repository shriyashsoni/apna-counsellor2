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
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [mentors, setMentors] = useState<any[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  
  const [bookingData, setBookingData] = useState({
    duration: 15,
    date: "",
    time: "",
    mentorId: "",
    mentorName: ""
  })

  const [pricing, setPricing] = useState({
    service: 150,
    fee: 15,
    total: 165
  })

  const supabase = createClient()

  useEffect(() => {
    fetchMentors()
  }, [])

  useEffect(() => {
    calculatePrice(bookingData.duration)
  }, [bookingData.duration])

  useEffect(() => {
    if (bookingData.mentorId && bookingData.date) {
      fetchAvailability()
    }
  }, [bookingData.mentorId, bookingData.date])

  const fetchMentors = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, name, image, headline, rating')
      .eq('role', 'mentor')
      .limit(5)
    
    if (data) setMentors(data)
  }

  const calculatePrice = async (duration: number) => {
    // In real app, call the backend
    const service = duration * 10
    const fee = service * 0.1
    setPricing({
      service,
      fee,
      total: service + fee
    })
  }

  const fetchAvailability = async () => {
    setLoading(true)
    try {
      // Mocking API call to Python backend
      // In production: const res = await axios.post('/api/bookings/check-availability', { mentor_id: bookingData.mentorId, date: bookingData.date })
      
      // Mock slots
      const slots = ["10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "05:00 PM"]
      setAvailableSlots(slots)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // 1. Create order in backend
      // const orderRes = await axios.post('/api/payments/create-razorpay-order', { ...bookingData, student_id: user.id })
      // const order = orderRes.data
      
      // Mock order
      const order = { id: "order_" + Math.random().toString(36).substr(2, 9), amount: pricing.total * 100 }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Apna Counsellor",
        description: `Consultation Call (${bookingData.duration} mins)`,
        order_id: order.id,
        handler: async function (response: any) {
          // 2. Verify payment in backend
          // const verifyRes = await axios.post('/api/payments/verify-payment', { ...response, booking_details: { ...bookingData, student_id: user.id } })
          
          // Mock verify
          toast.success("Payment Successful! Booking confirmed.")
          setStep(4)
        },
        prefill: {
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
        },
        theme: {
          color: "#0F172A",
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error: any) {
      toast.error(error.message || "Payment failed")
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-none rounded-[2.5rem] shadow-2xl bg-white dark:bg-slate-900 overflow-hidden border border-slate-100 dark:border-slate-800">
        <CardContent className="p-0">
          
          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          <div className="p-8 md:p-12">
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
                    <h2 className="text-3xl font-black mb-2">Choose Duration</h2>
                    <p className="text-slate-500 font-medium">How long would you like to talk?</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[5, 10, 15, 20, 30, 45].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => setBookingData({ ...bookingData, duration: mins })}
                        className={`p-6 rounded-[2rem] border-2 transition-all text-left group ${
                          bookingData.duration === mins 
                          ? "border-primary bg-primary/5" 
                          : "border-slate-100 dark:border-slate-800 hover:border-primary/50"
                        }`}
                      >
                        <Clock className={`h-6 w-6 mb-4 ${bookingData.duration === mins ? "text-primary" : "text-slate-400"}`} />
                        <div className="text-xl font-black">{mins} Mins</div>
                        <div className="text-sm font-bold text-slate-500 mt-1">₹{mins * 10}</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={nextStep} size="lg" className="rounded-2xl h-14 px-10 font-black gap-2">
                      Select Mentor <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
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
                    <h2 className="text-3xl font-black mb-2">Select Expert</h2>
                    <p className="text-slate-500 font-medium">Pick a mentor to guide you.</p>
                  </div>

                  <div className="space-y-4">
                    {mentors.map((mentor) => (
                      <button
                        key={mentor.id}
                        onClick={() => setBookingData({ ...bookingData, mentorId: mentor.id, mentorName: mentor.name })}
                        className={`w-full p-6 rounded-[2rem] border-2 transition-all text-left flex items-center gap-6 ${
                          bookingData.mentorId === mentor.id 
                          ? "border-primary bg-primary/5" 
                          : "border-slate-100 dark:border-slate-800 hover:border-primary/50"
                        }`}
                      >
                        <div className="h-16 w-16 rounded-2xl bg-slate-200 overflow-hidden">
                          {mentor.image ? <img src={mentor.image} alt={mentor.name} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center font-black text-slate-400">{mentor.name[0]}</div>}
                        </div>
                        <div className="flex-1">
                          <div className="text-xl font-black">{mentor.name}</div>
                          <div className="text-sm font-medium text-slate-500">{mentor.headline || "Expert Counselor"}</div>
                        </div>
                        <div className="text-right">
                           <div className="flex items-center gap-1 text-amber-500 font-black">
                              <span className="text-lg">{mentor.rating || "5.0"}</span>
                              <CheckCircle2 className="h-4 w-4" />
                           </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={prevStep} className="font-black">Back</Button>
                    <Button 
                      onClick={nextStep} 
                      disabled={!bookingData.mentorId}
                      size="lg" className="rounded-2xl h-14 px-10 font-black gap-2"
                    >
                      Pick Slot <ChevronRight className="h-5 w-5" />
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
                    <h2 className="text-3xl font-black mb-2">Schedule Call</h2>
                    <p className="text-slate-500 font-medium">When are you free?</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-slate-400">Date</label>
                      <input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-transparent px-4 font-black"
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-slate-400">Available Slots</label>
                      <div className="grid grid-cols-2 gap-2">
                        {loading ? (
                          <div className="col-span-2 flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : availableSlots.length > 0 ? (
                          availableSlots.map(slot => (
                            <button
                              key={slot}
                              onClick={() => setBookingData({ ...bookingData, time: slot })}
                              className={`h-12 rounded-xl border-2 transition-all font-bold ${
                                bookingData.time === slot 
                                ? "border-primary bg-primary text-white" 
                                : "border-slate-100 dark:border-slate-800 hover:border-primary/50"
                              }`}
                            >
                              {slot}
                            </button>
                          ))
                        ) : (
                          <p className="col-span-2 text-slate-400 text-sm font-medium italic">Please select a date to see slots.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                       <span className="font-bold text-slate-500">Service Fee</span>
                       <span className="font-black">₹{pricing.service}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                       <span className="font-bold text-slate-500">Platform Fee (10%)</span>
                       <span className="font-black">₹{pricing.fee}</span>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-4" />
                    <div className="flex justify-between items-center">
                       <span className="text-lg font-black">Total to Pay</span>
                       <span className="text-2xl font-black text-primary">₹{pricing.total}</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={prevStep} className="font-black">Back</Button>
                    <Button 
                      onClick={handlePayment} 
                      disabled={!bookingData.time || !bookingData.date || loading}
                      size="lg" className="rounded-2xl h-14 px-10 font-black gap-2"
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CreditCard className="h-5 w-5" /> Pay Now</>}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  </div>
                  <h2 className="text-4xl font-black mb-4">Booking Confirmed!</h2>
                  <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
                    Your consultation call with **{bookingData.mentorName}** is scheduled for **{bookingData.date}** at **{bookingData.time}**.
                  </p>
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 mb-10 text-left">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Video className="h-5 w-5" />
                       </div>
                       <div>
                          <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Meeting Link</div>
                          <div className="font-bold text-primary break-all">https://meet.jit.si/apna-counsellor-xyz</div>
                       </div>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      A calendar invite and email confirmation have been sent to your registered email address.
                    </p>
                  </div>

                  <Button className="rounded-2xl h-14 px-10 font-black" onClick={() => window.location.href = "/dashboard"}>
                    Go to Dashboard
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
