'use client';

import { useEffect, useState } from 'react';
import { Plus, Loader2, Pencil, Trash2, X, Check } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/firebase/categories';
import { Category } from '@/types';
import { slugify } from '@/lib/utils';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New category form
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadCategories() {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Could not load categories. Check your Firebase configuration.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchInitialCategories() {
      setLoading(true);
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Could not load categories. Check your Firebase configuration.');
      } finally {
        setLoading(false);
      }
    }
    fetchInitialCategories();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const finalSlug = slug.trim() || slugify(name);
      await createCategory({ name: name.trim(), slug: finalSlug });
      setName('');
      setSlug('');
      setSlugTouched(false);
      await loadCategories();
    } catch (err: any) {
      setError(err?.message || 'Failed to create category.');
    } finally {
      setSaving(false);
    }
  }

  function startEdit(category: Category) {
    setEditingId(category.id);
    setEditName(category.name);
    setEditSlug(category.slug);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName('');
    setEditSlug('');
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const finalSlug = editSlug.trim() || slugify(editName);
      await updateCategory(id, { name: editName.trim(), slug: finalSlug });
      cancelEdit();
      await loadCategories();
    } catch (err: any) {
      setError(err?.message || 'Failed to update category.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (deletingId !== id) {
      setDeletingId(id);
      return;
    }
    setSaving(true);
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete category.');
    } finally {
      setSaving(false);
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-10">
      <header className="border-b-2 border-black pb-8">
        <span className="text-[0.65rem] uppercase tracking-[0.4em] font-bold text-gray-400 mb-2 block">Taxonomy</span>
        <h1 className="text-5xl font-bold tracking-tighter italic font-serif">Categories</h1>
      </header>

      {error && (
        <div className="border-2 border-red-600 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-widest px-6 py-4">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="border-2 border-black p-6 flex flex-col md:flex-row gap-4 md:items-end">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-[0.6rem] uppercase font-black tracking-widest opacity-50">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="e.g. Architecture"
            className="px-4 py-3 bg-white border border-black/10 text-sm font-serif outline-none focus:border-black transition-colors"
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-[0.6rem] uppercase font-black tracking-widest opacity-50">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugTouched(true);
            }}
            placeholder="architecture"
            className="px-4 py-3 bg-white border border-black/10 text-sm font-mono outline-none focus:border-black transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-40"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
          Add Category
        </button>
      </form>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin opacity-20" size={40} />
          <span className="text-[0.6rem] uppercase tracking-widest font-bold opacity-40">Loading Categories...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-black text-[0.65rem] uppercase tracking-widest font-black text-left">
                <th className="pb-4 pr-4">Name</th>
                <th className="pb-4 px-4">Slug</th>
                <th className="pb-4 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <span className="text-[0.7rem] uppercase tracking-widest opacity-30 font-bold italic">No categories yet</span>
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="group hover:bg-black/5 transition-colors">
                    {editingId === category.id ? (
                      <>
                        <td className="py-4 pr-4">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-black/20 text-sm font-serif outline-none focus:border-black"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="text"
                            value={editSlug}
                            onChange={(e) => setEditSlug(slugify(e.target.value))}
                            className="w-full px-3 py-2 bg-white border border-black/20 text-sm font-mono outline-none focus:border-black"
                          />
                        </td>
                        <td className="py-4 pl-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => saveEdit(category.id)}
                              disabled={saving}
                              className="p-2 hover:bg-black/10 transition-colors rounded-full disabled:opacity-40"
                              title="Save"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 hover:bg-black/10 transition-colors rounded-full"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-6 pr-4">
                          <span className="text-sm font-bold font-serif">{category.name}</span>
                        </td>
                        <td className="py-6 px-4">
                          <span className="text-[0.65rem] font-mono opacity-50">/{category.slug}</span>
                        </td>
                        <td className="py-6 pl-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => startEdit(category)}
                              className="p-2 hover:bg-black/10 transition-colors rounded-full"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              onBlur={() => setDeletingId(null)}
                              className={`p-2 transition-colors rounded-full ${deletingId === category.id ? 'bg-red-600 text-white hover:bg-red-700' : 'hover:bg-black/10'}`}
                              title={deletingId === category.id ? 'Click again to confirm' : 'Delete'}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
