/**
 * Sample Luxury Experiences Data
 * 
 * This file contains ready-to-use sample data for the luxury experiences.
 * 
 * TO ADD TO FIREBASE MANUALLY:
 * 1. Go to: https://console.firebase.google.com/project/recharge-travels-73e76/firestore
 * 2. Click on "luxuryExperiences" collection (create if doesn't exist)
 * 3. Click "Add document"
 * 4. Set "Auto-ID" for document ID
 * 5. Copy the JSON from one of the experiences below
 * 6. PasteJSON and click "Save"
 * 7. Repeat for each experience
 */

export const sampleExperiences = [
    {
        // 1. PRIVATE YALA SAFARI
        title: "Private Yala Safari Experience",
        subtitle: "Exclusive Wildlife Encounters in Sri Lanka's Premier National Park",
        category: "luxury-safari",
        slug: "private-yala-safari-experience",
        heroImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&h=1080&fit=crop",
        gallery: [
            {
                url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&h=1080&fit=crop",
                alt: "Leopard in Yala National Park",
                caption: "Spot the elusive Sri Lankan leopard",
                order: 1
            }
        ],
        shortDescription: "Experience the thrill of a private safari in Yala National Park, home to the highest density of leopards in the world.",
        fullDescription: "Embark on an unforgettable journey through Yala National Park, Sri Lanka's most visited and second-largest national park. Our private luxury safari offers you an exclusive opportunity to witness leopards, elephants, sloth bears, and over 200 species of birds in their natural habitat.",
        highlights: [
            "Highest leopard density in the world",
            "Private luxury 4x4 safari vehicle",
            "Expert naturalist guide",
            "Gourmet bush breakfast or lunch",
            "Premium wildlife photography opportunities"
        ],
        inclusions: [
            {
                icon: "Car",
                title: "Private 4x4 Safari Vehicle",
                description: "Luxury air-conditioned vehicle with panoramic windows"
            },
            {
                icon: "User",
                title: "Expert Naturalist Guide",
                description: "Experienced wildlife expert with local knowledge"
            }
        ],
        exclusions: [
            "Park entrance fees (approximately $15 per person)",
            "Alcoholic beverages"
        ],
        duration: "6-8 hours",
        groupSize: "Up to 6 people",
        price: {
            amount: 450,
            currency: "USD",
            per: "vehicle"
        },
        availability: {
            type: "daily",
            minimumNotice: 24
        },
        locations: [
            {
                name: "Yala National Park",
                coordinates: { lat: 6.3726, lng: 81.5094 }
            }
        ],
        startingPoint: "Tissamaharama or Kataragama hotels",
        difficulty: "easy",
        cancellationPolicy: "Free cancellation up to 48 hours before the experience.",
        seo: {
            metaTitle: "Private Yala Safari - Luxury Wildlife Experience | Recharge Travels",
            metaDescription: "Experience the thrill of a private safari in Yala National Park with expert guides. Spot leopards, elephants, and exotic birds.",
            keywords: ["yala safari", "sri lanka leopard safari", "private safari yala"]
        },
        status: "published",
        featured: true,
        popular: true,
        new: false
    },

    {
        // 2. PHOTOGRAPHY TOUR
        title: "Photography Tour: Ancient Cities",
        subtitle: "Capture the Timeless Beauty of Sri Lanka's Cultural Triangle",
        category: "photography-tours",
        slug: "photography-tour-ancient-cities",
        heroImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1920&h=1080&fit=crop",
        gallery: [
            {
                url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1920&h=1080&fit=crop",
                alt: "Sigiriya Rock Fortress",
                caption: "Golden hour at Sigiriya",
                order: 1
            }
        ],
        shortDescription: "Join a professional photographer on a 3-day journey through Sri Lanka's ancient cities, capturing UNESCO World Heritage sites.",
        fullDescription: "This exclusive photography tour takes you through the Cultural Triangle, visiting Sigiriya, Polonnaruwa, Dambulla, and Anuradhapura with a professional photographer guide.",
        highlights: [
            "Professional photographer guide",
            "Access to exclusive viewpoints",
            "Golden hour and blue hour shoots",
            "UNESCO World Heritage sites"
        ],
        inclusions: [
            {
                icon: "Camera",
                title: "Professional Photography Guide",
                description: "Award-winning photographer with local expertise"
            },
            {
                icon: "Home",
                title: "Luxury Accommodation",
                description: "2 nights in 4-star heritage hotels"
            }
        ],
        exclusions: [
            "Camera equipment (rental available)",
            "Site entrance fees"
        ],
        duration: "3 days / 2 nights",
        groupSize: "2-6 people",
        price: {
            amount: 1200,
            currency: "USD",
            per: "person"
        },
        availability: {
            type: "weekly",
            minimumNotice: 168
        },
        locations: [
            {
                name: "Sigiriya",
                coordinates: { lat: 7.9570, lng: 80.7603 }
            },
            {
                name: "Polonnaruwa",
                coordinates: { lat: 7.9403, lng: 81.0188 }
            }
        ],
        difficulty: "moderate",
        cancellationPolicy: "Free cancellation up to 7 days before departure.",
        seo: {
            metaTitle: "Sri Lanka Photography Tour - Cultural Triangle | Recharge Travels",
            metaDescription: "Join professional photographers to capture UNESCO World Heritage sites including Sigiriya and Polonnaruwa.",
            keywords: ["sri lanka photography tour", "cultural triangle photography", "sigiriya photography"]
        },
        status: "published",
        featured: true,
        popular: false,
        new: true
    },

    {
        // 3. WELLNESS RETREAT
        title: "Ayurvedic Wellness Retreat",
        subtitle: "Rejuvenate Mind, Body & Soul in Paradise",
        category: "wellness-retreats",
        slug: "ayurvedic-wellness-retreat",
        heroImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&h=1080&fit=crop",
        gallery: [
            {
                url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&h=1080&fit=crop",
                alt: "Ayurvedic spa treatment",
                caption: "Traditional Ayurvedic therapies",
                order: 1
            }
        ],
        shortDescription: "Immerse yourself in authentic Ayurvedic healing at a luxury beachfront resort.",
        fullDescription: "Experience the ancient science of Ayurveda at one of Sri Lanka's premier wellness resorts. Our 7-day retreat combines authentic treatments, yoga, and organic cuisine.",
        highlights: [
            "Personalized Ayurvedic consultation",
            "Daily therapeutic treatments",
            "Twice-daily yoga and meditation",
            "Organic sattvic cuisine",
            "Beachfront luxury accommodation"
        ],
        inclusions: [
            {
                icon: "Heart",
                title: "Ayurvedic Treatments",
                description: "Daily personalized therapies and massages"
            },
            {
                icon: "Home",
                title: "Luxury Accommodation",
                description: "Ocean-view suite with private balcony"
            }
        ],
        exclusions: [
            "International flights",
            "Airport transfers"
        ],
        duration: "7 days / 6 nights",
        groupSize: "Individual or couples",
        price: {
            amount: 2800,
            currency: "USD",
            per: "person"
        },
        availability: {
            type: "daily",
            minimumNotice: 336
        },
        locations: [
            {
                name: "Bentota",
                coordinates: { lat: 6.4258, lng: 79.9608 }
            }
        ],
        difficulty: "easy",
        ageRestrictions: "Adults only (18+)",
        cancellationPolicy: "Free cancellation up to 14 days before check-in.",
        seo: {
            metaTitle: "Ayurvedic Wellness Retreat Sri Lanka - 7 Days | Recharge Travels",
            metaDescription: "Experience authentic Ayurvedic healing at a luxury beachfront resort with yoga, meditation, and organic cuisine.",
            keywords: ["ayurvedic retreat sri lanka", "wellness retreat", "ayurveda spa"]
        },
        status: "published",
        featured: true,
        popular: true,
        new: false
    }
];

// Instructions for adding via Firebase Console:
console.log(`
========================================
FIREBASE CONSOLE SETUP INSTRUCTIONS
========================================

1. Open: https://console.firebase.google.com/project/recharge-travels-73e76/firestore

2. Find or create "luxuryExperiences" collection

3. For each experience below, click "Add document" and:
   - Use Auto-ID
   - Switch to "Code" view (if available) or add fields manually
   - Add current timestamp for 'createdAt' and 'updatedAt'
   - Set 'publishedAt' to current timestamp
   
4. ${sampleExperiences.length} experiences ready to add!

========================================
`);
