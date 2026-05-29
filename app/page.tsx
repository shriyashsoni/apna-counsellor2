"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle, MessageCircle, Phone, Calendar, Sparkles, Globe, Shield, GraduationCap, User } from "lucide-react"
import HeroSection from "@/components/hero-section"
import CounsellingPlatforms from "@/components/counselling-platforms"
import TestimonialSection from "@/components/testimonial-section"
import { PartnershipCarousel } from "@/components/partnership-carousel"
import { AIToolsSection } from "@/components/ai-tools-section"
import { HowItWorks } from "@/components/how-it-works"
import { ResourceDirectory } from "@/components/resource-directory"
import { CoursesSection } from "@/components/courses-section"
import { motion } from "framer-motion"
import Script from "next/script"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <HeroSection />

      {/* Partnership Carousel */}
      <PartnershipCarousel />

      {/* Trust Bar */}
      <div className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-6">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60">
          <div className="flex items-center gap-2 font-bold text-slate-400"><Shield className="h-5 w-5" /> Verified Data</div>
          <div className="flex items-center gap-2 font-bold text-slate-400"><Sparkles className="h-5 w-5" /> AI Optimized</div>
          <div className="flex items-center gap-2 font-bold text-slate-400"><Globe className="h-5 w-5" /> Global Access</div>
          <div className="flex items-center gap-2 font-bold text-slate-400"><CheckCircle className="h-5 w-5" /> Expert Verified</div>
        </div>
      </div>

      {/* AI Tools Section */}
      <AIToolsSection />

      {/* Courses Section */}
      <CoursesSection />

      {/* Resource Directory Section */}
      <ResourceDirectory />

      {/* How It Works Section */}
      <HowItWorks />


      {/* About Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles className="h-4 w-4" />
              Empowering 50,000+ Students
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
              India&apos;s #1 AI-Driven <br/><span className="text-primary">Admissions Platform</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Apna Counsellor isn&apos;t just a platform; it&apos;s your AI-powered companion for career success. 
              We track 1,26,000+ institution guides across 200+ national and international admission portals to ensure 
              you never miss your dream college.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                "AI-Driven Predictors",
                "Real-time Cutoff Alerts",
                "1-on-1 Expert Support",
                "Global Admission Hub"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{item}</span>
                </div>
              ))}
            </div>
            <Link href="/about">
              <Button className="rounded-2xl px-8 h-14 font-black text-lg shadow-xl shadow-primary/20">
                Explore Our Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-purple-600 rounded-[3rem] blur-2xl opacity-20" />
            <div className="relative bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Shriyash Soni</h3>
                  <p className="text-primary font-bold">Founder & Lead Mentor</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed italic text-lg">
                &quot;Our mission is to make premium career guidance accessible to every student. 
                With 50,000+ students already guided, we are just getting started.&quot;
              </p>
              <Link href="/founder">
                <Button variant="outline" className="rounded-xl font-bold border-slate-200 dark:border-slate-800">
                  Read Founder&apos;s Mission
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-full max-w-4xl bg-primary/5 blur-3xl rounded-full" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary border-none mb-4">PLATFORMS 2026</Badge>
            <h2 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight">Active Admission Hubs</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Real-time portals and predictors for the most competitive exams in the country.
            </p>
          </div>

          <CounsellingPlatforms />

          <div className="text-center mt-16">
            <Link href="/counselling">
              <Button size="lg" className="rounded-2xl px-10 h-16 font-black text-xl shadow-2xl shadow-primary/20">
                View All 200+ Portals
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Call to Action Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div whileHover={{ y: -10 }}>
            <Card className="bg-gradient-to-br from-primary to-purple-600 text-white border-none h-full rounded-[2.5rem] shadow-2xl overflow-hidden group">
              <CardHeader className="p-10 pb-6">
                <MessageCircle className="h-12 w-12 mb-6 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-3xl font-black">WhatsApp Alpha Hub</CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg mt-4">
                  Join 50,000+ students getting real-time alerts and exclusive resources.
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-10 pt-0 mt-auto">
                <Link
                  href="https://whatsapp.com/channel/0029VabjCVD5PO11jeEupQ44"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full h-14 rounded-2xl bg-white text-primary hover:bg-slate-100 font-black text-lg">
                    Join Channel Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -10 }}>
            <Card className="bg-slate-900 text-white border-none h-full rounded-[2.5rem] shadow-2xl overflow-hidden group">
              <CardHeader className="p-10 pb-6">
                <Phone className="h-12 w-12 mb-6 group-hover:scale-110 transition-transform text-primary" />
                <CardTitle className="text-3xl font-black">VIP Counselling Call</CardTitle>
                <CardDescription className="text-slate-400 text-lg mt-4">
                  Book a direct 1-on-1 strategy session with our top mentors.
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-10 pt-0 mt-auto">
                <Link href="https://wa.link/cld3hu" target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg">
                    Book Call Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </section>

      <TestimonialSection />

      {/* Premium Features Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black mb-16 text-center tracking-tight">AI-Powered Ecosystem</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Sparkles className="h-8 w-8 mb-4 text-primary" />, title: "Predictor Bots" },
              { icon: <Calendar className="h-8 w-8 mb-4 text-primary" />, title: "Smart Alerts" },
              { icon: <Shield className="h-8 w-8 mb-4 text-primary" />, title: "Secure Docs" },
              { icon: <Globe className="h-8 w-8 mb-4 text-primary" />, title: "Global Hub" },
              { icon: <GraduationCap className="h-8 w-8 mb-4 text-primary" />, title: "College List" },
              { icon: <MessageCircle className="h-8 w-8 mb-4 text-primary" />, title: "Live Support" },
              { icon: <BookOpen className="h-8 w-8 mb-4 text-primary" />, title: "PDF Guides" },
              { icon: <Phone className="h-8 w-8 mb-4 text-primary" />, title: "Video Calls" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="text-center p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all h-full flex flex-col items-center justify-center">
                  <div className="mb-2">{feature.icon}</div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">{feature.title}</h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Ecosystem Interactive Hub */}
      <section className="py-16 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <Script src="https://www.itsbeyondregular.com/embed.js" defer strategy="afterInteractive" />
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-2xl">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-[3rem] blur-2xl opacity-50 pointer-events-none" />
            <div className="relative z-10 w-full min-h-[400px]">
              <div data-bn-preset="bopfigr9uj9uvteivlph6t62" className="w-full h-full"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatsSection() {
  // Hardcoded for stability during massive data indexing
  const collegesCount = 30000;
  const counselingsCount = 185;
  const mentorsCount = 45;

  const statItems = [
    { label: "Admissions Guided", value: "50k+" },
    { label: "College Guides", value: "1.2L+" },
    { label: "Counseling Portals", value: "200+" },
    { label: "Expert Mentors", value: "45+" }
  ];

  return (
    <section className="py-24 container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {statItems.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="text-4xl sm:text-6xl font-black text-primary mb-2">{stat.value}</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${className}`}>
      {children}
    </span>
  )
}
