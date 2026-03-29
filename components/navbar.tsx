"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, X, ChevronDown, Phone } from "lucide-react"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"

const Navbar = () => {
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
    return pathname === path
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Courses", path: "/courses" },
    {
      name: "Counselling",
      path: "/counselling",
      dropdown: [
        { name: "MHT CET", path: "https://mht-apnacounsellor.vercel.app/", external: true },
        { name: "JEE/JoSAA", path: "https://apnacounsellorjossa.vercel.app/", external: true },
        { name: "MP DTE", path: "https://apnacounsellormpdte.vercel.app/", external: true },
        { name: "COMEDK", path: "https://comedkcounselling.vercel.app/", external: true },
        { name: "All Platforms", path: "/counselling" },
        { name: "Upcoming", path: "/upcoming" },
      ],
    },
    { name: "Resources", path: "/resources" },
    { name: "Predictors", path: "/predictors" },
    { name: "Blog", path: "/blog" }, // Added Blog link here
  ]

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-10 w-10">
              <Image
                src="/images/apna-counsellor-logo.png"
                alt="Apna Counsellor Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">Apna Counsellor</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            return item.dropdown ? (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center ${isActive(item.path) ? "text-primary font-medium" : ""}`}
                  >
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {item.dropdown.map((dropdownItem) => (
                    <DropdownMenuItem key={dropdownItem.name}>
                      {dropdownItem.external ? (
                        <a href={dropdownItem.path} target="_blank" rel="noopener noreferrer" className="w-full">
                          {dropdownItem.name}
                        </a>
                      ) : (
                        <Link href={dropdownItem.path} className="w-full">
                          {dropdownItem.name}
                        </Link>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  href={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.path) ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Link
              href="https://whatsapp.com/channel/0029VabjCVD5PO11jeEupQ44"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                Join Channel
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Link href="/book-call">
              <Button size="sm" className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
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
          className="md:hidden border-t"
        >
          <div className="container py-4 space-y-4">
            {navItems.map((item) => {
              return item.dropdown ? (
                <div key={item.name} className="space-y-2">
                  <div className="font-medium">{item.name}</div>
                  <div className="pl-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700">
                    {item.dropdown.map((dropdownItem) => (
                      <div key={dropdownItem.name}>
                        {dropdownItem.external ? (
                          <a
                            href={dropdownItem.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {dropdownItem.name}
                          </a>
                        ) : (
                          <Link
                            href={dropdownItem.path}
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`block ${isActive(item.path) ? "text-primary font-medium" : "text-muted-foreground"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            })}
            <div className="pt-4 space-y-3">
              <Link
                href="https://whatsapp.com/channel/0029VabjCVD5PO11jeEupQ44"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
              >
                <Button variant="outline" className="w-full">
                  Join WhatsApp Channel
                </Button>
              </Link>
              <Link href="/book-call" className="w-full block">
                <Button className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  Book a Counselling Call
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
