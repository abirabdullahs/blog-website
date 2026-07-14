'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import BlogForm from '@/components/admin/BlogForm';
import { getBlogById } from '@/lib/db/blog-service';
import { Blog } from '@/types';

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  const blogId = params?.id;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchBlog() {
      if (!blogId) return;
      setLoading(true);
      try {
        const data = await getBlogById(blogId);
        if (!data) {
          setNotFound(true);
        } else {
          setBlog(data);
        }
      } catch (err) {
        console.error('Failed to fetch blog:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [blogId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="animate-spin opacity-20" size={40} />
        <span className="text-[0.6rem] uppercase tracking-widest font-bold opacity-40">Retrieving Manuscript...</span>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 border-2 border-dashed border-black/10">
        <span className="text-sm font-bold font-serif italic opacity-60">Article not found.</span>
      </div>
    );
  }

  return <BlogForm mode="edit" blogId={blog.id} initialBlog={blog} />;
}
