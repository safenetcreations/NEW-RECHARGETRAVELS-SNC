/**
 * Seed Script for Group Transport Content
 * Run this script from admin panel to populate initial data
 */

import {
    groupTransportHeroService,
    groupTransportVehiclesService,
    groupTransportFeaturesService,
    groupTransportBenefitsService,
    groupTransportSettingsService
} from '../../src/services/cmsService';

export const seedGroupTransportData = async () => {
    console.log('🌱 Starting Group Transport data seeding...');

    try {
        // Seed Hero Slides
        console.log('📸 Seeding hero slides...');
        const heroSlides = [
            {
                title: "Travel Together, Save Together",
                subtitle: "Premium Group Transportation Solutions",
                description: "Comfortable coaches and vans for families, corporate groups, and large tour parties",
                image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80",
                order: 1,
                isActive: true,
            },
            {
                title: "Corporate & Event Transport",
                subtitle: "Professional Fleet for Business",
                description: "Reliable transportation for conferences, weddings, and special events across Sri Lanka",
                image: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80",
                order: 2,
                isActive: true,
            },
            {
                title: "School & Educational Tours",
                subtitle: "Safe Journey for Students",
                description: "Certified drivers and well-maintained vehicles for educational excursions",
                image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80",
                order: 3,
                isActive: true,
            },
        ];

        for (const slide of heroSlides) {
            await groupTransportHeroService.create(slide);
        }
        console.log('✅ Hero slides seeded successfully');

        // Seed Vehicles
        console.log('🚐 Seeding vehicles...');
        const vehicles = [
            {
                name: "Premium Van",
                capacity: "8-10 Passengers",
                features: ["Air Conditioning", "Comfortable Seats", "Luggage Space", "USB Charging"],
                price: "From $80/day",
                image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80",
                popular: true,
                order: 1,
                isActive: true,
            },
            {
                name: "Mini Coach",
                capacity: "15-20 Passengers",
                features: ["Reclining Seats", "Entertainment System", "Cool Box", "WiFi Available"],
                price: "From $120/day",
                image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80",
                popular: false,
                order: 2,
                isActive: true,
            },
            {
                name: "Luxury Coach",
                capacity: "30-35 Passengers",
                features: ["Premium Seats", "AC", "Toilet", "Entertainment", "Refreshments"],
                price: "From $200/day",
                image: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80",
                popular: false,
                order: 3,
                isActive: true,
            },
            {
                name: "Large Coach",
                capacity: "45-55 Passengers",
                features: ["Spacious Interior", "Luggage Compartment", "PA System", "Safety Features"],
                price: "From $280/day",
                image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80",
                popular: false,
                order: 4,
                isActive: true,
            },
        ];

        for (const vehicle of vehicles) {
            await groupTransportVehiclesService.create(vehicle);
        }
        console.log('✅ Vehicles seeded successfully');

        // Seed Service Features
        console.log('⭐ Seeding service features...');
        const features = [
            {
                title: "Professional Drivers",
                description: "Experienced, licensed drivers with excellent safety records",
                icon: "Users",
                highlight: "English speaking",
                order: 1,
                isActive: true,
            },
            {
                title: "Modern Fleet",
                description: "Well-maintained vehicles with latest comfort features",
                icon: "Bus",
                highlight: "Regular servicing",
                order: 2,
                isActive: true,
            },
            {
                title: "Flexible Booking",
                description: "Easy modifications and cancellations up to 48 hours",
                icon: "Calendar",
                highlight: "No hidden fees",
                order: 3,
                isActive: true,
            },
            {
                title: "All-Inclusive Pricing",
                description: "Fuel, driver allowances, and parking fees included",
                icon: "Shield",
                highlight: "Transparent costs",
                order: 4,
                isActive: true,
            },
            {
                title: "24/7 Support",
                description: "Round-the-clock assistance for your journey",
                icon: "Headphones",
                highlight: "Emergency helpline",
                order: 5,
                isActive: true,
            },
            {
                title: "Route Planning",
                description: "Optimized routes for efficiency and comfort",
                icon: "MapPin",
                highlight: "Local expertise",
                order: 6,
                isActive: true,
            },
        ];

        for (const feature of features) {
            await groupTransportFeaturesService.create(feature);
        }
        console.log('✅ Service features seeded successfully');

        // Seed Benefits
        console.log('💎 Seeding benefits...');
        const benefits = [
            {
                title: "Cost Effective",
                description: "Save up to 60% compared to multiple cars",
                icon: "Heart",
                order: 1,
                isActive: true,
            },
            {
                title: "Eco Friendly",
                description: "Reduce carbon footprint by traveling together",
                icon: "Wind",
                order: 2,
                isActive: true,
            },
            {
                title: "Social Experience",
                description: "Enjoy the journey together with your group",
                icon: "Users",
                order: 3,
                isActive: true,
            },
            {
                title: "Stress Free",
                description: "No driving fatigue or navigation worries",
                icon: "Shield",
                order: 4,
                isActive: true,
            },
        ];

        for (const benefit of benefits) {
            await groupTransportBenefitsService.create(benefit);
        }
        console.log('✅ Benefits seeded successfully');

        // Seed Settings
        console.log('⚙️ Seeding settings...');
        const settings = {
            trustIndicators: {
                rating: "4.8/5",
                reviews: "1,456",
                support: "24/7 Support",
            },
            popularRoutes: ["Corporate Events", "School Tours", "Wedding Transport", "Airport Groups"],
            isActive: true,
        };

        await groupTransportSettingsService.create(settings);
        console.log('✅ Settings seeded successfully');

        console.log('🎉 All Group Transport data seeded successfully!');
        return {
            success: true,
            message: 'Group Transport data seeded successfully',
        };
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};
