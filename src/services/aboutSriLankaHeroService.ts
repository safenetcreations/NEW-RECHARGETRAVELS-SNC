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

export interface AboutSriLankaHeroSlide {
    id?: string;
    image: string;
    title: string;
    subtitle: string;
    badge?: string;
    createdAt?: any;
}

const COLLECTION_NAME = 'aboutSriLankaHeroSlides';

export const DEFAULT_ABOUT_SLIDES: AboutSriLankaHeroSlide[] = [
    {
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80",
        title: "The Pearl of the Indian Ocean",
        subtitle: "Discover Sri Lanka's Rich Heritage and Natural Beauty",
        badge: "Discover Paradise"
    },
    {
        image: "https://images.unsplash.com/photo-1588258524675-55d656396b8a?q=80&w=2567&auto=format&fit=crop",
        title: "Ancient Kingdoms Await",
        subtitle: "Walk through 2,500 years of fascinating history at Sigiriya Rock Fortress",
        badge: "UNESCO Heritage"
    },
    {
        image: "https://images.unsplash.com/photo-1546708773-e52953324f83?q=80&w=2573&auto=format&fit=crop",
        title: "Misty Mountain Paradise",
        subtitle: "Experience the legendary tea plantations and cool climate of Hill Country",
        badge: "Hill Country"
    },
    {
        image: "https://images.unsplash.com/photo-1586861635167-e5223aeb4227?q=80&w=2670&auto=format&fit=crop",
        title: "Golden Beaches Beckon",
        subtitle: "Relax on pristine shores from Mirissa to Arugam Bay",
        badge: "Beach Paradise"
    },
    {
        image: "https://images.unsplash.com/photo-1534329539061-64caeb388c42?q=80&w=2561&auto=format&fit=crop",
        title: "Wildlife Wonders",
        subtitle: "Encounter elephants, leopards, and exotic birds in their natural habitat",
        badge: "Safari Adventures"
    },
    {
        image: "https://images.unsplash.com/photo-1552309953-2bdf7b21eac8?w=1920&q=80",
        title: "Sacred Temples & Traditions",
        subtitle: "Immerse yourself in spiritual journeys and ancient Buddhist culture",
        badge: "Cultural Heritage"
    },
    {
        image: "https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=1920&q=80",
        title: "Nine Arch Bridge & Beyond",
        subtitle: "Journey through Ella's breathtaking landscapes and scenic railway",
        badge: "Scenic Railway"
    },
    {
        image: "https://images.unsplash.com/photo-1583797000246-cfaa0f5ebb6d?w=1920&q=80",
        title: "Whale Watching Capital",
        subtitle: "Witness majestic blue whales and dolphins off the southern coast",
        badge: "Marine Wildlife"
    }
];

export async function getAboutSriLankaHeroSlides(): Promise<AboutSriLankaHeroSlide[]> {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'asc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // If no slides exist, initialize with defaults
            await initializeDefaultAboutSlides();
            return DEFAULT_ABOUT_SLIDES;
        }

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as AboutSriLankaHeroSlide));
    } catch (error) {
        console.error('Error fetching About Sri Lanka hero slides:', error);
        return DEFAULT_ABOUT_SLIDES;
    }
}

export async function addAboutSriLankaHeroSlide(slide: Omit<AboutSriLankaHeroSlide, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> {
    try {
        await addDoc(collection(db, COLLECTION_NAME), {
            ...slide,
            createdAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error adding About Sri Lanka hero slide:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function updateAboutSriLankaHeroSlide(id: string, slide: Partial<AboutSriLankaHeroSlide>): Promise<{ success: boolean; error?: string }> {
    try {
        await updateDoc(doc(db, COLLECTION_NAME, id), slide);
        return { success: true };
    } catch (error) {
        console.error('Error updating About Sri Lanka hero slide:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function deleteAboutSriLankaHeroSlide(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting About Sri Lanka hero slide:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

async function initializeDefaultAboutSlides() {
    try {
        const promises = DEFAULT_ABOUT_SLIDES.map(slide =>
            addDoc(collection(db, COLLECTION_NAME), {
                ...slide,
                createdAt: serverTimestamp()
            })
        );
        await Promise.all(promises);
        console.log('Initialized default About Sri Lanka hero slides');
    } catch (error) {
        console.error('Error initializing default About Sri Lanka slides:', error);
    }
}
