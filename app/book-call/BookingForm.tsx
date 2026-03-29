"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Phone, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"

interface FormData {
  name: string
  mobile: string
  email: string
  counsellingType: string
  scoreRank: string
  preferredLocation: string
  additionalInfo: string
}

export default function BookingForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    counsellingType: "",
    scoreRank: "",
    preferredLocation: "",
    additionalInfo: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generateWhatsAppMessage = () => {
    const message = `Hi Team Apna Counsellor,

My details are as follows:

Name: ${formData.name}
Mobile: ${formData.mobile}
Email: ${formData.email}
Counselling Required: ${formData.counsellingType}
Score / Rank: ${formData.scoreRank}
Preferred College/City: ${formData.preferredLocation || "Not specified"}
Additional Information: ${formData.additionalInfo || "None"}

Please help me with the next steps for counselling.
Thanks!`

    return encodeURIComponent(message)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name || !formData.counsellingType || !formData.scoreRank) {
      alert("Please fill in all required fields (Name, Counselling Type, and Score/Rank)")
      return
    }

    setIsSubmitting(true)

    // Generate WhatsApp URL with pre-filled message
    const whatsappMessage = generateWhatsAppMessage()
    const whatsappURL = `https://wa.me/919109881906?text=${whatsappMessage}`

    // Simulate form processing delay
    setTimeout(() => {
      // Redirect to WhatsApp
      window.open(whatsappURL, "_blank")
      setIsSubmitting(false)

      // Reset form
      setFormData({
        name: "",
        mobile: "",
        email: "",
        counsellingType: "",
        scoreRank: "",
        preferredLocation: "",
        additionalInfo: "",
      })
    }, 1000)
  }

  const counsellingOptions = [
    { value: "mht-cet", label: "MHT CET Counselling" },
    { value: "josaa", label: "JoSAA (JEE Main/Advanced)" },
    { value: "mp-dte", label: "MP DTE Counselling" },
    { value: "comedk", label: "COMEDK Counselling" },
    { value: "neet-ug", label: "NEET UG Counselling" },
    { value: "other", label: "Other (Please specify in additional info)" },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center">
              <Phone className="h-6 w-6 mr-2 text-primary" />
              Book Your Counselling Session
            </CardTitle>
            <CardDescription className="text-base">
              Fill out this form and we'll connect with you on WhatsApp to schedule your personalized counselling
              session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="counsellingType">
                  Counselling Required <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.counsellingType}
                  onValueChange={(value) => handleInputChange("counsellingType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select the type of counselling you need" />
                  </SelectTrigger>
                  <SelectContent>
                    {counsellingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scoreRank">
                  Score / Rank <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="scoreRank"
                  type="text"
                  placeholder="e.g., 95 percentile, 5000 rank, 150/200 marks"
                  value={formData.scoreRank}
                  onChange={(e) => handleInputChange("scoreRank", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredLocation">Preferred College / City</Label>
                <Input
                  id="preferredLocation"
                  type="text"
                  placeholder="e.g., Mumbai, Pune, VJTI, IIT Bombay"
                  value={formData.preferredLocation}
                  onChange={(e) => handleInputChange("preferredLocation", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any specific questions or requirements you have..."
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-start">
                  <MessageCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">What happens next?</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                      After submitting this form, you'll be redirected to WhatsApp with your details pre-filled. Our
                      counselling team will respond within 2-4 hours to schedule your session.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full animated-gradient text-white hover:text-white"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Redirecting to WhatsApp..."
                ) : (
                  <>
                    Submit & Connect on WhatsApp
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By submitting this form, you agree to be contacted by our counselling team via WhatsApp.
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 text-center"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-4">Prefer to contact us directly?</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://wa.me/919109881906" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp Directly
            </Button>
          </a>
          <a href="tel:+919109881906">
            <Button variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Call +91 9109881906
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  )
}
