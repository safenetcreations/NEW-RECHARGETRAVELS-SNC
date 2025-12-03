import { PopularRoute } from '@/data/popularRoutes';
import { buildAggregateRating, buildBrand, getBaseUrl } from './seoSchemaHelpers';

export interface TransferStructuredData {
  '@context': string;
  '@type': string | string[];
  name: string;
  description: string;
  provider: {
    '@type': string;
    name: string;
    url: string;
    logo: string;
    sameAs: string[];
  };
  offers: {
    '@type': string;
    price: string;
    priceCurrency: string;
    availability: string;
    validFrom: string;
    priceRange: string;
  };
  departureLocation: {
    '@type': string;
    name: string;
    address: {
      '@type': string;
      addressCountry: string;
      addressRegion: string;
    };
  };
  arrivalLocation: {
    '@type': string;
    name: string;
    address: {
      '@type': string;
      addressCountry: string;
      addressRegion: string;
    };
  };
  duration: string;
  distance: {
    '@type': string;
    value: string;
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    reviewCount: string;
  };
  mainEntity?: {
    '@type': string;
    mainEntity: Array<{
      '@type': string;
      name: string;
      acceptedAnswer: {
        '@type': string;
        text: string;
      };
    }>;
  };
}

export const generateTransferStructuredData = (route: PopularRoute): TransferStructuredData => {
  const baseUrl = getBaseUrl();
  const brand = buildBrand(baseUrl);

  const structuredData: TransferStructuredData = {
    '@context': 'https://schema.org',
    '@type': ['TaxiService', 'TransferService'],
    name: `${route.origin} to ${route.destination} Transfer`,
    description: route.metaDescription,
    provider: brand,
    offers: {
      '@type': 'Offer',
      price: route.startingPrice.toString(),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
      priceRange: `$${route.startingPrice} - $${Math.round(route.startingPrice * 2.5)}`
    },
    departureLocation: {
      '@type': 'Place',
      name: route.origin,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'LK',
        addressRegion: 'Sri Lanka'
      }
    },
    arrivalLocation: {
      '@type': 'Place',
      name: route.destination,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'LK',
        addressRegion: 'Sri Lanka'
      }
    },
    duration: `PT${parseInt(route.duration)}H`,
    distance: {
      '@type': 'QuantitativeValue',
      value: route.distance
    }
  };

  // Add aggregate rating if available
  const rating = buildAggregateRating(4.9, 2341);
  if (rating) {
    structuredData.aggregateRating = rating;
  }

  // Add FAQ structured data
  if (route.faqs && route.faqs.length > 0) {
    structuredData.mainEntity = {
      '@type': 'FAQPage',
      mainEntity: route.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  return structuredData;
};

// Local Business structured data for company
export const generateLocalBusinessData = () => {
  const baseUrl = getBaseUrl();
  const brand = buildBrand(baseUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#business`,
    name: 'Recharge Travels',
    description: 'Premium airport transfers and private transportation services across Sri Lanka',
    url: baseUrl,
    telephone: '+94777721999',
    email: 'info@rechargetravels.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Galle Road',
      addressLocality: 'Colombo',
      addressRegion: 'Western Province',
      postalCode: '00300',
      addressCountry: 'LK'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 6.9271,
      longitude: 79.8612
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
        'Friday', 'Saturday', 'Sunday'
      ],
      opens: '00:00',
      closes: '23:59'
    },
    priceRange: '$$',
    image: `${baseUrl}/logo-v2.png`,
    sameAs: brand.sameAs
  };
};

// BreadcrumbList for SEO
export const generateBreadcrumbData = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

// WebSite with search action
export const generateWebsiteData = () => {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Recharge Travels',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
};

// Tour Package structured data
export const generateTourPackageData = (tour: any) => {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.name,
    description: tour.description,
    image: tour.images,
    provider: {
      '@type': 'Organization',
      name: 'Recharge Travels',
      url: baseUrl
    },
    offers: {
      '@type': 'Offer',
      price: tour.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString()
    },
    duration: tour.duration,
    includesAttraction: tour.attractions?.map((attraction: string) => ({
      '@type': 'TouristAttraction',
      name: attraction
    }))
  };
};
