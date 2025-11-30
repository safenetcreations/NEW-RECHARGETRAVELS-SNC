export interface BeachTour {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    location: string;
    duration: string;
    price: number;
    image: string;
    rating: number;
    reviews: number;
    category: 'surfing' | 'diving' | 'snorkeling' | 'relaxation' | 'luxury' | 'family' | 'watersports';
    highlights: string[];
    itinerary?: { day: number; title: string; description: string }[];
    inclusions: string[];
    exclusions: string[];
    difficulty: 'easy' | 'moderate' | 'challenging';
    maxGroupSize: number;
    featured?: boolean;
    videoUrl?: string;
    gallery?: string[];
    bestSeason?: string;
    is_active: boolean;
    createdAt?: string;
}

export interface BeachBooking {
    id?: string;
    tourId: string;
    tourTitle: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    travelDate: string;
    guests: number;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    paymentStatus: 'unpaid' | 'paid';
    specialRequests?: string;
    createdAt: any; // Firestore timestamp
}
export interface Booking {
    tourId: string;
    tourTitle: string;
    date: string;
    guests: number;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    specialRequests: string;
}
