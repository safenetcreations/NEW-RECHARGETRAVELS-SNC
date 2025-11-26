export interface LuxuryExperience {
  id: string;
  title: string;
  subtitle: string;
  category: ExperienceCategory;
  slug: string;
  
  // Hero Section
  heroImage: string;
  heroVideo?: string;
  gallery: GalleryImage[];
  
  // Content
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  
  // What's Included
  inclusions: Inclusion[];
  exclusions: string[];
  
  // Itinerary
  itinerary?: ItineraryDay[];
  duration: string;
  groupSize: string;
  
  // Pricing
  price: {
    amount: number;
    currency: string;
    per: string; // "person", "group", "day"
    seasonal?: SeasonalPricing[];
  };
  
  // Availability
  availability: {
    type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'on-request';
    blackoutDates?: string[];
    seasonalAvailability?: {
      season: string;
      available: boolean;
    }[];
    minimumNotice: number; // hours
  };
  
  // Location
  locations: Location[];
  startingPoint?: string;
  
  // Additional Info
  difficulty?: 'easy' | 'moderate' | 'challenging';
  ageRestrictions?: string;
  requirements?: string[];
  cancellationPolicy: string;
  
  // Testimonials
  testimonials?: Testimonial[];
  
  // SEO
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  
  // Status
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  popular: boolean;
  new: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export type ExperienceCategory = 
  | 'luxury-safari'
  | 'photography-tours'
  | 'cultural-immersion'
  | 'wellness-retreats'
  | 'adventure-expeditions'
  | 'marine-adventures'
  | 'culinary-journeys'
  | 'romantic-escapes'
  | 'family-adventures'
  | 'exclusive-access';

export interface GalleryImage {
  url: string;
  alt: string;
  caption?: string;
  order: number;
}

export interface Inclusion {
  icon: string;
  title: string;
  description: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: Activity[];
  meals?: string[];
  accommodation?: string;
  highlights?: string[];
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
  duration?: string;
}

export interface Location {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: string;
}

export interface SeasonalPricing {
  season: string;
  startDate: string;
  endDate: string;
  amount: number;
  description?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  country: string;
  rating: number;
  comment: string;
  experienceDate: string;
  avatar?: string;
}

export interface CustomExperienceRequest {
  id: string;
  // Contact Info
  name: string;
  email: string;
  phone: string;
  country: string;
  
  // Trip Details
  preferredDates: {
    start: string;
    end: string;
    flexible: boolean;
  };
  groupSize: number;
  budget: {
    amount: number;
    currency: string;
    perPerson: boolean;
  };
  
  // Preferences
  interests: string[];
  experienceTypes: ExperienceCategory[];
  accommodationPreference: 'luxury' | 'boutique' | 'eco' | 'mixed';
  mealPreferences: string[];
  specialRequests: string;
  
  // Additional Info
  previousVisits: boolean;
  mobilityRequirements?: string;
  medicalConditions?: string;
  
  // Status
  status: 'new' | 'contacted' | 'planning' | 'confirmed' | 'completed';
  assignedTo?: string;
  notes?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
}
