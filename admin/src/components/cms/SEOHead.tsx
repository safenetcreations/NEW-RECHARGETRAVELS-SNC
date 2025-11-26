
import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title?: string
  description?: string
  ogImage?: string
  canonicalUrl?: string
  structuredData?: object
  alternateUrls?: { lang: string; url: string }[]
}

const SEOHead = ({ 
  title = 'Sri Lanka Travel Guide - Recharge Travels',
  description = 'Discover the beauty of Sri Lanka with our comprehensive travel guide. Find destinations, tours, and travel tips for your perfect Sri Lankan adventure.',
  ogImage = '/placeholder.svg',
  canonicalUrl,
  structuredData,
  alternateUrls = []
}: SEOHeadProps) => {
  const fullTitle = title.includes('Recharge Travels') ? title : `${title} | Recharge Travels`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Recharge Travels" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Alternate URLs for different languages */}
      {alternateUrls.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Additional SEO meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Recharge Travels" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  )
}

export default SEOHead
