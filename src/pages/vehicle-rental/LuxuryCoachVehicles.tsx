import React from 'react';
import VehicleCategoryPage from './VehicleCategoryPage';

const LuxuryCoachVehicles = () => {
    return (
        <VehicleCategoryPage
            categoryName="Luxury Coach"
            categorySlug="luxury-coach"
            tagline="Premium Group Experience"
            description="Experience group travel in ultimate comfort. Our luxury coaches feature premium seating, entertainment systems, and first-class amenities for an unforgettable journey."
            heroImages={[
                'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1559829604-f95e1c1e5cee?w=800&h=600&fit=crop',
            ]}
            variants={[
                {
                    name: '45-Seater Luxury Coach',
                    seats: 45,
                    bagsWithPassengers: 40,
                    maxPassengers: 45,
                    largeBags: 45,
                    smallBags: 45,
                    pricePerDay: 280,
                    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop',
                },
                {
                    name: '55-Seater Premium Coach',
                    seats: 55,
                    bagsWithPassengers: 50,
                    maxPassengers: 55,
                    largeBags: 55,
                    smallBags: 55,
                    pricePerDay: 350,
                    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
                },
            ]}
            features={[
                'Premium AC System',
                'Reclining Leather Seats',
                'Extra Legroom',
                'Large Luggage Hold',
                'PA & Entertainment System',
                'WiFi Onboard',
                'USB Charging',
                'Tinted Windows',
                'Toilet Onboard',
                'Professional Driver',
                'Insurance Included',
                'First Aid Kit',
            ]}
            idealFor={[
                'Large Tour Groups',
                'Corporate Events',
                'VIP Transport',
                'Wedding Guests',
                'International Tours',
                'Conference Groups',
                'Festival Transport',
                'Luxury Pilgrimages',
            ]}
            addOns={[
                { name: 'Tour Guide', price: 60, description: 'Per day - Multilingual' },
                { name: 'Premium WiFi', price: 15, description: 'Per day - High speed' },
                { name: 'Refreshments Package', price: 8, description: 'Per person - Premium' },
                { name: 'Airport VIP Meet', price: 50, description: 'With banner & welcome' },
                { name: 'Video Recording', price: 100, description: 'Professional videographer' },
                { name: 'Flower Decoration', price: 75, description: 'For special occasions' },
            ]}
        />
    );
};

export default LuxuryCoachVehicles;
