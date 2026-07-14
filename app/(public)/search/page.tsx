'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchBlogs } from '@/lib/db/blog-service';
import { Blog } from '@/types';
import BlogCard from '@/components/public/BlogCard';
import { Loader2, Search as SearchIcon } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    async function fetchResults() {
      setLoading(true);
      try {
        const results = await searchBlogs(query);
        setBlogs(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-20">
        <span className="text-[0.65rem] uppercase font-black tracking-[0.3em] opacity-30 mb-4 block">Search Results</span>
        <div className="flex items-center gap-6">
          <h1 className="text-6xl font-bold font-serif italic tracking-tighter leading-none">
            "{query}"
          </h1>
          <span className="text-2xl font-serif italic opacity-30">({blogs.length})</span>
        </div>
        <div className="h-0.5 w-full bg-black mt-12" />
      </header>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin opacity-20" size={48} />
          <span className="text-[0.6rem] uppercase tracking-[0.4em] font-bold opacity-40">Scanning the Archives...</span>
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : query ? (
        <div className="py-40 text-center border-2 border-dashed border-black/10">
          <p className="text-[0.65rem] uppercase font-bold tracking-widest opacity-30 italic">No matches found in our records.</p>
        </div>
      ) : (
        <div className="py-40 text-center">
           <SearchIcon size={48} className="mx-auto opacity-10 mb-6" />
           <p className="text-[0.65rem] uppercase font-bold tracking-widest opacity-30">Enter a query to begin searching.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
