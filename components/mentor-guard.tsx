"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { Loader2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function MentorGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(undefined)
  const supabase = createClient()

  useEffect(() => {
    async function checkMentor() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        setUser(null)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()
      
      setUser(profile ? { ...authUser, ...profile } : null)
    }
    checkMentor()
  }, [])

  if (user === undefined) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="font-bold text-slate-400">Verifying Mentor Status...</p>
      </div>
    )
  }

  if (!user || user.role !== "mentor") {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center mb-6">
          <ShieldAlert className="h-10 w-10 text-orange-600" />
        </div>
        <h2 className="text-3xl font-black mb-2">Mentor Access Only</h2>
        <p className="text-slate-500 max-w-sm mb-8 font-medium">
          This portal is reserved for verified mentors. If you are a student, please use the main dashboard.
        </p>
        <div className="flex gap-4">
          <Link href="/mentor/register">
            <Button className="rounded-xl px-8 font-bold">Apply as Mentor</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-xl px-8 font-bold">Student Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
