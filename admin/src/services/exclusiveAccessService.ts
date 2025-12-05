import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
    getDoc,
    setDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ============ INTERFACES ============
export interface ExclusiveAccessHero {
    id?: string;
    image: string;
    title: string;
    subtitle: string;
    description: string;
    isActive: boolean;
    createdAt?: any;
    updatedAt?: any;
}

export interface ExclusiveExperience {
    id?: string;
    name: string;
    location: string;
    description: string;
    whatMakesItExclusive: string;
    image: string;
    categoryId: string;
    order: number;
    isActive: boolean;
    createdAt?: any;
    updatedAt?: any;
}

export interface ExperienceCategory {
    id?: string;
    name: string;
    icon: string;
    tagline: string;
    order: number;
    isActive: boolean;
    createdAt?: any;
}

// ============ COLLECTION NAMES ============
const HERO_COLLECTION = 'exclusiveAccessHero';
const EXPERIENCES_COLLECTION = 'exclusiveAccessExperiences';
const CATEGORIES_COLLECTION = 'exclusiveAccessCategories';

// ============ DEFAULT DATA ============
export const DEFAULT_HERO: ExclusiveAccessHero = {
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1920&q=90',
    title: 'Exclusive Access',
    subtitle: 'Beyond the velvet rope',
    description: 'Private temple blessings. Museum after-hours. Cultural immersions through relationships that took decades to build. Access that money alone cannot buy.',
    isActive: true
};

export const DEFAULT_CATEGORIES: ExperienceCategory[] = [
    { name: 'Sacred Privileges', icon: 'Church', tagline: 'Where faith meets reverence', order: 1, isActive: true },
    { name: 'Cultural Treasures', icon: 'Palette', tagline: 'Behind the velvet rope', order: 2, isActive: true },
    { name: 'Living Heritage', icon: 'BookOpen', tagline: 'Traditions preserved in time', order: 3, isActive: true },
    { name: 'Natural Sanctuaries', icon: 'TreeDeciduous', tagline: 'Nature\'s inner chambers', order: 4, isActive: true }
];

export const DEFAULT_EXPERIENCES: Omit<ExclusiveExperience, 'id' | 'createdAt' | 'updatedAt'>[] = [
    // Sacred Privileges
    {
        name: 'Private Temple Blessing',
        location: 'Temple of the Tooth, Kandy',
        description: 'A private blessing ceremony in the inner sanctum of Sri Lanka\'s holiest site—where the Sacred Tooth Relic of Buddha resides.',
        whatMakesItExclusive: 'This privilege is extended to heads of state and spiritual leaders. We are one of the few permitted to arrange this for private guests.',
        image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=90',
        categoryId: 'Sacred Privileges',
        order: 1,
        isActive: true
    },
    {
        name: 'Monastic Immersion',
        location: 'Ancient Forest Monastery',
        description: 'Spend a day in the life of Buddhist monks at a remote forest hermitage. Participate in dawn meditations and receive personal teachings.',
        whatMakesItExclusive: 'This monastery accepts no visitors. Our relationship with the abbot makes this singular access possible.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=90',
        categoryId: 'Sacred Privileges',
        order: 2,
        isActive: true
    },
    {
        name: 'Hindu Temple Consecration',
        location: 'Nallur Kandaswamy, Jaffna',
        description: 'Witness the ancient Kumbhabhishekam ceremony—the consecration ritual that occurs once every twelve years.',
        whatMakesItExclusive: 'Active participation requires explicit permission from the temple trust, granted through our community relationships.',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=90',
        categoryId: 'Sacred Privileges',
        order: 3,
        isActive: true
    },
    // Cultural Treasures
    {
        name: 'Museum After Hours',
        location: 'National Museum, Colombo',
        description: 'A private evening tour with the museum director, examining artifacts not on public display. Dinner served in the throne room.',
        whatMakesItExclusive: 'Private after-hours access requires ministerial approval. We maintain the relationships that make this possible.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=90',
        categoryId: 'Cultural Treasures',
        order: 1,
        isActive: true
    },
    {
        name: 'Royal Archive Access',
        location: 'Department of National Archives',
        description: 'Examine centuries-old palm leaf manuscripts, royal correspondence, and colonial maps in the climate-controlled vaults.',
        whatMakesItExclusive: 'Archive access is restricted to academic researchers. Our cultural partnerships extend this privilege.',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90',
        categoryId: 'Cultural Treasures',
        order: 2,
        isActive: true
    },
    {
        name: 'Artist Studio Visits',
        location: 'Private Studios, Island-wide',
        description: 'Enter the private studios of Sri Lanka\'s most celebrated artists. Watch masters at work. Commission pieces created in your presence.',
        whatMakesItExclusive: 'These artists do not accept visitors. Our personal relationships open these doors.',
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&q=90',
        categoryId: 'Cultural Treasures',
        order: 3,
        isActive: true
    },
    // Living Heritage
    {
        name: 'Royal Kandyan Dance Lineage',
        location: 'Ancestral Dance School',
        description: 'Train with the direct descendants of court dancers who performed for Kandyan kings. Learn the sacred rituals.',
        whatMakesItExclusive: 'This family has guarded their traditions for centuries. Our relationship spans three generations.',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=90',
        categoryId: 'Living Heritage',
        order: 1,
        isActive: true
    },
    {
        name: 'Master Craftsman Sessions',
        location: 'Heritage Workshops',
        description: 'Work alongside Sri Lanka\'s designated "Living National Treasures"—master craftsmen in woodcarving, metalwork, and textile arts.',
        whatMakesItExclusive: 'These masters accept no apprentices. Through our heritage foundation partnerships, we arrange what would otherwise be impossible.',
        image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=90',
        categoryId: 'Living Heritage',
        order: 2,
        isActive: true
    },
    {
        name: 'Ayurvedic Master Consultation',
        location: 'Traditional Physician\'s Home',
        description: 'Consult with a vaidya whose family has practiced Ayurvedic medicine for 14 generations. Receive a full traditional diagnosis.',
        whatMakesItExclusive: 'These traditional physicians see only referred patients. Our introduction opens ancestral doors.',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90',
        categoryId: 'Living Heritage',
        order: 3,
        isActive: true
    },
    // Natural Sanctuaries
    {
        name: 'Research Station Access',
        location: 'Sinharaja Rainforest',
        description: 'Join conservation scientists at their remote research station deep within Sri Lanka\'s last primeval rainforest.',
        whatMakesItExclusive: 'Active research stations are closed to visitors. Our conservation partnerships enable this scientific immersion.',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=90',
        categoryId: 'Natural Sanctuaries',
        order: 1,
        isActive: true
    },
    {
        name: 'Elephant Corridor Dawn',
        location: 'Undisclosed Location',
        description: 'At a secret location known to few, witness wild elephants crossing an ancient migration corridor at first light.',
        whatMakesItExclusive: 'This location is protected information. Our wildlife conservation work grants us access that protects both elephants and the secret.',
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&q=90',
        categoryId: 'Natural Sanctuaries',
        order: 2,
        isActive: true
    },
    {
        name: 'Marine Research Dive',
        location: 'Protected Reef Systems',
        description: 'Dive with marine biologists in reef systems closed to recreational divers. Participate in coral surveys.',
        whatMakesItExclusive: 'These marine sanctuaries are strictly protected. Our research partnerships enable scientific-level access.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=90',
        categoryId: 'Natural Sanctuaries',
        order: 3,
        isActive: true
    }
];

// ============ HERO FUNCTIONS ============
export async function getExclusiveAccessHero(): Promise<ExclusiveAccessHero> {
    try {
        const docRef = doc(db, HERO_COLLECTION, 'main');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as ExclusiveAccessHero;
        }
        return DEFAULT_HERO;
    } catch (error) {
        console.error('Error fetching exclusive access hero:', error);
        return DEFAULT_HERO;
    }
}

export async function updateExclusiveAccessHero(heroData: Omit<ExclusiveAccessHero, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, HERO_COLLECTION, 'main');
        await setDoc(docRef, {
            ...heroData,
            updatedAt: serverTimestamp()
        }, { merge: true });
        return { success: true };
    } catch (error) {
        console.error('Error updating exclusive access hero:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// ============ CATEGORIES FUNCTIONS ============
export async function getExperienceCategories(): Promise<ExperienceCategory[]> {
    try {
        const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return DEFAULT_CATEGORIES;
        }

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as ExperienceCategory));
    } catch (error) {
        console.error('Error fetching experience categories:', error);
        return DEFAULT_CATEGORIES;
    }
}

export async function addExperienceCategory(category: Omit<ExperienceCategory, 'id' | 'createdAt'>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
            ...category,
            createdAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error adding category:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function updateExperienceCategory(id: string, category: Partial<ExperienceCategory>): Promise<{ success: boolean; error?: string }> {
    try {
        await updateDoc(doc(db, CATEGORIES_COLLECTION, id), {
            ...category,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating category:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function deleteExperienceCategory(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// ============ EXPERIENCES FUNCTIONS ============
export async function getExclusiveExperiences(): Promise<ExclusiveExperience[]> {
    try {
        const q = query(collection(db, EXPERIENCES_COLLECTION), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // Return default experiences with generated IDs
            return DEFAULT_EXPERIENCES.map((exp, idx) => ({
                ...exp,
                id: `default-${idx}`
            }));
        }

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as ExclusiveExperience));
    } catch (error) {
        console.error('Error fetching exclusive experiences:', error);
        return DEFAULT_EXPERIENCES.map((exp, idx) => ({
            ...exp,
            id: `default-${idx}`
        }));
    }
}

export async function addExclusiveExperience(experience: Omit<ExclusiveExperience, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const docRef = await addDoc(collection(db, EXPERIENCES_COLLECTION), {
            ...experience,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error adding experience:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function updateExclusiveExperience(id: string, experience: Partial<ExclusiveExperience>): Promise<{ success: boolean; error?: string }> {
    try {
        await updateDoc(doc(db, EXPERIENCES_COLLECTION, id), {
            ...experience,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating experience:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function deleteExclusiveExperience(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await deleteDoc(doc(db, EXPERIENCES_COLLECTION, id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting experience:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// ============ INITIALIZATION ============
export async function initializeExclusiveAccessData(): Promise<{ success: boolean; error?: string }> {
    try {
        // Initialize hero
        const heroRef = doc(db, HERO_COLLECTION, 'main');
        const heroSnap = await getDoc(heroRef);
        if (!heroSnap.exists()) {
            await setDoc(heroRef, {
                ...DEFAULT_HERO,
                createdAt: serverTimestamp()
            });
        }

        // Initialize categories
        const categoriesSnap = await getDocs(collection(db, CATEGORIES_COLLECTION));
        if (categoriesSnap.empty) {
            const categoryPromises = DEFAULT_CATEGORIES.map(cat =>
                addDoc(collection(db, CATEGORIES_COLLECTION), {
                    ...cat,
                    createdAt: serverTimestamp()
                })
            );
            await Promise.all(categoryPromises);
        }

        // Initialize experiences
        const experiencesSnap = await getDocs(collection(db, EXPERIENCES_COLLECTION));
        if (experiencesSnap.empty) {
            const experiencePromises = DEFAULT_EXPERIENCES.map(exp =>
                addDoc(collection(db, EXPERIENCES_COLLECTION), {
                    ...exp,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            );
            await Promise.all(experiencePromises);
        }

        return { success: true };
    } catch (error) {
        console.error('Error initializing exclusive access data:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
