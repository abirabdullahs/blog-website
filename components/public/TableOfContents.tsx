'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h2, h3'));
    
    const items: TOCItem[] = headings.map((heading, index) => {
      const text = heading.textContent || '';
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + index;
      return { id, text, level: parseInt(heading.tagName.substring(1)) };
    });
    
    setToc(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0% 0% -80% 0%' }
    );

    const headingElements = document.querySelectorAll('h2, h3');
    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav className="space-y-6 sticky top-32">
      <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] border-b border-black pb-2">Table of Contents</h3>
      <ul className="space-y-3">
        {toc.map((item) => (
          <li 
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2)}rem` }}
          >
            <a 
              href={`#${item.id}`}
              className={cn(
                "text-[0.65rem] uppercase font-bold tracking-widest transition-all hover:italic",
                activeId === item.id ? "opacity-100 italic underline" : "opacity-40"
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
