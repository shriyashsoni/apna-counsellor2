'use client'
 
import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error)
  }, [error])
 
  return (
    <html>
      <body>
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 text-center space-y-8 border border-slate-100">
            <div className="h-24 w-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-red-500 shadow-inner">
              <AlertCircle className="h-12 w-12" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                Critical <span className="text-red-500 text-glow">System Error.</span>
              </h1>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                Something went wrong at the root of the application. We've been notified and are working on a fix.
              </p>
              {error.digest && (
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 py-2 rounded-xl border border-slate-100">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                onClick={() => reset()}
                className="h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
              >
                <RefreshCcw className="h-5 w-5" /> Try to Recover
              </Button>
              
              <Link href="/">
                <Button 
                  variant="outline"
                  className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                >
                  <Home className="h-5 w-5" /> Go to Home
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-6 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <span>Apna Counsellor Support</span>
            <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
            <span>2026 Admissions Portal</span>
          </div>
        </div>
      </body>
    </html>
  )
}
