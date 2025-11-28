import { seoContent } from '@/data/sriLankaRealData';

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: any;
}

export class EnhancedSEOService {
  private static baseUrl = 'https://rechargetravels.com';
  
  static generatePageSEO(pageType: string, params?: any): SEOData {
    switch (pageType) {
      case 'homepage':
        return {
          title: 'Sri Lanka Tours & Travel Packages 2024 | Recharge Travels - Licensed Tour Operator',
          description: 'Expert Sri Lanka tour operator offering wildlife safaris, cultural tours, beach holidays & adventure travel. Yala leopard safaris, ancient cities, tea country tours. Licensed since 2015.',
          keywords: 'Sri Lanka tours, Sri Lanka travel packages, Yala National Park safari, Sri Lanka wildlife tours, cultural triangle tours, beach holidays Sri Lanka, adventure travel, licensed tour operator',
          canonicalUrl: this.baseUrl,
          ogImage: 'https://images.unsplash.com/photo-1588001400947-6385aef4ab0e?q=80&w=2074',
          structuredData: this.generateOrganizationSchema()
        };
        
      case 'wildlife-tours':
        return {
          title: 'Sri Lanka Wildlife Safari Tours 2024 | Leopard, Elephant & Whale Watching',
          description: 'Join expert-guided wildlife safaris in Sri Lanka. Yala leopard tours, Udawalawe elephant safaris, Mirissa whale watching. Small groups, professional guides, best sighting rates.',
          keywords: 'Sri Lanka wildlife safari, Yala leopard safari, Udawalawe elephants, Minneriya gathering, whale watching Mirissa, bird watching Sinharaja',
          canonicalUrl: `${this.baseUrl}/tours/wildtours`,
          ogImage: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=2077',
          structuredData: this.generateTourSchema('wildlife')
        };
        
      case 'cultural-tours':
        return {
          title: 'Sri Lanka Cultural Tours | Ancient Cities, Temples & Heritage Sites 2024',
          description: 'Explore 2,500 years of Sri Lankan heritage. Sigiriya Rock Fortress, Temple of Tooth Kandy, Anuradhapura, Polonnaruwa. Expert guides, small groups, authentic experiences.',
          keywords: 'Sri Lanka cultural tours, Sigiriya Lion Rock, Temple of Tooth, ancient cities tour, UNESCO heritage sites, Buddhist temples, cultural triangle',
          canonicalUrl: `${this.baseUrl}/tours/cultural`,
          ogImage: 'https://images.unsplash.com/photo-1588598198321-9735fd0f5073?q=80&w=2074',
          structuredData: this.generateTourSchema('cultural')
        };
        
      case 'destination': {
        const destination = params?.destination || 'colombo';
        return this.generateDestinationSEO(destination);
      }
        
      case 'hotels':
        return {
          title: 'Best Hotels in Sri Lanka 2024 | Luxury Resorts, Boutique & Eco Hotels',
          description: 'Curated selection of Sri Lanka\'s finest hotels. Luxury beach resorts, boutique heritage properties, eco-lodges, tea bungalows. Best rates guaranteed, instant confirmation.',
          keywords: 'Sri Lanka hotels, luxury resorts, boutique hotels, eco lodges, beach hotels, hill country hotels, Colombo hotels, Galle hotels',
          canonicalUrl: `${this.baseUrl}/hotels`,
          ogImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2070'
        };
        
      case 'about':
        return {
          title: 'About Recharge Travels | Licensed Sri Lanka Tour Operator Since 2015',
          description: 'Recharge Travels - Your trusted Sri Lanka travel partner. Licensed tour operator, expert local guides, personalized itineraries. Over 5,000 happy travelers since 2015.',
          keywords: 'about Recharge Travels, Sri Lanka tour operator, licensed travel agent, local tour company',
          canonicalUrl: `${this.baseUrl}/about`
        };
        
      default:
        return {
          title: 'Recharge Travels - Sri Lanka Tour Operator',
          description: 'Discover the beauty of Sri Lanka with expert local guides',
          canonicalUrl: this.baseUrl
        };
    }
  }
  
  private static generateDestinationSEO(destination: string): SEOData {
    const destinations: Record<string, SEOData> = {
      colombo: {
        title: 'Colombo Travel Guide 2024 | Things to Do, Hotels & Tours',
        description: 'Complete Colombo travel guide. Best attractions, hotels, restaurants, shopping. Gangaramaya Temple, Galle Face, National Museum. Airport transfers available.',
        keywords: 'Colombo Sri Lanka, Colombo attractions, things to do Colombo, Colombo hotels, Colombo tours',
        canonicalUrl: `${this.baseUrl}/destinations/colombo`,
        ogImage: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=2070'
      },
      kandy: {
        title: 'Kandy Travel Guide 2024 | Temple of Tooth, Hotels & Cultural Shows',
        description: 'Essential Kandy travel guide. Temple of Sacred Tooth, Kandy Lake, cultural shows, botanical gardens. Best hotels and day tours from Colombo.',
        keywords: 'Kandy Sri Lanka, Temple of Tooth, Kandy attractions, Kandy hotels, Peradeniya gardens',
        canonicalUrl: `${this.baseUrl}/destinations/kandy`,
        ogImage: 'https://images.unsplash.com/photo-1588598198321-9735fd0f5073?q=80&w=2074'
      },
      galle: {
        title: 'Galle Fort Travel Guide 2024 | Dutch Fort, Beaches & Boutique Hotels',
        description: 'Discover historic Galle Fort. UNESCO World Heritage site, Dutch colonial architecture, boutique hotels, nearby beaches. Day trips from Colombo available.',
        keywords: 'Galle Fort, Galle Sri Lanka, Dutch Fort, Unawatuna beach, Galle hotels',
        canonicalUrl: `${this.baseUrl}/destinations/galle`,
        ogImage: 'https://images.unsplash.com/photo-1612278675615-7b093b07772d?q=80&w=2069'
      },
      sigiriya: {
        title: 'Sigiriya Lion Rock Guide 2024 | Ancient Fortress, Hotels & Tours',
        description: 'Complete guide to Sigiriya Lion Rock. Ancient frescoes, palace ruins, water gardens. Best time to visit, nearby hotels, combined tours with Dambulla.',
        keywords: 'Sigiriya, Lion Rock, Sigiriya fortress, ancient city, cultural triangle',
        canonicalUrl: `${this.baseUrl}/destinations/sigiriya`,
        ogImage: 'https://images.unsplash.com/photo-1588001400947-6385aef4ab0e?q=80&w=2074'
      },
      ella: {
        title: 'Ella Travel Guide 2024 | Nine Arch Bridge, Train Rides & Hiking',
        description: "Ultimate Ella travel guide. Nine Arch Bridge, Little Adam's Peak, tea plantations, train rides. Best hotels, restaurants and adventure activities.",
        keywords: 'Ella Sri Lanka, Nine Arch Bridge, Ella train, Little Adams Peak, Ella hotels',
        canonicalUrl: `${this.baseUrl}/destinations/ella`,
        ogImage: 'https://images.unsplash.com/photo-1621164448191-a834de719ee4?q=80&w=2070'
      }
    };
    
    return destinations[destination] || destinations.colombo;
  }
  
  private static generateOrganizationSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Recharge Travels",
      "description": "Licensed Sri Lanka tour operator specializing in wildlife safaris, cultural tours, and adventure travel",
      "url": this.baseUrl,
      "logo": `${this.baseUrl}/logo-v2.png`,
      "image": "https://images.unsplash.com/photo-1588001400947-6385aef4ab0e?q=80&w=2074",
      "telephone": "+94777721999",
      "email": "info@rechargetravels.com",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "LK",
        "addressLocality": "Colombo"
      },
      "priceRange": "$$",
      "openingHours": "Mo-Su 08:00-20:00",
      "sameAs": [
        "https://www.facebook.com/rechargetravels",
        "https://www.instagram.com/rechargetravels",
        "https://www.tripadvisor.com/rechargetravels"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Sri Lanka Tour Packages",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "TouristTrip",
              "name": "Wildlife Safari Tours",
              "description": "Leopard and elephant safaris in national parks"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "TouristTrip",
              "name": "Cultural Heritage Tours",
              "description": "Ancient cities and temple tours"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "523",
        "bestRating": "5"
      }
    };
  }
  
  private static generateTourSchema(tourType: string) {
    const tours: Record<string, any> = {
      wildlife: {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        "name": "Sri Lanka Wildlife Safari Tours",
        "description": "Expert-guided wildlife safaris in Yala, Udawalawe, and other national parks",
        "touristType": "Nature lovers, Wildlife photographers",
        "itinerary": {
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "TouristAttraction",
              "name": "Yala National Park",
              "description": "Leopard safari in world's highest leopard density area"
            },
            {
              "@type": "TouristAttraction",
              "name": "Udawalawe National Park",
              "description": "Elephant watching and bird photography"
            }
          ]
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "USD",
          "lowPrice": "45",
          "highPrice": "150",
          "offerCount": "12"
        },
        "provider": {
          "@type": "TravelAgency",
          "name": "Recharge Travels"
        }
      },
      cultural: {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        "name": "Sri Lanka Cultural Heritage Tours",
        "description": "Explore ancient cities, temples, and UNESCO World Heritage sites",
        "touristType": "History enthusiasts, Culture lovers",
        "itinerary": {
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "TouristAttraction",
              "name": "Sigiriya Rock Fortress",
              "description": "5th century palace ruins atop 200m rock"
            },
            {
              "@type": "TouristAttraction",
              "name": "Temple of Sacred Tooth",
              "description": "Buddhism's most sacred temple in Kandy"
            },
            {
              "@type": "TouristAttraction",
              "name": "Anuradhapura",
              "description": "Ancient capital with 2,500 year old stupas"
            }
          ]
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "USD",
          "lowPrice": "180",
          "highPrice": "450",
          "offerCount": "8"
        }
      }
    };
    
    return tours[tourType] || tours.wildlife;
  }
  
  static generateBreadcrumbSchema(items: Array<{name: string, url: string}>) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };
  }
  
  static generateLocalBusinessSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Recharge Travels Colombo Office",
      "image": "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=2070",
      "telephone": "+94777721999",
      "email": "info@rechargetravels.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Level 4, Parkland Building",
        "addressLocality": "Colombo",
        "addressRegion": "Western Province",
        "postalCode": "00300",
        "addressCountry": "LK"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 6.9271,
        "longitude": 79.8612
      },
      "url": "https://rechargetravels.com",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday", "Sunday"],
          "opens": "09:00",
          "closes": "17:00"
        }
      ],
      "priceRange": "$$"
    };
  }
}

export default EnhancedSEOService;
