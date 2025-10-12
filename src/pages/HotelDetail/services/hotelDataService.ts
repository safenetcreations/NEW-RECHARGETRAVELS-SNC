
import { getDocs, getDoc, collection, query, where, orderBy, limit, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { HotelReview } from '@/types/hotel';
import { HotelWithRelations, TourPackageWithTour } from '../types';
import { validateHotelType } from '../utils/hotelTypeUtils';

export const fetchHotelFromDatabase = async (hotelId: string): Promise<HotelWithRelations | null> => {
  try {
    const hotelDoc = await getDoc(doc(db, 'hotels', hotelId));
    
    if (!hotelDoc.exists()) {
      return null;
    }
    
    const hotelData = { id: hotelDoc.id, ...hotelDoc.data() } as any;
    
    console.log('HotelDetail - firebase query result:', { data: hotelData });
    
    // Fetch related data
    const [roomTypesSnapshot, hotelImagesSnapshot, cityDoc] = await Promise.all([
      getDocs(query(collection(db, 'room_types'), where('hotel_id', '==', hotelId))),
      getDocs(query(collection(db, 'hotel_images'), where('hotel_id', '==', hotelId), orderBy('sort_order'))),
      hotelData.city_id ? getDoc(doc(db, 'cities', hotelData.city_id)) : null
    ]);
    
    const roomTypes = roomTypesSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    const hotelImages = hotelImagesSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    const city = cityDoc?.exists() ? { id: cityDoc.id, ...cityDoc.data() } : null;
    
    console.log('HotelDetail - raw hotel data:', hotelData);
    
    const hotelType = validateHotelType(hotelData.hotel_type);
    
    const transformedHotelData: HotelWithRelations = {
      ...hotelData,
      hotel_type: hotelType,
      hotel_reviews: [],
      room_types: roomTypes?.map((room: any) => ({
        ...room,
        amenities: Array.isArray(room.amenities) ? room.amenities : [],
        images: Array.isArray(room.images) ? room.images : []
      })) || [],
      amenities: Array.isArray(hotelData.amenities) ? hotelData.amenities : [],
      images: hotelImages?.map((img: any) => img.image_url) || [],
      location: hotelData.latitude && hotelData.longitude ? {
        latitude: hotelData.latitude,
        longitude: hotelData.longitude
      } : undefined,
      cities: city
    };
    
    console.log('HotelDetail - transformed hotel data:', transformedHotelData);
    return transformedHotelData;
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return null;
  }
};

export const fetchHotelReviews = async (hotelId: string): Promise<HotelReview[]> => {
  try {
    const q = query(
      collection(db, 'hotel_reviews'),
      where('hotel_id', '==', hotelId),
      where('is_verified', '==', true),
      orderBy('created_at', 'desc'),
      limit(10)
    );
    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as HotelReview[];
    
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const fetchHotelTourPackages = async (hotelId: string): Promise<TourPackageWithTour[]> => {
  try {
    const q = query(
      collection(db, 'hotel_tour_packages'),
      where('hotel_id', '==', hotelId),
      where('is_active', '==', true)
    );
    const snapshot = await getDocs(q);
    const hotelTours = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as any[];
    
    // Fetch tour details for each hotel tour package
    const toursWithDetails = await Promise.all(
      hotelTours.map(async (hotelTour) => {
        if (hotelTour.tour_id) {
          const tourDoc = await getDoc(doc(db, 'tours', hotelTour.tour_id));
          if (tourDoc.exists()) {
            return {
              ...hotelTour,
              tour: { id: tourDoc.id, ...tourDoc.data() }
            };
          }
        }
        return hotelTour;
      })
    );
    
    return toursWithDetails as TourPackageWithTour[];
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
};
