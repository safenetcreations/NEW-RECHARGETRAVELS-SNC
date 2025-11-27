import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Types
export interface HeroSlide {
    id?: string;
    image: string;
    title: string;
    subtitle: string;
    order?: number;
}

export interface Attraction {
    id?: string;
    name: string;
    description: string;
    image: string;
    category: string;
    rating: number;
    duration: string;
    price: string;
    featured?: boolean;
    order?: number;
}

export interface Activity {
    id?: string;
    name: string;
    description: string;
    icon: string;
    price: string;
    duration: string;
    popular?: boolean;
    order?: number;
}

export interface Restaurant {
    id?: string;
    name: string;
    description: string;
    image: string;
    cuisine: string;
    priceRange: string;
    rating: number;
    address: string;
    phone?: string;
    website?: string;
    featured?: boolean;
}

export interface Hotel {
    id?: string;
    name: string;
    description: string;
    image: string;
    starRating: number;
    priceRange: string;
    amenities: string[];
    address: string;
    phone?: string;
    website?: string;
    featured?: boolean;
}

export interface DestinationInfo {
    population: string;
    area: string;
    elevation: string;
    bestTime: string;
    language: string;
    currency: string;
}

export interface WeatherInfo {
    temperature: string;
    humidity: string;
    rainfall: string;
    season: string;
    bestMonths?: string[];
}

export interface TravelTip {
    id?: string;
    title: string;
    content: string;
    icon?: string;
    category: string;
}

export interface DestinationContent {
    id: string;
    name: string;
    slug: string;
    tagline?: string;
    description?: string;
    heroSlides: HeroSlide[];
    attractions: Attraction[];
    activities: Activity[];
    restaurants: Restaurant[];
    hotels: Hotel[];
    destinationInfo: DestinationInfo;
    weatherInfo: WeatherInfo;
    travelTips: TravelTip[];
    seo: {
        title: string;
        description: string;
        keywords: string[];
    };
    ctaSection?: {
        title: string;
        subtitle: string;
        buttonText: string;
    };
    isPublished: boolean;
    updatedAt?: any;
    createdAt?: any;
}

const COLLECTION_NAME = 'destinations';

// Default content template
export const DEFAULT_DESTINATION_CONTENT: Omit<DestinationContent, 'id' | 'name' | 'slug'> = {
    tagline: 'Discover the beauty of this destination',
    description: 'A wonderful destination waiting to be explored.',
    heroSlides: [
        {
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80',
            title: 'Welcome',
            subtitle: 'Discover Amazing Places'
        }
    ],
    attractions: [],
    activities: [],
    restaurants: [],
    hotels: [],
    destinationInfo: {
        population: 'Unknown',
        area: 'Unknown',
        elevation: 'Unknown',
        bestTime: 'Year-round',
        language: 'Sinhala, Tamil, English',
        currency: 'Sri Lankan Rupee (LKR)'
    },
    weatherInfo: {
        temperature: '25-30°C',
        humidity: '70-80%',
        rainfall: 'Moderate',
        season: 'Tropical'
    },
    travelTips: [],
    seo: {
        title: '',
        description: '',
        keywords: []
    },
    ctaSection: {
        title: 'Ready to Explore?',
        subtitle: 'Book your perfect experience with our expert guides',
        buttonText: 'Book Now'
    },
    isPublished: false
};

// Get all destinations
export async function getAllDestinations(): Promise<DestinationContent[]> {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as DestinationContent[];
    } catch (error) {
        console.error('Error getting destinations:', error);
        return [];
    }
}

// Get single destination by slug
export async function getDestinationBySlug(slug: string): Promise<DestinationContent | null> {
    try {
        const docRef = doc(db, COLLECTION_NAME, slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            } as DestinationContent;
        }
        return null;
    } catch (error) {
        console.error('Error getting destination:', error);
        return null;
    }
}

// Create or update destination
export async function saveDestination(
    slug: string,
    data: Partial<DestinationContent>
): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, COLLECTION_NAME, slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Update existing
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp()
            });
        } else {
            // Create new
            await setDoc(docRef, {
                ...DEFAULT_DESTINATION_CONTENT,
                ...data,
                slug,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }
        return { success: true };
    } catch (error) {
        console.error('Error saving destination:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Update hero slides
export async function updateHeroSlides(
    slug: string,
    heroSlides: HeroSlide[]
): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, COLLECTION_NAME, slug);
        await updateDoc(docRef, {
            heroSlides,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating hero slides:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Update attractions
export async function updateAttractions(
    slug: string,
    attractions: Attraction[]
): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, COLLECTION_NAME, slug);
        await updateDoc(docRef, {
            attractions,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating attractions:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Update activities
export async function updateActivities(
    slug: string,
    activities: Activity[]
): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, COLLECTION_NAME, slug);
        await updateDoc(docRef, {
            activities,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating activities:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Update restaurants
export async function updateRestaurants(
    slug: string,
    restaurants: Restaurant[]
): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, COLLECTION_NAME, slug);
        await updateDoc(docRef, {
            restaurants,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating restaurants:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Update hotels
export async function updateHotels(
    slug: string,
    hotels: Hotel[]
): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, COLLECTION_NAME, slug);
        await updateDoc(docRef, {
            hotels,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating hotels:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Update destination info
export async function updateDestinationInfo(
    slug: string,
    destinationInfo: DestinationInfo
): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, COLLECTION_NAME, slug);
        await updateDoc(docRef, {
            destinationInfo,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating destination info:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Update weather info
export async function updateWeatherInfo(
    slug: string,
    weatherInfo: WeatherInfo
): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, COLLECTION_NAME, slug);
        await updateDoc(docRef, {
            weatherInfo,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating weather info:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Update SEO settings
export async function updateSEO(
    slug: string,
    seo: { title: string; description: string; keywords: string[] }
): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, COLLECTION_NAME, slug);
        await updateDoc(docRef, {
            seo,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating SEO:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Update CTA section
export async function updateCTASection(
    slug: string,
    ctaSection: { title: string; subtitle: string; buttonText: string }
): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, COLLECTION_NAME, slug);
        await updateDoc(docRef, {
            ctaSection,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating CTA section:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Update travel tips
export async function updateTravelTips(
    slug: string,
    travelTips: TravelTip[]
): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, COLLECTION_NAME, slug);
        await updateDoc(docRef, {
            travelTips,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating travel tips:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Toggle publish status
export async function togglePublishStatus(
    slug: string,
    isPublished: boolean
): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, COLLECTION_NAME, slug);
        await updateDoc(docRef, {
            isPublished,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error toggling publish status:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Delete destination
export async function deleteDestination(
    slug: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, slug));
        return { success: true };
    } catch (error) {
        console.error('Error deleting destination:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Initialize a destination with default content
export async function initializeDestination(
    slug: string,
    name: string,
    customData?: Partial<DestinationContent>
): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, COLLECTION_NAME, slug);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(docRef, {
                ...DEFAULT_DESTINATION_CONTENT,
                ...customData,
                id: slug,
                name,
                slug,
                seo: {
                    title: `${name} - Sri Lanka | Travel Guide & Tours`,
                    description: `Discover ${name}'s top attractions, tours, and travel experiences. Plan your perfect visit to this beautiful destination in Sri Lanka.`,
                    keywords: [name, 'Sri Lanka', 'travel', 'tours', 'attractions']
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }
        return { success: true };
    } catch (error) {
        console.error('Error initializing destination:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Available icon options for activities
export const ACTIVITY_ICONS = [
    'Navigation',
    'Utensils',
    'ShoppingBag',
    'Sun',
    'Building',
    'Camera',
    'Coffee',
    'Train',
    'Hotel',
    'Heart',
    'Star',
    'Mountain',
    'Waves',
    'TreePine',
    'Bike',
    'Car',
    'Plane',
    'Anchor',
    'Map',
    'Compass'
];

// Attraction categories
export const ATTRACTION_CATEGORIES = [
    'Religious Sites',
    'Parks & Nature',
    'Museums',
    'Shopping',
    'Monuments',
    'Historical Sites',
    'Beaches',
    'Adventure',
    'Wildlife',
    'Cultural',
    'Entertainment'
];

// Cuisine types for restaurants
export const CUISINE_TYPES = [
    'Sri Lankan',
    'Indian',
    'Chinese',
    'Japanese',
    'Thai',
    'Italian',
    'Continental',
    'Seafood',
    'Vegetarian',
    'Fast Food',
    'Cafe',
    'Fine Dining',
    'Street Food'
];
