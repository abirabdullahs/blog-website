import { MetadataRoute } from 'next';
import { getBlogs } from '@/lib/db/blog-service';
import { getCategories } from '@/lib/db/category-service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://the-chronicle.journal';

  // Fetch all published blogs
  const blogs = await getBlogs();
  const blogEntries = blogs
    .filter(blog => blog.status === 'Published')
    .map(blog => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt?.seconds ? new Date(blog.updatedAt.seconds * 1000) : new Date(),
    }));

  // Fetch all categories
  const categories = await getCategories();
  const categoryEntries = categories.map(category => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...blogEntries,
    ...categoryEntries,
  ];
}
