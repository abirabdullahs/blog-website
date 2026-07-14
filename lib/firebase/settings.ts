import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './client';
import { SiteSettings } from '@/types';

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'site';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'The Chronicle',
  siteDescription: 'An editorial journal on modern architecture, technology, and design.',
  siteUrl: 'https://the-chronicle.journal',
  ogImage: '/og-image.png',
  authorName: 'Abir Abdullah',
  authorUrl: 'https://abirabdullah.me',
  twitterHandle: '@thechronicle',
  contactEmail: '',
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  if (!db) return DEFAULT_SETTINGS;
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...docSnap.data() } as SiteSettings;
};

export const updateSiteSettings = async (data: Partial<SiteSettings>): Promise<void> => {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  await setDoc(
    docRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};
