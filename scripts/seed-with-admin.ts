/**
 * Seed Luxury Experiences with Firebase Admin SDK
 * This version uses Firebase Admin SDK for proper authentication
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to Firebase Console > Project Settings > Service Accounts
 * 2. Click "Generate new private key"
 * 3. Save the JSON file as: scripts/firebase-admin-key.json
 * 4. Add firebase-admin-key.json to .gitignore
 * 5. Run: npm install firebase-admin
 * 6. Run: npx tsx scripts/seed-with-admin.ts
 */

import * as admin from 'firebase-admin';
import type { LuxuryExperience } from '../src/types/luxury-experience';

// Try to load the service account key
let serviceAccount: any;
try {
    serviceAccount = require('./firebase-admin-key.json');
} catch (error) {
    console.error(`
❌ Service account key file not found!

SETUP INSTRUCTIONS:
═══════════════════════════════════════════════════════

1. Go to Firebase Console:
   https://console.firebase.google.com/project/recharge-travels-73e76/settings/serviceaccounts

2. Click "Generate new private key"

3. Save the downloaded JSON file as:
   scripts/firebase-admin-key.json

4. Add to .gitignore (if not already there):
   echo "scripts/firebase-admin-key.json" >> .gitignore

5. Install firebase-admin:
   npm install firebase-admin

6. Run this script again:
   npx tsx scripts/seed-with-admin.ts

═══════════════════════════════════════════════════════
    `);
    process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

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
        popular: true,
        new: false
    },
    // Add more experiences here from the original seed file...
];

async function seedExperiences() {
    console.log('🌱 Starting to seed luxury experiences with Admin SDK...\n');

    try {
        const batch = db.batch();
        let count = 0;

        for (const experience of sampleExperiences) {
            const docRef = db.collection('luxuryExperiences').doc();
            const experienceData = {
                ...experience,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                publishedAt: experience.status === 'published'
                    ? admin.firestore.FieldValue.serverTimestamp()
                    : null
            };

            batch.set(docRef, experienceData);
            count++;
            console.log(`📝 Prepared: ${experience.title}`);
        }

        await batch.commit();
        console.log(`\n✅ Successfully seeded ${count} luxury experiences!`);

        console.log('\n🎉 Seeding completed!');
        console.log('\n📋 Next Steps:');
        console.log('   1. Visit: https://recharge-travels-73e76.web.app/experiences');
        console.log('   2. Verify experiences are displaying');
        console.log('   3. Use admin panel to add more or edit existing ones');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error seeding experiences:', error);
        process.exit(1);
    }
}

// Run the seeder
seedExperiences();
