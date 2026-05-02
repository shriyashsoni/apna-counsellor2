"use client"

import { motion } from "framer-motion"
import { Search, PenTool, BarChart3, GraduationCap, ArrowRight, TrendingUp } from "lucide-react"

const steps = [
  {
    title: "Data Analysis",
    description: "Our AI scans 1,26,000+ college guides and historical cutoff trends for 200+ portals.",
    icon: Search,
  },
  {
    title: "Choice Optimization",
    description: "We generate a personalized list of colleges based on your rank, category, and preferences.",
    icon: BarChart3,
  },
  {
    title: "Expert Strategy",
    description: "Finalize your choice-filling order with 1-on-1 guidance from our lead mentors.",
    icon: PenTool,
  },
  {
    title: "Secure Admission",
    description: "Navigate CAP rounds with real-time alerts and document verification support.",
    icon: GraduationCap,
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6"
          >
            THE PROCESS
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">How We Secure Your <span className="text-primary">Future</span></h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            A data-driven roadmap designed to eliminate uncertainty and maximize your admission chances.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="h-20 w-20 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-all duration-500 backdrop-blur-xl">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute top-0 right-0 text-6xl font-black text-slate-100 dark:text-white/5 pointer-events-none select-none">
                    0{index + 1}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Animated Graph Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 p-8 md:p-16 rounded-[3rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden relative"
        >
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-black mb-6">Real-Time Success Analytics</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Our algorithm processes live seat vacancy data and candidate ranks to give you an unfair advantage in the counselling rounds.
              </p>
              <div className="space-y-6">
                {[
                  { label: "Data Accuracy", value: 99.9 },
                  { label: "Success Rate", value: 96 },
                  { label: "AI Optimization", value: 100 },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
                      <span className="text-slate-900 dark:text-white">{stat.label}</span>
                      <span className="text-primary">{stat.value}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stat.value}%` }}
                        transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-64 md:h-auto flex items-center justify-center">
              {/* Graph Logo / Background Icon */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
                 <TrendingUp className="h-96 w-96 text-primary" />
              </div>

              <div className="grid grid-cols-5 gap-3 items-end h-48 w-full px-4 relative z-10">
                {[40, 70, 45, 90, 65].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: 1 + i * 0.1, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                    className="bg-primary/20 rounded-t-xl border-t-4 border-primary shadow-[0_-10px_20px_-5px_rgba(109,40,217,0.3)]"
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-40 w-40 rounded-full bg-primary/10 blur-3xl" 
                  />
                 <TrendingUp className="h-20 w-20 text-primary relative z-10 filter drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
