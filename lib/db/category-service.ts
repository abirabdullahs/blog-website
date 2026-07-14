import { eq, asc } from 'drizzle-orm';
import { db } from './index';
import { categories } from './schema';

export const getCategories = async () => {
  const rows = await db.select().from(categories).orderBy(asc(categories.name));
  return rows.map((row) => ({ id: String(row.id), name: row.name, slug: row.slug }));
};

export const getCategoryBySlug = async (slug: string) => {
  const [row] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return row ? { id: String(row.id), name: row.name, slug: row.slug } : null;
};

export const createCategory = async (data: { name: string; slug: string }) => {
  const existing = await getCategoryBySlug(data.slug);
  if (existing) throw new Error('A category with this slug already exists.');

  const [created] = await db.insert(categories).values({ name: data.name, slug: data.slug }).returning();
  return String(created.id);
};

export const updateCategory = async (id: string, data: { name: string; slug: string }) => {
  await db.update(categories).set({ name: data.name, slug: data.slug, updatedAt: new Date() }).where(eq(categories.id, Number(id)));
};

export const deleteCategory = async (id: string) => {
  await db.delete(categories).where(eq(categories.id, Number(id)));
};
