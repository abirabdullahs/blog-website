'use client';

import { useEffect, useState, use } from 'react';
import { getPublishedBlogs } from '@/lib/db/blog-service';
import { getCategoryBySlug } from '@/lib/db/category-service';
import { Blog, Category } from '@/types';
import BlogCard from '@/components/public/BlogCard';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CategoryArchivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const catData = await getCategoryBySlug(slug);
        if (catData) {
          setCategory(catData);
          const blogData = await getPublishedBlogs();
          setBlogs(blogData);
        }
      } catch (error) {
        console.error('Error fetching archive:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin opacity-20" size={48} />
        <span className="text-[0.6rem] uppercase tracking-[0.4em] font-bold opacity-40">Filtering Archives...</span>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-40 text-center flex flex-col items-center gap-6">
        <h2 className="text-6xl font-bold font-serif italic tracking-tighter opacity-10">Archive Not Found</h2>
        <Link href="/" className="px-6 py-3 border border-black text-[0.6rem] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-20 text-center max-w-2xl mx-auto">
        <span className="text-[0.65rem] uppercase font-black tracking-[0.3em] opacity-30 mb-4 block">Archive Section</span>
        <h1 className="text-6xl md:text-8xl font-bold font-serif italic tracking-tighter leading-none mb-6">
          {category.name}
        </h1>
        <div className="h-0.5 w-12 bg-black mx-auto mb-6" />
        <p className="text-[0.7rem] uppercase font-bold tracking-widest opacity-60">
          Showing all dispatches filed under {category.name}
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
          <p className="text-[0.65rem] uppercase font-bold tracking-widest opacity-30 italic">No manuscripts currently published in this section.</p>
        </div>
      )}
    </div>
  );
}
