"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRazorpay } from "@/hooks/use-razorpay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ShieldCheck, Zap, ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function DynamicPaymentPage({ params }: { params: { id: string } }) {
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const { initiatePayment, isLoading: isPaying } = useRazorpay()
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const { data: userData } = await supabase.auth.getUser()
      setUser(userData.user)

      const { data, error } = await supabase
        .from('counselings')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        toast.error("Service not found")
        router.push("/courses")
      } else {
        setService(data)
      }
      setLoading(false)
    }
    fetchData()
  }, [params.id, supabase, router])

  const handlePay = async () => {
    if (!user) {
      toast.error("Please login to continue")
      router.push("/login")
      return
    }

    await initiatePayment({
      amount: service.price || 999,
      name: "Apna Counsellor",
      description: `${service.name} - Counseling Support`,
      prefill: {
        name: user.user_metadata?.full_name || user.email?.split('@')[0],
        email: user.email,
      },
      metadata: {
        user_id: user.id,
        service_id: service.id,
        type: "counseling_booking",
        service_name: service.name
      },
      onSuccess: () => {
        router.push("/dashboard?payment=success")
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!service) return null

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <div className="bg-purple-600 p-12 text-white relative overflow-hidden text-center">
            <div className="relative z-10 space-y-4">
               <Badge className="bg-white/20 text-white border-none px-4 py-1 rounded-full backdrop-blur-md">
                 Secure Checkout
               </Badge>
               <h1 className="text-4xl font-black">{service.name}</h1>
               <p className="text-purple-100 text-lg font-medium opacity-90">{service.category || 'Professional Counseling'}</p>
            </div>
            <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -top-20 -left-20 h-64 w-64 bg-purple-400/20 rounded-full blur-3xl" />
          </div>

          <CardContent className="p-10 space-y-8">
            <div className="flex justify-between items-center bg-slate-50 p-8 rounded-3xl border border-slate-100">
               <div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">Total Payable</p>
                  <h2 className="text-4xl font-black text-slate-900">₹{service.price || 999}</h2>
               </div>
               <ShieldCheck className="h-12 w-12 text-emerald-500 opacity-20" />
            </div>

            <div className="space-y-4">
               <h3 className="text-xl font-black flex items-center gap-2">
                 <Zap className="h-5 w-5 text-purple-600" />
                 What's Included
               </h3>
               <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Expert One-on-One Support",
                    "Priority Document Verification",
                    "Live Choice Filling Guidance",
                    "24/7 WhatsApp Assistance",
                    "Personalized College List",
                    "Scholarship Support"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                       <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                       <span>{item}</span>
                    </div>
                  ))}
               </div>
            </div>

            <Button 
              onClick={handlePay} 
              disabled={isPaying}
              className="w-full h-18 rounded-[1.5rem] bg-purple-600 hover:bg-purple-700 text-white font-black text-xl shadow-xl shadow-purple-200 transition-all hover:scale-[1.02] active:scale-95 py-8"
            >
              {isPaying ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  Proceed to Payment
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </Button>

            <div className="flex items-center justify-center gap-6 text-slate-400 font-bold text-sm">
               <div className="flex items-center gap-2">
                 <ShieldCheck className="h-4 w-4" /> Secure SSL
               </div>
               <div className="flex items-center gap-2">
                 <Zap className="h-4 w-4" /> Instant Activation
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
