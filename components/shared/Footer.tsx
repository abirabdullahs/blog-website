import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t-2 border-black bg-[#FDFCFB] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <h2 className="text-3xl font-bold tracking-tighter italic font-serif mb-4">Chronicle</h2>
            <p className="text-xs leading-relaxed max-w-sm opacity-60 font-medium">
              A deep dive into building highly scalable, production-ready systems and the art of digital editorial design. Built with Next.js, Firestore, and Tiptap.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-[0.65rem] font-black uppercase tracking-widest border-b border-black pb-2">Sections</h3>
            <ul className="text-[0.65rem] font-bold uppercase tracking-widest space-y-2 opacity-70">
              <li><Link href="/categories" className="hover:opacity-100 transition-opacity">Categories</Link></li>
              <li><Link href="/tags" className="hover:opacity-100 transition-opacity">Tags</Link></li>
              <li><Link href="/archive" className="hover:opacity-100 transition-opacity">Archive</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-[0.65rem] font-black uppercase tracking-widest border-b border-black pb-2">Contact</h3>
            <ul className="text-[0.65rem] font-bold uppercase tracking-widest space-y-2 opacity-70">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Twitter</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">GitHub</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[0.6rem] uppercase tracking-[0.2em] font-bold opacity-40">
          <div>© {new Date().getFullYear()} Chronicle Media Group</div>
          <div>Designed in London / Built with Next.js</div>
        </div>
      </div>
    </footer>
  );
}
