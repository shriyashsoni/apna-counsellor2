"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { sendBookingConfirmation, sendAdminNotification } from "@/lib/actions/emails"
import { useRazorpay } from "@/hooks/use-razorpay"

import { 
  Star, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowLeft,
  MessageCircle,
  Video,
  CheckCircle2,
  CalendarCheck2,
  Sparkles,
  Zap,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { toast } from "sonner"

export default function MentorProfileClient({ 
  initialMentor, 
  initialSessions, 
  initialReviews = [],
  initialServices = [],
  currentUser 
}: { 
  initialMentor: any, 
  initialSessions: any[], 
  initialReviews: any[],
  initialServices: any[],
  currentUser: any 
}) {
  const router = useRouter()
  const supabase = createClient()
  const { initiatePayment, isLoading: isBooking } = useRazorpay()

  const handleBook = async (session: any) => {
    if (currentUser === null) {
      toast.error("Please login to book a session")
      router.push("/login")
      return
    }

    const amount = session.price || initialMentor.pricing || 499

    await initiatePayment({
      amount,
      name: "Apna Counsellor",
      description: `Mentorship session with ${initialMentor.name}`,
      prefill: {
        name: currentUser.name,
        email: currentUser.email,
      },
      metadata: {
        user_id: currentUser.id,
        mentor_id: initialMentor.id,
        session_id: session.id,
        type: "mentorship_session",
        date: session.date,
        time: session.time_slot
      },
      onSuccess: async (response) => {
        // Immediate UI feedback, while webhook handles the source of truth
        toast.success("Booking confirmed! Redirecting to dashboard...")
        
        // We still do a quick update here for speed, but webhook is the backup
        await supabase.from('sessions').update({
          student_id: currentUser.id,
          student_name: currentUser.name || "Student",
          status: 'confirmed'
        }).eq('id', session.id)

        router.push("/dashboard")
      }
    })
  }


  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8 font-bold gap-2 text-slate-500">
          <ArrowLeft className="h-4 w-4" /> Back to Experts
        </Button>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="relative p-8 md:p-12 rounded-[3rem] bg-white shadow-xl border border-slate-100 overflow-hidden">
               <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                  <div className="relative h-40 w-40 rounded-[2.5rem] overflow-hidden shadow-2xl ring-8 ring-slate-50 shrink-0">
                    <Image 
                      src={initialMentor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${initialMentor.name}`} 
                      alt={initialMentor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-4 flex-1">
                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">{initialMentor.name}</h1>
                         <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-3 py-1 rounded-full flex gap-1 font-bold">
                            <ShieldCheck className="h-4 w-4" /> Verified Expert
                         </Badge>
                         <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-black text-amber-700">{initialMentor.rating?.toFixed(1) || '5.0'}</span>
                            <span className="text-[10px] font-bold text-amber-600/60">({initialMentor.reviews_count || 0})</span>
                         </div>
                      </div>
                     <p className="text-xl font-bold text-purple-600">{initialMentor.headline || initialMentor.expertise || 'Expert Career Mentor'}</p>
                     <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                        {initialMentor.counseling_type?.map((type: string) => (
                           <Badge key={type} className="bg-primary/10 text-primary border-none font-bold">
                              {type}
                           </Badge>
                        ))}
                     </div>
                     <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-500 font-bold">
                        <div className="flex items-center gap-2">
                           <GraduationCap className="h-5 w-5 text-slate-400" />
                           <span>{initialMentor.college} · {initialMentor.branch}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <MapPin className="h-5 w-5 text-slate-400" />
                           <span>{initialMentor.preferredLocation || 'India'}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            <Tabs defaultValue="about" className="w-full">
                <TabsList className="bg-white border border-slate-100 rounded-2xl h-14 p-1 mb-8 w-full md:w-auto flex">
                   <TabsTrigger value="about" className="flex-1 md:px-8 rounded-xl font-black text-sm">About Mentor</TabsTrigger>
                   <TabsTrigger value="services" className="flex-1 md:px-8 rounded-xl font-black text-sm">Services ({initialServices.length})</TabsTrigger>
                   <TabsTrigger value="reviews" className="flex-1 md:px-8 rounded-xl font-black text-sm">Reviews ({initialReviews.length})</TabsTrigger>
                </TabsList>
               <TabsContent value="about" className="space-y-8">
                   <Card className="border-none rounded-[2.5rem] bg-white p-8 shadow-sm">
                      <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                         <Info className="h-6 w-6 text-purple-600" /> Why book this session?
                      </h3>
                      <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                         {initialMentor.about || initialMentor.bio || "No biography provided."}
                      </p>
                   </Card>
                </TabsContent>
                <TabsContent value="services" className="space-y-6">
                   {initialServices.length === 0 ? (
                      <Card className="border-none rounded-[2.5rem] bg-white p-12 text-center shadow-sm">
                         <Zap className="h-12 w-12 text-slate-100 mx-auto mb-4" />
                         <p className="text-slate-400 font-bold">No custom services listed yet.</p>
                      </Card>
                   ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                         {initialServices.map((service, i) => (
                            <Card key={i} className="border-none rounded-[2rem] bg-white p-8 shadow-sm border border-slate-50 relative overflow-hidden group">
                               <div className="relative z-10 space-y-4">
                                  <div className="flex justify-between items-start">
                                     <h4 className="text-xl font-black text-slate-900">{service.title}</h4>
                                     <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold">₹{service.price}</Badge>
                                  </div>
                                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{service.description}</p>
                                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                     <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {service.duration_minutes} mins
                                     </div>
                                     <div className="flex items-center gap-1">
                                        <Video className="h-3 w-3" /> 1-on-1 Video
                                     </div>
                                  </div>
                                  <Button className="w-full h-12 rounded-xl font-black text-sm bg-slate-900 text-white hover:bg-slate-800">
                                     Book Service
                                  </Button>
                               </div>
                            </Card>
                         ))}
                      </div>
                   )}
                </TabsContent>
                <TabsContent value="reviews" className="space-y-6">
                   {initialReviews.length === 0 ? (
                      <Card className="border-none rounded-[2.5rem] bg-white p-12 text-center shadow-sm">
                         <Star className="h-12 w-12 text-slate-100 mx-auto mb-4" />
                         <p className="text-slate-400 font-bold">No reviews yet. Be the first!</p>
                      </Card>
                   ) : (
                      initialReviews.map((r, i) => (
                         <Card key={i} className="border-none rounded-[2rem] bg-white p-6 shadow-sm border border-slate-50">
                            <div className="flex justify-between items-start mb-4">
                               <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400">
                                     {r.reviewer_name?.charAt(0) || 'S'}
                                  </div>
                                  <div>
                                     <p className="font-bold text-sm">{r.reviewer_name || 'Anonymous Student'}</p>
                                     <p className="text-[10px] text-slate-400 font-medium">{new Date(r.created_at).toLocaleDateString()}</p>
                                  </div>
                               </div>
                               <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map(star => (
                                     <Star key={star} className={`h-3 w-3 ${star <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
                                  ))}
                               </div>
                            </div>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"{r.comment}"</p>
                         </Card>
                      ))
                   )}
                </TabsContent>
            </Tabs>

            <section>
               <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><CalendarCheck2 className="h-7 w-7 text-purple-600" /> Available Time Slots</h3>
               <div className="grid sm:grid-cols-2 gap-6">
                  {initialSessions.length === 0 ? (
                    <div className="col-span-full p-12 text-center rounded-[2.5rem] bg-white border-2 border-dashed border-slate-200">
                       <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                       <h4 className="text-lg font-black text-slate-900">No slots posted yet</h4>
                    </div>
                  ) : (
                    initialSessions.map((session: any) => (
                      <Card key={session.id} className="border-none rounded-[2.5rem] bg-white shadow-lg hover:shadow-purple-500/10 transition-all overflow-hidden border border-slate-100">
                         <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-6">
                               <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-purple-600">
                                     <Calendar className="h-5 w-5" />
                                     <span className="font-black">
                                        {(() => {
                                           try {
                                              return new Date(session.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
                                           } catch (e) {
                                              return String(session.date);
                                           }
                                        })()}
                                     </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                                     <Clock className="h-4 w-4" />
                                     <span>{session.time_slot || 'TBD'} (45 mins)</span>
                                  </div>
                               </div>
                               <Badge className="bg-purple-100 text-purple-600 border-none rounded-lg px-3 py-1 font-black">₹{session.price || initialMentor.pricing || 499}</Badge>
                            </div>
                            <Button onClick={() => handleBook(session)} disabled={isBooking} className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-purple-100 bg-purple-600">
                              {isBooking ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Book This Slot"}
                            </Button>
                         </CardContent>
                      </Card>
                    ))
                  )}
               </div>
            </section>
          </div>

          <div className="space-y-8">
             <Card className="border-none rounded-[3rem] bg-slate-950 text-white p-10 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6 text-center">
                   <p className="text-sm font-black uppercase tracking-widest text-white/70">Expert Consultation</p>
                   <div>
                      <h2 className="text-5xl font-black">₹{initialMentor.pricing || 499}</h2>
                      <p className="text-white/70 font-bold mt-1">per personalized session</p>
                   </div>
                   <Button className="w-full h-16 rounded-2xl font-black text-xl shadow-2xl bg-purple-600 hover:bg-purple-700">
                      Book Slot Now
                   </Button>
                </div>
                <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-purple-600/20 rounded-full blur-3xl" />
             </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
