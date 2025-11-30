import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface HeroSlide {
    id?: string;
    image: string;
    title: string;
    subtitle: string;
    createdAt?: any;
}

const COLLECTION_NAME = 'heroSlides';

export const DEFAULT_SLIDES: HeroSlide[] = [
    {
        image: "https://i.imgur.com/AEnBWJf.jpeg",
        title: "Discover Sri Lanka",
        subtitle: "Experience the pearl of the Indian Ocean in luxury"
    },
    {
        image: "https://images.unsplash.com/photo-1588258524675-55d656396b8a?q=80&w=2567&auto=format&fit=crop",
        title: "Ancient Wonders",
        subtitle: "Explore the rich history and culture of Sigiriya"
    },
    {
        image: "https://images.unsplash.com/photo-1586861635167-e5223aeb4227?q=80&w=2670&auto=format&fit=crop",
        title: "Pristine Beaches",
        subtitle: "Relax on the golden sands of Mirissa and Unawatuna"
    },
    {
        image: "https://images.unsplash.com/photo-1546708773-e52953324f83?q=80&w=2573&auto=format&fit=crop",
        title: "Scenic Hill Country",
        subtitle: "Journey through the tea plantations of Ella and Nuwara Eliya"
    },
    {
        image: "https://images.unsplash.com/photo-1534329539061-64caeb388c42?q=80&w=2561&auto=format&fit=crop",
        title: "Wildlife Adventures",
        subtitle: "Witness majestic elephants and leopards in Yala National Park"
    }
];

export async function getHeroSlides(): Promise<HeroSlide[]> {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'asc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return [];
        }

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as HeroSlide));
    } catch (error) {
        console.error('Error fetching hero slides:', error);
        return [];
    }
}

export async function addHeroSlide(slide: Omit<HeroSlide, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> {
    try {
        await addDoc(collection(db, COLLECTION_NAME), {
            ...slide,
            createdAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error adding hero slide:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function deleteHeroSlide(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting hero slide:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

async function initializeDefaultSlides() {
    try {
        const promises = DEFAULT_SLIDES.map(slide =>
            addDoc(collection(db, COLLECTION_NAME), {
                ...slide,
                createdAt: serverTimestamp()
            })
        );
        await Promise.all(promises);
        console.log('Initialized default hero slides');
    } catch (error) {
        console.error('Error initializing default slides:', error);
    }
}
