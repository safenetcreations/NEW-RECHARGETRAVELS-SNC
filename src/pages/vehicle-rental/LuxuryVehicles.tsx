import React from 'react';
import VehicleCategoryPage from './VehicleCategoryPage';

const LuxuryVehicles = () => {
    return (
        <VehicleCategoryPage
            categoryName="Luxury"
            categorySlug="luxury"
            tagline="Travel in Ultimate Style"
            description="Experience Sri Lanka in unparalleled luxury. Premium vehicles with chauffeur service, perfect for business executives, VIPs, and special occasions."
            heroImages={[
                'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1617654112329-40cc577df1fc?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=800&h=600&fit=crop',
            ]}
            variants={[
                {
                    name: 'Mercedes-Benz E-Class',
                    seats: 4,
                    bagsWithPassengers: 3,
                    maxPassengers: 4,
                    largeBags: 3,
                    smallBags: 2,
                    pricePerDay: 180,
                    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
                },
                {
                    name: 'BMW 5 Series',
                    seats: 4,
                    bagsWithPassengers: 3,
                    maxPassengers: 4,
                    largeBags: 3,
                    smallBags: 2,
                    pricePerDay: 175,
                    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
                },
                {
                    name: 'Mercedes-Benz S-Class',
                    seats: 4,
                    bagsWithPassengers: 3,
                    maxPassengers: 4,
                    largeBags: 3,
                    smallBags: 2,
                    pricePerDay: 280,
                    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
                },
                {
                    name: 'Range Rover Vogue',
                    seats: 5,
                    bagsWithPassengers: 4,
                    maxPassengers: 5,
                    largeBags: 4,
                    smallBags: 3,
                    pricePerDay: 320,
                    image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&h=600&fit=crop',
                },
            ]}
            features={[
                'Premium Leather Interior',
                'Climate Control',
                'Massage Seats',
                'Entertainment System',
                'WiFi Onboard',
                'Tinted Privacy Glass',
                'Premium Sound System',
                'Professional Chauffeur',
                'Water & Refreshments',
                'Insurance Included',
                'VIP Treatment',
                'Red Carpet Optional',
            ]}
            idealFor={[
                'Business Executives',
                'VIP Transport',
                'Wedding Cars',
                'Special Occasions',
                'Airport Transfers',
                'Corporate Events',
                'Honeymoon Couples',
                'Photo Shoots',
            ]}
            addOns={[
                { name: 'VIP Airport Meet', price: 50, description: 'With board & flowers' },
                { name: 'Champagne Service', price: 75, description: 'Premium selection' },
                { name: 'Red Carpet', price: 100, description: 'For special arrivals' },
                { name: 'Flower Decoration', price: 80, description: 'For weddings' },
                { name: 'Multi-City Tour', price: 0, description: 'Contact for pricing' },
                { name: 'Bodyguard Service', price: 150, description: 'Per day - Professional' },
            ]}
        />
    );
};

export default LuxuryVehicles;
