"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, X, ChevronDown, Phone } from "lucide-react"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import NotificationInbox from "@/components/notification-inbox"
import { motion } from "framer-motion"

interface NavbarProps {
  categorizedCounselling?: {
    national: { id: string; name: string }[];
    state: { id: string; name: string }[];
    international: { id: string; name: string }[];
  }
}

const Navbar = ({ categorizedCounselling }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => {
    return pathname === path || (path !== '/' && pathname.startsWith(path))
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    {
      name: "Counselling",
      path: "/counselling",
      isMega: true,
    },
    { name: "Colleges", path: "/colleges" },
    { name: "Predictor", path: "/predictor" },
    { name: "Mentorship", path: "/mentorship" },
    { name: "Resources", path: "/resources" },
    { name: "Blog", path: "/blog" },
  ]

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled 
        ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-slate-200/50 dark:border-slate-800/50 h-12 md:h-14" 
        : "bg-transparent border-transparent h-14 md:h-16"
      }`}
    >
      <div className="container flex h-full items-center justify-between">
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link href="/" className="flex items-center space-x-2 md:space-x-3">
            <div className="relative h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
              <Image 
                src="/images/apna-counsellor-logo.png" 
                alt="Apna Counsellor Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <span className="font-black text-lg md:text-xl tracking-tighter hidden sm:inline-block">
              Apna <span className="text-primary">Counsellor</span>
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-0.5">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.isMega ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all flex items-center h-9 ${
                        isActive(item.path)
                        ? "text-primary bg-primary/5" 
                        : "text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-2xl mt-2 p-5 w-[700px] max-w-[90vw]">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 px-2">National</h4>
                        <div className="space-y-0.5">
                          {categorizedCounselling?.national?.map(c => (
                            <DropdownMenuItem key={c.id} asChild>
                              <Link href={`/counselling/${c.id}`} className="block px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">
                                {c.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 px-2">State</h4>
                        <div className="space-y-0.5 overflow-y-auto max-h-[250px] pr-2 scrollbar-hide">
                          {categorizedCounselling?.state?.map(c => (
                            <DropdownMenuItem key={c.id} asChild>
                              <Link href={`/counselling/${c.id}`} className="block px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">
                                {c.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 px-2">Global</h4>
                        <div className="space-y-0.5 overflow-y-auto max-h-[250px] pr-2 scrollbar-hide">
                          {categorizedCounselling?.international?.map(c => (
                            <DropdownMenuItem key={c.id} asChild>
                              <Link href={`/counselling/${c.id}`} className="block px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">
                                {c.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <motion.div whileHover={{ y: -0.5 }}>
                  <Link
                    href={item.path}
                    className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all block h-9 flex items-center ${
                      isActive(item.path) 
                      ? "text-primary bg-primary/5" 
                      : "text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
          <NotificationInbox />
          <UserNav />
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Link href="/book-call">
              <Button size="sm" className="rounded-lg px-4 font-bold h-9 text-xs shadow-lg shadow-primary/20">
                Book Call
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden border-t bg-white dark:bg-slate-900 shadow-xl max-h-[85vh] overflow-y-auto"
        >
          <div className="container py-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.isMega ? (
                  <div className="space-y-3 py-2">
                    <Link
                      href={item.path}
                      className="block text-base font-black text-primary px-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4">
                      <div>
                        <p className="text-[9px] font-black uppercase text-slate-400 mb-2">National</p>
                        <div className="space-y-2">
                          {categorizedCounselling?.national?.slice(0, 4).map(c => (
                            <Link key={c.id} href={`/counselling/${c.id}`} className="block text-[11px] font-bold text-slate-600 dark:text-slate-400" onClick={() => setIsMenuOpen(false)}>
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase text-slate-400 mb-2">State</p>
                        <div className="space-y-2">
                          {categorizedCounselling?.state?.slice(0, 4).map(c => (
                            <Link key={c.id} href={`/counselling/${c.id}`} className="block text-[11px] font-bold text-slate-600 dark:text-slate-400" onClick={() => setIsMenuOpen(false)}>
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`block py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
                      isActive(item.path) 
                      ? "text-primary bg-primary/5" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 space-y-3 border-t border-slate-100 dark:border-slate-800 px-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Account</span>
                <div className="flex items-center gap-3">
                  <NotificationInbox />
                  <UserNav />
                </div>
              </div>
              <Link href="/book-call" className="w-full block" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full h-11 rounded-xl font-bold text-sm">
                  Book a Call
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

export default Navbar
