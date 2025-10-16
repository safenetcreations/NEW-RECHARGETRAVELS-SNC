
import { collection, query, where, getDocs, doc, getDoc, addDoc, orderBy, limit, startAt, endAt } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { VehicleCategory, Vehicle, Driver, VehicleBooking, VehicleFilters, BookingFormData } from '@/types/vehicle';

// Fetch all vehicle categories
export async function getVehicleCategories(): Promise<VehicleCategory[]> {
  console.log('Fetching vehicle categories');
  
  const categoriesCollection = collection(db, 'vehicle_categories');
  const q = query(categoriesCollection, orderBy('name'));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return data as VehicleCategory[] || [];
}

// Transform driver assignment data to Driver objects
function transformDriverData(driverAssignments: any[]): Driver[] {
  return driverAssignments.map(assignment => assignment.driver);
}

// Fetch vehicles with filters
export async function getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
  console.log('Fetching vehicles with filters:', filters);
  
  const vehiclesCollection = collection(db, 'vehicles');
  const constraints = [where('is_active', '==', true)];

  if (filters?.category && filters.category.length > 0) {
    constraints.push(where('category_id', 'in', filters.category));
  }

  if (filters?.minSeats) {
    constraints.push(where('seats', '>=', filters.minSeats));
  }

  // Other filters can be added here

  const q = query(vehiclesCollection, ...constraints);
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // This is a simplified implementation. The original query fetched related data.
  // You would need to fetch the category and drivers separately.
  
  return data as Vehicle[] || [];
}

// Fetch single vehicle with details
export async function getVehicle(id: string): Promise<Vehicle | null> {
  console.log('Fetching vehicle:', id);
  
  const vehicleDoc = doc(db, 'vehicles', id);
  const snapshot = await getDoc(vehicleDoc);
  
  if (!snapshot.exists()) {
    return null;
  }

  const data = { id: snapshot.id, ...snapshot.data() };

  // Fetch related data separately

  return data as Vehicle;
}

// Fetch driver details
export async function getDriver(id: string): Promise<Driver | null> {
  console.log('Fetching driver:', id);
  
  const driverDoc = doc(db, 'drivers', id);
  const snapshot = await getDoc(driverDoc);

  if (!snapshot.exists()) {
    return null;
  }

  const data = { id: snapshot.id, ...snapshot.data() };

  return data as Driver;
}

// Check vehicle availability
export async function checkVehicleAvailability(
  vehicleId: string, 
  startDate: string, 
  endDate: string
): Promise<boolean> {
  console.log('Checking vehicle availability:', { vehicleId, startDate, endDate });
  
  // This needs to be implemented with a Firebase Cloud Function
  console.log('Vehicle availability check to be implemented with Firebase Cloud Functions');
  return true;
}

// Create vehicle booking
export async function createVehicleBooking(
  vehicleId: string,
  driverId: string | null,
  bookingData: BookingFormData
): Promise<VehicleBooking> {
  console.log('Creating vehicle booking:', { vehicleId, driverId, bookingData });

  const vehicle = await getVehicle(vehicleId);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  const docRef = await addDoc(collection(db, 'vehicle_bookings'), {
    vehicle_id: vehicleId,
    driver_id: driverId,
    start_date: bookingData.startDate,
    end_date: bookingData.endDate,
    // ... other fields
  });

  const snapshot = await getDoc(docRef);
  const data = { id: snapshot.id, ...snapshot.data() };

  return data as VehicleBooking;
}

// Get vehicles by category
export async function getVehiclesByCategory(categoryName: string): Promise<Vehicle[]> {
  console.log('Fetching vehicles by category:', categoryName);
  
  const categoriesCollection = collection(db, 'vehicle_categories');
  const q1 = query(categoriesCollection, where('name', '==', categoryName));
  const snapshot1 = await getDocs(q1);
  const categoryId = snapshot1.docs[0]?.id;

  if (!categoryId) {
    return [];
  }

  const vehiclesCollection = collection(db, 'vehicles');
  const q2 = query(vehiclesCollection, where('category_id', '==', categoryId), where('is_active', '==', true));
  const snapshot2 = await getDocs(q2);
  const data = snapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return data as Vehicle[] || [];
}

// Add driver review
export async function addDriverReview(
  driverId: string,
  rating: number,
  comment: string,
  guestName?: string,
  guestEmail?: string
): Promise<void> {
  console.log('Adding driver review:', { driverId, rating });
  
  await addDoc(collection(db, 'driver_reviews'), {
    driver_id: driverId,
    rating,
    comment,
    guest_name: guestName,
    guest_email: guestEmail
  });
}
