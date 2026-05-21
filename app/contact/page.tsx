"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import {
  ArrowRight, Facebook, Instagram, Mail, MapPin, Phone,
  Youtube, MessageCircle, CheckCircle2, Loader2, Send, Clock, Star
} from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Apna Counsellor – 24/7 Priority Support",
  description: "Have questions about your rank, college choices, or courses? Contact Apna Counsellor for expert admission guidance.",
  openGraph: {
    title: "Contact Apna Counsellor – 24/7 Priority Support",
    description: "Have questions about your rank, college choices, or courses? Contact Apna Counsellor for expert admission guidance.",
    url: "https://www.apnacounsellor.in/contact",
    siteName: "Apna Counsellor",
    images: [
      {
        url: "https://www.apnacounsellor.in/images/counseling-preview-v3.png",
        width: 1200,
        height: 630,
        alt: "Contact Apna Counsellor",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Apna Counsellor – 24/7 Priority Support",
    description: "Contact Apna Counsellor for expert admission guidance.",
    images: ["https://www.apnacounsellor.in/images/counseling-preview-v3.png"],
  }
}

const contactInfoItems = [
  {
    icon: <Phone className="h-5 w-5" />,
    label: "Call Us",
    value: "+91 9109881906",
    href: "tel:+919109881906",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: <Mail className="h-5 w-5" />,
    label: "Email Us",
    value: "apnacounsellor@gmail.com",
    href: "mailto:apnacounsellor@gmail.com",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    label: "Location",
    value: "Mumbai, Maharashtra, India",
    href: "#",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    label: "Response Time",
    value: "Within 24 hours",
    href: "#",
    color: "bg-amber-50 text-amber-600",
  },
]

const socialLinks = [
  {
    icon: <MessageCircle className="h-5 w-5" />,
    label: "WhatsApp",
    handle: "Chat with us",
    href: "https://wa.link/cld3hu",
    color: "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white",
  },
  {
    icon: <Youtube className="h-5 w-5" />,
    label: "YouTube",
    handle: "@ApnaCounsellor",
    href: "https://www.youtube.com/@ApnaCounsellor",
    color: "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white",
  },
  {
    icon: <Instagram className="h-5 w-5" />,
    label: "Instagram",
    handle: "@counsellorapna",
    href: "https://www.instagram.com/counsellorapna/",
    color: "bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white",
  },
  {
    icon: <Facebook className="h-5 w-5" />,
    label: "Facebook",
    handle: "Apna Counsellor",
    href: "https://www.facebook.com/profile.php?id=61560390726245",
    color: "bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white",
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", subject: "", message: "", queryType: "general"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill all required fields")
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setIsSubmitted(true)
      toast.success("Message sent successfully! We'll get back to you soon.")
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(147,51,234,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(79,70,229,0.2),transparent_60%)]" />
        <div className="relative container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-widest mb-8">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            24/7 Priority Support
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            We&apos;re Here to Help <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Every Step of the Way
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have questions about your rank, college choices, or courses? Our certified counselling team is ready to help you make the best decision for your future.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* LEFT: Contact Info + Social */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info Cards */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900">Contact Information</h2>
              <div className="space-y-3">
                {contactInfoItems.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Action */}
            <a href="https://wa.link/cld3hu" target="_blank" rel="noreferrer">
              <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-3xl p-6 text-white flex items-center gap-4 shadow-lg shadow-[#25D366]/20 hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-black text-lg">WhatsApp Us Now</p>
                  <p className="text-white/80 text-sm font-medium">Get instant reply from our team</p>
                </div>
                <ArrowRight className="h-5 w-5 ml-auto shrink-0" />
              </div>
            </a>

            {/* Social Links */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-4">Follow Us</h2>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-2xl border border-slate-100 transition-all font-bold text-sm ${s.color}`}
                  >
                    {s.icon}
                    <div>
                      <p className="text-xs font-black">{s.label}</p>
                      <p className="text-[10px] opacity-80">{s.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Community CTA */}
            <div className="bg-purple-50 border border-purple-100 rounded-3xl p-6">
              <h3 className="font-black text-purple-900 mb-2">Join Our Community</h3>
              <p className="text-sm text-purple-700 mb-4 font-medium">Stay updated with cutoffs, live sessions, and expert tips.</p>
              <Link href="https://chat.whatsapp.com/LlfJI9MPk3834p4sUvRwaa" target="_blank">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl h-11">
                  Join WhatsApp Group <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-8 text-white">
                <h2 className="text-2xl font-black mb-1">Send Us a Message</h2>
                <p className="text-purple-200 font-medium text-sm">We reply within 24 hours on working days</p>
              </div>

              <div className="p-8">
                {isSubmitted ? (
                  <div className="py-16 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">Message Sent! ✉️</h3>
                    <p className="text-slate-600 font-medium mb-6 max-w-sm mx-auto">
                      Your query has been sent successfully. Check your email for a confirmation, and we'll reply within 24 hours.
                    </p>
                    <Button
                      onClick={() => { setIsSubmitted(false); setFormData({ name: "", email: "", phone: "", subject: "", message: "", queryType: "general" }) }}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl px-6 h-12"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-500">Full Name *</label>
                        <Input
                          placeholder="e.g. Rahul Sharma"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="h-12 rounded-2xl border-slate-200 font-semibold focus:border-purple-400 focus:ring-purple-400"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-500">Email Address *</label>
                        <Input
                          type="email"
                          placeholder="rahul@example.com"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="h-12 rounded-2xl border-slate-200 font-semibold focus:border-purple-400 focus:ring-purple-400"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-500">Phone Number</label>
                        <Input
                          type="tel"
                          placeholder="+91 9876543210"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="h-12 rounded-2xl border-slate-200 font-semibold focus:border-purple-400 focus:ring-purple-400"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-500">Query Type *</label>
                        <Select value={formData.queryType} onValueChange={v => setFormData({ ...formData, queryType: v })}>
                          <SelectTrigger className="h-12 rounded-2xl border-slate-200 font-semibold focus:ring-purple-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Question</SelectItem>
                            <SelectItem value="counselling">Counselling / Admission</SelectItem>
                            <SelectItem value="course">Course Related</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500">Subject *</label>
                      <Input
                        placeholder="What's your question about?"
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        className="h-12 rounded-2xl border-slate-200 font-semibold focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500">Message *</label>
                      <Textarea
                        placeholder="Describe your query in detail. The more info you provide, the better we can help you..."
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        className="min-h-[140px] rounded-2xl border-slate-200 font-semibold focus:border-purple-400 focus:ring-purple-400 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-black text-lg rounded-2xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="h-5 w-5 animate-spin" /> Sending Message...</>
                      ) : (
                        <><Send className="h-5 w-5" /> Send Message</>
                      )}
                    </Button>

                    <p className="text-center text-xs text-slate-400 font-medium">
                      By submitting, you agree to our{" "}
                      <Link href="/privacy-policy" className="text-purple-600 hover:underline">Privacy Policy</Link>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
