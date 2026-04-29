"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full text-center space-y-8 bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="h-20 w-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto">
          <AlertCircle className="h-10 w-10" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight">Something went wrong</h1>
          <p className="text-slate-500 font-medium">
            We encountered an unexpected error. Don&apos;t worry, your data is safe.
          </p>
        </div>

        <div className="grid gap-4">
          <Button 
            onClick={() => reset()}
            className="h-14 rounded-2xl font-black text-lg gap-2"
          >
            <RefreshCcw className="h-5 w-5" />
            Try Again
          </Button>
          
          <Link href="/">
            <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-lg gap-2 border-slate-200 dark:border-slate-800">
              <Home className="h-5 w-5" />
              Go Home
            </Button>
          </Link>
        </div>

        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-4">
          Error ID: {error.digest || "Unknown"}
        </p>
      </div>
    </div>
  )
}
