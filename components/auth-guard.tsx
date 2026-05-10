"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AuthGuardProps {
  children: React.ReactNode
  requireSubscription?: boolean
  message?: string
}

export function AuthGuard({ 
  children, 
  requireSubscription = false,
  message = "Please login to access this premium tool."
}: AuthGuardProps) {
  const [session, setSession] = useState<any>(undefined)
  const [profile, setProfile] = useState<any>(undefined)
  const [subscription, setSubscription] = useState<any>(undefined)
  const [isClient, setIsClient] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    async function checkAuth() {
      const { data: authData } = await supabase.auth.getSession()
      const currentSession = authData?.session
      setSession(currentSession)

      if (currentSession?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .maybeSingle()
        setProfile(profileData)

        if (requireSubscription) {
          const { data: subData } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', currentSession.user.id)
            .eq('status', 'active')
            .maybeSingle()
          setSubscription(subData)
        }
      }
    }
    checkAuth()
  }, [requireSubscription])

  const isLoading = session === undefined || (session && profile === undefined) || (session && requireSubscription && subscription === undefined)

  if (!isClient || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-bold text-slate-400">Verifying access...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Lock className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-black mb-2">Access Locked</h2>
        <p className="text-slate-500 font-medium max-w-sm mb-8">{message}</p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button className="rounded-xl px-8 font-black">Login to Unlock</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="rounded-xl px-8 font-black">Back Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (requireSubscription && (!subscription || subscription.status !== "active")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-primary/20 shadow-2xl shadow-primary/5">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 relative">
          <Lock className="h-12 w-12 text-primary" />
          <div className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-full">PRO</div>
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tight">Premium Membership Required</h2>
        <p className="text-slate-500 font-medium max-w-md mb-10 text-lg leading-relaxed">
          This advanced {requireSubscription ? "AI predictor" : "tool"} is reserved for our **Premium Members**. 
          Unlock all 100+ predictors, expert cutoffs, and AI counseling today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/pricing">
            <Button className="rounded-2xl h-14 px-10 font-black text-base shadow-xl shadow-primary/20">Upgrade Now</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="rounded-2xl h-14 px-10 font-black text-slate-500">Maybe Later</Button>
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
