"use client"

import { useConvexAuth, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
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
  const { isAuthenticated, isLoading } = useConvexAuth()
  const user = useQuery(api.users.currentUser)
  const subscription = useQuery(api.subscriptions.getActive, { userId: user?._id ?? "" })
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-bold text-slate-400">Verifying access...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
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
