import { Metadata } from 'next';

const siteConfig = {
  name: 'The Chronicle',
  description: 'An editorial journal on modern architecture, technology, and design.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://the-chronicle.journal',
  ogImage: '/og-image.png',
};

export function constructMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
    description,
    openGraph: {
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description,
      images: [image],
      creator: '@thechronicle',
    },
    authors: [{ name: 'Abir Abdullah', url: 'https://abirabdullah.me' }],
    other: {
      'article:author': 'https://abirabdullah.me',
    },
    icons: {
      icon: '/favicon.ico',
    },
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
