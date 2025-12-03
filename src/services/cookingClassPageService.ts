import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'cookingClassBookingContent';
const DOC_ID = 'cooking-class-sri-lanka';

// Interfaces matching the Hikkaduwa Water Sports style
export interface CookingHeroSlide {
  image: string;
  caption: string;
  tag?: string;
}

export interface CookingBadge {
  label: string;
  value: string;
  iconName: string;
}

export interface CookingHighlight {
  label: string;
  description: string;
}

export interface CookingExperience {
  id: string;
  name: string;
  city: string;
  summary: string;
  duration: string;
  priceLabel: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  includes: string[];
  image?: string;
  iconName: string;
  rating: number;
  reviews: number;
}

export interface CookingComboPackage {
  id: string;
  name: string;
  badge: string;
  duration: string;
  priceLabel: string;
  highlights: string[];
  includes: string[];
  iconName: string;
}

export interface CookingLogistics {
  meetingPoint: string;
  sessionTimes: string[];
  baseLocation: string;
  transferNote: string;
  gearProvided: string[];
  bringList: string[];
  dietaryNote: string;
  safetyNote: string;
}

export interface CookingFaq {
  id: string;
  question: string;
  answer: string;
}

export interface CookingGalleryImage {
  id: string;
  image: string;
  caption: string;
}

export interface CookingBookingInfo {
  contactPhone: string;
  whatsapp: string;
  email: string;
  responseTime: string;
  conciergeNote: string;
}

export interface CookingPricing {
  currency: string;
  startingPrice: number;
  depositNote: string;
  refundPolicy: string;
  extrasNote: string;
}

export interface CookingClassBookingContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    gallery: CookingHeroSlide[];
  };
  overview: {
    summary: string;
    badges: CookingBadge[];
    highlights: CookingHighlight[];
  };
  experiences: CookingExperience[];
  combos: CookingComboPackage[];
  logistics: CookingLogistics;
  chefCredentials: string[];
  faqs: CookingFaq[];
  gallery: CookingGalleryImage[];
  booking: CookingBookingInfo;
  pricing: CookingPricing;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

export const defaultCookingClassContent: CookingClassBookingContent = {
  hero: {
    title: 'Sri Lankan Cooking Classes',
    subtitle: 'Master the art of Ceylon cuisine with local chefs. From spice markets to clay pot cooking, discover authentic flavors across the island.',
    badge: 'Culinary Experiences',
    gallery: [
      {
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=2000&q=80',
        caption: 'Fresh Spice Preparation',
        tag: 'Hands-On'
      },
      {
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=2000&q=80',
        caption: 'Traditional Clay Pot Cooking',
        tag: 'Authentic'
      },
      {
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=2000&q=80',
        caption: 'Jaffna Crab Curry',
        tag: 'Regional'
      },
      {
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2000&q=80',
        caption: 'Coastal Seafood Feast',
        tag: 'Fresh Catch'
      }
    ]
  },
  overview: {
    summary:
      "Our cooking experiences go beyond recipes—you'll visit local markets, pick fresh ingredients, grind spices by hand, and cook alongside home chefs who've mastered these dishes over generations. Take home skills you'll treasure forever.",
    badges: [
      { label: 'Locations', value: '7+', iconName: 'MapPin' },
      { label: 'Dishes', value: '30+', iconName: 'UtensilsCrossed' },
      { label: 'Guest Rating', value: '4.9/5', iconName: 'Star' },
      { label: 'Group Size', value: '2-8', iconName: 'Users' }
    ],
    highlights: [
      {
        label: 'Market-to-table experience',
        description: 'Visit bustling local markets, select fresh seafood and spices, then cook your finds in traditional kitchens.'
      },
      {
        label: 'Regional specialties',
        description: 'Each city offers unique dishes—Jaffna crab curry, Kandy spice garden flavors, coastal coconut curries.'
      },
      {
        label: 'Take-home recipes',
        description: 'Receive printed recipes and spice packs so you can recreate your favorite dishes at home.'
      }
    ]
  },
  experiences: [
    {
      id: 'colombo-cooking',
      name: 'Urban Flavors & Seafood Market Tour',
      city: 'Colombo',
      summary: 'Dive into the bustling Pettah market, select fresh seafood and spices, then cook a storm in a modern kitchen.',
      duration: '4 Hours',
      priceLabel: 'USD 55 per guest',
      level: 'All Levels',
      includes: ['Pettah Market visit', 'Crab curry masterclass', 'AC kitchen', 'Full lunch', 'Recipe cards'],
      iconName: 'Building',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80',
      rating: 4.8,
      reviews: 124
    },
    {
      id: 'dambulla-cooking',
      name: 'Village Mud House Cooking',
      city: 'Dambulla',
      summary: 'Experience authentic rural life. Cook in a traditional clay house using firewood and clay pots—truly rustic.',
      duration: '3 Hours',
      priceLabel: 'USD 45 per guest',
      level: 'All Levels',
      includes: ['Traditional clay pots', 'Organic garden picking', 'Village walk', 'Full meal', 'Spice pack'],
      iconName: 'Home',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1400&q=80',
      rating: 4.9,
      reviews: 89
    },
    {
      id: 'kandy-cooking',
      name: 'Hill Country Spice Garden Cooking',
      city: 'Kandy',
      summary: 'Surrounded by lush spice gardens, learn the medicinal and culinary uses of fresh spices before grinding them.',
      duration: '3.5 Hours',
      priceLabel: 'USD 50 per guest',
      level: 'All Levels',
      includes: ['Spice garden tour', 'Kandyan chicken curry', 'Mountain views', 'Full lunch', 'Spice collection'],
      iconName: 'TreePine',
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1400&q=80',
      rating: 4.9,
      reviews: 210
    },
    {
      id: 'jaffna-cooking',
      name: 'Northern Crab Curry & Palmyrah Feast',
      city: 'Jaffna',
      summary: 'Discover the distinct flavors of the North. Master the fiery Jaffna Crab Curry and work with Palmyrah flour.',
      duration: '4 Hours',
      priceLabel: 'USD 60 per guest',
      level: 'Intermediate',
      includes: ['Jaffna crab curry', 'Palmyrah tasting', 'Tamil cuisine intro', 'Full feast', 'Recipe booklet'],
      iconName: 'Flame',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1400&q=80',
      rating: 5.0,
      reviews: 45
    },
    {
      id: 'bentota-cooking',
      name: 'Coastal Seafood & Coconut Curry',
      city: 'Bentota',
      summary: 'Fresh from ocean to pot. Learn to clean and cook fish, prawns, and calamari with freshly scraped coconut milk.',
      duration: '4 Hours',
      priceLabel: 'USD 65 per guest',
      level: 'All Levels',
      includes: ['Fresh catch selection', 'Coconut scraping', 'Beachside dining', 'Full seafood meal', 'Recipes'],
      iconName: 'Fish',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80',
      rating: 4.9,
      reviews: 112
    },
    {
      id: 'nuwara-eliya-cooking',
      name: 'Tea Country Garden Fresh Cooking',
      city: 'Nuwara Eliya',
      summary: 'Cook with cool-climate vegetables freshly picked from the garden. Enjoy a cozy meal with premium Ceylon tea.',
      duration: '3 Hours',
      priceLabel: 'USD 55 per guest',
      level: 'Beginner',
      includes: ['Farm fresh veggies', 'High tea experience', 'Colonial bungalow', 'Full meal', 'Tea samples'],
      iconName: 'Coffee',
      image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=1400&q=80',
      rating: 4.7,
      reviews: 76
    }
  ],
  combos: [
    {
      id: 'culinary-trail',
      name: 'Ceylon Culinary Trail',
      badge: 'Best Seller',
      duration: '3 Days / 2 Nights',
      priceLabel: 'USD 280 per guest',
      highlights: ['3 cooking classes in 3 cities', 'Market tours included', 'Private transfers', 'Boutique stays'],
      includes: ['All cooking classes', 'Accommodation', 'Private transport', 'All meals', 'Recipe collection'],
      iconName: 'Sparkles'
    },
    {
      id: 'spice-master',
      name: 'Spice Master Workshop',
      badge: 'Intensive',
      duration: '1 Day',
      priceLabel: 'USD 120 per guest',
      highlights: ['Deep-dive into Sri Lankan spices', 'Roast, grind, blend your own', 'Take home spice kit', 'Certificate'],
      includes: ['Full-day workshop', 'All materials', 'Gourmet lunch', 'Spice kit to take home', 'Certificate'],
      iconName: 'Award'
    },
    {
      id: 'family-feast',
      name: 'Family Feast Experience',
      badge: 'Groups',
      duration: '5 Hours',
      priceLabel: 'USD 200 (up to 6 guests)',
      highlights: ['Private chef for your group', 'Custom menu selection', 'Celebration setup', 'Photo memories'],
      includes: ['Private cooking session', 'All ingredients', 'Full feast', 'Photos', 'Recipe cards'],
      iconName: 'Heart'
    }
  ],
  logistics: {
    meetingPoint: 'Hotel pickup available in all cities (Colombo, Kandy, Dambulla, Jaffna, Bentota, Nuwara Eliya)',
    sessionTimes: ['Morning Session • 9:00 AM', 'Afternoon Session • 2:00 PM', 'Sunset Session • 4:30 PM (selected locations)'],
    baseLocation: 'Traditional homes, boutique kitchens, and heritage bungalows depending on city',
    transferNote: 'Complimentary hotel pickup within city limits. Long-distance transfers available at extra cost.',
    gearProvided: ['Apron', 'All cooking equipment', 'Ingredients', 'Recipe cards', 'Bottled water'],
    bringList: ['Comfortable clothes', 'Closed-toe shoes recommended', 'Camera for memories', 'Appetite!'],
    dietaryNote: 'Vegetarian, vegan, and gluten-free options available. Please inform us of any allergies at booking.',
    safetyNote: 'All kitchens meet hygiene standards. First-aid kits available. Children welcome with adult supervision.'
  },
  chefCredentials: [
    'All chefs are certified food handlers with 5+ years experience',
    'Home cooks trained in traditional family recipes',
    'English-speaking instructors at all locations',
    'Special dietary accommodation expertise',
    'Published cookbook authors at select locations'
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Do I need cooking experience?',
      answer: 'Not at all! Our classes are designed for all skill levels. Our chefs guide you through every step, from grinding spices to plating the final dish.'
    },
    {
      id: 'faq-2',
      question: 'Can you accommodate dietary restrictions?',
      answer: 'Absolutely. We offer vegetarian, vegan, and gluten-free options. Let us know your requirements when booking, and we\'ll customize the menu.'
    },
    {
      id: 'faq-3',
      question: 'What dishes will I learn to cook?',
      answer: 'Each location features regional specialties—Jaffna crab curry, Kandyan chicken curry, coastal seafood dishes, traditional rice & curry spreads, and more.'
    },
    {
      id: 'faq-4',
      question: 'Can I bring children?',
      answer: 'Children are welcome! We have family-friendly sessions where kids can participate in safe activities like mixing and decorating. Under-12s get 50% off.'
    },
    {
      id: 'faq-5',
      question: 'Do I get to eat what I cook?',
      answer: 'Of course! After cooking, you\'ll sit down to enjoy a full meal of everything you\'ve prepared, often with stunning views and great company.'
    }
  ],
  gallery: [
    {
      id: 'gallery-1',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80',
      caption: 'Grinding fresh spices'
    },
    {
      id: 'gallery-2',
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=80',
      caption: 'Clay pot traditions'
    },
    {
      id: 'gallery-3',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80',
      caption: 'Jaffna crab curry'
    },
    {
      id: 'gallery-4',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=80',
      caption: 'Coastal seafood feast'
    }
  ],
  booking: {
    contactPhone: '+94 777 721 999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'concierge@rechargetravels.com',
    responseTime: 'Replies in under 15 minutes between 6 AM – 10 PM GMT+5:30',
    conciergeNote: 'Share your preferred city, date, and any dietary requirements—we\'ll craft the perfect culinary experience for you.'
  },
  pricing: {
    currency: 'USD',
    startingPrice: 45,
    depositNote: '50% deposit secures your spot. Balance due on arrival.',
    refundPolicy: 'Free cancellation up to 48 hours before. 50% refund for 24-48 hour cancellations.',
    extrasNote: 'Private sessions, extended menus, and hotel transfers available as add-ons.'
  },
  seo: {
    title: 'Sri Lankan Cooking Classes | Authentic Culinary Experiences | Recharge Travels',
    description:
      'Join authentic Sri Lankan cooking classes across the island. From Colombo seafood markets to Kandy spice gardens, learn traditional recipes with local chefs.',
    keywords: [
      'Sri Lanka cooking class',
      'Ceylon culinary experience',
      'Sri Lankan food tour',
      'learn Sri Lankan cooking',
      'Jaffna crab curry class',
      'Recharge Travels'
    ],
    ogImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&h=630&q=80'
  }
};

class CookingClassPageService {
  async getPageContent(): Promise<CookingClassBookingContent> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        await setDoc(docRef, defaultCookingClassContent);
        return defaultCookingClassContent;
      }

      const data = snapshot.data() as Partial<CookingClassBookingContent>;

      return {
        ...defaultCookingClassContent,
        ...data,
        hero: {
          ...defaultCookingClassContent.hero,
          ...(data.hero || {}),
          gallery:
            data.hero?.gallery && data.hero.gallery.length > 0
              ? data.hero.gallery
              : defaultCookingClassContent.hero.gallery
        },
        overview: {
          ...defaultCookingClassContent.overview,
          ...(data.overview || {}),
          badges:
            data.overview?.badges && data.overview.badges.length > 0
              ? data.overview.badges
              : defaultCookingClassContent.overview.badges,
          highlights:
            data.overview?.highlights && data.overview.highlights.length > 0
              ? data.overview.highlights
              : defaultCookingClassContent.overview.highlights
        },
        experiences:
          data.experiences && data.experiences.length > 0
            ? data.experiences
            : defaultCookingClassContent.experiences,
        combos:
          data.combos && data.combos.length > 0
            ? data.combos
            : defaultCookingClassContent.combos,
        logistics: { ...defaultCookingClassContent.logistics, ...(data.logistics || {}) },
        chefCredentials:
          data.chefCredentials && data.chefCredentials.length > 0
            ? data.chefCredentials
            : defaultCookingClassContent.chefCredentials,
        faqs:
          data.faqs && data.faqs.length > 0
            ? data.faqs
            : defaultCookingClassContent.faqs,
        gallery:
          data.gallery && data.gallery.length > 0
            ? data.gallery
            : defaultCookingClassContent.gallery,
        booking: { ...defaultCookingClassContent.booking, ...(data.booking || {}) },
        pricing: { ...defaultCookingClassContent.pricing, ...(data.pricing || {}) },
        seo: { ...defaultCookingClassContent.seo, ...(data.seo || {}) }
      };
    } catch (error) {
      console.error('Error fetching cooking class content:', error);
      return defaultCookingClassContent;
    }
  }

  async saveContent(content: Partial<CookingClassBookingContent>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(docRef, content, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving cooking class content:', error);
      return false;
    }
  }

  getDefaultContent(): CookingClassBookingContent {
    return defaultCookingClassContent;
  }
}

export const cookingClassPageService = new CookingClassPageService();
export default cookingClassPageService;







