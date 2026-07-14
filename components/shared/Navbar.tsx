'use client';

import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="border-b-2 border-black sticky top-0 bg-[#FDFCFB]/80 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex flex-col group">
            <span className="text-[0.6rem] uppercase tracking-[0.4em] font-bold text-gray-400 mb-0.5 group-hover:text-black transition-colors">The Next.js Journal</span>
            <h1 className="text-3xl font-bold tracking-tighter italic font-serif">Chronicle</h1>
          </Link>
          
          <nav className="hidden md:flex gap-8 text-[0.65rem] font-bold uppercase tracking-[0.2em]">
            <Link href="/" className="hover:line-through transition-all">Latest</Link>
            <Link href="/categories" className="hover:line-through transition-all">Categories</Link>
            <Link href="/archive" className="hover:line-through transition-all">Archive</Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 border-l border-black/10 pl-6 h-8">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            <span className="text-[0.6rem] font-bold uppercase tracking-widest">Issue № 001</span>
          </div>
          
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-black/5 transition-colors"
          >
            {isSearchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
          
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <div className={cn(
        "absolute top-full left-0 w-full bg-[#FDFCFB] border-b-2 border-black overflow-hidden transition-all duration-300",
        isSearchOpen ? "max-h-24 py-6" : "max-h-0 py-0"
      )}>
        <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-6">
          <input 
            autoFocus
            type="text" 
            placeholder="TYPE YOUR QUERY AND PRESS ENTER..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-b border-black/10 text-xl font-serif italic py-2 outline-none placeholder:opacity-20"
          />
        </form>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "absolute top-full left-0 w-full bg-[#FDFCFB] border-b border-black overflow-hidden transition-all duration-300 md:hidden",
        isMenuOpen ? "max-h-64" : "max-h-0"
      )}>
        <nav className="flex flex-col p-6 gap-4 text-xs font-bold uppercase tracking-widest">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>Latest</Link>
          <Link href="/categories" onClick={() => setIsMenuOpen(false)}>Categories</Link>
          <Link href="/archive" onClick={() => setIsMenuOpen(false)}>Archive</Link>
        </nav>
      </div>
    </header>
  );
}
