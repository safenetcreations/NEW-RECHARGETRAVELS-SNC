import { dbService, storageService } from '@/lib/firebase-services';
import { collection, getDocs, query, where, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { LuxuryExperience, CustomExperienceRequest, ExperienceCategory } from '@/types/luxury-experience';

// Seed experiences data for fallback
const SEED_EXPERIENCES: Omit<LuxuryExperience, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Private Leopard Safari at Yala',
    subtitle: 'Exclusive Wildlife Adventure',
    category: 'luxury-safari',
    slug: 'private-leopard-safari-yala',
    heroImage: 'https://images.unsplash.com/photo-1544985361-b420d7a77043?w=1200',
    gallery: [{ url: 'https://images.unsplash.com/photo-1544985361-b420d7a77043?w=800', alt: 'Leopard in Yala', order: 1 }],
    shortDescription: 'Track Sri Lanka\'s elusive leopards with expert naturalists in a private luxury safari.',
    fullDescription: 'Embark on an exclusive private safari in Yala National Park, home to the world\'s highest density of leopards.',
    highlights: ['Private luxury jeep', 'Expert naturalist guide', 'Gourmet picnic breakfast', 'Early morning entry'],
    inclusions: [{ icon: 'Car', title: 'Private Luxury Jeep', description: 'Air-conditioned 4x4' }],
    exclusions: ['Personal expenses', 'Tips'],
    duration: '6-8 hours',
    groupSize: '2-6 people',
    price: { amount: 450, currency: 'USD', per: 'person' },
    availability: { type: 'daily', minimumNotice: 48 },
    locations: [{ name: 'Yala National Park', coordinates: { lat: 6.3654, lng: 81.5172 } }],
    difficulty: 'easy',
    cancellationPolicy: 'Free cancellation 48 hours before',
    seo: { metaTitle: 'Private Leopard Safari Yala', metaDescription: 'Exclusive leopard safari in Yala', keywords: ['yala safari', 'leopard'] },
    status: 'published',
    featured: true,
    popular: true,
    new: false
  },
  {
    title: 'Sunrise Hot Air Balloon over Sigiriya',
    subtitle: 'Aerial Adventure',
    category: 'adventure-expeditions',
    slug: 'hot-air-balloon-sigiriya',
    heroImage: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=1200',
    gallery: [{ url: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800', alt: 'Hot air balloon', order: 1 }],
    shortDescription: 'Float above the ancient rock fortress of Sigiriya at sunrise for breathtaking views.',
    fullDescription: 'Experience the magic of a sunrise hot air balloon ride over the iconic Sigiriya Rock Fortress.',
    highlights: ['Sunrise flight', 'Views of Sigiriya', 'Champagne breakfast', 'Flight certificate'],
    inclusions: [{ icon: 'Sunrise', title: 'Sunrise Flight', description: '1-hour balloon flight' }],
    exclusions: ['Personal expenses'],
    duration: '4 hours',
    groupSize: '2-8 people',
    price: { amount: 295, currency: 'USD', per: 'person' },
    availability: { type: 'daily', minimumNotice: 24 },
    locations: [{ name: 'Sigiriya', coordinates: { lat: 7.9570, lng: 80.7603 } }],
    difficulty: 'easy',
    cancellationPolicy: 'Weather-dependent, full refund if cancelled',
    seo: { metaTitle: 'Hot Air Balloon Sigiriya', metaDescription: 'Sunrise balloon ride Sigiriya', keywords: ['sigiriya balloon'] },
    status: 'published',
    featured: true,
    popular: true,
    new: true
  },
  {
    title: 'Ayurvedic Wellness Retreat',
    subtitle: 'Healing & Rejuvenation',
    category: 'wellness-retreats',
    slug: 'ayurvedic-wellness-retreat',
    heroImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200',
    gallery: [{ url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800', alt: 'Spa treatment', order: 1 }],
    shortDescription: 'Immerse yourself in authentic Ayurvedic healing traditions with personalized treatments.',
    fullDescription: 'Experience the ancient healing wisdom of Ayurveda in a luxurious spa setting.',
    highlights: ['Dosha analysis', 'Daily treatments', 'Yoga sessions', 'Organic cuisine'],
    inclusions: [{ icon: 'Leaf', title: 'Daily Treatments', description: '2-3 hours of therapies' }],
    exclusions: ['Accommodation'],
    duration: '3-14 days',
    groupSize: '1-4 people',
    price: { amount: 180, currency: 'USD', per: 'day' },
    availability: { type: 'daily', minimumNotice: 72 },
    locations: [{ name: 'Bentota', coordinates: { lat: 6.4213, lng: 79.9976 } }],
    difficulty: 'easy',
    cancellationPolicy: '7 days notice required',
    seo: { metaTitle: 'Ayurvedic Retreat Sri Lanka', metaDescription: 'Wellness retreat in Sri Lanka', keywords: ['ayurveda'] },
    status: 'published',
    featured: true,
    popular: false,
    new: false
  },
  {
    title: 'Blue Whale Watching Expedition',
    subtitle: 'Marine Adventure',
    category: 'marine-adventures',
    slug: 'blue-whale-watching-mirissa',
    heroImage: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1200',
    gallery: [{ url: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800', alt: 'Blue whale', order: 1 }],
    shortDescription: 'Witness the majestic blue whales and dolphins in the waters off Mirissa.',
    fullDescription: 'Join our expert marine biologists on an unforgettable expedition to see blue whales.',
    highlights: ['Blue whale sighting', 'Dolphin pods', 'Marine biologist guide', 'Breakfast on board'],
    inclusions: [{ icon: 'Anchor', title: 'Private Boat', description: 'Comfortable catamaran' }],
    exclusions: ['Hotel transfers'],
    duration: '5-6 hours',
    groupSize: '2-10 people',
    price: { amount: 120, currency: 'USD', per: 'person' },
    availability: { type: 'seasonal', seasonalAvailability: [{ season: 'Nov-Apr', available: true }], minimumNotice: 24 },
    locations: [{ name: 'Mirissa', coordinates: { lat: 5.9483, lng: 80.4716 } }],
    difficulty: 'easy',
    cancellationPolicy: 'Weather-dependent, full refund if cancelled',
    seo: { metaTitle: 'Whale Watching Mirissa', metaDescription: 'Blue whale watching Sri Lanka', keywords: ['whale watching'] },
    status: 'published',
    featured: false,
    popular: true,
    new: false
  },
  {
    title: 'Temple of the Tooth Puja Ceremony',
    subtitle: 'Sacred Cultural Experience',
    category: 'cultural-immersion',
    slug: 'temple-tooth-puja-ceremony',
    heroImage: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=1200',
    gallery: [{ url: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800', alt: 'Temple ceremony', order: 1 }],
    shortDescription: 'Participate in an exclusive evening puja ceremony at the sacred Temple of the Tooth.',
    fullDescription: 'Experience the spiritual heart of Sri Lanka with a private guided visit to the Temple of the Tooth.',
    highlights: ['VIP temple access', 'Puja ceremony', 'Private guide', 'Traditional dress'],
    inclusions: [{ icon: 'Heart', title: 'VIP Access', description: 'Skip-the-line entry' }],
    exclusions: ['Transport'],
    duration: '3 hours',
    groupSize: '2-8 people',
    price: { amount: 95, currency: 'USD', per: 'person' },
    availability: { type: 'daily', minimumNotice: 24 },
    locations: [{ name: 'Kandy', coordinates: { lat: 7.2936, lng: 80.6350 } }],
    difficulty: 'easy',
    cancellationPolicy: '24 hours notice required',
    seo: { metaTitle: 'Temple of Tooth Ceremony', metaDescription: 'Puja ceremony Kandy', keywords: ['temple of tooth'] },
    status: 'published',
    featured: true,
    popular: false,
    new: false
  },
  {
    title: 'Sri Lankan Cooking Masterclass',
    subtitle: 'Culinary Journey',
    category: 'culinary-journeys',
    slug: 'sri-lankan-cooking-masterclass',
    heroImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200',
    gallery: [{ url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', alt: 'Cooking class', order: 1 }],
    shortDescription: 'Learn authentic Sri Lankan cuisine from award-winning chefs.',
    fullDescription: 'Discover the secrets of Sri Lankan cuisine with our immersive cooking experience.',
    highlights: ['Market tour', 'Spice education', 'Hands-on cooking', 'Recipe booklet'],
    inclusions: [{ icon: 'ChefHat', title: 'Expert Chef', description: 'Award-winning local chef' }],
    exclusions: ['Transport'],
    duration: '5 hours',
    groupSize: '2-8 people',
    price: { amount: 85, currency: 'USD', per: 'person' },
    availability: { type: 'daily', minimumNotice: 24 },
    locations: [{ name: 'Colombo', coordinates: { lat: 6.9271, lng: 79.8612 } }],
    difficulty: 'easy',
    cancellationPolicy: '24 hours notice required',
    seo: { metaTitle: 'Cooking Class Sri Lanka', metaDescription: 'Sri Lankan cooking class', keywords: ['cooking class'] },
    status: 'published',
    featured: false,
    popular: true,
    new: true
  },
  {
    title: 'Romantic Sunset Cruise in Bentota',
    subtitle: 'Couples Escape',
    category: 'romantic-escapes',
    slug: 'romantic-sunset-cruise-bentota',
    heroImage: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200',
    gallery: [{ url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800', alt: 'Sunset cruise', order: 1 }],
    shortDescription: 'A magical sunset cruise for couples with champagne and gourmet dining.',
    fullDescription: 'Sail into the golden sunset on a private luxury boat cruise along the Bentota River.',
    highlights: ['Private boat', 'Champagne service', 'Sunset views', 'Gourmet canapés'],
    inclusions: [{ icon: 'Ship', title: 'Private Boat', description: 'Luxury river cruiser' }],
    exclusions: ['Hotel transfers'],
    duration: '2.5 hours',
    groupSize: '2 people',
    price: { amount: 250, currency: 'USD', per: 'couple' },
    availability: { type: 'daily', minimumNotice: 24 },
    locations: [{ name: 'Bentota', coordinates: { lat: 6.4213, lng: 79.9976 } }],
    difficulty: 'easy',
    cancellationPolicy: '24 hours notice required',
    seo: { metaTitle: 'Romantic Sunset Cruise', metaDescription: 'Sunset cruise Bentota', keywords: ['romantic cruise'] },
    status: 'published',
    featured: true,
    popular: false,
    new: false
  },
  {
    title: 'Family Elephant Safari Adventure',
    subtitle: 'Kids-Friendly Wildlife',
    category: 'family-adventures',
    slug: 'family-elephant-safari-minneriya',
    heroImage: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1200',
    gallery: [{ url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800', alt: 'Elephant herd', order: 1 }],
    shortDescription: 'A family-friendly safari to see wild elephants with activities for children.',
    fullDescription: 'Create unforgettable family memories on this specially designed elephant safari.',
    highlights: ['Wild elephants', 'Family-friendly guide', 'Kids activity pack', 'Picnic lunch'],
    inclusions: [{ icon: 'Car', title: 'Family Jeep', description: 'Comfortable safari vehicle' }],
    exclusions: ['Personal expenses'],
    duration: '5 hours',
    groupSize: '2-6 people',
    price: { amount: 75, currency: 'USD', per: 'person' },
    availability: { type: 'daily', minimumNotice: 24 },
    locations: [{ name: 'Minneriya', coordinates: { lat: 8.0342, lng: 80.8500 } }],
    difficulty: 'easy',
    cancellationPolicy: '24 hours notice required',
    seo: { metaTitle: 'Family Elephant Safari', metaDescription: 'Family safari Minneriya', keywords: ['family safari'] },
    status: 'published',
    featured: false,
    popular: true,
    new: false
  },
  {
    title: 'Wildlife Photography Expedition',
    subtitle: 'Capture Nature',
    category: 'photography-tours',
    slug: 'wildlife-photography-expedition',
    heroImage: 'https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=1200',
    gallery: [{ url: 'https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=800', alt: 'Wildlife photographer', order: 1 }],
    shortDescription: 'Professional wildlife photography tour with expert guidance and premium equipment.',
    fullDescription: 'Join our professional wildlife photographer for an immersive photography expedition.',
    highlights: ['Pro photographer guide', 'Equipment rental', 'Post-processing workshop', 'Best locations'],
    inclusions: [{ icon: 'Camera', title: 'Pro Guidance', description: 'Award-winning photographer' }],
    exclusions: ['Camera body'],
    duration: '8 hours',
    groupSize: '2-4 people',
    price: { amount: 350, currency: 'USD', per: 'person' },
    availability: { type: 'daily', minimumNotice: 48 },
    locations: [{ name: 'Yala National Park', coordinates: { lat: 6.3654, lng: 81.5172 } }],
    difficulty: 'moderate',
    cancellationPolicy: '48 hours notice required',
    seo: { metaTitle: 'Wildlife Photography Tour', metaDescription: 'Photography expedition Sri Lanka', keywords: ['wildlife photography'] },
    status: 'published',
    featured: true,
    popular: false,
    new: true
  },
  {
    title: 'Private Tea Tasting at Handunugoda Estate',
    subtitle: 'Exclusive Access',
    category: 'exclusive-access',
    slug: 'private-tea-tasting-handunugoda',
    heroImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200',
    gallery: [{ url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800', alt: 'Tea plantation', order: 1 }],
    shortDescription: 'Exclusive access to one of Sri Lanka\'s most prestigious tea estates.',
    fullDescription: 'Go behind the scenes at the famous Handunugoda Tea Estate, home of Virgin White Tea.',
    highlights: ['Meet estate owner', 'Factory tour', 'Rare tea tasting', 'High tea lunch'],
    inclusions: [{ icon: 'Coffee', title: 'Tea Tasting', description: '8 premium teas' }],
    exclusions: ['Transport'],
    duration: '4 hours',
    groupSize: '2-6 people',
    price: { amount: 180, currency: 'USD', per: 'person' },
    availability: { type: 'weekly', minimumNotice: 72 },
    locations: [{ name: 'Galle', coordinates: { lat: 6.0535, lng: 80.2210 } }],
    difficulty: 'easy',
    cancellationPolicy: '72 hours notice required',
    seo: { metaTitle: 'Private Tea Tasting', metaDescription: 'Tea tasting Sri Lanka', keywords: ['tea tasting'] },
    status: 'published',
    featured: true,
    popular: false,
    new: false
  },
  {
    title: 'Kite Surfing in Kalpitiya',
    subtitle: 'Water Sports Adventure',
    category: 'adventure-expeditions',
    slug: 'kite-surfing-kalpitiya',
    heroImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200',
    gallery: [{ url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', alt: 'Kite surfing', order: 1 }],
    shortDescription: 'Learn kite surfing at Sri Lanka\'s premier kite surfing destination.',
    fullDescription: 'Kalpitiya\'s consistent winds and shallow lagoon make it perfect for kite surfing.',
    highlights: ['IKO certified', 'All equipment', 'Lagoon location', 'Video analysis'],
    inclusions: [{ icon: 'Wind', title: 'Equipment', description: 'Premium kite gear' }],
    exclusions: ['Transport'],
    duration: '3 hours',
    groupSize: '1-4 people',
    price: { amount: 120, currency: 'USD', per: 'person' },
    availability: { type: 'seasonal', seasonalAvailability: [{ season: 'May-Oct', available: true }], minimumNotice: 24 },
    locations: [{ name: 'Kalpitiya', coordinates: { lat: 8.2333, lng: 79.7667 } }],
    difficulty: 'moderate',
    cancellationPolicy: 'Weather-dependent',
    seo: { metaTitle: 'Kite Surfing Kalpitiya', metaDescription: 'Kite surfing Sri Lanka', keywords: ['kite surfing'] },
    status: 'published',
    featured: false,
    popular: false,
    new: true
  },
  {
    title: 'Scuba Diving at Pigeon Island',
    subtitle: 'Underwater Paradise',
    category: 'marine-adventures',
    slug: 'scuba-diving-pigeon-island',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',
    gallery: [{ url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', alt: 'Scuba diving', order: 1 }],
    shortDescription: 'Explore vibrant coral reefs and marine life at Sri Lanka\'s premier diving destination.',
    fullDescription: 'Discover the underwater wonders of Pigeon Island Marine National Park.',
    highlights: ['PADI certified', 'Coral reefs', 'Sea turtles', 'Small groups'],
    inclusions: [{ icon: 'Anchor', title: 'Equipment', description: 'Full scuba gear' }],
    exclusions: ['Underwater photos'],
    duration: '4 hours',
    groupSize: '2-6 people',
    price: { amount: 95, currency: 'USD', per: 'person' },
    availability: { type: 'seasonal', seasonalAvailability: [{ season: 'Mar-Oct', available: true }], minimumNotice: 24 },
    locations: [{ name: 'Trincomalee', coordinates: { lat: 8.5778, lng: 81.2433 } }],
    difficulty: 'moderate',
    cancellationPolicy: 'Weather-dependent',
    seo: { metaTitle: 'Scuba Diving Sri Lanka', metaDescription: 'Diving Pigeon Island', keywords: ['scuba diving'] },
    status: 'published',
    featured: false,
    popular: true,
    new: false
  }
];

class LuxuryExperienceService {
  private collection = 'luxuryExperiences';
  private requestsCollection = 'customExperienceRequests';

  // Get all published experiences
  async getExperiences(category?: ExperienceCategory): Promise<LuxuryExperience[]> {
    try {
      const ref = collection(db, this.collection);
      let q;
      if (category) {
        q = query(ref, where('status', '==', 'published'), where('category', '==', category), orderBy('featured', 'desc'));
      } else {
        q = query(ref, where('status', '==', 'published'), orderBy('featured', 'desc'));
      }
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        console.log('Using seed data for experiences');
        if (category) return SEED_EXPERIENCES.filter(e => e.category === category) as LuxuryExperience[];
        return SEED_EXPERIENCES as LuxuryExperience[];
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LuxuryExperience[];
    } catch (error) {
      console.error('Error fetching experiences:', error);
      if (category) return SEED_EXPERIENCES.filter(e => e.category === category) as LuxuryExperience[];
      return SEED_EXPERIENCES as LuxuryExperience[];
    }
  }

  // Get featured experiences for homepage
  async getFeaturedExperiences(limitCount = 6): Promise<LuxuryExperience[]> {
    try {
      const ref = collection(db, this.collection);
      const q = query(ref, where('status', '==', 'published'), where('featured', '==', true), firestoreLimit(limitCount));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return SEED_EXPERIENCES.filter(e => e.featured).slice(0, limitCount) as LuxuryExperience[];
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LuxuryExperience[];
    } catch (error) {
      return SEED_EXPERIENCES.filter(e => e.featured).slice(0, limitCount) as LuxuryExperience[];
    }
  }

  // Get single experience by slug
  async getExperienceBySlug(slug: string): Promise<LuxuryExperience | null> {
    try {
      const ref = collection(db, this.collection);
      const q = query(ref, where('slug', '==', slug), where('status', '==', 'published'), firestoreLimit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        const seedExp = SEED_EXPERIENCES.find(e => e.slug === slug);
        return seedExp ? { id: slug, ...seedExp } as LuxuryExperience : null;
      }
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as LuxuryExperience;
    } catch (error) {
      const seedExp = SEED_EXPERIENCES.find(e => e.slug === slug);
      return seedExp ? { id: slug, ...seedExp } as LuxuryExperience : null;
    }
  }

  // Get experience by ID (for admin)
  async getExperienceById(id: string): Promise<LuxuryExperience | null> {
    return await dbService.get(this.collection, id) as LuxuryExperience;
  }

  // Create new experience (admin)
  async createExperience(data: Omit<LuxuryExperience, 'id' | 'createdAt' | 'updatedAt'>): Promise<LuxuryExperience> {
    const slug = this.generateSlug(data.title);
    const experience = { ...data, slug, status: data.status || 'draft', featured: data.featured || false, popular: data.popular || false, new: data.new || false };
    return await dbService.create(this.collection, experience) as LuxuryExperience;
  }

  // Update experience (admin)
  async updateExperience(id: string, data: Partial<LuxuryExperience>): Promise<LuxuryExperience> {
    if (data.title) data.slug = this.generateSlug(data.title);
    return await dbService.update(this.collection, id, data) as LuxuryExperience;
  }

  // Delete experience (admin)
  async deleteExperience(id: string): Promise<void> {
    const experience = await this.getExperienceById(id);
    if (experience) {
      if (experience.heroImage) try { await storageService.delete(experience.heroImage); } catch {}
      if (experience.gallery) for (const image of experience.gallery) try { await storageService.delete(image.url); } catch {}
    }
    await dbService.delete(this.collection, id);
  }

  // Upload experience image
  async uploadImage(file: File, experienceId: string, type: 'hero' | 'gallery'): Promise<string> {
    const path = `experiences/${experienceId}/${type}/${Date.now()}-${file.name}`;
    const result = await storageService.upload(path, file);
    return result.url;
  }

  // Submit custom experience request
  async submitCustomRequest(data: Omit<CustomExperienceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<CustomExperienceRequest> {
    const request = { ...data, status: 'new' as const };
    return await dbService.create(this.requestsCollection, request) as CustomExperienceRequest;
  }

  // Get custom requests (admin)
  async getCustomRequests(status?: string): Promise<CustomExperienceRequest[]> {
    const filters = status ? [{ field: 'status', operator: '==', value: status }] : undefined;
    return await dbService.list(this.requestsCollection, filters, 'createdAt', 100) as CustomExperienceRequest[];
  }

  // Update custom request status (admin)
  async updateRequestStatus(id: string, status: CustomExperienceRequest['status'], notes?: string, assignedTo?: string): Promise<void> {
    const updates: any = { status };
    if (notes) updates.notes = notes;
    if (assignedTo) updates.assignedTo = assignedTo;
    if (status === 'contacted') updates.respondedAt = new Date();
    await dbService.update(this.requestsCollection, id, updates);
  }

  // Get experience categories
  getCategories(): Array<{ value: ExperienceCategory; label: string; description: string; icon: string }> {
    return [
      { value: 'luxury-safari', label: 'Luxury Safari', description: 'Private game drives with expert naturalists', icon: 'Mountain' },
      { value: 'photography-tours', label: 'Photography', description: 'Capture Sri Lanka\'s beauty', icon: 'Camera' },
      { value: 'cultural-immersion', label: 'Cultural', description: 'Temple ceremonies and village life', icon: 'Heart' },
      { value: 'wellness-retreats', label: 'Wellness', description: 'Ayurvedic spa and yoga', icon: 'Leaf' },
      { value: 'adventure-expeditions', label: 'Adventure', description: 'Balloon tours and hiking', icon: 'Mountain' },
      { value: 'marine-adventures', label: 'Marine', description: 'Diving and whale watching', icon: 'Anchor' },
      { value: 'culinary-journeys', label: 'Culinary', description: 'Cooking masterclasses', icon: 'ChefHat' },
      { value: 'romantic-escapes', label: 'Romantic', description: 'Intimate experiences for couples', icon: 'Heart' },
      { value: 'family-adventures', label: 'Family', description: 'Kid-friendly experiences', icon: 'Users' },
      { value: 'exclusive-access', label: 'Exclusive', description: 'VIP and behind-the-scenes', icon: 'Lock' }
    ];
  }

  // Helper to generate URL-friendly slug
  private generateSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // Search experiences
  async searchExperiences(queryStr: string): Promise<LuxuryExperience[]> {
    const all = await this.getExperiences();
    const lowercaseQuery = queryStr.toLowerCase();
    return all.filter(exp => exp.title.toLowerCase().includes(lowercaseQuery) || exp.shortDescription.toLowerCase().includes(lowercaseQuery) || exp.category.includes(lowercaseQuery));
  }

  // Get popular experiences
  async getPopularExperiences(limitCount = 4): Promise<LuxuryExperience[]> {
    try {
      const ref = collection(db, this.collection);
      const q = query(ref, where('status', '==', 'published'), where('popular', '==', true), firestoreLimit(limitCount));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return SEED_EXPERIENCES.filter(e => e.popular).slice(0, limitCount) as LuxuryExperience[];
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LuxuryExperience[];
    } catch { return SEED_EXPERIENCES.filter(e => e.popular).slice(0, limitCount) as LuxuryExperience[]; }
  }

  // Get new experiences
  async getNewExperiences(limitCount = 4): Promise<LuxuryExperience[]> {
    try {
      const ref = collection(db, this.collection);
      const q = query(ref, where('status', '==', 'published'), where('new', '==', true), firestoreLimit(limitCount));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return SEED_EXPERIENCES.filter(e => e.new).slice(0, limitCount) as LuxuryExperience[];
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LuxuryExperience[];
    } catch { return SEED_EXPERIENCES.filter(e => e.new).slice(0, limitCount) as LuxuryExperience[]; }
  }

  // Get page content from Firebase
  async getPageContent(): Promise<any> {
    try {
      const ref = collection(db, 'page-content');
      const q = query(ref, where('pageId', '==', 'experiences'), firestoreLimit(1));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) return snapshot.docs[0].data();
      return { heroTitle: 'Curated Experiences', heroSubtitle: 'Handcrafted journeys beyond the ordinary', heroImage: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=1920', stats: { experiences: '50+', satisfaction: '98%', years: '15+' } };
    } catch { return { heroTitle: 'Curated Experiences', heroSubtitle: 'Handcrafted journeys beyond the ordinary', heroImage: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=1920', stats: { experiences: '50+', satisfaction: '98%', years: '15+' } }; }
  }
}

export const luxuryExperienceService = new LuxuryExperienceService();
