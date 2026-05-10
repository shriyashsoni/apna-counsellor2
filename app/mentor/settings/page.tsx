"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  User, 
  Settings, 
  Save, 
  ArrowLeft,
  Camera,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"

export default function MentorSettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>({
    name: "",
    bio: "",
    college: "",
    branch: "",
    pricing: 499,
    image: ""
  })

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (data) {
        setProfile(data)
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        name: profile.name,
        bio: profile.bio,
        college: profile.college,
        branch: profile.branch,
        pricing: parseInt(profile.pricing),
        image: profile.image,
      })
      .eq('id', user.id)

    if (error) {
      toast.error("Failed to update profile: " + error.message)
    } else {
      toast.success("Profile updated successfully!")
      router.refresh()
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <Button variant="ghost" onClick={() => router.back()} className="rounded-full h-12 w-12 bg-white shadow-sm">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-4xl font-black tracking-tighter">Profile <span className="text-primary">Settings.</span></h1>
          </div>

          <div className="grid gap-8">
            <Card className="border-none rounded-[2.5rem] shadow-xl bg-white overflow-hidden">
               <CardHeader className="p-10 pb-0">
                  <CardTitle className="text-2xl font-black">Professional Identity</CardTitle>
               </CardHeader>
               <CardContent className="p-10 space-y-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                     <div className="relative group">
                        <div className="h-32 w-32 rounded-[2rem] bg-slate-100 overflow-hidden border-4 border-slate-50 shadow-inner">
                           {profile.image ? (
                             <img src={profile.image} alt="Profile" className="h-full w-full object-cover" />
                           ) : (
                             <User className="h-full w-full p-8 text-slate-300" />
                           )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] flex items-center justify-center cursor-pointer">
                           <Camera className="h-8 w-8 text-white" />
                        </div>
                     </div>
                     <div className="flex-1 space-y-4 w-full">
                        <div className="space-y-2">
                           <Label className="font-black text-xs uppercase tracking-widest text-slate-400">Profile Image URL</Label>
                           <Input 
                             value={profile.image || ''} 
                             onChange={(e) => setProfile({...profile, image: e.target.value})}
                             placeholder="https://example.com/photo.jpg"
                             className="rounded-xl h-12 border-slate-100 font-bold"
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="font-black text-xs uppercase tracking-widest text-slate-400">Full Name</Label>
                           <Input 
                             value={profile.name || ''} 
                             onChange={(e) => setProfile({...profile, name: e.target.value})}
                             className="rounded-xl h-12 border-slate-100 font-bold"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" /> College / Institution
                      </Label>
                      <Input 
                        value={profile.college || ''} 
                        onChange={(e) => setProfile({...profile, college: e.target.value})}
                        className="rounded-xl h-12 border-slate-100 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Briefcase className="h-4 w-4" /> Branch / Specialization
                      </Label>
                      <Input 
                        value={profile.branch || ''} 
                        onChange={(e) => setProfile({...profile, branch: e.target.value})}
                        className="rounded-xl h-12 border-slate-100 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-black text-xs uppercase tracking-widest text-slate-400">Professional Bio</Label>
                    <Textarea 
                      value={profile.bio || ''} 
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      rows={6}
                      placeholder="Share your expertise and how you can help students..."
                      className="rounded-2xl border-slate-100 font-medium leading-relaxed p-4"
                    />
                  </div>

                  <div className="space-y-2 max-w-xs">
                    <Label className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" /> Consultation Fee (₹)
                    </Label>
                    <Input 
                      type="number"
                      value={profile.pricing || 499} 
                      onChange={(e) => setProfile({...profile, pricing: e.target.value})}
                      className="rounded-xl h-12 border-slate-100 font-black text-xl text-emerald-600"
                    />
                  </div>

                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 font-black text-xl shadow-2xl shadow-primary/20"
                  >
                    {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Save className="mr-2 h-6 w-6" /> Save Profile Changes</>}
                  </Button>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
