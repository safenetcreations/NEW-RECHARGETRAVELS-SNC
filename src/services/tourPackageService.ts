
import { getDocs, getDoc, collection, query, where, orderBy, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

// This service handles operations related to tour packages
export const tourPackageService = {
  // Seed sample data for demo purposes
  async seedSampleData() {
    try {
      console.log('Seeding sample tour package data...');
      
      // Step 1: Create a sample wildlife tour package
      const packageRef = await addDoc(collection(db, 'tour_packages'), {
        name: '7-Day Wildlife Safari Package',
        category: 'wildlife',
        duration_days: 7,
        luxury_level: 'luxury',
        base_price: 2450,
        description: 'Experience the best of Sri Lankan wildlife on this 7-day luxury safari tour. Explore Yala National Park, home to the highest leopard density in the world, venture into Udawalawe to witness herds of wild elephants, discover the biodiversity of Sinharaja Rainforest, and enjoy whale watching in Mirissa.',
        highlights: [
          'Private jeep safaris with expert naturalists in Yala National Park',
          'Witness the famous Elephant Gathering at Udawalawe',
          'Explore the UNESCO World Heritage Sinharaja Rainforest',
          'Luxury catamaran whale watching experience in Mirissa',
          'Stay at premium wildlife lodges and resorts'
        ],
        is_active: true,
        created_at: new Date().toISOString()
      });
      
      const packageDoc = await getDoc(packageRef);
      const packageData = { id: packageDoc.id, ...packageDoc.data() };
      const tourId = packageData.id;
      
      // Step 2: Add itinerary
      const itineraryItems = [
        {
          tour_package_id: tourId,
          day_number: 1,
          title: 'Arrival - Colombo to Yala',
          description: 'Your journey begins with airport pickup in a luxury vehicle for a scenic 4-hour drive to Yala. Enjoy refreshment stops along the way before checking in at the Wild Coast Tented Lodge. Spend the evening at leisure, enjoying sunset cocktails followed by dinner at the lodge.',
          activities: ['Airport pickup', 'Scenic drive to Yala', 'Check-in at Wild Coast Tented Lodge', 'Sunset cocktails'],
          meals_included: ['dinner'],
          accommodation: 'Wild Coast Tented Lodge',
          transport_details: 'Private luxury vehicle'
        },
        {
          tour_package_id: tourId,
          day_number: 2,
          title: 'Yala National Park',
          description: 'Early morning start for an exhilarating private jeep safari with an expert naturalist guide. Enjoy breakfast in the wild while looking for leopards, elephants, and other wildlife. Return to the lodge for a spa treatment before heading out for an afternoon safari. End the day with sundowner drinks and a gourmet dinner.',
          activities: ['Morning private jeep safari', 'Breakfast in the wild', 'Spa treatment', 'Afternoon safari', 'Sundowner drinks'],
          meals_included: ['breakfast', 'lunch', 'dinner'],
          accommodation: 'Wild Coast Tented Lodge',
          transport_details: 'Private safari jeep'
        },
        {
          tour_package_id: tourId,
          day_number: 3,
          title: 'Yala to Udawalawe',
          description: 'Start with a final morning safari in Yala before driving to Udawalawe National Park (approximately 2 hours). Check in at the Grand Udawalawe Safari Resort, then visit the Elephant Transit Home to see orphaned elephants being fed. End the day with an evening safari in Udawalawe National Park.',
          activities: ['Morning safari in Yala', 'Drive to Udawalawe', 'Visit Elephant Transit Home', 'Evening safari in Udawalawe'],
          meals_included: ['breakfast', 'lunch', 'dinner'],
          accommodation: 'Grand Udawalawe Safari Resort',
          transport_details: 'Private luxury vehicle and safari jeep'
        },
        {
          tour_package_id: tourId,
          day_number: 4,
          title: 'Udawalawe to Sinharaja',
          description: 'Early morning safari in Udawalawe to see elephants in their natural habitat. After breakfast, drive to Sinharaja Rainforest (approximately 3 hours). Check in at the Rainforest Eco Lodge and enjoy an afternoon rainforest walk with a specialist guide. After dinner, experience a night walk to spot nocturnal species.',
          activities: ['Morning safari', 'Drive to Sinharaja', 'Afternoon rainforest walk', 'Night walk'],
          meals_included: ['breakfast', 'lunch', 'dinner'],
          accommodation: 'Rainforest Eco Lodge',
          transport_details: 'Private luxury vehicle'
        },
        {
          tour_package_id: tourId,
          day_number: 5,
          title: 'Sinharaja to Mirissa',
          description: 'Early morning bird watching tour in Sinharaja to spot endemic species. After breakfast, drive to the coastal town of Mirissa (approximately 2.5 hours). Check in at Cape Weligama, a luxury clifftop resort. Spend the afternoon at leisure on the beach before enjoying a seafood dinner with ocean views.',
          activities: ['Morning bird watching tour', 'Drive to Mirissa', 'Beach time'],
          meals_included: ['breakfast', 'lunch', 'dinner'],
          accommodation: 'Cape Weligama',
          transport_details: 'Private luxury vehicle'
        },
        {
          tour_package_id: tourId,
          day_number: 6,
          title: 'Whale Watching',
          description: 'Early morning departure for a luxury catamaran whale watching excursion. Enjoy a champagne breakfast on board while searching for blue whales, sperm whales, and dolphins. Return to the resort for an afternoon spa treatment. Farewell dinner on the beach.',
          activities: ['Luxury catamaran whale watching', 'Champagne breakfast on board', 'Afternoon spa treatment'],
          meals_included: ['breakfast', 'lunch', 'dinner'],
          accommodation: 'Cape Weligama',
          transport_details: 'Private transfers and luxury catamaran'
        },
        {
          tour_package_id: tourId,
          day_number: 7,
          title: 'Departure',
          description: 'Enjoy a leisurely breakfast with ocean views before your private transfer to the airport. Depart with unforgettable memories of your Sri Lankan wildlife adventure.',
          activities: ['Breakfast', 'Airport transfer'],
          meals_included: ['breakfast'],
          accommodation: 'N/A',
          transport_details: 'Private luxury vehicle to airport'
        }
      ];

      // Add itinerary items to Firestore
      for (const item of itineraryItems) {
        await addDoc(collection(db, 'tour_itinerary'), {
          ...item,
          created_at: new Date().toISOString()
        });
      }

      // Step 3: Add inclusions
      const inclusionItems = [
        {
          tour_package_id: tourId,
          category: 'accommodation',
          items: [
            '6 nights luxury accommodation',
            'Wild Coast Tented Lodge (2 nights)',
            'Grand Udawalawe Safari Resort (1 night)',
            'Rainforest Eco Lodge (1 night)',
            'Cape Weligama (2 nights)'
          ]
        },
        {
          tour_package_id: tourId,
          category: 'transport',
          items: [
            'Private luxury vehicle throughout',
            'Private safari jeeps in national parks',
            'Luxury catamaran for whale watching',
            'Airport transfers'
          ]
        },
        {
          tour_package_id: tourId,
          category: 'meals',
          items: [
            'All meals as specified in itinerary',
            'Welcome dinner',
            'Farewell dinner',
            'Champagne breakfast on whale watching'
          ]
        },
        {
          tour_package_id: tourId,
          category: 'activities',
          items: [
            'Private jeep safaris with expert guides',
            'Whale watching excursion',
            'Rainforest guided walks',
            'Bird watching tours',
            'Spa treatments'
          ]
        },
        {
          tour_package_id: tourId,
          category: 'services',
          items: [
            'Expert naturalist guides',
            '24/7 support',
            'Travel insurance',
            'All park fees and permits'
          ]
        }
      ];

      // Add inclusion items to Firestore
      for (const item of inclusionItems) {
        await addDoc(collection(db, 'tour_inclusions'), {
          ...item,
          created_at: new Date().toISOString()
        });
      }

      // Step 4: Add accommodations
      const accommodationItems = [
        {
          tour_package_id: tourId,
          name: 'Wild Coast Tented Lodge',
          location: 'Yala National Park',
          description: 'Luxury tented accommodation with stunning ocean views',
          amenities: ['Private plunge pool', 'Spa', 'Restaurant', 'Bar'],
          nights: 2,
          room_type: 'Luxury Tent',
          image_url: '/images/wild-coast-tented-lodge.jpg'
        },
        {
          tour_package_id: tourId,
          name: 'Grand Udawalawe Safari Resort',
          location: 'Udawalawe National Park',
          description: 'Elegant resort overlooking the national park',
          amenities: ['Swimming pool', 'Spa', 'Restaurant', 'Garden'],
          nights: 1,
          room_type: 'Deluxe Room',
          image_url: '/images/grand-udawalawe-resort.jpg'
        },
        {
          tour_package_id: tourId,
          name: 'Rainforest Eco Lodge',
          location: 'Sinharaja Rainforest',
          description: 'Eco-friendly lodge in the heart of the rainforest',
          amenities: ['Guided walks', 'Restaurant', 'Garden', 'Library'],
          nights: 1,
          room_type: 'Eco Cottage',
          image_url: '/images/rainforest-eco-lodge.jpg'
        },
        {
          tour_package_id: tourId,
          name: 'Cape Weligama',
          location: 'Mirissa',
          description: 'Luxury clifftop resort with ocean views',
          amenities: ['Infinity pool', 'Spa', 'Restaurant', 'Beach access'],
          nights: 2,
          room_type: 'Ocean View Suite',
          image_url: '/images/cape-weligama.jpg'
        }
      ];

      // Add accommodation items to Firestore
      for (const item of accommodationItems) {
        await addDoc(collection(db, 'tour_accommodations'), {
          ...item,
          created_at: new Date().toISOString()
        });
      }

      // Step 5: Add pricing
      const pricingItems = [
        {
          tour_package_id: tourId,
          season: 'Peak Season (Dec-Apr)',
          base_price: 2450,
          single_supplement: 850,
          child_price: 1225,
          valid_from: '2024-12-01',
          valid_to: '2025-04-30'
        },
        {
          tour_package_id: tourId,
          season: 'Shoulder Season (May-Sep)',
          base_price: 1950,
          single_supplement: 650,
          child_price: 975,
          valid_from: '2024-05-01',
          valid_to: '2024-09-30'
        },
        {
          tour_package_id: tourId,
          season: 'Low Season (Oct-Nov)',
          base_price: 1650,
          single_supplement: 550,
          child_price: 825,
          valid_from: '2024-10-01',
          valid_to: '2024-11-30'
        }
      ];

      // Add pricing items to Firestore
      for (const item of pricingItems) {
        await addDoc(collection(db, 'tour_pricing'), {
          ...item,
          created_at: new Date().toISOString()
        });
      }

      toast.success('Sample tour package data seeded successfully!');
      return { data: packageData, error: null };
      
    } catch (error) {
      console.error('Error seeding tour package data:', error);
      toast.error('Failed to seed tour package data');
      return { data: null, error };
    }
  },

  // Get all tour packages
  async getAllTourPackages() {
    try {
      const q = query(
        collection(db, 'tour_packages'),
        where('is_active', '==', true),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      const packages = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      
      return { data: packages, error: null };
    } catch (error) {
      console.error('Error fetching tour packages:', error);
      return { data: null, error };
    }
  },

  // Get tour package by ID
  async getTourPackageById(packageId: string) {
    try {
      const packageDoc = await getDoc(doc(db, 'tour_packages', packageId));
      
      if (!packageDoc.exists()) {
        return { data: null, error: new Error('Tour package not found') };
      }
      
      const packageData = { id: packageDoc.id, ...packageDoc.data() };
      
      // Fetch related data (itinerary, inclusions, accommodations, pricing)
      const [itinerarySnapshot, inclusionsSnapshot, accommodationsSnapshot, pricingSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'tour_itinerary'), where('tour_package_id', '==', packageId), orderBy('day_number'))),
        getDocs(query(collection(db, 'tour_inclusions'), where('tour_package_id', '==', packageId))),
        getDocs(query(collection(db, 'tour_accommodations'), where('tour_package_id', '==', packageId), orderBy('nights', 'desc'))),
        getDocs(query(collection(db, 'tour_pricing'), where('tour_package_id', '==', packageId)))
      ]);
      
      const itinerary = itinerarySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      const inclusions = inclusionsSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      const accommodations = accommodationsSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      const pricing = pricingSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      
      const fullPackage = {
        ...packageData,
        itinerary,
        inclusions,
        accommodations,
        pricing
      };
      
      return { data: fullPackage, error: null };
    } catch (error) {
      console.error('Error fetching tour package:', error);
      return { data: null, error };
    }
  }
};
