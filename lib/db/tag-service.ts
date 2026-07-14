import { eq, asc } from 'drizzle-orm';
import { db } from './index';
import { tags } from './schema';

export const getTags = async () => {
  const rows = await db.select().from(tags).orderBy(asc(tags.name));
  return rows.map((row) => ({ id: String(row.id), name: row.name, slug: row.slug }));
};

export const getTagBySlug = async (slug: string) => {
  const [row] = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
  return row ? { id: String(row.id), name: row.name, slug: row.slug } : null;
};

export const createTag = async (data: { name: string; slug: string }) => {
  const existing = await getTagBySlug(data.slug);
  if (existing) throw new Error('A tag with this slug already exists.');

  const [created] = await db.insert(tags).values({ name: data.name, slug: data.slug }).returning();
  return String(created.id);
};

export const updateTag = async (id: string, data: { name: string; slug: string }) => {
  await db.update(tags).set({ name: data.name, slug: data.slug, updatedAt: new Date() }).where(eq(tags.id, Number(id)));
};

export const deleteTag = async (id: string) => {
  await db.delete(tags).where(eq(tags.id, Number(id)));
};
