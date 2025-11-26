/**
 * Seed Luxury Experiences
 * This script seeds sample luxury experiences to Firebase Firestore
 * Run with: npx tsx scripts/seed-luxury-experiences.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import type { LuxuryExperience } from '../src/types/luxury-experience';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxFnQfMo3rOWhgm1_yiRIh0Oez246U2N0",
    authDomain: "recharge-travels-73e76.firebaseapp.com",
    projectId: "recharge-travels-73e76",
    storageBucket: "recharge-travels-73e76.firebasestorage.app",
    messagingSenderId: "515581447537",
    appId: "1:515581447537:web:b4f65bf9c2544c65d6fad0",
    measurementId: "G-W2MJBDFDG3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleExperiences: Omit<LuxuryExperience, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>[] = [
    {
        title: 'Private Yala Safari Experience',
        subtitle: 'Exclusive Wildlife Encounters in Sri Lanka\'s Premier National Park',
        category: 'luxury-safari',
        slug: 'private-yala-safari-experience',
        heroImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&h=1080&fit=crop',
        gallery: [
            {
                url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&h=1080&fit=crop',
                alt: 'Leopard in Yala National Park',
                caption: 'Spot the elusive Sri Lankan leopard',
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1564760290292-23341e4df6ec?w=1920&h=1080&fit=crop',
                alt: 'Elephants in the wild',
                caption: 'Observe majestic elephants in their natural habitat',
                order: 2
            }
        ],
        shortDescription: 'Experience the thrill of a private safari in Yala National Park, home to the highest density of leopards in the world.',
        fullDescription: 'Embark on an unforgettable journey through Yala National Park, Sri Lanka\'s most visited and second-largest national park. Our private luxury safari offers you an exclusive opportunity to witness leopards, elephants, sloth bears, and over 200 species of birds in their natural habitat. With an expert naturalist guide and premium 4x4 vehicle, enjoy unparalleled wildlife viewing in comfort and style.',
        highlights: [
            'Highest leopard density in the world',
            'Private luxury 4x4 safari vehicle',
            'Expert naturalist guide',
            'Gourmet bush breakfast or lunch',
            'Premium wildlife photography opportunities',
            'Flexible timing for best wildlife viewing'
        ],
        inclusions: [
            {
                icon: 'Car',
                title: 'Private 4x4 Safari Vehicle',
                description: 'Luxury air-conditioned vehicle with panoramic windows'
            },
            {
                icon: 'User',
                title: 'Expert Naturalist Guide',
                description: 'Experienced wildlife expert with local knowledge'
            },
            {
                icon: 'Coffee',
                title: 'Gourmet Meals',
                description: 'Bush breakfast or lunch prepared by private chef'
            },
            {
                icon: 'Camera',
                title: 'Photography Support',
                description: 'Tips and guidance for perfect wildlife shots'
            }
        ],
        exclusions: [
            'Park entrance fees (approximately $15 per person)',
            'Alcoholic beverages',
            'Personal expenses and tips'
        ],
        duration: '6-8 hours',
        groupSize: 'Up to 6 people',
        price: {
            amount: 450,
            currency: 'USD',
            per: 'vehicle',
            seasonal: [
                {
                    season: 'Peak Season',
                    startDate: 'December',
                    endDate: 'March',
                    amount: 500,
                    description: 'Best wildlife viewing season'
                },
                {
                    season: 'Off-Peak Season',
                    startDate: 'May',
                    endDate: 'September',
                    amount: 400,
                    description: 'Park may be closed September'
                }
            ]
        },
        availability: {
            type: 'daily',
            seasonalAvailability: [
                {
                    season: 'Main Season',
                    available: true
                },
                {
                    season: 'Monsoon (September)',
                    available: false
                }
            ],
            minimumNotice: 24
        },
        locations: [
            {
                name: 'Yala National Park',
                coordinates: {
                    lat: 6.3726,
                    lng: 81.5094
                },
                description: 'Sri Lanka\'s most famous wildlife sanctuary'
            }
        ],
        startingPoint: 'Tissamaharama or Kataragama hotels',
        difficulty: 'easy',
        ageRestrictions: 'Suitable for all ages',
        requirements: [
            'Comfortable clothing in neutral colors',
            'Sunscreen and hat',
            'Camera with telephoto lens (optional)',
            'Binoculars (optional, can be provided)'
        ],
        cancellationPolicy: 'Free cancellation up to 48 hours before the experience. 50% refund for cancellations 24-48 hours prior.',
        seo: {
            metaTitle: 'Private Yala Safari - Luxury Wildlife Experience | Recharge Travels',
            metaDescription: 'Experience the thrill of a private safari in Yala National Park with expert guides. Spot leopards, elephants, and exotic birds in Sri Lanka\'s premier wildlife destination.',
            keywords: ['yala safari', 'sri lanka leopard safari', 'private safari yala', 'wildlife tour sri lanka', 'luxury safari']
        },
        status: 'published',
        featured: true,
        popular: true, new: false
    },
    {
        title: 'Photography Tour: Ancient Cities',
        subtitle: 'Capture the Timeless Beauty of Sri Lanka\'s Cultural Triangle',
        category: 'photography-tours',
        slug: 'photography-tour-ancient-cities',
        heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1920&h=1080&fit=crop',
        gallery: [
            {
                url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1920&h=1080&fit=crop',
                alt: 'Sigiriya Rock Fortress',
                caption: 'Golden hour at Sigiriya',
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop',
                alt: 'Ancient Buddha statue',
                caption: 'Timeless Buddhist architecture',
                order: 2
            }
        ],
        shortDescription: 'Join a professional photographer on a 3-day journey through Sri Lanka\'s ancient cities, capturing UNESCO World Heritage sites at their most photogenic moments.',
        fullDescription: 'This exclusive photography tour takes you through the Cultural Triangle, visiting Sigiriya, Polonnaruwa, Dambulla, and Anuradhapura. Work alongside a professional photographer who will guide you in capturing stunning images during golden hours, teach advanced techniques, and help you develop your unique photographic vision. Perfect for both enthusiast and professional photographers.',
        highlights: [
            'Professional photographer guide',
            'Access to exclusive viewpoints',
            'Golden hour and blue hour shoots',
            'Advanced photography workshops',
            'UNESCO World Heritage sites',
            'Post-processing sessions'
        ],
        inclusions: [
            {
                icon: 'Camera',
                title: 'Professional Photography Guide',
                description: 'Award-winning photographer with local expertise'
            },
            {
                icon: 'Home',
                title: 'Luxury Accommodation',
                description: '2 nights in 4-star heritage hotels'
            },
            {
                icon: 'Car',
                title: 'Private Transportation',
                description: 'Air-conditioned vehicle with driver'
            },
            {
                icon: 'Book',
                title: 'Photography Workshop',
                description: 'Daily workshops and editing sessions'
            }
        ],
        exclusions: [
            'Camera equipment (rental available)',
            'Site entrance fees',
            'Meals not specified',
            'Travel insurance'
        ],
        itinerary: [
            {
                day: 1,
                title: 'Sigiriya & Dambulla',
                description: 'Start your journey with the iconic Sigiriya Rock Fortress and Dambulla Cave Temple',
                activities: [
                    {
                        time: '06:00',
                        title: 'Sunrise at Pidurangala Rock',
                        description: 'Capture Sigiriya from the best vantage point',
                        duration: '3 hours'
                    },
                    {
                        time: '16:00',
                        title: 'Dambulla Cave  Temple',
                        description: 'Photograph ancient murals and Buddha statues',
                        duration: '2 hours'
                    },
                    {
                        time: '18:30',
                        title: 'Golden Hour at Sigiriya',
                        description: 'Capture the fortress in golden light',
                        duration: '1.5 hours'
                    }
                ],
                meals: ['Breakfast', 'Lunch', 'Dinner'],
                accommodation: 'Jetwing Vil Uyana or similar',
                highlights: ['Sunrise shoot', 'Ancient cave temple', 'Golden hour photography']
            },
            {
                day: 2,
                title: 'Polonnaruwa Ancient City',
                description: 'Explore and photograph the medieval capital of Sri Lanka',
                activities: [
                    {
                        time: '07:00',
                        title: 'Polonnaruwa Ruins',
                        description: 'Photograph ancient palaces and temples',
                        duration: '4 hours'
                    },
                    {
                        time: '14:00',
                        title: 'Photography Workshop',
                        description: 'Review morning shots and editing techniques',
                        duration: '2 hours'
                    },
                    {
                        time: '17:00',
                        title: 'Sunset at Parakrama Samudra',
                        description: 'Capture reflections in the ancient reservoir',
                        duration: '2 hours'
                    }
                ],
                meals: ['Breakfast', 'Lunch', 'Dinner'],
                accommodation: 'Jetwing Vil Uyana or similar',
                highlights: ['Ancient city photography', 'Editing workshop', 'Sunset reflections']
            },
            {
                day: 3,
                title: 'Anuradhapura & Return',
                description: 'Visit the first capital and sacred Buddhist sites',
                activities: [
                    {
                        time: '06:00',
                        title: 'Anuradhapura Sacred City',
                        description: 'Photograph stupas and sacred Bo tree',
                        duration: '4 hours'
                    },
                    {
                        time: '11:00',
                        title: 'Final Review Session',
                        description: 'Portfolio review and post-processing tips',
                        duration: '2 hours'
                    }
                ],
                meals: ['Breakfast', 'Lunch'],
                highlights: ['Sacred city photography', 'Portfolio review']
            }
        ],
        duration: '3 days / 2 nights',
        groupSize: '2-6 people',
        price: {
            amount: 1200,
            currency: 'USD',
            per: 'person',
            seasonal: []
        },
        availability: {
            type: 'weekly',
            minimumNotice: 168
        },
        locations: [
            {
                name: 'Sigiriya',
                coordinates: {
                    lat: 7.9570,
                    lng: 80.7603
                },
                description: 'Ancient rock fortress'
            },
            {
                name: 'Polonnaruwa',
                coordinates: {
                    lat: 7.9403,
                    lng: 81.0188
                },
                description: 'Medieval capital'
            },
            {
                name: 'Anuradhapura',
                coordinates: {
                    lat: 8.3114,
                    lng: 80.4037
                },
                description: 'First capital and sacred city'
            }
        ],
        startingPoint: 'Colombo or Negombo hotels',
        difficulty: 'moderate',
        ageRestrictions: '16 years and above',
        requirements: [
            'DSLR or mirrorless camera',
            'Wide-angle and telephoto lenses',
            'Tripod recommended',
            'Laptop for editing sessions',
            'Comfortable walking shoes'
        ],
        cancellationPolicy: 'Free cancellation up to 7 days before departure. 50% refund for 3-7 days prior. No refund within 3 days.',
        seo: {
            metaTitle: 'Sri Lanka Photography Tour - Cultural Triangle | Recharge Travels',
            metaDescription: 'Join professional photographers to capture UNESCO World Heritage sites including Sigiriya, Polonnaruwa, and Anuradhapura. 3-day luxury photography workshop.',
            keywords: ['sri lanka photography tour', 'cultural triangle photography', 'sigiriya photography', 'professional photo tour', 'unesco heritage photography']
        },
        status: 'published',
        featured: true,
        popular: false,
        new: true
    },
    {
        title: 'Ayurvedic Wellness Retreat',
        subtitle: 'Rejuvenate Mind, Body & Soul in Paradise',
        category: 'wellness-retreats',
        slug: 'ayurvedic-wellness-retreat',
        heroImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&h=1080&fit=crop',
        gallery: [
            {
                url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&h=1080&fit=crop',
                alt: 'Ayurvedic spa treatment',
                caption: 'Traditional Ayurvedic therapies',
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&h=1080&fit=crop',
                alt: 'Yoga by the beach',
                caption: 'Morning yoga sessions',
                order: 2
            }
        ],
        shortDescription: 'Immerse yourself in authentic Ayurvedic healing at a luxury beachfront resort, with personalized treatments, yoga, and organic cuisine.',
        fullDescription: 'Experience the ancient science of Ayurveda at one of Sri Lanka\'s premier wellness resorts. Our 7-day retreat combines authentic Ayurvedic treatments, daily yoga and meditation, nutritious organic meals, and the healing power of the tropical environment. Each guest receives a personalized wellness plan based on their dosha (body constitution) after consultation with our Ayurvedic physician.',
        highlights: [
            'Personalized Ayurvedic consultation',
            'Daily therapeutic treatments',
            'Twice-daily yoga and meditation',
            'Organic sattvic cuisine',
            'Beachfront luxury accommodation',
            'Wellness workshops and talks'
        ],
        inclusions: [
            {
                icon: 'Heart',
                title: 'Ayurvedic Treatments',
                description: 'Daily personalized therapies and massages'
            },
            {
                icon: 'User',
                title: 'Wellness Team',
                description: 'Ayurvedic doctor, yoga instructor, and therapist'
            },
            {
                icon: 'Home',
                title: 'Luxury Accommodation',
                description: 'Ocean-view suite with private balcony'
            },
            {
                icon: 'Coffee',
                title: 'Organic Meals',
                description: 'Three sattvic meals daily tailored to your dosha'
            }
        ],
        exclusions: [
            'International flights',
            'Airport transfers',
            'Additional spa treatments',
            'Personal expenses'
        ],
        duration: '7 days / 6 nights',
        groupSize: 'Individual or couples',
        price: {
            amount: 2800,
            currency: 'USD',
            per: 'person',
            seasonal: [
                {
                    season: 'Peak Season',
                    startDate: 'November',
                    endDate: 'April',
                    amount: 3200,
                    description: 'Best beach weather'
                }
            ]
        },
        availability: {
            type: 'daily',
            minimumNotice: 336
        },
        locations: [
            {
                name: 'Bentota',
                coordinates: {
                    lat: 6.4258,
                    lng: 79.9608
                },
                description: 'Pristine beach destination on the southwest coast'
            }
        ],
        startingPoint: 'Luxury resort in Bentota',
        difficulty: 'easy',
        ageRestrictions: 'Adults only (18+)',
        requirements: [
            'Comfortable clothing for yoga',
            'Willingness to follow Ayurvedic dietary guidelines',
            'Open mind to holistic healing',
            'Health questionnaire to be completed before arrival'
        ],
        cancellationPolicy: 'Free cancellation up to 14 days before check-in. 50% refund for 7-14 days prior. No refund within 7 days.',
        testimonials: [
            {
                id: '1',
                author: 'Sarah Mitchell',
                country: 'United Kingdom',
                rating: 5,
                comment: 'This retreat was truly life-changing. The Ayurvedic treatments were authentic and effective, and I left feeling completely rejuvenated.',
                experienceDate: '2024-02-15',
                avatar: 'https://i.pravatar.cc/150?img=1'
            }
        ],
        seo: {
            metaTitle: 'Ayurvedic Wellness Retreat Sri Lanka - 7 Days | Recharge Travels',
            metaDescription: 'Experience authentic Ayurvedic healing at a luxury beachfront resort. Personalized treatments, yoga, meditation, and organic cuisine for complete rejuvenation.',
            keywords: ['ayurvedic retreat sri lanka', 'wellness retreat', 'ayurveda spa sri lanka', 'yoga retreat', 'holistic healing']
        },
        status: 'published',
        featured: true,
        popular: true,
        new: false
    },
    {
        title: 'Culinary Journey: Flavors of Ceylon',
        subtitle: 'Discover Sri Lankan Cuisine Through Market Tours and Cooking Classes',
        category: 'culinary-journeys',
        slug: 'culinary-journey-flavors-of-ceylon',
        heroImage: 'https://images.unsplash.com/photo-1596040033229-a0b7e2a97449?w=1920&h=1080&fit=crop',
        gallery: [
            {
                url: 'https://images.unsplash.com/photo-1596040033229-a0b7e2a97449?w=1920&h=1080&fit=crop',
                alt: 'Sri Lankan curry spread',
                caption: 'Traditional rice and curry',
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=1920&h=1080&fit=crop',
                alt: 'Cooking class',
                caption: 'Hands-on cooking experience',
                order: 2
            }
        ],
        shortDescription: 'Embark on a gastronomic adventure exploring Sri Lankan cuisine through market visits, cooking classes, and dining experiences.',
        fullDescription: 'Dive deep into the rich culinary heritage of Sri Lanka with our immersive food tour. Visit bustling local markets, learn to cook authentic dishes from expert chefs, explore spice gardens, and enjoy exclusive dining experiences. This journey takes you from street food to fine dining, uncovering the secrets of Ceylon spices and traditional cooking methods.',
        highlights: [
            'Hands-on cooking classes with local chefs',
            'Guided tours of local markets and spice gardens',
            'Street food tasting tours',
            'Traditional village feast',
            'Fine dining at award-winning restaurants',
            'Recipe booklet to take home'
        ],
        inclusions: [
            {
                icon: 'ChefHat',
                title: 'Cooking Classes',
                description: 'Learn 10+ traditional Sri Lankan dishes'
            },
            {
                icon: 'ShoppingCart',
                title: 'Market Tours',
                description: 'Guided visits to local markets and spice gardens'
            },
            {
                icon: 'Utensils',
                title: 'Dining Experiences',
                description: 'All meals including fine dining experiences'
            },
            {
                icon: 'Book',
                title: 'Recipe Collection',
                description: 'Beautifully designed recipe booklet'
            }
        ],
        exclusions: [
            'Accommodation (can be arranged)',
            'Alcoholic beverages',
            'Transportation between activities',
            'Personal expenses'
        ],
        duration: '5 days',
        groupSize: '4-8 people',
        price: {
            amount: 850,
            currency: 'USD',
            per: 'person',
            seasonal: []
        },
        availability: {
            type: 'weekly',
            minimumNotice: 120
        },
        locations: [
            {
                name: 'Colombo',
                coordinates: {
                    lat: 6.9271,
                    lng: 79.8612
                },
                description: 'Capital city with diverse culinary scene'
            },
            {
                name: 'Galle',
                coordinates: {
                    lat: 6.0535,
                    lng: 80.2210
                },
                description: 'Historic fort city with unique coastal cuisine'
            },
            {
                name: 'Matale',
                coordinates: {
                    lat: 7.4675,
                    lng: 80.6234
                },
                description: 'Spice garden capital'
            }
        ],
        startingPoint: 'Colombo hotels',
        difficulty: 'easy',
        ageRestrictions: 'Suitable for all ages',
        requirements: [
            'Enthusiasm for cooking and food',
            'Comfortable walking shoes for market tours',
            'Appetite for adventure',
            'Dietary restrictions should be communicated in advance'
        ],
        cancellationPolicy: 'Free cancellation up to 7 days before the experience. 50% refund for 3-7 days prior.',
        seo: {
            metaTitle: 'Sri Lankan Cooking Classes & Food Tours | Recharge Travels',
            metaDescription: 'Explore Sri Lankan cuisine through hands-on cooking classes, market tours, and unique dining experiences. 5-day culinary journey through Ceylon.',
            keywords: ['sri lankan cooking class', 'food tour sri lanka', 'culinary tour', 'spice garden tour', 'sri lankan cuisine']
        },
        status: 'published',
        featured: false,
        popular: true,
        new: true
    },
    {
        title: 'Romantic Sunset Cruise',
        subtitle: 'Private Yacht Experience Along the Southwestern Coast',
        category: 'romantic-escapes',
        slug: 'romantic-sunset-cruise',
        heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop',
        gallery: [
            {
                url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop',
                alt: 'Luxury yacht at sunset',
                caption: 'Sail into the sunset',
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1540206395-68808572332f?w=1920&h=1080&fit=crop',
                alt: 'Champagne on yacht',
                caption: 'Toast to romance',
                order: 2
            }
        ],
        shortDescription: 'Sail along Sri Lanka\'s stunning coastline on a private yacht, with champagne, gourmet canapés, and breathtaking sunset views.',
        fullDescription: 'Create unforgettable memories with your loved one on this exclusive sunset cruise. Board a luxury yacht and sail along the pristine southwestern coastline, passing golden beaches, coconut groves, and historic landmarks. Enjoy champagne, gourmet canapés, and personalized service as you watch the sun dip below the Indian Ocean horizon.',
        highlights: [
            'Private luxury yacht charter',
            'Expert captain and crew',
            'Champagne and premium beverages',
            'Gourmet canapés and fresh fruits',
            'Stunning sunset views',
            'Swimming and snorkeling opportunity'
        ],
        inclusions: [
            {
                icon: 'Anchor',
                title: 'Private Yacht',
                description: 'Luxury yacht for up to 10 guests'
            },
            {
                icon: 'Users',
                title: 'Professional Crew',
                description: 'Experienced captain and dedicated crew'
            },
            {
                icon: 'Wine',
                title: 'Premium Beverages',
                description: 'Champagne, wine, cocktails, and soft drinks'
            },
            {
                icon: 'Utensils',
                title: 'Gourmet Canapés',
                description: 'Selection of savory and sweet treats'
            }
        ],
        exclusions: [
            'Hotel transfers (can be arranged)',
            'Additional beverages beyond included',
            'Gratuities for crew'
        ],
        duration: '3 hours',
        groupSize: 'Up to 10 people',
        price: {
            amount: 800,
            currency: 'USD',
            per: 'yacht',
            seasonal: []
        },
        availability: {
            type: 'daily',
            blackoutDates: [],
            minimumNotice: 48
        },
        locations: [
            {
                name: 'Bentota',
                coordinates: {
                    lat: 6.4258,
                    lng: 79.9608
                },
                description: 'Departure point from Bentota Marina'
            }
        ],
        startingPoint: 'Bentota Marina',
        difficulty: 'easy',
        ageRestrictions: 'All ages welcome',
        requirements: [
            'Comfortable casual attire',
            'Sunscreen and sunglasses',
            'Camera for capturing memories',
            'Light jacket for evening breeze'
        ],
        cancellationPolicy: 'Free cancellation up to 48 hours before departure. No refund for cancellations within 48 hours.',
        seo: {
            metaTitle: 'Private Sunset Yacht Cruise Sri Lanka - Romantic Experience',
            metaDescription: 'Sail along Sri Lanka\'s coastline on a private luxury yacht. Perfect romantic experience with champagne, sunset views, and gourmet canapés.',
            keywords: ['sunset cruise sri lanka', 'private yacht charter', 'romantic cruise', 'luxury yacht sri lanka', 'bentota yacht cruise']
        },
        status: 'published',
        featured: false,
        popular: false,
        new: true
    },
    {
        title: 'Family Safari Adventure',
        subtitle: 'Kid-Friendly Wildlife Experience in Udawalawe',
        category: 'family-adventures',
        slug: 'family-safari-adventure-udawalawe',
        heroImage: 'https://images.unsplash.com/photo-1551927336-b7926801d2a5?w=1920&h=1080&fit=crop',
        gallery: [
            {
                url: 'https://images.unsplash.com/photo-1551927336-b7926801d2a5?w=1920&h=1080&fit=crop',
                alt: 'Elephant herd in Udawalawe',
                caption: 'Family of elephants',
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&h=1080&fit=crop',
                alt: 'Family on safari',
                caption: 'Creating family memories',
                order: 2
            }
        ],
        shortDescription: 'A perfect family-friendly safari experience with visits to the elephant orphanage, wildlife park, and educational nature activities.',
        fullDescription: 'Designed specifically for families with children, this safari adventure combines wildlife viewing, education, and fun. Visit Udawalawe National Park, famous for its large elephant population, followed by the Elephant Transit Home where orphaned elephants are rehabilitated. Includes child-friendly accommodation, flexible timing, and engaging activities that teach children about conservation.',
        highlights: [
            'Guaranteed elephant sightings',
            'Visit to Elephant Transit Home',
            'Child-friendly safari guide',
            'Junior ranger activity booklet',
            'Nature scavenger hunt',
            'Family-friendly accommodation'
        ],
        inclusions: [
            {
                icon: 'Users',
                title: 'Family-Friendly Guide',
                description: 'Experienced guide trained in working with children'
            },
            {
                icon: 'Car',
                title: 'Comfortable Vehicle',
                description: 'Spacious 4x4 with safety seats available'
            },
            {
                icon: 'Book',
                title: 'Junior Ranger Kit',
                description: 'Activity booklet and binoculars for kids'
            },
            {
                icon: 'Home',
                title: 'Family Accommodation',
                description: 'Interconnecting rooms at wildlife lodge'
            }
        ],
        exclusions: [
            'Park entrance fees',
            'Meals not specified',
            'Additional activities',
            'Travel insurance'
        ],
        duration: '2 days / 1 night',
        groupSize: 'Families of 2-8 people',
        price: {
            amount: 600,
            currency: 'USD',
            per: 'family',
            seasonal: []
        },
        availability: {
            type: 'daily',
            minimumNotice: 72
        },
        locations: [
            {
                name: 'Udawalawe National Park',
                coordinates: {
                    lat: 6.4500,
                    lng: 80.8833
                },
                description: 'Home to over 500 elephants'
            }
        ],
        startingPoint: 'Embilipitiya area hotels',
        difficulty: 'easy',
        ageRestrictions: 'Suitable for all ages, ideal for families with children',
        requirements: [
            'Comfortable casual clothing',
            'Sunscreen and  hats',
            'Snacks for children',
            'Camera'
        ],
        cancellationPolicy: 'Free cancellation up to 72 hours before departure. 50% refund within 48-72 hours.',
        seo: {
            metaTitle: 'Family Safari Sri Lanka - Kid-Friendly Wildlife Tour',
            metaDescription: 'Perfect family safari in Udawalawe with guaranteed elephant sightings, elephant orphanage visit, and child-friendly activities.',
            keywords: ['family safari sri lanka', 'kid friendly safari', 'udawalawe elephants', 'family wildlife tour', 'children safari']
        },
        status: 'published',
        featured: false,
        popular: true,
        new: false
    }
];

async function seedExperiences() {
    console.log('🌱 Starting to seed luxury experiences...\n');

    try {
        const experiencesRef = collection(db, 'luxuryExperiences');

        for (const experience of sampleExperiences) {
            const timestamp = Timestamp.now();
            const experienceData = {
                ...experience,
                createdAt: timestamp,
                updatedAt: timestamp,
                publishedAt: experience.status === 'published' ? timestamp : null
            };

            const docRef = await addDoc(experiencesRef, experienceData);
            console.log(`✅ Created experience: ${experience.title} (ID: ${docRef.id})`);
        }

        console.log(`\n🎉 Successfully seeded ${sampleExperiences.length} luxury experiences!`);
        console.log('\n📊 Summary:');
        console.log(`   - Featured: ${sampleExperiences.filter(e => e.featured).length}`);
        console.log(`   - Popular: ${sampleExperiences.filter(e => e.popular).length}`);
        console.log(`   - New: ${sampleExperiences.filter(e => e.new).length}`);
        console.log(`   - Published: ${sampleExperiences.filter(e => e.status === 'published').length}`);

    } catch (error) {
        console.error('❌ Error seeding experiences:', error);
        throw error;
    }
}

// Run the seeder
seedExperiences()
    .then(() => {
        console.log('\n✨ Seeding completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Seeding failed:', error);
        process.exit(1);
    });
