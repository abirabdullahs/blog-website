import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '@/types';
import { format } from 'date-fns';

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

export default function BlogCard({ blog, featured = false }: BlogCardProps) {
  const date = blog.publishedAt?.seconds 
    ? new Date(blog.publishedAt.seconds * 1000) 
    : blog.createdAt?.seconds 
      ? new Date(blog.createdAt.seconds * 1000) 
      : new Date();

  if (featured) {
    return (
      <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-b-2 border-black pb-12 mb-12">
        <div className="lg:col-span-8">
          <Link href={`/blog/${blog.slug}`} className="block group overflow-hidden bg-gray-100 aspect-[16/9] relative">
            <Image 
              src={blog.featuredImage || 'https://picsum.photos/seed/blog/800/450'}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </Link>
        </div>
        <div className="lg:col-span-4 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[0.6rem] uppercase tracking-widest font-black px-2 py-0.5 border border-black">{blog.categoryName || 'General'}</span>
            <span className="text-[0.6rem] uppercase tracking-widest font-bold opacity-40">{blog.readingTime} Min Read</span>
          </div>
          <Link href={`/blog/${blog.slug}`} className="group">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif italic tracking-tighter leading-[0.9] mb-6 group-hover:underline underline-offset-4 decoration-black/10">
              {blog.title}
            </h2>
          </Link>
          <p className="text-sm leading-relaxed opacity-70 mb-8 italic font-serif">
            {blog.excerpt}
          </p>
          <div className="mt-auto flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-black/10" />
            <a 
              href="https://abirabdullah.me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[0.65rem] uppercase font-bold tracking-widest hover:underline underline-offset-4 decoration-black/20"
            >
              By Abir Abdullah
            </a>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col group">
      <Link href={`/blog/${blog.slug}`} className="block overflow-hidden bg-gray-100 aspect-video relative mb-4">
        <Image 
          src={blog.featuredImage || 'https://picsum.photos/seed/blog/400/225'}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </Link>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[0.55rem] uppercase tracking-widest font-black opacity-40">{blog.categoryName || 'General'}</span>
        <div className="w-1 h-1 bg-black/10 rounded-full" />
        <span className="text-[0.55rem] uppercase tracking-widest font-bold opacity-40">{format(date, 'MMM dd, yyyy')}</span>
      </div>
      <Link href={`/blog/${blog.slug}`} className="group-hover:underline underline-offset-4 decoration-black/10">
        <h3 className="text-lg font-bold font-serif leading-tight mb-3">
          {blog.title}
        </h3>
      </Link>
      <p className="text-xs leading-relaxed opacity-60 line-clamp-2 mb-4">
        {blog.excerpt}
      </p>
      <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
        <a 
          href="https://abirabdullah.me" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[0.6rem] uppercase font-bold tracking-widest opacity-80 hover:opacity-100 hover:underline underline-offset-4 decoration-black/20"
        >
          By Abir Abdullah
        </a>
        <span className="text-[0.6rem] uppercase font-bold tracking-widest opacity-30">{blog.readingTime}m</span>
      </div>
    </article>
  );
}
