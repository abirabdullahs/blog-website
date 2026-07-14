import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './client';
import { Blog } from '@/types';

const BLOGS_COLLECTION = 'blogs';

export const createBlog = async (blogData: Partial<Blog>) => {
  if (!db) throw new Error("Firestore not initialized");
  const docRef = await addDoc(collection(db, BLOGS_COLLECTION), {
    ...blogData,
    counters: {
      views: 0,
      likes: 0,
      shares: 0,
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: blogData.status === 'Published' ? serverTimestamp() : null,
  });
  return docRef.id;
};

export const updateBlog = async (id: string, blogData: Partial<Blog>) => {
  if (!db) throw new Error("Firestore not initialized");
  const docRef = doc(db, BLOGS_COLLECTION, id);
  await updateDoc(docRef, {
    ...blogData,
    updatedAt: serverTimestamp(),
    publishedAt: blogData.status === 'Published' ? serverTimestamp() : null,
  });
};

export const deleteBlog = async (id: string) => {
  if (!db) throw new Error("Firestore not initialized");
  const docRef = doc(db, BLOGS_COLLECTION, id);
  await deleteDoc(docRef);
};

export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  if (!db) return null;
  const q = query(collection(db, BLOGS_COLLECTION), where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const docSnap = querySnapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Blog;
};

export const getBlogs = async (): Promise<Blog[]> => {
  if (!db) return [];
  const q = query(
    collection(db, BLOGS_COLLECTION), 
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  })) as Blog[];
};

export const getPublishedBlogs = async (categoryId?: string, tag?: string): Promise<Blog[]> => {
  if (!db) return [];
  
  let q = query(
    collection(db, BLOGS_COLLECTION), 
    where('status', '==', 'Published'),
    orderBy('publishedAt', 'desc')
  );

  if (categoryId) {
    q = query(q, where('categoryId', '==', categoryId));
  }

  if (tag) {
    q = query(q, where('tags', 'array-contains', tag));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  })) as Blog[];
};

export const searchBlogs = async (term: string): Promise<Blog[]> => {
  if (!db || !term) return [];
  
  // Note: Firestore doesn't support full-text search natively. 
  // For MVP, we'll fetch all published and filter client-side 
  // or use a simple title match if possible. 
  // Better approach for production: Algolia or ElasticSearch.
  const q = query(
    collection(db, BLOGS_COLLECTION), 
    where('status', '==', 'Published')
  );
  
  const querySnapshot = await getDocs(q);
  const blogs = querySnapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  })) as Blog[];

  const lowercaseTerm = term.toLowerCase();
  return blogs.filter(blog => 
    blog.title.toLowerCase().includes(lowercaseTerm) || 
    blog.excerpt.toLowerCase().includes(lowercaseTerm) ||
    blog.tags.some(t => t.toLowerCase().includes(lowercaseTerm))
  );
};

export const getBlogById = async (id: string): Promise<Blog | null> => {
  if (!db) return null;
  const docRef = doc(db, BLOGS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Blog;
};
