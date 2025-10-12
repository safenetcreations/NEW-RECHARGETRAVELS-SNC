// Experience Data Model Types for CMS Integration

export interface ExperienceSEO {
  title: string;
  description: string;
}

export interface ExperienceHighlight {
  icon: string;
  title: string;
  blurb60: string;
}

export interface ExperienceRoute {
  routeName: string;
  duration: string;
  distanceKm: number;
  bestClass: string;
  mapGPXUrl: string;
}

export interface ExperienceGalleryImage {
  url: string;
  alt: string;
}

export interface Experience {
  slug: string;
  name: string;
  heroImageURL: string;
  seo: ExperienceSEO;
  introParagraph: string;
  highlights: ExperienceHighlight[];
  routes: ExperienceRoute[];
  galleryImages: ExperienceGalleryImage[];
  faqTag: string;
  ctaHeadline: string;
  ctaSub: string;
  videoURL?: string;
}

// Tour data model for live pricing feed
export interface Tour {
  id?: string;
  experienceSlug: string;
  title: string;
  thumbnail: string;
  badges: string[];
  duration: string;
  salePriceUSD: number;
  regularPriceUSD?: number;
  isPublished: boolean;
  description?: string;
  highlights?: string[];
}

// FAQ data model
export interface FAQ {
  id?: string;
  tag: string;
  question: string;
  answer: string;
  order: number;
}