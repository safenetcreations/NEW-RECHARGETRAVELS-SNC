/**
 * Comprehensive Schema Markup Library for SEO
 * Google Rich Results & AI Overview Optimization
 *
 * This library provides all schema types needed for top Google rankings:
 * - Organization/LocalBusiness/TravelAgency
 * - FAQPage with structured Q&A
 * - HowTo with step-by-step guides
 * - Review/AggregateRating
 * - TouristTrip/TouristAttraction
 * - BreadcrumbList
 * - Event/TouristEvent
 * - Product/Service/Offer
 * - Person (for guides/team)
 * - VideoObject
 * - ImageGallery
 * - WebSite with SearchAction
 * - Speakable for voice search
 */

// ==========================================
// CONSTANTS
// ==========================================

export const COMPANY = {
  name: 'Recharge Travels',
  legalName: 'Recharge Travels & Tours (Pvt) Ltd',
  url: 'https://www.rechargetravels.com',
  logo: 'https://www.rechargetravels.com/logo-v2.png',
  image: 'https://i.imgur.com/AEnBWJf.jpeg',
  email: 'info@rechargetravels.com',
  phone: '+94777721999',
  phoneFormatted: '+94 77 772 1999',
  whatsapp: '+94777721999',
  foundingDate: '2018',
  slogan: 'Your Journey, Our Passion',
  description: 'Premier travel agency in Sri Lanka offering luxury tours, wildlife safaris, airport transfers, hotel bookings, and authentic cultural experiences.',
  address: {
    street: '123 Galle Road',
    city: 'Colombo',
    region: 'Western Province',
    postalCode: '00300',
    country: 'LK',
    countryName: 'Sri Lanka'
  },
  geo: {
    latitude: 6.9271,
    longitude: 79.8612
  },
  social: {
    facebook: 'https://www.facebook.com/rechargetravels',
    instagram: 'https://www.instagram.com/rechargetravels',
    youtube: 'https://www.youtube.com/@rechargetravelsltdColombo',
    twitter: 'https://twitter.com/rechargetravels',
    linkedin: 'https://www.linkedin.com/company/rechargetravels',
    tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g293962-d24145389-Reviews-Recharge_Travels-Colombo_Western_Province.html',
    pinterest: 'https://www.pinterest.com/rechargetravels'
  },
  rating: {
    value: 4.9,
    count: 2847,
    bestRating: 5,
    worstRating: 1
  }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export const getBaseUrl = (): string =>
  typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : COMPANY.url;

export const getCurrentUrl = (): string =>
  typeof window !== 'undefined' && window.location?.href
    ? window.location.href
    : COMPANY.url;

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
};

export const formatDuration = (days: number, nights?: number): string => {
  return `P${days}D`;
};

export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

// ==========================================
// ORGANIZATION SCHEMAS
// ==========================================

export const createOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  '@id': `${COMPANY.url}/#organization`,
  name: COMPANY.name,
  legalName: COMPANY.legalName,
  url: COMPANY.url,
  logo: {
    '@type': 'ImageObject',
    url: COMPANY.logo,
    width: '512',
    height: '512'
  },
  image: COMPANY.image,
  description: COMPANY.description,
  slogan: COMPANY.slogan,
  foundingDate: COMPANY.foundingDate,
  email: COMPANY.email,
  telephone: COMPANY.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address.street,
    addressLocality: COMPANY.address.city,
    addressRegion: COMPANY.address.region,
    postalCode: COMPANY.address.postalCode,
    addressCountry: COMPANY.address.country
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: COMPANY.geo.latitude,
    longitude: COMPANY.geo.longitude
  },
  areaServed: {
    '@type': 'Country',
    name: 'Sri Lanka'
  },
  priceRange: '$$-$$$',
  currenciesAccepted: 'USD, EUR, GBP, LKR',
  paymentAccepted: 'Cash, Credit Card, Debit Card, Bank Transfer, PayPal',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59'
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: COMPANY.phone,
      contactType: 'customer service',
      areaServed: 'Worldwide',
      availableLanguage: ['English', 'Sinhala', 'Tamil', 'German', 'French']
    },
    {
      '@type': 'ContactPoint',
      telephone: COMPANY.phone,
      contactType: 'reservations',
      areaServed: 'Worldwide',
      availableLanguage: ['English', 'Sinhala', 'Tamil']
    },
    {
      '@type': 'ContactPoint',
      telephone: COMPANY.phone,
      contactType: 'emergency',
      areaServed: 'Sri Lanka',
      availableLanguage: ['English', 'Sinhala', 'Tamil']
    }
  ],
  sameAs: Object.values(COMPANY.social),
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: COMPANY.rating.value,
    reviewCount: COMPANY.rating.count,
    bestRating: COMPANY.rating.bestRating,
    worstRating: COMPANY.rating.worstRating
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Sri Lanka Travel Services',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Tours & Experiences',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'TouristTrip', name: 'Wildlife Safaris' }},
          { '@type': 'Offer', itemOffered: { '@type': 'TouristTrip', name: 'Cultural Tours' }},
          { '@type': 'Offer', itemOffered: { '@type': 'TouristTrip', name: 'Beach Holidays' }},
          { '@type': 'Offer', itemOffered: { '@type': 'TouristTrip', name: 'Hill Country Tours' }},
          { '@type': 'Offer', itemOffered: { '@type': 'TouristTrip', name: 'Ayurveda & Wellness' }}
        ]
      },
      {
        '@type': 'OfferCatalog',
        name: 'Transportation',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'TaxiService', name: 'Airport Transfers' }},
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Private Tours' }},
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Group Transport' }}
        ]
      }
    ]
  }
});

export const createLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${COMPANY.url}/#localbusiness`,
  name: COMPANY.name,
  image: COMPANY.image,
  url: COMPANY.url,
  telephone: COMPANY.phone,
  email: COMPANY.email,
  priceRange: '$$-$$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address.street,
    addressLocality: COMPANY.address.city,
    addressRegion: COMPANY.address.region,
    postalCode: COMPANY.address.postalCode,
    addressCountry: COMPANY.address.country
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: COMPANY.geo.latitude,
    longitude: COMPANY.geo.longitude
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: COMPANY.rating.value,
    reviewCount: COMPANY.rating.count,
    bestRating: COMPANY.rating.bestRating,
    worstRating: COMPANY.rating.worstRating
  },
  sameAs: Object.values(COMPANY.social)
});

// ==========================================
// FAQ SCHEMA
// ==========================================

export interface FAQItem {
  question: string;
  answer: string;
}

export const createFAQSchema = (faqs: FAQItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

// ==========================================
// HOWTO SCHEMA
// ==========================================

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

export const createHowToSchema = (
  name: string,
  description: string,
  steps: HowToStep[],
  options?: {
    totalTime?: string; // ISO 8601 duration e.g., "PT30M"
    estimatedCost?: { value: number; currency: string };
    image?: string;
    tool?: string[];
    supply?: string[];
  }
) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name,
  description,
  image: options?.image,
  totalTime: options?.totalTime,
  estimatedCost: options?.estimatedCost ? {
    '@type': 'MonetaryAmount',
    currency: options.estimatedCost.currency,
    value: options.estimatedCost.value
  } : undefined,
  tool: options?.tool?.map(t => ({ '@type': 'HowToTool', name: t })),
  supply: options?.supply?.map(s => ({ '@type': 'HowToSupply', name: s })),
  step: steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.name,
    text: step.text,
    image: step.image,
    url: step.url
  }))
});

// Common HowTo schemas for travel booking
export const createBookTourHowTo = () => createHowToSchema(
  'How to Book a Tour in Sri Lanka',
  'Step-by-step guide to booking your perfect Sri Lanka tour with Recharge Travels',
  [
    {
      name: 'Choose Your Tour Type',
      text: 'Browse our selection of tours including Wildlife Safaris, Cultural Tours, Beach Holidays, Hill Country Adventures, and Wellness Retreats. Consider your interests, budget, and available time.',
      url: `${COMPANY.url}/tours`
    },
    {
      name: 'Select Your Dates',
      text: 'Check the best time to visit based on your chosen activities. December to March is ideal for the west coast, while April to September is perfect for the east coast.',
      url: `${COMPANY.url}/travel-guide`
    },
    {
      name: 'Customize Your Itinerary',
      text: 'Work with our travel experts to personalize your tour. Add extra activities, upgrade accommodations, or extend your stay.',
      url: `${COMPANY.url}/custom-experience`
    },
    {
      name: 'Submit Your Booking Request',
      text: 'Fill out the booking form with your details, preferences, and any special requirements. Our team will respond within 2 hours.',
      url: `${COMPANY.url}/book-now`
    },
    {
      name: 'Confirm and Pay',
      text: 'Review your personalized quote, make a secure payment (25% deposit), and receive instant confirmation with your detailed itinerary.',
      url: `${COMPANY.url}/book-now`
    },
    {
      name: 'Prepare for Your Trip',
      text: 'Receive your comprehensive travel pack including visa information, packing list, and 24/7 WhatsApp support contact. Your adventure awaits!',
      url: `${COMPANY.url}/faq`
    }
  ],
  {
    totalTime: 'PT15M',
    estimatedCost: { value: 500, currency: 'USD' },
    image: `${COMPANY.url}/images/booking-guide.jpg`
  }
);

export const createBookTransferHowTo = () => createHowToSchema(
  'How to Book Airport Transfer in Sri Lanka',
  'Quick guide to booking reliable airport pickup and drop-off services',
  [
    {
      name: 'Enter Your Route',
      text: 'Select your pickup location (Colombo Airport CMB) and destination. Enter your flight details for accurate timing.',
      url: `${COMPANY.url}/transport/airport-transfers`
    },
    {
      name: 'Choose Your Vehicle',
      text: 'Select from our fleet of vehicles: Sedan for couples, SUV for families, Van for groups, or Luxury vehicles for VIP service.',
      url: `${COMPANY.url}/vehicles`
    },
    {
      name: 'Add Passenger Details',
      text: 'Enter passenger names, contact information, and any special requirements like child seats or wheelchair accessibility.',
      url: `${COMPANY.url}/transport/airport-transfers`
    },
    {
      name: 'Confirm Booking',
      text: 'Review your booking, make secure payment, and receive instant confirmation via email and WhatsApp.',
      url: `${COMPANY.url}/transport/airport-transfers`
    },
    {
      name: 'Meet Your Driver',
      text: 'Your driver will meet you at the arrivals hall with a name board. Track your driver in real-time via our WhatsApp updates.',
      url: `${COMPANY.url}/transport/airport-transfers`
    }
  ],
  {
    totalTime: 'PT5M',
    estimatedCost: { value: 35, currency: 'USD' },
    image: `${COMPANY.url}/images/airport-transfer.jpg`
  }
);

// ==========================================
// REVIEW SCHEMA
// ==========================================

export interface ReviewData {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  itemReviewed?: string;
}

export const createReviewSchema = (review: ReviewData) => ({
  '@context': 'https://schema.org',
  '@type': 'Review',
  author: {
    '@type': 'Person',
    name: review.author
  },
  reviewRating: {
    '@type': 'Rating',
    ratingValue: review.rating,
    bestRating: 5,
    worstRating: 1
  },
  reviewBody: review.reviewBody,
  datePublished: review.datePublished,
  itemReviewed: review.itemReviewed ? {
    '@type': 'TravelAgency',
    name: review.itemReviewed
  } : {
    '@type': 'TravelAgency',
    name: COMPANY.name,
    url: COMPANY.url
  }
});

export const createAggregateRatingSchema = (
  ratingValue: number,
  reviewCount: number,
  itemName?: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'AggregateRating',
  itemReviewed: {
    '@type': 'TravelAgency',
    name: itemName || COMPANY.name,
    url: COMPANY.url
  },
  ratingValue,
  reviewCount,
  bestRating: 5,
  worstRating: 1
});

// ==========================================
// TOURIST TRIP / TOUR SCHEMA
// ==========================================

export interface TourData {
  name: string;
  description: string;
  image: string | string[];
  duration: { days: number; nights: number };
  price: number;
  currency?: string;
  destinations: string[];
  highlights?: string[];
  included?: string[];
  category?: string;
  url?: string;
  rating?: { value: number; count: number };
}

export const createTouristTripSchema = (tour: TourData) => ({
  '@context': 'https://schema.org',
  '@type': 'TouristTrip',
  name: tour.name,
  description: tour.description,
  image: tour.image,
  touristType: tour.category || 'Leisure',
  duration: formatDuration(tour.duration.days, tour.duration.nights),
  offers: {
    '@type': 'Offer',
    price: formatPrice(tour.price),
    priceCurrency: tour.currency || 'USD',
    availability: 'https://schema.org/InStock',
    validFrom: new Date().toISOString(),
    url: tour.url || COMPANY.url,
    seller: {
      '@type': 'TravelAgency',
      name: COMPANY.name,
      url: COMPANY.url
    }
  },
  itinerary: {
    '@type': 'ItemList',
    itemListElement: tour.destinations.map((dest, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TouristDestination',
        name: dest
      }
    }))
  },
  provider: {
    '@type': 'TravelAgency',
    name: COMPANY.name,
    url: COMPANY.url,
    telephone: COMPANY.phone
  },
  ...(tour.rating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tour.rating.value,
      reviewCount: tour.rating.count,
      bestRating: 5,
      worstRating: 1
    }
  })
});

export const createTouristAttractionSchema = (attraction: {
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
}) => ({
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  name: attraction.name,
  description: attraction.description,
  image: attraction.image,
  geo: {
    '@type': 'GeoCoordinates',
    latitude: attraction.latitude,
    longitude: attraction.longitude
  },
  address: attraction.address ? {
    '@type': 'PostalAddress',
    addressCountry: 'LK',
    addressLocality: attraction.address
  } : undefined,
  openingHours: attraction.openingHours,
  priceRange: attraction.priceRange,
  url: attraction.url,
  isAccessibleForFree: false,
  publicAccess: true,
  ...(attraction.rating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: attraction.rating.value,
      reviewCount: attraction.rating.count,
      bestRating: 5,
      worstRating: 1
    }
  })
});

// ==========================================
// BREADCRUMB SCHEMA
// ==========================================

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const createBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});

// ==========================================
// EVENT SCHEMA
// ==========================================

export interface EventData {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  image?: string;
  price?: number;
  url?: string;
  performer?: string;
  organizer?: string;
}

export const createEventSchema = (event: EventData) => ({
  '@context': 'https://schema.org',
  '@type': 'TouristEvent',
  name: event.name,
  description: event.description,
  startDate: event.startDate,
  endDate: event.endDate || event.startDate,
  location: {
    '@type': 'Place',
    name: event.location,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'LK'
    }
  },
  image: event.image,
  offers: event.price ? {
    '@type': 'Offer',
    price: formatPrice(event.price),
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: event.url || COMPANY.url
  } : undefined,
  performer: event.performer ? {
    '@type': 'Person',
    name: event.performer
  } : undefined,
  organizer: {
    '@type': 'Organization',
    name: event.organizer || COMPANY.name,
    url: COMPANY.url
  }
});

// ==========================================
// SERVICE SCHEMA
// ==========================================

export interface ServiceData {
  name: string;
  description: string;
  price?: { from: number; to?: number };
  image?: string;
  url?: string;
  category?: string;
}

export const createServiceSchema = (service: ServiceData) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.name,
  description: service.description,
  provider: {
    '@type': 'TravelAgency',
    name: COMPANY.name,
    url: COMPANY.url
  },
  areaServed: {
    '@type': 'Country',
    name: 'Sri Lanka'
  },
  serviceType: service.category || 'Travel Services',
  image: service.image,
  url: service.url || COMPANY.url,
  offers: service.price ? {
    '@type': 'AggregateOffer',
    lowPrice: service.price.from,
    highPrice: service.price.to || service.price.from * 3,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  } : undefined
});

// ==========================================
// PERSON SCHEMA (For Guides/Team)
// ==========================================

export interface PersonData {
  name: string;
  jobTitle: string;
  description?: string;
  image?: string;
  languages?: string[];
  expertise?: string[];
  url?: string;
}

export const createPersonSchema = (person: PersonData) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: person.name,
  jobTitle: person.jobTitle,
  description: person.description,
  image: person.image,
  knowsLanguage: person.languages?.map(lang => ({
    '@type': 'Language',
    name: lang
  })),
  knowsAbout: person.expertise,
  worksFor: {
    '@type': 'TravelAgency',
    name: COMPANY.name,
    url: COMPANY.url
  },
  url: person.url
});

// ==========================================
// VIDEO SCHEMA
// ==========================================

export interface VideoData {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string; // ISO 8601
  contentUrl?: string;
  embedUrl?: string;
}

export const createVideoSchema = (video: VideoData) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: video.name,
  description: video.description,
  thumbnailUrl: video.thumbnailUrl,
  uploadDate: video.uploadDate,
  duration: video.duration,
  contentUrl: video.contentUrl,
  embedUrl: video.embedUrl,
  publisher: {
    '@type': 'Organization',
    name: COMPANY.name,
    logo: {
      '@type': 'ImageObject',
      url: COMPANY.logo
    }
  }
});

// ==========================================
// IMAGE GALLERY SCHEMA
// ==========================================

export const createImageGallerySchema = (images: Array<{
  url: string;
  caption: string;
  name?: string;
}>) => ({
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  image: images.map(img => ({
    '@type': 'ImageObject',
    url: img.url,
    caption: img.caption,
    name: img.name || img.caption
  }))
});

// ==========================================
// WEBSITE SCHEMA
// ==========================================

export const createWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${COMPANY.url}/#website`,
  name: COMPANY.name,
  url: COMPANY.url,
  description: COMPANY.description,
  publisher: {
    '@id': `${COMPANY.url}/#organization`
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${COMPANY.url}/search?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  },
  inLanguage: 'en-US'
});

// ==========================================
// WEBPAGE SCHEMA
// ==========================================

export const createWebPageSchema = (page: {
  name: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumbs?: BreadcrumbItem[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${page.url}/#webpage`,
  name: page.name,
  description: page.description,
  url: page.url,
  image: page.image,
  datePublished: page.datePublished,
  dateModified: page.dateModified || new Date().toISOString(),
  isPartOf: {
    '@id': `${COMPANY.url}/#website`
  },
  about: {
    '@id': `${COMPANY.url}/#organization`
  },
  breadcrumb: page.breadcrumbs ? createBreadcrumbSchema(page.breadcrumbs) : undefined,
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'ReadAction',
    target: [page.url]
  }
});

// ==========================================
// SPEAKABLE SCHEMA (For Voice Search/AI)
// ==========================================

export const createSpeakableSchema = (
  url: string,
  cssSelectors: string[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Speakable Content',
  url,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: cssSelectors
  }
});

// ==========================================
// PRODUCT SCHEMA
// ==========================================

export const createProductSchema = (product: {
  name: string;
  description: string;
  image: string | string[];
  price: number;
  sku?: string;
  brand?: string;
  category?: string;
  rating?: { value: number; count: number };
  url?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image,
  sku: product.sku,
  brand: {
    '@type': 'Brand',
    name: product.brand || COMPANY.name
  },
  category: product.category,
  offers: {
    '@type': 'Offer',
    price: formatPrice(product.price),
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: COMPANY.name
    },
    url: product.url || COMPANY.url
  },
  ...(product.rating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.value,
      reviewCount: product.rating.count,
      bestRating: 5,
      worstRating: 1
    }
  })
});

// ==========================================
// COLLECTION PAGE SCHEMA
// ==========================================

export const createCollectionPageSchema = (
  name: string,
  description: string,
  items: Array<{ name: string; url: string; image?: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  description,
  url: getCurrentUrl(),
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: item.url,
      name: item.name,
      image: item.image
    }))
  }
});

// ==========================================
// ARTICLE SCHEMA
// ==========================================

export const createArticleSchema = (article: {
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
  wordCount?: number;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.headline,
  description: article.description,
  image: article.image,
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  author: {
    '@type': 'Organization',
    name: article.author || COMPANY.name,
    url: COMPANY.url
  },
  publisher: {
    '@type': 'Organization',
    name: COMPANY.name,
    logo: {
      '@type': 'ImageObject',
      url: COMPANY.logo
    }
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': article.url
  },
  wordCount: article.wordCount
});

// ==========================================
// TAXI/TRANSFER SERVICE SCHEMA
// ==========================================

export const createTaxiServiceSchema = (transfer: {
  origin: string;
  destination: string;
  price: number;
  duration: string;
  distance: string;
  vehicleTypes?: string[];
}) => ({
  '@context': 'https://schema.org',
  '@type': ['TaxiService', 'TransportationService'],
  name: `${transfer.origin} to ${transfer.destination} Transfer`,
  description: `Private transfer from ${transfer.origin} to ${transfer.destination}. ${transfer.duration} drive, ${transfer.distance}.`,
  provider: {
    '@type': 'TravelAgency',
    name: COMPANY.name,
    url: COMPANY.url,
    telephone: COMPANY.phone
  },
  areaServed: {
    '@type': 'Country',
    name: 'Sri Lanka'
  },
  offers: {
    '@type': 'Offer',
    price: formatPrice(transfer.price),
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  },
  serviceOutput: {
    '@type': 'TaxiReservation',
    pickupLocation: {
      '@type': 'Place',
      name: transfer.origin
    },
    dropoffLocation: {
      '@type': 'Place',
      name: transfer.destination
    }
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: COMPANY.rating.value,
    reviewCount: COMPANY.rating.count
  }
});

// ==========================================
// HELPER TO COMBINE MULTIPLE SCHEMAS
// ==========================================

export const combineSchemas = (...schemas: object[]) => {
  return schemas.filter(Boolean);
};

// ==========================================
// JSON-LD SCRIPT GENERATOR
// ==========================================

export const generateJsonLdScript = (schema: object | object[]): string => {
  return JSON.stringify(Array.isArray(schema) ? schema : schema);
};

export default {
  COMPANY,
  getBaseUrl,
  getCurrentUrl,
  createOrganizationSchema,
  createLocalBusinessSchema,
  createFAQSchema,
  createHowToSchema,
  createBookTourHowTo,
  createBookTransferHowTo,
  createReviewSchema,
  createAggregateRatingSchema,
  createTouristTripSchema,
  createTouristAttractionSchema,
  createBreadcrumbSchema,
  createEventSchema,
  createServiceSchema,
  createPersonSchema,
  createVideoSchema,
  createImageGallerySchema,
  createWebsiteSchema,
  createWebPageSchema,
  createSpeakableSchema,
  createProductSchema,
  createCollectionPageSchema,
  createArticleSchema,
  createTaxiServiceSchema,
  combineSchemas,
  generateJsonLdScript
};
