import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TouristLocation } from '@/components/discovery/types';
import { touristLocations as defaultLocations } from '@/components/discovery/data/touristLocations';

export const useTouristLocations = () => {
  const [locations, setLocations] = useState<TouristLocation[]>(defaultLocations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const touristDoc = await getDoc(doc(db, 'site-settings', 'tourist-locations'));
        if (touristDoc.exists() && touristDoc.data().locations) {
          // Merge Firestore data with default location data
          const firestoreLocations = touristDoc.data().locations;
          const mergedLocations = defaultLocations.map(loc => {
            const firestoreLoc = firestoreLocations.find((fl: any) => fl.id === loc.id);
            if (firestoreLoc) {
              return {
                ...loc,
                imageUrl: firestoreLoc.imageUrl || loc.imageUrl,
                description: firestoreLoc.description || loc.description,
                rating: firestoreLoc.rating || loc.rating,
                reviews: firestoreLoc.reviews || loc.reviews,
                priceRange: firestoreLoc.priceRange || loc.priceRange,
                openingHours: firestoreLoc.openingHours || loc.openingHours,
                bestTimeToVisit: firestoreLoc.bestTimeToVisit || loc.bestTimeToVisit,
                type: firestoreLoc.type || loc.type
              };
            }
            return loc;
          });
          setLocations(mergedLocations);
        }
      } catch (error) {
        console.error('Error loading tourist locations:', error);
        // Keep default locations if Firestore fails
      } finally {
        setLoading(false);
      }
    };
    loadLocations();
  }, []);

  return { locations, loading };
};