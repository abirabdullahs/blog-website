'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Feather } from 'lucide-react';
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

    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-sm">
            <Feather size={18} />
          </div>

          <div className="leading-tight">
            <h1 className="text-lg font-semibold tracking-tight">
              Abir's
            </h1>
            <p className="text-xs text-gray-500">
              Blog
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-700 md:flex">
          <Link
            href="/"
            className="transition-colors hover:text-black"
          >
            Home
          </Link>

          <Link
            href="/categories"
            className="transition-colors hover:text-black"
          >
            Categories
          </Link>

          <Link
            href="/archive"
            className="transition-colors hover:text-black"
          >
            Archive
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            {isSearchOpen ? (
              <X size={20} />
            ) : (
              <Search size={20} />
            )}
          </button>

          <button
            className="rounded-lg p-2 transition hover:bg-gray-100 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <div
        className={cn(
          'absolute left-0 top-full w-full overflow-hidden border-b bg-white transition-all duration-300',
          isSearchOpen ? 'max-h-28 py-6' : 'max-h-0 py-0'
        )}
      >
        <form
          onSubmit={handleSearch}
          className="mx-auto max-w-5xl px-6"
        >
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <Search
              size={18}
              className="text-gray-400"
            />

            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search articles..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'absolute left-0 top-full w-full overflow-hidden border-b bg-white transition-all duration-300 md:hidden',
          isMenuOpen
            ? 'max-h-80 py-4'
            : 'max-h-0 py-0'
        )}
      >
        <nav className="flex flex-col gap-4 px-6 text-sm font-medium">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="transition hover:text-black"
          >
            Home
          </Link>

          <Link
            href="/categories"
            onClick={() => setIsMenuOpen(false)}
            className="transition hover:text-black"
          >
            Categories
          </Link>

          <Link
            href="/archive"
            onClick={() => setIsMenuOpen(false)}
            className="transition hover:text-black"
          >
            Archive
          </Link>
        </nav>
      </div>
    </header>
  );
}