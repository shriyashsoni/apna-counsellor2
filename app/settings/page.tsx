"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Laptop, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck,
  CreditCard as BillingIcon,
  LogOut,
  Mail,
  Lock,
  Smartphone,
  Eye,
  EyeOff
} from "lucide-react"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"

type TabType = 'profile' | 'notifications' | 'security' | 'billing' | 'app'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: ""
  })
  
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: authData } = await supabase.auth.getUser()
      const authUser = authData?.user
      if (!authUser) {
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()
      
      const fullUser = profile ? { ...authUser, ...profile } : authUser
      setUser(fullUser)
      setFormData({
        name: fullUser.name || "",
        bio: fullUser.bio || "",
        phone: fullUser.phone || ""
      })
      setLoading(false)
    }
    loadUser()
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        name: formData.name,
        bio: formData.bio,
        phone: formData.phone
      })
      .eq('id', user.id)

    if (error) {
      toast.error("Failed to update profile")
    } else {
      toast.success("Profile updated successfully")
      setUser({ ...user, ...formData })
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const sidebarItems = [
    { id: 'profile' as TabType, icon: User, label: "Profile" },
    { id: 'notifications' as TabType, icon: Bell, label: "Notifications" },
    { id: 'security' as TabType, icon: Shield, label: "Security" },
    { id: 'billing' as TabType, icon: CreditCard, label: "Billing" },
    { id: 'app' as TabType, icon: Laptop, label: "App Settings" },
  ]

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Account <span className="text-primary text-glow">Settings.</span></h1>
          <p className="text-slate-500 font-medium text-lg">Manage your profile, security, and global preferences.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === item.id 
                  ? "bg-primary text-white shadow-xl shadow-primary/20" 
                  : "bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-100"
                }`}
              >
                <item.icon className={`h-5 w-5 ${activeTab === item.id ? "text-white" : "text-slate-400"}`} />
                {item.label}
              </button>
            ))}
            
            <div className="pt-8">
               <button 
                onClick={() => supabase.auth.signOut().then(() => window.location.href = "/")}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
               >
                  <LogOut className="h-5 w-5" />
                  Sign Out
               </button>
            </div>
          </aside>

          {/* Content Area */}
          <main className="lg:col-span-9">
            {activeTab === 'profile' && (
              <Card className="border-none rounded-[3rem] bg-white shadow-2xl overflow-hidden">
                <CardHeader className="p-10 pb-0">
                  <CardTitle className="text-3xl font-black tracking-tight">Personal Information</CardTitle>
                  <CardDescription className="text-slate-500 font-medium text-base">Update your public profile details.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="h-32 w-32 rounded-[2.5rem] bg-slate-100 flex items-center justify-center text-slate-300 relative group overflow-hidden border-4 border-white shadow-xl">
                      {user?.image ? (
                        <img src={user.image} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-12 w-12" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <span className="text-[10px] font-black uppercase text-white">Change</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-6 w-full">
                       <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                            <Input 
                              value={formData.name} 
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="h-14 rounded-2xl border-slate-100 font-bold bg-slate-50/50" 
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <Input 
                              value={user?.email} 
                              disabled 
                              className="h-14 rounded-2xl border-slate-100 font-bold bg-slate-100 text-slate-400 cursor-not-allowed" 
                            />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bio / About You</label>
                          <textarea 
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            className="w-full min-h-[120px] rounded-[2rem] border-slate-100 bg-slate-50/50 p-6 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="Tell us about your academic goals..."
                          />
                       </div>
                       <Button 
                        onClick={handleSaveProfile} 
                        disabled={saving}
                        className="h-14 rounded-2xl px-10 font-black shadow-xl shadow-primary/20"
                       >
                         {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                         Save Profile Changes
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="border-none rounded-[3rem] bg-white shadow-2xl overflow-hidden">
                <CardHeader className="p-10 pb-0">
                  <CardTitle className="text-3xl font-black tracking-tight">Notification Settings</CardTitle>
                  <CardDescription className="text-slate-500 font-medium text-base">Choose how you want to be alerted.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-6">
                   {[
                     { title: "Email Notifications", desc: "Receive round alerts and college updates via email.", active: true },
                     { title: "Push Notifications", desc: "Get instant desktop alerts for mentorship sessions.", active: true },
                     { title: "SMS Alerts", desc: "Get critical admission deadlines on your phone.", active: false },
                     { title: "Marketing Emails", desc: "Stay updated with new features and offers.", active: true },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-50">
                        <div className="space-y-1">
                           <h4 className="font-bold text-slate-900">{item.title}</h4>
                           <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                        </div>
                        <Switch defaultChecked={item.active} className="data-[state=checked]:bg-primary" />
                     </div>
                   ))}
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card className="border-none rounded-[3rem] bg-white shadow-2xl overflow-hidden">
                <CardHeader className="p-10 pb-0">
                  <CardTitle className="text-3xl font-black tracking-tight">Security & Privacy</CardTitle>
                  <CardDescription className="text-slate-500 font-medium text-base">Manage your account protection and data.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                   <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-6">
                      <div className="h-16 w-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm">
                         <ShieldCheck className="h-8 w-8" />
                      </div>
                      <div>
                         <h4 className="text-xl font-black text-slate-900">Two-Factor Authentication</h4>
                         <p className="text-slate-500 font-medium">Add an extra layer of security to your account.</p>
                      </div>
                      <Button variant="outline" className="ml-auto rounded-xl border-emerald-200 text-emerald-600 font-bold">Enable 2FA</Button>
                   </div>

                   <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Change Password</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                            <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                            <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50" />
                         </div>
                      </div>
                      <Button className="h-14 rounded-2xl px-10 font-black shadow-lg">Update Security</Button>
                   </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'billing' && (
              <Card className="border-none rounded-[3rem] bg-white shadow-2xl overflow-hidden">
                <CardHeader className="p-10 pb-0">
                  <CardTitle className="text-3xl font-black tracking-tight">Billing & Payments</CardTitle>
                  <CardDescription className="text-slate-500 font-medium text-base">Manage your subscriptions and payment methods.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-10">
                   <div className="p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden group">
                      <div className="relative z-10">
                        <Badge className="bg-primary/20 text-primary border-primary/20 mb-4 font-black text-[10px] uppercase">Active Plan</Badge>
                        <h4 className="text-4xl font-black mb-2 tracking-tight">Alpha Pro Elite</h4>
                        <p className="text-slate-400 font-medium mb-8">Your subscription renews on **June 12, 2026**.</p>
                        <div className="flex gap-4">
                           <Button className="rounded-xl h-12 px-8 font-black bg-white text-slate-900 hover:bg-slate-50">Manage Subscription</Button>
                           <Button variant="ghost" className="rounded-xl h-12 px-8 font-bold text-white hover:bg-white/10">View Invoices</Button>
                        </div>
                      </div>
                      <BillingIcon className="absolute -bottom-10 -right-10 h-48 w-48 text-white/5 rotate-12" />
                   </div>

                   <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Payment Methods</h3>
                      <div className="p-6 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 text-center">
                         <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <CreditCard className="h-6 w-6" />
                         </div>
                         <p className="text-sm font-bold text-slate-400">No payment methods saved.</p>
                         <Button variant="outline" className="rounded-xl border-slate-200 font-black">Add New Method</Button>
                      </div>
                   </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'app' && (
              <Card className="border-none rounded-[3rem] bg-white shadow-2xl overflow-hidden">
                <CardHeader className="p-10 pb-0">
                  <CardTitle className="text-3xl font-black tracking-tight">App Settings</CardTitle>
                  <CardDescription className="text-slate-500 font-medium text-base">Personalize your global application experience.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                   <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-50">
                      <div className="space-y-1">
                         <h4 className="font-bold text-slate-900">Dark Mode</h4>
                         <p className="text-sm text-slate-500 font-medium">Toggle between light and dark interface themes.</p>
                      </div>
                      <Switch className="data-[state=checked]:bg-primary" />
                   </div>

                   <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-50">
                      <div className="space-y-1">
                         <h4 className="font-bold text-slate-900">Compact View</h4>
                         <p className="text-sm text-slate-500 font-medium">Reduce whitespace and use smaller fonts globally.</p>
                      </div>
                      <Switch className="data-[state=checked]:bg-primary" />
                   </div>

                   <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-50">
                      <div className="space-y-1">
                         <h4 className="font-bold text-slate-900">Auto-Save Sessions</h4>
                         <p className="text-sm text-slate-500 font-medium">Automatically save your counseling chat history.</p>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                   </div>
                </CardContent>
              </Card>
            )}

            {/* Danger Zone */}
            <div className="mt-12 p-10 rounded-[3rem] border-2 border-dashed border-red-200 bg-red-500/5">
                <div className="flex items-center gap-6 mb-6">
                   <div className="h-16 w-16 rounded-[1.5rem] bg-red-500/10 flex items-center justify-center text-red-500 shadow-sm">
                      <LogOut className="h-8 w-8" />
                   </div>
                   <div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">Danger Zone</h4>
                      <p className="text-slate-500 font-medium">Delete your account and all associated data permanently.</p>
                   </div>
                </div>
                <Button variant="destructive" className="h-14 rounded-2xl px-10 font-black shadow-xl shadow-red-500/10">Delete Account Permanently</Button>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
