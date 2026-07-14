'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2, Save, Send, ChevronDown, X, Plus } from 'lucide-react';
import TiptapEditor from '@/components/admin/editor/TiptapEditor';
import { createBlog, updateBlog } from '@/lib/firebase/blogs';
import { getCategories } from '@/lib/firebase/categories';
import { getTags, createTag } from '@/lib/firebase/tags';
import { Blog, Category, Tag } from '@/types';
import { cn, slugify } from '@/lib/utils';

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

interface BlogFormProps {
  mode: 'create' | 'edit';
  blogId?: string;
  initialBlog?: Blog;
}

export default function BlogForm({ mode, blogId, initialBlog }: BlogFormProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loadingTaxonomy, setLoadingTaxonomy] = useState(true);
  const [newTagInput, setNewTagInput] = useState('');
  const [showSeo, setShowSeo] = useState(false);
  const [saving, setSaving] = useState<'draft' | 'publish' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');

  const [title, setTitle] = useState(initialBlog?.title ?? '');
  const [slug, setSlug] = useState(initialBlog?.slug ?? '');
  const [excerpt, setExcerpt] = useState(initialBlog?.excerpt ?? '');
  const [featuredImage, setFeaturedImage] = useState(initialBlog?.featuredImage ?? '');
  const [categoryId, setCategoryId] = useState(initialBlog?.categoryId ?? '');
  const [tags, setTags] = useState<string[]>(initialBlog?.tags ?? []);
  const [content, setContent] = useState(initialBlog?.content ?? '');
  const [author, setAuthor] = useState(initialBlog?.author ?? '');
  const [seoTitle, setSeoTitle] = useState(initialBlog?.metadata?.seoTitle ?? '');
  const [seoDescription, setSeoDescription] = useState(initialBlog?.metadata?.seoDescription ?? '');
  const [canonicalUrl, setCanonicalUrl] = useState(initialBlog?.metadata?.canonicalUrl ?? '');

  useEffect(() => {
    async function fetchTaxonomy() {
      setLoadingTaxonomy(true);
      try {
        const [cats, tgs] = await Promise.all([getCategories(), getTags()]);
        setCategories(cats);
        setAvailableTags(tgs);
      } catch (err) {
        console.error('Failed to load categories/tags:', err);
      } finally {
        setLoadingTaxonomy(false);
      }
    }
    fetchTaxonomy();
  }, []);

  function toggleTag(tagName: string) {
    setTags((prev) => (prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]));
  }

  async function handleAddNewTag(e: React.FormEvent) {
    e.preventDefault();
    const name = newTagInput.trim();
    if (!name) return;
    const slugValue = slugify(name);

    if (!tags.includes(name)) {
      setTags((prev) => [...prev, name]);
    }

    if (!availableTags.some((t) => t.slug === slugValue)) {
      try {
        await createTag({ name, slug: slugValue });
        const updated = await getTags();
        setAvailableTags(updated);
      } catch (err) {
        // Tag may already exist under a different casing; ignore silently.
        console.warn('Could not persist new tag:', err);
      }
    }

    setNewTagInput('');
  }

  async function handleSubmit(status: 'Draft' | 'Published') {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    setSaving(status === 'Published' ? 'publish' : 'draft');
    setError(null);

    try {
      const selectedCategory = categories.find((c) => c.id === categoryId);
      const finalSlug = slug.trim() || slugify(title);

      const payload: Partial<Blog> = {
        title: title.trim(),
        slug: finalSlug,
        content,
        excerpt: excerpt.trim(),
        featuredImage: featuredImage.trim(),
        categoryId,
        categoryName: selectedCategory?.name ?? '',
        tags,
        author: author.trim() || session?.user?.name || 'Admin',
        status,
        readingTime: estimateReadingTime(content),
        metadata: {
          seoTitle: seoTitle.trim() || title.trim(),
          seoDescription: seoDescription.trim() || excerpt.trim(),
          canonicalUrl: canonicalUrl.trim(),
        },
      };

      if (mode === 'create') {
        await createBlog(payload);
      } else if (blogId) {
        await updateBlog(blogId, payload);
      }

      router.push('/admin/blogs');
      router.refresh();
    } catch (err: any) {
      console.error('Failed to save blog:', err);
      setError(err?.message || 'Failed to save the article. Please try again.');
      setSaving(null);
    }
  }

  return (
    <div className="space-y-10 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-black pb-8">
        <div>
          <span className="text-[0.65rem] uppercase tracking-[0.4em] font-bold text-gray-400 mb-2 block">
            {mode === 'create' ? 'New Manuscript' : 'Revise Manuscript'}
          </span>
          <h1 className="text-5xl font-bold tracking-tighter italic font-serif">
            {mode === 'create' ? 'Write New' : 'Edit Article'}
          </h1>
        </div>
      </header>

      {error && (
        <div className="border-2 border-red-600 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-widest px-6 py-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[0.6rem] uppercase font-black tracking-widest opacity-50">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="Article title"
              className="px-4 py-4 bg-white border border-black/10 text-2xl font-serif font-bold outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[0.6rem] uppercase font-black tracking-widest opacity-50">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugTouched(true);
              }}
              placeholder="article-title"
              className="px-4 py-3 bg-white border border-black/10 text-sm font-mono outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[0.6rem] uppercase font-black tracking-widest opacity-50">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short summary shown on listing cards"
              rows={3}
              className="px-4 py-3 bg-white border border-black/10 text-sm font-serif outline-none focus:border-black transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[0.6rem] uppercase font-black tracking-widest opacity-50">Content</label>
            <TiptapEditor content={content} onChange={setContent} />
          </div>

          <div className="border border-black/10">
            <button
              type="button"
              onClick={() => setShowSeo((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-4 text-[0.65rem] uppercase font-black tracking-widest hover:bg-black/5 transition-colors"
            >
              SEO & Metadata
              <ChevronDown size={16} className={cn('transition-transform', showSeo && 'rotate-180')} />
            </button>
            {showSeo && (
              <div className="p-6 space-y-4 border-t border-black/10">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.6rem] uppercase font-black tracking-widest opacity-50">SEO Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Defaults to the article title"
                    className="px-4 py-3 bg-white border border-black/10 text-sm outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.6rem] uppercase font-black tracking-widest opacity-50">SEO Description</label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Defaults to the excerpt"
                    rows={2}
                    className="px-4 py-3 bg-white border border-black/10 text-sm outline-none focus:border-black transition-colors resize-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.6rem] uppercase font-black tracking-widest opacity-50">Canonical URL</label>
                  <input
                    type="text"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://yourdomain.com/blog/article-title"
                    className="px-4 py-3 bg-white border border-black/10 text-sm font-mono outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <div className="border-2 border-black p-6 space-y-4">
            <h2 className="text-[0.65rem] uppercase font-black tracking-widest border-b border-black/10 pb-3">Publish</h2>

            <div className="flex flex-col gap-2">
              <label className="text-[0.6rem] uppercase font-black tracking-widest opacity-50">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={session?.user?.name || 'Author name'}
                className="px-3 py-2 bg-white border border-black/10 text-sm outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSubmit('Draft')}
                disabled={saving !== null}
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-40"
              >
                {saving === 'draft' ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('Published')}
                disabled={saving !== null}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-40"
              >
                {saving === 'publish' ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                Publish
              </button>
              {initialBlog?.status && (
                <span className="text-[0.6rem] uppercase font-bold tracking-widest opacity-40 text-center">
                  Current status: {initialBlog.status}
                </span>
              )}
            </div>
          </div>

          <div className="border-2 border-black p-6 space-y-4">
            <h2 className="text-[0.65rem] uppercase font-black tracking-widest border-b border-black/10 pb-3">Featured Image</h2>
            <input
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://images.example.com/photo.jpg"
              className="w-full px-3 py-2 bg-white border border-black/10 text-xs font-mono outline-none focus:border-black transition-colors"
            />
            {featuredImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={featuredImage} alt="Featured preview" className="w-full aspect-video object-cover border border-black/10" />
            )}
          </div>

          <div className="border-2 border-black p-6 space-y-4">
            <h2 className="text-[0.65rem] uppercase font-black tracking-widest border-b border-black/10 pb-3">Category</h2>
            {loadingTaxonomy ? (
              <Loader2 className="animate-spin opacity-30" size={20} />
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-black/10 text-xs font-bold uppercase tracking-widest outline-none focus:border-black transition-colors"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
            {!loadingTaxonomy && categories.length === 0 && (
              <p className="text-[0.6rem] uppercase opacity-40 font-bold">No categories yet — create one on the Categories page.</p>
            )}
          </div>

          <div className="border-2 border-black p-6 space-y-4">
            <h2 className="text-[0.65rem] uppercase font-black tracking-widest border-b border-black/10 pb-3">Tags</h2>

            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.name)}
                  className={cn(
                    'px-3 py-1.5 border text-[0.6rem] font-bold uppercase tracking-widest transition-colors',
                    tags.includes(tag.name) ? 'bg-black text-white border-black' : 'border-black/20 hover:border-black'
                  )}
                >
                  {tag.name}
                </button>
              ))}
            </div>

            {tags.filter((t) => !availableTags.some((at) => at.name === t)).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags
                  .filter((t) => !availableTags.some((at) => at.name === t))
                  .map((t) => (
                    <span key={t} className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-[0.6rem] font-bold uppercase tracking-widest">
                      {t}
                      <button type="button" onClick={() => toggleTag(t)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
              </div>
            )}

            <form onSubmit={handleAddNewTag} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="New tag"
                className="flex-1 px-3 py-2 bg-white border border-black/10 text-xs outline-none focus:border-black transition-colors"
              />
              <button
                type="submit"
                disabled={!newTagInput.trim()}
                className="px-3 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors disabled:opacity-40"
              >
                <Plus size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
