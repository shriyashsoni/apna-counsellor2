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
        ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-slate-200/50 dark:border-slate-800/50 h-16" 
        : "bg-transparent border-transparent h-20"
      }`}
    >
      <div className="container flex h-full items-center justify-between">
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative h-12 w-12 flex-shrink-0">
              <Image 
                src="/images/apna-counsellor-logo.png" 
                alt="Apna Counsellor Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <span className="font-extrabold text-2xl tracking-tight hidden sm:inline-block">
              Apna <span className="text-primary">Counsellor</span>
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.isMega ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center ${
                        isActive(item.path)
                        ? "text-primary bg-primary/5" 
                        : "text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-3xl mt-2 p-6 w-[800px] max-w-[90vw]">
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4 px-2">National Portals</h4>
                        <div className="space-y-1">
                          {categorizedCounselling?.national?.map(c => (
                            <DropdownMenuItem key={c.id} asChild>
                              <Link href={`/counselling/${c.id}`} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                                {c.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4 px-2">State Portals</h4>
                        <div className="space-y-1 overflow-y-auto max-h-[300px] pr-2 scrollbar-hide">
                          {categorizedCounselling?.state?.map(c => (
                            <DropdownMenuItem key={c.id} asChild>
                              <Link href={`/counselling/${c.id}`} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                                {c.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4 px-2">Global Admissions</h4>
                        <div className="space-y-1 overflow-y-auto max-h-[300px] pr-2 scrollbar-hide">
                          {categorizedCounselling?.international?.map(c => (
                            <DropdownMenuItem key={c.id} asChild>
                              <Link href={`/counselling/${c.id}`} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                                {c.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <DropdownMenuItem asChild>
                            <Link href="/counselling" className="flex items-center text-primary font-bold text-xs px-2">
                              View All 200+ Portals
                              <ChevronDown className="-rotate-90 ml-1 h-3 w-3" />
                            </Link>
                          </DropdownMenuItem>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <motion.div whileHover={{ y: -1 }}>
                  <Link
                    href={item.path}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all block ${
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

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
          <UserNav />
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Link href="/book-call">
              <Button size="sm" className="rounded-xl px-5 font-bold h-10 shadow-lg shadow-primary/25">
                Book Call
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
          className="md:hidden border-t bg-white dark:bg-slate-900 shadow-xl max-h-[80vh] overflow-y-auto"
        >
          <div className="container py-6 space-y-4">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.isMega ? (
                  <div className="space-y-4 py-2">
                    <Link
                      href={item.path}
                      className="block text-lg font-black text-primary px-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    <div className="grid grid-cols-2 gap-4 px-4">
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">National</p>
                        <div className="space-y-2">
                          {categorizedCounselling?.national?.slice(0, 5).map(c => (
                            <Link key={c.id} href={`/counselling/${c.id}`} className="block text-xs font-bold text-slate-600 dark:text-slate-400" onClick={() => setIsMenuOpen(false)}>
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">State</p>
                        <div className="space-y-2">
                          {categorizedCounselling?.state?.slice(0, 5).map(c => (
                            <Link key={c.id} href={`/counselling/${c.id}`} className="block text-xs font-bold text-slate-600 dark:text-slate-400" onClick={() => setIsMenuOpen(false)}>
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
                    className={`block py-3 px-4 rounded-xl font-bold transition-all ${
                      isActive(item.path) 
                      ? "text-primary bg-primary/5" 
                      : "text-slate-600 dark:text-slate-400"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-6 space-y-3 border-t border-slate-100 dark:border-slate-800 px-4">
              <Link href="/book-call" className="w-full block" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full h-12 rounded-xl font-bold">
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
