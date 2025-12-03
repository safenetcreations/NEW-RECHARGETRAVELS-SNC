import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildBrand, getBaseUrl } from '@/utils/seoSchemaHelpers';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: object;
  alternateLanguages?: { lang: string; url: string }[];
  noIndex?: boolean;
  noFollow?: boolean;
}

const ComprehensiveSEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = '/images/sri-lanka-hero.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  alternateLanguages = [],
  noIndex = false,
  noFollow = false
}) => {
  const { language } = useLanguage();
  const baseUrl = getBaseUrl();
  const brand = buildBrand(baseUrl);
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;

  // Default keywords for Sri Lanka travel
  const defaultKeywords = [
    'Sri Lanka travel',
    'Sri Lanka tours',
    'Sri Lanka destinations',
    'Sri Lanka safari',
    'Sri Lanka culture',
    'Sri Lanka beaches',
    'Sri Lanka temples',
    'Sri Lanka wildlife',
    'Sri Lanka tea plantations',
    'Sri Lanka itinerary',
    'visit Sri Lanka',
    'Sri Lanka guide',
    'Sri Lanka vacation',
    'Sri Lanka holidays',
    'Sri Lanka travel agency',
    'Ceylon travel',
    'Jaffna tours',
    'Indian Tamil tourism',
    'Palaly airport taxi',
    'Sri Lanka luxury tours',
    'Sri Lanka honeymoon',
    'Sri Lanka photography tours',
    'Sri Lanka eco tourism'
  ];

  const allKeywords = [...defaultKeywords, ...keywords].join(', ');

  // Default structured data for travel agency
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Recharge Travels & Tours Ltd",
    "description": "Your trusted partner for unforgettable Sri Lanka adventures",
    "url": baseUrl,
    "logo": `${baseUrl}/logo-v2.png`,
    "image": ogImage,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "LK",
      "addressRegion": "Western Province",
      "addressLocality": "Colombo"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+94-77-772-1999",
      "contactType": "customer service",
      "availableLanguage": ["English", "Tamil", "Sinhala"]
    },
    "sameAs": brand.sameAs,
    "areaServed": {
      "@type": "Country",
      "name": "Sri Lanka"
    },
    "serviceType": [
      "Cultural Tours",
      "Beach Tours",
      "Wildlife Safaris",
      "Luxury Tours",
      "Photography Tours",
      "Eco Tourism",
      "Airport Transfers",
      "Hotel Bookings"
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content="Recharge Travels & Tours Ltd" />
      <meta name="robots" content={`${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}`} />
      <meta
        name="googlebot"
        content={`${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}, max-snippet:-1, max-image-preview:large, max-video-preview:-1`}
      />
      <meta
        name="bingbot"
        content={`${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}, max-snippet:-1, max-image-preview:large, max-video-preview:-1`}
      />

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Language and Region */}
      <meta name="language" content={language} />
      <meta name="geo.region" content="LK" />
      <meta name="geo.country" content="Sri Lanka" />
      <meta name="geo.placename" content="Colombo" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Recharge Travels" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
      <meta name="twitter:site" content="@rechargetravels" />
      <meta name="twitter:creator" content="@rechargetravels" />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#1e40af" />
      <meta name="msapplication-TileColor" content="#1e40af" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Recharge Travels" />

      {/* Mobile Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* Security Meta Tags */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />

      {/* Alternate Language Links */}
      {alternateLanguages.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={`${baseUrl}${url}`} />
      ))}

      {/* Default language */}
      <link rel="alternate" hrefLang="x-default" href={fullCanonicalUrl} />

      {/* Favicon and App Icons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Additional Structured Data for Travel */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Recharge Travels",
          "url": baseUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      {/* Organization Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Recharge Travels & Tours Ltd",
          "url": baseUrl,
          "logo": `${baseUrl}/logo-v2.png`,
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+94-77-772-1999",
            "contactType": "customer service",
            "areaServed": "LK",
            "availableLanguage": ["English", "Tamil", "Sinhala"]
          },
          "sameAs": [
            "https://www.facebook.com/rechargetravels",
            "https://www.instagram.com/rechargetravels",
            "https://www.youtube.com/rechargetravels"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default ComprehensiveSEO; 
