"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, MessageCircle, Mail, Phone, ArrowRight, Sparkles, ShieldCheck, Globe, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Footer = () => {
  return (
    <footer className="bg-[#020617] text-white pt-24 pb-12 overflow-hidden relative border-t border-white/5">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Upper Footer: Newsletter & Branding */}
        <div className="grid lg:grid-cols-12 gap-12 pb-20 border-b border-white/5 mb-20">
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3"
            >
              <div className="relative h-12 w-12 bg-white/5 p-2 rounded-2xl border border-white/10">
                <Image
                  src="/images/apna-counsellor-logo.png"
                  alt="Apna Counsellor Logo"
                  fill
                  className="object-contain invert p-2"
                />
              </div>
              <span className="font-black text-3xl tracking-tighter">Apna <span className="text-primary">Counsellor</span></span>
            </motion.div>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
              The premier admission ecosystem for India&apos;s brightest minds. We leverage AI to transform ranks into life-changing academic careers.
            </p>
            <div className="flex flex-wrap gap-4">
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Government Verified
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-slate-400">
                  <Zap className="h-4 w-4 text-amber-500" /> AI Powered
               </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-8 md:p-12 rounded-[3rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4">Stay ahead of the curve.</h3>
                  <p className="text-slate-400 font-medium mb-8 max-w-sm">Get real-time counseling updates, cutoff alerts, and strategic tips delivered to your inbox.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                     <Input 
                        placeholder="Enter your email" 
                        className="h-14 rounded-2xl bg-white/5 border-white/10 focus:ring-primary/20 text-lg px-6"
                     />
                     <Button className="h-14 rounded-2xl px-10 font-black text-lg gap-2 shadow-xl shadow-primary/20">
                        Join Community <ArrowRight className="h-5 w-5" />
                     </Button>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 mt-6 uppercase tracking-widest">
                     Join 50,000+ students already optimizing their journey.
                  </p>
               </div>
               <Sparkles className="absolute -bottom-10 -right-10 h-40 w-40 text-white/[0.03] rotate-12" />
            </div>
          </div>
        </div>

        {/* Middle Footer: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-1">
             <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-8">Connect</h4>
             <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Youtube, label: "YouTube", color: "hover:bg-red-500" },
                  { icon: Instagram, label: "Instagram", color: "hover:bg-pink-500" },
                  { icon: MessageCircle, label: "WhatsApp", color: "hover:bg-emerald-500" },
                  { icon: Globe, label: "Telegram", color: "hover:bg-blue-500" }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    whileHover={{ y: -5, scale: 1.05 }}
                    href="#"
                    className={`flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 transition-all ${social.color}`}
                  >
                    <social.icon className="h-5 w-5" />
                    <span className="text-xs font-black uppercase tracking-wider">{social.label}</span>
                  </motion.a>
                ))}
             </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-8">Admissions</h4>
            <ul className="space-y-4">
              {["JoSAA / CSAB", "MHT-CET", "MP DTE", "UPTAC / HSTES", "NEET UG / MCC", "COMEDK"].map(item => (
                <li key={item}>
                  <Link href={`/counselling/${item.replace(/ /g, "_")}`} className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center group">
                    <div className="w-0 group-hover:w-4 transition-all duration-300 h-[1px] bg-primary mr-0 group-hover:mr-2" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-8">Technology</h4>
            <ul className="space-y-4">
              {["College Predictor", "Branch Predictor", "Choice Filling AI", "Cutoff Analyzer", "Seat Matrix 2026", "AI Chatbot"].map(item => (
                <li key={item}>
                  <Link href="/predictor" className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center group">
                    <div className="w-0 group-hover:w-4 transition-all duration-300 h-[1px] bg-primary mr-0 group-hover:mr-2" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-8">Services</h4>
            <ul className="space-y-4">
              {["Mentorship", "Premium Support", "Choice Filling", "Verification", "Refund Policy", "Scholarships"].map(item => (
                <li key={item}>
                  <Link href="/services" className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center group">
                    <div className="w-0 group-hover:w-4 transition-all duration-300 h-[1px] bg-primary mr-0 group-hover:mr-2" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-8">Organization</h4>
            <ul className="space-y-4">
              {["Our Vision", "Founders", "Success Stories", "Careers", "Security", "Contact Us"].map(item => (
                <li key={item}>
                  <Link href="/about" className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center group">
                    <div className="w-0 group-hover:w-4 transition-all duration-300 h-[1px] bg-primary mr-0 group-hover:mr-2" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lower Footer: Copyright & Legal */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} APNA COUNSELLOR TECH SOLUTIONS PVT LTD
            </p>
            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">
              CIN: U72900MH2023PTC402345 · Made with Passion in Mumbai
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms-conditions" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/refund" className="hover:text-primary transition-colors">Refund</Link>
            <Link href="/security" className="hover:text-primary transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
