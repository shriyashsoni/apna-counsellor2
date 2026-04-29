"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, GraduationCap, ShieldCheck, Globe, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const { signIn, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleGoogleLogin = async () => {
    setIsConnecting(true)
    try {
      console.log("Starting Google Login...")
      await signIn("google")
    } catch (error: any) {
      console.error("Sign in failed", error)
      alert(`Login failed: ${error.message || "Unknown error"}. Check console for details.`)
    } finally {
      setIsConnecting(false)
    }
  }

  const features = [
    { icon: GraduationCap, label: "Expert Mentors", sub: "IIT/NEET Specialists" },
    { icon: ShieldCheck, label: "99.9% Accuracy", sub: "Data-Driven Results" },
    { icon: Globe, label: "Pan India", sub: "20+ State Portals" },
    { icon: Sparkles, label: "AI Powered", sub: "Smart Predictions" },
  ]

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-slate-950 overflow-hidden">
      
      {/* Left Side: Aesthetic Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-indigo-900 opacity-90" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 p-20 opacity-20 rotate-12">
          <Sparkles className="h-64 w-64 text-white" />
        </div>
        
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl">
             <Image src="/images/apna-counsellor-logo.png" alt="Logo" width={40} height={40} />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">Apna Counsellor</span>
        </Link>

        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl font-black text-white leading-tight">
              India's Most <br /> 
              <span className="text-emerald-400">Trusted</span> Portal.
            </h1>
            <p className="text-white/70 text-xl mt-6 max-w-md font-medium leading-relaxed">
              Join 50,000+ students navigating their dream college admissions with AI precision.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex items-start gap-4 p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all cursor-default"
              >
                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{feature.label}</p>
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{feature.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-white/10">
           <p className="text-white/40 text-xs font-bold uppercase tracking-widest">© 2026 Apna Counsellor • Premium Admissions Partner</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-col justify-center items-center p-8 md:p-20 relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 lg:hidden pointer-events-none">
           <Sparkles className="h-64 w-64 text-primary" />
        </div>

        <div className="w-full max-w-md space-y-12 relative z-10">
          
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Welcome <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-4">Back</span></h2>
            <p className="text-slate-500 mt-4 text-lg font-medium">Continue your counselling journey with one click.</p>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-16 rounded-[1.5rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4 hover:border-primary dark:hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group cursor-pointer active:scale-95"
            >
              <div className="h-8 w-8 relative pointer-events-none">
                <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" fill className="object-contain" />
              </div>
              <span className="text-lg font-black text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors pointer-events-none">Continue with Google</span>
            </button>
            
            <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest py-4 relative">
              <span className="px-4 bg-white dark:bg-slate-950 relative z-10">Secure Google Authentication</span>
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-100 dark:bg-slate-900" />
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Link href="/onboarding" className="w-full">
                <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-100 dark:border-slate-800 font-bold hover:bg-slate-50 dark:hover:bg-slate-900">
                  New Student?
                </Button>
              </Link>
              <Link href="/contact" className="w-full">
                <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-100 dark:border-slate-800 font-bold hover:bg-slate-50 dark:hover:bg-slate-900">
                  Need Help?
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Verified by 50K+ Students</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              By continuing, you agree to Apna Counsellor's Terms of Service and Privacy Policy. Your data is encrypted and secure.
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}
