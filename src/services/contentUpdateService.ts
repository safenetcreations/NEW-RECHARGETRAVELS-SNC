import { realDestinations, realTours, realHotels, sriLankaFacts, testimonials, blogPosts } from '@/data/sriLankaRealData';
import EnhancedSEOService from '@/lib/enhanced-seo-service';

interface PageContent {
  title: string;
  description: string;
  heroImage: string;
  content: any;
  seo: any;
  lastUpdated: Date;
}

interface UpdateStatus {
  page: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  message?: string;
  updatedAt?: Date;
}

export class ContentUpdateService {
  private static updates: Map<string, UpdateStatus> = new Map();
  
  // Phase 1: High Priority Pages
  static async updateHomepage(): Promise<UpdateStatus> {
    try {
      this.setStatus('homepage', 'in-progress');
      
      const content: PageContent = {
        title: 'Discover the Pearl of the Indian Ocean',
        description: 'Experience authentic Sri Lankan adventures with expert local guides',
        heroImage: 'https://images.unsplash.com/photo-1588001400947-6385aef4ab0e?q=80&w=2074',
        content: {
          featuredDestinations: Object.values(realDestinations).slice(0, 6),
          popularTours: {
            wildlife: realTours.filter(tour => tour.category === 'wildlife'),
            cultural: realTours.filter(tour => tour.category === 'cultural'),
            adventure: realTours.filter(tour => tour.category === 'adventure')
          },
          testimonials: testimonials,
          blogPosts: blogPosts.slice(0, 3),
          statistics: {
            yearsOfService: 9,
            happyTravelers: 5000,
            destinations: 30,
            tours: 50
          }
        },
        seo: EnhancedSEOService.generatePageSEO('homepage'),
        lastUpdated: new Date()
      };
      
      // Store the update (in real app, this would update the database)
      localStorage.setItem('content_homepage', JSON.stringify(content));
      
      this.setStatus('homepage', 'completed', 'Homepage updated successfully');
      return this.getStatus('homepage')!;
      
    } catch (error) {
      this.setStatus('homepage', 'error', error.message);
      return this.getStatus('homepage')!;
    }
  }
  
  static async updateDestination(destinationSlug: string): Promise<UpdateStatus> {
    try {
      this.setStatus(`destination_${destinationSlug}`, 'in-progress');
      
      const destinationData = realDestinations[destinationSlug];
      if (!destinationData) {
        throw new Error(`Destination ${destinationSlug} not found`);
      }
      
      const content: PageContent = {
        title: destinationData.title,
        description: destinationData.description,
        heroImage: destinationData.heroImage,
        content: {
          ...destinationData,
          nearbyAttractions: this.getNearbyAttractions(destinationSlug),
          recommendedTours: this.getRecommendedTours(destinationSlug),
          hotels: this.getDestinationHotels(destinationSlug),
          restaurants: this.getTopRestaurants(destinationSlug),
          transportation: this.getTransportOptions(destinationSlug)
        },
        seo: EnhancedSEOService.generatePageSEO('destination', { destination: destinationSlug }),
        lastUpdated: new Date()
      };
      
      localStorage.setItem(`content_destination_${destinationSlug}`, JSON.stringify(content));
      
      this.setStatus(`destination_${destinationSlug}`, 'completed', 'Destination updated successfully');
      return this.getStatus(`destination_${destinationSlug}`)!;
      
    } catch (error) {
      this.setStatus(`destination_${destinationSlug}`, 'error', error.message);
      return this.getStatus(`destination_${destinationSlug}`)!;
    }
  }
  
  static async updateTourCategory(category: string): Promise<UpdateStatus> {
    try {
      this.setStatus(`tour_${category}`, 'in-progress');
      
      const tours = realTours.filter(tour => tour.category === category);
      if (!tours || tours.length === 0) {
        throw new Error(`Tour category ${category} not found`);
      }
      
      const content: PageContent = {
        title: this.getTourCategoryTitle(category),
        description: this.getTourCategoryDescription(category),
        heroImage: this.getTourCategoryHeroImage(category),
        content: {
          tours: tours,
          relatedCategories: this.getRelatedTourCategories(category),
          faqs: this.getTourFAQs(category),
          bookingInfo: this.getBookingInfo(category)
        },
        seo: EnhancedSEOService.generatePageSEO(`${category}-tours`),
        lastUpdated: new Date()
      };
      
      localStorage.setItem(`content_tour_${category}`, JSON.stringify(content));
      
      this.setStatus(`tour_${category}`, 'completed', 'Tour category updated successfully');
      return this.getStatus(`tour_${category}`)!;
      
    } catch (error) {
      this.setStatus(`tour_${category}`, 'error', error.message);
      return this.getStatus(`tour_${category}`)!;
    }
  }
  
  static async batchUpdatePhase1(): Promise<UpdateStatus[]> {
    const updates = [
      this.updateHomepage(),
      this.updateDestination('colombo'),
      this.updateDestination('kandy'),
      this.updateDestination('galle'),
      this.updateDestination('sigiriya'),
      this.updateDestination('ella'),
      this.updateTourCategory('wildlife'),
      this.updateTourCategory('cultural')
    ];
    
    return Promise.all(updates);
  }
  
  // Helper methods
  private static setStatus(page: string, status: UpdateStatus['status'], message?: string) {
    this.updates.set(page, {
      page,
      status,
      message,
      updatedAt: new Date()
    });
  }
  
  private static getStatus(page: string): UpdateStatus | undefined {
    return this.updates.get(page);
  }
  
  private static getNearbyAttractions(destination: string): any[] {
    // Logic to get nearby attractions based on destination
    const attractions = {
      colombo: ['Gangaramaya Temple', 'Galle Face Green', 'National Museum'],
      kandy: ['Temple of Tooth', 'Royal Botanical Gardens', 'Kandy Lake'],
      galle: ['Galle Fort', 'Dutch Reformed Church', 'Maritime Museum'],
      sigiriya: ['Pidurangala Rock', 'Dambulla Cave Temple', 'Minneriya National Park'],
      ella: ['Nine Arch Bridge', 'Little Adams Peak', 'Ravana Falls']
    };
    
    return attractions[destination] || [];
  }
  
  private static getRecommendedTours(destination: string): any[] {
    // Get tours relevant to the destination
    const tourMap = {
      colombo: ['City Tour', 'Street Food Tour', 'Shopping Tour'],
      kandy: ['Cultural Show', 'Temple Tour', 'Tea Plantation Visit'],
      galle: ['Fort Walking Tour', 'Sunset Cruise', 'Cooking Class'],
      sigiriya: ['Rock Fortress Climb', 'Village Tour', 'Hot Air Balloon'],
      ella: ['Train Ride', 'Hiking Tours', 'Tea Factory Visit']
    };
    
    return tourMap[destination] || [];
  }
  
  private static getDestinationHotels(location: string): any[] {
    return realHotels.filter(hotel => 
      hotel.location.toLowerCase() === location.toLowerCase()
    );
  }
  
  private static getTopRestaurants(destination: string): any[] {
    const restaurants = {
      colombo: [
        { name: 'Ministry of Crab', cuisine: 'Seafood', price: '$$$' },
        { name: 'Nuga Gama', cuisine: 'Traditional Sri Lankan', price: '$$' },
        { name: 'Gallery Café', cuisine: 'International', price: '$$' }
      ],
      kandy: [
        { name: 'The Empire Café', cuisine: 'Sri Lankan/Western', price: '$$' },
        { name: 'Balaji Dosai', cuisine: 'South Indian', price: '$' },
        { name: 'Slightly Chilled', cuisine: 'International', price: '$$' }
      ],
      galle: [
        { name: 'Chambers Restaurant', cuisine: 'Fine Dining', price: '$$$' },
        { name: 'A Minute by Tuk Tuk', cuisine: 'Asian Fusion', price: '$$' },
        { name: 'Mama\'s Galle Fort', cuisine: 'Sri Lankan', price: '$' }
      ]
    };
    
    return restaurants[destination] || [];
  }
  
  private static getTransportOptions(destination: string): any {
    const distances = {
      colombo: { airport: '30 min', fromColombo: '0' },
      kandy: { airport: '3 hours', fromColombo: '3 hours' },
      galle: { airport: '2.5 hours', fromColombo: '2 hours' },
      sigiriya: { airport: '4 hours', fromColombo: '4 hours' },
      ella: { airport: '5 hours', fromColombo: '5 hours' }
    };
    
    return {
      distance: distances[destination] || {},
      options: ['Private Car', 'Train', 'Bus', 'Domestic Flight'],
      recommendedOption: destination === 'ella' ? 'Scenic Train' : 'Private Car'
    };
  }
  
  private static getTourCategoryTitle(category: string): string {
    const titles = {
      wildlife: 'Sri Lanka Wildlife Safari Tours',
      cultural: 'Sri Lanka Cultural & Heritage Tours',
      adventure: 'Sri Lanka Adventure Tours',
      beach: 'Sri Lanka Beach & Coastal Tours'
    };
    
    return titles[category] || 'Sri Lanka Tours';
  }
  
  private static getTourCategoryDescription(category: string): string {
    const descriptions = {
      wildlife: 'Experience incredible wildlife encounters in Sri Lanka\'s national parks',
      cultural: 'Explore 2,500 years of history and culture',
      adventure: 'Thrilling adventures in Sri Lanka\'s diverse landscapes',
      beach: 'Relax on pristine beaches and enjoy water sports'
    };
    
    return descriptions[category] || '';
  }
  
  private static getTourCategoryHeroImage(category: string): string {
    const images = {
      wildlife: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=2077',
      cultural: 'https://images.unsplash.com/photo-1588598198321-9735fd0f5073?q=80&w=2074',
      adventure: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070',
      beach: 'https://images.unsplash.com/photo-1539979611351-8870cb5e9d5e?q=80&w=2940'
    };
    
    return images[category] || '';
  }
  
  private static getTourFAQs(category: string): any[] {
    const commonFAQs = [
      {
        question: 'What is included in the tour price?',
        answer: 'All entrance fees, professional guide, transportation, and specified meals.'
      },
      {
        question: 'What should I bring?',
        answer: 'Comfortable walking shoes, sun protection, camera, and water bottle.'
      }
    ];
    
    const categorySpecific = {
      wildlife: [
        {
          question: 'What is the best time for wildlife viewing?',
          answer: 'Early morning (6-10 AM) and late afternoon (3-6 PM) offer the best sighting opportunities.'
        }
      ],
      cultural: [
        {
          question: 'Is there a dress code for temples?',
          answer: 'Yes, shoulders and knees should be covered. White clothing is preferred for temple visits.'
        }
      ]
    };
    
    return [...commonFAQs, ...(categorySpecific[category] || [])];
  }
  
  private static getBookingInfo(category: string): any {
    return {
      cancellationPolicy: 'Free cancellation up to 24 hours before the tour',
      groupSize: category === 'wildlife' ? 'Maximum 6 per vehicle' : 'Maximum 15 per group',
      languages: ['English', 'German', 'French', 'Spanish'],
      pickupInfo: 'Hotel pickup available from major cities',
      paymentOptions: ['Credit Card', 'PayPal', 'Bank Transfer']
    };
  }
  
  private static getRelatedTourCategories(category: string): string[] {
    const related = {
      wildlife: ['adventure', 'photography'],
      cultural: ['heritage', 'religious'],
      adventure: ['wildlife', 'hiking'],
      beach: ['watersports', 'island']
    };
    
    return related[category] || [];
  }
  
  // Get all update statuses
  static getAllStatuses(): UpdateStatus[] {
    return Array.from(this.updates.values());
  }
  
  // Clear all updates
  static clearUpdates(): void {
    this.updates.clear();
  }
}