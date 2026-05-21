"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { FileText, ArrowLeft, Loader2, Tag, Eye, Zap, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function AdminBlogsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTriggering, setIsTriggering] = useState(false)
  const [agentTriggered, setAgentTriggered] = useState(false)

  const handleTriggerAgent = async () => {
    setIsTriggering(true)
    setAgentTriggered(false)
    try {
      const topic = form.title || "Random Admission Counselling Topic for India"
      const res = await fetch("/api/admin/trigger-agent", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to trigger")
      
      setAgentTriggered(true)
      toast.success("🤖 AI Agent generated the blog! Review it below.")
      
      // Auto-fill form with generated content
      if (data.blog) {
        setForm(prev => ({
          ...prev,
          title: data.blog.title || prev.title,
          subtitle: data.blog.subtitle || prev.subtitle,
          body: data.blog.body || prev.body,
          tags: data.blog.tags && data.blog.tags.length > 0 ? data.blog.tags : prev.tags,
          meta_title: data.blog.title || prev.meta_title,
          meta_description: data.blog.subtitle || prev.meta_description,
        }))
      }
    } catch (err: any) {
      toast.error(`Agent Error: ${err.message}`)
    } finally {
      setIsTriggering(false)
    }
  }
  const [tagInput, setTagInput] = useState("")

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    body: "",
    category: "College Admissions",
    tags: [] as string[],
    author_name: "",
    author_role: "",
    cover_image_url: "",
    meta_title: "",
    meta_description: "",
    focus_keyword: "",
    status: "published",
    is_featured: false,
    newsletter_push: false,
  })

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] })
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) })
  }

  const handlePublish = async () => {
    if (!form.title || !form.body) return toast.error("Title and body are required!")
    setIsSubmitting(true)
    try {
      const slug = form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
      const wordCount = form.body.split(/\s+/).length
      const readTime = Math.ceil(wordCount / 200)

      const { error } = await supabase.from('blogs').insert({
        title: form.title,
        slug,
        subtitle: form.subtitle,
        body: form.body,
        body_html: `<p>${form.body.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`,
        category: form.category,
        tags: form.tags,
        author_name: form.author_name || 'Apna Counsellor Team',
        author_role: form.author_role || 'Admission Expert',
        cover_image_url: form.cover_image_url,
        meta_title: form.meta_title || form.title,
        meta_description: form.meta_description || form.subtitle,
        focus_keyword: form.focus_keyword,
        status: form.status,
        is_featured: form.is_featured,
        newsletter_push: form.newsletter_push,
        read_time_minutes: readTime,
        published_at: form.status === 'published' ? new Date().toISOString() : null,
      })

      if (error) throw error
      toast.success("Blog post published successfully!")
      router.push("/admin")
    } catch (err: any) {
      toast.error(`Publish Failed: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin")}
            className="rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white h-10 w-10 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#00FF88]" /> Blog Post Creator
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Publish articles & admission guides to the platform</p>
          </div>
        </div>
        <div className="flex gap-3">
          {/* AI Agent Trigger Button */}
          <Button
            onClick={handleTriggerAgent}
            disabled={isTriggering || agentTriggered}
            className={`rounded-xl h-11 px-5 font-black text-xs flex items-center gap-2 border transition-all ${
              agentTriggered
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default"
                : "bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
            }`}
          >
            {isTriggering ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : agentTriggered ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {isTriggering ? "Triggering..." : agentTriggered ? "Agent Running!" : "Run AI Agent"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setForm({ ...form, status: 'draft' })}
            className="rounded-xl border border-white/10 text-slate-400 hover:text-white h-11 px-5 font-bold text-xs"
          >
            Save Draft
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isSubmitting}
            className="rounded-xl bg-[#00FF88] text-black font-black h-11 px-6 hover:bg-[#00e077] flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,136,0.15)]"
          >
            {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Eye className="h-4 w-4" />}
            Publish Live
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Article Title</label>
              <Input
                placeholder="e.g. How to Crack MHT-CET Counselling: Complete Guide"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="h-14 bg-white/5 border-white/10 text-white text-lg font-black rounded-xl placeholder:text-slate-600 focus:border-[#00FF88]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Subtitle / Excerpt</label>
              <Input
                placeholder="Short description shown in cards and Google search..."
                value={form.subtitle}
                onChange={e => setForm({ ...form, subtitle: e.target.value })}
                className="h-11 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Article Body</label>
              <Textarea
                placeholder="Write your full article here. Use double newlines for paragraphs..."
                value={form.body}
                onChange={e => setForm({ ...form, body: e.target.value })}
                className="min-h-[400px] bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 font-medium leading-relaxed focus:border-[#00FF88]"
              />
              <p className="text-[9px] text-slate-600 font-bold">
                {form.body.split(/\s+/).filter(Boolean).length} words · ~{Math.ceil(form.body.split(/\s+/).filter(Boolean).length / 200)} min read
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-4 space-y-6">
          {/* Classification */}
          <Card className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-5">
            <h4 className="text-[10px] font-black uppercase text-[#00FF88] tracking-widest">Classification</h4>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500">Category</label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger className="h-10 bg-white/5 border-white/10 text-white rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f0f0f] border-white/10 text-white text-xs">
                  {['JEE Tips', 'NEET Prep', 'College Admissions', 'Scholarship Guides',
                    'Student Stories', 'Mentor Spotlights', 'News & Updates',
                    'Study Abroad', 'Career Advice', 'MHT-CET', 'MBA Prep'
                  ].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500">Tags</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="h-9 bg-white/5 border-white/10 text-white rounded-lg text-xs flex-1 focus:border-[#00FF88]"
                />
                <Button onClick={addTag} className="h-9 rounded-lg bg-white/10 text-white font-black text-xs px-3 hover:bg-white/20">
                  <Tag className="h-3.5 w-3.5" />
                </Button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.tags.map(tag => (
                    <Badge
                      key={tag}
                      onClick={() => removeTag(tag)}
                      className="bg-white/10 text-slate-300 border-none text-[9px] font-bold cursor-pointer hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    >
                      {tag} ✕
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Author */}
          <Card className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-4">
            <h4 className="text-[10px] font-black uppercase text-[#00FF88] tracking-widest">Author Identity</h4>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500">Author Name</label>
              <Input
                placeholder="e.g. Priya Sharma"
                value={form.author_name}
                onChange={e => setForm({ ...form, author_name: e.target.value })}
                className="h-10 bg-white/5 border-white/10 text-white rounded-xl text-xs focus:border-[#00FF88]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500">Author Role</label>
              <Input
                placeholder="e.g. JEE Expert & Senior Counsellor"
                value={form.author_role}
                onChange={e => setForm({ ...form, author_role: e.target.value })}
                className="h-10 bg-white/5 border-white/10 text-white rounded-xl text-xs focus:border-[#00FF88]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500">Cover Image URL</label>
              <Input
                placeholder="https://..."
                value={form.cover_image_url}
                onChange={e => setForm({ ...form, cover_image_url: e.target.value })}
                className="h-10 bg-white/5 border-white/10 text-white rounded-xl text-xs focus:border-[#00FF88]"
              />
            </div>
          </Card>

          {/* SEO */}
          <Card className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-4">
            <h4 className="text-[10px] font-black uppercase text-[#00FF88] tracking-widest">SEO Keys</h4>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500">Focus Keyword</label>
              <Input
                placeholder="mht-cet counselling guide"
                value={form.focus_keyword}
                onChange={e => setForm({ ...form, focus_keyword: e.target.value })}
                className="h-10 bg-white/5 border-white/10 text-white rounded-xl text-xs focus:border-[#00FF88]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500">Meta Description</label>
              <Textarea
                placeholder="Short summary for Google..."
                value={form.meta_description}
                onChange={e => setForm({ ...form, meta_description: e.target.value })}
                className="min-h-[80px] bg-white/5 border-white/10 text-white rounded-xl text-xs focus:border-[#00FF88]"
              />
            </div>

            {/* Toggles */}
            {[
              { label: 'Featured Post?', field: 'is_featured' as const, desc: 'Show on homepage blog section' },
              { label: 'Newsletter Push?', field: 'newsletter_push' as const, desc: 'Email to all subscribers' },
            ].map(toggle => (
              <div key={toggle.field} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="text-xs font-bold text-white">{toggle.label}</p>
                  <p className="text-[9px] text-slate-500">{toggle.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={form[toggle.field]}
                  onChange={e => setForm({ ...form, [toggle.field]: e.target.checked })}
                  className="h-4.5 w-4.5 rounded bg-white/5 border-white/20 text-[#00FF88] focus:ring-[#00FF88]"
                />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
