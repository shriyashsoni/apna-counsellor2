"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Sparkles, Bot, User, LogIn, BarChart3, ListChecks, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { puter } from "@heyputer/puter.js"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  role: "user" | "bot"
  content: string
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! I'm your **Apna Counsellor AI**, powered by advanced models. How can I help you with your admissions, college lists, or cutoffs today?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const puterRef = useRef<any>(null)

  useEffect(() => {
    // Check if user is signed into Puter
    const initPuter = async () => {
      try {
        const { puter } = await import("@heyputer/puter.js")
        puterRef.current = puter
        setIsSignedIn(puter.auth.isSignedIn())
      } catch (err) {
        console.error("Puter load error:", err)
      }
    }
    initPuter()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSignIn = async () => {
    if (!puterRef.current) return
    try {
      await puterRef.current.auth.signIn()
      setIsSignedIn(true)
    } catch (error) {
      console.error("Puter Auth Error:", error)
    }
  }

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input
    if (!textToSend.trim() || isLoading || !puterRef.current) return

    if (!isSignedIn) {
      await handleSignIn()
      if (!puterRef.current.auth.isSignedIn()) return
    }

    const userMessage: Message = { role: "user", content: textToSend }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Use a high-end model and provide context
      const systemPrompt = `You are "Apna Counsellor AI", a high-end admissions expert for Indian students. 
      You help with JOSAA (IITs/NITs), NEET (Medical), MHT-CET (Maharashtra), COMEDK, and other state entrance exams.
      Your goal is to provide data-driven, reliable advice.
      When asked for lists or comparisons, use Markdown tables and lists for clarity.
      If you can provide a "graph" style representation using text-based bars or structured lists, do so.
      Keep your tone professional, encouraging, and premium.`

      const response = await puterRef.current.ai.chat(`${systemPrompt}\n\nUser: ${textToSend}`, {
        model: "claude-3-5-sonnet", // High-end model
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
    { label: "Predict My College", icon: BarChart3, query: "Can you predict my college based on my rank?" },
    { label: "Top Engineering Colleges", icon: ListChecks, query: "Show me the top 10 engineering colleges in India with their average packages." },
    { label: "JoSAA Cutoffs 2025", icon: Sparkles, query: "What are the expected JoSAA 2025 cutoffs for CSE in top NITs?" }
  ]

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center z-50 border-4 border-white dark:border-slate-900"
      >
        <MessageSquare className="h-7 w-7" />
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-28 right-8 w-[95vw] max-w-[450px] h-[700px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-primary to-purple-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-black text-base">Apna Counsellor AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Premium Active</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-white/10 text-white rounded-full">
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/50 dark:bg-slate-900/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                      msg.role === 'user' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-primary'
                    }`}>
                      {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>
                    <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm border ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white border-primary rounded-tr-none' 
                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-tl-none text-slate-800 dark:text-slate-200'
                    }`}>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {messages.length === 1 && (
                <div className="grid gap-3 pt-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Quick Suggestions</p>
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(action.query)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-all group text-left shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <action.icon className="h-4 w-4 text-slate-500 group-hover:text-primary" />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-primary">{action.label}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="h-10 w-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="p-5 rounded-[1.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-none flex gap-1.5 items-center">
                      <div className="h-2 w-2 bg-primary/40 rounded-full animate-bounce" />
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Puter Auth Banner if not signed in */}
            {!isSignedIn && (
              <div className="px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-900/30 flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">Sign in to unlock Pro AI models</span>
                <Button size="sm" variant="outline" onClick={handleSignIn} className="h-7 text-[10px] gap-1.5 border-amber-200 bg-white dark:bg-slate-900 hover:bg-amber-100 font-bold">
                  <LogIn className="h-3 w-3" /> Login with Puter
                </Button>
              </div>
            )}

            {/* Input */}
            <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="relative group">
                <Input 
                  placeholder="Ask anything about admissions..." 
                  className="rounded-2xl h-14 pr-14 pl-5 focus-visible:ring-primary border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                />
                <Button 
                  size="icon" 
                  onClick={() => handleSend()}
                  disabled={isLoading}
                  className="absolute right-2 top-2 bottom-2 w-10 h-10 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-4 font-medium">Powered by Puter.js & Anthropic Claude</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
