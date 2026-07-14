import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './client';
import { Tag } from '@/types';

const TAGS_COLLECTION = 'tags';

export const getTags = async (): Promise<Tag[]> => {
  if (!db) return [];
  const q = query(collection(db, TAGS_COLLECTION), orderBy('name', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  })) as Tag[];
};

export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
  if (!db) return null;
  const q = query(collection(db, TAGS_COLLECTION), where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const docSnap = querySnapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Tag;
};

export const createTag = async (data: { name: string; slug: string }): Promise<string> => {
  if (!db) throw new Error('Firestore not initialized');

  const existing = await getTagBySlug(data.slug);
  if (existing) throw new Error('A tag with this slug already exists.');

  const docRef = await addDoc(collection(db, TAGS_COLLECTION), {
    name: data.name,
    slug: data.slug,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateTag = async (id: string, data: { name: string; slug: string }): Promise<void> => {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(db, TAGS_COLLECTION, id);
  await updateDoc(docRef, {
    name: data.name,
    slug: data.slug,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTag = async (id: string): Promise<void> => {
  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, TAGS_COLLECTION, id));
};
