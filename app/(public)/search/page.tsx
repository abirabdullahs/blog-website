import { searchBlogs } from '@/lib/db/blog-service';
import { Blog } from '@/types';
import BlogCard from '@/components/public/BlogCard';
import { Search as SearchIcon } from 'lucide-react';

type Props = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params?.q ?? '';

  // ✅ Missing lines (Error Fix)
  const blogs: Blog[] = query ? await searchBlogs(query) : [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-20">
        <span className="text-[0.65rem] uppercase font-black tracking-[0.3em] opacity-30 mb-4 block">
          Search Results
        </span>

        <div className="flex items-center gap-6">
          <h1 className="text-6xl font-bold font-serif italic tracking-tighter leading-none">
            {query}
          </h1>

          <span className="text-2xl font-serif italic opacity-30">
            ({blogs.length})
          </span>
        </div>

        <div className="h-0.5 w-full bg-black mt-12" />
      </header>

      {query ? (
        blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center border-2 border-dashed border-black/10">
            <p className="text-[0.65rem] uppercase font-bold tracking-widest opacity-30 italic">
              No matches found in our records.
            </p>
          </div>
        )
      ) : (
        <div className="py-40 text-center">
          <SearchIcon size={48} className="mx-auto opacity-10 mb-6" />

          <p className="text-[0.65rem] uppercase font-bold tracking-widest opacity-30">
            Enter a query to begin searching.
          </p>
        </div>
      )}
    </div>
  );
}