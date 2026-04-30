"use client"

import { motion } from "framer-motion"
import { 
  Search, 
  Calendar, 
  User, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function BlogPage() {
  const posts = [
    { 
      title: "Expected JoSAA 2025 Cutoffs for Top NITs", 
      excerpt: "Analyze the current trends and previous year patterns to predict where the cutoffs might land this year.",
      date: "May 12, 2024",
      author: "Rahul Sharma",
      category: "JoSAA",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60"
    },
    { 
      title: "MHT-CET 2025: Top Engineering Colleges in Pune", 
      excerpt: "Pune is the Oxford of the East. Explore the best engineering colleges and their placement stats.",
      date: "May 10, 2024",
      author: "Priya Patil",
      category: "MHT-CET",
      image: "https://images.unsplash.com/photo-1541339907198-e08759df9a73?w=800&auto=format&fit=crop&q=60"
    },
    { 
      title: "Career Guidance: CSE vs IT vs AI & ML", 
      excerpt: "Confused between different computer science branches? Here is a detailed comparison of curriculum and future scope.",
      date: "May 8, 2024",
      author: "Dr. K. Saxena",
      category: "Guidance",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60"
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <BookOpen className="h-4 w-4" /> Expert Insights & News
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
              Apna <span className="text-primary">Blog.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Latest news, expert advice, and data-driven insights for Indian students.
            </p>
          </div>
          <div className="relative w-full max-w-[400px]">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
             <Input placeholder="Search articles..." className="h-14 rounded-2xl pl-12 bg-white dark:bg-slate-900 border-none shadow-sm focus-visible:ring-primary" />
          </div>
        </div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Card className="border-none rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden group">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row h-full lg:min-h-[500px]">
                <div className="lg:w-1/2 relative overflow-hidden">
                   <img 
                    src={posts[0].image} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt="Featured Post" 
                   />
                   <div className="absolute top-8 left-8">
                      <Badge className="bg-primary text-white font-black px-4 py-1.5 rounded-xl uppercase text-[10px] tracking-widest border-none">Featured Article</Badge>
                   </div>
                </div>
                <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {posts[0].date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {posts[0].author}</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6 group-hover:text-primary transition-colors">
                    {posts[0].title}
                  </h2>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">
                    {posts[0].excerpt}
                  </p>
                  <Button className="w-fit rounded-2xl h-14 px-10 font-black shadow-xl shadow-primary/20 gap-3">
                    Read Article <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 group hover:shadow-2xl hover:shadow-primary/5 transition-all overflow-hidden flex flex-col">
                <div className="h-56 relative overflow-hidden">
                   <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={post.title} />
                   <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-primary font-black px-3 py-1 rounded-xl uppercase text-[9px] tracking-widest border-none">
                        {post.category}
                      </Badge>
                   </div>
                </div>
                <CardContent className="p-8 flex flex-col flex-1">
                   <div className="flex items-center gap-3 mb-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                     <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                     <span>•</span>
                     <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                   </div>
                   <h3 className="text-xl font-black mb-4 group-hover:text-primary transition-colors leading-snug">
                     {post.title}
                   </h3>
                   <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 line-clamp-3">
                     {post.excerpt}
                   </p>
                   <div className="mt-auto">
                      <Button variant="ghost" className="p-0 font-black text-xs text-primary gap-2 hover:bg-transparent group-hover:translate-x-1 transition-transform">
                        Read Story <ArrowRight className="h-4 w-4" />
                      </Button>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}
