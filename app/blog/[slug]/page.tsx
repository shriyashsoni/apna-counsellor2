import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';

interface BlogPageProps {
  params: {
    slug: string;
  };
}

// Empty record - real data should be fetched from DB
const STATIC_BLOGS: Record<string, {
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  readingTime: string;
  content: string;
}> = {};

export async function generateStaticParams() {
  return Object.keys(STATIC_BLOGS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata | undefined> {
  const blog = STATIC_BLOGS[params.slug];
  if (!blog) return;

  return {
    title: `${blog.title} | Apna Counsellor`,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: 'article',
      publishedTime: blog.date,
      authors: [blog.author],
    },
  };
}

export default function BlogPostPage({ params }: BlogPageProps) {
  const blog = STATIC_BLOGS[params.slug];

  if (!blog) notFound();

  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-12 text-center">
        <div className="flex justify-center gap-3 mb-6">
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1 rounded-full">
            #{blog.category}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">
          {blog.title}
        </h1>
        <div className="flex items-center justify-center gap-6 text-slate-500 font-medium">
          <span>By {blog.author}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          <time dateTime={blog.date}>{blog.date}</time>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          <span>{blog.readingTime} read</span>
        </div>
      </header>

      <div className="prose prose-slate prose-lg max-w-none shadow-sm bg-white p-8 md:p-12 rounded-3xl border border-slate-100 mb-16">
        <p>{blog.content}</p>
      </div>

      <footer className="mt-20">
        <div className="bg-slate-900 text-white p-10 rounded-3xl mb-16">
          <h2 className="text-3xl font-bold mb-4">Need Expert Counseling?</h2>
          <p className="text-slate-300 text-lg mb-8">
            Our experts at Apna Counsellor have helped thousands of students secure seats in top-tier colleges.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-all"
          >
            Get Free Professional Guidance
          </Link>
        </div>

        <RelatedLinks pageSlug={blog.category.toLowerCase()} />
      </footer>
    </article>
  );
}
