'use client';

import { useEffect, useState, use } from 'react';
import { getPublishedBlogs } from '@/lib/firebase/blogs';
import { Blog } from '@/types';
import BlogCard from '@/components/public/BlogCard';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function TagArchivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Tags are stored as strings in our model
  const tagName = decodeURIComponent(slug);

  useEffect(() => {
    async function fetchData() {
      try {
        const blogData = await getPublishedBlogs(undefined, tagName);
        setBlogs(blogData);
      } catch (error) {
        console.error('Error fetching archive:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [tagName]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin opacity-20" size={48} />
        <span className="text-[0.6rem] uppercase tracking-[0.4em] font-bold opacity-40">Cross-referencing Tags...</span>
      </div>
    );
  }

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
