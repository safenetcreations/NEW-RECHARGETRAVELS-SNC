import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface BookNowHeroSlide {
    id?: string;
    image: string;
    title: string;
    subtitle: string;
    createdAt?: any;
}

export interface PopularPackage {
    id?: string;
    title: string;
    image: string;
    badge: string;
    duration: string;
    groupSize: string;
    price: number;
    createdAt?: any;
}

const HERO_COLLECTION = 'bookNowHeroSlides';
const PACKAGES_COLLECTION = 'bookNowPackages';

// Default hero slides - Sri Lankan beaches
export const DEFAULT_BOOK_NOW_SLIDES: BookNowHeroSlide[] = [
    {
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=80",
        title: "Book Your Dream Journey",
        subtitle: "Experience the beauty of Sri Lanka with our premium travel services"
    },
    {
        image: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=1920&q=80",
        title: "Paradise Awaits",
        subtitle: "Golden beaches, crystal waters, and unforgettable memories"
    },
    {
        image: "https://images.unsplash.com/photo-1590123715937-e3ae9d56c618?w=1920&q=80",
        title: "Your Adventure Starts Here",
        subtitle: "From wildlife safaris to cultural heritage tours"
    },
    {
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80",
        title: "Tropical Escapes",
        subtitle: "Discover hidden coves and pristine coastlines"
    }
];

// Default popular packages
export const DEFAULT_PACKAGES: Omit<PopularPackage, 'id' | 'createdAt'>[] = [
    {
        title: 'Wildlife Safari Adventure',
        image: 'https://images.unsplash.com/photo-1590502160462-58b41354f588?w=600&q=80',
        badge: 'Most Popular',
        duration: '5 Days',
        groupSize: '2-6 Pax',
        price: 899
    },
    {
        title: 'Cultural Heritage Tour',
        image: 'https://images.unsplash.com/photo-1588598198321-4c8c6d733293?w=600&q=80',
        badge: 'Best Value',
        duration: '7 Days',
        groupSize: '2-8 Pax',
        price: 1199
    },
    {
        title: 'Beach Paradise Escape',
        image: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=600&q=80',
        badge: 'Romantic',
        duration: '4 Days',
        groupSize: '2 Pax',
        price: 699
    }
];

// ============ HERO SLIDES ============

export async function getBookNowHeroSlides(): Promise<BookNowHeroSlide[]> {
    try {
        const q = query(collection(db, HERO_COLLECTION), orderBy('createdAt', 'asc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            await initializeDefaultHeroSlides();
            return DEFAULT_BOOK_NOW_SLIDES;
        }

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as BookNowHeroSlide));
    } catch (error) {
        console.error('Error fetching Book Now hero slides:', error);
        return DEFAULT_BOOK_NOW_SLIDES;
    }
}

export async function addBookNowHeroSlide(slide: Omit<BookNowHeroSlide, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> {
    try {
        await addDoc(collection(db, HERO_COLLECTION), {
            ...slide,
            createdAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error adding Book Now hero slide:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function updateBookNowHeroSlide(id: string, slide: Partial<BookNowHeroSlide>): Promise<{ success: boolean; error?: string }> {
    try {
        await updateDoc(doc(db, HERO_COLLECTION, id), slide);
        return { success: true };
    } catch (error) {
        console.error('Error updating Book Now hero slide:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function deleteBookNowHeroSlide(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await deleteDoc(doc(db, HERO_COLLECTION, id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting Book Now hero slide:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

async function initializeDefaultHeroSlides() {
    try {
        const promises = DEFAULT_BOOK_NOW_SLIDES.map(slide =>
            addDoc(collection(db, HERO_COLLECTION), {
                ...slide,
                createdAt: serverTimestamp()
            })
        );
        await Promise.all(promises);
        console.log('Initialized default Book Now hero slides');
    } catch (error) {
        console.error('Error initializing default Book Now slides:', error);
    }
}

// ============ POPULAR PACKAGES ============

export async function getBookNowPackages(): Promise<PopularPackage[]> {
    try {
        const q = query(collection(db, PACKAGES_COLLECTION), orderBy('createdAt', 'asc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            await initializeDefaultPackages();
            return DEFAULT_PACKAGES.map((pkg, index) => ({ ...pkg, id: `default-${index}` }));
        }

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as PopularPackage));
    } catch (error) {
        console.error('Error fetching Book Now packages:', error);
        return DEFAULT_PACKAGES.map((pkg, index) => ({ ...pkg, id: `default-${index}` }));
    }
}

export async function addBookNowPackage(pkg: Omit<PopularPackage, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> {
    try {
        await addDoc(collection(db, PACKAGES_COLLECTION), {
            ...pkg,
            createdAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error adding Book Now package:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function updateBookNowPackage(id: string, pkg: Partial<PopularPackage>): Promise<{ success: boolean; error?: string }> {
    try {
        await updateDoc(doc(db, PACKAGES_COLLECTION, id), pkg);
        return { success: true };
    } catch (error) {
        console.error('Error updating Book Now package:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function deleteBookNowPackage(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await deleteDoc(doc(db, PACKAGES_COLLECTION, id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting Book Now package:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

async function initializeDefaultPackages() {
    try {
        const promises = DEFAULT_PACKAGES.map(pkg =>
            addDoc(collection(db, PACKAGES_COLLECTION), {
                ...pkg,
                createdAt: serverTimestamp()
            })
        );
        await Promise.all(promises);
        console.log('Initialized default Book Now packages');
    } catch (error) {
        console.error('Error initializing default Book Now packages:', error);
    }
}
