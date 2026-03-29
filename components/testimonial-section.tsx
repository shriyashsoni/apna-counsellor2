"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"
import { motion } from "framer-motion"

const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Anushka Patil",
      location: "Mumbai",
      testimonial:
        "Apna Counsellor helped me secure a seat in my dream college through MHT CET. The live support was accurate and timely.",
      college: "VJTI Mumbai",
      exam: "MHT CET",
      rating: 5,
    },
    {
      name: "Rohit Kumar",
      location: "Delhi",
      testimonial: "Thanks to Shriyash and team, I navigated JoSAA rounds easily and got into IIIT Gwalior!",
      college: "IIIT Gwalior",
      exam: "JEE Mains",
      rating: 5,
    },
    {
      name: "Pooja Jain",
      location: "Bhopal",
      testimonial: "Their MP DTE platform made the process simple. Highly recommended for MP students.",
      college: "SGSITS Indore",
      exam: "MP DTE",
      rating: 4,
    },
  ]

  return (
    <section className="py-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Testimonials
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
          >
            <Card className="border-primary/20 h-full card-hover">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.location}</p>
                  </div>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <Star key={i + testimonial.rating} className="h-4 w-4 text-gray-300 dark:text-gray-700" />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="italic text-gray-700 dark:text-gray-300 mb-4">
                  "{testimonial.testimonial}"
                </blockquote>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{testimonial.college}</span>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{testimonial.exam}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default TestimonialSection
