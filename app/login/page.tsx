"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, GraduationCap, ShieldCheck, Globe, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const { signIn, signInWithEmail, signUpWithEmail, sendPasswordReset, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  
  // Form State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleGoogleLogin = async () => {
    setIsConnecting(true)
    try {
      await signIn("google")
    } catch (error: any) {
      console.error("Sign in failed", error)
      const { toast } = await import("sonner")
      toast.error(`Login failed: ${error.message || "Unknown error"}`)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConnecting(true)
    try {
      if (authMode === 'login') {
        await signInWithEmail(email, password)
      } else {
        await signUpWithEmail(email, password, fullName)
        const { toast } = await import("sonner")
        toast.success("Verification email sent! Please check your inbox.")
      }
    } catch (error: any) {
      console.error("Auth error", error)
      const { toast } = await import("sonner")
      toast.error(error.message || "Authentication failed")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      const { toast } = await import("sonner")
      toast.warning("Please enter your email address first to reset your password.")
      return
    }
    
    setIsConnecting(true)
    try {
      await sendPasswordReset(email)
      const { toast } = await import("sonner")
      toast.success("Password reset email sent! Please check your inbox.")
    } catch (error: any) {
      console.error("Password reset error", error)
      const { toast } = await import("sonner")
      toast.error(error.message || "Failed to send password reset email")
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
      <div className="flex flex-col justify-center items-center p-8 md:p-20 relative bg-slate-50/50 dark:bg-slate-950">
        <div className="absolute top-0 right-0 p-12 opacity-5 lg:hidden pointer-events-none">
           <Sparkles className="h-64 w-64 text-primary" />
        </div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {authMode === 'login' ? 'Welcome ' : 'Get '}
              <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-4">
                {authMode === 'login' ? 'Back' : 'Started'}
              </span>
            </h2>
            <p className="text-slate-500 mt-4 text-lg font-medium">
              {authMode === 'login' ? 'Continue your journey' : 'Create your account'} with ease.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <div className="flex p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-8">
               <button 
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${authMode === 'login' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}
               >
                 Login
               </button>
               <button 
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${authMode === 'signup' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}
               >
                 Sign Up
               </button>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <AnimatePresence mode="wait">
                {authMode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input 
                      type="text"
                      placeholder="John Doe"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 outline-none transition-all font-bold"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <input 
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 outline-none transition-all font-bold"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-bold text-primary hover:underline hover:text-primary/80 focus:outline-none"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input 
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 outline-none transition-all font-bold"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isConnecting}
                className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isConnecting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  authMode === 'login' ? 'Login Now' : 'Create Account'
                )}
              </Button>
            </form>

            <div className="relative py-8">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-100 dark:bg-slate-800" />
              <span className="relative z-10 px-4 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mx-auto block w-fit">Or Continue With</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isConnecting}
              className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 flex items-center justify-center gap-3 transition-all active:scale-95 group"
            >
              <div className="h-6 w-6 relative">
                <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" fill className="object-contain" />
              </div>
              <span className="font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary">Google Account</span>
            </button>
          </div>

          <div className="p-6 rounded-[2rem] bg-slate-100/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 flex items-start gap-4">
            <div className="h-10 w-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Enterprise Grade Security</p>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                Your credentials are never stored locally. We use 256-bit AES encryption for all data transfers.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

