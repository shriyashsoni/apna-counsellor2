"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function RevolutionaryCounselingBanner() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-slate-950 p-1">
      {/* Animated glowing border background */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "linear",
        }}
        className="absolute inset-[-100%] z-0 bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#4338ca_50%,#8b5cf6_100%)] opacity-30"
      />
      
      {/* Inner container */}
      <div 
        className="relative z-10 flex w-full flex-col items-center justify-between gap-8 overflow-hidden rounded-[22px] bg-slate-950 px-8 py-12 md:flex-row md:px-12 md:py-16"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Content */}
        <div className="relative z-10 flex max-w-2xl flex-col items-start gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Career Guidance</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Secure Your Spot in <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Top Institutes
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl text-lg text-slate-400"
          >
            Join 50,000+ students navigating their dream college admissions with our revolutionary precision algorithms and expert IITian mentors.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex flex-wrap items-center gap-4"
          >
            <Link href="/book-call">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition-all hover:bg-slate-100"
              >
                <span>Book a Strategy Call</span>
                <motion.span
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
                <div className="absolute inset-0 -z-10 bg-white opacity-0 transition-opacity group-hover:animate-pulse group-hover:opacity-20" />
              </motion.button>
            </Link>
            
            <Link href="/predictor">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-slate-800"
              >
                <GraduationCap className="h-4 w-4" />
                Try AI Predictor
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Visual Element Right side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="relative z-10 hidden h-64 w-64 md:block"
        >
          <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative h-full w-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shadow-2xl">
            <div className="flex h-full flex-col justify-between rounded-xl bg-slate-900 p-4">
              <div className="space-y-3">
                <div className="h-3 w-1/2 rounded-full bg-slate-800" />
                <div className="h-3 w-3/4 rounded-full bg-slate-800" />
                <div className="h-3 w-5/6 rounded-full bg-slate-800" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <div className="h-3 w-20 rounded-full bg-indigo-400/50 mb-2" />
                  <div className="h-2 w-16 rounded-full bg-slate-700" />
                </div>
              </div>
            </div>
            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-6 -top-6 rounded-lg border border-white/10 bg-slate-900/80 px-4 py-2 backdrop-blur-md shadow-lg"
            >
              <p className="text-xs font-bold text-green-400">99.9% Accuracy</p>
            </motion.div>
            <motion.div 
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 rounded-lg border border-white/10 bg-slate-900/80 px-4 py-2 backdrop-blur-md shadow-lg"
            >
              <p className="text-xs font-bold text-indigo-400">200+ Portals</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
