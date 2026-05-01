"use client"

import { motion } from "framer-motion"
import { BookOpen, FileText, Video, Trophy, Users, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const ResourceDirectory = () => {
  const resourceGroups = [
    {
      title: "Admission Guides",
      items: [
        "JoSAA Step-by-Step",
        "CSAB Special Rounds",
        "MHT-CET Strategy",
        "UPTAC Documentation",
        "HSTES Choice Filling",
        "REAP Rajasthan Guide",
        "JAC Delhi Checklist",
        "IPU Indraprastha Guide"
      ]
    },
    {
      title: "Cutoff Archives",
      items: [
        "NITs 2024 Cutoffs",
        "IITs 2024 Cutoffs",
        "IIITs 2024 Cutoffs",
        "GFTIs 2024 Cutoffs",
        "Top Private Colleges",
        "State Govt Colleges",
        "BITSAT Last 5 Years",
        "VITEEE Trend Analysis"
      ]
    },
    {
      title: "Expert Notes",
      items: [
        "Choice Filling Strategy",
        "Branch vs College",
        "Placement Stats 2024",
        "Fee Waiver (TFW)",
        "Scholarship Guides",
        "Student Loans Info",
        "Hostel Life Insights",
        "Branch Change Rules"
      ]
    },
    {
      title: "Counseling Portals",
      items: [
        "JoSAA / CSAB Hub",
        "NEET UG / MCC Hub",
        "WBJEE Portal",
        "COMEDK / KCET",
        "MP DTE Counseling",
        "TS EAMCET / AP",
        "TNEA Tamil Nadu",
        "KEAM Kerala Hub"
      ]
    }
  ]

  return (
    <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
              <Sparkles className="h-4 w-4" /> 100% Free Resources
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Free Admission <span className="text-primary text-outline">Resources.</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              Unlock a massive library of verified counseling data, choice filling lists, and expert strategy guides.
            </p>
          </div>
          <Link href="/resources">
            <Button variant="outline" className="rounded-2xl h-14 px-8 font-black border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 group">
              Explore Library <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
          {resourceGroups.map((group, idx) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-white/5 pb-4">
                {group.title}
              </h4>
              <ul className="space-y-4">
                {group.items.map((item) => (
                  <li key={item}>
                    <Link 
                      href="/resources" 
                      className="text-[13px] font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center group"
                    >
                      <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 mr-3 group-hover:bg-primary transition-colors" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Informational Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-24">
           <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 group hover:border-primary/50 transition-colors">
              <Trophy className="h-10 w-10 text-primary mb-6" />
              <h3 className="text-2xl font-black mb-4">Placement Statistics</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                 Access detailed placement reports for top 100 NITs, IIITs, and private universities. Analyze average packages and median salaries.
              </p>
              <Link href="/resources" className="text-primary font-black uppercase text-xs tracking-widest flex items-center gap-2">
                 View Reports <ArrowRight className="h-4 w-4" />
              </Link>
           </div>
           <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 group hover:border-primary/50 transition-colors">
              <Users className="h-10 w-10 text-primary mb-6" />
              <h3 className="text-2xl font-black mb-4">Community Support</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                 Join our WhatsApp and Telegram groups with 50k+ students. Get real-time answers to your counseling doubts from verified mentors.
              </p>
              <Link href="https://wa.link/cld3hu" className="text-primary font-black uppercase text-xs tracking-widest flex items-center gap-2">
                 Join Now <ArrowRight className="h-4 w-4" />
              </Link>
           </div>
        </div>
      </div>
    </section>
  )
}

export { ResourceDirectory }
