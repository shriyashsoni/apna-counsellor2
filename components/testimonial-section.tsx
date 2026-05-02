"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { motion } from "framer-motion"

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
    "text": "First of all thanks Aapna counsellor for supporting and standing with us one thing I like about the Apna counsellor is they help us 24/7 and giving us continuous information.and because of this I got my dream college."
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
  // Triple the reviews for a very long seamless marquee
  const extendedReviews = [...googleReviews, ...googleReviews, ...googleReviews]

  return (
    <section className="py-24 bg-slate-50/30 dark:bg-slate-900/10 overflow-hidden relative">
      <div className="container mx-auto px-4 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4"
            >
              <Star className="h-3 w-3 fill-current" />
              Real Student Reviews
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              What Our <span className="text-primary">Students</span> Say
            </h2>
          </div>
          <div className="flex items-center gap-6 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
             <div className="text-center border-r border-slate-100 dark:border-slate-800 pr-6">
                <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">4.9</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Google Rating</p>
             </div>
             <div className="flex flex-col gap-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[10px] font-black text-slate-500">200+ Verified Reviews</p>
             </div>
          </div>
        </div>
      </div>

      {/* Infinite Marquee Wrapper */}
      <div className="relative flex whitespace-nowrap group">
        <motion.div 
          className="flex gap-6 animate-marquee py-4"
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ 
            duration: 60, 
            repeat: Infinity, 
            ease: "linear",
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {extendedReviews.map((review, index) => (
            <div
              key={index}
              className="inline-block w-[350px] flex-shrink-0"
            >
              <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all rounded-[1.5rem] bg-white dark:bg-slate-900 overflow-hidden flex flex-col p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-sm">
                      {review.author[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{review.author}</h3>
                      <div className="flex gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-2.5 w-2.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="ml-auto opacity-20">
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M21.35 11.1h-9.17v2.73h5.14c-.22 1.1-.88 2.03-1.85 2.68v2.23h3c1.76-1.62 2.77-4.01 2.77-6.91 0-.61-.05-1.2-.14-1.73z" />
                        <path fill="currentColor" d="M12.18 21c2.43 0 4.47-.8 5.96-2.18l-3-2.23c-.83.56-1.9.89-3.07.89-2.34 0-4.32-1.58-5.03-3.71h-3.11v2.41c1.5 2.97 4.59 5.01 8.21 5.01z" />
                        <path fill="currentColor" d="M7.15 13.78c-.18-.54-.28-1.12-.28-1.72s.1-1.18.28-1.72v-2.41h-3.11c-.63 1.25-.99 2.66-.99 4.13s.36 2.88.99 4.13l3.11-2.41z" />
                        <path fill="currentColor" d="M12.18 6.53c1.32 0 2.51.45 3.44 1.35l2.58-2.58c-1.56-1.46-3.59-2.35-6.02-2.35-3.62 0-6.71 2.04-8.21 5.01l3.11 2.41c.71-2.13 2.69-3.71 5.1-3.71z" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <Quote className="absolute -top-1 -left-1 h-6 w-6 text-primary/5 -z-1" />
                    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-3 font-medium whitespace-normal">
                      &quot;{review.text}&quot;
                    </p>
                  </div>
              </Card>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Gradient Fades for Marquee */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
    </section>
  )
}

export default TestimonialSection
