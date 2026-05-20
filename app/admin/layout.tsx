"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, Rocket, UserCheck, FileText, Users, 
  Bell, Settings, ShieldCheck, ChevronLeft, LogOut, Loader2, ShieldAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    async function checkAdminCredentials() {
      if (!user?.id) {
        setIsAdmin(false)
        return
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (data && data.role === 'admin') {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }
      } catch (err) {
        setIsAdmin(false)
      }
    }
    
    if (!authLoading) {
      if (!isAuthenticated) {
        setIsAdmin(false)
        router.push("/login?redirect=" + encodeURIComponent(pathname))
      } else {
        checkAdminCredentials()
      }
    }
  }, [user, isAuthenticated, authLoading, pathname, router])

  if (authLoading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-white font-sans">
        <div className="relative h-20 w-20 mb-6">
          <div className="absolute inset-0 border-4 border-[#00FF88]/20 border-t-[#00FF88] rounded-full animate-spin" />
          <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-[#00FF88] animate-pulse" />
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Authenticating Admin Command...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-white p-6 font-sans">
        <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-6 shadow-xl shadow-red-950/20">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-black mb-2 tracking-tight">Access Restricted</h1>
        <p className="text-slate-400 text-sm font-medium text-center max-w-sm mb-8 leading-relaxed">
          You do not have administration credentials to enter the Apna Counsellor Command Center.
        </p>
        <Button onClick={() => router.push("/")} className="rounded-xl h-12 bg-white text-black font-black hover:bg-slate-100 px-6">
          Return to Homepage
        </Button>
      </div>
    )
  }

  const menuItems = [
    { label: "Dashboard Overview", path: "/admin", icon: LayoutDashboard },
    { label: "Courses Manager", path: "/admin/courses", icon: Rocket },
    { label: "Mentor Manager", path: "/admin/mentors", icon: UserCheck },
    { label: "Blog Manager", path: "/admin/blogs", icon: FileText },
    { label: "Students Manager", path: "/admin/students", icon: Users },
    { label: "Notifications & Broadcasts", path: "/admin/notifications", icon: Bell },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-[#080808] text-slate-200 flex font-sans overflow-x-hidden">
      {/* 1. COLLAPSIBLE SIDEBAR */}
      <motion.aside
        animate={{ width: isCollapsed ? 76 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 bottom-0 left-0 bg-[#0d0d0d] border-r border-white/5 flex flex-col z-30 select-none shadow-2xl"
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3"
              >
                <div className="h-9 w-9 rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/20 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-[#00FF88]" />
                </div>
                <span className="font-black text-sm tracking-tight uppercase leading-none">
                  Apna <br /><span className="text-[#00FF88]">Command</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <div className="h-9 w-9 mx-auto rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/20 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-[#00FF88]" />
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-8 px-3 space-y-1.5 overflow-y-auto pr-2">
          {menuItems.map((item) => {
            const active = pathname === item.path
            return (
              <Link key={item.label} href={item.path} className="block">
                <div
                  className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${
                    active 
                    ? "bg-[#00FF88]/10 text-white font-black border border-[#00FF88]/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5 font-semibold"
                  }`}
                >
                  {/* Glowing active notch */}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-3 bottom-3 w-1 bg-[#00FF88] rounded-r-md shadow-[0_0_10px_#00FF88]"
                    />
                  )}
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-[#00FF88]' : 'text-slate-400'}`} />
                  
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs tracking-tight"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Collapsible Trigger at Footer */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Button
            variant="ghost"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center p-0"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full h-11 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 flex items-center justify-center gap-3"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-xs font-black uppercase">Sign Out</span>}
          </Button>
        </div>
      </motion.aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div 
        className="flex-1 min-h-screen flex flex-col transition-all duration-300"
        style={{ marginLeft: isCollapsed ? 76 : 280 }}
      >
        {/* Topbar navigation panel */}
        <header className="h-20 border-b border-white/5 px-8 bg-[#0c0c0c]/85 backdrop-blur-xl flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#00FF88]">Apna Counsellor V2</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Global Command Node</p>
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="h-9 w-9 rounded-xl border border-white/10">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-purple-900/40 text-purple-400 font-bold text-xs uppercase">
                {user?.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Scrollable Workpane */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
