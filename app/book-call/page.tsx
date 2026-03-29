import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Calendar, CheckCircle, Clock, CreditCard, Languages, Phone } from "lucide-react"
import BookingForm from "./BookingForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book a Counselling Call – Get Expert Admission Guidance",
  description:
    "Book a personalized counselling session with Apna Counsellor experts. Get guidance for MHT CET, JEE, MP DTE, COMEDK admissions. Sessions start from ₹250.",
  keywords:
    "book counselling call, admission guidance, MHT CET counselling, JEE counselling, college admission help, personalized guidance, expert counsellor",
}

export default function BookCallPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Book a Counselling Call</h1>
        <p className="text-lg mb-12 text-center max-w-3xl mx-auto">
          Get personalized guidance from our expert counsellors to help you navigate the admission process and secure a
          seat in your dream college.
        </p>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Booking Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <BookingForm />
          </div>

          {/* Information Sidebar - Takes 1 column */}
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl">What You'll Get</CardTitle>
                <CardDescription>Our counselling sessions include</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "One-on-one session with expert counsellor",
                  "Personalized college recommendations",
                  "Guidance on choice filling strategy",
                  "Document verification assistance",
                  "Fee structure and scholarship info",
                  "Post-counselling WhatsApp support",
                ].map((point, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{point}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl">Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-primary mr-3" />
                  <div>
                    <h4 className="font-medium text-sm">Duration</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">30-45 minutes per session</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-primary mr-3" />
                  <div>
                    <h4 className="font-medium text-sm">Pricing</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Starting from ₹250 per session</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-primary mr-3" />
                  <div>
                    <h4 className="font-medium text-sm">Availability</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">7 days a week, 10 AM to 8 PM</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Languages className="h-4 w-4 text-primary mr-3" />
                  <div>
                    <h4 className="font-medium text-sm">Languages</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Hindi, English, and Marathi</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-primary mr-3" />
                  <div>
                    <h4 className="font-medium text-sm">Mode</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">WhatsApp call or Direct phone call</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gray-50 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl">Quick Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Need immediate assistance?</p>
                <div className="space-y-2">
                  <a href="https://wa.me/919109881906" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full">
                      WhatsApp: +91 9109881906
                    </Button>
                  </a>
                  <a href="mailto:apnacounsellor@gmail.com">
                    <Button variant="outline" size="sm" className="w-full">
                      Email Us
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Fill the Form",
                description: "Complete the booking form with your details and counselling requirements",
              },
              {
                step: "2",
                title: "WhatsApp Redirect",
                description: "Get redirected to WhatsApp with your details pre-filled for quick contact",
              },
              {
                step: "3",
                title: "Schedule Session",
                description: "Our team will contact you within 2-4 hours to schedule your session",
              },
              {
                step: "4",
                title: "Get Guidance",
                description: "Receive personalized counselling and ongoing support throughout the process",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Secure Your Future?</h2>
          <p className="text-lg mb-6">
            Don't miss the opportunity to get expert guidance for your college admission process.
          </p>
          <Link href="#booking-form">
            <Button size="lg" className="animated-gradient text-white hover:text-white">
              Book Your Counselling Call Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
