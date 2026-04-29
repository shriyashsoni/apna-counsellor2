"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowRight, ExternalLink, Bell, Search, Sparkles, Globe, GraduationCap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { CounsellingInfo } from "@/lib/counselling"

interface Props {
  platforms: CounsellingInfo[]
}

export default function CounsellingClientPage({ platforms }: Props) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPlatforms = (platforms || []).filter(p => 
    p?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    p?.id?.toLowerCase()?.includes(searchTerm.toLowerCase())
  )

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(15,23,42,1),rgba(15,23,42,0.5))]" />
        <div className="container relative mx-auto px-4 py-16 sm:py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>AI-Optimized Counselling for 2026</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              Explore 200+ <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Counselling Platforms</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
              From National engineering and medical entries to International global admissions. 
              Our AI-driven database provides real-time updates, cutoffs, and personalized strategies for every student.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Search by exam name (JEE, NEET, JoSAA, UCAS...)" 
                className="pl-12 h-14 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Available Platforms</h2>
            <p className="text-slate-500">Showing {filteredPlatforms.length} counselling databases ready for 2026</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-700">
              <Globe className="mr-2 h-4 w-4" />
              International
            </Button>
            <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-700">
              <GraduationCap className="mr-2 h-4 w-4" />
              National
            </Button>
          </div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredPlatforms.map((platform) => (
              <motion.div
                layout
                key={platform.id}
                variants={item}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="h-full flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
                  <CardHeader className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 transition-colors">
                        <GraduationCap className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Status</span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          platform.status === 'Ready for Extraction' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {platform.status || 'Active'}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                      {platform.name}
                    </CardTitle>
                    <CardDescription className="text-slate-500 line-clamp-2 min-h-[3rem]">
                      Complete admissions guidance, college predictors, and round-wise strategies for {platform.name}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 flex-grow">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs font-medium px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {platform?.colleges?.length || 0} Colleges
                      </span>
                      <span className="text-xs font-medium px-2 py-1 rounded-lg bg-primary/5 text-primary">
                        AI-Optimized
                      </span>
                    </div>
                    <div className="space-y-2">
                      {(platform?.colleges || []).slice(0, 3).map((college, idx) => (
                        <div key={idx} className="flex items-center text-xs text-slate-500">
                          <div className="h-1 w-1 rounded-full bg-slate-400 mr-2" />
                          <span className="truncate">{college.name}</span>
                        </div>
                      ))}
                      {platform.colleges.length > 3 && (
                        <p className="text-[11px] text-primary font-medium">+{platform?.colleges?.length - 3} more institutes...</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 mt-auto">
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Link href={`/counselling/${platform.id}`} className="w-full">
                        <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold h-11">
                          View Details
                        </Button>
                      </Link>
                      <Link href={platform.url} target="_blank" className="w-full">
                        <Button variant="outline" className="w-full rounded-xl border-slate-200 dark:border-slate-700 h-11">
                          Official Site
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredPlatforms.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
              <Search className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No platforms found</h3>
            <p className="text-slate-500">Try searching with a different keyword or exam name.</p>
          </div>
        )}

        {/* Mentorship Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-br from-primary via-purple-600 to-indigo-700 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Sparkles className="h-40 w-40" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Premium AI Mentorship Support</h2>
            <p className="text-primary-foreground/90 text-lg mb-8 leading-relaxed">
              Get one-on-one guidance from our expert mentors powered by AI analysis. 
              We've upgraded our mentorship for 2026 with predictive modeling and real-time document verification assistance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/book-call">
                <Button className="bg-white text-primary hover:bg-slate-100 font-bold rounded-2xl h-14 px-8 text-lg">
                  Book VIP Mentorship
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://wa.link/cld3hu">
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold rounded-2xl h-14 px-8 text-lg">
                  WhatsApp Support
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
