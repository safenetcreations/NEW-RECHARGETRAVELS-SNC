import React from 'react';
import VehicleCategoryPage from './VehicleCategoryPage';

const VanVehicles = () => {
    return (
        <VehicleCategoryPage
            categoryName="Van"
            categorySlug="van"
            tagline="Group Travel Made Easy"
            description="Spacious passenger vans perfect for group travel, family reunions, and tours. Available in 9-seater and 14-seater configurations to suit your group size."
            heroImages={[
                'https://images.unsplash.com/photo-1559829604-f95e1c1e5cee?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1506015391gy-ba315sfc579f?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&h=600&fit=crop',
            ]}
            variants={[
                {
                    name: '9-Seater Van',
                    seats: 9,
                    bagsWithPassengers: 6,
                    maxPassengers: 9,
                    largeBags: 4,
                    smallBags: 5,
                    pricePerDay: 85,
                    image: 'https://images.unsplash.com/photo-1559829604-f95e1c1e5cee?w=800&h=600&fit=crop',
                },
                {
                    name: '14-Seater Van',
                    seats: 14,
                    bagsWithPassengers: 10,
                    maxPassengers: 14,
                    largeBags: 6,
                    smallBags: 8,
                    pricePerDay: 110,
                    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop',
                },
            ]}
            features={[
                'Full Air Conditioning',
                'Reclining Seats',
                'Ample Legroom',
                'Large Luggage Space',
                'USB Charging Ports',
                'Bluetooth Audio',
                'Sliding Doors',
                'Insurance Included',
                'Professional Driver',
                'Island-wide Service',
            ]}
            idealFor={[
                'Large Families',
                'Group Tours',
                'Wedding Parties',
                'Corporate Groups',
                'Airport Transfers',
                'Pilgrimage Tours',
                'School Trips',
                'Sports Teams',
            ]}
            addOns={[
                { name: 'GPS Navigation', price: 5, description: 'Per day' },
                { name: 'Child Seats (x2)', price: 12, description: 'Per rental' },
                { name: 'WiFi Hotspot', price: 7, description: 'Per day' },
                { name: 'Cooler Box (Large)', price: 8, description: 'Per rental' },
                { name: 'PA System', price: 15, description: 'For guides - per rental' },
                { name: 'Airport Meet & Greet', price: 20, description: 'One time' },
            ]}
        />
    );
};

export default VanVehicles;
