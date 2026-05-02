"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star, Quote, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

const googleReviews = [
  {
    "author": "Halima Sayyad",
    "rating": 5,
    "text": "Very good counseling it was very useful helped me a lot any time sir was available to answer thank you sir I got my dream college 😊"
  },
  {
    "author": "Nutunj Kamdi",
    "rating": 5,
    "text": "The journey with this guy was great he helped me a lot during my engineering process so thank you for all this 🙏"
  },
  {
    "author": "Ayush Tegas",
    "rating": 5,
    "text": "Very nice counsellor and thank you so much for supporting us ☺️......"
  },
  {
    "author": "OMKAR GANGWANI",
    "rating": 5,
    "text": "best grp/channel ever all the material , imp points were so accurate and helpful getting this type of info free of cost is really rare thankuh sir"
  },
  {
    "author": "Rutuja Rahire",
    "rating": 5,
    "text": "Apna councellor helps me a lot for getting the best college 😃.. thank you so much 🙏 …"
  },
  {
    "author": "Sidharth Chavhan",
    "rating": 5,
    "text": "Very nice counselor and thank you so much for supporting us... 🌟 …"
  },
  {
    "author": "Vijay Warade",
    "rating": 5,
    "text": "Best counsellor, highly recommend"
  },
  {
    "author": "Naushad Damad",
    "rating": 5,
    "text": "Experience is very nice and response is very quick"
  },
  {
    "author": "samruddhi adlinge",
    "rating": 5,
    "text": "I highly recommend Apna Counselor to any student looking for professional and personalized guidance. He help students to find the perfect college as per their interest and goals."
  },
  {
    "author": "Bhavesh Mali",
    "rating": 5,
    "text": "First of all thanks Aapna counsellor for supporting and standing with us one thing I like about the Apna counsellor is they help us 24/7 and giving us continuous information.and because of this I got my dream college ( Bramha vally institute of technology and research Nashik)in nashik city."
  },
  {
    "author": "WARRIOR QUEEN",
    "rating": 5,
    "text": "Best counselor for mht cet he give me free of cost what's app support for admission related queries and doubts thanks 🙏 …"
  },
  {
    "author": "Atharva Patil",
    "rating": 5,
    "text": "Excellent and to the point service. Absolutely worth many times what they are costing."
  },
  {
    "author": "Pratik Shinde",
    "rating": 5,
    "text": "All the best sir and thanks so much for this help ❤️❤️❤️🙏🙏"
  },
  {
    "author": "RAM KORPE",
    "rating": 5,
    "text": "Nice counsellor replies within a min whenever asked and helped from starting till end"
  },
  {
    "author": "Nitin Jadhav",
    "rating": 5,
    "text": "Very helpful counselling the counsellar helped throughout the admission process"
  }
]

const TestimonialSection = () => {
  return (
    <section className="py-24 bg-slate-50/50 dark:bg-slate-900/20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Star className="h-3 w-3 fill-current" />
            Verified Google Reviews
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Loved by <span className="text-primary">Thousands</span> of Students
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Real feedback from students who secured their dream colleges with the help of Apna Counsellor.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {googleReviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="h-full border-none shadow-sm hover:shadow-2xl transition-all rounded-[2rem] bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-primary text-xl">
                        {review.author[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 dark:text-white leading-tight">{review.author}</h3>
                        <div className="flex gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center opacity-40">
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M21.35 11.1h-9.17v2.73h5.14c-.22 1.1-.88 2.03-1.85 2.68v2.23h3c1.76-1.62 2.77-4.01 2.77-6.91 0-.61-.05-1.2-.14-1.73z" />
                        <path fill="currentColor" d="M12.18 21c2.43 0 4.47-.8 5.96-2.18l-3-2.23c-.83.56-1.9.89-3.07.89-2.34 0-4.32-1.58-5.03-3.71h-3.11v2.41c1.5 2.97 4.59 5.01 8.21 5.01z" />
                        <path fill="currentColor" d="M7.15 13.78c-.18-.54-.28-1.12-.28-1.72s.1-1.18.28-1.72v-2.41h-3.11c-.63 1.25-.99 2.66-.99 4.13s.36 2.88.99 4.13l3.11-2.41z" />
                        <path fill="currentColor" d="M12.18 6.53c1.32 0 2.51.45 3.44 1.35l2.58-2.58c-1.56-1.46-3.59-2.35-6.02-2.35-3.62 0-6.71 2.04-8.21 5.01l3.11 2.41c.71-2.13 2.69-3.71 5.1-3.71z" />
                      </svg>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8 flex-grow">
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/5 -z-1" />
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed relative z-10 font-medium">
                      &quot;{review.text}&quot;
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            href="https://share.google/b54K0yjeuIL8wL4FA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 font-black text-sm hover:shadow-xl transition-all hover:border-primary group"
          >
            View More Google Reviews 
            <ExternalLink className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.a>
        </div>
      </div>
    </section>
  )
}

export default TestimonialSection
