import { getPublishedBlogs } from '@/lib/db/blog-service';
import { Blog } from '@/types';
import BlogCard from '@/components/public/BlogCard';
import Link from 'next/link';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TagArchivePage({ params }: Props) {
  const { slug } = await params;

  const tagName = decodeURIComponent(slug);
  const blogs = await getPublishedBlogs();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-20 text-center max-w-2xl mx-auto">
        <span className="text-[0.65rem] uppercase font-black tracking-[0.3em] opacity-30 mb-4 block">Tag Reference</span>
        <h1 className="text-6xl md:text-8xl font-bold font-serif italic tracking-tighter leading-none mb-6">
          #{tagName}
        </h1>
        <div className="h-0.5 w-12 bg-black mx-auto mb-6" />
        <p className="text-[0.7rem] uppercase font-bold tracking-widest opacity-60">
          Showing all dispatches tagged with {tagName}
        </p>
      </header>

      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="py-40 text-center border-2 border-dashed border-black/10">
          <p className="text-[0.65rem] uppercase font-bold tracking-widest opacity-30 italic">No manuscripts found for this specific tag.</p>
        </div>
      )}
    </div>
  );
}
