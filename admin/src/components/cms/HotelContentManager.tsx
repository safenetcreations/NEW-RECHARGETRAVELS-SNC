import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Eye, Upload, Star, MapPin, Phone, Globe } from 'lucide-react';
import { ImageUploadSection, type ImageData } from './ImageUploadSection';
import { getDocs, collection, query, where, orderBy, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebaseService';

interface Hotel {
  id: string;
  name: string;
  description: string;
  star_rating: number;
  hotel_type: string;
  base_price_per_night: number;
  country: string;
  address: string;
  phone: string;
  amenities: string[];
  is_active: boolean;
  images: ImageData[];
}

export const HotelContentManager = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    star_rating: 3,
    hotel_type: 'budget',
    base_price_per_night: 0,
    address: '',
    phone: '',
    amenities: [] as string[],
  });

  const hotelTypes = [
    { value: 'budget', label: 'Budget' },
    { value: 'mid-range', label: 'Mid-Range' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'boutique', label: 'Boutique' },
    { value: 'resort', label: 'Resort' }
  ];

  const commonAmenities = [
    'WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Room Service',
    'Airport Shuttle', 'Parking', 'Air Conditioning', 'Beach Access',
    'Conference Rooms', 'Laundry Service', 'Concierge', 'Breakfast'
  ];

  const fetchHotels = useCallback(async () => {
    try {
      const q = query(
        collection(db, 'hotels'),
        where('country', '==', 'Sri Lanka'),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      const hotelsData = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Hotel[];
      
      // Fetch images for each hotel
      const hotelsWithImages = await Promise.all(
        hotelsData.map(async (hotel) => {
          try {
            const imagesQuery = query(
              collection(db, 'hotel_images'),
              where('hotel_id', '==', hotel.id)
            );
            const imagesSnapshot = await getDocs(imagesQuery);
            const images = imagesSnapshot.docs.map(imgDoc => ({ id: imgDoc.id, ...imgDoc.data() }));
            return { ...hotel, images };
          } catch (error) {
            console.error(`Error fetching images for hotel ${hotel.id}:`, error);
            return { ...hotel, images: [] };
          }
        })
      );
      
      setHotels(hotelsWithImages);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hotels",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleSave = async () => {
    try {
      const hotelData = {
        ...formData,
        country: 'Sri Lanka',
        is_active: true
      };

      if (isCreating) {
        await addDoc(collection(db, 'hotels'), hotelData);

        toast({
          title: "Success",
          description: "Hotel created successfully"
        });
      } else if (selectedHotel) {
        await updateDoc(doc(db, 'hotels', selectedHotel.id), hotelData);

        toast({
          title: "Success",
          description: "Hotel updated successfully"
        });
      }

      fetchHotels();
      resetForm();
    } catch (error) {
      console.error('Error saving hotel:', error);
      toast({
        title: "Error",
        description: "Failed to save hotel",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      star_rating: 3,
      hotel_type: 'budget',
      base_price_per_night: 0,
      address: '',
      phone: '',
      amenities: [],
    });
    setSelectedHotel(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const startEdit = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setFormData({
      name: hotel.name,
      description: hotel.description || '',
      star_rating: hotel.star_rating,
      hotel_type: hotel.hotel_type,
      base_price_per_night: hotel.base_price_per_night || 0,
      address: hotel.address || '',
      phone: hotel.phone || '',
      amenities: hotel.amenities || [],
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  const startCreate = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(true);
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading hotels...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Hotel Management</h2>
          <p className="text-muted-foreground">Manage hotels, photos, and descriptions</p>
        </div>
        <Button onClick={startCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Hotel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotel List */}
        <Card>
          <CardHeader>
            <CardTitle>Hotels ({hotels.length})</CardTitle>
            <CardDescription>All Sri Lankan hotels in your system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="border rounded-lg p-4 hover:bg-accent/5 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{hotel.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      {hotel.star_rating} stars
                      <Badge variant="secondary">{hotel.hotel_type}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => startEdit(hotel)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {hotel.address || 'No address'}
                  </span>
                  <span>{hotel.images?.length || 0} photos</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Hotel Editor */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>
                {isCreating ? 'Create New Hotel' : `Edit ${selectedHotel?.name}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="name">Hotel Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter hotel name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the hotel..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="star_rating">Star Rating</Label>
                  <Select
                    value={formData.star_rating.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, star_rating: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(star => (
                        <SelectItem key={star} value={star.toString()}>
                          {star} Star{star > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotel_type">Hotel Type</Label>
                  <Select
                    value={formData.hotel_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, hotel_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hotelTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Hotel address in Sri Lanka"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+94..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Base Price (USD/night)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.base_price_per_night}
                    onChange={(e) => setFormData(prev => ({ ...prev, base_price_per_night: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {commonAmenities.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  {isCreating ? 'Create Hotel' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Management for Selected Hotel */}
        {selectedHotel && !isCreating && (
          <div className="lg:col-span-2">
            <ImageUploadSection 
              entityType="hotel"
              entityId={selectedHotel.id}
              entityName={selectedHotel.name}
            />
          </div>
        )}
      </div>
    </div>
  );
};