"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, CheckCircle, School, Users } from "lucide-react"
import { motion } from "framer-motion"

const HeroSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial="hidden" animate="show" variants={container}>
          <motion.h1 variants={item} className="text-4xl md:text-5xl font-bold mb-4">
            India's Trusted Counselling Platform for Admissions
          </motion.h1>
          <motion.p variants={item} className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Welcome to <span className="font-semibold">Apna Counsellor</span>, a one-stop destination for expert career
            counselling and admission guidance. We help you bridge the gap between your scores and dream colleges.
          </motion.p>
          <motion.div variants={container} className="space-y-3 mb-8">
            <motion.div variants={item} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1" />
              <p>Expert guidance for MHT CET, JEE Mains & Advanced, MP DTE, COMEDK</p>
            </motion.div>
            <motion.div variants={item} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1" />
              <p>Verified data, real-time counselling, and accurate college predictions</p>
            </motion.div>
            <motion.div variants={item} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1" />
              <p>Personalized sessions starting from just ₹250</p>
            </motion.div>
          </motion.div>
          <motion.div variants={item} className="flex flex-wrap gap-4">
            <Link href="/book-call">
              <Button size="lg" className="animated-gradient text-white hover:text-white">
                Book a Counselling Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="https://whatsapp.com/channel/0029VabjCVD5PO11jeEupQ44"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg">
                Join WhatsApp Channel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/India%27s%20Trusted%20Counselling%20Platform%20for%20Admissions.jpg-awq59bTnBuIHnoBkXVTum5zn14OhAI.jpeg"
            alt="India's Trusted Counselling Platform for Admissions"
            fill
            className="object-contain"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <div className="flex justify-between text-white">
              <motion.div
                className="text-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-2xl font-bold">5000+</p>
                <p className="text-sm">Students</p>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm">Platforms</p>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-2xl font-bold">1200+</p>
                <p className="text-sm">Sessions</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
        {[
          {
            icon: <School className="h-8 w-8 mb-3 text-primary" />,
            title: "Expert Guidance",
            description: "Personalized counselling for your specific needs",
          },
          {
            icon: <BookOpen className="h-8 w-8 mb-3 text-primary" />,
            title: "Verified Data",
            description: "Official cutoffs and seat matrices",
          },
          {
            icon: <Users className="h-8 w-8 mb-3 text-primary" />,
            title: "Community Support",
            description: "Join 5000+ students in our WhatsApp channel",
          },
          {
            icon: <CheckCircle className="h-8 w-8 mb-3 text-primary" />,
            title: "Affordable",
            description: "Sessions starting from just ₹250",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="text-center p-4 rounded-lg border border-gray-100 dark:border-gray-800 card-hover"
          >
            <div className="flex justify-center">{feature.icon}</div>
            <h3 className="font-semibold mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default HeroSection
