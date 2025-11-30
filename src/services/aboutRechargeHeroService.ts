import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
    updateDoc,
    getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface AboutRechargeHeroSlide {
    id?: string;
    image: string;
    title: string;
    subtitle: string;
    badge?: string;
    isActive?: boolean;
    createdAt?: any;
}

const COLLECTION_NAME = 'aboutRechargeHeroSlides';

export const DEFAULT_RECHARGE_SLIDES: AboutRechargeHeroSlide[] = [
    {
        image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80",
        title: "Recharge Travels",
        subtitle: "A Journey of Resilience Since 2014",
        badge: "Est. 2014"
    },
    {
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80",
        title: "Premium Fleet",
        subtitle: "Luxury vehicles for every journey across Sri Lanka",
        badge: "Quality Service"
    },
    {
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80",
        title: "Your Travel Partner",
        subtitle: "From airport transfers to island-wide tours",
        badge: "Trusted By Thousands"
    },
    {
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
        title: "Rising Stronger",
        subtitle: "Overcoming challenges, delivering excellence",
        badge: "Since 2014"
    },
    {
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
        title: "Expert Drivers",
        subtitle: "Professional, licensed, and English-speaking guides",
        badge: "SLTDA Approved"
    },
    {
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=80",
        title: "Customer First",
        subtitle: "4.9/5 rating from 1000+ happy travelers",
        badge: "Top Rated"
    }
];

export async function getAboutRechargeHeroSlides(): Promise<AboutRechargeHeroSlide[]> {
    try {
        // ONLY fetch from admin panel - page-content/about-recharge-travels
        const pageContentRef = doc(db, 'page-content', 'about-recharge-travels');
        const pageContentSnap = await getDoc(pageContentRef);

        if (pageContentSnap.exists()) {
            const data = pageContentSnap.data();
            if (data.heroSlides && Array.isArray(data.heroSlides) && data.heroSlides.length > 0) {
                // Filter to only active slides with valid images
                const activeSlides = data.heroSlides.filter(
                    (slide: AboutRechargeHeroSlide) =>
                        slide.isActive !== false &&
                        slide.image &&
                        slide.image.trim() !== ''
                );
                if (activeSlides.length > 0) {
                    console.log('Loaded hero slides from admin panel:', activeSlides.length);
                    return activeSlides;
                }
            }
        }

        // Return empty array if no admin panel slides - NO FALLBACK to defaults
        console.log('No hero slides found in admin panel');
        return [];
    } catch (error) {
        console.error('Error fetching About Recharge hero slides:', error);
        return [];
    }
}

export async function addAboutRechargeHeroSlide(slide: Omit<AboutRechargeHeroSlide, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> {
    try {
        await addDoc(collection(db, COLLECTION_NAME), {
            ...slide,
            createdAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error adding About Recharge hero slide:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function updateAboutRechargeHeroSlide(id: string, slide: Partial<AboutRechargeHeroSlide>): Promise<{ success: boolean; error?: string }> {
    try {
        await updateDoc(doc(db, COLLECTION_NAME, id), slide);
        return { success: true };
    } catch (error) {
        console.error('Error updating About Recharge hero slide:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function deleteAboutRechargeHeroSlide(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting About Recharge hero slide:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

async function initializeDefaultRechargeSlides() {
    try {
        const promises = DEFAULT_RECHARGE_SLIDES.map(slide =>
            addDoc(collection(db, COLLECTION_NAME), {
                ...slide,
                createdAt: serverTimestamp()
            })
        );
        await Promise.all(promises);
        console.log('Initialized default About Recharge hero slides');
    } catch (error) {
        console.error('Error initializing default About Recharge slides:', error);
    }
}
