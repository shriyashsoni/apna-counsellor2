"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Bell, Send, Loader2, Mail, Users, Clock, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { createBroadcastNotificationAction } from "@/lib/actions/admin"
import { sendBroadCastEmail } from "@/lib/actions/emails"

export default function AdminNotificationsPage() {
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userCount, setUserCount] = useState(0)
  const [userEmails, setUserEmails] = useState<string[]>([])
  const [recentNotifs, setRecentNotifs] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("all")

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "info",
    link: "",
    target: "all"
  })

  useEffect(() => {
    const loadData = async () => {
      // Fetch active courses
      const { data: courseList } = await supabase
        .from('courses')
        .select('id, title, slug')
        .eq('is_published', true)
      setCourses(courseList || [])

      // Fetch recent broadcasts with course name join
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*, courses(title)')
        .order('created_at', { ascending: false })
        .limit(10)
      setRecentNotifs(notifs || [])
    }
    loadData()
  }, [])

  useEffect(() => {
    const updateAudience = async () => {
      if (selectedCourse === "all") {
        const { data: users } = await supabase.from('profiles').select('email').eq('role', 'student')
        const emails = (users || []).map(u => u.email).filter(Boolean)
        setUserEmails(emails)
        setUserCount(emails.length)
      } else {
        const { data: enrolls } = await supabase
          .from('course_enrollments')
          .select('profiles(email)')
          .eq('course_id', selectedCourse)
          .eq('status', 'active')
        const emails = (enrolls || []).map((e: any) => e.profiles?.email).filter(Boolean)
        setUserEmails(emails)
        setUserCount(emails.length)
      }
    }
    updateAudience()
  }, [selectedCourse])

  const handleBroadcast = async () => {
    if (!form.title || !form.message) return toast.error("Title and message are required!")
    setIsSubmitting(true)
    try {
      const result = await createBroadcastNotificationAction(
        form.title, 
        form.message, 
        form.type, 
        form.link, 
        selectedCourse
      )
      if (!result.success) throw new Error(result.error)

      if (userEmails.length > 0) {
        try {
          await sendBroadCastEmail(userEmails, form.title, form.message, form.link)
        } catch {
          console.warn("Email broadcast failed silently")
        }
      }

      toast.success(`Broadcast sent to ${userCount} students!`)
      setForm({ title: "", message: "", type: "info", link: "", target: "all" })
      setSelectedCourse("all")

      // Refresh recent notifications
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*, courses(title)')
        .order('created_at', { ascending: false })
        .limit(10)
      setRecentNotifs(notifs || [])
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <Bell className="h-7 w-7 text-[#00FF88]" /> Notifications & Broadcasts
        </h1>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">
          Send instant alerts to target students in-app and via email
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Compose Form */}
        <div className="lg:col-span-7">
          <Card className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-8 space-y-6">
            <h3 className="text-md font-black text-white flex items-center gap-2">
              <Send className="h-4 w-4 text-[#00FF88]" /> Compose Broadcast
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Target Audience</label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl text-xs font-bold">
                    <SelectValue placeholder="Select target audience..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f0f0f] border-white/10 text-white text-xs">
                    <SelectItem value="all">📢 All Registered Students</SelectItem>
                    {courses.map(c => (
                      <SelectItem key={c.id} value={c.id}>🎓 Subscribers of: {c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Alert Title</label>
                <Input
                  placeholder="e.g. MHT-CET Round 2 Results Are Out!"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 text-white rounded-xl font-semibold placeholder:text-slate-600 focus:border-[#00FF88]"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Message Body</label>
                <Textarea
                  placeholder="Type the full notification message here..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="min-h-[120px] bg-white/5 border-white/10 text-white rounded-xl font-medium leading-relaxed placeholder:text-slate-600 focus:border-[#00FF88]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Notification Type</label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f0f0f] border-white/10 text-white text-xs">
                    <SelectItem value="info">Info (Blue)</SelectItem>
                    <SelectItem value="success">Success (Green)</SelectItem>
                    <SelectItem value="warning">Important (Orange)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Action URL (Optional)</label>
                <Input
                  placeholder="https://..."
                  value={form.link}
                  onChange={e => setForm({ ...form, link: e.target.value })}
                  className="h-11 bg-white/5 border-white/10 text-white rounded-xl text-xs font-bold placeholder:text-slate-600 focus:border-[#00FF88]"
                />
              </div>
            </div>

            {/* Audience indicator */}
            <div className="p-4 bg-[#00FF88]/5 border border-[#00FF88]/10 rounded-xl flex items-center gap-3">
              <Users className="h-5 w-5 text-[#00FF88]" />
              <p className="text-xs font-bold text-[#00FF88]">
                This broadcast will reach <span className="font-black">{userCount} students</span> via in-app notification + email.
              </p>
            </div>

            <Button
              onClick={handleBroadcast}
              disabled={isSubmitting}
              className="w-full h-14 rounded-xl bg-[#00FF88] text-black font-black text-base hover:bg-[#00e077] flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,255,136,0.15)] transition-all hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <><Send className="h-5 w-5" /> Broadcast Now</>
              )}
            </Button>
          </Card>
        </div>

        {/* Recent Notifications Feed */}
        <div className="lg:col-span-5">
          <Card className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#00FF88]" /> Recent Broadcasts
            </h3>
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {recentNotifs.map(n => (
                <div key={n.id} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white leading-snug">{n.title}</p>
                      {n.courses?.title && (
                        <p className="text-[9px] text-[#00FF88] font-black uppercase tracking-wider">🎯 Course: {n.courses.title}</p>
                      )}
                    </div>
                    <Badge className={`border-none text-[8px] font-black flex-shrink-0 ${
                      n.type === 'success' ? 'bg-[#00FF88]/10 text-[#00FF88]' :
                      n.type === 'warning' ? 'bg-amber-50/10 text-amber-400' :
                      'bg-blue-50/10 text-blue-400'
                    }`}>
                      {(n.type || 'info').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">{n.message}</p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
              {recentNotifs.length === 0 && (
                <div className="py-10 text-center text-slate-600 font-bold italic text-xs">
                  No broadcasts sent yet.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
