"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
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

export default function MentorProfilePage() {
  const params = useParams()
  const router = useRouter()
  // Clerk removed to unblock local host
  const mentorId = params.id as any
  
  const mentor = useQuery(api.users.getById, { id: mentorId })
  const sessions = useQuery(api.sessions.listPostedSessions, { mentorId })
  const dbUser = useQuery(api.users.currentUser)
  const bookSession = useMutation(api.sessions.bookSession)

  const [isBooking, setIsBooking] = useState(false)

  if (!mentor) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const handleBook = async (sessionId: any) => {
    if (dbUser === null) {
      toast.error("Please login to book a session")
      return
    }

    if (dbUser === undefined) {
      toast.info("Still verifying your session...")
      return
    }
    
    setIsBooking(true)
    try {
      await bookSession({ sessionId, studentId: dbUser._id })
      toast.success("Session booked successfully!", {
        description: "Check your dashboard for meeting details.",
      })
    } catch (e) {
      toast.error("Booking failed. Please try again.")
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-8 rounded-xl font-bold gap-2 text-slate-500 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Experts
        </Button>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Profile Area (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Hero Header */}
            <section className="relative p-8 md:p-12 rounded-[3rem] bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
               <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                  <div className="relative h-40 w-40 rounded-[2.5rem] overflow-hidden shadow-2xl ring-8 ring-slate-50 dark:ring-slate-800 shrink-0">
                    <Image 
                      src={mentor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`} 
                      alt={mentor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-4 flex-1">
                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{mentor.name}</h1>
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-3 py-1 rounded-full flex gap-1 font-bold">
                           <ShieldCheck className="h-4 w-4" /> Verified Expert
                        </Badge>
                     </div>
                     <p className="text-xl font-bold text-primary">{mentor.headline || 'Expert Career Mentor'}</p>
                     <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-500 font-bold">
                        <div className="flex items-center gap-2">
                           <GraduationCap className="h-5 w-5 text-slate-400" />
                           <span>{mentor.college} · {mentor.branch}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <MapPin className="h-5 w-5 text-slate-400" />
                           <span>{mentor.location || 'India'}</span>
                        </div>
                     </div>
                     <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                        {mentor.skills?.map((s: string) => (
                           <Badge key={s} variant="secondary" className="rounded-xl px-4 py-1.5 font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none">
                              {s}
                           </Badge>
                        ))}
                     </div>
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-primary/5 rounded-full blur-3xl" />
            </section>

            {/* Content Tabs */}
            <Tabs defaultValue="about" className="w-full">
               <TabsList className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl h-14 p-1 shadow-sm mb-8 w-full md:w-auto flex overflow-x-auto">
                  <TabsTrigger value="about" className="flex-1 md:px-8 rounded-xl font-black text-sm data-[state=active]:bg-primary data-[state=active]:text-white">About Mentor</TabsTrigger>
                  <TabsTrigger value="experience" className="flex-1 md:px-8 rounded-xl font-black text-sm data-[state=active]:bg-primary data-[state=active]:text-white">Experience</TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1 md:px-8 rounded-xl font-black text-sm data-[state=active]:bg-primary data-[state=active]:text-white">Reviews</TabsTrigger>
               </TabsList>

               <TabsContent value="about" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                  <Card className="border-none rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm">
                     <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                        <Info className="h-6 w-6 text-primary" /> Why book this session?
                     </h3>
                     <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line">
                        {mentor.bio || "No biography provided."}
                     </p>
                  </Card>
               </TabsContent>

               <TabsContent value="experience" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                   <div className="grid md:grid-cols-2 gap-6">
                      <Card className="border-none rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm">
                         <h4 className="font-black text-primary mb-4">Education</h4>
                         <div className="space-y-4">
                            <div className="flex gap-4">
                               <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                  <GraduationCap className="h-6 w-6 text-slate-400" />
                               </div>
                               <div>
                                  <p className="font-black text-slate-900 dark:text-white">{mentor.college}</p>
                                  <p className="text-sm font-bold text-slate-500">{mentor.branch}</p>
                                  <p className="text-xs font-bold text-slate-400 mt-1">{mentor.year || '2022-2026'}</p>
                               </div>
                            </div>
                         </div>
                      </Card>
                   </div>
               </TabsContent>
            </Tabs>

            {/* Sessions Grid */}
            <section>
               <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                  <CalendarCheck2 className="h-7 w-7 text-primary" />
                  Available Time Slots
               </h3>
               <div className="grid sm:grid-cols-2 gap-6">
                  {sessions === undefined ? (
                    [1,2].map(i => <div key={i} className="h-40 rounded-[2.5rem] bg-slate-200 dark:bg-slate-800 animate-pulse" />)
                  ) : !sessions || sessions.length === 0 ? (
                    <div className="col-span-full p-12 text-center rounded-[2.5rem] bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800">
                       <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                       <h4 className="text-lg font-black text-slate-900 dark:text-white">No slots posted yet</h4>
                       <p className="text-slate-500 font-medium">Click 'Notify Me' to get alerted when slots open up.</p>
                       <Button variant="outline" className="mt-6 rounded-xl font-bold">Notify Me</Button>
                    </div>
                  ) : (
                    sessions.map((session: any) => (
                      <motion.div key={session._id} whileHover={{ y: -5 }}>
                        <Card className="border-none rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-lg hover:shadow-primary/10 transition-all overflow-hidden border border-slate-100 dark:border-slate-800">
                           <CardContent className="p-8">
                              <div className="flex justify-between items-start mb-6">
                                 <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-primary">
                                       <Calendar className="h-5 w-5" />
                                       <span className="font-black">{new Date(session.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                                       <Clock className="h-4 w-4" />
                                       <span>{session.timeSlot} (45 mins)</span>
                                    </div>
                                 </div>
                                 <Badge className="bg-primary/10 text-primary border-none rounded-lg px-3 py-1 font-black">₹{session.price || mentor.pricing || 499}</Badge>
                              </div>
                              <Button 
                                onClick={() => handleBook(session._id)}
                                disabled={isBooking}
                                className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 gap-2"
                              >
                                {isBooking ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Zap className="h-5 w-5 fill-current" />}
                                Book This Slot
                              </Button>
                           </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
               </div>
            </section>

          </div>

          {/* Sidebar (Right 1 col) */}
          <div className="space-y-8">
             
             {/* Pricing Card */}
             <Card className="border-none rounded-[3rem] bg-gradient-to-br from-primary to-indigo-600 text-white p-10 shadow-2xl shadow-primary/30 relative overflow-hidden group">
                <div className="relative z-10 space-y-6 text-center">
                   <p className="text-sm font-black uppercase tracking-widest text-white/70">Expert Consultation</p>
                   <div>
                      <h2 className="text-5xl font-black">₹{mentor.pricing || 499}</h2>
                      <p className="text-white/70 font-bold mt-1">per personalized session</p>
                   </div>
                   <div className="space-y-3 pt-4 text-left">
                      {[
                        '45 Mins 1-on-1 Session',
                        'Personalized Roadmap',
                        'College Shortlisting Help',
                        'Q&A on Placements/Life'
                      ].map(feature => (
                        <div key={feature} className="flex items-center gap-3 font-bold text-sm">
                           <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-3 w-3" />
                           </div>
                           {feature}
                        </div>
                      ))}
                   </div>
                   <Button variant="secondary" className="w-full h-16 rounded-2xl font-black text-xl shadow-2xl">
                      Book Slot Now
                   </Button>
                </div>
                <Sparkles className="absolute -bottom-10 -right-10 h-40 w-40 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
             </Card>

             {/* Rating Overview */}
             <Card className="border-none rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm text-center">
                <div className="flex flex-col items-center gap-2 mb-6">
                   <div className="text-5xl font-black text-amber-500">{mentor.rating || '4.9'}</div>
                   <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 text-amber-500 fill-amber-500" />)}
                   </div>
                   <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{mentor.reviews || 0} Verified Reviews</p>
                </div>
                <div className="space-y-3">
                   {[
                     { label: 'Guidance', score: 98 },
                     { label: 'Knowledge', score: 95 },
                     { label: 'Clarity', score: 92 }
                   ].map(stat => (
                     <div key={stat.label} className="space-y-1">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                           <span className="text-slate-400">{stat.label}</span>
                           <span className="text-slate-900 dark:text-white">{stat.score}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${stat.score}%` }}
                              className="h-full bg-primary rounded-full"
                           />
                        </div>
                     </div>
                   ))}
                </div>
             </Card>

             {/* Contact Card */}
             <Card className="border-none rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Still Have Questions?</h4>
                <Button variant="outline" className="w-full h-14 rounded-2xl font-bold gap-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/5 transition-colors">
                   <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
                </Button>
             </Card>

          </div>

        </div>
      </div>
    </div>
  )
}
