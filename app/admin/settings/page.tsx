"use client"

import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { Settings, User, Bell, Shield, Loader2, Save, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "" })

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setForm({ name: data.name || '', email: data.email || user.email || '', phone: data.phone || '' })
      }
    }
    load()
  }, [user])

  const handleSave = async () => {
    if (!user?.id) return
    setIsLoading(true)
    try {
      const { error } = await supabase.from('profiles').update({
        name: form.name,
        phone: form.phone,
        updated_at: new Date().toISOString()
      }).eq('id', user.id)
      if (error) throw error
      setIsSaved(true)
      toast.success("Profile updated successfully!")
      setTimeout(() => setIsSaved(false), 3000)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <Settings className="h-6 w-6 text-purple-400" /> Admin Settings
        </h1>
        <p className="text-slate-500 text-xs mt-1 font-medium">Manage your admin account and platform preferences</p>
      </div>

      {/* Admin Profile */}
      <Card className="bg-slate-900 border border-white/5 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
          <User className="h-4 w-4 text-purple-400" />
          <h3 className="font-black text-white text-sm">Admin Profile</h3>
          <Badge className="bg-red-500/10 text-red-400 border-none text-[9px] font-black ml-auto">ADMIN</Badge>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Display Name</label>
            <Input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:border-purple-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Email Address (Read Only)</label>
            <Input
              value={form.email}
              disabled
              className="h-11 bg-white/[0.03] border-white/5 text-slate-500 rounded-xl cursor-not-allowed"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Phone Number</label>
            <Input
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:border-purple-500"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full h-11 rounded-xl bg-purple-600 text-white font-black hover:bg-purple-700 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
        >
          {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {isSaved ? "Saved!" : "Save Changes"}
        </Button>
      </Card>

      {/* Platform Info */}
      <Card className="bg-slate-900 border border-white/5 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
          <Shield className="h-4 w-4 text-purple-400" />
          <h3 className="font-black text-white text-sm">Platform Info</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          {[
            { label: "Platform", value: "Apna Counsellor" },
            { label: "Version", value: "v2.0.0" },
            { label: "Database", value: "Supabase PostgreSQL" },
            { label: "Auth Provider", value: "Supabase Auth" },
            { label: "Payments", value: "Razorpay" },
            { label: "Email", value: "Resend / Novu" },
          ].map(item => (
            <div key={item.label} className="space-y-0.5">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px]">{item.label}</p>
              <p className="text-slate-300 font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
