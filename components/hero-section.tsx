"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, CheckCircle, School, Users, Sparkles, GraduationCap, Shield } from "lucide-react"
import { motion } from "framer-motion"

const HeroSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" animate="show" variants={container}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles className="h-4 w-4" />
            Empowering 50,000+ Students
          </div>
          <motion.h1 variants={item} className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            India&apos;s Most Trusted <br/><span className="text-primary text-glow">Admission Portals</span>
          </motion.h1>
          <motion.p variants={item} className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-xl">
            Navigate the complex world of college admissions with India&apos;s most advanced 
            AI-powered guidance system. We bridge the gap between your rank and your dream institute.
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap gap-4">
            <Link href="/book-call">
              <Button size="lg" className="rounded-2xl px-8 h-16 font-black text-lg shadow-xl shadow-primary/20">
                Book a Counselling Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link
              href="https://whatsapp.com/channel/0029VabjCVD5PO11jeEupQ44"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="rounded-2xl px-8 h-16 font-black text-lg border-slate-200 dark:border-slate-800">
                Join Community
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[500px] lg:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-900"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/India%27s%20Trusted%20Counselling%20Platform%20for%20Admissions.jpg-awq59bTnBuIHnoBkXVTum5zn14OhAI.jpeg"
            alt="Counselling Illustration"
            fill
            className="object-contain p-8"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-2xl border-t border-white/20 p-8">
            <div className="grid grid-cols-3 gap-4 text-white">
              <div className="text-center">
                <p className="text-3xl font-black">50k+</p>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Students</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black">200+</p>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Portals</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black">1.2k+</p>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Successes</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-24">
        {[
          {
            icon: <GraduationCap className="h-10 w-10 mb-4 text-primary" />,
            title: "Expert Mentorship",
            description: "1-on-1 strategy sessions with India's top admission experts.",
          },
          {
            icon: <Shield className="h-10 w-10 mb-4 text-primary" />,
            title: "Verified Portals",
            description: "Access 200+ portals with official 2026 cutoff data.",
          },
          {
            icon: <Users className="h-10 w-10 mb-4 text-primary" />,
            title: "Elite Community",
            description: "Join 50,000+ students in our exclusive Alpha Hub channel.",
          },
          {
            icon: <Sparkles className="h-10 w-10 mb-4 text-primary" />,
            title: "AI Optimized",
            description: "Data-driven college predictions with 99.9% accuracy.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -10 }}
            className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all group"
          >
            <div className="bg-slate-50 dark:bg-slate-800 h-16 w-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
              {feature.icon}
            </div>
            <h3 className="text-xl font-black mb-3">{feature.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default HeroSection
