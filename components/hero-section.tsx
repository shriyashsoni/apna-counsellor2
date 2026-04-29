"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, CheckCircle, School, Users, Sparkles, GraduationCap, Shield } from "lucide-react"
import { motion } from "framer-motion"

import { useAuth } from "@/hooks/use-auth"

const HeroSection = () => {
  const { isAuthenticated } = useAuth()
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
    <section className="py-12 md:py-20">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <motion.div initial="hidden" animate="show" variants={container}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4 md:mb-6">
            <Sparkles className="h-3 w-3" />
            Empowering 50,000+ Students
          </div>
          <motion.h1 variants={item} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 tracking-tighter leading-tight">
            India&apos;s Most Trusted <br/><span className="text-primary text-glow">Admission Portals</span>
          </motion.h1>
          <motion.p variants={item} className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-6 md:mb-8 leading-relaxed max-w-xl">
            Navigate the complex world of college admissions with India&apos;s most advanced 
            AI-powered guidance system. We bridge the gap between your rank and your dream institute.
          </motion.p>
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link href={isAuthenticated ? "/dashboard" : "/book-call"} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-xl md:rounded-2xl px-6 h-12 md:h-14 font-black text-sm md:text-base shadow-lg shadow-primary/20">
                {isAuthenticated ? "Go to Dashboard" : "Book a Counselling Call"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="https://whatsapp.com/channel/0029VabjCVD5PO11jeEupQ44"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-xl md:rounded-2xl px-6 h-12 md:h-14 font-black text-sm md:text-base border-slate-200 dark:border-slate-800">
                Join Community
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[300px] sm:h-[400px] lg:h-[550px] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-xl border-2 md:border-4 border-white dark:border-slate-900 mt-6 lg:mt-0"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/India%27s%20Trusted%20Counselling%20Platform%20for%20Admissions.jpg-awq59bTnBuIHnoBkXVTum5zn14OhAI.jpeg"
            alt="Counselling Illustration"
            fill
            className="object-contain p-2 md:p-4"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-2xl border-t border-white/20 p-3 md:p-5">
            <div className="grid grid-cols-3 gap-2 text-white">
              <div className="text-center">
                <p className="text-lg md:text-2xl font-black">50k+</p>
                <p className="text-[7px] md:text-[9px] uppercase font-bold tracking-widest opacity-80">Students</p>
              </div>
              <div className="text-center">
                <p className="text-lg md:text-2xl font-black">200+</p>
                <p className="text-[7px] md:text-[9px] uppercase font-bold tracking-widest opacity-80">Portals</p>
              </div>
              <div className="text-center">
                <p className="text-lg md:text-2xl font-black">1.2k+</p>
                <p className="text-[7px] md:text-[9px] uppercase font-bold tracking-widest opacity-80">Successes</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12 md:mt-16">
        {[
          {
            icon: <GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-primary" />,
            title: "Expert Mentorship",
            description: "1-on-1 strategy sessions with India's top admission experts.",
          },
          {
            icon: <Shield className="h-6 w-6 md:h-8 md:w-8 text-primary" />,
            title: "Verified Portals",
            description: "Access 200+ portals with official 2026 cutoff data.",
          },
          {
            icon: <Users className="h-6 w-6 md:h-8 md:w-8 text-primary" />,
            title: "Elite Community",
            description: "Join 50,000+ students in our exclusive Alpha Hub channel.",
          },
          {
            icon: <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-primary" />,
            title: "AI Optimized",
            description: "Data-driven college predictions with 99.9% accuracy.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            className="p-4 md:p-6 rounded-[1rem] md:rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group"
          >
            <div className="bg-slate-50 dark:bg-slate-800 h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              {feature.icon}
            </div>
            <h3 className="text-sm md:text-base font-black mb-1.5">{feature.title}</h3>
            <p className="text-[10px] md:text-xs text-slate-500 leading-tight">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default HeroSection
