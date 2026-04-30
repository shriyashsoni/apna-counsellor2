"use client"

import { motion } from "framer-motion"
import { Sparkles, Heart, Rocket, Target, Users, Landmark } from "lucide-react"

export default function OurStoryPage() {
  const milestones = [
    { year: "2020", title: "The Vision", desc: "Started as a small community helping students with JoSAA choices." },
    { year: "2022", title: "AI Integration", desc: "Launched our first basic college predictor using machine learning." },
    { year: "2024", title: "Global Expansion", desc: "Opened counseling for 12+ countries including UK and Germany." },
    { year: "2026", title: "Apna Ecosystem", desc: "India's first fully integrated AI admission control center." }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Heart className="h-3 w-3" /> Built with Passion
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Our <span className="text-primary">Journey.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            From a simple idea to India's most trusted admission ecosystem. Discover the heart behind Apna Counsellor.
          </p>
        </div>

        <div className="space-y-12">
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-8 items-start"
            >
              <div className="text-3xl font-black text-primary opacity-20 w-24 flex-shrink-0 mt-1">{m.year}</div>
              <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex-1">
                <h3 className="text-xl font-black mb-2">{m.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 p-12 rounded-[3rem] bg-slate-900 text-white text-center"
        >
          <Rocket className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-black mb-4">The Future is Here</h2>
          <p className="text-slate-400 font-medium leading-relaxed">
            We are just getting started. Our mission is to ensure every student finds their perfect academic home, powered by data and guided by experts.
          </p>
        </motion.div>

      </div>
    </div>
  )
}
