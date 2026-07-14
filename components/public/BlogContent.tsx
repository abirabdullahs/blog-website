'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { incrementViews } from '@/lib/firebase/blog-interactions';
import { Blog } from '@/types';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ReadingProgressBar from '@/components/public/ReadingProgressBar';
import TableOfContents from '@/components/public/TableOfContents';
import UserInteractions from '@/components/public/UserInteractions';
import CommentSection from '@/components/public/CommentSection';

export default function BlogContent({ blog }: { blog: Blog }) {
  useEffect(() => {
    if (blog.id) {
      incrementViews(blog.id);
    }
  }, [blog.id]);

  const date = blog.publishedAt?.seconds 
    ? new Date(blog.publishedAt.seconds * 1000) 
    : new Date();

  return (
    <article className="relative">
      <ReadingProgressBar />
      
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-[0.6rem] uppercase font-bold tracking-widest opacity-40 hover:opacity-100 hover:italic transition-all mb-12">
          <ArrowLeft size={14} /> Back to Edition
        </Link>

        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[0.65rem] uppercase tracking-widest font-black px-3 py-1 border border-black bg-black text-white">{blog.categoryName || 'General'}</span>
            <span className="text-[0.65rem] uppercase tracking-widest font-bold opacity-40">{format(date, 'MMMM dd, yyyy')}</span>
            <span className="text-[0.65rem] uppercase tracking-widest font-bold opacity-40 underline decoration-black/10 underline-offset-4">{blog.readingTime} Min Read</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-serif italic tracking-tighter leading-[0.85] mb-10">
            {blog.title}
          </h1>
          
          <p className="text-lg md:text-xl leading-relaxed opacity-70 italic font-serif max-w-2xl">
            {blog.excerpt}
          </p>

          <div className="mt-12 flex items-center gap-4">
            <div className="h-[1px] w-12 bg-black/10" />
            <a 
              href="https://abirabdullah.me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[0.65rem] uppercase font-bold tracking-[0.2em] hover:italic transition-all"
            >
              By Abir Abdullah
            </a>
            <div className="h-[1px] w-12 bg-black/10" />
          </div>
        </div>

        <div className="aspect-[21/9] bg-gray-100 relative overflow-hidden">
          <Image 
            src={blog.featuredImage || 'https://picsum.photos/seed/detail/1600/900'}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 pb-32">
        <div className="hidden lg:block lg:col-span-2">
          <TableOfContents content={blog.content} />
        </div>

        <div className="lg:col-span-7">
          <div 
            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:italic prose-headings:tracking-tighter prose-headings:font-bold prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:border-l-4 prose-blockquote:border-black prose-img:border-2 prose-img:border-black/5 prose-a:text-black prose-a:font-bold prose-a:underline prose-a:underline-offset-4 prose-a:decoration-black/10 hover:prose-a:decoration-black"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div className="mt-20">
            <UserInteractions 
              blogId={blog.id!} 
              blogSlug={blog.slug} 
              blogTitle={blog.title} 
              initialLikes={blog.counters?.likes || 0} 
            />
          </div>

          <div className="mt-20">
            <CommentSection blogId={blog.id!} />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-12">
          <div className="border-2 border-black p-8 bg-white">
            <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] border-b border-black pb-2 mb-6">Archive Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map(tag => (
                <span key={tag} className="text-[0.6rem] uppercase font-bold tracking-widest opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="sticky top-32">
             <div className="flex flex-col gap-4">
                <span className="text-[0.65rem] uppercase font-bold tracking-[0.4em] opacity-30">Share Dispatch</span>
                <div className="flex gap-4">
                  <div className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer">X</div>
                  <div className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer">LN</div>
                  <div className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer">FB</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </article>
  );
}
