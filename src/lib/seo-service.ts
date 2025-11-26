export interface SeoData {
  title: string
  description: string
  keywords: string[]
  canonicalUrl: string
  ogImage?: string
  structuredData?: object
  alternateUrls?: { lang: string; url: string }[]
}

export interface SitemapEntry {
  url: string
  lastModified: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export class SEOService {
  private static baseUrl = window.location.origin

  static generateSeoData(type: string, data: any): SeoData {
    const baseTitle = "Sri Lanka Travel Guide - Recharge Travels"
    const baseDescription = "Discover the wonders of Sri Lanka with our comprehensive travel guide. Explore destinations, tours, culture, and create unforgettable memories."

    switch (type) {
      case 'homepage':
        return {
          title: "Sri Lanka Travel Guide & Tours - Discover Paradise Island | Recharge Travels",
          description: "Plan your perfect Sri Lanka adventure! Discover ancient temples, pristine beaches, wildlife safaris, tea plantations, and rich cultural heritage. Expert travel services, customized tours, and local insights for an unforgettable journey.",
          keywords: [
            'sri lanka travel', 'sri lanka tours', 'sri lanka destinations', 'sri lanka safari',
            'sri lanka culture', 'sri lanka beaches', 'sri lanka temples', 'sri lanka wildlife',
            'sri lanka tea plantations', 'sri lanka itinerary', 'visit sri lanka', 'sri lanka guide',
            'sri lanka vacation', 'sri lanka holidays', 'sri lanka travel agency', 'ceylon travel'
          ],
          canonicalUrl: `${this.baseUrl}/`,
          ogImage: '/images/sri-lanka-hero.jpg',
          structuredData: this.generateHomepageStructuredData()
        }

      case 'cultural_tours':
        return {
          title: "Ultra-Luxury Sri Lanka Cultural Tours - Exclusive Heritage & Archaeological Experiences | Million-Dollar Ancient Kingdom Access",
          description: "Exclusive ultra-luxury cultural tours in Sri Lanka for UHNW travelers. Private temple access, archaeological site buyouts, Buddhist monk ceremonies, UNESCO World Heritage experiences. Platinum packages $25K-$500K with VIP government protocols.",
          keywords: [
            'private cultural tours sri lanka ancient heritage', 'exclusive temple access UHNW archaeological experiences',
            'luxury heritage accommodation polonnaruwa sigiriya', 'million dollar cultural immersion packages',
            'buddhist monk ceremonies private access', 'archaeological site exclusive tours sri lanka',
            'unesco world heritage vip access', 'luxury heritage experiences sri lanka',
            'ancient kingdom tours private guides', 'cultural protocol specialists sri lanka',
            'heritage estate accommodation luxury', 'royal kandyan court experiences',
            'traditional village luxury immersion', 'master craftsman workshops exclusive',
            'ancient manuscript creation experiences', 'ayurvedic healing ceremonies private',
            'government heritage department vip', 'temple blessing ceremonies exclusive',
            'cultural documentation luxury travel', 'archaeological dig participation luxury',
            'heritage artifact acquisition legal', 'stone carving workshops master craftsmen',
            'traditional mask making ambalangoda', 'royal feast recreation experiences',
            'cultural legacy establishment temple', 'heritage preservation luxury tourism',
            'diplomatic cultural exchanges vip', 'coronation ceremony experiences',
            'ancient royal palace accommodations', 'heritage historian personal guides',
            'cultural concierge specialists', 'luxury heritage photography experiences'
          ],
          canonicalUrl: `${this.baseUrl}/tours/cultural`,
          ogImage: '/images/cultural-heritage-hero.jpg',
          structuredData: this.generateCulturalToursStructuredData(data)
        }

      case 'beach_tours':
        return {
          title: "Sri Lanka's Premier Private Beach Tours & Coastal Villas - Ultra Luxury Beach Experiences | UHNW Travel Specialists",
          description: "Exclusive private beach tours in Sri Lanka for ultra-high-net-worth travelers. Private beachfront villas, super-yacht charters, helicopter transfers, and bespoke ocean adventures. Million-dollar packages from $25K-$500K.",
          keywords: [
            'private beach tours sri lanka', 'luxury beach villas sri lanka', 'super yacht charter sri lanka', 'UHNW beach travel',
            'exclusive beach estates sri lanka', 'private island rental sri lanka', 'helicopter beach transfers', 'ultra luxury coastal experiences',
            'presidential beach villas', 'million dollar beach vacation', 'private beach concierge', 'luxury yacht fleet sri lanka',
            'diamond tier beach packages', 'royal ocean experiences', 'platinum beach retreats', 'celebrity beach destinations',
            'private coral reef diving', 'bespoke ocean adventures', 'exclusive marine sanctuary access', 'ultra high net worth beach travel',
            'luxury beach photography', 'private beach dining', 'helicopter coastal tours', 'super luxury beach resorts',
            'exclusive beach access permissions', 'private maritime fleet', 'diplomatic coastal experiences', 'custom beach experiences',
            'mirissa private beach', 'unawatuna luxury villas', 'tangalle exclusive estates', 'bentota private resorts',
            'luxury beach wedding venues', 'private beach events', 'exclusive coastal retreats', 'premium beach services'
          ],
          canonicalUrl: `${this.baseUrl}/tours/beach-tours`,
          ogImage: '/images/luxury-beach-hero.jpg',
          structuredData: this.generateBeachToursStructuredData(data)
        }

      case 'luxury_tours':
        return {
          title: "Ultra-Luxury Sri Lanka Tours - Million Dollar Experiences | Private Jets, 7-Star Villas, Royal Treatments | UHNW Travel Specialists",
          description: "Exclusive Sri Lanka luxury travel for ultra-high-net-worth individuals. Private jet transfers, island buyouts, presidential suites, cultural dignitary access. Bespoke packages $25K-$500K. 24/7 concierge, security, privacy guaranteed. Rolls-Royce fleet, helicopter safaris, royal palace suites.",
          keywords: [
            'ultra luxury sri lanka tours', 'UHNW travel sri lanka', 'private jet sri lanka', 'million dollar vacation packages',
            'luxury villa rentals sri lanka', 'private island sri lanka', '7 star hotels sri lanka', 'exclusive sri lanka experiences',
            'royal treatment sri lanka', 'luxury safari sri lanka', 'private helicopter tours', 'yacht charter sri lanka',
            'cultural dignitary access', 'presidential suite accommodation', 'luxury concierge services', 'security detail travel',
            'rolls royce sri lanka', 'michelin chef experiences', 'private temple ceremonies', 'archaeological site access',
            'diamond luxury tours', 'platinum travel packages', 'bespoke cultural immersion', 'elite transportation fleet',
            'traditional healing retreats', 'royal ayurveda treatments', 'exclusive wildlife encounters', 'luxury tea estate tours',
            'private beach buyouts', 'helicopter elephant safari', 'underwater temple diving', 'master craftsman workshops',
            'buddhist monk ceremonies', 'cultural protocol assistance', 'multilingual concierge', 'emergency response team',
            'sri lanka millionaire travel', 'billionaire vacation packages', 'ultra high net worth services', 'complete privacy protection'
          ],
          canonicalUrl: `${this.baseUrl}/tours/luxury`,
          ogImage: '/images/luxury/sri-lanka-luxury-hero.jpg',
          structuredData: this.generateLuxuryToursStructuredData(data)
        }

      case 'wellness_packages':
        return {
          title: `Ancient Ayurveda Wellness Packages Sri Lanka - 2500+ Years Healing Heritage | Traditional Spa Retreats, Panchakarma Detox & Luxury Wellness`,
          description: `Experience Sri Lanka's authentic 2,500+ year Ayurvedic heritage - world's first hospitals, ancient healing traditions, luxury wellness retreats. Traditional Panchakarma detox, therapeutic massages, herbal treatments in paradise. Book genuine wellness packages from $580.`,
          keywords: [
            'sri lanka ayurveda wellness packages', 'ancient healing retreats', 'traditional panchakarma detox',
            'authentic spa treatments sri lanka', 'luxury wellness sri lanka', 'ayurvedic medicine heritage',
            'therapeutic massages sri lanka', 'herbal healing treatments', 'meditation retreats sri lanka',
            'yoga therapy packages', 'first hospital world history', 'traditional medicine sri lanka',
            'wellness tourism sri lanka', 'spa packages ceylon', 'holistic healing retreats',
            'ayurveda retreat packages', 'wellness vacation sri lanka', 'traditional healing spa',
            'authentic ayurvedic treatments', 'sri lanka wellness heritage'
          ],
          canonicalUrl: `${this.baseUrl}/wellness-packages`,
          ogImage: '/images/wellness-heritage.jpg',
          structuredData: this.generateWellnessStructuredData(data)
        }

      case 'destinations':
        return {
          title: `${data.name} - Complete Travel Guide | Sri Lanka Destinations`,
          description: `Discover ${data.name}, Sri Lanka. ${data.summary || ''} Find attractions, activities, best time to visit, accommodation, and travel tips for your perfect ${data.name} experience.`,
          keywords: [
            `${data.name.toLowerCase()} sri lanka`,
            `visit ${data.name.toLowerCase()}`,
            `${data.name.toLowerCase()} attractions`,
            `${data.name.toLowerCase()} travel guide`,
            `things to do ${data.name.toLowerCase()}`,
            `${data.name.toLowerCase()} tourism`,
            'sri lanka destinations'
          ],
          canonicalUrl: `${this.baseUrl}/destinations/${data.slug}`,
          ogImage: data.og_image_url,
          structuredData: this.generateDestinationStructuredData(data)
        }

      case 'articles':
        return {
          title: `${data.title} | Sri Lanka Travel Articles`,
          description: data.meta_description || `${data.title} - Expert travel advice and insights for your Sri Lanka journey. Detailed guides, tips, and local knowledge to help you explore Sri Lanka like a local.`,
          keywords: [
            'sri lanka travel tips',
            'sri lanka travel guide',
            'sri lanka culture',
            'sri lanka advice',
            'sri lanka local insights'
          ],
          canonicalUrl: `${this.baseUrl}/articles/${data.slug}`,
          ogImage: data.og_image_url,
          structuredData: this.generateArticleStructuredData(data)
        }

      default:
        return {
          title: baseTitle,
          description: baseDescription,
          keywords: ['sri lanka', 'travel', 'tours', 'destinations'],
          canonicalUrl: this.baseUrl
        }
    }
  }

  static generateHomepageStructuredData() {
    return {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Recharge Travels",
      "description": "Premier Sri Lanka travel agency offering customized tours, wildlife safaris, cultural experiences, and comprehensive travel services",
      "url": this.baseUrl,
      "logo": `${this.baseUrl}/logo.png`,
      "image": `${this.baseUrl}/images/sri-lanka-hero.jpg`,
      "telephone": "+94-11-123-4567",
      "email": "info@rechargetravels.com",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "LK",
        "addressRegion": "Western Province",
        "addressLocality": "Colombo"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "6.9271",
        "longitude": "79.8612"
      },
      "openingHours": "Mo-Su 08:00-20:00",
      "sameAs": [
        "https://facebook.com/rechargetravels",
        "https://instagram.com/rechargetravels",
        "https://twitter.com/rechargetravels"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Sri Lanka Travel Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "TouristTrip",
              "name": "Wildlife Safari Tours",
              "description": "Experience Sri Lanka's incredible wildlife in national parks"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "TouristTrip",
              "name": "Cultural Heritage Tours",
              "description": "Explore ancient temples, royal palaces, and UNESCO World Heritage sites"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "TouristTrip", 
              "name": "Beach & Coastal Tours",
              "description": "Relax on pristine beaches and enjoy water sports"
            }
          }
        ]
      },
      "areaServed": {
        "@type": "Country",
        "name": "Sri Lanka"
      },
      "knowsAbout": [
        "Sri Lanka Tourism",
        "Wildlife Safari",
        "Cultural Tours", 
        "Beach Holidays",
        "Adventure Travel",
        "Eco Tourism",
        "Tea Plantation Tours",
        "Ayurveda Wellness"
      ]
    }
  }

  static generateBeachToursStructuredData(data: any) {
    return {
      "@context": "https://schema.org",
      "@type": ["TravelAgency", "Resort"],
      "name": "Recharge Travels - Ultra Luxury Beach Tours Sri Lanka",
      "description": "Exclusive private beach tours and coastal villa rentals for ultra-high-net-worth individuals in Sri Lanka",
      "url": `${this.baseUrl}/tours/beach-tours`,
      "priceRange": "$$$$$",
      "currenciesAccepted": ["USD", "EUR", "GBP", "CHF", "AED"],
      "areaServed": {
        "@type": "Country",
        "name": "Sri Lanka"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Ultra-Luxury Beach Tour Packages",
        "itemListElement": [
          {
            "@type": "Offer",
            "name": "Platinum Beach Experience",
            "description": "Private helicopter transfers, exclusive beachfront villas, personal yacht charter with crew and chef",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "25000-50000",
              "priceCurrency": "USD"
            },
            "availabilityStarts": "2024-01-01",
            "validFrom": "2024-01-01"
          },
          {
            "@type": "Offer",
            "name": "Diamond Coastal Experience",
            "description": "Complete private island buyouts, super-yacht charters, exclusive marine sanctuary access",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "50000-100000",
              "priceCurrency": "USD"
            },
            "availabilityStarts": "2024-01-01",
            "validFrom": "2024-01-01"
          },
          {
            "@type": "Offer",
            "name": "Royal Ocean Experience",
            "description": "Presidential beach estates, private maritime fleet, diplomatic coastal access",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "100000+",
              "priceCurrency": "USD"
            },
            "availabilityStarts": "2024-01-01",
            "validFrom": "2024-01-01"
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "89",
        "bestRating": "5"
      },
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Private Beach Access",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Helicopter Landing Pad",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Private Yacht Charter",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "24/7 Concierge Service",
          "value": true
        }
      ],
      "knowsAbout": [
        "Ultra-Luxury Beach Tours",
        "Private Beach Estates",
        "Super Yacht Charters",
        "Helicopter Transfers",
        "Exclusive Marine Experiences",
        "Private Island Access",
        "Bespoke Ocean Adventures",
        "UHNW Travel Services",
        "Presidential Beach Villas",
        "Luxury Coastal Retreats"
      ]
    }
  }

  static generateLuxuryToursStructuredData(data: any) {
    return {
      "@context": "https://schema.org",
      "@type": ["TravelAgency", "LuxuryGoodsProvider"],
      "name": "Recharge Travels - Ultra Luxury Sri Lanka Experiences",
      "description": "Exclusive ultra-luxury travel experiences in Sri Lanka for UHNW individuals, featuring private jets, exclusive accommodations, and bespoke cultural immersion",
      "url": `${this.baseUrl}/tours/luxury`,
      "priceRange": "$$$$$",
      "currenciesAccepted": ["USD", "EUR", "GBP", "CHF"],
      "paymentAccepted": ["Cash", "Credit Card", "Wire Transfer", "Cryptocurrency"],
      "areaServed": {
        "@type": "Country",
        "name": "Sri Lanka"
      },
      "serviceType": [
        "Ultra-Luxury Travel",
        "UHNW Services", 
        "Private Jet Charter",
        "Luxury Accommodation",
        "Exclusive Experiences",
        "Concierge Services",
        "Security Services",
        "Cultural Immersion"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Ultra-Luxury Sri Lanka Tour Packages",
        "itemListElement": [
          {
            "@type": "Offer",
            "name": "Platinum Luxury Experience",
            "description": "Private jet transfers, exclusive temple access, royal treatments, personal concierge, helicopter safaris",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "25000-50000",
              "priceCurrency": "USD"
            },
            "availabilityStarts": "2024-01-01",
            "validFrom": "2024-01-01",
            "eligibleDuration": {
              "@type": "QuantitativeValue",
              "minValue": 7,
              "maxValue": 14,
              "unitCode": "DAY"
            }
          },
          {
            "@type": "Offer",
            "name": "Diamond Elite Experience", 
            "description": "International private jet, island buyouts, cultural dignitaries, yacht charters, security detail",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "50000-100000",
              "priceCurrency": "USD"
            },
            "availabilityStarts": "2024-01-01",
            "validFrom": "2024-01-01",
            "eligibleDuration": {
              "@type": "QuantitativeValue",
              "minValue": 10,
              "maxValue": 21,
              "unitCode": "DAY"
            }
          },
          {
            "@type": "Offer",
            "name": "Royal Sovereign Experience",
            "description": "Presidential accommodations, government VIP protocols, diplomatic exchanges, custom experiences",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "100000+",
              "priceCurrency": "USD"
            },
            "availabilityStarts": "2024-01-01", 
            "validFrom": "2024-01-01",
            "eligibleDuration": {
              "@type": "QuantitativeValue",
              "minValue": 14,
              "maxValue": 30,
              "unitCode": "DAY"
            }
          }
        ]
      },
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "25000",
        "highPrice": "500000",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "127",
        "bestRating": "5"
      },
      "knowsAbout": [
        "Ultra-Luxury Travel",
        "UHNW Services",
        "Private Aviation",
        "Luxury Accommodations",
        "Cultural Immersion",
        "Exclusive Access",
        "Concierge Services",
        "Security Protection",
        "Privacy Services",
        "Bespoke Experiences",
        "Royal Treatments",
        "Traditional Healing",
        "Wildlife Safaris",
        "Marine Experiences",
        "Cultural Ceremonies",
        "Archaeological Sites",
        "Tea Plantation Tours",
        "Culinary Experiences",
        "Wellness Retreats",
        "Adventure Tourism"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+94-11-luxury-line",
        "contactType": "Luxury Concierge",
        "availableLanguage": ["English", "Mandarin", "Arabic", "French", "Spanish"],
        "hoursAvailable": "24/7"
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Minimum Package Value",
          "value": "$25,000 USD"
        },
        {
          "@type": "PropertyValue", 
          "name": "Maximum Group Size",
          "value": "30 guests"
        },
        {
          "@type": "PropertyValue",
          "name": "Advance Booking Required",
          "value": "30-90 days"
        },
        {
          "@type": "PropertyValue",
          "name": "Privacy Level",
          "value": "Maximum Discretion"
        }
      ]
    }
  }

  static generateWellnessStructuredData(data: any) {
    return {
      "@context": "https://schema.org",
      "@type": "HealthAndBeautyBusiness",
      "name": "Recharge Travels - Ancient Sri Lankan Wellness Heritage",
      "description": "Experience authentic Ayurvedic treatments rooted in Sri Lanka's 2,500+ year healing heritage, featuring traditions from the world's first hospitals",
      "url": `${this.baseUrl}/wellness-packages`,
      "foundingDate": "500 BCE",
      "historicalInfo": "Sri Lanka is home to the world's first hospitals established over 2,000 years ago, making it the birthplace of organized healthcare and Ayurvedic medicine",
      "specialServices": [
        "Ancient Ayurvedic Treatments",
        "Traditional Herbal Medicine", 
        "Historical Wellness Practices",
        "Authentic Sri Lankan Healing",
        "Panchakarma Detoxification",
        "Therapeutic Massages",
        "Rejuvenation Therapies"
      ],
      "areaServed": {
        "@type": "Country",
        "name": "Sri Lanka"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1250",
        "bestRating": "5"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "LK",
        "addressRegion": "All Provinces",
        "addressLocality": "Multiple Locations"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "7.8731",
        "longitude": "80.7718"
      },
      "knowsAbout": [
        "Ancient Ayurveda",
        "Traditional Sri Lankan Medicine",
        "Wellness Heritage",
        "Panchakarma Detox",
        "Herbal Treatments",
        "Therapeutic Massages",
        "Meditation Retreats",
        "Spa Treatments",
        "Yoga Therapy",
        "Natural Healing"
      ]
    }
  }

  static generateDestinationStructuredData(destination: any) {
    return {
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      "name": destination.name,
      "description": destination.summary || destination.meta_description,
      "url": `${this.baseUrl}/destinations/${destination.slug}`,
      "image": destination.og_image_url,
      "geo": destination.latitude && destination.longitude ? {
        "@type": "GeoCoordinates",
        "latitude": destination.latitude,
        "longitude": destination.longitude
      } : undefined,
      "containedInPlace": {
        "@type": "Country",
        "name": "Sri Lanka"
      },
      "touristType": destination.dest_type,
      "hasMap": `https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`,
      "isAccessibleForFree": false,
      "publicAccess": true
    }
  }

  static generateArticleStructuredData(article: any) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.meta_description,
      "url": `${this.baseUrl}/articles/${article.slug}`,
      "image": article.og_image_url,
      "datePublished": article.published_at,
      "dateModified": article.updated_at,
      "author": {
        "@type": "Organization",
        "name": "Recharge Travels",
        "url": this.baseUrl
      },
      "publisher": {
        "@type": "Organization",
        "name": "Recharge Travels",
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${this.baseUrl}/articles/${article.slug}`
      },
      "about": {
        "@type": "Place",
        "name": "Sri Lanka"
      },
      "keywords": [
        "Sri Lanka travel",
        "Sri Lanka guide", 
        "Sri Lanka tourism",
        article.content_type
      ].join(", ")
    }
  }

  static generateCulturalToursStructuredData(data: any) {
    return {
      "@context": "https://schema.org",
      "@type": ["TravelAgency", "CulturalOrganization"],
      "name": "Recharge Travels - Ultra-Luxury Sri Lanka Cultural Heritage Tours",
      "description": "Exclusive ultra-luxury cultural and archaeological tours in Sri Lanka for UHNW individuals, featuring private temple access, government VIP protocols, and exclusive heritage experiences",
      "url": `${this.baseUrl}/tours/cultural`,
      "priceRange": "$$$$$",
      "currenciesAccepted": ["USD", "EUR", "GBP", "CHF"],
      "areaServed": {
        "@type": "Country",
        "name": "Sri Lanka"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Ultra-Luxury Cultural Heritage Tour Packages",
        "itemListElement": [
          {
            "@type": "Offer",
            "name": "Platinum Heritage Experience",
            "description": "Private helicopter access, exclusive temple ceremonies, personal archaeologists, royal palace accommodations",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "25000-50000",
              "priceCurrency": "USD"
            }
          },
          {
            "@type": "Offer",
            "name": "Diamond Cultural Immersion",
            "description": "Government VIP access, restricted heritage sites, master craftsman workshops, UNESCO site buyouts",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "50000-100000",
              "priceCurrency": "USD"
            }
          },
          {
            "@type": "Offer",
            "name": "Royal Heritage Sovereignty",
            "description": "Presidential cultural protocols, unexplored archaeological sites, traditional coronation ceremonies",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "100000+",
              "priceCurrency": "USD"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "156",
        "bestRating": "5"
      },
      "knowsAbout": [
        "Ancient Sri Lankan Heritage",
        "UNESCO World Heritage Sites",
        "Buddhist Temple Ceremonies",
        "Archaeological Excavations",
        "Cultural Protocol Specialists",
        "Heritage Estate Accommodations",
        "Traditional Craft Workshops",
        "Royal Court Experiences",
        "Government VIP Access",
        "Religious Blessing Ceremonies",
        "Historical Documentation",
        "Cultural Legacy Establishment"
      ]
    }
  }

  static generateFAQStructuredData(faqs: Array<{question: string, answer: string}>) {
    return {
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
    }
  }

  static generateBreadcrumbStructuredData(breadcrumbs: Array<{name: string, url: string}>) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    }
  }
}
