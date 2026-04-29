"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Sparkles, Bot, User, LogIn, BarChart3, ListChecks, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { puter } from "@heyputer/puter.js"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Link from "next/link"

interface Message {
  role: "user" | "bot"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! I'm your **Apna Counsellor AI Assistant**. I have access to data for 70,000+ college records and 200+ admission portals. How can I help you today?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsSignedIn(puter.auth.isSignedIn())
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSignIn = async () => {
    try {
      await puter.auth.signIn()
      setIsSignedIn(true)
    } catch (error) {
      console.error("Puter Auth Error:", error)
    }
  }

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input
    if (!textToSend.trim() || isLoading) return

    if (!isSignedIn) {
      await handleSignIn()
      if (!puter.auth.isSignedIn()) return
    }

    const userMessage: Message = { role: "user", content: textToSend }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const systemPrompt = `You are "Apna Counsellor AI", a high-end admissions expert for Indian students. 
      You help with JOSAA (IITs/NITs), NEET (Medical), MHT-CET (Maharashtra), COMEDK, and other state entrance exams.
      Your goal is to provide data-driven, reliable advice.
      When asked for lists or comparisons, use Markdown tables and lists for clarity.
      Keep your tone professional, encouraging, and premium.`

      const response = await puter.ai.chat(`${systemPrompt}\n\nUser: ${textToSend}`, {
        model: "claude-3-5-sonnet",
        stream: false
      })

      const content = response?.toString() || "I'm sorry, I couldn't process that request."
      setMessages(prev => [...prev, { role: "bot", content }])
    } catch (error) {
      console.error("AI Error:", error)
      setMessages(prev => [...prev, { role: "bot", content: "Sorry, I'm having trouble connecting to the AI models. Please try again later." }])
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    { label: "College Prediction", icon: BarChart3, query: "Based on my rank, which colleges can I get?" },
    { label: "Top Engineering List", icon: ListChecks, query: "Show me the top 10 engineering colleges in India with average packages." },
    { label: "JoSAA 2026 Cutoffs", icon: Sparkles, query: "What are the expected JoSAA 2026 cutoffs for CSE in top NITs?" },
    { label: "State vs National", icon: Bot, query: "Explain the difference between state quota and All India quota." }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight">AI Counselor Assistant</h1>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active & Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             {!isSignedIn && (
               <Button variant="outline" size="sm" onClick={handleSignIn} className="rounded-xl font-bold gap-2">
                 <LogIn className="h-4 w-4" /> Login
               </Button>
             )}
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
               <Sparkles className="h-3.5 w-3.5" /> Premium Mode
             </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
        <div ref={scrollRef} className="flex-1 space-y-8 overflow-y-auto pr-2 scrollbar-hide">
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl ${
                  msg.role === 'user' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-primary border border-slate-100 dark:border-slate-800'
                }`}>
                  {msg.role === 'user' ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                </div>
                <div className={`p-6 rounded-[2rem] text-base leading-relaxed shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white border-primary rounded-tr-none' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-tl-none text-slate-800 dark:text-slate-200'
                }`}>
                  <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-white/10">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-4 max-w-[85%]">
                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-xl border border-slate-100 dark:border-slate-800">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-tl-none flex gap-2 items-center">
                  <div className="h-2.5 w-2.5 bg-primary/40 rounded-full animate-bounce" />
                  <div className="h-2.5 w-2.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2.5 w-2.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input & Quick Actions Container */}
        <div className="sticky bottom-8 space-y-6">
          {messages.length === 1 && !isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(action.query)}
                  className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-all group text-left shadow-xl shadow-slate-200/20 dark:shadow-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <action.icon className="h-5 w-5 text-slate-400 group-hover:text-primary" />
                    </div>
                    <span className="text-sm font-black text-slate-700 dark:text-slate-300 group-hover:text-primary">{action.label}</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          )}

          <div className="max-w-4xl mx-auto w-full">
            <div className="relative group">
              <Input 
                placeholder="Message AI Counselor... (e.g. Compare IIT Bombay vs IIT Delhi)" 
                className="rounded-[2.5rem] h-20 pr-20 pl-8 focus-visible:ring-primary border-none bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none text-lg font-medium"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
              />
              <Button 
                size="icon" 
                onClick={() => handleSend()}
                disabled={isLoading}
                className="absolute right-3 top-3 bottom-3 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all"
              >
                <Send className="h-6 w-6" />
              </Button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-4 font-black uppercase tracking-widest">
              High-Performance AI Infrastructure by Puter.js
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
