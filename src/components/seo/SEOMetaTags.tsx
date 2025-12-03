import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOMetaTagsProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
}

/**
 * SEO Meta Tags Component
 * Adds comprehensive meta tags for SEO and social sharing
 */
export const SEOMetaTags: React.FC<SEOMetaTagsProps> = ({
    title,
    description,
    keywords,
    image = 'https://www.rechargetravels.com/og-image.jpg',
    url = 'https://www.rechargetravels.com',
    type = 'website',
    author = 'Recharge Travels',
    publishedTime,
    modifiedTime,
}) => {
    const fullTitle = title.includes('Recharge Travels')
        ? title
        : `${title} | Recharge Travels - Sri Lanka Tours & Travel`;

    const canonicalUrl = url.endsWith('/') ? url.slice(0, -1) : url;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="Recharge Travels" />
            <meta property="og:locale" content="en_US" />
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonicalUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
            <meta name="twitter:creator" content="@rechargetravels" />

            {/* Additional SEO Meta Tags */}
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="googlebot" content="index, follow" />
            <meta name="bingbot" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />
            <meta name="rating" content="General" />
            <meta name="distribution" content="global" />

            {/* Geographic Tags */}
            <meta name="geo.region" content="LK" />
            <meta name="geo.placename" content="Colombo, Sri Lanka" />
            <meta name="geo.position" content="6.9271;79.8612" />
            <meta name="ICBM" content="6.9271, 79.8612" />

            {/* Mobile */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
            <meta name="format-detection" content="telephone=yes" />
            <meta name="theme-color" content="#0D9488" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        </Helmet>
    );
};

/**
 * Pre-configured SEO components for common page types
 */

export const DestinationSEO: React.FC<{
    destination: string;
    description: string;
    image?: string;
    attractions?: string[];
}> = ({ destination, description, image, attractions }) => (
    <SEOMetaTags
        title={`${destination} Tours & Travel Guide - Best ${destination} Tour Packages`}
        description={description}
        keywords={`${destination}, ${destination} tours, ${destination} travel, ${destination} tourism, visit ${destination}, things to do in ${destination}${attractions ? ', ' + attractions.join(', ') : ''}`}
        image={image}
        url={`https://www.rechargetravels.com/destinations/${destination.toLowerCase().replace(/\s+/g, '-')}`}
    />
);

export const TourSEO: React.FC<{
    tourName: string;
    description: string;
    price?: number;
    duration?: string;
    image?: string;
}> = ({ tourName, description, price, duration, image }) => {
    const priceText = price ? ` from $${price}` : '';
    const durationText = duration ? ` | ${duration}` : '';

    return (
        <SEOMetaTags
            title={`${tourName} - Sri Lanka Tour Package${priceText}${durationText}`}
            description={description}
            keywords={`${tourName}, Sri Lanka tours, tour packages, travel Sri Lanka, book tours`}
            image={image}
            url={`https://www.rechargetravels.com/tours/${tourName.toLowerCase().replace(/\s+/g, '-')}`}
        />
    );
};

export const ExperienceSEO: React.FC<{
    experienceName: string;
    description: string;
    location?: string;
    price?: number;
    image?: string;
}> = ({ experienceName, description, location, price, image }) => {
    const locationText = location ? ` in ${location}` : '';
    const priceText = price ? ` - ${price} USD` : '';

    return (
        <SEOMetaTags
            title={`${experienceName}${locationText} - Unique Sri Lanka Experience${priceText}`}
            description={description}
            keywords={`${experienceName}, ${location ? location + ' experiences,' : ''} Sri Lanka activities, things to do, adventure activities`}
            image={image}
            url={`https://www.rechargetravels.com/experiences/${experienceName.toLowerCase().replace(/\s+/g, '-')}`}
        />
    );
};

export default SEOMetaTags;
