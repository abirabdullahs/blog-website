import { Blog } from '@/types';

export default function JsonLd({ blog }: { blog: Blog }) {
  const datePublished = blog.publishedAt?.seconds 
    ? new Date(blog.publishedAt.seconds * 1000).toISOString() 
    : new Date().toISOString();
  
  const dateModified = blog.updatedAt?.seconds 
    ? new Date(blog.updatedAt.seconds * 1000).toISOString() 
    : datePublished;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    image: blog.featuredImage,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: 'Abir Abdullah',
      url: 'https://abirabdullah.me',
    },
    description: blog.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://the-chronicle.journal/blog/${blog.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
