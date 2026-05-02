"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { motion } from "framer-motion"
import { 
  User, 
  Search, 
  Star, 
  ChevronRight, 
  Award, 
  Clock, 
  ShieldCheck,
  MessageSquare,
  Sparkles
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mentors = useQuery(api.users.listMentors, {});

  const filteredMentors = mentors?.filter((m: any) => 
    (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.headline || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.expertise || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
              <Sparkles className="h-3 w-3" /> Expert Guidance
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">Connect with <span className="text-primary">Top Mentors</span></h1>
            <p className="text-slate-500 text-lg font-medium">Get 1-on-1 personalized counselling from students at IITs, NITs, and Top Medical Colleges.</p>
            
            <div className="relative max-w-xl mx-auto group pt-4">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search by name or expertise (e.g. JoSAA, NEET)..." 
                className="pl-14 h-16 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl shadow-xl focus:ring-2 focus:ring-primary/20 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {mentors === undefined ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-[3rem] bg-white dark:bg-slate-900 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMentors?.map((mentor: any) => (
              <motion.div
                key={mentor._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-none rounded-[3rem] shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-8">
                      <div className="h-24 w-24 rounded-[2rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500">
                        <User className="h-12 w-12 text-slate-300" />
                        <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 flex items-center justify-center text-white">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 text-orange-500 font-black">
                          <Star className="h-4 w-4 fill-current" />
                          <span>{mentor.rating || "4.9"}</span>
                        </div>
                        {mentor.sessionsCount && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{mentor.sessionsCount}+ Sessions</span>}
                      </div>
                    </div>

                    <div className="space-y-2 mb-8">
                      <h3 className="text-2xl font-black group-hover:text-primary transition-colors">{mentor.name}</h3>
                      <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        <Award className="h-4 w-4" />
                        {mentor.expertise || mentor.headline || "Expert Counselor"}
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-2 font-medium">
                        {mentor.bio || mentor.about || "Providing expert admission guidance and personalized counseling sessions."}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Link href={`/mentor/${mentor._id}`} className="w-full">
                        <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 font-black text-lg shadow-lg shadow-primary/10">
                          Book a Session
                        </Button>
                      </Link>
                      <Link href={`/mentor/${mentor._id}`} className="w-full">
                        <Button variant="ghost" className="w-full h-12 rounded-xl font-bold text-slate-400 hover:text-primary">
                          View Profile <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
