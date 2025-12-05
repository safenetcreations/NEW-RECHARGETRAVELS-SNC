import React from 'react';
import VehicleCategoryPage from './VehicleCategoryPage';

const CompactVehicles = () => {
    return (
        <VehicleCategoryPage
            categoryName="Compact"
            categorySlug="compact"
            tagline="Perfect Balance of Size & Comfort"
            description="Ideal blend of economy and comfort. Perfect for small families and couples with luggage. Easy to drive and park while offering more space than economy cars."
            heroImages={[
                'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1606611013016-969c19ba5dce?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop',
            ]}
            variants={[
                {
                    name: 'Toyota Aqua / Prius C',
                    seats: 5,
                    bagsWithPassengers: 3,
                    maxPassengers: 5,
                    largeBags: 2,
                    smallBags: 2,
                    pricePerDay: 45,
                    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop',
                },
                {
                    name: 'Honda Fit / Jazz',
                    seats: 5,
                    bagsWithPassengers: 4,
                    maxPassengers: 5,
                    largeBags: 2,
                    smallBags: 3,
                    pricePerDay: 50,
                    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop',
                },
            ]}
            features={[
                'Air Conditioning',
                'Hybrid Engine Option',
                'Spacious Boot',
                'USB Charging',
                'Bluetooth Audio',
                'Rear Camera',
                'Central Locking',
                'Insurance Included',
            ]}
            idealFor={[
                'Small Families',
                'Couples with Luggage',
                'City & Country',
                'Week-long Trips',
                'Comfort Seekers',
                'Eco-Conscious Travelers',
            ]}
            addOns={[
                { name: 'GPS Navigation', price: 5, description: 'Per day' },
                { name: 'Child Seat', price: 8, description: 'Per rental' },
                { name: 'WiFi Hotspot', price: 7, description: 'Per day' },
                { name: 'Extra Driver', price: 10, description: 'Per day' },
                { name: 'Cooler Box', price: 5, description: 'Per rental' },
            ]}
        />
    );
};

export default CompactVehicles;
