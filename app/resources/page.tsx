"use client"

import { motion } from "framer-motion"
import { 
  BookOpen, 
  Download, 
  FileText, 
  Video, 
  ArrowRight,
  Sparkles,
  Trophy,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ResourcesPage() {
  const resources = [
    { title: "JoSAA 2024 Cutoff PDF", category: "Cutoffs", type: "PDF", icon: FileText, color: "blue" },
    { title: "MHT-CET Preference List", category: "Counseling", type: "Sheet", icon: BookOpen, color: "purple" },
    { title: "Top NITs Placement Report", category: "Placements", type: "PDF", icon: Trophy, color: "orange" },
    { title: "How to choose a branch?", category: "Guidance", type: "Video", icon: Video, color: "emerald" },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Sparkles className="h-4 w-4" /> Exclusive Student Resources
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Unlock your <span className="text-primary">Success.</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Download verified cutoffs, preference lists, and placement reports curated by our expert counselors.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {resources.map((res, i) => (
            <motion.div
              key={res.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className={`h-16 w-16 rounded-3xl mb-8 flex items-center justify-center bg-${res.color}-500/10 text-${res.color}-500 group-hover:scale-110 transition-transform`}>
                    <res.icon className="h-8 w-8" />
                  </div>
                  <Badge variant="outline" className="w-fit mb-4 rounded-xl px-3 py-1 font-black text-[10px] tracking-widest bg-slate-50 dark:bg-slate-800 uppercase border-none text-slate-400">
                    {res.category}
                  </Badge>
                  <h3 className="text-xl font-black mb-4 group-hover:text-primary transition-colors leading-tight">
                    {res.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Download className="h-3 w-3" /> {res.type}
                    </span>
                    <Button variant="ghost" size="sm" className="rounded-xl font-black text-xs text-primary gap-1 group-hover:bg-primary/5">
                      Download <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 rounded-[3rem] bg-slate-900 text-white text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Users className="h-40 w-40" />
          </div>
          <h2 className="text-3xl font-black mb-4 relative z-10">Join 10,000+ Students</h2>
          <p className="text-slate-400 font-medium max-w-md mx-auto mb-8 relative z-10">
            Get instant access to all premium resources, predictors, and one-on-one mentorship sessions.
          </p>
          <Button className="rounded-2xl h-14 px-10 font-black shadow-xl shadow-primary/20 relative z-10">
            Get Full Access Now
          </Button>
        </motion.div>

      </div>
    </div>
  )
}
