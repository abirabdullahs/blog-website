'use client';

import { useState, useEffect } from 'react';
import { Heart, Share2, Bookmark, Check, Copy } from 'lucide-react';
import { incrementLikes } from '@/lib/firebase/blog-interactions';
import { cn } from '@/lib/utils';

interface UserInteractionsProps {
  blogId: string;
  blogSlug: string;
  blogTitle: string;
  initialLikes: number;
}

export default function UserInteractions({ blogId, blogSlug, blogTitle, initialLikes }: UserInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.some((b: any) => b.slug === blogSlug));
    
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    setIsLiked(likedPosts.includes(blogId));
  }, [blogId, blogSlug]);

  const handleLike = async () => {
    if (isLiked) return;
    try {
      await incrementLikes(blogId);
      setLikes(prev => prev + 1);
      setIsLiked(true);
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      localStorage.setItem('likedPosts', JSON.stringify([...likedPosts, blogId]));
    } catch (error) {
      console.error('Error liking:', error);
    }
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (isBookmarked) {
      const updated = bookmarks.filter((b: any) => b.slug !== blogSlug);
      localStorage.setItem('bookmarks', JSON.stringify(updated));
      setIsBookmarked(false);
    } else {
      const updated = [...bookmarks, { slug: blogSlug, title: blogTitle }];
      localStorage.setItem('bookmarks', JSON.stringify(updated));
      setIsBookmarked(true);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: blogTitle, url });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-6 py-8 border-y border-black/10">
      <button 
        onClick={handleLike}
        className={cn(
          "flex items-center gap-2 group transition-all",
          isLiked ? "text-red-600" : "hover:text-red-600"
        )}
      >
        <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
        <span className="text-[0.65rem] font-bold uppercase tracking-widest">{likes} Likes</span>
      </button>

      <button 
        onClick={handleShare}
        className="flex items-center gap-2 hover:opacity-60 transition-opacity"
      >
        {copied ? <Check size={20} className="text-green-600" /> : <Share2 size={20} />}
        <span className="text-[0.65rem] font-bold uppercase tracking-widest">Share Article</span>
      </button>

      <button 
        onClick={handleBookmark}
        className={cn(
          "flex items-center gap-2 group transition-all",
          isBookmarked ? "text-black" : "opacity-40 hover:opacity-100"
        )}
      >
        <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
        <span className="text-[0.65rem] font-bold uppercase tracking-widest">
          {isBookmarked ? 'Saved' : 'Save for Later'}
        </span>
      </button>
    </div>
  );
}
