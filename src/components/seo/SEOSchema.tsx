import React from 'react';
import { Helmet } from 'react-helmet-async';
import { buildAggregateRating, buildBrand, buildOffersFromItems, getBaseUrl, parsePrice } from '@/utils/seoSchemaHelpers';

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
    const baseUrl = getBaseUrl();
    const brand = buildBrand(baseUrl);

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
                    url: baseUrl,
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
                    aggregateRating: buildAggregateRating(data.rating?.value, data.rating?.count),
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
                    offers: parsePrice(data.price) !== null ? {
                        '@type': 'Offer',
                        price: parsePrice(data.price),
                        priceCurrency: data.currency || 'USD',
                        availability: 'https://schema.org/InStock',
                        url: baseUrl,
                        seller: brand
                    } : undefined,
                    provider: {
                        '@type': 'TravelAgency',
                        name: 'Recharge Travels',
                        url: baseUrl,
                    },
                    aggregateRating: buildAggregateRating(data.rating?.value, data.rating?.count),
                };

            case 'Product':
                return {
                    ...baseSchema,
                    '@type': 'Product',
                    name: data.name,
                    description: data.description,
                    image: data.image,
                    offers: buildOffersFromItems([{ name: data.name, price: data.price }], baseUrl),
                    aggregateRating: buildAggregateRating(data.rating?.value, data.rating?.count),
                    brand
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
