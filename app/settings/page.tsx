"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Bell, Shield, CreditCard, Laptop } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(undefined)
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
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
      
      setUser(profile ? { ...authUser, ...profile } : authUser)
    }
    loadUser()
  }, [])

  if (user === undefined) return null
  if (user === null) return <div>Please login to access settings.</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Account Settings</h1>
        <p className="text-slate-500 font-medium">Manage your profile, notifications, and security preferences.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <aside className="space-y-1">
          {[
            { icon: User, label: "Profile", active: true },
            { icon: Bell, label: "Notifications", active: false },
            { icon: Shield, label: "Security", active: false },
            { icon: CreditCard, label: "Billing", active: false },
            { icon: Laptop, label: "App Settings", active: false },
          ].map((item, i) => (
            <Button
              key={i}
              variant="ghost"
              className={`w-full justify-start gap-3 rounded-xl h-11 font-bold ${item.active ? "bg-primary/10 text-primary" : "text-slate-500"}`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </aside>

        <div className="md:col-span-3 space-y-6">
          <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="px-8 pt-8">
              <CardTitle className="text-xl font-black">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Full Name</label>
                  <Input defaultValue={user.name || ""} className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Email Address</label>
                  <Input defaultValue={user.email || ""} disabled className="rounded-xl h-12 bg-slate-50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Bio</label>
                <textarea 
                  className="w-full min-h-[100px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent p-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>
              <Button className="rounded-xl h-12 px-8 font-black">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 border-red-100">
            <CardHeader className="px-8 pt-8 text-red-500">
              <CardTitle className="text-xl font-black">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-sm text-slate-500 font-medium mb-6">Once you delete your account, there is no going back. Please be certain.</p>
              <Button variant="destructive" className="rounded-xl h-12 px-8 font-black">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
