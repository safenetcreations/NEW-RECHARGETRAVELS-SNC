import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOSchemaProps {
    type: 'LocalBusiness' | 'TouristAttraction' | 'TouristTrip' | 'Product';
    data: {
        name: string;
        description: string;
        image?: string;
        price?: number;
        currency?: string;
        location?: {
            name: string;
            latitude: number;
            longitude: number;
        };
        itinerary?: Array<{
            name: string;
            description: string;
        }>;
        rating?: {
            value: number;
            count: number;
        };
    };
}

/**
 * SEO Schema Markup Component
 * Adds structured data for better Google indexing
 */
export const SEOSchema: React.FC<SEOSchemaProps> = ({ type, data }) => {
    const baseUrl =
        typeof window !== 'undefined'
            ? window.location.origin
            : 'https://recharge-travels-73e76.web.app'

    const generateSchema = () => {
        const baseSchema = {
            '@context': 'https://schema.org',
        };

        switch (type) {
            case 'LocalBusiness':
                return {
                    ...baseSchema,
                    '@type': 'TravelAgency',
                    name: 'Recharge Travels',
                    image: `${baseUrl}/logo-v2.png`,
                    description: data.description,
                    telephone: '+94-77-772-1999',
                    email: 'info@rechargetravels.com',
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: 'Your Street Address',
                        addressLocality: 'Colombo',
                        addressRegion: 'Western Province',
                        postalCode: '00100',
                        addressCountry: 'LK',
                    },
                    geo: {
                        '@type': 'GeoCoordinates',
                        latitude: 6.9271,
                        longitude: 79.8612,
                    },
                    url: 'https://www.rechargetravels.com',
                    priceRange: '$$-$$$',
                    sameAs: [
                        'https://www.facebook.com/rechargetravels',
                        'https://www.instagram.com/rechargetravels',
                        'https://www.youtube.com/@rechargetravelsltdColombo',
                    ],
                };

            case 'TouristAttraction':
                return {
                    ...baseSchema,
                    '@type': 'TouristAttraction',
                    name: data.name,
                    description: data.description,
                    image: data.image,
                    geo: data.location ? {
                        '@type': 'GeoCoordinates',
                        latitude: data.location.latitude,
                        longitude: data.location.longitude,
                    } : undefined,
                    aggregateRating: data.rating ? {
                        '@type': 'AggregateRating',
                        ratingValue: data.rating.value,
                        reviewCount: data.rating.count,
                    } : undefined,
                };

            case 'TouristTrip':
                return {
                    ...baseSchema,
                    '@type': 'TouristTrip',
                    name: data.name,
                    description: data.description,
                    image: data.image,
                    itinerary: data.itinerary ? {
                        '@type': 'ItemList',
                        itemListElement: data.itinerary.map((item, index) => ({
                            '@type': 'ListItem',
                            position: index + 1,
                            item: {
                                '@type': 'TouristAttraction',
                                name: item.name,
                                description: item.description,
                            },
                        })),
                    } : undefined,
                    offers: data.price ? {
                        '@type': 'Offer',
                        price: data.price,
                        priceCurrency: data.currency || 'USD',
                        availability: 'https://schema.org/InStock',
                    } : undefined,
                    provider: {
                        '@type': 'TravelAgency',
                        name: 'Recharge Travels',
                        url: 'https://www.rechargetravels.com',
                    },
                    aggregateRating: data.rating ? {
                        '@type': 'AggregateRating',
                        ratingValue: data.rating.value,
                        reviewCount: data.rating.count,
                    } : undefined,
                };

            case 'Product':
                return {
                    ...baseSchema,
                    '@type': 'Product',
                    name: data.name,
                    description: data.description,
                    image: data.image,
                    offers: {
                        '@type': 'Offer',
                        price: data.price,
                        priceCurrency: data.currency || 'USD',
                        availability: 'https://schema.org/InStock',
                        seller: {
                            '@type': 'Organization',
                            name: 'Recharge Travels',
                        },
                    },
                    aggregateRating: data.rating ? {
                        '@type': 'AggregateRating',
                        ratingValue: data.rating.value,
                        reviewCount: data.rating.count,
                    } : undefined,
                };

            default:
                return baseSchema;
        }
    };

    const schema = generateSchema();

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};

export default SEOSchema;
