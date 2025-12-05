import React from 'react';
import VehicleCategoryPage from './VehicleCategoryPage';

const MiniCoachVehicles = () => {
    return (
        <VehicleCategoryPage
            categoryName="Mini Coach"
            categorySlug="mini-coach"
            tagline="Comfortable Group Transport"
            description="Perfect for medium-sized groups and tours. Our mini coaches offer comfortable seating, air conditioning, and ample luggage space for extended trips across Sri Lanka."
            heroImages={[
                'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1559829604-f95e1c1e5cee?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop',
            ]}
            variants={[
                {
                    name: '22-Seater Mini Coach',
                    seats: 22,
                    bagsWithPassengers: 18,
                    maxPassengers: 22,
                    largeBags: 15,
                    smallBags: 22,
                    pricePerDay: 150,
                    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
                },
                {
                    name: '33-Seater Mini Coach',
                    seats: 33,
                    bagsWithPassengers: 28,
                    maxPassengers: 33,
                    largeBags: 25,
                    smallBags: 33,
                    pricePerDay: 185,
                    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop',
                },
            ]}
            features={[
                'Full Air Conditioning',
                'Reclining Seats',
                'Ample Legroom',
                'Large Luggage Hold',
                'PA System',
                'USB Charging',
                'Curtains',
                'Insurance Included',
                'Professional Driver',
                'First Aid Kit',
            ]}
            idealFor={[
                'Tour Groups',
                'Corporate Events',
                'Wedding Transport',
                'School Trips',
                'Pilgrimage Tours',
                'Sports Teams',
                'Conference Shuttles',
                'Airport Groups',
            ]}
            addOns={[
                { name: 'Tour Guide', price: 50, description: 'Per day - English speaking' },
                { name: 'WiFi Hotspot', price: 10, description: 'Per day' },
                { name: 'Cooler Box (XL)', price: 10, description: 'Per rental' },
                { name: 'PA System Upgrade', price: 20, description: 'Per rental' },
                { name: 'Airport Meet & Greet', price: 25, description: 'One time' },
                { name: 'Refreshments Package', price: 5, description: 'Per person - water & snacks' },
            ]}
        />
    );
};

export default MiniCoachVehicles;
