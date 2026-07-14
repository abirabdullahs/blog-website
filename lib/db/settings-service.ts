import { eq } from 'drizzle-orm';
import { db } from './index';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import type { SiteSettings } from '@/types';

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

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'The Chronicle',
  siteDescription: 'A short tagline for search engines & social previews',
  siteUrl: 'https://yourdomain.com',
  ogImage: '/og-image.png',
  authorName: 'Your Name',
  authorUrl: 'https://yourportfolio.com',
  twitterHandle: '@yourhandle',
  contactEmail: 'hello@yourdomain.com',
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  const [row] = await db.select().from(siteSettings).limit(1);

  if (!row) {
    return DEFAULT_SETTINGS;
  }

  return {
    ...DEFAULT_SETTINGS,
    siteName: row.siteName ?? DEFAULT_SETTINGS.siteName,
    siteDescription: row.siteDescription ?? DEFAULT_SETTINGS.siteDescription,
    siteUrl: row.siteUrl ?? DEFAULT_SETTINGS.siteUrl,
    ogImage: row.ogImage ?? DEFAULT_SETTINGS.ogImage,
    authorName: row.authorName ?? DEFAULT_SETTINGS.authorName,
    authorUrl: row.authorUrl ?? DEFAULT_SETTINGS.authorUrl,
    twitterHandle: row.twitterHandle ?? DEFAULT_SETTINGS.twitterHandle,
    contactEmail: row.contactEmail ?? DEFAULT_SETTINGS.contactEmail,
  };
};

export const updateSiteSettings = async (data: Partial<SiteSettings>): Promise<void> => {
  const existing = await db.select().from(siteSettings).limit(1);

  if (existing.length === 0) {
    await db.insert(siteSettings).values({
      siteName: data.siteName ?? DEFAULT_SETTINGS.siteName,
      siteDescription: data.siteDescription ?? DEFAULT_SETTINGS.siteDescription,
      siteUrl: data.siteUrl ?? DEFAULT_SETTINGS.siteUrl,
      ogImage: data.ogImage ?? DEFAULT_SETTINGS.ogImage,
      authorName: data.authorName ?? DEFAULT_SETTINGS.authorName,
      authorUrl: data.authorUrl ?? DEFAULT_SETTINGS.authorUrl,
      twitterHandle: data.twitterHandle ?? DEFAULT_SETTINGS.twitterHandle,
      contactEmail: data.contactEmail ?? DEFAULT_SETTINGS.contactEmail,
    });
    return;
  }

  await db.update(siteSettings).set({
    siteName: data.siteName,
    siteDescription: data.siteDescription,
    siteUrl: data.siteUrl,
    ogImage: data.ogImage,
    authorName: data.authorName,
    authorUrl: data.authorUrl,
    twitterHandle: data.twitterHandle,
    contactEmail: data.contactEmail,
    updatedAt: new Date(),
  }).where(eq(siteSettings.id, existing[0].id));
};
