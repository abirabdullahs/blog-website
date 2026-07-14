export interface Blog {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  categoryId: string;
  categoryName?: string;
  tags: string[];
  author: string;
  status: 'Draft' | 'Published';
  readingTime: number;
  metadata: {
    seoTitle: string;
    seoDescription: string;
    canonicalUrl: string;
  };
  counters: {
    views: number;
    likes: number;
    shares: number;
  };
  publishedAt: any;
  updatedAt: any;
  createdAt: any;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
}
