import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
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

const luxuryExperiences: Omit<LuxuryExperience, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "Exclusive Yala Safari Experience",
    subtitle: "Private game drives with expert naturalists and gourmet bush dinners",
    category: "luxury-safari",
    slug: "exclusive-yala-safari-experience",
    heroImage: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1920&h=1080&fit=crop",
    heroVideo: "",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1583425423344-40e6a33e1843?w=800&h=600&fit=crop",
        alt: "Leopard in Yala National Park",
        caption: "Spot the elusive Sri Lankan leopard",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop",
        alt: "Luxury safari jeep",
        caption: "Travel in comfort with our premium vehicles",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1548756144-e0908a7a0325?w=800&h=600&fit=crop",
        alt: "Bush dinner setup",
        caption: "Dine under the stars",
        order: 3
      }
    ],
    shortDescription: "Experience the wild like never before with our exclusive Yala safari featuring private game drives, expert guides, and luxury amenities.",
    fullDescription: "Embark on an extraordinary wildlife adventure in Yala National Park, home to the world's highest concentration of leopards. Our exclusive safari experience combines the thrill of wildlife spotting with unparalleled luxury. Travel in custom-designed safari vehicles equipped with comfortable seating, refreshments, and professional photography equipment. Your expert naturalist guide will share fascinating insights about the park's ecosystem while helping you spot leopards, elephants, sloth bears, and over 200 bird species. The day culminates with a magical bush dinner under the stars, featuring gourmet cuisine and fine wines.",
    highlights: [
      "Private safari vehicle with expert naturalist",
      "Professional wildlife photography assistance",
      "Gourmet bush breakfast and dinner",
      "Exclusive access to restricted areas",
      "Luxury tented camp accommodation"
    ],
    inclusions: [
      {
        icon: "🚙",
        title: "Private Safari Vehicle",
        description: "Exclusive use of premium 4x4 vehicle with open roof for optimal viewing"
      },
      {
        icon: "👨‍🏫",
        title: "Expert Naturalist Guide",
        description: "Dedicated wildlife expert with deep knowledge of animal behavior"
      },
      {
        icon: "📸",
        title: "Photography Equipment",
        description: "Professional camera equipment available on request"
      },
      {
        icon: "🍽️",
        title: "Gourmet Meals",
        description: "Bush breakfast, lunch, and romantic dinner under the stars"
      },
      {
        icon: "🏕️",
        title: "Luxury Accommodation",
        description: "Premium tented camp with ensuite facilities"
      },
      {
        icon: "🎁",
        title: "Special Amenities",
        description: "Binoculars, wildlife books, and comfort accessories"
      }
    ],
    exclusions: [
      "International and domestic flights",
      "Travel insurance",
      "Personal expenses and gratuities",
      "Additional beverages not mentioned"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival and Evening Safari",
        description: "Arrive at our luxury camp and settle into your tent before embarking on your first game drive",
        activities: [
          {
            time: "14:00",
            title: "Check-in at Luxury Camp",
            description: "Welcome drinks and orientation",
            duration: "1 hour"
          },
          {
            time: "15:30",
            title: "Evening Game Drive",
            description: "First safari to spot wildlife during golden hour",
            duration: "3 hours"
          },
          {
            time: "19:00",
            title: "Sundowner Experience",
            description: "Enjoy drinks as the sun sets over the park",
            duration: "30 minutes"
          },
          {
            time: "20:00",
            title: "Gourmet Dinner",
            description: "Multi-course dinner at the camp",
            duration: "2 hours"
          }
        ],
        meals: ["Lunch", "Dinner"],
        accommodation: "Luxury Tented Camp"
      },
      {
        day: 2,
        title: "Full Day Safari Adventure",
        description: "Maximize wildlife viewing with morning and evening game drives",
        activities: [
          {
            time: "05:30",
            title: "Early Morning Safari",
            description: "Best time to spot leopards and other predators",
            duration: "4 hours"
          },
          {
            time: "09:30",
            title: "Bush Breakfast",
            description: "Hearty breakfast in the wilderness",
            duration: "1 hour"
          },
          {
            time: "15:00",
            title: "Afternoon Game Drive",
            description: "Explore different zones of the park",
            duration: "3 hours"
          },
          {
            time: "19:00",
            title: "Special Bush Dinner",
            description: "Exclusive dining experience under the stars",
            duration: "2 hours"
          }
        ],
        meals: ["Breakfast", "Lunch", "Dinner"],
        accommodation: "Luxury Tented Camp"
      }
    ],
    duration: "2 Days / 1 Night",
    groupSize: "Max 4 people per vehicle",
    price: {
      amount: 850,
      currency: "USD",
      per: "person",
      seasonal: [
        {
          season: "Peak Season",
          startDate: "2024-12-01",
          endDate: "2025-03-31",
          amount: 950,
          description: "Best weather and wildlife viewing"
        },
        {
          season: "Off Season",
          startDate: "2025-04-01",
          endDate: "2025-11-30",
          amount: 750,
          description: "Fewer crowds, special rates"
        }
      ]
    },
    availability: {
      type: "daily",
      blackoutDates: ["2024-12-25", "2024-12-31", "2025-01-01"],
      minimumNotice: 48
    },
    locations: [
      {
        name: "Yala National Park",
        coordinates: {
          lat: 6.3728,
          lng: 81.5212
        },
        description: "Sri Lanka's most visited national park"
      }
    ],
    startingPoint: "Tissamaharama or Hambantota",
    difficulty: "easy",
    ageRestrictions: "Minimum age 6 years",
    requirements: [
      "Comfortable walking shoes",
      "Neutral colored clothing",
      "Sun protection (hat, sunscreen)",
      "Camera with zoom lens recommended"
    ],
    cancellationPolicy: "Free cancellation up to 7 days before the experience. 50% refund for cancellations 3-7 days prior. No refund within 48 hours.",
    testimonials: [
      {
        id: "test-1",
        author: "Sarah Johnson",
        country: "United Kingdom",
        rating: 5,
        comment: "Absolutely magical experience! We saw three leopards, including a mother with cubs. The bush dinner was unforgettable.",
        experienceDate: "March 2024",
        avatar: ""
      },
      {
        id: "test-2",
        author: "Michael Chen",
        country: "Singapore",
        rating: 5,
        comment: "The attention to detail was incredible. From the comfortable vehicle to the knowledgeable guide, everything exceeded expectations.",
        experienceDate: "February 2024",
        avatar: ""
      }
    ],
    seo: {
      metaTitle: "Exclusive Yala Safari Experience | Luxury Wildlife Tours Sri Lanka",
      metaDescription: "Experience the ultimate luxury safari in Yala National Park. Private game drives, expert guides, and gourmet dining. Book your exclusive wildlife adventure.",
      keywords: ["yala safari", "luxury safari sri lanka", "private game drive", "leopard safari", "wildlife tours"]
    },
    status: "published",
    featured: true,
    popular: true,
    new: false,
    publishedAt: new Date()
  },
  {
    title: "Photography Masterclass Tour",
    subtitle: "Capture Sri Lanka's beauty with award-winning photographers at golden hour",
    category: "photography-tours",
    slug: "photography-masterclass-tour",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    heroVideo: "",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1588607842830-eeac30741e92?w=800&h=600&fit=crop",
        alt: "Sunrise photography at Sigiriya",
        caption: "Capture stunning sunrise shots",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&h=600&fit=crop",
        alt: "Beach photography",
        caption: "Perfect coastal compositions",
        order: 2
      }
    ],
    shortDescription: "Join renowned photographers on an exclusive journey to capture Sri Lanka's most photogenic locations during the perfect light.",
    fullDescription: "This exclusive photography tour is designed for passionate photographers who want to capture Sri Lanka's incredible diversity through their lens. Led by award-winning photographers, you'll visit carefully selected locations at optimal times for the best light and conditions. From misty mountain peaks to golden beaches, ancient temples to vibrant markets, this tour covers it all. You'll receive personalized instruction on composition, lighting, and post-processing while building a stunning portfolio of images.",
    highlights: [
      "Professional photographer guides",
      "Golden hour and blue hour shoots",
      "Exclusive access to restricted locations",
      "Post-processing workshops",
      "Small group of maximum 6 photographers"
    ],
    inclusions: [
      {
        icon: "📸",
        title: "Professional Guidance",
        description: "One-on-one coaching from award-winning photographers"
      },
      {
        icon: "🌅",
        title: "Prime Timing",
        description: "All shoots scheduled for optimal lighting conditions"
      },
      {
        icon: "🚁",
        title: "Aerial Photography",
        description: "Drone photography session included (weather permitting)"
      },
      {
        icon: "💻",
        title: "Editing Workshops",
        description: "Daily post-processing sessions with Adobe Lightroom/Photoshop"
      },
      {
        icon: "🎒",
        title: "Photography Gear",
        description: "Tripods, filters, and accessories provided if needed"
      },
      {
        icon: "🏨",
        title: "Luxury Accommodation",
        description: "Boutique hotels selected for their photogenic settings"
      }
    ],
    exclusions: [
      "Camera equipment (rental available)",
      "Memory cards and storage devices",
      "Travel insurance",
      "Personal expenses"
    ],
    duration: "7 Days / 6 Nights",
    groupSize: "Max 6 photographers",
    price: {
      amount: 2450,
      currency: "USD",
      per: "person"
    },
    availability: {
      type: "weekly",
      minimumNotice: 72
    },
    locations: [
      {
        name: "Sigiriya",
        coordinates: { lat: 7.9571, lng: 80.7603 },
        description: "Ancient rock fortress"
      },
      {
        name: "Ella",
        coordinates: { lat: 6.8667, lng: 81.0467 },
        description: "Misty mountains and tea estates"
      },
      {
        name: "Galle",
        coordinates: { lat: 6.0535, lng: 80.2210 },
        description: "Colonial fort and coastline"
      }
    ],
    difficulty: "moderate",
    requirements: [
      "DSLR or mirrorless camera",
      "Wide-angle and telephoto lenses recommended",
      "Laptop for editing sessions",
      "Good physical fitness for early morning shoots"
    ],
    cancellationPolicy: "Free cancellation up to 14 days before. 50% refund 7-14 days prior. No refund within 7 days.",
    seo: {
      metaTitle: "Photography Masterclass Tour Sri Lanka | Professional Photo Tours",
      metaDescription: "Join award-winning photographers on an exclusive Sri Lanka photography tour. Capture stunning landscapes, wildlife, and culture. Limited to 6 photographers.",
      keywords: ["photography tour sri lanka", "photo workshop", "landscape photography", "professional photo tour"]
    },
    status: "published",
    featured: true,
    popular: false,
    new: true,
    publishedAt: new Date()
  },
  {
    title: "Ayurvedic Wellness Retreat",
    subtitle: "Rejuvenate mind, body, and soul with authentic Ayurvedic treatments in serene mountain settings",
    category: "wellness-retreats",
    slug: "ayurvedic-wellness-retreat",
    heroImage: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1920&h=1080&fit=crop",
    heroVideo: "",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop",
        alt: "Spa treatment",
        caption: "Traditional Ayurvedic treatments",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
        alt: "Yoga session",
        caption: "Daily yoga and meditation",
        order: 2
      }
    ],
    shortDescription: "Experience authentic Ayurvedic healing at a luxury mountain retreat with personalized treatments, yoga, and organic cuisine.",
    fullDescription: "Immerse yourself in the ancient wisdom of Ayurveda at our exclusive wellness retreat nestled in Sri Lanka's misty mountains. This transformative experience begins with a consultation with our Ayurvedic physician who creates a personalized treatment plan based on your dosha (body constitution). Enjoy daily therapeutic massages, herbal treatments, yoga sessions, and meditation classes. Savor specially prepared Ayurvedic meals using organic ingredients from our garden. The retreat combines traditional healing practices with modern luxury amenities for a truly rejuvenating experience.",
    highlights: [
      "Personal Ayurvedic consultation",
      "Daily therapeutic treatments",
      "Yoga and meditation sessions",
      "Organic Ayurvedic cuisine",
      "Herbal medicine garden tour"
    ],
    inclusions: [
      {
        icon: "🌿",
        title: "Ayurvedic Treatments",
        description: "Two therapeutic treatments daily based on your dosha"
      },
      {
        icon: "🧘",
        title: "Yoga & Meditation",
        description: "Morning yoga and evening meditation sessions"
      },
      {
        icon: "🥗",
        title: "Ayurvedic Meals",
        description: "Three organic meals daily prepared according to Ayurvedic principles"
      },
      {
        icon: "👨‍⚕️",
        title: "Medical Consultation",
        description: "Initial and follow-up consultations with Ayurvedic physician"
      },
      {
        icon: "🏞️",
        title: "Nature Activities",
        description: "Guided nature walks and herbal garden tours"
      },
      {
        icon: "🛏️",
        title: "Luxury Accommodation",
        description: "Eco-luxury villa with mountain views"
      }
    ],
    exclusions: [
      "Additional spa treatments",
      "Alcoholic beverages",
      "Laundry service",
      "Gratuities"
    ],
    duration: "7 Days / 6 Nights",
    groupSize: "Individual or couple",
    price: {
      amount: 1890,
      currency: "USD",
      per: "person"
    },
    availability: {
      type: "daily",
      minimumNotice: 72
    },
    locations: [
      {
        name: "Kandy Hills",
        coordinates: { lat: 7.2906, lng: 80.6337 },
        description: "Serene mountain retreat location"
      }
    ],
    difficulty: "easy",
    requirements: [
      "Medical history information",
      "Comfortable yoga clothing",
      "Open mind for holistic healing"
    ],
    cancellationPolicy: "Free cancellation up to 14 days before. 50% refund 7-14 days prior. No refund within 7 days.",
    seo: {
      metaTitle: "Luxury Ayurvedic Wellness Retreat Sri Lanka | Healing & Rejuvenation",
      metaDescription: "Experience authentic Ayurvedic healing at our luxury wellness retreat in Sri Lanka. Personalized treatments, yoga, meditation, and organic cuisine.",
      keywords: ["ayurveda retreat sri lanka", "wellness retreat", "ayurvedic spa", "yoga retreat", "healing vacation"]
    },
    status: "published",
    featured: true,
    popular: true,
    new: false,
    publishedAt: new Date()
  }
];

async function seedLuxuryExperiences() {
  console.log('🌱 Seeding luxury experiences...');
  
  try {
    for (const experience of luxuryExperiences) {
      const docRef = await addDoc(collection(db, 'luxuryExperiences'), {
        ...experience,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ Added experience: ${experience.title} (ID: ${docRef.id})`);
    }
    
    console.log('🎉 Successfully seeded all luxury experiences!');
  } catch (error) {
    console.error('❌ Error seeding experiences:', error);
  }
}

// Run the seeding function
seedLuxuryExperiences();
