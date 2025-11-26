
import { collection, query, where, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Vehicle } from '../types';

// Transform database row to our Vehicle type
const transformDbVehicleToVehicle = (dbVehicle: any): Vehicle => {
  return {
    id: dbVehicle.id,
    driverId: '', // Not available in current schema
    vehicleType: mapTypeToVehicleType(dbVehicle.make || 'sedan'),
    make: dbVehicle.make || 'Unknown',
    model: dbVehicle.model || 'Unknown',
    year: dbVehicle.year || 2020,
    licensePlate: 'Unknown', // Not available in current schema
    passengerCapacity: dbVehicle.seats || 4,
    luggageCapacity: dbVehicle.luggage_capacity || 2,
    basePrice: dbVehicle.daily_rate || 0,
    pricePerKm: dbVehicle.extra_km_rate || 50,
    isActive: dbVehicle.is_active !== false,
    imageUrl: dbVehicle.image_urls?.[0] || undefined,
  };
};

// Map existing vehicle types to our enum
const mapTypeToVehicleType = (type: string): Vehicle['vehicleType'] => {
  const typeMap: Record<string, Vehicle['vehicleType']> = {
    'car': 'sedan',
    'sedan': 'sedan',
    'suv': 'suv',
    'van': 'van',
    'luxury': 'luxury',
    'toyota': 'sedan', // fallback for make-based mapping
    'honda': 'sedan',
    'nissan': 'sedan',
  };
  
  return typeMap[type?.toLowerCase()] || 'sedan';
};

export const vehicleService = {
  async getAvailableVehicles(): Promise<Vehicle[]> {
    try {
      const vehiclesCollection = collection(db, 'vehicles');
      const q = query(vehiclesCollection, where('is_active', '==', true));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return (data || []).map(transformDbVehicleToVehicle);
    } catch (error) {
      console.error('Error fetching available vehicles:', error);
      return [];
    }
  },

  async getVehiclesByType(type: Vehicle['vehicleType']): Promise<Vehicle[]> {
    const vehicles = await this.getAvailableVehicles();
    return vehicles.filter(v => v.vehicleType === type);
  },

  async getVehicleById(id: string): Promise<Vehicle | null> {
    try {
      const vehicleDoc = doc(db, 'vehicles', id);
      const snapshot = await getDoc(vehicleDoc);
      if (snapshot.exists()) {
        return transformDbVehicleToVehicle({ id: snapshot.id, ...snapshot.data() });
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching vehicle by id:', error);
      return null;
    }
  },

  async createVehicle(vehicleData: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    try {
      const categoriesCollection = collection(db, 'vehicle_categories');
      const q = query(categoriesCollection, where('name', '==', vehicleData.vehicleType));
      const snapshot = await getDocs(q);
      const categoryId = snapshot.docs[0]?.id || 'default-category-id';

      const dbData = {
        category_id: categoryId,
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        seats: vehicleData.passengerCapacity,
        luggage_capacity: vehicleData.luggageCapacity,
        has_child_seat: false,
        has_ac: true,
        has_wifi: false,
        daily_rate: vehicleData.basePrice,
        extra_km_rate: vehicleData.pricePerKm,
        image_urls: vehicleData.imageUrl ? [vehicleData.imageUrl] : [],
        description: `${vehicleData.make} ${vehicleData.model}`,
        features: [],
        is_active: vehicleData.isActive,
      };

      const docRef = await addDoc(collection(db, 'vehicles'), dbData);
      return transformDbVehicleToVehicle({ id: docRef.id, ...dbData });
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },
};
