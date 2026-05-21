"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, Rocket, UserCheck, FileText, Users, 
  Bell, Settings, ShieldCheck, ChevronLeft, LogOut, ShieldAlert, Loader2, Radio
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
    async function checkAdmin() {
      if (!user?.id) { setIsAdmin(false); return }
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      setIsAdmin(data?.role === 'admin')
    }
    if (!authLoading) {
      if (!isAuthenticated) {
        setIsAdmin(false)
        router.push("/login?redirect=" + encodeURIComponent(pathname))
      } else {
        checkAdmin()
      }
    }
  }, [user, isAuthenticated, authLoading, pathname, router])

  if (authLoading || isAdmin === null) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <div className="relative h-16 w-16 mb-6">
        <div className="absolute inset-0 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-7 text-purple-400 animate-pulse" />
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Authenticating Admin Session...</p>
    </div>
  )

  if (!isAdmin) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
      <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-6">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-black mb-3 tracking-tight">Access Restricted</h1>
      <p className="text-slate-400 text-sm text-center max-w-sm mb-8 leading-relaxed">
        You do not have admin credentials to access the Apna Counsellor Command Center.
      </p>
      <Button onClick={() => router.push("/")} className="rounded-xl h-12 bg-white text-black font-black px-8 hover:bg-slate-100">
        Return to Homepage
      </Button>
    </div>
  )

  const menuItems = [
    { label: "Dashboard Overview", path: "/admin", icon: LayoutDashboard },
    { label: "Courses Manager", path: "/admin/courses", icon: Rocket },
    { label: "Mentor Manager", path: "/admin/mentors", icon: UserCheck },
    { label: "Blog Manager", path: "/admin/blogs", icon: FileText },
    { label: "Students Manager", path: "/admin/students", icon: Users },
    { label: "📢 Broadcast Emails", path: "/admin/broadcast", icon: Radio },
    { label: "Notifications", path: "/admin/notifications", icon: Bell },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex overflow-x-hidden">
      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="fixed top-0 bottom-0 left-0 bg-slate-900 border-r border-white/5 flex flex-col z-30 shadow-2xl overflow-hidden"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/5 flex-shrink-0">
          <div className="h-9 w-9 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="ml-3 font-black text-sm text-white tracking-tight whitespace-nowrap"
              >
                Admin <span className="text-purple-400">Command</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {menuItems.map(item => {
            const active = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path))
            return (
              <Link key={item.path} href={item.path}>
                <div className={`relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all group ${
                  active ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}>
                  {active && (
                    <motion.div layoutId="activeBar"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-purple-300 rounded-r-full"
                    />
                  )}
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs font-bold truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-white/5 space-y-1 flex-shrink-0">
          <Button variant="ghost" onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white p-0 flex items-center justify-center"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>
          <Button variant="ghost" onClick={async () => { await supabase.auth.signOut(); router.push("/login") }}
            className="w-full h-10 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span className="text-[10px] font-black uppercase">Sign Out</span>}
          </Button>
        </div>
      </motion.aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col transition-all duration-300" style={{ marginLeft: isCollapsed ? 72 : 260 }}>
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 px-6 bg-slate-900/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-purple-400">Apna Counsellor</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Admin Control Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank">
              <Button variant="ghost" className="h-9 rounded-lg text-slate-400 hover:text-white text-xs font-bold border border-white/5 hover:border-white/10 px-3">
                View Site ↗
              </Button>
            </Link>
            <Avatar className="h-9 w-9 rounded-xl border border-white/10">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-purple-900/40 text-purple-400 font-bold text-xs rounded-xl">
                {user?.email?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
