import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "Anushka Patil",
      location: "Mumbai",
      testimonial:
        "Apna Counsellor helped me secure a seat in my dream college through MHT CET. The live support was accurate and timely. Shriyash guided me through each step of the CAP rounds and helped me make the right choice.",
      college: "VJTI Mumbai",
      exam: "MHT CET",
      rating: 5,
    },
    {
      name: "Rohit Kumar",
      location: "Delhi",
      testimonial:
        "Thanks to Shriyash and team, I navigated JoSAA rounds easily and got into IIIT Gwalior! Their predictor tool was spot on and the counselling call cleared all my doubts about choice filling.",
      college: "IIIT Gwalior",
      exam: "JEE Mains",
      rating: 5,
    },
    {
      name: "Pooja Jain",
      location: "Bhopal",
      testimonial:
        "Their MP DTE platform made the process simple. Highly recommended for MP students. The document checklist saved me from a lot of last-minute hassle.",
      college: "SGSITS Indore",
      exam: "MP DTE",
      rating: 5,
    },
    {
      name: "Arjun Singh",
      location: "Pune",
      testimonial:
        "The counselling session with Apna Counsellor was worth every penny. They helped me understand my options based on my rank and preferences. Got into a great college!",
      college: "COEP Pune",
      exam: "MHT CET",
      rating: 4,
    },
    {
      name: "Neha Sharma",
      location: "Jaipur",
      testimonial:
        "I was confused between NITs and IIITs, but their JoSAA counselling platform and personal guidance helped me make the right decision. Very grateful!",
      college: "NIT Jaipur",
      exam: "JEE Mains",
      rating: 5,
    },
    {
      name: "Vikram Patel",
      location: "Indore",
      testimonial:
        "The WhatsApp group updates were super helpful during counselling rounds. Got real-time alerts and guidance. Successfully got CSE at a good college.",
      college: "RGPV Bhopal",
      exam: "MP DTE",
      rating: 4,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Testimonials</h1>
        <p className="text-lg mb-12">
          Don't just take our word for it. Here's what students who received guidance from Apna Counsellor have to say
          about their experience.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{testimonial.name}</h2>
                    <p className="text-gray-600">{testimonial.location}</p>
                  </div>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <Star key={i + testimonial.rating} className="h-4 w-4 text-gray-300" />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="italic text-gray-700">"{testimonial.testimonial}"</blockquote>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="w-full flex justify-between text-sm">
                  <span className="font-medium">College: {testimonial.college}</span>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{testimonial.exam}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: "5000+", label: "Students Connected" },
              { number: "120+", label: "Personalized Sessions" },
              { number: "12+", label: "Direct Admissions" },
              { number: "3", label: "Counselling Platforms" },
            ].map((stat, index) => (
              <div key={index} className="p-4">
                <p className="text-3xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-gray-700">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Share Your Experience</h2>
          <p className="text-lg mb-6">
            Have you received counselling from Apna Counsellor? We'd love to hear about your experience!
          </p>
          <div className="flex justify-center">
            <Link href="https://wa.link/cld3hu" target="_blank" rel="noopener noreferrer">
              <Button>
                Submit Your Testimonial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
