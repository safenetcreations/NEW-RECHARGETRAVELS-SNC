import {
  collection,
  getDocs,
  orderBy,
  query,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface AdminBookNowHeroSlide {
  id?: string;
  image: string;
  title: string;
  subtitle: string;
}

export interface AdminBookNowPackage {
  id?: string;
  title: string;
  image: string;
  badge: string;
  duration: string;
  groupSize: string;
  price: number;
}

const HERO_COLLECTION = 'bookNowHeroSlides';
const PACKAGES_COLLECTION = 'bookNowPackages';

export const bookNowAdminService = {
  async fetchHeroSlides(): Promise<AdminBookNowHeroSlide[]> {
    const q = query(collection(db, HERO_COLLECTION), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as AdminBookNowHeroSlide),
    }));
  },

  async saveHeroSlide(slide: AdminBookNowHeroSlide): Promise<AdminBookNowHeroSlide> {
    if (slide.id) {
      const slideRef = doc(db, HERO_COLLECTION, slide.id);
      await updateDoc(slideRef, {
        image: slide.image,
        title: slide.title,
        subtitle: slide.subtitle,
        updatedAt: serverTimestamp(),
      });
      return slide;
    }

    const docRef = await addDoc(collection(db, HERO_COLLECTION), {
      image: slide.image,
      title: slide.title,
      subtitle: slide.subtitle,
      createdAt: serverTimestamp(),
    });
    return { ...slide, id: docRef.id };
  },

  async deleteHeroSlide(id: string): Promise<void> {
    await deleteDoc(doc(db, HERO_COLLECTION, id));
  },

  async fetchPackages(): Promise<AdminBookNowPackage[]> {
    const q = query(collection(db, PACKAGES_COLLECTION), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as AdminBookNowPackage),
    }));
  },

  async savePackage(pkg: AdminBookNowPackage): Promise<AdminBookNowPackage> {
    if (pkg.id) {
      const pkgRef = doc(db, PACKAGES_COLLECTION, pkg.id);
      await updateDoc(pkgRef, {
        title: pkg.title,
        image: pkg.image,
        badge: pkg.badge,
        duration: pkg.duration,
        groupSize: pkg.groupSize,
        price: pkg.price,
        updatedAt: serverTimestamp(),
      });
      return pkg;
    }

    const docRef = await addDoc(collection(db, PACKAGES_COLLECTION), {
      title: pkg.title,
      image: pkg.image,
      badge: pkg.badge,
      duration: pkg.duration,
      groupSize: pkg.groupSize,
      price: pkg.price,
      createdAt: serverTimestamp(),
    });
    return { ...pkg, id: docRef.id };
  },

  async deletePackage(id: string): Promise<void> {
    await deleteDoc(doc(db, PACKAGES_COLLECTION, id));
  },
};

