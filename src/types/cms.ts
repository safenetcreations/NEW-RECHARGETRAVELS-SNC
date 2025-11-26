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
  // Optional properties used in TravelPackages component
  discount?: string;
  reviews?: number;
  originalPrice?: string;
  bestFor?: string;
  destinations?: string[];
  highlights?: string[];
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
// Luxury Experiences Types
// ==========================================

export interface LuxuryExperience {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LuxuryExperienceFormData {
  title: string;
  description: string;
  image: string;
  link: string;
  order: number;
  isActive: boolean;
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
  // Optional properties used in TravelGuide component
  category?: string;
  readTime?: string;
  author?: string;
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
// Group Transport Types
// ==========================================

export interface GroupTransportHeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GroupTransportHeroSlideFormData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

export interface GroupTransportVehicle {
  id: string;
  name: string;
  capacity: string;
  features: string[];
  price: string;
  image: string;
  popular: boolean;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GroupTransportVehicleFormData {
  name: string;
  capacity: string;
  features: string[];
  price: string;
  image: string;
  popular: boolean;
  order: number;
  isActive: boolean;
}

export interface GroupTransportServiceFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight: string;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GroupTransportServiceFeatureFormData {
  title: string;
  description: string;
  icon: string;
  highlight: string;
  order: number;
  isActive: boolean;
}

export interface GroupTransportBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GroupTransportBenefitFormData {
  title: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface GroupTransportSettings {
  id: string;
  trustIndicators: {
    rating: string;
    reviews: string;
    support: string;
  };
  popularRoutes: string[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GroupTransportSettingsFormData {
  trustIndicators: {
    rating: string;
    reviews: string;
    support: string;
  };
  popularRoutes: string[];
  isActive: boolean;
}
