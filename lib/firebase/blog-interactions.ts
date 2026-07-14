import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  increment,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './client';

export const incrementViews = async (blogId: string) => {
  if (!db) return;
  const docRef = doc(db, 'blogs', blogId);
  await updateDoc(docRef, {
    'counters.views': increment(1)
  });
};

export const incrementLikes = async (blogId: string) => {
  if (!db) return;
  const docRef = doc(db, 'blogs', blogId);
  await updateDoc(docRef, {
    'counters.likes': increment(1)
  });
};

export const addComment = async (blogId: string, commentData: { name: string, email: string, text: string }) => {
  if (!db) return;
  await addDoc(collection(db, 'comments'), {
    blogId,
    ...commentData,
    status: 'approved', // Auto-approved for MVP, can be changed to 'pending'
    createdAt: serverTimestamp()
  });
};

export const getComments = async (blogId: string) => {
  if (!db) return [];
  const q = query(
    collection(db, 'comments'),
    where('blogId', '==', blogId),
    where('status', '==', 'approved'),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
