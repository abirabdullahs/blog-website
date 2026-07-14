import { getPublishedBlogs } from '@/lib/db/blog-service';
import { Blog } from '@/types';
import BlogCard from '@/components/public/BlogCard';

export default async function HomePage() {
  const blogs = await getPublishedBlogs();
  const featuredBlog = blogs[0];
  const recentBlogs = blogs.slice(1);

  if (!featuredBlog) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-40 text-center flex flex-col items-center gap-6">
        <h2 className="text-6xl font-bold font-serif italic tracking-tighter opacity-10">The Journal is Empty</h2>
        <p className="text-[0.65rem] uppercase tracking-widest font-bold opacity-30 max-w-xs leading-relaxed">
          We are currently compiling our first edition. Please check back shortly for our inaugural dispatch.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Editorial Header Info */}
      <div className="flex justify-between items-end mb-12 border-b border-black/10 pb-4">
        <div className="flex flex-col">
          <span className="text-[0.6rem] uppercase tracking-widest font-bold opacity-30">Volume I — Edition 01</span>
          <span className="text-[0.6rem] uppercase tracking-widest font-bold">Monday, July 13, 2026</span>
        </div>
        <div className="text-right">
          <span className="text-[0.6rem] uppercase tracking-widest font-bold opacity-30">Global Edition</span>
        </div>
      </div>

      {featuredBlog ? (
        <>
          <BlogCard blog={featuredBlog} featured />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content: Recent Articles Grid */}
            <div className="lg:col-span-9">
              <h2 className="text-[0.7rem] uppercase font-black tracking-[0.3em] border-b border-black pb-2 mb-8">Recent Dispatches</h2>
              {recentBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
                  {recentBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center border border-dashed border-black/10">
                  <span className="text-[0.7rem] uppercase tracking-widest opacity-20 font-bold italic">More articles in preparation...</span>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-3 space-y-12">
              <div>
                <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] border-b border-black pb-2 mb-6">Taxonomy</h3>
                <div className="flex flex-wrap gap-2">
                  {['Programming', 'AI', 'Web Development', 'Career', 'Life', 'Islam'].map(cat => (
                    <span key={cat} className="text-[0.6rem] uppercase font-bold tracking-widest px-3 py-1 border border-black hover:bg-black hover:text-white transition-all cursor-pointer">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] border-b border-black pb-2 mb-6">Trending Tags</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {['Next.js', 'React', 'TypeScript', 'Tailwind', 'Firestore'].map(tag => (
                    <span key={tag} className="text-[0.6rem] uppercase font-bold tracking-widest opacity-40 hover:opacity-100 transition-opacity cursor-pointer underline underline-offset-4 decoration-black/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-2 border-black p-6 bg-white">
                <h4 className="text-[0.65rem] uppercase font-black tracking-widest mb-4">Newsletter</h4>
                <p className="text-[0.65rem] opacity-60 leading-relaxed mb-6 italic">Join our community of 12,000+ readers receiving weekly editorial dispatches.</p>
                <div className="flex border-b border-black">
                  <input 
                    type="email" 
                    placeholder="EMAIL ADDRESS" 
                    className="bg-transparent text-[0.6rem] py-2 flex-1 outline-none font-bold uppercase tracking-widest"
                  />
                  <button className="text-xs hover:translate-x-1 transition-transform">→</button>
                </div>
              </div>
            </aside>
          </div>
        </>
      ) : (
        <div className="py-40 text-center flex flex-col items-center gap-6">
          <h2 className="text-6xl font-bold font-serif italic tracking-tighter opacity-10">The Journal is Empty</h2>
          <p className="text-[0.65rem] uppercase tracking-widest font-bold opacity-30 max-w-xs leading-relaxed">
            We are currently compiling our first edition. Please check back shortly for our inaugural dispatch.
          </p>
        </div>
      )}
    </div>
  );
}
