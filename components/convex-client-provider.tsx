"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { motion } from "framer-motion";
import { Settings, Sparkles } from "lucide-react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.error("NEXT_PUBLIC_CONVEX_URL is not defined. Please check your .env.local file.");
}

const convex = new ConvexReactClient(convexUrl || "https://placeholder.convex.cloud");

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convexUrl) {
    return (
      <div className="h-screen flex items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-10 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Settings className="h-32 w-32" />
          </div>
          
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-8">
            <Sparkles className="h-8 w-8" />
          </div>
          
          <h1 className="text-3xl font-black mb-4 tracking-tight">Setup Required</h1>
          <p className="text-slate-500 mb-8 font-medium leading-relaxed">
            Welcome to <span className="font-bold text-primary">Apna Counsellor</span>. To activate the premium features, please configure your environment variables.
          </p>
          
          <div className="p-6 rounded-2xl bg-primary text-white font-bold text-sm shadow-xl shadow-primary/20">
            NEXT_PUBLIC_CONVEX_URL is missing
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <ConvexAuthProvider client={convex}>
      {children}
    </ConvexAuthProvider>
  );
}
