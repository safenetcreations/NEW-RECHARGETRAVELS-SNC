// Romance Landing Page Types for Honeymoons & Weddings

export interface RomanceLandingData {
  slug: string;
  seo: SEOData;
  hero: HeroData;
  honeymoons: HoneymoonSection;
  weddings: WeddingSection;
  activitiesAddOns: string[];
  testimonials: Testimonial[];
  faq: FAQItem[];
  cta: CTAData;
  contactForm: ContactFormData;
}

export interface SEOData {
  title: string;
  description: string;
  ogImageURL: string;
}

export interface HeroData {
  headline: string;
  subheadline: string;
  heroImageURL: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface HoneymoonSection {
  intro: string;
  tiers: HoneymoonTier[];
  sampleItineraries: SampleItinerary[];
}

export interface HoneymoonTier {
  id: string;
  name: string;
  priceFromUSD: number;
  nights: number;
  highlights: string[];
  whatsIncluded: string[];
  slug: string;
}

export interface SampleItinerary {
  title: string;
  days: ItineraryDay[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  detail: string;
}

export interface WeddingSection {
  intro: string;
  venues: WeddingVenue[];
  packages: WeddingPackage[];
  complianceNote: string;
  addOns: string[];
}

export interface WeddingVenue {
  type: string;
  examples: string[];
}

export interface WeddingPackage {
  id: string;
  name: string;
  priceFromUSD: number;
  guestsUpTo: number;
  includes: string[];
  slug: string;
}

export interface Testimonial {
  name: string;
  text: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface CTAData {
  headline: string;
  button: string;
}

export interface ContactFormData {
  successMessage: string;
}

// Package pricing from sub-collection
export interface LivePackage {
  id: string;
  pageSlug: string;
  name: string;
  type: 'honeymoon' | 'wedding';
  priceFromUSD: number;
  isPublished: boolean;
  lastUpdated: Date;
}