"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, MessageCircle, Mail, Phone } from "lucide-react"
import { motion } from "framer-motion"

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center space-x-2 mb-4"
            >
              <div className="relative h-10 w-10">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/add%20this%20website%20icon%20and%20logo.jpg-b0JRqyahhgtZntLcmUuuMxEERrMRvz.jpeg"
                  alt="Apna Counsellor Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl">Apna Counsellor</span>
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">India's Trusted Counselling Platform for Admissions</p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ y: -3, color: "#6d28d9" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                href="https://www.youtube.com/@ApnaCounsellor"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-primary" />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, color: "#6d28d9" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                href="https://www.instagram.com/counsellorapna/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-primary" />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, color: "#6d28d9" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                href="https://www.facebook.com/profile.php?id=61560390726245&mibextid=ZbWKwL"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-primary" />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, color: "#6d28d9" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                href="https://wa.link/cld3hu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-primary" />
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/counselling" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Counselling Platforms
                </Link>
              </li>
              <li>
                <Link href="/founder" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Our Founder
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Counselling</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://mht-apnacounsellor.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  MHT CET Counselling
                </a>
              </li>
              <li>
                <a
                  href="https://apnacounsellorjossa.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  JEE/JoSAA Counselling
                </a>
              </li>
              <li>
                <a
                  href="https://apnacounsellormpdte.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  MP DTE Counselling
                </a>
              </li>
              <li>
                <a
                  href="https://comedkcounselling.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  COMEDK Counselling
                </a>
              </li>
              <li>
                <Link href="/upcoming" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Upcoming Platforms
                </Link>
              </li>
              <li>
                <Link href="/predictors" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  College Predictors
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Resources & Documents
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <a href="tel:+919109881906" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  +91 9109881906
                </a>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <a
                  href="mailto:apnacounsellor@gmail.com"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  apnacounsellor@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <MessageCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <a
                  href="https://whatsapp.com/channel/0029VabjCVD5PO11jeEupQ44"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  WhatsApp Channel
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <Link href="/book-call" className="text-primary font-medium hover:underline">
                Book a Counselling Call
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Apna Counsellor. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/join-group" className="text-gray-600 dark:text-gray-400 hover:text-primary text-sm">
                Join WhatsApp Channel
              </Link>
              <Link href="/testimonials" className="text-gray-600 dark:text-gray-400 hover:text-primary text-sm">
                Testimonials
              </Link>
              <Link href="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-primary text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="text-gray-600 dark:text-gray-400 hover:text-primary text-sm">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
