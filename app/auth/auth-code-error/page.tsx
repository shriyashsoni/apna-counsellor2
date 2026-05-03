"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function AuthCodeErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const description = searchParams.get('error_description')

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900">
        <CardHeader className="pt-12 pb-6 text-center">
          <div className="h-20 w-20 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">Authentication Error</CardTitle>
          <p className="text-slate-500 font-medium mt-2">We couldn't sign you in.</p>
        </CardHeader>
        <CardContent className="px-8 pb-12 text-center">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-8 text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Error Details</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 break-words">
              {description || error || "An unexpected error occurred during the authentication process."}
            </p>
          </div>
          
          <div className="space-y-3">
            <Link href="/login" className="block w-full">
              <Button className="w-full h-12 rounded-xl font-black text-base shadow-lg shadow-primary/20">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
            <Link href="/" className="block w-full">
              <Button variant="ghost" className="w-full h-12 rounded-xl font-bold text-slate-500">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
              If this persists, please contact support with the error code above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
