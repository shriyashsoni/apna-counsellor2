"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { getBroadcastEmail } from "@/lib/broadcast-template"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { toast } from "sonner"
import {
  Send, Radio, Users, BookOpen, Sparkles, Loader2,
  CheckCircle2, Mail, Eye, Clock
} from "lucide-react"

const ACCENT_COLORS = [
  { label: 'Purple (Default)', value: '#7c3aed' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Rose', value: '#e11d48' },
  { label: 'Amber', value: '#d97706' },
]

export default function AdminBroadcastPage() {
  const supabase = createClient()
  const [courses, setCourses] = useState<any[]>([])
  const [isSending, setIsSending] = useState(false)
  const [sentResult, setSentResult] = useState<{ sent: number; total: number } | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [broadcastLogs, setBroadcastLogs] = useState<any[]>([])

  const [form, setForm] = useState({
    subject: '',
    body: '',
    ctaText: '',
    ctaUrl: '',
    accentColor: '#7c3aed',
    audience: 'all',
    courseId: '',
  })

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('courses')
        .select('id, title')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      setCourses(data || [])

      const { data: logs } = await supabase
        .from('course_audit_logs')
        .select('*')
        .eq('action', 'broadcast_sent')
        .order('created_at', { ascending: false })
        .limit(10)
      setBroadcastLogs(logs || [])
    }
    load()
  }, [])

  const previewHtml = getBroadcastEmail({
    subject: form.subject || 'Preview Subject',
    body: form.body || '<p>Your message will appear here...</p>',
    ctaText: form.ctaText || undefined,
    ctaUrl: form.ctaUrl || undefined,
    accentColor: form.accentColor,
  })

  const handleSend = async () => {
    if (!form.subject || !form.body) {
      toast.error("Subject and body are required!")
      return
    }
    if (form.audience === 'course' && !form.courseId) {
      toast.error("Please select a course!")
      return
    }
    if (!confirm(`You are about to send a broadcast email to ${form.audience === 'all' ? 'ALL enrolled students' : 'students of the selected course'}. Proceed?`)) return

    setIsSending(true)
    setSentResult(null)
    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: form.subject,
          html: previewHtml,
          audience: form.audience,
          courseId: form.courseId || undefined,
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSentResult({ sent: data.sent, total: data.total })
      toast.success(`Broadcast sent to ${data.sent} students!`)

      // Refresh logs
      const { data: logs } = await supabase
        .from('course_audit_logs')
        .select('*')
        .eq('action', 'broadcast_sent')
        .order('created_at', { ascending: false })
        .limit(10)
      setBroadcastLogs(logs || [])
    } catch (err: any) {
      toast.error(err.message || 'Broadcast failed')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
            <Radio className="h-8 w-8 text-[#00FF88] animate-pulse" />
            Email Broadcast Center
          </h1>
          <p className="text-slate-500 font-medium text-xs uppercase tracking-wider mt-1">
            Send mass emails to enrolled students via Resend
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            className="rounded-xl h-11 px-5 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold flex items-center gap-2"
          >
            <Eye className="h-4 w-4 text-[#00FF88]" /> {showPreview ? 'Hide' : 'Preview'} Email
          </Button>
        </div>
      </div>

      {/* Result Banner */}
      {sentResult && (
        <div className="bg-[#00FF88]/10 border border-[#00FF88]/20 rounded-2xl p-5 flex items-center gap-4">
          <CheckCircle2 className="h-8 w-8 text-[#00FF88] shrink-0" />
          <div>
            <p className="font-black text-white text-lg">Broadcast Delivered!</p>
            <p className="text-slate-400 font-medium">
              Successfully sent to <span className="text-[#00FF88] font-black">{sentResult.sent}</span> students.
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-8">
        {/* FORM */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-[#0f0f0f] border border-white/8 rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-black text-[#00FF88] uppercase tracking-widest flex items-center gap-2">
              <Mail className="h-4 w-4" /> Compose Broadcast
            </h2>

            {/* Audience */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Audience</label>
                <Select value={form.audience} onValueChange={v => setForm({ ...form, audience: v, courseId: '' })}>
                  <SelectTrigger className="h-11 rounded-xl bg-white/5 border-white/10 text-white font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                    <SelectItem value="all">
                      <span className="flex items-center gap-2"><Users className="h-4 w-4 text-[#00FF88]" /> All Enrolled Students</span>
                    </SelectItem>
                    <SelectItem value="course">
                      <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-400" /> Specific Course Only</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.audience === 'course' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Select Course</label>
                  <Select value={form.courseId} onValueChange={v => setForm({ ...form, courseId: v })}>
                    <SelectTrigger className="h-11 rounded-xl bg-white/5 border-white/10 text-white font-bold">
                      <SelectValue placeholder="Choose a course..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                      {courses.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Email Subject *</label>
              <Input
                placeholder="e.g. 🚨 Important Update: MHT CET Round 2 Starts Today!"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="h-12 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88]"
              />
            </div>

            {/* Body */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                Message Body * <span className="text-slate-600 normal-case font-medium">(HTML supported)</span>
              </label>
              <Textarea
                placeholder={`<p>Dear Students,</p>\n<p>We want to inform you about...</p>\n<p>This is important because...</p>`}
                value={form.body}
                onChange={e => setForm({ ...form, body: e.target.value })}
                className="min-h-[180px] bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88] font-mono text-sm"
              />
            </div>

            {/* CTA (Optional) */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">CTA Button Text (Optional)</label>
                <Input
                  placeholder="e.g. View Course"
                  value={form.ctaText}
                  onChange={e => setForm({ ...form, ctaText: e.target.value })}
                  className="h-11 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">CTA Button URL (Optional)</label>
                <Input
                  placeholder="https://apnacounsellor.in/courses/..."
                  value={form.ctaUrl}
                  onChange={e => setForm({ ...form, ctaUrl: e.target.value })}
                  className="h-11 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88]"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Email Accent Color</label>
              <div className="flex gap-3 flex-wrap">
                {ACCENT_COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setForm({ ...form, accentColor: c.value })}
                    title={c.label}
                    className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${form.accentColor === c.value ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={isSending}
              className="w-full h-14 bg-[#00FF88] text-black font-black text-lg rounded-2xl hover:bg-[#00e077] flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,255,136,0.2)] transition-all hover:scale-[1.01]"
            >
              {isSending ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Sending Broadcast...</>
              ) : (
                <><Send className="h-5 w-5" /> Send Broadcast Email</>
              )}
            </Button>
          </Card>

          {/* Broadcast Log */}
          {broadcastLogs.length > 0 && (
            <Card className="bg-[#0f0f0f] border border-white/8 rounded-2xl p-6">
              <h2 className="text-sm font-black text-[#00FF88] uppercase tracking-widest flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4" /> Recent Broadcasts
              </h2>
              <div className="space-y-3">
                {broadcastLogs.map(log => (
                  <div key={log.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <CheckCircle2 className="h-4 w-4 text-[#00FF88] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white line-clamp-1">{log.details}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {new Date(log.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* EMAIL PREVIEW */}
        <div className="lg:col-span-2">
          <div className="sticky top-4 space-y-4">
            <div className="bg-[#0f0f0f] border border-white/8 rounded-2xl p-4">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-[#00FF88]" /> Live Email Preview
              </h3>
              <div className="bg-white rounded-xl overflow-hidden border border-white/5 shadow-2xl" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <iframe
                  srcDoc={previewHtml}
                  className="w-full border-none"
                  style={{ height: '600px' }}
                  title="Email Preview"
                />
              </div>
              <p className="text-[10px] text-slate-600 text-center mt-2 font-medium">This is exactly what students will receive in their Gmail inbox</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
