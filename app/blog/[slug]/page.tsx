import { allBlogs } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { useMDXComponent } from 'next-contentlayer/hooks';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { format, parseISO } from 'date-fns';
import { Metadata } from 'next';

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return allBlogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata | undefined> {
  const blog = allBlogs.find((b) => b.slug === params.slug);
  if (!blog) return;

  return {
    title: `${blog.title} | Apna Counsellor`,
    description: blog.description,
    keywords: blog.keywords,
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: 'article',
      publishedTime: blog.date,
      authors: [blog.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
    },
  };
}

export default function BlogPostPage({ params }: BlogPageProps) {
  const blog = allBlogs.find((b) => b.slug === params.slug);

  if (!blog) notFound();

  const MDXContent = useMDXComponent(blog.body.code);

  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-12 text-center">
        <div className="flex justify-center gap-3 mb-6">
          {blog.tags.map(tag => (
            <span key={tag} className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">
          {blog.title}
        </h1>
        <div className="flex items-center justify-center gap-6 text-slate-500 font-medium">
          <span>By {blog.author}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          <time dateTime={blog.date}>
            {format(parseISO(blog.date), 'MMMM dd, yyyy')}
          </time>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          <span>{blog.readingTime} read</span>
        </div>
      </header>

      <div className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-img:rounded-3xl shadow-sm bg-white p-8 md:p-12 rounded-3xl border border-slate-100 mb-16">
        <MDXContent />
      </div>

      <footer className="mt-20">
        <div className="bg-slate-900 text-white p-10 rounded-3xl mb-16">
          <h2 className="text-3xl font-bold mb-4">Need Expert Counseling?</h2>
          <p className="text-slate-300 text-lg mb-8">
            Our experts at Apna Counsellor have helped thousands of students secure seats in top-tier colleges. Don't leave your career to chance.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-all"
          >
            Get Free Professional Guidance
          </a>
        </div>

        <RelatedLinks pageSlug={blog.category.toLowerCase()} />
      </footer>
    </article>
  );
}
