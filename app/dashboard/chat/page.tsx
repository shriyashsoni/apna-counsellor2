"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Sparkles, Bot, User, LogIn, BarChart3, ListChecks, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { puter } from "@heyputer/puter.js"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  role: "user" | "bot"
  content: string
}

export default function DashboardChatPage() {
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
      const systemPrompt = `You are "Apna Counsellor AI", the official virtual assistant for the Apna Counsellor platform. 
      Your ONLY purpose is to guide users about the Apna Counsellor platform, its features, mentorship programs, premium resources, and admission services available on our website.
      If a user asks a general knowledge question, coding question, or anything unrelated to the Apna Counsellor platform and engineering/medical counseling services we provide, you must politely decline and steer the conversation back to how Apna Counsellor can help them with their admissions.
      You can recommend our Mentorship (1-on-1 with IITians/NITians), our Predictor tools, and our Official Resources section.
      When asked for lists or comparisons, use Markdown tables and lists for clarity.
      Keep your tone professional, encouraging, and premium.`

      const response = await puter.ai.chat(`${systemPrompt}\n\nUser: ${textToSend}`);
      let content = "I'm sorry, I couldn't process that request.";
      if (typeof response === 'string') {
        content = response;
      } else if (response?.message?.content) {
        if (Array.isArray(response.message.content)) {
          content = response.message.content[0]?.text || response.message.content[0] || String(response);
        } else {
          content = response.message.content;
        }
      } else if (response?.text) {
        content = response.text;
      } else if (response) {
        content = response.toString();
      }
      if (content === "[object Object]") {
         content = JSON.stringify(response);
      }
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
    { label: "JoSAA Cutoffs", icon: Sparkles, query: "What are the expected JoSAA cutoffs for CSE in top NITs?" },
    { label: "Platform Guide", icon: Bot, query: "What features does Apna Counsellor offer?" }
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col flex-1 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight">AI Counselor Assistant</h1>
              <div className="flex items-center gap-1.5 mt-1">
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
               <Sparkles className="h-3.5 w-3.5" /> Powered by Puter
             </div>
          </div>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                  msg.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-primary'
                }`}>
                  {msg.role === 'user' ? <User className="h-5 w-5 sm:h-6 sm:w-6" /> : <Bot className="h-5 w-5 sm:h-6 sm:w-6" />}
                </div>
                <div className={`p-4 sm:p-6 rounded-[2rem] text-sm sm:text-base leading-relaxed shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white border-primary rounded-tr-none' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-tl-none text-slate-800 dark:text-slate-200'
                }`}>
                  <div className={`prose prose-sm sm:prose-base max-w-none prose-pre:bg-slate-950 prose-pre:border prose-pre:border-white/10 ${msg.role === 'user' ? 'text-white prose-p:text-white prose-strong:text-white prose-a:text-white' : 'dark:prose-invert'}`}>
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
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-md">
                  <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
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

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          {messages.length === 1 && !isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(action.query)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center group-hover:bg-primary/10 transition-colors shadow-sm">
                      <action.icon className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary line-clamp-1">{action.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1 shrink-0" />
                </button>
              ))}
            </div>
          )}
          
          <div className="relative group">
            <Input 
              placeholder="Ask anything... (e.g. Compare NIT Warangal vs NIT Trichy)" 
              className="rounded-2xl h-14 sm:h-16 pr-16 pl-6 focus-visible:ring-primary border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm sm:text-base font-medium shadow-inner"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
            />
            <Button 
              size="icon" 
              onClick={() => handleSend()}
              disabled={isLoading}
              className="absolute right-2 top-2 bottom-2 w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-md transition-all"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
