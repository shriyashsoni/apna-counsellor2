"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, MessageCircle, Mail, Phone, Sparkles, ShieldCheck, Globe, Zap, Linkedin, Send, Twitter } from "lucide-react"
import { motion } from "framer-motion"

const Footer = () => {
  const footerSections = [
    {
      title: "Admission Resources",
      links: [
        { name: "JoSAA 2024 Cutoff PDF", href: "/resources" },
        { name: "MHT-CET Preference List", href: "/resources" },
        { name: "CSAB Special Round Guide", href: "/resources" },
        { name: "NEET UG Rank Predictor", href: "/predictor" },
        { name: "State Counseling Dates", href: "/counselling" },
        { name: "Top NITs Placement Report", href: "/resources" },
        { name: "BITSAT Iteration Guide", href: "/resources" },
        { name: "Scholarship Checklist", href: "/resources" },
      ]
    },
    {
      title: "Predictors & Tools",
      links: [
        { name: "JEE Main College Predictor", href: "/predictor" },
        { name: "JEE Advanced Predictor", href: "/predictor" },
        { name: "NEET College Predictor", href: "/predictor" },
        { name: "WBJEE College Predictor", href: "/predictor" },
        { name: "COMEDK Seat Predictor", href: "/predictor" },
        { name: "Choice Filling AI Tool", href: "/predictor" },
        { name: "Rank vs Percentile 2026", href: "/predictor" },
        { name: "College Comparison Tool", href: "/compare" },
      ]
    },
    {
      title: "Entrance Exams",
      links: [
        { name: "JEE Main 2026", href: "/counselling" },
        { name: "JEE Advanced 2026", href: "/counselling" },
        { name: "NEET UG 2026", href: "/counselling" },
        { name: "MHT-CET 2026", href: "/counselling" },
        { name: "GUJCET 2026", href: "/counselling" },
        { name: "KCET / COMEDK", href: "/counselling" },
        { name: "UPTAC / HSTES", href: "/counselling" },
        { name: "WBJEE 2026", href: "/counselling" },
      ]
    },
    {
      title: "Our Mentorship",
      links: [
        { name: "Talk to IITians", href: "/mentors" },
        { name: "NIT Surathkal Mentors", href: "/mentors" },
        { name: "Medical Expert Guidance", href: "/mentors" },
        { name: "One-on-One Counseling", href: "/mentorship" },
        { name: "Premium Choice Filling", href: "/courses" },
        { name: "Documentation Support", href: "/courses" },
        { name: "Success Stories", href: "/about" },
        { name: "Verify Mentor", href: "/mentors" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
        { name: "Careers", href: "/about" },
        { name: "Updates & News", href: "/resources" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Use", href: "/terms-conditions" },
        { name: "Refund Policy", href: "/refund" },
        { name: "Account Deletion", href: "/settings" },
      ]
    },
    {
      title: "Quick Links",
      links: [
        { name: "Admin Portal", href: "/admin" },
        { name: "Mentor Login", href: "/login" },
        { name: "Student Dashboard", href: "/dashboard" },
        { name: "Help Center", href: "/contact" },
        { name: "Partner With Us", href: "/about" },
        { name: "System Status", href: "/about" },
        { name: "Security", href: "/security" },
        { name: "API Docs", href: "/about" },
      ]
    }
  ]

  return (
    <footer className="bg-[#0f172a] text-white pt-24 pb-12 overflow-hidden relative border-t border-white/5 font-sans">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Main Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12 mb-20">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white border-b border-primary/40 pb-2 inline-block">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-[13px] font-medium text-white/80 hover:text-white transition-colors block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Branding & App Section */}
        <div className="grid lg:grid-cols-12 gap-12 py-20 border-t border-white/5 mb-20">
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center space-x-3">
              <div className="relative h-14 w-14 shrink-0">
                <Image
                  src="/images/apna-counsellor-logo.png"
                  alt="Apna Counsellor Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tight text-white leading-tight">Apna <span className="text-primary">Counsellor</span></span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">India&apos;s #1 Admission Platform</span>
              </div>
            </div>
            <p className="text-white text-sm font-medium leading-relaxed max-w-md italic opacity-90">
              &quot;We understand that every student has unique needs and abilities, that&apos;s why our counseling ecosystem is designed to adapt to your rank and help you grow into your dream college.&quot;
            </p>
            
            <div className="space-y-4">
               <p className="text-xs font-black uppercase tracking-widest text-white/60">Let&apos;s get social :</p>
               <div className="flex gap-3">
                  {[
                    { icon: Instagram, href: "https://www.instagram.com/counsellorapna/", color: "hover:bg-pink-500" },
                    { icon: Linkedin, href: "https://in.linkedin.com/company/apnacounsellor", color: "hover:bg-blue-600" },
                    { icon: MessageCircle, href: "https://whatsapp.com/channel/0029VabjCVD5PO11jeEupQ44", color: "hover:bg-emerald-500" },
                    { icon: Send, href: "https://t.me/apnacounsellor", color: "hover:bg-blue-500" },
                    { icon: Twitter, href: "https://x.com/apnacounsellor", color: "hover:bg-sky-500" }
                  ].map((social, i) => (
                    <motion.a
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 transition-all ${social.color} text-white`}
                    >
                      <social.icon className="h-5 w-5" />
                    </motion.a>
                  ))}
               </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="grid sm:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white/60">Get In Touch</h4>
                  <div className="space-y-4">
                    <a href="mailto:info@apnacounsellor.in" className="flex items-center gap-4 text-white hover:text-primary transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold">info@apnacounsellor.in</span>
                    </a>
                    <a href="https://wa.me/919136270951" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-white hover:text-emerald-400 transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold">Chat on WhatsApp</span>
                    </a>
                    <a href="/contact" className="flex items-center gap-4 text-white hover:text-primary transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold">Talk to a Counsellor</span>
                    </a>
                  </div>
               </div>
               <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white/60">Trust & Recognition</h4>
                  <div className="space-y-3">
                    {[
                      { icon: ShieldCheck, text: "100% Verified Mentors" },
                      { icon: Globe, text: "50,000+ Students Guided" },
                      { icon: Zap, text: "Real-Time Cutoff Data" },
                      { icon: Sparkles, text: "AI-Powered Predictors" },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-3 text-white/80">
                        <Icon className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm font-semibold">{text}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Informational Text Block */}
        <div className="space-y-12 pb-20 border-b border-white/5 mb-12">
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white underline decoration-primary decoration-4 underline-offset-8">Know about Apna Counsellor</h3>
            <p className="text-white text-xs leading-loose font-medium opacity-80">
              Apna Counsellor is India&apos;s leading tech-driven admission ecosystem designed to assist students from rank identification to college enrollment. We provide extensive seat matrix data, real-time cutoff updates, and AI-powered choice filling tools. Our platform empowers over 50,000+ students every year to secure seats in prestigious institutions including IITs, NITs, and top medical colleges. By leveraging advanced data analytics and one-on-one mentorship from alumni of top-tier colleges, we ensure that no rank goes wasted and every student finds their perfect academic fit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
               <h4 className="text-sm font-black text-white border-l-4 border-primary pl-4 uppercase tracking-tighter">We Stand Out because</h4>
               <p className="text-white text-[11px] leading-relaxed font-medium opacity-70">
                  We provide students with intensive tools and verified data curated by IITians and Industry Experts. Apna Counsellor strives to make the complex counseling journey simple, accessible, and transparent for every student regardless of their background.
               </p>
            </div>
            <div className="space-y-4">
               <h4 className="text-sm font-black text-white border-l-4 border-primary pl-4 uppercase tracking-tighter">Our Key Focus Areas</h4>
               <p className="text-white text-[11px] leading-relaxed font-medium opacity-70">
                  Our main focus is to create high-accuracy college predictors and strategic choice-filling lists. With tools like the rank-to-college mapper, we have been able to provide a digital-first solution for lakhs of aspirants across India.
               </p>
            </div>
            <div className="space-y-4">
               <h4 className="text-sm font-black text-white border-l-4 border-primary pl-4 uppercase tracking-tighter">What Makes Us Different</h4>
               <p className="text-white text-[11px] leading-relaxed font-medium opacity-70">
                  We develop comprehensive pedagogical structures for counseling, where students get state-of-the-art rank analysis. Apart from predictors, we also provide physical document verification support and premium mentorship.
               </p>
            </div>
          </div>
        </div>

        {/* Final Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} APNA COUNSELLOR TECH SOLUTIONS PVT LTD
            </p>
            <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">
              CIN: U72900MH2023PTC402345 · Made with Passion for India&apos;s Students
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] font-black uppercase tracking-widest text-white">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors underline decoration-white/20 underline-offset-4">Privacy Policy</Link>
            <Link href="/terms-conditions" className="hover:text-primary transition-colors underline decoration-white/20 underline-offset-4">Terms of Use</Link>
            <Link href="/refund" className="hover:text-primary transition-colors underline decoration-white/20 underline-offset-4">Refund Policy</Link>
            <Link href="/security" className="hover:text-primary transition-colors underline decoration-white/20 underline-offset-4">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
