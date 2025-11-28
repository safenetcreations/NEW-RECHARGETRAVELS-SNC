/**
 * CMS Type Definitions
 * Type definitions for all landing page CMS collections
 */

import { Timestamp } from 'firebase/firestore';

// ==========================================
// Hero Section Types
// ==========================================

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
  ctaText?: string;
  ctaLink?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HeroSlideFormData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
  ctaText?: string;
  ctaLink?: string;
}

// ==========================================
// Testimonials Types
// ==========================================

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  text: string;
  tripType: string;
  date: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TestimonialFormData {
  name: string;
  location: string;
  image: string;
  rating: number;
  text: string;
  tripType: string;
  date: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

// ==========================================
// About Sri Lanka Types
// ==========================================

export interface AboutSriLankaContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  highlights: AboutHighlight[];
  stats: AboutStat[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AboutHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface AboutStat {
  value: string;
  label: string;
  icon?: string;
}

export interface AboutSriLankaFormData {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  highlights: AboutHighlight[];
  stats: AboutStat[];
  isActive: boolean;
}

// ==========================================
// Why Choose Us Types
// ==========================================

export interface WhyChooseUsFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WhyChooseUsFormData {
  icon: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

// ==========================================
// Travel Packages Types
// ==========================================

export interface TravelPackage {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  category: string;
  features: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  bestTimeToVisit: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  groupSize: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
}

export interface TravelPackageFormData {
  name: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  category: string;
  features: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  bestTimeToVisit: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  groupSize: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

// ==========================================
// Featured Destinations Types
// ==========================================

export interface FeaturedDestination {
  id: string;
  name: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  duration: string;
  rating: number;
  features: string[];
  link: string;
  bestTimeToVisit: string;
  popularActivities: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FeaturedDestinationFormData {
  name: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  duration: string;
  rating: number;
  features: string[];
  link: string;
  bestTimeToVisit: string;
  popularActivities: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

// ==========================================
// Blog Posts Types
// ==========================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  category: string;
  tags: string[];
  readTime: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedDate: Timestamp;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  category: string;
  tags: string[];
  readTime: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedDate: Date;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

// ==========================================
// Newsletter Configuration Types
// ==========================================

export interface NewsletterConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  placeholderText: string;
  buttonText: string;
  successMessage: string;
  errorMessage: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface NewsletterConfigFormData {
  title: string;
  subtitle: string;
  description: string;
  placeholderText: string;
  buttonText: string;
  successMessage: string;
  errorMessage: string;
  isActive: boolean;
}

// ==========================================
// Homepage Stats Types
// ==========================================

export interface HomepageStat {
  id: string;
  label: string;
  value: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HomepageStatFormData {
  label: string;
  value: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

// ==========================================
// Site Settings Types
// ==========================================

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  heroImages: HeroSlide[];
  contactEmail: string;
  contactPhone: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  maintenanceMode: boolean;
  updatedAt: Timestamp;
}

export interface SiteSettingsFormData {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  heroImages: HeroSlide[];
  contactEmail: string;
  contactPhone: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  maintenanceMode: boolean;
}

// ==========================================
// Media Library Types
// ==========================================

export interface MediaFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  dimensions?: {
    width: number;
    height: number;
  };
  alt: string;
  caption?: string;
  tags: string[];
  uploadedBy: string;
  createdAt: Timestamp;
}

export interface MediaFileFormData {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  dimensions?: {
    width: number;
    height: number;
  };
  alt: string;
  caption?: string;
  tags: string[];
}

// ==========================================
// Common Types
// ==========================================

export interface CMSResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

// ==========================================
// Luxury Experiences Types (Full Structure)
// ==========================================

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

export interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
  duration?: string;
}

export interface ExperienceItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: Activity[];
  meals?: string[];
  accommodation?: string;
  highlights?: string[];
}

export interface ExperienceLocation {
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

export interface ExperienceTestimonial {
  id: string;
  author: string;
  country: string;
  rating: number;
  comment: string;
  experienceDate: string;
  avatar?: string;
}

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

  // Itinerary (optional for day trips)
  itinerary?: ExperienceItineraryDay[];
  duration: string;
  groupSize: string;

  // Pricing
  price: {
    amount: number;
    currency: string;
    per: string; // "person", "group", "vehicle", "day"
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
  locations: ExperienceLocation[];
  startingPoint?: string;

  // Additional Info
  difficulty?: 'easy' | 'moderate' | 'challenging';
  ageRestrictions?: string;
  requirements?: string[];
  cancellationPolicy: string;

  // Testimonials (optional)
  testimonials?: ExperienceTestimonial[];

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
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
}

export interface LuxuryExperienceFormData {
  title: string;
  subtitle: string;
  category: ExperienceCategory;
  slug?: string; // Auto-generated from title

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
  itinerary?: ExperienceItineraryDay[];
  duration: string;
  groupSize: string;

  // Pricing
  price: {
    amount: number;
    currency: string;
    per: string;
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
    minimumNotice: number;
  };

  // Location
  locations: ExperienceLocation[];
  startingPoint?: string;

  // Additional Info
  difficulty?: 'easy' | 'moderate' | 'challenging';
  ageRestrictions?: string;
  requirements?: string[];
  cancellationPolicy: string;

  // Testimonials
  testimonials?: ExperienceTestimonial[];

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
}

// ==========================================
// Travel Guide Types
// ==========================================

export interface TravelGuideSection {
  id: string;
  title: string;
  content: string;
  image?: string;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TravelGuideFormData {
  title: string;
  content: string;
  image?: string;
  order: number;
  isActive: boolean;
}

// ==========================================
// Homepage Settings Types
// ==========================================

export interface HomepageSettings {
  id: string;
  featuredDestinationsBackgroundImage: string;
  updatedAt: Timestamp;
}

export interface HomepageSettingsFormData {
  featuredDestinationsBackgroundImage: string;
}
