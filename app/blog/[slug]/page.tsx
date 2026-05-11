import { createClient } from "@/lib/supabase/server"
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, ChevronRight } from 'lucide-react';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"


interface BlogPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata | undefined> {
  const supabase = createClient()
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!blog) return;

  const title = blog.title;
  const description = blog.excerpt || blog.seo_description || `Read the latest insights on ${blog.title} at Apna Counsellor.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: blog.created_at,
      images: blog.featured_image ? [blog.featured_image] : ['/images/blog-preview-v1.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: blog.featured_image ? [blog.featured_image] : ['/images/blog-preview-v1.png'],
    }
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const supabase = createClient()
  const { data: blog } = await supabase
    .from('blogs')
    .select('*, author:profiles(name, image)')
    .eq('slug', params.slug)
    .single()

  if (!blog) notFound();

  return (
    <main className="min-h-screen bg-white">
      {/* Article Header */}
      <header className="pt-32 pb-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-purple-600 transition-colors mb-12 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Knowledge Hub
          </Link>
          
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-1.5 bg-purple-100 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                {blog.category}
              </span>
              {blog.tags?.map((tag: string) => (
                <span key={tag} className="px-4 py-1.5 bg-white text-slate-500 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-950 leading-[1.05] tracking-tighter">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-slate-200/60">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center overflow-hidden">
                    {blog.author?.image ? (
                      <img src={blog.author.image} alt={blog.author.name} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-purple-600" />
                    )}
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Written by</p>
                    <p className="font-black text-slate-900">{blog.author?.name || 'Apna Counsellor Expert'}</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-8 h-12 border-l border-slate-200 pl-8">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Published</p>
                    <p className="font-bold text-slate-900 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-purple-600" /> {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reading Time</p>
                    <p className="font-bold text-slate-900 flex items-center gap-1.5"><Clock className="h-4 w-4 text-purple-600" /> {blog.read_time_minutes || 5} Min Read</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {blog.featured_image && (
        <section className="max-w-6xl mx-auto px-4 -mt-10 mb-20 relative z-20">
          <div className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl shadow-purple-500/10 border-4 border-white">
            <img src={blog.featured_image} alt={blog.title} className="h-full w-full object-cover" />
          </div>
        </section>
      )}

      {/* Article Content */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-16 py-12">
        
        {/* Left Sidebar - Social Sharing */}
        <aside className="lg:col-span-1 hidden lg:flex flex-col gap-4 sticky top-32 h-fit">
           <p className="text-[10px] font-black text-slate-400 uppercase vertical-text mb-4">Share Story</p>
           <button className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center"><Facebook className="h-5 w-5" /></button>
           <button className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center"><Twitter className="h-5 w-5" /></button>
           <button className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center"><Linkedin className="h-5 w-5" /></button>
           <button className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center"><Share2 className="h-5 w-5" /></button>
        </aside>

        {/* Content Body */}
        <div className="lg:col-span-8">
          <div className="prose prose-slate prose-xl max-w-none 
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900
            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
            prose-strong:text-slate-900 prose-strong:font-black
            prose-img:rounded-[2.5rem] prose-img:shadow-xl
            prose-a:text-purple-600 prose-a:font-black prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-purple-600 prose-blockquote:bg-purple-50/50 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:italic prose-blockquote:text-slate-700
          ">
            {/* The content can be HTML/Markdown stored in Supabase */}
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
          
          <div className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between">
             <div className="flex gap-2">
                {blog.tags?.map((tag: string) => (
                  <span key={tag} className="text-xs font-bold text-slate-400">#{tag}</span>
                ))}
             </div>
             <button className="flex items-center gap-2 font-black text-xs uppercase text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-2xl transition-all">
                <Share2 className="h-4 w-4" /> Share Article
             </button>
          </div>
        </div>

        {/* Right Sidebar - Call to Action */}
        <aside className="lg:col-span-3 space-y-8">
           <Card className="rounded-[2.5rem] bg-slate-950 text-white p-10 border-none shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/30 blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-4 leading-tight tracking-tight">Confused about admissions?</h3>
                <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">Talk to our senior consultants who have successfully guided 50,000+ students.</p>
                <Link href="/book-call">
                   <Button className="w-full rounded-2xl h-14 font-black bg-purple-600 text-white shadow-xl shadow-purple-900/40 hover:bg-purple-700 active:scale-95 transition-all">
                      Book Expert Call
                   </Button>
                </Link>
              </div>
           </Card>

           <Card className="rounded-[2.5rem] bg-white border border-slate-100 p-10 shadow-sm">
              <h4 className="text-xl font-black mb-6">Trending Guides</h4>
              <div className="space-y-6">
                 {[1, 2, 3].map(i => (
                    <Link key={i} href="#" className="flex gap-4 group">
                       <div className="h-14 w-14 rounded-2xl bg-slate-50 flex-shrink-0 flex items-center justify-center font-black text-slate-300 text-lg group-hover:bg-purple-50 group-hover:text-purple-600 transition-all">{i}</div>
                       <p className="font-bold text-slate-700 leading-snug group-hover:text-purple-600 transition-all">Top NITs with Low Rank cutoffs in 2025</p>
                    </Link>
                 ))}
              </div>
           </Card>
        </aside>
      </div>

      {/* Footer Related Content */}
      <section className="bg-slate-50 py-24">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
               <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900">More Insights.</h2>
                  <p className="text-slate-500 font-medium mt-2">Hand-picked for your admission strategy.</p>
               </div>
               <Link href="/blog" className="font-black text-purple-600 flex items-center gap-2 group">
                  Knowledge Hub <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
            
            {/* Minimal related cards placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-slate-300 font-black uppercase text-xs tracking-widest italic py-20 border-2 border-dashed border-slate-200 rounded-[3rem]">
               Dynamically loading related guides...
            </div>
         </div>
      </section>
    </main>
  );
}
