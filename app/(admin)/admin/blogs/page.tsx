'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, MoreVertical, Loader2 } from 'lucide-react';
import { getBlogs } from '@/lib/firebase/blogs';
import { Blog } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-black pb-8">
        <div>
          <span className="text-[0.65rem] uppercase tracking-[0.4em] font-bold text-gray-400 mb-2 block">Content Inventory</span>
          <h1 className="text-5xl font-bold tracking-tighter italic font-serif">Articles</h1>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH CATALOGUE" 
              className="pl-10 pr-4 py-3 bg-white border border-black/10 text-xs font-bold uppercase tracking-widest outline-none focus:border-black transition-colors w-64"
            />
          </div>
          <Link 
            href="/admin/blogs/new" 
            className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all"
          >
            <Plus size={16} />
            Write New
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin opacity-20" size={40} />
          <span className="text-[0.6rem] uppercase tracking-widest font-bold opacity-40">Accessing Archives...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-black text-[0.65rem] uppercase tracking-widest font-black text-left">
                <th className="pb-4 pr-4">Article Details</th>
                <th className="pb-4 px-4">Category</th>
                <th className="pb-4 px-4">Status</th>
                <th className="pb-4 px-4">Date</th>
                <th className="pb-4 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <span className="text-[0.7rem] uppercase tracking-widest opacity-30 font-bold italic">No manuscripts found in library</span>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="group hover:bg-black/5 transition-colors">
                    <td className="py-6 pr-4">
                      <div className="flex flex-col">
                        <Link href={`/admin/blogs/edit/${blog.id}`} className="text-sm font-bold font-serif group-hover:underline underline-offset-4 decoration-black/20">{blog.title}</Link>
                        <span className="text-[0.65rem] uppercase opacity-40 mt-1">By {blog.author}</span>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <span className="text-[0.65rem] uppercase font-bold tracking-wider">{blog.categoryName}</span>
                    </td>
                    <td className="py-6 px-4">
                      <span className={cn(
                        "text-[0.6rem] px-2 py-0.5 rounded-full uppercase font-black tracking-tighter",
                        blog.status === 'Published' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      )}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="py-6 px-4 text-[0.65rem] uppercase opacity-60">
                      {blog.createdAt?.seconds ? format(new Date(blog.createdAt.seconds * 1000), 'MMM dd, yyyy') : 'Recently'}
                    </td>
                    <td className="py-6 pl-4 text-right">
                      <button className="p-2 hover:bg-black/10 transition-colors rounded-full">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
