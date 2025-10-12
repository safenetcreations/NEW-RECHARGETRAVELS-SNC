import { Helmet } from 'react-helmet-async';

const HomepageSchema = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Recharge Travels Sri Lanka",
    "url": "https://recharge-travels-73e76.web.app",
    "logo": "https://recharge-travels-73e76.web.app/logo.png",
    "description": "Premium travel agency offering luxury tours, transfers, and experiences across Sri Lanka",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Galle Road",
      "addressLocality": "Colombo",
      "addressRegion": "Western Province",
      "postalCode": "00300",
      "addressCountry": "LK"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+94-11-234-5678",
      "contactType": "customer service",
      "areaServed": "LK",
      "availableLanguage": ["English", "Sinhala", "Tamil"]
    },
    "sameAs": [
      "https://www.facebook.com/rechargetravels",
      "https://www.instagram.com/rechargetravels",
      "https://twitter.com/rechargetravels"
    ],
    "priceRange": "$$-$$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2847"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://recharge-travels-73e76.web.app"
    }]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the best times to visit Sri Lanka?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best time to visit Sri Lanka depends on which region you plan to explore. December to March is ideal for the west and south coasts, while April to September is perfect for the east coast and cultural triangle."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need a visa to visit Sri Lanka?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, most visitors need an Electronic Travel Authorization (ETA) to enter Sri Lanka. You can apply online before arrival. The tourist visa is valid for 30 days and can be extended."
        }
      },
      {
        "@type": "Question",
        "name": "What currency is used in Sri Lanka?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Sri Lankan Rupee (LKR) is the official currency. Major credit cards are accepted in hotels and large establishments, but cash is preferred for smaller vendors and local markets."
        }
      },
      {
        "@type": "Question",
        "name": "Is Sri Lanka safe for tourists?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Sri Lanka is generally safe for tourists. The country has a low crime rate and locals are friendly and welcoming. As with any destination, exercise normal precautions and stay aware of your surroundings."
        }
      }
    ]
  };

  const tourSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Featured Sri Lanka Tours",
    "itemListElement": [
      {
        "@type": "TouristTrip",
        "name": "Golden Triangle Tour",
        "description": "7-day luxury tour covering Colombo, Kandy, Sigiriya, and Dambulla",
        "touristType": "Cultural Tourism",
        "duration": "P7D",
        "offers": {
          "@type": "Offer",
          "price": "1299",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "TouristTrip",
        "name": "Wildlife Safari Adventure",
        "description": "6-day wildlife tour featuring Yala and Udawalawe National Parks",
        "touristType": "Ecotourism",
        "duration": "P6D",
        "offers": {
          "@type": "Offer",
          "price": "1099",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(tourSchema)}
      </script>
    </Helmet>
  );
};

export default HomepageSchema;