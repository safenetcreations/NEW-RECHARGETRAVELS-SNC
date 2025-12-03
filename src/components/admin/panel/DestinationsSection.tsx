import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Save,
  RefreshCw,
  MapPin,
  Map,
  Plus,
  Trash2,
  Navigation,
  Globe,
  Landmark,
  Mountain,
  Waves,
  Church,
  Home,
  TreePine,
  Camera,
  Image,
  Upload,
  GripVertical,
  Eye,
  ArrowUp,
  ArrowDown,
  Link as LinkIcon,
  X,
  Utensils,
  Hotel,
  Star,
  Clock,
  DollarSign,
  Lightbulb,
  Search,
  Info,
  Phone,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

// Available destinations
const DESTINATIONS = [
  { slug: 'kandy', name: 'Kandy', lat: 7.2906, lng: 80.6337 },
  { slug: 'colombo', name: 'Colombo', lat: 6.9271, lng: 79.8612 },
  { slug: 'galle', name: 'Galle', lat: 6.0535, lng: 80.2210 },
  { slug: 'ella', name: 'Ella', lat: 6.8667, lng: 81.0466 },
  { slug: 'sigiriya', name: 'Sigiriya', lat: 7.9570, lng: 80.7603 },
  { slug: 'nuwara-eliya', name: 'Nuwara Eliya', lat: 6.9497, lng: 80.7891 },
  { slug: 'trincomalee', name: 'Trincomalee', lat: 8.5874, lng: 81.2152 },
  { slug: 'anuradhapura', name: 'Anuradhapura', lat: 8.3114, lng: 80.4037 },
  { slug: 'polonnaruwa', name: 'Polonnaruwa', lat: 7.9403, lng: 81.0188 },
  { slug: 'negombo', name: 'Negombo', lat: 7.2094, lng: 79.8358 },
  { slug: 'mirissa', name: 'Mirissa', lat: 5.9485, lng: 80.4718 },
  { slug: 'arugam-bay', name: 'Arugam Bay', lat: 6.8406, lng: 81.8338 },
  { slug: 'batticaloa', name: 'Batticaloa', lat: 7.7310, lng: 81.6747 },
  { slug: 'kurunegala', name: 'Kurunegala', lat: 7.4867, lng: 80.3647 },
  { slug: 'adams-peak', name: "Adam's Peak", lat: 6.8096, lng: 80.4994 },
  { slug: 'badulla', name: 'Badulla', lat: 6.9934, lng: 81.0550 },
  { slug: 'hambantota', name: 'Hambantota', lat: 6.1429, lng: 81.1212 },
  { slug: 'hatton', name: 'Hatton', lat: 6.8916, lng: 80.5979 },
  { slug: 'kalpitiya', name: 'Kalpitiya', lat: 8.2333, lng: 79.7667 },
  { slug: 'kilinochchi', name: 'Kilinochchi', lat: 9.3803, lng: 80.3770 },
  { slug: 'matara', name: 'Matara', lat: 5.9549, lng: 80.5550 },
  { slug: 'puttalam', name: 'Puttalam', lat: 8.0362, lng: 79.8283 },
  { slug: 'ratnapura', name: 'Ratnapura', lat: 6.6828, lng: 80.3992 },
  { slug: 'tangalle', name: 'Tangalle', lat: 6.0236, lng: 80.7946 },
  { slug: 'wadduwa', name: 'Wadduwa', lat: 6.6297, lng: 79.9292 },
  { slug: 'jaffna', name: 'Jaffna', lat: 9.6615, lng: 80.0255 },
  { slug: 'delft-island', name: 'Delft Island', lat: 9.5167, lng: 79.6833 },
  { slug: 'mullaitivu', name: 'Mullaitivu', lat: 9.2671, lng: 80.8142 },
  { slug: 'vavuniya', name: 'Vavuniya', lat: 8.7514, lng: 80.4971 },
  { slug: 'mannar', name: 'Mannar', lat: 8.9810, lng: 79.9044 },
];

// Icon options for attractions
const ICON_OPTIONS = [
  { value: 'Landmark', label: 'Landmark', icon: Landmark },
  { value: 'Mountain', label: 'Mountain', icon: Mountain },
  { value: 'Waves', label: 'Beach/Water', icon: Waves },
  { value: 'Church', label: 'Temple/Religious', icon: Church },
  { value: 'Home', label: 'Building', icon: Home },
  { value: 'TreePine', label: 'Nature', icon: TreePine },
  { value: 'Camera', label: 'Viewpoint', icon: Camera },
  { value: 'MapPin', label: 'Point of Interest', icon: MapPin },
];

interface MapAttraction {
  id?: string;
  destinationSlug: string;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  icon: string;
  category: string;
  isActive: boolean;
}

interface HeroSlide {
  id?: string;
  image: string;
  title: string;
  subtitle: string;
  order: number;
  isActive: boolean;
}

// Content interfaces for full page management
interface Attraction {
  id?: string;
  destinationSlug: string;
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  duration: string;
  price: string;
  highlights: string[];
  featured: boolean;
  isActive: boolean;
  order: number;
}

interface Activity {
  id?: string;
  destinationSlug: string;
  name: string;
  description: string;
  icon: string;
  price: string;
  duration: string;
  difficulty: string;
  popular: boolean;
  isActive: boolean;
  order: number;
}

interface Restaurant {
  id?: string;
  destinationSlug: string;
  name: string;
  description: string;
  image: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  address: string;
  phone: string;
  website: string;
  openingHours: string;
  featured: boolean;
  isActive: boolean;
  order: number;
}

interface HotelItem {
  id?: string;
  destinationSlug: string;
  name: string;
  description: string;
  image: string;
  starRating: number;
  priceRange: string;
  amenities: string[];
  address: string;
  phone: string;
  website: string;
  featured: boolean;
  isActive: boolean;
  order: number;
}

interface TravelTip {
  id?: string;
  destinationSlug: string;
  title: string;
  content: string;
  category: string;
  icon: string;
  isActive: boolean;
  order: number;
}

interface ExtendedDestinationInfo {
  population: string;
  area: string;
  elevation: string;
  bestTime: string;
  language: string;
  currency: string;
  weather: {
    temperature: string;
    humidity: string;
    rainfall: string;
    season: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
}

// Activity icon options
const ACTIVITY_ICONS = [
  { value: 'Mountain', label: 'Mountain/Hiking' },
  { value: 'Waves', label: 'Beach/Water' },
  { value: 'Camera', label: 'Photography' },
  { value: 'Bike', label: 'Cycling' },
  { value: 'Car', label: 'Driving/Tours' },
  { value: 'Anchor', label: 'Boat/Sailing' },
  { value: 'TreePine', label: 'Nature/Wildlife' },
  { value: 'Crown', label: 'Heritage/Royal' },
  { value: 'Palette', label: 'Art/Culture' },
  { value: 'Footprints', label: 'Walking/Trekking' },
  { value: 'Utensils', label: 'Food/Dining' },
  { value: 'ShoppingBag', label: 'Shopping' },
  { value: 'Sun', label: 'Sunrise/Sunset' },
  { value: 'Compass', label: 'Adventure' },
];

// Tip categories
const TIP_CATEGORIES = [
  'Transportation',
  'Safety',
  'Culture',
  'Money',
  'Health',
  'Communication',
  'Food',
  'Shopping',
  'Weather',
  'General',
];

// Price ranges
const PRICE_RANGES = ['$', '$$', '$$$', '$$$$'];

const DestinationsSection: React.FC = () => {
  const [selectedDestination, setSelectedDestination] = useState(DESTINATIONS[0].slug);
  const [mapAttractions, setMapAttractions] = useState<MapAttraction[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attractionFileInputRef = useRef<HTMLInputElement>(null);
  const restaurantFileInputRef = useRef<HTMLInputElement>(null);
  const hotelFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<{ type: string; index: number } | null>(null);

  // Content states for full page management
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [travelTips, setTravelTips] = useState<TravelTip[]>([]);
  const [extendedInfo, setExtendedInfo] = useState<ExtendedDestinationInfo>({
    population: '',
    area: '',
    elevation: '',
    bestTime: '',
    language: 'Sinhala, Tamil, English',
    currency: 'Sri Lankan Rupee (LKR)',
    weather: { temperature: '', humidity: '', rainfall: '', season: '' },
    seo: { title: '', description: '', keywords: [] },
    cta: { title: '', subtitle: '', buttonText: 'Plan Your Trip' },
  });

  // Destination info state
  const [destinationInfo, setDestinationInfo] = useState({
    name: '',
    tagline: '',
    description: '',
    isPublished: true,
  });

  // New slide form
  const [newSlide, setNewSlide] = useState({
    imageUrl: '',
    title: '',
    subtitle: '',
  });
  const [showUrlInput, setShowUrlInput] = useState(false);

  useEffect(() => {
    loadDestinationData();
  }, [selectedDestination]);

  const loadDestinationData = async () => {
    setLoading(true);
    try {
      // Load destination info with extended data
      const destRef = doc(db, 'destinations', selectedDestination);
      const destSnap = await getDoc(destRef);
      if (destSnap.exists()) {
        const data = destSnap.data();
        setDestinationInfo({
          name: data.name || DESTINATIONS.find(d => d.slug === selectedDestination)?.name || '',
          tagline: data.tagline || '',
          description: data.description || '',
          isPublished: data.isPublished !== false,
        });
        // Load extended info
        setExtendedInfo({
          population: data.population || '',
          area: data.area || '',
          elevation: data.elevation || '',
          bestTime: data.bestTime || '',
          language: data.language || 'Sinhala, Tamil, English',
          currency: data.currency || 'Sri Lankan Rupee (LKR)',
          weather: data.weather || { temperature: '', humidity: '', rainfall: '', season: '' },
          seo: data.seo || { title: '', description: '', keywords: [] },
          cta: data.cta || { title: '', subtitle: '', buttonText: 'Plan Your Trip' },
        });
      } else {
        const dest = DESTINATIONS.find(d => d.slug === selectedDestination);
        setDestinationInfo({
          name: dest?.name || '',
          tagline: '',
          description: '',
          isPublished: true,
        });
        setExtendedInfo({
          population: '',
          area: '',
          elevation: '',
          bestTime: '',
          language: 'Sinhala, Tamil, English',
          currency: 'Sri Lankan Rupee (LKR)',
          weather: { temperature: '', humidity: '', rainfall: '', season: '' },
          seo: { title: '', description: '', keywords: [] },
          cta: { title: '', subtitle: '', buttonText: 'Plan Your Trip' },
        });
      }

      // Load hero slides
      const heroRef = collection(db, 'destinationHeroSlides');
      const heroQuery = query(heroRef, where('destinationSlug', '==', selectedDestination));
      const heroSnapshot = await getDocs(heroQuery);
      const loadedSlides: HeroSlide[] = [];
      heroSnapshot.forEach((doc) => {
        loadedSlides.push({ id: doc.id, ...doc.data() } as HeroSlide);
      });
      loadedSlides.sort((a, b) => (a.order || 0) - (b.order || 0));
      setHeroSlides(loadedSlides);

      // Load map attractions
      const mapAttractionsRef = collection(db, 'destinationMapAttractions');
      const mapQuery = query(mapAttractionsRef, where('destinationSlug', '==', selectedDestination));
      const mapSnapshot = await getDocs(mapQuery);
      const loadedMapAttractions: MapAttraction[] = [];
      mapSnapshot.forEach((doc) => {
        loadedMapAttractions.push({ id: doc.id, ...doc.data() } as MapAttraction);
      });
      setMapAttractions(loadedMapAttractions);

      // Load attractions (places to visit)
      const attractionsRef = collection(db, 'destinationAttractions');
      const attractionsQuery = query(attractionsRef, where('destinationSlug', '==', selectedDestination));
      const attractionsSnapshot = await getDocs(attractionsQuery);
      const loadedAttractions: Attraction[] = [];
      attractionsSnapshot.forEach((doc) => {
        loadedAttractions.push({ id: doc.id, ...doc.data() } as Attraction);
      });
      loadedAttractions.sort((a, b) => (a.order || 0) - (b.order || 0));
      setAttractions(loadedAttractions);

      // Load activities
      const activitiesRef = collection(db, 'destinationActivities');
      const activitiesQuery = query(activitiesRef, where('destinationSlug', '==', selectedDestination));
      const activitiesSnapshot = await getDocs(activitiesQuery);
      const loadedActivities: Activity[] = [];
      activitiesSnapshot.forEach((doc) => {
        loadedActivities.push({ id: doc.id, ...doc.data() } as Activity);
      });
      loadedActivities.sort((a, b) => (a.order || 0) - (b.order || 0));
      setActivities(loadedActivities);

      // Load restaurants
      const restaurantsRef = collection(db, 'destinationRestaurants');
      const restaurantsQuery = query(restaurantsRef, where('destinationSlug', '==', selectedDestination));
      const restaurantsSnapshot = await getDocs(restaurantsQuery);
      const loadedRestaurants: Restaurant[] = [];
      restaurantsSnapshot.forEach((doc) => {
        loadedRestaurants.push({ id: doc.id, ...doc.data() } as Restaurant);
      });
      loadedRestaurants.sort((a, b) => (a.order || 0) - (b.order || 0));
      setRestaurants(loadedRestaurants);

      // Load hotels
      const hotelsRef = collection(db, 'destinationHotels');
      const hotelsQuery = query(hotelsRef, where('destinationSlug', '==', selectedDestination));
      const hotelsSnapshot = await getDocs(hotelsQuery);
      const loadedHotels: HotelItem[] = [];
      hotelsSnapshot.forEach((doc) => {
        loadedHotels.push({ id: doc.id, ...doc.data() } as HotelItem);
      });
      loadedHotels.sort((a, b) => (a.order || 0) - (b.order || 0));
      setHotels(loadedHotels);

      // Load travel tips
      const tipsRef = collection(db, 'destinationTips');
      const tipsQuery = query(tipsRef, where('destinationSlug', '==', selectedDestination));
      const tipsSnapshot = await getDocs(tipsQuery);
      const loadedTips: TravelTip[] = [];
      tipsSnapshot.forEach((doc) => {
        loadedTips.push({ id: doc.id, ...doc.data() } as TravelTip);
      });
      loadedTips.sort((a, b) => (a.order || 0) - (b.order || 0));
      setTravelTips(loadedTips);

      toast.success('Destination data loaded');
    } catch (error) {
      console.error('Error loading destination data:', error);
      toast.error('Failed to load destination data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDestination = async () => {
    setSaving(true);
    try {
      const destRef = doc(db, 'destinations', selectedDestination);
      await setDoc(destRef, {
        ...destinationInfo,
        ...extendedInfo,
        slug: selectedDestination,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast.success('Destination info saved');
    } catch (error) {
      console.error('Error saving destination:', error);
      toast.error('Failed to save destination');
    } finally {
      setSaving(false);
    }
  };

  // Attraction CRUD functions
  const addAttraction = () => {
    setAttractions([
      ...attractions,
      {
        destinationSlug: selectedDestination,
        name: '',
        description: '',
        image: '',
        category: 'sightseeing',
        rating: 4.5,
        duration: '2-3 hours',
        price: 'Free',
        highlights: [],
        featured: false,
        isActive: true,
        order: attractions.length,
      },
    ]);
  };

  const updateAttraction = (index: number, field: keyof Attraction, value: any) => {
    const updated = [...attractions];
    (updated[index] as any)[field] = value;
    setAttractions(updated);
  };

  const removeAttraction = async (index: number) => {
    const attraction = attractions[index];
    if (attraction.id) {
      try {
        await deleteDoc(doc(db, 'destinationAttractions', attraction.id));
        toast.success('Attraction deleted');
      } catch (error) {
        console.error('Error deleting attraction:', error);
        toast.error('Failed to delete attraction');
        return;
      }
    }
    setAttractions(attractions.filter((_, i) => i !== index));
  };

  const handleSaveAttractions = async () => {
    setSaving(true);
    try {
      for (const attraction of attractions) {
        if (attraction.id) {
          const ref = doc(db, 'destinationAttractions', attraction.id);
          await setDoc(ref, { ...attraction, updatedAt: serverTimestamp() }, { merge: true });
        } else {
          const ref = doc(collection(db, 'destinationAttractions'));
          await setDoc(ref, { ...attraction, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        }
      }
      await loadDestinationData();
      toast.success('Attractions saved');
    } catch (error) {
      console.error('Error saving attractions:', error);
      toast.error('Failed to save attractions');
    } finally {
      setSaving(false);
    }
  };

  // Activity CRUD functions
  const addActivity = () => {
    setActivities([
      ...activities,
      {
        destinationSlug: selectedDestination,
        name: '',
        description: '',
        icon: 'Mountain',
        price: '$25-50',
        duration: '2-3 hours',
        difficulty: 'Easy',
        popular: false,
        isActive: true,
        order: activities.length,
      },
    ]);
  };

  const updateActivity = (index: number, field: keyof Activity, value: any) => {
    const updated = [...activities];
    (updated[index] as any)[field] = value;
    setActivities(updated);
  };

  const removeActivity = async (index: number) => {
    const activity = activities[index];
    if (activity.id) {
      try {
        await deleteDoc(doc(db, 'destinationActivities', activity.id));
        toast.success('Activity deleted');
      } catch (error) {
        console.error('Error deleting activity:', error);
        toast.error('Failed to delete activity');
        return;
      }
    }
    setActivities(activities.filter((_, i) => i !== index));
  };

  const handleSaveActivities = async () => {
    setSaving(true);
    try {
      for (const activity of activities) {
        if (activity.id) {
          const ref = doc(db, 'destinationActivities', activity.id);
          await setDoc(ref, { ...activity, updatedAt: serverTimestamp() }, { merge: true });
        } else {
          const ref = doc(collection(db, 'destinationActivities'));
          await setDoc(ref, { ...activity, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        }
      }
      await loadDestinationData();
      toast.success('Activities saved');
    } catch (error) {
      console.error('Error saving activities:', error);
      toast.error('Failed to save activities');
    } finally {
      setSaving(false);
    }
  };

  // Restaurant CRUD functions
  const addRestaurant = () => {
    setRestaurants([
      ...restaurants,
      {
        destinationSlug: selectedDestination,
        name: '',
        description: '',
        image: '',
        cuisine: 'Sri Lankan',
        priceRange: '$$',
        rating: 4.0,
        address: '',
        phone: '',
        website: '',
        openingHours: '8:00 AM - 10:00 PM',
        featured: false,
        isActive: true,
        order: restaurants.length,
      },
    ]);
  };

  const updateRestaurant = (index: number, field: keyof Restaurant, value: any) => {
    const updated = [...restaurants];
    (updated[index] as any)[field] = value;
    setRestaurants(updated);
  };

  const removeRestaurant = async (index: number) => {
    const restaurant = restaurants[index];
    if (restaurant.id) {
      try {
        await deleteDoc(doc(db, 'destinationRestaurants', restaurant.id));
        toast.success('Restaurant deleted');
      } catch (error) {
        console.error('Error deleting restaurant:', error);
        toast.error('Failed to delete restaurant');
        return;
      }
    }
    setRestaurants(restaurants.filter((_, i) => i !== index));
  };

  const handleSaveRestaurants = async () => {
    setSaving(true);
    try {
      for (const restaurant of restaurants) {
        if (restaurant.id) {
          const ref = doc(db, 'destinationRestaurants', restaurant.id);
          await setDoc(ref, { ...restaurant, updatedAt: serverTimestamp() }, { merge: true });
        } else {
          const ref = doc(collection(db, 'destinationRestaurants'));
          await setDoc(ref, { ...restaurant, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        }
      }
      await loadDestinationData();
      toast.success('Restaurants saved');
    } catch (error) {
      console.error('Error saving restaurants:', error);
      toast.error('Failed to save restaurants');
    } finally {
      setSaving(false);
    }
  };

  // Hotel CRUD functions
  const addHotel = () => {
    setHotels([
      ...hotels,
      {
        destinationSlug: selectedDestination,
        name: '',
        description: '',
        image: '',
        starRating: 4,
        priceRange: '$$$',
        amenities: [],
        address: '',
        phone: '',
        website: '',
        featured: false,
        isActive: true,
        order: hotels.length,
      },
    ]);
  };

  const updateHotel = (index: number, field: keyof HotelItem, value: any) => {
    const updated = [...hotels];
    (updated[index] as any)[field] = value;
    setHotels(updated);
  };

  const removeHotel = async (index: number) => {
    const hotel = hotels[index];
    if (hotel.id) {
      try {
        await deleteDoc(doc(db, 'destinationHotels', hotel.id));
        toast.success('Hotel deleted');
      } catch (error) {
        console.error('Error deleting hotel:', error);
        toast.error('Failed to delete hotel');
        return;
      }
    }
    setHotels(hotels.filter((_, i) => i !== index));
  };

  const handleSaveHotels = async () => {
    setSaving(true);
    try {
      for (const hotel of hotels) {
        if (hotel.id) {
          const ref = doc(db, 'destinationHotels', hotel.id);
          await setDoc(ref, { ...hotel, updatedAt: serverTimestamp() }, { merge: true });
        } else {
          const ref = doc(collection(db, 'destinationHotels'));
          await setDoc(ref, { ...hotel, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        }
      }
      await loadDestinationData();
      toast.success('Hotels saved');
    } catch (error) {
      console.error('Error saving hotels:', error);
      toast.error('Failed to save hotels');
    } finally {
      setSaving(false);
    }
  };

  // Travel Tip CRUD functions
  const addTravelTip = () => {
    setTravelTips([
      ...travelTips,
      {
        destinationSlug: selectedDestination,
        title: '',
        content: '',
        category: 'General',
        icon: 'Lightbulb',
        isActive: true,
        order: travelTips.length,
      },
    ]);
  };

  const updateTravelTip = (index: number, field: keyof TravelTip, value: any) => {
    const updated = [...travelTips];
    (updated[index] as any)[field] = value;
    setTravelTips(updated);
  };

  const removeTravelTip = async (index: number) => {
    const tip = travelTips[index];
    if (tip.id) {
      try {
        await deleteDoc(doc(db, 'destinationTips', tip.id));
        toast.success('Travel tip deleted');
      } catch (error) {
        console.error('Error deleting tip:', error);
        toast.error('Failed to delete tip');
        return;
      }
    }
    setTravelTips(travelTips.filter((_, i) => i !== index));
  };

  const handleSaveTravelTips = async () => {
    setSaving(true);
    try {
      for (const tip of travelTips) {
        if (tip.id) {
          const ref = doc(db, 'destinationTips', tip.id);
          await setDoc(ref, { ...tip, updatedAt: serverTimestamp() }, { merge: true });
        } else {
          const ref = doc(collection(db, 'destinationTips'));
          await setDoc(ref, { ...tip, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        }
      }
      await loadDestinationData();
      toast.success('Travel tips saved');
    } catch (error) {
      console.error('Error saving tips:', error);
      toast.error('Failed to save tips');
    } finally {
      setSaving(false);
    }
  };

  // Image upload handler for attractions/restaurants/hotels
  const handleContentImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploadingFor({ type, index });
    try {
      const fileName = `destinations/${selectedDestination}/${type}-${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      if (type === 'attraction') {
        updateAttraction(index, 'image', downloadUrl);
      } else if (type === 'restaurant') {
        updateRestaurant(index, 'image', downloadUrl);
      } else if (type === 'hotel') {
        updateHotel(index, 'image', downloadUrl);
      }

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingFor(null);
    }
  };

  // Hero Slides Functions
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const fileName = `destinations/${selectedDestination}/hero-${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      const dest = DESTINATIONS.find(d => d.slug === selectedDestination);
      const newHeroSlide: HeroSlide = {
        image: downloadUrl,
        title: newSlide.title || `Discover ${dest?.name || 'Destination'}`,
        subtitle: newSlide.subtitle || 'Experience the beauty',
        order: heroSlides.length,
        isActive: true,
      };

      const docRef = doc(collection(db, 'destinationHeroSlides'));
      await setDoc(docRef, {
        ...newHeroSlide,
        destinationSlug: selectedDestination,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setHeroSlides([...heroSlides, { ...newHeroSlide, id: docRef.id }]);
      setNewSlide({ imageUrl: '', title: '', subtitle: '' });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddSlideFromUrl = async () => {
    if (!newSlide.imageUrl) {
      toast.error('Please enter an image URL');
      return;
    }

    setSaving(true);
    try {
      const dest = DESTINATIONS.find(d => d.slug === selectedDestination);
      const newHeroSlide: HeroSlide = {
        image: newSlide.imageUrl,
        title: newSlide.title || `Discover ${dest?.name || 'Destination'}`,
        subtitle: newSlide.subtitle || 'Experience the beauty',
        order: heroSlides.length,
        isActive: true,
      };

      const docRef = doc(collection(db, 'destinationHeroSlides'));
      await setDoc(docRef, {
        ...newHeroSlide,
        destinationSlug: selectedDestination,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setHeroSlides([...heroSlides, { ...newHeroSlide, id: docRef.id }]);
      setNewSlide({ imageUrl: '', title: '', subtitle: '' });
      setShowUrlInput(false);
      toast.success('Slide added successfully');
    } catch (error) {
      console.error('Error adding slide:', error);
      toast.error('Failed to add slide');
    } finally {
      setSaving(false);
    }
  };

  const updateHeroSlide = (index: number, field: keyof HeroSlide, value: any) => {
    const updated = [...heroSlides];
    (updated[index] as any)[field] = value;
    setHeroSlides(updated);
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= heroSlides.length) return;

    const updated = [...heroSlides];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated.forEach((slide, i) => slide.order = i);
    setHeroSlides(updated);
  };

  const deleteHeroSlide = async (index: number) => {
    const slide = heroSlides[index];
    if (!slide.id) {
      setHeroSlides(heroSlides.filter((_, i) => i !== index));
      return;
    }

    try {
      await deleteDoc(doc(db, 'destinationHeroSlides', slide.id));

      // Try to delete from storage if it's a Firebase URL
      if (slide.image.includes('firebasestorage.googleapis.com')) {
        try {
          const storageRef = ref(storage, slide.image);
          await deleteObject(storageRef);
        } catch (e) {
          console.log('Could not delete storage file:', e);
        }
      }

      setHeroSlides(heroSlides.filter((_, i) => i !== index));
      toast.success('Slide deleted');
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Failed to delete slide');
    }
  };

  const saveAllHeroSlides = async () => {
    setSaving(true);
    try {
      for (const slide of heroSlides) {
        if (slide.id) {
          const slideRef = doc(db, 'destinationHeroSlides', slide.id);
          await setDoc(slideRef, {
            ...slide,
            destinationSlug: selectedDestination,
            updatedAt: serverTimestamp(),
          }, { merge: true });
        }
      }
      toast.success('All hero slides saved');
    } catch (error) {
      console.error('Error saving hero slides:', error);
      toast.error('Failed to save hero slides');
    } finally {
      setSaving(false);
    }
  };

  // Map Attraction Functions (for map markers)
  const addMapAttraction = () => {
    const dest = DESTINATIONS.find(d => d.slug === selectedDestination);
    setMapAttractions([
      ...mapAttractions,
      {
        destinationSlug: selectedDestination,
        name: '',
        description: '',
        coordinates: {
          lat: dest?.lat || 7.0,
          lng: dest?.lng || 80.0,
        },
        icon: 'MapPin',
        category: 'attraction',
        isActive: true,
      },
    ]);
  };

  const updateMapAttraction = (index: number, field: keyof MapAttraction, value: any) => {
    const updated = [...mapAttractions];
    if (field === 'coordinates') {
      updated[index].coordinates = value;
    } else {
      (updated[index] as any)[field] = value;
    }
    setMapAttractions(updated);
  };

  const removeMapAttraction = async (index: number) => {
    const attraction = mapAttractions[index];
    if (attraction.id) {
      try {
        await deleteDoc(doc(db, 'destinationMapAttractions', attraction.id));
        toast.success('Map attraction deleted');
      } catch (error) {
        console.error('Error deleting map attraction:', error);
        toast.error('Failed to delete map attraction');
        return;
      }
    }
    setMapAttractions(mapAttractions.filter((_, i) => i !== index));
  };

  const handleSaveMapAttractions = async () => {
    setSaving(true);
    try {
      for (const attraction of mapAttractions) {
        if (attraction.id) {
          const ref = doc(db, 'destinationMapAttractions', attraction.id);
          await setDoc(ref, {
            ...attraction,
            updatedAt: serverTimestamp(),
          }, { merge: true });
        } else {
          const ref = doc(collection(db, 'destinationMapAttractions'));
          await setDoc(ref, {
            ...attraction,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      }
      await loadDestinationData();
      toast.success('Map attractions saved');
    } catch (error) {
      console.error('Error saving map attractions:', error);
      toast.error('Failed to save map attractions');
    } finally {
      setSaving(false);
    }
  };

  const currentDest = DESTINATIONS.find(d => d.slug === selectedDestination);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading destination data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Globe className="w-6 h-6 text-emerald-600" />
              Destination Manager
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Manage hero images, destination info, and map attractions
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
            <Select value={selectedDestination} onValueChange={setSelectedDestination}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {DESTINATIONS.map((dest) => (
                  <SelectItem key={dest.slug} value={dest.slug}>
                    {dest.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={loadDestinationData}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-1" /> Reload
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card className="shadow-xl">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6 h-auto gap-1">
              <TabsTrigger value="hero" className="flex items-center gap-1 text-xs px-2 py-2">
                <Image className="w-3 h-3" />
                <span className="hidden sm:inline">Hero</span>
              </TabsTrigger>
              <TabsTrigger value="info" className="flex items-center gap-1 text-xs px-2 py-2">
                <Info className="w-3 h-3" />
                <span className="hidden sm:inline">Info</span>
              </TabsTrigger>
              <TabsTrigger value="places" className="flex items-center gap-1 text-xs px-2 py-2">
                <Camera className="w-3 h-3" />
                <span className="hidden sm:inline">Attractions</span>
              </TabsTrigger>
              <TabsTrigger value="activities" className="flex items-center gap-1 text-xs px-2 py-2">
                <Mountain className="w-3 h-3" />
                <span className="hidden sm:inline">Activities</span>
              </TabsTrigger>
              <TabsTrigger value="restaurants" className="flex items-center gap-1 text-xs px-2 py-2">
                <Utensils className="w-3 h-3" />
                <span className="hidden sm:inline">Food</span>
              </TabsTrigger>
              <TabsTrigger value="hotels" className="flex items-center gap-1 text-xs px-2 py-2">
                <Hotel className="w-3 h-3" />
                <span className="hidden sm:inline">Hotels</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-1 text-xs px-2 py-2">
                <Lightbulb className="w-3 h-3" />
                <span className="hidden sm:inline">Tips</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-1 text-xs px-2 py-2">
                <Map className="w-3 h-3" />
                <span className="hidden sm:inline">Map</span>
              </TabsTrigger>
            </TabsList>

            {/* Hero Images Tab */}
            <TabsContent value="hero" className="space-y-6">
              {/* Add New Slide */}
              <Card className="border-2 border-dashed border-emerald-300 bg-emerald-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-600" />
                    Add New Hero Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title (optional)</Label>
                      <Input
                        value={newSlide.title}
                        onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                        placeholder={`e.g., Discover ${currentDest?.name || 'Destination'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle (optional)</Label>
                      <Input
                        value={newSlide.subtitle}
                        onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                        placeholder="e.g., Experience the beauty"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Add from URL
                    </Button>
                  </div>

                  {showUrlInput && (
                    <div className="flex gap-2 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          value={newSlide.imageUrl}
                          onChange={(e) => setNewSlide({ ...newSlide, imageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      <Button onClick={handleAddSlideFromUrl} disabled={saving}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setShowUrlInput(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Current Slides */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-gray-700">
                    Hero Slides ({heroSlides.length})
                  </span>
                </div>
                <Button
                  onClick={saveAllHeroSlides}
                  disabled={saving || heroSlides.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save All Changes'}
                </Button>
              </div>

              {heroSlides.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Hero Images Yet</h3>
                    <p className="text-gray-500 mb-4">
                      Upload images or add from URL to create a hero slideshow for {currentDest?.name}
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {heroSlides.map((slide, index) => (
                  <Card key={slide.id || index} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=Image+Not+Found';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <p className="font-semibold text-sm truncate">{slide.title}</p>
                        <p className="text-xs text-white/80 truncate">{slide.subtitle}</p>
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge className={slide.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                          {slide.isActive ? 'Active' : 'Hidden'}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          onClick={() => moveSlide(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          onClick={() => moveSlide(index, 'down')}
                          disabled={index === heroSlides.length - 1}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={() => deleteHeroSlide(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3 space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Title</Label>
                        <Input
                          value={slide.title}
                          onChange={(e) => updateHeroSlide(index, 'title', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Subtitle</Label>
                        <Input
                          value={slide.subtitle}
                          onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={slide.isActive}
                            onCheckedChange={(checked) => updateHeroSlide(index, 'isActive', checked)}
                          />
                          <Label className="text-xs">Show slide</Label>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Tips */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="py-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Tips for Hero Images</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>- Recommended size: 1920x1080 pixels (16:9 aspect ratio)</li>
                    <li>- Use high-quality images that represent the destination well</li>
                    <li>- Keep 5 slides for optimal user experience</li>
                    <li>- Use arrows to reorder slides or toggle visibility</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Destination Info Tab */}
            <TabsContent value="info" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Destination Name</Label>
                  <Input
                    value={destinationInfo.name}
                    onChange={(e) => setDestinationInfo({ ...destinationInfo, name: e.target.value })}
                    placeholder="e.g., Kandy"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input
                    value={destinationInfo.tagline}
                    onChange={(e) => setDestinationInfo({ ...destinationInfo, tagline: e.target.value })}
                    placeholder="e.g., Cultural Capital of Sri Lanka"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={4}
                  value={destinationInfo.description}
                  onChange={(e) => setDestinationInfo({ ...destinationInfo, description: e.target.value })}
                  placeholder="A brief description of the destination..."
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={destinationInfo.isPublished}
                    onCheckedChange={(checked) => setDestinationInfo({ ...destinationInfo, isPublished: checked })}
                  />
                  <Label>Published</Label>
                </div>
                <Button
                  onClick={handleSaveDestination}
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Destination Info'}
                </Button>
              </div>

              {/* Quick Info */}
              {currentDest && (
                <Card className="mt-6 bg-gray-50">
                  <CardContent className="pt-4">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Navigation className="w-4 h-4" />
                      Default Coordinates
                    </h4>
                    <p className="text-sm text-gray-600">
                      Latitude: {currentDest.lat} | Longitude: {currentDest.lng}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      These are the default center coordinates for the map.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Attractions (Places to Visit) Tab */}
            <TabsContent value="places" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-gray-700">
                    Places to Visit ({attractions.length})
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={addAttraction}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Place
                  </Button>
                  <Button size="sm" onClick={handleSaveAttractions} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="w-4 h-4 mr-1" />
                    {saving ? 'Saving...' : 'Save All'}
                  </Button>
                </div>
              </div>

              {attractions.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No attractions yet. Add places visitors should explore.</p>
                    <Button className="mt-4" variant="outline" onClick={addAttraction}>
                      <Plus className="w-4 h-4 mr-1" /> Add First Place
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {attractions.map((attraction, index) => (
                    <Card key={index} className="border hover:border-emerald-300 transition-colors">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-emerald-50">#{index + 1}</Badge>
                          <CardTitle className="text-sm font-semibold">{attraction.name || 'New Place'}</CardTitle>
                          {attraction.featured && <Badge className="bg-yellow-500 text-white text-xs">Featured</Badge>}
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => removeAttraction(index)} className="hover:bg-red-50">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input value={attraction.name} onChange={(e) => updateAttraction(index, 'name', e.target.value)} placeholder="e.g., Sigiriya Rock Fortress" />
                          </div>
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Input value={attraction.category} onChange={(e) => updateAttraction(index, 'category', e.target.value)} placeholder="e.g., Historical, Nature" />
                          </div>
                          <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input value={attraction.duration} onChange={(e) => updateAttraction(index, 'duration', e.target.value)} placeholder="e.g., 2-3 hours" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea rows={2} value={attraction.description} onChange={(e) => updateAttraction(index, 'description', e.target.value)} placeholder="Describe this attraction..." />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Price</Label>
                            <Input value={attraction.price} onChange={(e) => updateAttraction(index, 'price', e.target.value)} placeholder="e.g., $30 or Free" />
                          </div>
                          <div className="space-y-2">
                            <Label>Rating (0-5)</Label>
                            <Input type="number" min="0" max="5" step="0.1" value={attraction.rating} onChange={(e) => updateAttraction(index, 'rating', parseFloat(e.target.value) || 0)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Highlights (comma-separated)</Label>
                            <Input value={attraction.highlights?.join(', ') || ''} onChange={(e) => updateAttraction(index, 'highlights', e.target.value.split(',').map(h => h.trim()).filter(h => h))} placeholder="e.g., Frescoes, Panoramic Views" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Image</Label>
                          <div className="flex gap-2 items-center">
                            {attraction.image && <img src={attraction.image} alt={attraction.name} className="w-20 h-14 object-cover rounded" />}
                            <Input value={attraction.image} onChange={(e) => updateAttraction(index, 'image', e.target.value)} placeholder="Image URL" className="flex-1" />
                            <input type="file" accept="image/*" className="hidden" id={`attraction-img-${index}`} onChange={(e) => handleContentImageUpload(e, 'attraction', index)} />
                            <Button variant="outline" size="sm" onClick={() => document.getElementById(`attraction-img-${index}`)?.click()} disabled={uploadingFor?.type === 'attraction' && uploadingFor?.index === index}>
                              <Upload className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <Switch checked={attraction.featured} onCheckedChange={(checked) => updateAttraction(index, 'featured', checked)} />
                            <Label className="text-sm">Featured</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={attraction.isActive} onCheckedChange={(checked) => updateAttraction(index, 'isActive', checked)} />
                            <Label className="text-sm">Active</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mountain className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-gray-700">Activities ({activities.length})</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={addActivity}>
                    <Plus className="w-4 h-4 mr-1" /> Add Activity
                  </Button>
                  <Button size="sm" onClick={handleSaveActivities} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save All'}
                  </Button>
                </div>
              </div>

              {activities.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center">
                    <Mountain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No activities yet. Add things visitors can do here.</p>
                    <Button className="mt-4" variant="outline" onClick={addActivity}>
                      <Plus className="w-4 h-4 mr-1" /> Add First Activity
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {activities.map((activity, index) => (
                    <Card key={index} className="border hover:border-emerald-300">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <CardTitle className="text-sm">{activity.name || 'New Activity'}</CardTitle>
                          {activity.popular && <Badge className="bg-orange-500 text-white text-xs">Popular</Badge>}
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => removeActivity(index)} className="hover:bg-red-50">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Input value={activity.name} onChange={(e) => updateActivity(index, 'name', e.target.value)} placeholder="Activity name" />
                        <Textarea rows={2} value={activity.description} onChange={(e) => updateActivity(index, 'description', e.target.value)} placeholder="Description..." />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Icon</Label>
                            <Select value={activity.icon} onValueChange={(v) => updateActivity(index, 'icon', v)}>
                              <SelectTrigger><SelectValue placeholder="Icon" /></SelectTrigger>
                              <SelectContent>
                                {ACTIVITY_ICONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Difficulty</Label>
                            <Select value={activity.difficulty} onValueChange={(v) => updateActivity(index, 'difficulty', v)}>
                              <SelectTrigger><SelectValue placeholder="Difficulty" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Moderate">Moderate</SelectItem>
                                <SelectItem value="Challenging">Challenging</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Input value={activity.duration} onChange={(e) => updateActivity(index, 'duration', e.target.value)} placeholder="Duration (e.g., 2 hours)" />
                          <Input value={activity.price} onChange={(e) => updateActivity(index, 'price', e.target.value)} placeholder="Price (e.g., $25-50)" />
                        </div>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <Switch checked={activity.popular} onCheckedChange={(c) => updateActivity(index, 'popular', c)} />
                            <Label className="text-xs">Popular</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={activity.isActive} onCheckedChange={(c) => updateActivity(index, 'isActive', c)} />
                            <Label className="text-xs">Active</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Restaurants Tab */}
            <TabsContent value="restaurants" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-gray-700">Restaurants ({restaurants.length})</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={addRestaurant}>
                    <Plus className="w-4 h-4 mr-1" /> Add Restaurant
                  </Button>
                  <Button size="sm" onClick={handleSaveRestaurants} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save All'}
                  </Button>
                </div>
              </div>

              {restaurants.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center">
                    <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No restaurants yet. Add dining options for visitors.</p>
                    <Button className="mt-4" variant="outline" onClick={addRestaurant}>
                      <Plus className="w-4 h-4 mr-1" /> Add First Restaurant
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {restaurants.map((restaurant, index) => (
                    <Card key={index} className="border hover:border-emerald-300">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <CardTitle className="text-sm">{restaurant.name || 'New Restaurant'}</CardTitle>
                          {restaurant.featured && <Badge className="bg-yellow-500 text-white text-xs">Featured</Badge>}
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => removeRestaurant(index)} className="hover:bg-red-50">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid md:grid-cols-3 gap-3">
                          <Input value={restaurant.name} onChange={(e) => updateRestaurant(index, 'name', e.target.value)} placeholder="Restaurant name" />
                          <Input value={restaurant.cuisine} onChange={(e) => updateRestaurant(index, 'cuisine', e.target.value)} placeholder="Cuisine (e.g., Sri Lankan)" />
                          <Select value={restaurant.priceRange} onValueChange={(v) => updateRestaurant(index, 'priceRange', v)}>
                            <SelectTrigger><SelectValue placeholder="Price range" /></SelectTrigger>
                            <SelectContent>
                              {PRICE_RANGES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea rows={2} value={restaurant.description} onChange={(e) => updateRestaurant(index, 'description', e.target.value)} placeholder="Description..." />
                        <div className="grid md:grid-cols-3 gap-3">
                          <Input value={restaurant.address} onChange={(e) => updateRestaurant(index, 'address', e.target.value)} placeholder="Address" />
                          <Input value={restaurant.phone} onChange={(e) => updateRestaurant(index, 'phone', e.target.value)} placeholder="Phone" />
                          <div className="flex items-center gap-2">
                            <Label className="text-xs">Rating:</Label>
                            <Input type="number" min="0" max="5" step="0.1" value={restaurant.rating} onChange={(e) => updateRestaurant(index, 'rating', parseFloat(e.target.value) || 0)} className="w-20" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Image</Label>
                          <div className="flex gap-2 items-center">
                            {restaurant.image && <img src={restaurant.image} alt={restaurant.name} className="w-16 h-12 object-cover rounded" />}
                            <Input value={restaurant.image} onChange={(e) => updateRestaurant(index, 'image', e.target.value)} placeholder="Image URL" className="flex-1" />
                            <input type="file" accept="image/*" className="hidden" id={`restaurant-img-${index}`} onChange={(e) => handleContentImageUpload(e, 'restaurant', index)} />
                            <Button variant="outline" size="sm" onClick={() => document.getElementById(`restaurant-img-${index}`)?.click()}>
                              <Upload className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <Switch checked={restaurant.featured} onCheckedChange={(c) => updateRestaurant(index, 'featured', c)} />
                            <Label className="text-xs">Featured</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={restaurant.isActive} onCheckedChange={(c) => updateRestaurant(index, 'isActive', c)} />
                            <Label className="text-xs">Active</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Hotels Tab */}
            <TabsContent value="hotels" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-gray-700">Hotels & Lodging ({hotels.length})</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={addHotel}>
                    <Plus className="w-4 h-4 mr-1" /> Add Hotel
                  </Button>
                  <Button size="sm" onClick={handleSaveHotels} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save All'}
                  </Button>
                </div>
              </div>

              {hotels.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center">
                    <Hotel className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No hotels yet. Add accommodation options.</p>
                    <Button className="mt-4" variant="outline" onClick={addHotel}>
                      <Plus className="w-4 h-4 mr-1" /> Add First Hotel
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {hotels.map((hotel, index) => (
                    <Card key={index} className="border hover:border-emerald-300">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <CardTitle className="text-sm">{hotel.name || 'New Hotel'}</CardTitle>
                          <div className="flex">
                            {[...Array(hotel.starRating || 0)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}
                          </div>
                          {hotel.featured && <Badge className="bg-yellow-500 text-white text-xs">Featured</Badge>}
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => removeHotel(index)} className="hover:bg-red-50">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid md:grid-cols-3 gap-3">
                          <Input value={hotel.name} onChange={(e) => updateHotel(index, 'name', e.target.value)} placeholder="Hotel name" />
                          <Select value={String(hotel.starRating)} onValueChange={(v) => updateHotel(index, 'starRating', parseInt(v))}>
                            <SelectTrigger><SelectValue placeholder="Stars" /></SelectTrigger>
                            <SelectContent>
                              {[1,2,3,4,5].map(s => <SelectItem key={s} value={String(s)}>{s} Star{s > 1 ? 's' : ''}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <Select value={hotel.priceRange} onValueChange={(v) => updateHotel(index, 'priceRange', v)}>
                            <SelectTrigger><SelectValue placeholder="Price range" /></SelectTrigger>
                            <SelectContent>
                              {PRICE_RANGES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea rows={2} value={hotel.description} onChange={(e) => updateHotel(index, 'description', e.target.value)} placeholder="Description..." />
                        <div className="grid md:grid-cols-2 gap-3">
                          <Input value={hotel.address} onChange={(e) => updateHotel(index, 'address', e.target.value)} placeholder="Address" />
                          <Input value={hotel.phone} onChange={(e) => updateHotel(index, 'phone', e.target.value)} placeholder="Phone" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Amenities (comma-separated)</Label>
                          <Input value={hotel.amenities?.join(', ') || ''} onChange={(e) => updateHotel(index, 'amenities', e.target.value.split(',').map(a => a.trim()).filter(a => a))} placeholder="e.g., Pool, WiFi, Spa, Restaurant" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Image</Label>
                          <div className="flex gap-2 items-center">
                            {hotel.image && <img src={hotel.image} alt={hotel.name} className="w-16 h-12 object-cover rounded" />}
                            <Input value={hotel.image} onChange={(e) => updateHotel(index, 'image', e.target.value)} placeholder="Image URL" className="flex-1" />
                            <input type="file" accept="image/*" className="hidden" id={`hotel-img-${index}`} onChange={(e) => handleContentImageUpload(e, 'hotel', index)} />
                            <Button variant="outline" size="sm" onClick={() => document.getElementById(`hotel-img-${index}`)?.click()}>
                              <Upload className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <Switch checked={hotel.featured} onCheckedChange={(c) => updateHotel(index, 'featured', c)} />
                            <Label className="text-xs">Featured</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={hotel.isActive} onCheckedChange={(c) => updateHotel(index, 'isActive', c)} />
                            <Label className="text-xs">Active</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Travel Tips & Extended Info Tab */}
            <TabsContent value="tips" className="space-y-6">
              {/* Extended Info Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="w-5 h-5 text-emerald-600" />
                    Extended Destination Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Population</Label>
                      <Input value={extendedInfo.population} onChange={(e) => setExtendedInfo({...extendedInfo, population: e.target.value})} placeholder="e.g., 125,000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Area</Label>
                      <Input value={extendedInfo.area} onChange={(e) => setExtendedInfo({...extendedInfo, area: e.target.value})} placeholder="e.g., 28.5 sq km" />
                    </div>
                    <div className="space-y-2">
                      <Label>Elevation</Label>
                      <Input value={extendedInfo.elevation} onChange={(e) => setExtendedInfo({...extendedInfo, elevation: e.target.value})} placeholder="e.g., 500m above sea level" />
                    </div>
                    <div className="space-y-2">
                      <Label>Best Time to Visit</Label>
                      <Input value={extendedInfo.bestTime} onChange={(e) => setExtendedInfo({...extendedInfo, bestTime: e.target.value})} placeholder="e.g., December to April" />
                    </div>
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Input value={extendedInfo.language} onChange={(e) => setExtendedInfo({...extendedInfo, language: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Input value={extendedInfo.currency} onChange={(e) => setExtendedInfo({...extendedInfo, currency: e.target.value})} />
                    </div>
                  </div>
                  <Card className="bg-gray-50">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Weather Info</CardTitle></CardHeader>
                    <CardContent className="grid md:grid-cols-4 gap-3">
                      <Input value={extendedInfo.weather.temperature} onChange={(e) => setExtendedInfo({...extendedInfo, weather: {...extendedInfo.weather, temperature: e.target.value}})} placeholder="Temperature (e.g., 25-30°C)" />
                      <Input value={extendedInfo.weather.humidity} onChange={(e) => setExtendedInfo({...extendedInfo, weather: {...extendedInfo.weather, humidity: e.target.value}})} placeholder="Humidity (e.g., 70-80%)" />
                      <Input value={extendedInfo.weather.rainfall} onChange={(e) => setExtendedInfo({...extendedInfo, weather: {...extendedInfo.weather, rainfall: e.target.value}})} placeholder="Rainfall (e.g., 150mm)" />
                      <Input value={extendedInfo.weather.season} onChange={(e) => setExtendedInfo({...extendedInfo, weather: {...extendedInfo.weather, season: e.target.value}})} placeholder="Current Season" />
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-50">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">SEO Settings</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <Input value={extendedInfo.seo.title} onChange={(e) => setExtendedInfo({...extendedInfo, seo: {...extendedInfo.seo, title: e.target.value}})} placeholder="SEO Title" />
                      <Textarea rows={2} value={extendedInfo.seo.description} onChange={(e) => setExtendedInfo({...extendedInfo, seo: {...extendedInfo.seo, description: e.target.value}})} placeholder="SEO Description (meta description)" />
                      <Input value={extendedInfo.seo.keywords?.join(', ') || ''} onChange={(e) => setExtendedInfo({...extendedInfo, seo: {...extendedInfo.seo, keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)}})} placeholder="Keywords (comma-separated)" />
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-50">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">CTA Section</CardTitle></CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-3">
                      <Input value={extendedInfo.cta.title} onChange={(e) => setExtendedInfo({...extendedInfo, cta: {...extendedInfo.cta, title: e.target.value}})} placeholder="CTA Title" />
                      <Input value={extendedInfo.cta.subtitle} onChange={(e) => setExtendedInfo({...extendedInfo, cta: {...extendedInfo.cta, subtitle: e.target.value}})} placeholder="CTA Subtitle" />
                      <Input value={extendedInfo.cta.buttonText} onChange={(e) => setExtendedInfo({...extendedInfo, cta: {...extendedInfo.cta, buttonText: e.target.value}})} placeholder="Button Text" />
                    </CardContent>
                  </Card>
                  <Button onClick={handleSaveDestination} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Extended Info'}
                  </Button>
                </CardContent>
              </Card>

              {/* Travel Tips Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-emerald-600" />
                    Travel Tips ({travelTips.length})
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={addTravelTip}>
                      <Plus className="w-4 h-4 mr-1" /> Add Tip
                    </Button>
                    <Button size="sm" onClick={handleSaveTravelTips} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save Tips'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {travelTips.length === 0 ? (
                    <div className="text-center py-6">
                      <Lightbulb className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No travel tips yet. Add helpful tips for visitors.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {travelTips.map((tip, index) => (
                        <Card key={index} className="border">
                          <CardContent className="pt-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="grid grid-cols-2 gap-2 flex-1 mr-2">
                                <Input value={tip.title} onChange={(e) => updateTravelTip(index, 'title', e.target.value)} placeholder="Tip title" />
                                <Select value={tip.category} onValueChange={(v) => updateTravelTip(index, 'category', v)}>
                                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                                  <SelectContent>
                                    {TIP_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button size="icon" variant="ghost" onClick={() => removeTravelTip(index)} className="hover:bg-red-50">
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                            <Textarea rows={2} value={tip.content} onChange={(e) => updateTravelTip(index, 'content', e.target.value)} placeholder="Tip content..." />
                            <div className="flex items-center gap-2">
                              <Switch checked={tip.isActive} onCheckedChange={(c) => updateTravelTip(index, 'isActive', c)} />
                              <Label className="text-xs">Active</Label>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Map Attractions Tab */}
            <TabsContent value="map" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-gray-700">Map Markers ({mapAttractions.length})</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={addMapAttraction}>
                    <Plus className="w-4 h-4 mr-1" /> Add Marker
                  </Button>
                  <Button size="sm" onClick={handleSaveMapAttractions} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save All'}
                  </Button>
                </div>
              </div>

              {mapAttractions.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center">
                    <Map className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No map markers yet. Add points of interest to show on the destination map.</p>
                    <Button className="mt-4" variant="outline" onClick={addMapAttraction}>
                      <Plus className="w-4 h-4 mr-1" /> Add First Marker
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {mapAttractions.map((attraction, index) => (
                    <Card key={index} className="border border-dashed hover:border-emerald-300 transition-colors">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-emerald-50">#{index + 1}</Badge>
                          <CardTitle className="text-sm font-semibold">{attraction.name || 'New Marker'}</CardTitle>
                          {attraction.isActive && <Badge className="bg-green-500 text-white text-xs">Active</Badge>}
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => removeMapAttraction(index)} className="hover:bg-red-50">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </CardHeader>
                      <CardContent className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name *</Label>
                          <Input value={attraction.name} onChange={(e) => updateMapAttraction(index, 'name', e.target.value)} placeholder="e.g., Temple of the Tooth" />
                        </div>
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Input value={attraction.category} onChange={(e) => updateMapAttraction(index, 'category', e.target.value)} placeholder="e.g., temple, nature, beach" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Description</Label>
                          <Textarea rows={2} value={attraction.description} onChange={(e) => updateMapAttraction(index, 'description', e.target.value)} placeholder="Brief description..." />
                        </div>
                        <div className="space-y-2">
                          <Label>Latitude *</Label>
                          <Input type="number" step="0.0001" value={attraction.coordinates.lat} onChange={(e) => updateMapAttraction(index, 'coordinates', {...attraction.coordinates, lat: parseFloat(e.target.value) || 0})} />
                        </div>
                        <div className="space-y-2">
                          <Label>Longitude *</Label>
                          <Input type="number" step="0.0001" value={attraction.coordinates.lng} onChange={(e) => updateMapAttraction(index, 'coordinates', {...attraction.coordinates, lng: parseFloat(e.target.value) || 0})} />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Select value={attraction.icon} onValueChange={(value) => updateMapAttraction(index, 'icon', value)}>
                            <SelectTrigger><SelectValue placeholder="Select icon" /></SelectTrigger>
                            <SelectContent>
                              {ICON_OPTIONS.map((option) => {
                                const IconComponent = option.icon;
                                return (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center gap-2">
                                      <IconComponent className="w-4 h-4" />
                                      {option.label}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 flex items-end">
                          <div className="flex items-center gap-2">
                            <Switch checked={attraction.isActive} onCheckedChange={(checked) => updateMapAttraction(index, 'isActive', checked)} />
                            <Label className="text-sm">Show on map</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="py-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Tips for Map Markers</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>- Use Google Maps to find exact coordinates (right-click and select "What's here?")</li>
                    <li>- Categories help group similar places (e.g., "temple", "nature", "beach")</li>
                    <li>- Keep descriptions concise - they appear as tooltips on the map</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DestinationsSection;
