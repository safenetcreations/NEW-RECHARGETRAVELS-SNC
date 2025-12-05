import React from 'react';
import VehicleCategoryPage from './VehicleCategoryPage';

const SedanVehicles = () => {
    return (
        <VehicleCategoryPage
            categoryName="Sedan"
            categorySlug="sedan"
            tagline="Comfortable & Spacious"
            description="Classic comfort for families and business travelers. Spacious interiors with ample legroom and boot space. Perfect for longer journeys across Sri Lanka."
            heroImages={[
                'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1593055357429-5c2c41e27fe9?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1568844293986-8c3a5b0aa9b6?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop',
            ]}
            variants={[
                {
                    name: 'Toyota Axio / Corolla',
                    seats: 5,
                    bagsWithPassengers: 4,
                    maxPassengers: 5,
                    largeBags: 3,
                    smallBags: 2,
                    pricePerDay: 55,
                    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop',
                },
                {
                    name: 'Toyota Premio / Allion',
                    seats: 5,
                    bagsWithPassengers: 4,
                    maxPassengers: 5,
                    largeBags: 3,
                    smallBags: 3,
                    pricePerDay: 60,
                    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
                },
                {
                    name: 'Honda Grace / City',
                    seats: 5,
                    bagsWithPassengers: 4,
                    maxPassengers: 5,
                    largeBags: 3,
                    smallBags: 2,
                    pricePerDay: 58,
                    image: 'https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=800&h=600&fit=crop',
                },
            ]}
            features={[
                'Full Air Conditioning',
                'Spacious Boot',
                'Cruise Control',
                'USB & Aux Input',
                'Bluetooth Audio',
                'Rear Camera',
                'Power Windows',
                'Insurance Included',
                'Comfortable Seating',
                'Ample Legroom',
            ]}
            idealFor={[
                'Families (4-5)',
                'Business Travelers',
                'Airport Transfers',
                'Long Distance',
                'Couples with Luggage',
                'VIP Transport',
            ]}
            addOns={[
                { name: 'GPS Navigation', price: 5, description: 'Per day' },
                { name: 'Child Seat', price: 8, description: 'Per rental' },
                { name: 'WiFi Hotspot', price: 7, description: 'Per day' },
                { name: 'Extra Driver', price: 10, description: 'Per day' },
                { name: 'Cooler Box', price: 5, description: 'Per rental' },
                { name: 'Airport Meet & Greet', price: 15, description: 'One time' },
            ]}
        />
    );
};

export default SedanVehicles;
