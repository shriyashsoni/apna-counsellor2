"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { Loader2, ShieldAlert, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(undefined)
  const supabase = createClient()

  useEffect(() => {
    async function checkAdmin() {
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
    checkAdmin()
  }, [])

  if (user === undefined) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="font-bold text-slate-400">Verifying Admin Privileges...</p>
      </div>
    )
  }

  // Strict email check for admins
  const isAdmin = user && (
    user.email === "apnacounsellor@gmail.com" || 
    user.email === "sonishriyash@gmail.com" || 
    (user as any).isAdmin === true || 
    user.role === "admin"
  );

  if (!user || !isAdmin) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-950 text-white">
        <div className="h-24 w-24 rounded-full bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20">
          <Lock className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-4xl font-black mb-4 tracking-tighter">Restricted Access</h2>
        <p className="text-slate-400 max-w-sm mb-10 font-medium text-lg">
          This command center is reserved for the platform owner. Unauthorized access attempts are logged.
        </p>
        <Link href="/">
          <Button variant="outline" className="rounded-2xl h-14 px-10 font-black border-slate-800 hover:bg-slate-900 transition-all">
            Return to Safety
          </Button>
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
