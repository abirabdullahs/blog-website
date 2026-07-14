import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

// 1. Blogs Table
export const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featuredImage: text('featured_image'),
  status: text('status').default('draft'),
  likes: integer('likes').default(0),
  views: integer('views').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. Categories Table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 3. Tags Table
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 4. Junction Table (Blog to Tags - Many to Many Relationship)
export const blogTags = pgTable('blog_tags', {
  id: serial('id').primaryKey(),
  blogId: integer('blog_id').references(() => blogs.id),
  tagId: integer('tag_id').references(() => tags.id),
});

// 5. Comments Table
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  blogId: integer('blog_id').references(() => blogs.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  comment: text('comment').notNull(),
  status: text('status').default('pending'), // 'pending' | 'approved'
  createdAt: timestamp('created_at').defaultNow(),
});

// 6. Site Settings Table
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  siteName: text('site_name').notNull(),
  siteDescription: text('site_description').notNull(),
  siteUrl: text('site_url').notNull(),
  ogImage: text('og_image').notNull(),
  authorName: text('author_name').notNull(),
  authorUrl: text('author_url').notNull(),
  twitterHandle: text('twitter_handle').notNull(),
  contactEmail: text('contact_email').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});