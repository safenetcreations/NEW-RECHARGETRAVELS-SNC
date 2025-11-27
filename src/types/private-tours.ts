// Private Tours Types

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface TrustIndicators {
  rating: string;
  totalReviews: string;
  yearsExperience: string;
  toursCompleted: string;
  support: string;
}

export interface WhyChooseUsItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  benefit: string;
}

export interface CTASection {
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  whatsappNumber: string;
}

export interface PrivateToursPageContent {
  heroSlides: HeroSlide[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  trustIndicators: TrustIndicators;
  whyChooseUs: WhyChooseUsItem[];
  ctaSection: CTASection;
}

export interface PrivateTourCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface TourHighlight {
  title: string;
  description?: string;
  icon?: string;
}

export interface TourItineraryDay {
  day: number;
  title: string;
  description: string;
  highlights: string[];
  meals?: string[];
  accommodation?: string;
}

export interface TourInclusion {
  included: string[];
  excluded: string[];
}

export interface TourPricing {
  basePrice: number;
  currency: string;
  pricePerPerson?: number;
  groupDiscounts?: {
    minPeople: number;
    discountPercent: number;
  }[];
  seasonalPricing?: {
    season: 'peak' | 'off-peak' | 'shoulder';
    multiplier: number;
  }[];
}

export interface PrivateTourPackage {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  fullDescription: string;
  duration: {
    days: number;
    nights: number;
  };
  heroImage: string;
  gallery: string[];
  highlights: TourHighlight[];
  itinerary: TourItineraryDay[];
  inclusions: TourInclusion;
  pricing: TourPricing;
  maxGroupSize: number;
  minGroupSize: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  bestTime: string[];
  startLocations: string[];
  endLocations: string[];
  languages: string[];
  featured: boolean;
  popular: boolean;
  status: 'published' | 'draft';
  sortOrder: number;
  rating?: number;
  reviewCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface PrivateTourGuide {
  id: string;
  name: string;
  photo: string;
  languages: string[];
  specialties: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  bio: string;
  isActive: boolean;
  featured: boolean;
  certifications?: string[];
  vehicleTypes?: string[];
}

export interface PrivateTourTestimonial {
  id: string;
  name: string;
  country: string;
  avatar?: string;
  photo?: string;
  rating: number;
  tourType: string;
  packageId?: string;
  text: string;
  date: string;
  isApproved: boolean;
  featured: boolean;
}

export interface PrivateTourBooking {
  id: string;
  bookingReference: string;
  packageId: string;
  packageName: string;
  userId?: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
  };
  travelDetails: {
    startDate: string;
    endDate: string;
    adults: number;
    children: number;
    infants: number;
    pickupLocation: string;
    dropoffLocation: string;
    specialRequests?: string;
  };
  pricing: {
    basePrice: number;
    extras: number;
    discounts: number;
    taxes: number;
    totalPrice: number;
    currency: string;
  };
  extras?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  assignedGuideId?: string;
  adminNotes?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface TourExtra {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  icon: string;
  category: string;
}

// Form types for booking
export interface BookingFormData {
  packageId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  startDate: string;
  adults: number;
  children: number;
  infants: number;
  pickupLocation: string;
  dropoffLocation: string;
  specialRequests?: string;
  selectedExtras?: string[];
}

// Filter types
export interface PackageFilters {
  categoryId?: string;
  duration?: {
    min?: number;
    max?: number;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  difficulty?: string[];
  featured?: boolean;
  popular?: boolean;
}
