import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from './index';
import { blogs } from './schema';
import type { Blog } from '@/types';

type BlogInsert = typeof blogs.$inferInsert;

type BlogRow = typeof blogs.$inferSelect;

const normalizeStatus = (status?: Blog['status'] | string) => {
  if (!status) return 'draft' as const;
  return String(status).toLowerCase() === 'published' ? 'published' : 'draft';
};

const toBlogModel = (row: BlogRow): Blog => ({
  id: String(row.id),
  title: row.title,
  slug: row.slug,
  content: row.content,
  excerpt: row.excerpt ?? '',
  featuredImage: row.featuredImage ?? '',
  categoryId: '',
  categoryName: '',
  tags: [],
  author: '',
  status: row.status === 'published' ? 'Published' : 'Draft',
  readingTime: 0,
  metadata: {
    seoTitle: row.title,
    seoDescription: row.excerpt ?? '',
    canonicalUrl: `/blog/${row.slug}`,
  },
  counters: {
    views: row.views ?? 0,
    likes: 0,
    shares: 0,
  },
  publishedAt: row.createdAt,
  updatedAt: row.updatedAt,
  createdAt: row.createdAt,
});

export const createBlog = async (blogData: Partial<Blog>) => {
  const [createdBlog] = await db
    .insert(blogs)
    .values({
      title: blogData.title ?? '',
      slug: blogData.slug ?? '',
      content: blogData.content ?? '',
      excerpt: blogData.excerpt ?? '',
      featuredImage: blogData.featuredImage ?? '',
      status: normalizeStatus(blogData.status),
    })
    .returning();

  return String(createdBlog.id);
};

export const updateBlog = async (id: string, blogData: Partial<Blog>) => {
  const payload: Partial<BlogInsert> = {
    title: blogData.title,
    slug: blogData.slug,
    content: blogData.content,
    excerpt: blogData.excerpt,
    featuredImage: blogData.featuredImage,
    status: blogData.status ? normalizeStatus(blogData.status) : undefined,
    updatedAt: new Date(),
  };

  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  ) as Partial<BlogInsert>;

  await db.update(blogs).set(cleanedPayload).where(eq(blogs.id, Number(id)));
};

export const deleteBlog = async (id: string) => {
  await db.delete(blogs).where(eq(blogs.id, Number(id)));
};

export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  const [row] = await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1);
  return row ? toBlogModel(row) : null;
};

export const getBlogById = async (id: string): Promise<Blog | null> => {
  const [row] = await db.select().from(blogs).where(eq(blogs.id, Number(id))).limit(1);
  return row ? toBlogModel(row) : null;
};

export const getBlogs = async (): Promise<Blog[]> => {
  const rows = await db.select().from(blogs).orderBy(desc(blogs.createdAt));
  return rows.map(toBlogModel);
};

export const getPublishedBlogs = async (): Promise<Blog[]> => {
  const rows = await db
    .select()
    .from(blogs)
    .where(eq(blogs.status, 'published'))
    .orderBy(desc(blogs.createdAt));

  return rows.map(toBlogModel);
};

export const searchBlogs = async (term: string): Promise<Blog[]> => {
  const normalizedTerm = term.trim();

  if (!normalizedTerm) return [];

  const rows = await db
    .select()
    .from(blogs)
    .where(
      and(
        eq(blogs.status, 'published'),
        sql`to_tsvector('english', coalesce(${blogs.title}, '') || ' ' || coalesce(${blogs.excerpt}, '') || ' ' || coalesce(${blogs.content}, '')) @@ plainto_tsquery('english', ${normalizedTerm})`
      )
    )
    .orderBy(desc(blogs.createdAt));

  return rows.map(toBlogModel);
};
