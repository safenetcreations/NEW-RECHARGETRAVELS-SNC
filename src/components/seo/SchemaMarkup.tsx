/**
 * SchemaMarkup Component
 * Easily inject structured data schemas into any page
 * Supports all schema types for Google Rich Results
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  createOrganizationSchema,
  createLocalBusinessSchema,
  createFAQSchema,
  createHowToSchema,
  createBookTourHowTo,
  createBookTransferHowTo,
  createTouristTripSchema,
  createTouristAttractionSchema,
  createBreadcrumbSchema,
  createEventSchema,
  createServiceSchema,
  createPersonSchema,
  createVideoSchema,
  createWebsiteSchema,
  createWebPageSchema,
  createSpeakableSchema,
  createProductSchema,
  createCollectionPageSchema,
  createArticleSchema,
  createTaxiServiceSchema,
  createAggregateRatingSchema,
  type FAQItem,
  type HowToStep,
  type TourData,
  type BreadcrumbItem,
  type EventData,
  type ServiceData,
  type PersonData,
  type VideoData
} from '@/utils/schemaMarkup';

interface SchemaMarkupProps {
  schemas: Array<{
    type: string;
    data?: any;
  }>;
}

/**
 * Single schema injection component
 */
export const Schema: React.FC<{ schema: object }> = ({ schema }) => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  </Helmet>
);

/**
 * Multiple schemas injection component
 */
export const MultiSchema: React.FC<{ schemas: object[] }> = ({ schemas }) => (
  <Helmet>
    {schemas.map((schema, index) => (
      <script key={index} type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    ))}
  </Helmet>
);

/**
 * Organization Schema Component
 */
export const OrganizationSchema: React.FC = () => (
  <Schema schema={createOrganizationSchema()} />
);

/**
 * Local Business Schema Component
 */
export const LocalBusinessSchema: React.FC = () => (
  <Schema schema={createLocalBusinessSchema()} />
);

/**
 * FAQ Schema Component
 */
export const FAQSchema: React.FC<{ faqs: FAQItem[] }> = ({ faqs }) => (
  <Schema schema={createFAQSchema(faqs)} />
);

/**
 * HowTo Schema Component
 */
export const HowToSchema: React.FC<{
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
  estimatedCost?: { value: number; currency: string };
  image?: string;
}> = ({ name, description, steps, totalTime, estimatedCost, image }) => (
  <Schema schema={createHowToSchema(name, description, steps, { totalTime, estimatedCost, image })} />
);

/**
 * Pre-built Book Tour HowTo Schema
 */
export const BookTourHowToSchema: React.FC = () => (
  <Schema schema={createBookTourHowTo()} />
);

/**
 * Pre-built Book Transfer HowTo Schema
 */
export const BookTransferHowToSchema: React.FC = () => (
  <Schema schema={createBookTransferHowTo()} />
);

/**
 * Tourist Trip Schema Component
 */
export const TouristTripSchema: React.FC<{ tour: TourData }> = ({ tour }) => (
  <Schema schema={createTouristTripSchema(tour)} />
);

/**
 * Tourist Attraction Schema Component
 */
export const TouristAttractionSchema: React.FC<{
  name: string;
  description: string;
  image: string | string[];
  latitude: number;
  longitude: number;
  address?: string;
  openingHours?: string;
  priceRange?: string;
  rating?: { value: number; count: number };
  url?: string;
}> = (props) => (
  <Schema schema={createTouristAttractionSchema(props)} />
);

/**
 * Breadcrumb Schema Component
 */
export const BreadcrumbSchema: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <Schema schema={createBreadcrumbSchema(items)} />
);

/**
 * Event Schema Component
 */
export const EventSchema: React.FC<{ event: EventData }> = ({ event }) => (
  <Schema schema={createEventSchema(event)} />
);

/**
 * Service Schema Component
 */
export const ServiceSchema: React.FC<{ service: ServiceData }> = ({ service }) => (
  <Schema schema={createServiceSchema(service)} />
);

/**
 * Person Schema Component
 */
export const PersonSchema: React.FC<{ person: PersonData }> = ({ person }) => (
  <Schema schema={createPersonSchema(person)} />
);

/**
 * Video Schema Component
 */
export const VideoSchema: React.FC<{ video: VideoData }> = ({ video }) => (
  <Schema schema={createVideoSchema(video)} />
);

/**
 * Website Schema Component
 */
export const WebsiteSchema: React.FC = () => (
  <Schema schema={createWebsiteSchema()} />
);

/**
 * WebPage Schema Component
 */
export const WebPageSchema: React.FC<{
  name: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumbs?: BreadcrumbItem[];
}> = (props) => (
  <Schema schema={createWebPageSchema(props)} />
);

/**
 * Speakable Schema Component (for voice search/AI)
 */
export const SpeakableSchema: React.FC<{
  url: string;
  cssSelectors: string[];
}> = ({ url, cssSelectors }) => (
  <Schema schema={createSpeakableSchema(url, cssSelectors)} />
);

/**
 * Product Schema Component
 */
export const ProductSchema: React.FC<{
  name: string;
  description: string;
  image: string | string[];
  price: number;
  sku?: string;
  brand?: string;
  category?: string;
  rating?: { value: number; count: number };
  url?: string;
}> = (props) => (
  <Schema schema={createProductSchema(props)} />
);

/**
 * Collection Page Schema Component
 */
export const CollectionPageSchema: React.FC<{
  name: string;
  description: string;
  items: Array<{ name: string; url: string; image?: string }>;
}> = ({ name, description, items }) => (
  <Schema schema={createCollectionPageSchema(name, description, items)} />
);

/**
 * Article Schema Component
 */
export const ArticleSchema: React.FC<{
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
  wordCount?: number;
}> = (props) => (
  <Schema schema={createArticleSchema(props)} />
);

/**
 * Taxi Service Schema Component
 */
export const TaxiServiceSchema: React.FC<{
  origin: string;
  destination: string;
  price: number;
  duration: string;
  distance: string;
  vehicleTypes?: string[];
}> = (props) => (
  <Schema schema={createTaxiServiceSchema(props)} />
);

/**
 * Aggregate Rating Schema Component
 */
export const AggregateRatingSchema: React.FC<{
  ratingValue: number;
  reviewCount: number;
  itemName?: string;
}> = ({ ratingValue, reviewCount, itemName }) => (
  <Schema schema={createAggregateRatingSchema(ratingValue, reviewCount, itemName)} />
);

/**
 * Comprehensive Page Schema - Combines multiple schemas for a complete page
 */
export const ComprehensivePageSchema: React.FC<{
  pageType?: 'home' | 'tour' | 'destination' | 'service' | 'article' | 'faq' | 'contact';
  pageName: string;
  pageDescription: string;
  pageUrl: string;
  pageImage?: string;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FAQItem[];
  tour?: TourData;
  attraction?: {
    name: string;
    description: string;
    image: string | string[];
    latitude: number;
    longitude: number;
  };
  includeOrganization?: boolean;
  includeSpeakable?: boolean;
  speakableSelectors?: string[];
}> = ({
  pageType = 'home',
  pageName,
  pageDescription,
  pageUrl,
  pageImage,
  breadcrumbs,
  faqs,
  tour,
  attraction,
  includeOrganization = true,
  includeSpeakable = true,
  speakableSelectors = ['h1', '.hero-description', 'article p:first-of-type']
}) => {
  const schemas: object[] = [];

  // Always add WebPage schema
  schemas.push(createWebPageSchema({
    name: pageName,
    description: pageDescription,
    url: pageUrl,
    image: pageImage,
    breadcrumbs
  }));

  // Add breadcrumbs if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(createBreadcrumbSchema(breadcrumbs));
  }

  // Add organization schema on home page or if explicitly requested
  if (pageType === 'home' || includeOrganization) {
    schemas.push(createOrganizationSchema());
    schemas.push(createLocalBusinessSchema());
    schemas.push(createWebsiteSchema());
  }

  // Add FAQ schema if FAQs provided
  if (faqs && faqs.length > 0) {
    schemas.push(createFAQSchema(faqs));
  }

  // Add tour schema if tour data provided
  if (tour) {
    schemas.push(createTouristTripSchema(tour));
  }

  // Add attraction schema if attraction data provided
  if (attraction) {
    schemas.push(createTouristAttractionSchema(attraction));
  }

  // Add speakable schema for voice search
  if (includeSpeakable) {
    schemas.push(createSpeakableSchema(pageUrl, speakableSelectors));
  }

  return <MultiSchema schemas={schemas} />;
};

export default {
  Schema,
  MultiSchema,
  OrganizationSchema,
  LocalBusinessSchema,
  FAQSchema,
  HowToSchema,
  BookTourHowToSchema,
  BookTransferHowToSchema,
  TouristTripSchema,
  TouristAttractionSchema,
  BreadcrumbSchema,
  EventSchema,
  ServiceSchema,
  PersonSchema,
  VideoSchema,
  WebsiteSchema,
  WebPageSchema,
  SpeakableSchema,
  ProductSchema,
  CollectionPageSchema,
  ArticleSchema,
  TaxiServiceSchema,
  AggregateRatingSchema,
  ComprehensivePageSchema
};
