import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admission Blog | Expert Insights by Apna Counsellor',
  description: 'Latest news, tips, and strategy for JEE, NEET, MHT-CET and other entrance exams in India. Stay updated with Apna Counsellor.',
};

// Static fallback blogs shown before AI-generated content is available
const STATIC_BLOGS = [
  {
    slug: 'josaa-2025-complete-guide',
    title: 'JoSAA 2025 Complete Counseling Guide',
    description: 'Everything you need to know about JoSAA 2025 counseling — round schedule, choice filling strategy, and seat allotment tips.',
    date: '2025-05-01',
    category: 'Engineering',
    readingTime: '8 min',
    url: '/blog/josaa-2025-complete-guide',
  },
  {
    slug: 'neet-2025-counseling-guide',
    title: 'NEET 2025 Counseling Process Explained',
    description: 'MCC All India Quota counseling, state quota counseling — a step-by-step breakdown for NEET 2025 aspirants.',
    date: '2025-04-28',
    category: 'Medical',
    readingTime: '6 min',
    url: '/blog/neet-2025-counseling-guide',
  },
  {
    slug: 'mht-cet-2025-cap-rounds',
    title: 'MHT CET 2025 CAP Round Strategy',
    description: 'How to fill choices in MHT CET 2025 CAP rounds. Which colleges to choose, which branches to prefer, and how to maximize your rank.',
    date: '2025-04-20',
    category: 'Maharashtra',
    readingTime: '5 min',
    url: '/blog/mht-cet-2025-cap-rounds',
  },
  {
    slug: 'choice-filling-strategy-josaa',
    title: 'JoSAA Choice Filling Strategy 2025',
    description: 'The ultimate guide to filling choices in JoSAA 2025 — how to sort your list, float vs freeze, and pick the right branch.',
    date: '2025-04-15',
    category: 'Strategy',
    readingTime: '7 min',
    url: '/blog/choice-filling-strategy-josaa',
  },
  {
    slug: 'college-predictor-how-to-use',
    title: 'How to Use a College Predictor Tool Effectively',
    description: 'A complete guide to using the Apna Counsellor college predictor for JEE, NEET, and state counseling rounds.',
    date: '2025-04-10',
    category: 'Tools',
    readingTime: '4 min',
    url: '/blog/college-predictor-how-to-use',
  },
  {
    slug: 'top-nits-2025',
    title: 'Top NITs in India 2025 — Rankings, Cutoffs & Fees',
    description: 'Detailed breakdown of the top 10 National Institutes of Technology in India for 2025, including NIRF rankings and placement data.',
    date: '2025-04-05',
    category: 'Colleges',
    readingTime: '10 min',
    url: '/blog/top-nits-2025',
  },
];

export default function BlogListingPage() {
  const blogs = STATIC_BLOGS;
  const categories = Array.from(new Set(blogs.map(b => b.category)));

  return (
    <main className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-2xl">
          <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-sm mb-4 block">Knowledge Hub</span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-none">
            Admission <span className="text-blue-600">Insights.</span>
          </h1>
          <p className="text-xl text-slate-500 mt-6">
            Expert guides and tips for your admission journey — JEE, NEET, MHT-CET and more.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button className="px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-bold">All Posts</button>
          {categories.map(cat => (
            <button key={cat} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-all">
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {blogs.map((blog, idx) => (
          <article 
            key={blog.slug} 
            className={`group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col ${idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
          >
            <div className={`relative ${idx === 0 ? 'h-64' : 'h-48'} w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute top-6 left-6 z-10">
                <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-black rounded-full uppercase tracking-widest shadow-sm">
                  {blog.category}
                </span>
              </div>
            </div>
            <div className="p-10 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-slate-400 text-sm font-bold mb-4 uppercase tracking-widest">
                  {blog.date} • {blog.readingTime} read
                </div>
                <Link href={blog.url}>
                  <h2 className={`font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-4 ${idx === 0 ? 'text-4xl' : 'text-2xl'}`}>
                    {blog.title}
                  </h2>
                </Link>
                <p className="text-slate-500 text-lg line-clamp-3 leading-relaxed mb-8">
                  {blog.description}
                </p>
              </div>
              <Link href={blog.url} className="inline-flex items-center gap-2 text-blue-600 font-black group/link">
                Read Full Post 
                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-32">
        <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mb-32 -mr-32"></div>
          <div className="flex-1 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Stay ahead of the curve.</h2>
            <p className="text-xl text-blue-100 max-w-xl">
              Subscribe to our newsletter to get admission alerts and expert strategy guides directly in your inbox.
            </p>
          </div>
          <div className="w-full md:w-auto relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-full flex border border-white/20">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent border-none focus:ring-0 px-6 py-3 text-white placeholder:text-white/50 w-full md:w-64"
              />
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-black hover:bg-blue-50 transition-all whitespace-nowrap">
                Join Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
