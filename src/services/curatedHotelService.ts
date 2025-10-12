
import { getDocs, getDoc, collection, query, where, orderBy, limit, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Hotel } from '@/types/hotel';

export const fetchCuratedLuxuryHotels = async (): Promise<Hotel[]> => {
  try {
    const q = query(
      collection(db, 'hotels'),
      where('is_active', '==', true),
      where('country', '==', 'Sri Lanka'),
      orderBy('ai_recommendation_score', 'desc'),
      limit(12)
    );
    const snapshot = await getDocs(q);
    const hotels = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as any[];
    
    // Filter by hotel type (Firestore doesn't support 'in' queries with multiple values easily)
    const filteredHotels = hotels.filter(hotel => 
      ['luxury_resort', 'boutique', 'middle_range'].includes(hotel.hotel_type)
    );
    
    // Fetch related data for each hotel
    const enrichedHotels = await Promise.all(
      filteredHotels.map(async (hotel) => {
        const [cityDoc, imagesSnapshot, reviewsSnapshot, roomsSnapshot] = await Promise.all([
          hotel.city_id ? getDoc(doc(db, 'cities', hotel.city_id)) : null,
          getDocs(query(collection(db, 'hotel_images'), where('hotel_id', '==', hotel.id))),
          getDocs(query(collection(db, 'hotel_reviews'), where('hotel_id', '==', hotel.id))),
          getDocs(query(collection(db, 'hotel_rooms'), where('hotel_id', '==', hotel.id)))
        ]);
        
        const city = cityDoc?.exists() ? { id: cityDoc.id, ...cityDoc.data() } as any : null;
        const images = imagesSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        const reviews = reviewsSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        const rooms = roomsSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        
        const ratings = reviews?.map((r: any) => r.rating) || [];
        const average_rating = ratings.length > 0 
          ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length 
          : 0;

        return {
          id: hotel.id,
          name: hotel.name || '',
          description: hotel.description || '',
          star_rating: hotel.star_rating || 0,
          hotel_type: (hotel.hotel_type as Hotel['hotel_type']) || 'budget',
          location: hotel.latitude && hotel.longitude ? {
            latitude: hotel.latitude,
            longitude: hotel.longitude
          } : undefined,
          address: hotel.address || '',
          city: city ? {
            id: city.id,
            name: city.name,
            country: city.country || 'Sri Lanka'
          } : undefined,
          amenities: hotel.amenities || [],
          ai_recommendation_score: hotel.ai_recommendation_score || 0,
          room_types: rooms?.map((room: any) => ({
            id: room.id,
            hotel_id: room.hotel_id,
            name: room.room_type,
            price_per_night: room.base_price,
            max_occupancy: room.max_occupancy,
            amenities: [],
            available_count: room.is_available ? 1 : 0,
            is_active: room.is_available
          })) || [],
          images: images?.map((img: any) => ({
            id: img.id || '',
            hotel_id: hotel.id,
            image_url: img.image_url,
            is_primary: img.is_primary || false,
            sort_order: img.sort_order || 0
          })) || [],
          reviews: reviews?.map((review: any) => ({
            id: review.id,
            hotel_id: review.hotel_id,
            rating: review.rating,
            review_text: review.review_text,
            created_at: review.created_at,
            is_verified: review.is_verified,
            guest_name: review.guest_name
          })) || [],
          average_rating: Math.round(average_rating * 10) / 10,
          review_count: ratings.length,
          is_active: hotel.is_active,
          created_at: hotel.created_at,
          updated_at: hotel.updated_at,
          country: hotel.country || 'Sri Lanka',
          base_price_per_night: hotel.base_price_per_night
        } as Hotel;
      })
    );

    return enrichedHotels;
  } catch (error) {
    console.error('Error fetching curated hotels:', error);
    return [];
  }
};

export const getHotelTypeIntroduction = (hotelType: string): string => {
  const introductions = {
    luxury_resort: "Experience world-class luxury amidst Sri Lanka's breathtaking landscapes. These premium resorts offer unparalleled comfort, exceptional service, and unforgettable experiences.",
    boutique: "Discover unique charm and personalized service in these carefully curated boutique properties. Each hotel tells its own story through distinctive design and intimate atmosphere.",
    middle_range: "Perfect balance of comfort and value. These well-appointed hotels provide excellent amenities and warm Sri Lankan hospitality without compromising on quality.",
    wellness: "Rejuvenate your mind, body, and soul at these wellness-focused retreats. Featuring spa treatments, yoga sessions, and holistic experiences in serene settings.",
    cabana: "Embrace the tropical paradise with beachfront cabanas offering direct access to pristine beaches, water sports, and stunning ocean views.",
    budget: "Comfortable and affordable accommodations that don't compromise on cleanliness and essential amenities. Perfect for travelers seeking value and authenticity."
  };
  
  return introductions[hotelType] || "Discover exceptional accommodations that showcase the best of Sri Lankan hospitality and comfort.";
};
