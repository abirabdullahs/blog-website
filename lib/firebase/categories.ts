import { 
  collection, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './client';
import { Category } from '@/types';

const CATEGORIES_COLLECTION = 'categories';

export const getCategories = async (): Promise<Category[]> => {
  if (!db) return [];
  const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
  return querySnapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  })) as Category[];
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  if (!db) return null;
  const q = query(collection(db, CATEGORIES_COLLECTION), where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const docSnap = querySnapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Category;
};
