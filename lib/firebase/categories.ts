import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
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

export const createCategory = async (data: { name: string; slug: string }): Promise<string> => {
  if (!db) throw new Error('Firestore not initialized');

  const existing = await getCategoryBySlug(data.slug);
  if (existing) throw new Error('A category with this slug already exists.');

  const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
    name: data.name,
    slug: data.slug,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

export const updateCategory = async (id: string, data: { name: string; slug: string }): Promise<void> => {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  await updateDoc(docRef, {
    name: data.name,
    slug: data.slug,
    updatedAt: serverTimestamp(),
  });
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
};
