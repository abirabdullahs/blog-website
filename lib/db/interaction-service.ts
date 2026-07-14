import { and, eq, sql } from 'drizzle-orm';
import { db } from './index';
import { blogs, comments } from './schema';

export const incrementViews = async (blogId: string) => {
  await db
    .update(blogs)
    .set({ views: sql`${blogs.views} + 1` })
    .where(eq(blogs.id, Number(blogId)));
};

export const incrementLikes = async (blogId: string) => {
  await db
    .update(blogs)
    .set({ likes: sql`${blogs.likes} + 1` })
    .where(eq(blogs.id, Number(blogId)));
};

export const addComment = async (
  blogId: string,
  commentData: { name: string; email: string; text: string }
) => {
  const [createdComment] = await db
    .insert(comments)
    .values({
      blogId: Number(blogId),
      name: commentData.name,
      email: commentData.email,
      comment: commentData.text,
      status: 'approved',
    })
    .returning();

  return createdComment;
};

export const getComments = async (blogId: string) => {
  const rows = await db
    .select()
    .from(comments)
    .where(and(eq(comments.blogId, Number(blogId)), eq(comments.status, 'approved')))
    .orderBy(sql`${comments.createdAt} DESC`);

  return rows.map((comment) => ({
    id: String(comment.id),
    blogId: String(comment.blogId),
    name: comment.name,
    email: comment.email,
    text: comment.comment,
    status: comment.status,
    createdAt: comment.createdAt,
  }));
};
