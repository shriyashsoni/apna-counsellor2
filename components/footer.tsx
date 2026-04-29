"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, MessageCircle, Mail, Phone } from "lucide-react"
import { motion } from "framer-motion"

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 mb-8"
            >
              <div className="relative h-12 w-12">
                <Image
                  src="/images/apna-counsellor-logo.png"
                  alt="Apna Counsellor Logo"
                  fill
                  className="object-contain invert brightness-0"
                />
              </div>
              <span className="font-black text-2xl tracking-tighter">Apna <span className="text-primary">Counsellor</span></span>
            </motion.div>
            <p className="text-slate-400 mb-8 max-w-sm leading-relaxed">
              India&apos;s leading AI-powered admission ecosystem. We transform rank into success through data-driven precision and expert mentorship.
            </p>
            
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 mb-8">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4">MUMBAI HEADQUARTERS</h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-2">
                Office 402, Elite Tech Hub, <br/>
                Powai, Mumbai, Maharashtra 400076
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Operations Center</span>
              </div>
            </div>

            <div className="flex space-x-4">
              {[Youtube, Instagram, Facebook, MessageCircle].map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -5, scale: 1.1 }}
                  href="#"
                  className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-black text-sm uppercase tracking-widest text-primary mb-8">National Portals</h3>
            <ul className="space-y-4">
              {["JoSAA", "CSAB", "NEET UG", "MCC Medical", "AACCC AYUSH", "DASA / CIWG", "JEE Advanced"].map(item => (
                <li key={item}>
                  <Link href={`/counselling/${item.replace(/ /g, "_")}`} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-black text-sm uppercase tracking-widest text-primary mb-8">State Admission</h3>
            <ul className="space-y-4">
              {["MHT CET", "MP DTE", "UPTAC", "REAP Rajasthan", "HSTES Haryana", "TNEA Tamil Nadu", "KEAM Kerala"].map(item => (
                <li key={item}>
                  <Link href={`/counselling/${item.replace(/ /g, "_")}`} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-black text-sm uppercase tracking-widest text-primary mb-8">AI Tools</h3>
            <ul className="space-y-4">
              {["College Predictor", "Choice Filling AI", "Cutoff Analyzer", "Trend Tracker", "Seat Matrix", "Document Verifier"].map(item => (
                <li key={item}>
                  <Link href="/predictors" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-black text-sm uppercase tracking-widest text-primary mb-8">Company</h3>
            <ul className="space-y-4">
              {["About Us", "Founder", "Our Story", "Global Hub", "Contact", "Careers"].map(item => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, "-")}`} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} APNA COUNSELLOR TECH SOLUTIONS PRIVATE LIMITED
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/refund" className="hover:text-primary transition-colors">Refund Policy</Link>
            <Link href="/security" className="hover:text-primary transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
