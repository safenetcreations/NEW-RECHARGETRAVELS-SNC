import React from 'react';
import VehicleCategoryPage from './VehicleCategoryPage';

const SUVVehicles = () => {
    return (
        <VehicleCategoryPage
            categoryName="SUV"
            categorySlug="suv"
            tagline="Adventure Ready"
            description="Powerful 4x4 vehicles perfect for exploring Sri Lanka's diverse terrain. From hill country to wildlife parks, these vehicles handle it all with comfort and style."
            heroImages={[
                'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1606611013016-969c19ba5dce?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1551952237-954a0f81f716?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1562911239-d4ce2bb94de1?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1568844293986-8c3a5b0aa9b6?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1617654112329-40cc577df1fc?w=800&h=600&fit=crop',
            ]}
            variants={[
                {
                    name: 'Toyota RAV4',
                    seats: 5,
                    bagsWithPassengers: 4,
                    maxPassengers: 5,
                    largeBags: 3,
                    smallBags: 3,
                    pricePerDay: 75,
                    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop',
                },
                {
                    name: 'Nissan X-Trail',
                    seats: 7,
                    bagsWithPassengers: 5,
                    maxPassengers: 7,
                    largeBags: 3,
                    smallBags: 4,
                    pricePerDay: 85,
                    image: 'https://images.unsplash.com/photo-1606611013016-969c19ba5dce?w=800&h=600&fit=crop',
                },
                {
                    name: 'Toyota Prado',
                    seats: 7,
                    bagsWithPassengers: 5,
                    maxPassengers: 7,
                    largeBags: 4,
                    smallBags: 4,
                    pricePerDay: 120,
                    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop',
                },
                {
                    name: 'Mitsubishi Montero',
                    seats: 7,
                    bagsWithPassengers: 5,
                    maxPassengers: 7,
                    largeBags: 4,
                    smallBags: 4,
                    pricePerDay: 130,
                    image: 'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&h=600&fit=crop',
                },
            ]}
            features={[
                '4WD / AWD',
                'High Ground Clearance',
                'Full Air Conditioning',
                'Large Boot Space',
                'Cruise Control',
                'Bluetooth & USB',
                'Rear Camera',
                'Insurance Included',
                'Off-Road Capable',
                'Safari Ready',
            ]}
            idealFor={[
                'Families (5-7)',
                'Adventure Seekers',
                'Wildlife Safaris',
                'Hill Country Trips',
                'Group Travel',
                'Off-Road Adventures',
            ]}
            addOns={[
                { name: 'GPS Navigation', price: 5, description: 'Per day' },
                { name: 'Child Seat', price: 8, description: 'Per rental' },
                { name: 'WiFi Hotspot', price: 7, description: 'Per day' },
                { name: 'Extra Driver', price: 10, description: 'Per day' },
                { name: 'Cooler Box', price: 5, description: 'Per rental' },
                { name: 'Roof Rack', price: 10, description: 'Per rental' },
                { name: 'Safari Package', price: 25, description: 'Includes binoculars & guide book' },
            ]}
        />
    );
};

export default SUVVehicles;
