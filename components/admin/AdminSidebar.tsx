'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Tags, 
  Settings, 
  FolderOpen,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Blogs', href: '/admin/blogs', icon: FileText },
  { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Tags', href: '/admin/tags', icon: Tags },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-black/10 flex flex-col transition-transform lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 border-b border-black/10">
          <div className="flex flex-col">
            <span className="text-[0.6rem] uppercase tracking-[0.3em] font-bold text-gray-400 mb-1">Journal System</span>
            <h1 className="text-2xl font-bold tracking-tighter italic font-serif">Chronicle<span className="not-italic text-[0.6rem] ml-1 uppercase font-mono bg-black text-white px-1.5 py-0.5">Admin</span></h1>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all",
                  isActive 
                    ? "bg-black text-white" 
                    : "hover:bg-black/5 text-[#1A1A1A]"
                )}
              >
                <item.icon size={16} strokeWidth={2.5} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-black/10">
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={16} strokeWidth={2.5} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
