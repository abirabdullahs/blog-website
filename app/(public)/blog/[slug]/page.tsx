import { getBlogBySlug } from '@/lib/db/blog-service';
import { constructMetadata } from '@/lib/seo';
import BlogContent from '@/components/public/BlogContent';
import JsonLd from '@/components/public/JsonLd';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return constructMetadata({
      title: 'Not Found',
      noIndex: true,
    });
  }

  return constructMetadata({
    title: blog.title,
    description: blog.excerpt,
    image: blog.featuredImage,
  });
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog || blog.status !== 'Published') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-40 text-center flex flex-col items-center gap-6">
        <h2 className="text-6xl font-bold font-serif italic tracking-tighter opacity-10">404 — Not Found</h2>
        <p className="text-[0.65rem] uppercase tracking-widest font-bold opacity-30 max-w-xs leading-relaxed">
          The requested dispatch does not exist in our archives.
        </p>
        <Link href="/" className="px-6 py-3 border border-black text-[0.6rem] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <JsonLd blog={blog} />
      <BlogContent blog={blog} />
    </>
  );
}
