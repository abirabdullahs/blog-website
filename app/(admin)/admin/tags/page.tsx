'use client';

import { useEffect, useState } from 'react';
import { Plus, Loader2, X, Pencil, Check } from 'lucide-react';
import { getTags, createTag, updateTag, deleteTag } from '@/lib/firebase/tags';
import { Tag } from '@/types';
import { slugify } from '@/lib/utils';

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadTags() {
    setLoading(true);
    try {
      const data = await getTags();
      setTags(data);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
      setError('Could not load tags. Check your Firebase configuration.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchInitialTags() {
      setLoading(true);
      try {
        const data = await getTags();
        setTags(data);
      } catch (err) {
        console.error('Failed to fetch tags:', err);
        setError('Could not load tags. Check your Firebase configuration.');
      } finally {
        setLoading(false);
      }
    }
    fetchInitialTags();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createTag({ name: name.trim(), slug: slugify(name) });
      setName('');
      await loadTags();
    } catch (err: any) {
      setError(err?.message || 'Failed to create tag.');
    } finally {
      setSaving(false);
    }
  }

  function startEdit(tag: Tag) {
    setEditingId(tag.id);
    setEditName(tag.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName('');
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await updateTag(id, { name: editName.trim(), slug: slugify(editName) });
      cancelEdit();
      await loadTags();
    } catch (err: any) {
      setError(err?.message || 'Failed to update tag.');
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
      await deleteTag(id);
      await loadTags();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete tag.');
    } finally {
      setSaving(false);
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-10">
      <header className="border-b-2 border-black pb-8">
        <span className="text-[0.65rem] uppercase tracking-[0.4em] font-bold text-gray-400 mb-2 block">Taxonomy</span>
        <h1 className="text-5xl font-bold tracking-tighter italic font-serif">Tags</h1>
      </header>

      {error && (
        <div className="border-2 border-red-600 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-widest px-6 py-4">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="flex gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="NEW TAG NAME"
          className="flex-1 px-4 py-3 bg-white border border-black/10 text-xs font-bold uppercase tracking-widest outline-none focus:border-black transition-colors"
        />
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-40"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
          Add Tag
        </button>
      </form>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin opacity-20" size={40} />
          <span className="text-[0.6rem] uppercase tracking-widest font-bold opacity-40">Loading Tags...</span>
        </div>
      ) : tags.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-black/10">
          <span className="text-[0.7rem] uppercase tracking-widest opacity-30 font-bold italic">No tags yet</span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) =>
            editingId === tag.id ? (
              <div key={tag.id} className="flex items-center gap-1 border-2 border-black px-3 py-2">
                <input
                  autoFocus
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(tag.id);
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  className="w-32 bg-transparent text-xs font-bold uppercase tracking-widest outline-none"
                />
                <button onClick={() => saveEdit(tag.id)} disabled={saving} className="p-1 hover:opacity-60 disabled:opacity-40" title="Save">
                  <Check size={14} />
                </button>
                <button onClick={cancelEdit} className="p-1 hover:opacity-60" title="Cancel">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                key={tag.id}
                className="group flex items-center gap-2 border border-black/20 hover:border-black px-4 py-2 transition-colors"
              >
                <span className="text-xs font-bold uppercase tracking-widest">{tag.name}</span>
                <button
                  onClick={() => startEdit(tag)}
                  className="opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity"
                  title="Edit"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => handleDelete(tag.id)}
                  onBlur={() => setDeletingId(null)}
                  className={`transition-opacity ${deletingId === tag.id ? 'opacity-100 text-red-600' : 'opacity-0 group-hover:opacity-50 hover:!opacity-100'}`}
                  title={deletingId === tag.id ? 'Click again to confirm' : 'Delete'}
                >
                  <X size={14} />
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
