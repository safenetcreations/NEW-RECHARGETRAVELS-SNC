// Global Tour Booking Engine Types
// Comprehensive schema for RechargeTravels.com global tour system

import { Timestamp } from 'firebase/firestore';

// ==========================================
// GLOBAL TOUR SCHEMA
// ==========================================

export type TourRegion =
  | 'sri-lanka'
  | 'maldives'
  | 'india'
  | 'southeast-asia'
  | 'middle-east'
  | 'europe'
  | 'africa'
  | 'americas'
  | 'oceania';

export type TourCategory =
  | 'wildlife'
  | 'cultural'
  | 'beach'
  | 'adventure'
  | 'wellness'
  | 'pilgrimage'
  | 'honeymoon'
  | 'photography'
  | 'culinary'
  | 'luxury'
  | 'eco'
  | 'train'
  | 'safari';

export type DifficultyLevel = 'easy' | 'moderate' | 'challenging' | 'extreme';

export interface TourItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  highlights: string[];
  activities: string[];
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  accommodation?: string;
  transportMode?: string;
  distance?: string;
  duration?: string;
}

export interface TourHighlight {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TourFAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface GlobalTour {
  // Basic Info
  id: string;
  title: string;
  subtitle: string;
  slug: string;

  // Location
  region: TourRegion;
  country: string;
  location: string;
  startLocation: string;
  endLocation: string;
  mapCoordinates?: {
    lat: number;
    lng: number;
  };

  // Duration & Pricing
  duration: {
    days: number;
    nights: number;
  };
  priceUSD: number;
  originalPriceUSD?: number;
  pricePerPersonUSD?: number;
  currency: string;

  // Content
  description: string;
  shortDescription: string;
  highlights: TourHighlight[];
  itinerary: TourItineraryDay[];
  inclusions: string[];
  exclusions: string[];

  // Media
  heroImage: string;
  imageGallery: string[];
  youtubeVideoURL?: string;
  videoThumbnail?: string;

  // Categorization
  category: TourCategory;
  tags: string[];
  difficulty: DifficultyLevel;

  // Capacity
  minGroupSize: number;
  maxGroupSize: number;

  // Availability
  bestSeasons: string[];
  availableLanguages: string[];
  departureSchedule?: string[];

  // Status
  isFeatured: boolean;
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number;

  // Ratings
  rating?: number;
  reviewCount?: number;

  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];

  // FAQs
  faqs?: TourFAQ[];

  // Related
  relatedTourIds?: string[];

  // Timestamps
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// ==========================================
// BOOKING SCHEMA
// ==========================================

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';

export interface TourBookingCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  nationality: string;
  passportNumber?: string;
  dateOfBirth?: string;
  specialRequirements?: string;
}

export interface TourBookingTravelers {
  adults: number;
  children: number;
  infants: number;
  childrenAges?: number[];
}

export interface TourBookingPayment {
  totalAmountUSD: number;
  depositAmountUSD?: number;
  balanceAmountUSD?: number;
  discountAmountUSD?: number;
  discountCode?: string;
  currency: string;
  paymentMethod?: string;
  stripePaymentIntentId?: string;
  paidAt?: Timestamp | Date;
}

export interface GlobalTourBooking {
  // Identifiers
  id: string;
  bookingId: string;
  bookingReference: string;

  // Tour Info
  tourId: string;
  tourTitle: string;
  tourSlug: string;
  tourRegion: TourRegion;
  tourDuration: {
    days: number;
    nights: number;
  };

  // Customer Info
  customer: TourBookingCustomer;

  // Travel Details
  travelers: TourBookingTravelers;
  travelDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation?: string;
  flightDetails?: string;
  accommodationPreference?: string;

  // Notes
  additionalNotes?: string;
  adminNotes?: string;
  internalNotes?: string;

  // Status
  status: BookingStatus;
  paymentStatus: PaymentStatus;

  // Payment
  payment: TourBookingPayment;

  // Communication
  emailConfirmationSent?: boolean;
  whatsappConfirmationSent?: boolean;
  lastContactedAt?: Timestamp | Date;

  // Assignment
  assignedGuideId?: string;
  assignedGuideName?: string;
  assignedVehicleId?: string;

  // User reference (if logged in)
  userId?: string;

  // Timestamps
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// ==========================================
// FORM SCHEMAS (ZOD)
// ==========================================

export interface TourBookingFormData {
  // Tour selection
  tourId: string;

  // Customer info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  nationality: string;

  // Travelers
  adults: number;
  children: number;
  infants: number;

  // Travel details
  travelDate: string;
  pickupLocation: string;
  dropoffLocation?: string;
  flightDetails?: string;

  // Additional
  additionalNotes?: string;
  specialRequirements?: string;

  // Marketing
  howDidYouHear?: string;

  // Consent
  agreeToTerms: boolean;
  subscribeNewsletter?: boolean;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface TourListResponse {
  tours: GlobalTour[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface TourBookingResponse {
  success: boolean;
  bookingId: string;
  bookingReference: string;
  message: string;
  booking?: GlobalTourBooking;
}

// ==========================================
// FILTER TYPES
// ==========================================

export interface TourFilters {
  region?: TourRegion;
  category?: TourCategory;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  difficulty?: DifficultyLevel[];
  featured?: boolean;
  popular?: boolean;
  searchQuery?: string;
}

export interface BookingFilters {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  tourId?: string;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}

// ==========================================
// ADMIN TYPES
// ==========================================

export interface TourFormData extends Omit<GlobalTour, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export interface BookingUpdateData {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  adminNotes?: string;
  assignedGuideId?: string;
  assignedGuideName?: string;
}

// ==========================================
// STATISTICS TYPES
// ==========================================

export interface BookingStatistics {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  bookingsByMonth: { month: string; count: number; revenue: number }[];
  topTours: { tourId: string; tourTitle: string; bookings: number }[];
}
