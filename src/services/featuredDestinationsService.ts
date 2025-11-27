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

export interface FeaturedDestination {
    id?: string;
    name: string;
    emoji: string;
    image: string;
    to: string;
    createdAt?: any;
}

const COLLECTION_NAME = 'featuredDestinations';

// Default featured destinations with beautiful Sri Lankan images
export const DEFAULT_FEATURED_DESTINATIONS: Omit<FeaturedDestination, 'id' | 'createdAt'>[] = [
    {
        name: 'Mirissa',
        emoji: '🏖️',
        image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=200&fit=crop&q=80',
        to: '/destinations/mirissa'
    },
    {
        name: 'Nuwara Eliya',
        emoji: '🍵',
        image: 'https://images.unsplash.com/photo-1571296251827-6e6ce8929b48?w=400&h=200&fit=crop&q=80',
        to: '/destinations/nuwaraeliya'
    },
    {
        name: 'Ella',
        emoji: '⛰️',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&q=80',
        to: '/destinations/ella'
    }
];

export async function getFeaturedDestinations(): Promise<FeaturedDestination[]> {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'asc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            await initializeDefaultDestinations();
            return DEFAULT_FEATURED_DESTINATIONS.map((dest, index) => ({ ...dest, id: `default-${index}` }));
        }

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as FeaturedDestination));
    } catch (error) {
        console.error('Error fetching featured destinations:', error);
        return DEFAULT_FEATURED_DESTINATIONS.map((dest, index) => ({ ...dest, id: `default-${index}` }));
    }
}

export async function addFeaturedDestination(destination: Omit<FeaturedDestination, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> {
    try {
        await addDoc(collection(db, COLLECTION_NAME), {
            ...destination,
            createdAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error adding featured destination:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function updateFeaturedDestination(id: string, destination: Partial<FeaturedDestination>): Promise<{ success: boolean; error?: string }> {
    try {
        await updateDoc(doc(db, COLLECTION_NAME, id), destination);
        return { success: true };
    } catch (error) {
        console.error('Error updating featured destination:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function deleteFeaturedDestination(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting featured destination:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

async function initializeDefaultDestinations() {
    try {
        const promises = DEFAULT_FEATURED_DESTINATIONS.map(dest =>
            addDoc(collection(db, COLLECTION_NAME), {
                ...dest,
                createdAt: serverTimestamp()
            })
        );
        await Promise.all(promises);
        console.log('Initialized default featured destinations');
    } catch (error) {
        console.error('Error initializing default featured destinations:', error);
    }
}
