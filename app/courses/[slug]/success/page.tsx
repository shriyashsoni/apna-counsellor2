"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, MessageCircle, ExternalLink, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import confetti from "canvas-confetti"

export default function CourseSuccessPage() {
  const params = useParams()
  const slug = params.slug as string
  const supabase = createClient()
  
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from('courses').select('*').eq('slug', slug).single()
      setCourse(data)
      setLoading(false)

      // Send welcome email via Resend
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email && data) {
          await fetch('/api/send-enrollment-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentName: user.user_metadata?.name || user.email.split('@')[0],
              studentEmail: user.email,
              courseTitle: data.title,
              startDate: data.start_date ? new Date(data.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : undefined,
              whatsappUrl: data.whatsapp_group_url || undefined,
              googleFormUrl: data.google_form_url || undefined,
            })
          })
        }
      } catch (e) { /* silent fail */ }
      
      // Fire confetti on load!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#9333ea', '#10b981', '#f59e0b']
      })
    }
    loadData()
  }, [slug])

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Successfully Enrolled!</h1>
        <p className="text-lg text-slate-600 mb-8 font-medium">
          Welcome to <span className="font-bold text-slate-900">{course?.title}</span>. Your payment was successful and your learning journey starts now.
        </p>

        <Card className="bg-white rounded-3xl border-slate-200 shadow-xl overflow-hidden mb-8">
          <CardContent className="p-8 space-y-6">
            {course?.whatsapp_group_url ? (
              <div className="bg-[#25D366]/10 p-6 rounded-2xl border border-[#25D366]/20">
                <h3 className="text-xl font-black text-slate-900 mb-2">Step 1: Join Official WhatsApp Group</h3>
                <p className="text-slate-600 mb-6 text-sm font-semibold">Get all live updates, zoom links, and interact with mentors directly inside the private community.</p>
                <a href={course.whatsapp_group_url} target="_blank" rel="noreferrer">
                  <Button className="w-full h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-lg rounded-2xl flex items-center gap-2 shadow-lg shadow-[#25D366]/30">
                    <MessageCircle className="w-6 h-6" /> Join WhatsApp Group
                  </Button>
                </a>
              </div>
            ) : (
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                <h3 className="text-xl font-black text-slate-900 mb-2">Next Steps</h3>
                <p className="text-slate-600 text-sm font-semibold">Please head over to your dashboard to access all resources, live lecture schedules, and videos.</p>
              </div>
            )}

            {course?.google_form_url && (
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mt-4">
                <h3 className="text-xl font-black text-slate-900 mb-2">Step 2: Complete Your Profile Form</h3>
                <p className="text-slate-600 mb-6 text-sm font-semibold">Please fill out this required form so we can tailor your experience and assign your counselor.</p>
                <a href={course.google_form_url} target="_blank" rel="noreferrer">
                  <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-600/30">
                    <ExternalLink className="w-6 h-6" /> Fill Profile Data Form
                  </Button>
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Link href="/dashboard">
          <Button className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg rounded-2xl flex items-center gap-2 mx-auto transition-transform hover:scale-105">
            Go to My Dashboard <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
