"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  User, 
  Star, 
  Award, 
  MessageSquare, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  ArrowLeft,
  Sparkles,
  Zap,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"

export default function MentorBookingPage() {
  const params = useParams()
  const mentorId = params.id as string
  const router = useRouter()
  
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedSlot, setSelectedSlot] = useState<string>("")
  const [mentor, setMentor] = useState<any>(undefined)
  const [services, setServices] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [selectedService, setSelectedService] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMentorData() {
      // 1. Fetch Mentor by ID or Slug
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(mentorId)
      
      const { data: mentorData, error: mentorError } = await supabase
        .from("profiles")
        .select("*")
        .or(`id.eq.${isUuid ? mentorId : '00000000-0000-0000-0000-000000000000'},slug.eq.${mentorId}`)
        .single()

      if (mentorError || !mentorData) {
        setMentor(null)
        return
      }

      setMentor(mentorData)

      // 2. Fetch Services
      const { data: servicesData } = await supabase
        .from("mentor_services")
        .select("*")
        .eq("mentor_id", mentorData.id)
        .eq("is_active", true)
      
      setServices(servicesData || [])
      if (servicesData?.length) setSelectedService(servicesData[0])

      // 3. Fetch Reviews
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .eq("mentor_id", mentorData.id)
        .eq("is_published", true)
        .order('created_at', { ascending: false })
      
      setReviews(reviewsData || [])
    }

    fetchMentorData()
  }, [mentorId]);
  
  const handleBooking = () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot")
      return
    }
    toast.success("Redirecting to payment...")
    // Simulate booking flow
    setTimeout(() => router.push("/dashboard"), 1500)
  }

  if (mentor === null) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-8 text-center">
      <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <ShieldCheck className="h-12 w-12 text-red-500" />
      </div>
      <h2 className="text-3xl font-black mb-4 tracking-tighter">Mentor Not Found</h2>
      <p className="text-slate-500 max-w-sm mb-8 font-medium">We couldn't find the expert you're looking for. They may have moved or changed their profile.</p>
      <Link href="/mentorship">
        <Button className="rounded-2xl h-14 px-10 font-black shadow-xl">Browse All Mentors</Button>
      </Link>
    </div>
  )

  const slots = ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-12">
          <Link href="/mentorship">
            <Button variant="ghost" className="mb-8 rounded-xl font-bold text-slate-500 hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Mentorship
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-grow space-y-8">
              <div className="flex items-center gap-8">
                <div className="h-32 w-32 rounded-[3rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative shadow-2xl overflow-hidden">
                   {mentor.image ? <Image src={mentor.image} alt={mentor.name} fill className="object-cover" /> : <User className="h-16 w-16 text-slate-300" />}
                   <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 flex items-center justify-center text-white">
                     <ShieldCheck className="h-6 w-6" />
                   </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-black tracking-tight">{mentor.name}</h1>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-black uppercase tracking-wider border border-orange-500/10">
                      <Star className="h-3 w-3 fill-current" /> {mentor.rating || "4.9"}
                    </div>
                  </div>
                  <p className="text-primary font-bold text-xl mb-4">{mentor.expertise || mentor.branch}</p>
                  <div className="flex flex-wrap gap-4 text-slate-500 font-medium text-sm">
                    {mentor.college && <span className="flex items-center gap-2"><Award className="h-4 w-4" /> {mentor.college}</span>}
                    <span className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> {reviews.length} Reviews</span>
                    <span className="flex items-center gap-2"><Zap className="h-4 w-4" /> Top Verified Expert</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none rounded-[3rem] shadow-sm bg-white dark:bg-slate-900 p-10">
                  <h2 className="text-2xl font-black mb-6">About the Mentor</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
                    {mentor.bio || mentor.about || "No biography provided."}
                  </p>
                  {mentor.skills && mentor.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-8">
                       {mentor.skills.map((tag: string) => (
                         <Badge key={tag} className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 border-none font-bold">
                           {tag}
                         </Badge>
                       ))}
                    </div>
                  )}
                </Card>

                <div className="space-y-6">
                   <h2 className="text-2xl font-black">Offerings & Services</h2>
                   <div className="space-y-4">
                      {services.length === 0 ? (
                        <Card className="p-8 rounded-[2.5rem] bg-slate-50 border-none text-center">
                           <p className="font-bold text-slate-400">Standard Consultation Session</p>
                           <p className="text-xs font-medium text-slate-400">Default 45-min career guidance call</p>
                        </Card>
                      ) : (
                        services.map(service => (
                          <Card 
                            key={service.id} 
                            onClick={() => setSelectedService(service)}
                            className={`p-6 rounded-[2.5rem] cursor-pointer transition-all border-2 ${selectedService?.id === service.id ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-slate-100 hover:border-primary/50'}`}
                          >
                             <div className="flex justify-between items-center">
                                <div>
                                   <h4 className="font-black text-lg">{service.title}</h4>
                                   <p className="text-sm font-bold text-slate-500">{service.duration_minutes} Minutes · One-on-One</p>
                                </div>
                                <div className="text-right">
                                   <p className="text-2xl font-black text-primary">₹{service.price}</p>
                                </div>
                             </div>
                          </Card>
                        ))
                      )}
                   </div>
                </div>
              </div>

              {/* Reviews Section */}
              <section className="space-y-8 mt-12">
                 <div className="flex justify-between items-end">
                    <h2 className="text-3xl font-black">Student Reviews</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{reviews.length} Verified Reviews</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.length === 0 ? (
                      <Card className="col-span-full p-16 text-center rounded-[3.5rem] bg-slate-50 border-2 border-dashed border-slate-200">
                         <Star className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                         <p className="text-slate-400 font-bold">No reviews yet. Be the first to take a session!</p>
                      </Card>
                    ) : (
                      reviews.map(review => (
                        <Card key={review.id} className="p-8 rounded-[2.5rem] bg-white border-none shadow-sm relative">
                           <div className="flex gap-1 mb-4">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                              ))}
                           </div>
                           <p className="text-slate-600 font-medium mb-6 leading-relaxed italic">"{review.comment}"</p>
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs">
                                 {review.reviewer_name?.charAt(0)}
                              </div>
                              <div>
                                 <p className="text-xs font-black uppercase tracking-wider">{review.reviewer_name}</p>
                                 <p className="text-[10px] font-bold text-slate-400">{new Date(review.created_at).toLocaleDateString()}</p>
                              </div>
                           </div>
                        </Card>
                      ))
                    )}
                 </div>
              </section>
            </div>

            <aside className="w-full lg:w-[400px] shrink-0">
               <Card className="border-none rounded-[3rem] shadow-2xl bg-white dark:bg-slate-900 overflow-hidden sticky top-32">
                 <div className="bg-primary p-8 text-white">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Selected Service</p>
                   <h3 className="text-xl font-black mb-4 truncate">{selectedService?.title || "Consultation Call"}</h3>
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black">₹{selectedService?.price || mentor.pricing || "999"}</span>
                     <span className="text-sm font-bold opacity-70">/ session</span>
                   </div>
                 </div>
                 <div className="p-8 space-y-8">
                   <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Select a Slot</label>
                     <div className="grid grid-cols-2 gap-3">
                       {slots.map(slot => (
                         <button
                           key={slot}
                           onClick={() => setSelectedSlot(slot)}
                           className={`p-3 rounded-xl border-2 font-bold text-sm transition-all ${
                             selectedSlot === slot 
                               ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" 
                               : "border-slate-100 dark:border-slate-800 hover:border-primary/50 text-slate-600 dark:text-slate-400"
                           }`}
                         >
                           {slot}
                         </button>
                       ))}
                     </div>
                   </div>

                   <Button 
                     onClick={handleBooking}
                     className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 font-black text-xl shadow-xl shadow-primary/20"
                   >
                     Continue to Pay
                   </Button>

                   <div className="flex items-center gap-4 text-xs text-slate-400 font-bold justify-center">
                     <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Secure Payment</span>
                     <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Instant Confirm</span>
                   </div>
                 </div>
               </Card>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
