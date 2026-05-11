import { createClient } from "@/lib/supabase/server"
import Link from 'next/link';
import { Metadata } from 'next';
import { GraduationCap, ArrowRight, Clock, Tag } from 'lucide-react';
import { Badge } from "@/components/ui/badge"


export const metadata: Metadata = {
  title: 'Admission Blog | Expert Insights by Apna Counsellor',
  description: 'Latest news, tips, and strategy for JEE, NEET, MHT-CET and other entrance exams in India. Stay updated with Apna Counsellor.',
  openGraph: {
    title: 'Apna Counsellor Blog - Expert Admission Guides',
    description: 'Get the latest insights on JEE, NEET, and MHT-CET admissions.',
    images: ['/images/real-site-preview.png']
  }
};

export default async function BlogListingPage() {
  const supabase = createClient()
  
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const categories = Array.from(new Set(blogs?.map(b => b.category) || []));

  return (
    <main className="min-h-screen bg-slate-50/30">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-100 pt-32 pb-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-sm border border-purple-100">
                <GraduationCap className="h-4 w-4" /> Knowledge Hub
              </span>
              <h1 className="text-5xl md:text-8xl font-black text-slate-950 leading-[0.9] tracking-tighter">
                Admission <span className="text-purple-600">Insights.</span>
              </h1>
              <p className="text-xl text-slate-500 mt-8 font-medium leading-relaxed">
                Expert guides, strategy, and news for your admission journey. Stay ahead in JEE, NEET, and MHT-CET.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 md:justify-end">
              <button className="px-8 py-3 bg-purple-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-purple-100">All Posts</button>
              {categories.map(cat => (
                <button key={cat} className="px-8 py-3 bg-white text-slate-500 border border-slate-100 rounded-2xl text-sm font-bold hover:border-purple-600 hover:text-purple-600 transition-all shadow-sm">
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-50/50 to-transparent pointer-events-none" />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        {!blogs || blogs.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <BookOpen className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Expert articles are on the way.</h2>
            <p className="text-slate-500 mt-4 max-w-sm mx-auto font-medium">We're curating the best admission strategies for you. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => (
              <article 
                key={blog.slug} 
                className={`group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-500 flex flex-col ${idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                <Link href={`/blog/${blog.slug}`} className="block relative overflow-hidden">
                  <div className={`${idx === 0 ? 'h-80' : 'h-56'} w-full bg-slate-100 relative`}>
                    {blog.featured_image ? (
                      <img 
                        src={blog.featured_image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-slate-100">
                        <Tag className="h-12 w-12 text-purple-200" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-white/90 backdrop-blur-md text-purple-600 border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-xl shadow-sm">
                        {blog.category}
                      </Badge>
                    </div>
                  </div>
                </Link>
                <div className="p-10 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {blog.read_time_minutes || 5} Min Read</span>
                    <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                    <span>{new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <Link href={`/blog/${blog.slug}`}>
                    <h2 className={`font-black text-slate-900 group-hover:text-purple-600 transition-colors leading-tight mb-6 ${idx === 0 ? 'text-4xl' : 'text-2xl'}`}>
                      {blog.title}
                    </h2>
                  </Link>
                  <p className="text-slate-500 text-lg line-clamp-3 leading-relaxed mb-8 font-medium">
                    {blog.excerpt || "Expert admission insights and strategies for your college journey."}
                  </p>
                  <div className="mt-auto pt-8 border-t border-slate-50">
                    <Link href={`/blog/${blog.slug}`} className="inline-flex items-center gap-3 text-purple-600 font-black text-sm uppercase tracking-widest group/link">
                      Explore Article
                      <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Newsletter Call to Action */}
        <section className="mt-40">
          <div className="bg-slate-950 rounded-[4rem] p-12 md:p-24 text-white flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full -mt-48 -mr-48 animate-pulse"></div>
            <div className="flex-1 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">Stay ahead of the <span className="text-purple-500">curve.</span></h2>
              <p className="text-xl text-slate-400 max-w-xl font-medium leading-relaxed">
                Join 10,000+ students receiving weekly admission alerts, strategy guides, and exclusive cutoff data.
              </p>
            </div>
            <div className="w-full md:w-auto relative z-10">
              <div className="bg-white/5 backdrop-blur-2xl p-3 rounded-[2.5rem] flex flex-col sm:flex-row border border-white/10 shadow-2xl">
                <input 
                  type="email" 
                  placeholder="Your personal email" 
                  className="bg-transparent border-none focus:ring-0 px-8 py-4 text-white placeholder:text-slate-500 w-full md:w-80 font-bold"
                />
                <button className="bg-purple-600 text-white px-10 py-4 rounded-3xl font-black hover:bg-purple-700 transition-all shadow-xl shadow-purple-900/20">
                  Join Newsletter
                </button>
              </div>
              <p className="text-center md:text-left text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-6">No spam. Only high-quality insights. Unsubscribe anytime.</p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function BookOpen({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}
