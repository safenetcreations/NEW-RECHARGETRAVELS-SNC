/**
 * HomepageSchema Component
 * Comprehensive structured data for the homepage
 * Optimized for Google Rich Results, AI Overview, and Voice Search
 */

import { Helmet } from 'react-helmet-async';
import {
  COMPANY,
  createOrganizationSchema,
  createLocalBusinessSchema,
  createWebsiteSchema,
  createFAQSchema,
  createBookTourHowTo,
  createBookTransferHowTo,
  createSpeakableSchema,
  type FAQItem
} from '@/utils/schemaMarkup';

const HomepageSchema = () => {
  const baseUrl = COMPANY.url;

  // Organization Schema - Complete business information
  const organizationSchema = createOrganizationSchema();

  // Local Business Schema - For Google Maps & Local SEO
  const localBusinessSchema = createLocalBusinessSchema();

  // Website Schema - Site-wide information with search action
  const websiteSchema = createWebsiteSchema();

  // Speakable Schema - For Google AI Overview & Voice Search
  const speakableSchema = createSpeakableSchema(baseUrl, [
    'h1',
    '.hero-title',
    '.hero-description',
    '.featured-description',
    '#main-cta',
    '.trust-indicators'
  ]);

  // HowTo Schema - Step-by-step booking guide
  const howToBookTour = createBookTourHowTo();
  const howToBookTransfer = createBookTransferHowTo();

  // FAQ Schema - Common questions for rich snippets
  const homepageFAQs: FAQItem[] = [
    {
      question: 'What are the best times to visit Sri Lanka?',
      answer: 'The best time to visit Sri Lanka depends on which region you plan to explore. December to March is ideal for the west and south coasts and hill country. April to September is perfect for the east coast and cultural triangle. The shoulder months of April and October offer good weather across most regions with fewer tourists.'
    },
    {
      question: 'Do I need a visa to visit Sri Lanka?',
      answer: 'Yes, most visitors need an Electronic Travel Authorization (ETA) to enter Sri Lanka. You can apply online at eta.gov.lk before arrival. The tourist visa costs $50 USD, is valid for 30 days, and can be extended up to 6 months at the Department of Immigration in Colombo.'
    },
    {
      question: 'How much does a Sri Lanka tour cost?',
      answer: 'Sri Lanka tours range from $50-200 per day depending on comfort level. Budget tours start around $50-80/day, mid-range tours cost $100-150/day, and luxury tours are $200-500/day. A typical 7-day tour package costs $500-2000 including accommodation, transport, and guided activities.'
    },
    {
      question: 'Is Sri Lanka safe for tourists?',
      answer: 'Yes, Sri Lanka is very safe for tourists. The country has a low crime rate, friendly locals, and well-established tourism infrastructure. Exercise normal precautions as you would anywhere. Recharge Travels provides 24/7 support and local emergency assistance for all our guests.'
    },
    {
      question: 'What currency is used in Sri Lanka?',
      answer: 'The Sri Lankan Rupee (LKR) is the official currency. Current exchange rate is approximately 300-320 LKR per 1 USD. Major credit cards are accepted in hotels, restaurants, and shops in tourist areas. ATMs are widely available. USD and EUR can be exchanged at banks and authorized dealers.'
    },
    {
      question: 'How do I get from Colombo Airport to my hotel?',
      answer: 'The easiest way is to pre-book an airport transfer with Recharge Travels. We offer meet-and-greet service at arrivals, comfortable air-conditioned vehicles, and fixed prices from $35-65 depending on destination. Alternatively, taxis and ride-hailing apps are available at the airport.'
    },
    {
      question: 'What should I pack for Sri Lanka?',
      answer: 'Pack light, breathable cotton clothes, comfortable walking shoes, swimwear, sunscreen SPF 50+, insect repellent, and modest clothing for temple visits (covering shoulders and knees). Bring a light rain jacket during monsoon seasons. Don\'t forget adapter plugs (Type D and G) and any prescription medications.'
    },
    {
      question: 'Can I see elephants and leopards in Sri Lanka?',
      answer: 'Yes! Sri Lanka offers world-class wildlife viewing. Yala National Park has the highest leopard density globally. Udawalawe and Minneriya national parks are famous for elephant herds of 200-300 animals. We offer daily safaris from $85 per person including park fees, jeep hire, and guide.'
    }
  ];
  const faqSchema = createFAQSchema(homepageFAQs);

  // Service Catalog Schema
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Travel Agency Services',
    provider: {
      '@type': 'TravelAgency',
      name: COMPANY.name,
      url: baseUrl
    },
    areaServed: {
      '@type': 'Country',
      name: 'Sri Lanka'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Sri Lanka Travel Services',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Tours & Experiences',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'TouristTrip',
                name: 'Wildlife Safaris',
                description: 'Leopard and elephant safaris at Yala, Udawalawe, Wilpattu national parks',
                touristType: 'Ecotourism'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'TouristTrip',
                name: 'Cultural Heritage Tours',
                description: 'UNESCO World Heritage sites including Sigiriya, Kandy, Anuradhapura',
                touristType: 'Cultural Tourism'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'TouristTrip',
                name: 'Beach & Island Holidays',
                description: 'Tropical beaches at Mirissa, Unawatuna, Tangalle, Arugam Bay',
                touristType: 'Beach Tourism'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'TouristTrip',
                name: 'Hill Country Adventures',
                description: 'Tea plantations, waterfalls, and scenic train journeys in Ella and Nuwara Eliya',
                touristType: 'Nature Tourism'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'TouristTrip',
                name: 'Ayurveda & Wellness Retreats',
                description: 'Traditional Ayurvedic treatments, yoga, and spa experiences',
                touristType: 'Wellness Tourism'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'TouristTrip',
                name: 'Whale Watching',
                description: 'Blue whale and dolphin watching excursions in Mirissa and Trincomalee',
                touristType: 'Marine Tourism'
              }
            }
          ]
        },
        {
          '@type': 'OfferCatalog',
          name: 'Transportation Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'TaxiService',
                name: 'Airport Transfers',
                description: '24/7 airport pickup and drop-off with meet-and-greet service'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Private Tours with Driver-Guide',
                description: 'Customized private tours with experienced English-speaking driver-guides'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Luxury Vehicle Hire',
                description: 'Premium vehicles including Mercedes, BMW, and Range Rover'
              }
            }
          ]
        },
        {
          '@type': 'OfferCatalog',
          name: 'Accommodation',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'LodgingBusiness',
                name: 'Hotel Bookings',
                description: 'Curated selection of luxury resorts, boutique hotels, and eco lodges'
              }
            }
          ]
        }
      ]
    }
  };

  // Featured Tours Schema
  const featuredToursSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Featured Sri Lanka Tours',
    description: 'Our most popular tour packages in Sri Lanka',
    numberOfItems: 6,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'TouristTrip',
          name: 'Sri Lanka Golden Triangle Tour',
          description: '7-day cultural tour covering Colombo, Kandy, Sigiriya, Dambulla with luxury accommodations',
          touristType: 'Cultural Tourism',
          duration: 'P7D',
          offers: {
            '@type': 'Offer',
            price: '1299',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          },
          itinerary: {
            '@type': 'ItemList',
            itemListElement: [
              { '@type': 'TouristDestination', name: 'Colombo' },
              { '@type': 'TouristDestination', name: 'Kandy' },
              { '@type': 'TouristDestination', name: 'Sigiriya' },
              { '@type': 'TouristDestination', name: 'Dambulla' }
            ]
          }
        }
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'TouristTrip',
          name: 'Wildlife Safari Adventure',
          description: '6-day wildlife tour featuring Yala and Udawalawe National Parks for leopard and elephant sightings',
          touristType: 'Ecotourism',
          duration: 'P6D',
          offers: {
            '@type': 'Offer',
            price: '1099',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'TouristTrip',
          name: 'Beach & Whale Watching',
          description: '5-day coastal experience with whale watching in Mirissa and beach relaxation',
          touristType: 'Beach Tourism',
          duration: 'P5D',
          offers: {
            '@type': 'Offer',
            price: '899',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }
      },
      {
        '@type': 'ListItem',
        position: 4,
        item: {
          '@type': 'TouristTrip',
          name: 'Hill Country & Tea Trail',
          description: '5-day scenic journey through Nuwara Eliya, Ella with famous train ride',
          touristType: 'Nature Tourism',
          duration: 'P5D',
          offers: {
            '@type': 'Offer',
            price: '799',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }
      },
      {
        '@type': 'ListItem',
        position: 5,
        item: {
          '@type': 'TouristTrip',
          name: 'Ayurveda Wellness Retreat',
          description: '7-day authentic Ayurvedic healing experience with personalized treatments',
          touristType: 'Wellness Tourism',
          duration: 'P7D',
          offers: {
            '@type': 'Offer',
            price: '1599',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }
      },
      {
        '@type': 'ListItem',
        position: 6,
        item: {
          '@type': 'TouristTrip',
          name: 'Complete Sri Lanka Explorer',
          description: '14-day comprehensive tour covering wildlife, culture, beaches, and hill country',
          touristType: 'Adventure Tourism',
          duration: 'P14D',
          offers: {
            '@type': 'Offer',
            price: '2499',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }
      }
    ]
  };

  // Review Schema with sample reviews
  const reviewsSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: COMPANY.name,
    url: baseUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: COMPANY.rating.value,
      reviewCount: COMPANY.rating.count,
      bestRating: 5,
      worstRating: 1
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Sarah Johnson' },
        datePublished: '2024-11-15',
        reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 },
        reviewBody: 'Absolutely fantastic experience! Recharge Travels organized our 10-day Sri Lanka trip perfectly. The driver-guide was incredibly knowledgeable and the hotels were amazing. Highly recommend for anyone visiting Sri Lanka.'
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Michael Chen' },
        datePublished: '2024-11-10',
        reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 },
        reviewBody: 'Best wildlife safari experience ever! We saw 3 leopards at Yala thanks to our expert guide. The whole booking process was smooth and the 24/7 WhatsApp support was very helpful.'
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Emma Schmidt' },
        datePublished: '2024-10-28',
        reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 },
        reviewBody: 'Our honeymoon in Sri Lanka was perfect! From the airport pickup to every hotel, everything was meticulously planned. Special thanks to the team for the surprise anniversary cake!'
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'James Wilson' },
        datePublished: '2024-10-20',
        reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 },
        reviewBody: 'Outstanding service from start to finish. The custom itinerary was perfect for our family with kids. Our driver Nimal was excellent - friendly, safe driving, and great with children.'
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Lisa Anderson' },
        datePublished: '2024-10-15',
        reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 },
        reviewBody: 'Third time booking with Recharge Travels and they never disappoint. This time we did the tea trails and Ella train journey - absolutely magical. Already planning our next trip!'
      }
    ]
  };

  // Breadcrumb for homepage
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl }]
  };

  // SiteNavigationElement Schema
  const navigationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: 'Main Navigation',
    hasPart: [
      { '@type': 'WebPage', name: 'Tours', url: `${baseUrl}/tours` },
      { '@type': 'WebPage', name: 'Destinations', url: `${baseUrl}/destinations` },
      { '@type': 'WebPage', name: 'Airport Transfers', url: `${baseUrl}/transport/airport-transfers` },
      { '@type': 'WebPage', name: 'Hotels', url: `${baseUrl}/hotels` },
      { '@type': 'WebPage', name: 'About Us', url: `${baseUrl}/about` },
      { '@type': 'WebPage', name: 'Contact', url: `${baseUrl}/contact` }
    ]
  };

  // Video Schema for hero video if present
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'Discover Sri Lanka with Recharge Travels',
    description: 'Experience the beauty of Sri Lanka - from ancient temples to pristine beaches, wildlife safaris to misty mountains',
    thumbnailUrl: `${baseUrl}/images/hero-thumbnail.jpg`,
    uploadDate: '2024-01-01',
    duration: 'PT2M30S',
    publisher: {
      '@type': 'Organization',
      name: COMPANY.name,
      logo: { '@type': 'ImageObject', url: COMPANY.logo }
    }
  };

  return (
    <Helmet>
      {/* Organization Schema - Primary business information */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* Local Business Schema - Google Maps & Local SEO */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

      {/* Website Schema - Site-wide with search action */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {/* Services Catalog Schema */}
      <script type="application/ld+json">
        {JSON.stringify(servicesSchema)}
      </script>

      {/* Featured Tours Schema */}
      <script type="application/ld+json">
        {JSON.stringify(featuredToursSchema)}
      </script>

      {/* Reviews Schema */}
      <script type="application/ld+json">
        {JSON.stringify(reviewsSchema)}
      </script>

      {/* FAQ Schema - Rich Snippets */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      {/* HowTo: Book a Tour */}
      <script type="application/ld+json">
        {JSON.stringify(howToBookTour)}
      </script>

      {/* HowTo: Book a Transfer */}
      <script type="application/ld+json">
        {JSON.stringify(howToBookTransfer)}
      </script>

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      {/* Navigation Schema */}
      <script type="application/ld+json">
        {JSON.stringify(navigationSchema)}
      </script>

      {/* Speakable Schema - Voice Search & AI Overview */}
      <script type="application/ld+json">
        {JSON.stringify(speakableSchema)}
      </script>

      {/* Video Schema */}
      <script type="application/ld+json">
        {JSON.stringify(videoSchema)}
      </script>
    </Helmet>
  );
};

export default HomepageSchema;
