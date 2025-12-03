import React from 'react';
import { Helmet } from 'react-helmet-async';

interface AISEOSchemaProps {
  pageType: 'destination' | 'tour' | 'experience' | 'transport' | 'hotel' | 'blog' | 'home';
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  rating?: number;
  reviewCount?: number;
  price?: string;
  priceCurrency?: string;
  faqs?: Array<{ question: string; answer: string }>;
  breadcrumbs?: Array<{ name: string; url: string }>;
  location?: {
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    region?: string;
  };
  includedItems?: string[];
  duration?: string;
  provider?: string;
}

/**
 * AI-Optimized SEO Schema Component
 * 
 * Generates structured data optimized for:
 * - Google AI Overviews
 * - ChatGPT citations
 * - Perplexity answers
 * - Other AI assistants
 * 
 * Key optimizations:
 * 1. Rich FAQ schema for direct answers
 * 2. Speakable schema for voice assistants
 * 3. Detailed entity markup for knowledge graphs
 * 4. Breadcrumbs for context
 */
const AISEOSchema: React.FC<AISEOSchemaProps> = ({
  pageType,
  title,
  description,
  url,
  image = 'https://www.rechargetravels.com/images/sri-lanka-hero.jpg',
  datePublished,
  dateModified,
  author = 'Recharge Travels',
  rating,
  reviewCount,
  price,
  priceCurrency = 'USD',
  faqs = [],
  breadcrumbs = [],
  location,
  includedItems = [],
  duration,
  provider = 'Recharge Travels & Tours Ltd'
}) => {
  const baseUrl = 'https://www.rechargetravels.com';
  const fullUrl = `${baseUrl}${url}`;
  const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;
  const today = new Date().toISOString().split('T')[0];

  // Organization schema (appears on all pages)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${baseUrl}/#organization`,
    "name": "Recharge Travels & Tours Ltd",
    "alternateName": ["Recharge Travels", "RechargeTravels"],
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/logo-v2.png`,
      "width": 200,
      "height": 60
    },
    "description": "Sri Lanka's premier travel agency offering luxury tours, wildlife safaris, cultural experiences, and personalized travel packages since 2010.",
    "foundingDate": "2010",
    "founder": {
      "@type": "Person",
      "name": "Recharge Travels Team"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Colombo",
      "addressLocality": "Colombo",
      "addressRegion": "Western Province",
      "postalCode": "00100",
      "addressCountry": "LK"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+94-77-772-1999",
        "contactType": "customer service",
        "availableLanguage": ["English", "Tamil", "Sinhala"],
        "areaServed": "Worldwide"
      },
      {
        "@type": "ContactPoint",
        "telephone": "+94-77-772-1999",
        "contactType": "reservations",
        "availableLanguage": ["English", "Tamil", "Sinhala"]
      }
    ],
    "sameAs": [
      "https://www.facebook.com/rechargetravels",
      "https://www.instagram.com/rechargetravels",
      "https://www.youtube.com/@rechargetravels",
      "https://www.linkedin.com/company/rechargetravels",
      "https://twitter.com/rechargetravels",
      "https://www.tiktok.com/@rechargetravels",
      "https://www.pinterest.com/rechargetravels",
      "https://www.tripadvisor.com/Attraction_Review-Recharge_Travels"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500",
      "bestRating": "5"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Sri Lanka",
      "sameAs": "https://en.wikipedia.org/wiki/Sri_Lanka"
    },
    "knowsAbout": [
      "Sri Lanka Tourism",
      "Wildlife Safaris",
      "Cultural Tours",
      "Beach Holidays",
      "Luxury Travel",
      "Adventure Tours",
      "Pilgrimage Tours",
      "Ayurveda Wellness",
      "Airport Transfers",
      "Hotel Bookings"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Sri Lanka Tour Packages",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "TouristTrip", "name": "Cultural Heritage Tours" }},
        { "@type": "Offer", "itemOffered": { "@type": "TouristTrip", "name": "Wildlife Safari Tours" }},
        { "@type": "Offer", "itemOffered": { "@type": "TouristTrip", "name": "Beach Holiday Packages" }},
        { "@type": "Offer", "itemOffered": { "@type": "TouristTrip", "name": "Luxury Tours" }},
        { "@type": "Offer", "itemOffered": { "@type": "TouristTrip", "name": "Adventure Tours" }}
      ]
    }
  };

  // Breadcrumb schema
  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${baseUrl}${crumb.url}`
    }))
  } : null;

  // FAQ schema (critical for AI answers)
  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // Speakable schema (for voice assistants)
  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".summary", ".key-facts", ".faq-answer"]
    },
    "url": fullUrl
  };

  // Page-specific schemas
  const getPageSpecificSchema = () => {
    switch (pageType) {
      case 'destination':
        return {
          "@context": "https://schema.org",
          "@type": "TouristDestination",
          "name": title,
          "description": description,
          "url": fullUrl,
          "image": fullImage,
          "touristType": ["Adventure traveler", "Cultural tourist", "Beach lover", "Nature enthusiast"],
          ...(location && {
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": location.latitude,
              "longitude": location.longitude
            },
            "containedInPlace": {
              "@type": "Country",
              "name": "Sri Lanka"
            }
          }),
          "isAccessibleForFree": false,
          "publicAccess": true
        };

      case 'tour':
        return {
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          "name": title,
          "description": description,
          "url": fullUrl,
          "image": fullImage,
          "provider": {
            "@type": "TravelAgency",
            "name": provider,
            "url": baseUrl
          },
          ...(duration && { "duration": duration }),
          ...(price && {
            "offers": {
              "@type": "Offer",
              "price": price,
              "priceCurrency": priceCurrency,
              "availability": "https://schema.org/InStock",
              "validFrom": today,
              "seller": {
                "@type": "TravelAgency",
                "name": provider
              }
            }
          }),
          ...(includedItems.length > 0 && {
            "itinerary": {
              "@type": "ItemList",
              "itemListElement": includedItems.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item
              }))
            }
          }),
          ...(rating && reviewCount && {
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": rating,
              "reviewCount": reviewCount,
              "bestRating": 5
            }
          })
        };

      case 'experience':
        return {
          "@context": "https://schema.org",
          "@type": "TouristAttraction",
          "name": title,
          "description": description,
          "url": fullUrl,
          "image": fullImage,
          ...(location && {
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": location.latitude,
              "longitude": location.longitude
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": location.name,
              "addressCountry": "Sri Lanka"
            }
          }),
          "isAccessibleForFree": false,
          "touristType": ["Adventure traveler", "Nature enthusiast"],
          ...(rating && reviewCount && {
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": rating,
              "reviewCount": reviewCount,
              "bestRating": 5
            }
          })
        };

      case 'transport':
        return {
          "@context": "https://schema.org",
          "@type": "TaxiService",
          "name": title,
          "description": description,
          "url": fullUrl,
          "provider": {
            "@type": "TravelAgency",
            "name": provider,
            "url": baseUrl
          },
          "areaServed": {
            "@type": "Country",
            "name": "Sri Lanka"
          },
          ...(price && {
            "offers": {
              "@type": "Offer",
              "price": price,
              "priceCurrency": priceCurrency
            }
          })
        };

      case 'hotel':
        return {
          "@context": "https://schema.org",
          "@type": "Hotel",
          "name": title,
          "description": description,
          "url": fullUrl,
          "image": fullImage,
          ...(location && {
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": location.latitude,
              "longitude": location.longitude
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": location.name,
              "addressCountry": "Sri Lanka"
            }
          }),
          ...(rating && {
            "starRating": {
              "@type": "Rating",
              "ratingValue": rating
            }
          })
        };

      case 'blog':
        return {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": title,
          "description": description,
          "url": fullUrl,
          "image": fullImage,
          "datePublished": datePublished || today,
          "dateModified": dateModified || today,
          "author": {
            "@type": "Organization",
            "name": author,
            "url": baseUrl
          },
          "publisher": {
            "@type": "Organization",
            "name": "Recharge Travels",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo-v2.png`
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": fullUrl
          }
        };

      case 'home':
      default:
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Recharge Travels - Sri Lanka Tours & Travel Agency",
          "url": baseUrl,
          "description": description,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        };
    }
  };

  return (
    <Helmet>
      {/* Organization Schema - Always present */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* Breadcrumb Schema */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {/* FAQ Schema - Critical for AI answers */}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}

      {/* Speakable Schema - For voice assistants */}
      <script type="application/ld+json">
        {JSON.stringify(speakableSchema)}
      </script>

      {/* Page-Specific Schema */}
      <script type="application/ld+json">
        {JSON.stringify(getPageSpecificSchema())}
      </script>

      {/* AI-Specific Meta Tags */}
      <meta name="ai-summary" content={description} />
      <meta name="ai-keywords" content={`Sri Lanka, ${title}, travel, tourism, Recharge Travels`} />
      
      {/* Structured Data Hints for AI */}
      <meta name="article:author" content={author} />
      <meta name="article:publisher" content="Recharge Travels" />
      {dateModified && <meta name="article:modified_time" content={dateModified} />}
      {datePublished && <meta name="article:published_time" content={datePublished} />}
    </Helmet>
  );
};

export default AISEOSchema;

