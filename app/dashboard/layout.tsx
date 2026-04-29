"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  Search, 
  MessageSquare, 
  GraduationCap, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Home,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bell,
  BookOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"

interface SidebarItem {
  name: string
  href: string
  icon: React.ElementType
}

const sidebarItems: SidebarItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "College Finder", href: "/colleges", icon: Search },
  { name: "AI Counselor", href: "/chat", icon: MessageSquare },
  { name: "My Shortlist", href: "/dashboard/shortlist", icon: Sparkles },
  { name: "Admissions", href: "/counselling", icon: GraduationCap },
  { name: "Resources", href: "/resources", icon: BookOpen },
  { name: "Cutoff Trends", href: "/predictor", icon: TrendingUp },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Handle auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      } else {
        setIsCollapsed(false)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="relative z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out hidden md:flex"
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-3">
             <div className="h-8 w-8 relative shrink-0">
               <Image src="/images/apna-counsellor-logo.png" alt="Logo" fill className="object-contain" />
             </div>
             {!isCollapsed && (
               <motion.span 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="font-black text-lg tracking-tight whitespace-nowrap"
               >
                 Apna <span className="text-primary">Counsellor</span>
               </motion.span>
             )}
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide py-4">
          {sidebarItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                    active 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary"
                  }`}
                >
                  <item.icon className={`h-5 w-5 shrink-0 ${active ? "text-white" : "group-hover:text-primary"}`} />
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-bold whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                  {active && !isCollapsed && (
                    <motion.div 
                      layoutId="active-nav-indicator"
                      className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
           {!isCollapsed && (
             <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 mb-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-bold">Premium Active</span>
                </div>
             </div>
           )}
           <Button 
             variant="ghost" 
             onClick={logout}
             className="w-full justify-start gap-3 rounded-xl hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 px-3 h-11"
           >
             <LogOut className="h-5 w-5 shrink-0" />
             {!isCollapsed && <span className="text-sm font-bold">Sign Out</span>}
           </Button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 h-6 w-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-md hover:text-primary transition-colors"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Top App Bar (Inside Dashboard) */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
             {/* Mobile Menu Button can go here */}
             <div className="md:hidden h-8 w-8 relative">
                <Image src="/images/apna-counsellor-logo.png" alt="Logo" fill className="object-contain" />
             </div>
             <h2 className="text-sm md:text-base font-black tracking-tight text-slate-400 dark:text-slate-500 hidden sm:block">
               {sidebarItems.find(i => i.href === pathname)?.name || "Dashboard"}
             </h2>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <Search className="h-4 w-4 text-slate-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search institutions..." 
                  className="bg-transparent border-none text-xs font-bold outline-none w-40 md:w-60"
                />
             </div>
             <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="rounded-xl relative">
                   <Bell className="h-5 w-5" />
                   <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                </Button>
                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
                <UserNav />
             </div>
          </div>
        </header>

        {/* Main Content Wrapper with Custom Scrollbar */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
