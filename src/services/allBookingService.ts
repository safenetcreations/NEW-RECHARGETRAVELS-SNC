import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '@/lib/firebase';

// --- Types ---

export interface BaseBooking {
    id?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    bookingReference: string;
    createdAt?: any;
    specialRequests?: string;
    userId?: string;
}

export interface TourBooking extends BaseBooking {
    type: 'private-tour';
    destinations: string;
    duration: string;
    startDate: string;
    travelers: number;
    budget?: string;
    interests?: string;
}

export interface GroupBooking extends BaseBooking {
    type: 'group-transport';
    pickupLocation: string;
    dropoffLocation: string;
    date: string;
    time: string;
    passengers: number;
    vehicleType: 'minibus' | 'large-bus' | 'coach';
    occasion?: string;
}

export interface TrainBooking extends BaseBooking {
    type: 'train';
    route: string;
    date: string;
    time: string;
    passengers: number;
    class: '1st-class' | '2nd-class' | 'observation';
    returnDate?: string;
}

// --- Collections ---
const COLLECTIONS = {
    'private-tour': 'tourBookings',
    'group-transport': 'groupBookings',
    'train': 'trainBookings'
};

// --- Helpers ---
function generateReference(prefix: string): string {
    const timestamp = Date.now().toString(36).substring(4);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

// --- Actions ---

export async function createBooking(
    type: 'private-tour' | 'group-transport' | 'train',
    data: any
): Promise<{ success: boolean; bookingId?: string; bookingReference?: string; error?: string }> {
    try {
        // Create/Get User
        const functions = getFunctions();
        const getOrCreateUser = httpsCallable(functions, 'getOrCreateUser');

        let userId = null;
        try {
            const result = await getOrCreateUser({
                email: data.contactEmail,
                name: data.contactName,
                phone: data.contactPhone
            });
            userId = (result.data as any).userId;
        } catch (userError) {
            console.error('Error creating user:', userError);
        }

        const prefix = type === 'private-tour' ? 'TOUR' : type === 'group-transport' ? 'GRP' : 'TRN';
        const bookingReference = generateReference(prefix);

        const bookingData = {
            ...data,
            type,
            status: 'pending',
            bookingReference,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId: userId || undefined
        };

        const collectionName = COLLECTIONS[type];
        const docRef = await addDoc(collection(db, collectionName), bookingData);

        return {
            success: true,
            bookingId: docRef.id,
            bookingReference
        };
    } catch (error) {
        console.error(`Error creating ${type} booking:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function getBookings(type: 'private-tour' | 'group-transport' | 'train') {
    try {
        const collectionName = COLLECTIONS[type];
        const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`Error fetching ${type} bookings:`, error);
        return [];
    }
}

export async function updateBookingStatus(
    type: 'private-tour' | 'group-transport' | 'train',
    id: string,
    status: string
) {
    try {
        const collectionName = COLLECTIONS[type];
        await updateDoc(doc(db, collectionName, id), {
            status,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function deleteBooking(
    type: 'private-tour' | 'group-transport' | 'train',
    id: string
) {
    try {
        const collectionName = COLLECTIONS[type];
        await deleteDoc(doc(db, collectionName, id));
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Email trigger (calls the same function endpoint, we'll handle type logic there)
export async function sendConfirmationEmail(bookingId: string, type: string) {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_FIREBASE_FUNCTIONS_URL}/sendBookingEmail`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId, type }),
            }
        );
        if (!response.ok) throw new Error('Failed to send email');
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}
