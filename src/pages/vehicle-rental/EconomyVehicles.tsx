import React from 'react';
import VehicleCategoryPage from './VehicleCategoryPage';

const EconomyVehicles = () => {
    return (
        <VehicleCategoryPage
            categoryName="Economy"
            categorySlug="economy"
            tagline="Budget-Friendly Travel"
            description="Perfect for solo travelers and couples. Fuel-efficient compact cars ideal for city exploration and short trips. Great value without compromising comfort."
            heroImages={[
                'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=800&h=600&fit=crop',
            ]}
            variants={[
                {
                    name: 'Alto / Wagon R',
                    seats: 4,
                    bagsWithPassengers: 2,
                    maxPassengers: 4,
                    largeBags: 1,
                    smallBags: 2,
                    pricePerDay: 35,
                    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
                },
                {
                    name: 'Toyota Vitz',
                    seats: 5,
                    bagsWithPassengers: 3,
                    maxPassengers: 5,
                    largeBags: 2,
                    smallBags: 2,
                    pricePerDay: 40,
                    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
                },
            ]}
            features={[
                'Air Conditioning',
                'Fuel Efficient',
                'Easy Parking',
                'USB Charging',
                'Bluetooth Audio',
                'Power Steering',
                'Central Locking',
                'Insurance Included',
            ]}
            idealFor={[
                'Solo Travelers',
                'Couples',
                'City Exploration',
                'Budget Travelers',
                'Short Trips',
                'First-Time Visitors',
            ]}
            addOns={[
                { name: 'GPS Navigation', price: 5, description: 'Per day' },
                { name: 'Child Seat', price: 8, description: 'Per rental' },
                { name: 'WiFi Hotspot', price: 7, description: 'Per day' },
                { name: 'Extra Driver', price: 10, description: 'Per day' },
            ]}
        />
    );
};

export default EconomyVehicles;
