"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Bell, BookOpen, CheckCircle, MessageCircle, Users } from "lucide-react"
import { motion } from "framer-motion"

export default function JoinGroupPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-6"
        >
          Join Our WhatsApp Channel
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg mb-12"
        >
          Stay updated with all counselling-related announcements, live sessions, cutoffs, expert tips, and college
          predictors by joining our WhatsApp channel.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -10 }}
            className="card-hover"
          >
            <Card className="border-primary/20 h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Benefits of Joining</CardTitle>
                <CardDescription className="text-base">Why you should join our WhatsApp channel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Real-time updates on counselling rounds",
                  "Instant notifications for important dates",
                  "Access to free resources and guides",
                  "Connect with other students",
                  "Get your questions answered by experts",
                  "Live sessions and webinars",
                  "College and branch recommendations",
                  "Cutoff updates and predictions",
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    className="flex items-start"
                  >
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <p>{point}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -10 }}
            className="card-hover"
          >
            <Card className="border-primary/20 h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Channel Features</CardTitle>
                <CardDescription className="text-base">What makes our WhatsApp channel special</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start">
                  <Bell className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Important Alerts</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Get timely notifications about counselling rounds, document verification, and seat allotment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <BookOpen className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Resource Sharing</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Access to PDFs, guides, and checklists to help you through the admission process.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Community Support</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Connect with peers who are going through the same process and share experiences.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MessageCircle className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Expert Interaction</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Direct access to counsellors who can answer your queries and provide guidance.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href="https://whatsapp.com/channel/0029VabjCVD5PO11jeEupQ44"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full animated-gradient text-white hover:text-white" size="lg">
                    Join WhatsApp Channel Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">Channel Rules</h2>
          <p className="mb-6">To ensure a positive and helpful environment for everyone, we have a few simple rules:</p>
          <ol className="space-y-3 list-decimal pl-5">
            <li>Be respectful to all members and counsellors.</li>
            <li>No spam or promotional content.</li>
            <li>Keep discussions relevant to education, counselling, and admissions.</li>
            <li>Do not share personal information publicly.</li>
            <li>Use appropriate language and maintain decorum.</li>
            <li>Avoid sending the same question multiple times.</li>
            <li>Be patient when waiting for responses from counsellors.</li>
          </ol>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Join Over 5000+ Students</h2>
          <p className="text-lg mb-6">
            Be part of India's fastest-growing counselling community and stay ahead in your admission journey.
          </p>
          <Link href="https://whatsapp.com/channel/0029VabjCVD5PO11jeEupQ44" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="animated-gradient text-white hover:text-white">
              Join WhatsApp Channel
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-6 text-gray-600 dark:text-gray-400">
            Need personalized help instead?{" "}
            <Link href="/book-call" className="text-primary font-medium">
              Book a one-on-one counselling call
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
