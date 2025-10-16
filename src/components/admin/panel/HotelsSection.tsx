
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, Filter, MapPin, Star, Users, Wifi, Car, Coffee, Dumbbell, Building } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  location: string;
  address: string;
  description: string;
  price_per_night: number;
  star_rating: number;
  user_rating: number;
  max_guests: number;
  amenities: string[];
  images: string[];
  is_active: boolean;
  created_at: string;
}

const HotelsSection: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    description: '',
    price_per_night: 0,
    star_rating: 3,
    max_guests: 2,
    amenities: [] as string[],
    is_active: true
  });

  const locations = ['all', 'Colombo', 'Kandy', 'Galle', 'Sigiriya', 'Yala', 'Nuwara Eliya', 'Trincomalee'];
  const amenitiesList = ['WiFi', 'Parking', 'Restaurant', 'Gym', 'Pool', 'Spa', 'Bar', 'Room Service'];

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const hotelsCollection = collection(db, 'hotels');
      const q = query(hotelsCollection, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Hotel[];
      setHotels(data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast.error('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHotel = async () => {
    try {
      await addDoc(collection(db, 'hotels'), {
        ...formData,
        user_rating: 0,
        images: [],
        created_at: new Date().toISOString(),
      });
      toast.success('Hotel created successfully');
      fetchHotels();
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error creating hotel:', error);
      toast.error('Failed to create hotel');
    }
  };

  const handleUpdateHotel = async () => {
    if (!editingHotel) return;
    
    try {
      const hotelDoc = doc(db, 'hotels', editingHotel.id);
      await updateDoc(hotelDoc, formData);
      toast.success('Hotel updated successfully');
      fetchHotels();
      setShowEditDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error updating hotel:', error);
      toast.error('Failed to update hotel');
    }
  };

  const handleDeleteHotel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hotel?')) return;
    
    try {
      const hotelDoc = doc(db, 'hotels', id);
      await deleteDoc(hotelDoc);
      toast.success('Hotel deleted successfully');
      fetchHotels();
    } catch (error) {
      console.error('Error deleting hotel:', error);
      toast.error('Failed to delete hotel');
    }
  };

  const toggleHotelStatus = async (id: string, currentStatus: boolean) => {
    try {
      const hotelDoc = doc(db, 'hotels', id);
      await updateDoc(hotelDoc, { is_active: !currentStatus });
      toast.success(`Hotel ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchHotels();
    } catch (error) {
      console.error('Error updating hotel status:', error);
      toast.error('Failed to update hotel status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      address: '',
      description: '',
      price_per_night: 0,
      star_rating: 3,
      max_guests: 2,
      amenities: [],
      is_active: true
    });
    setEditingHotel(null);
  };

  const openEditDialog = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      location: hotel.location,
      address: hotel.address || '',
      description: hotel.description || '',
      price_per_night: hotel.price_per_night || 0,
      star_rating: hotel.star_rating || 3,
      max_guests: hotel.max_guests || 2,
      amenities: hotel.amenities || [],
      is_active: hotel.is_active
    });
    setShowEditDialog(true);
  };

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || hotel.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hotels & Lodges Management</h2>
          <p className="text-gray-600">Manage hotel listings and availability</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Hotel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Hotel</DialogTitle>
              <DialogDescription>
                Create a new hotel listing with all the necessary information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Hotel Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter hotel name"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <select
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select location</option>
                    {locations.slice(1).map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Enter full address"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter hotel description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price per Night ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    value={formData.price_per_night}
                    onChange={(e) => setFormData({...formData, price_per_night: Number(e.target.value)})}
                    placeholder="100"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Star Rating</Label>
                  <select
                    id="rating"
                    value={formData.star_rating}
                    onChange={(e) => setFormData({...formData, star_rating: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} Stars</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="guests">Max Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    value={formData.max_guests}
                    onChange={(e) => setFormData({...formData, max_guests: Number(e.target.value)})}
                    placeholder="2"
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Amenities</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {amenitiesList.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, amenities: [...formData.amenities, amenity]});
                          } else {
                            setFormData({...formData, amenities: formData.amenities.filter(a => a !== amenity)});
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {setShowCreateDialog(false); resetForm();}}>Cancel</Button>
              <Button onClick={handleCreateHotel} className="bg-orange-600 hover:bg-orange-700">Create Hotel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Building className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Hotels</p>
                <p className="text-2xl font-bold text-gray-900">{hotels.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Hotels</p>
                <p className="text-2xl font-bold text-gray-900">
                  {hotels.filter(h => h.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(hotels.reduce((sum, h) => sum + (h.user_rating || 0), 0) / hotels.length || 0).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {hotels.reduce((sum, h) => sum + (h.max_guests || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search hotels..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location === 'all' ? 'All Locations' : location}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <Card key={hotel.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold line-clamp-1">
                    {hotel.name}
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {hotel.location}
                  </div>
                </div>
                <Badge variant={hotel.is_active ? "default" : "secondary"}>
                  {hotel.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {hotel.description || 'No description available'}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price per night</span>
                  <span className="font-semibold">${hotel.price_per_night || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Star Rating</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (hotel.star_rating || 3) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Max Guests</span>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {hotel.max_guests || 2}
                  </div>
                </div>
              </div>

              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {hotel.amenities.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {hotel.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{hotel.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleHotelStatus(hotel.id, hotel.is_active)}
                  className="flex-1"
                >
                  {hotel.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(hotel)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteHotel(hotel.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No hotels found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Hotel</DialogTitle>
            <DialogDescription>
              Update hotel information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Hotel Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter hotel name"
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <select
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select location</option>
                  {locations.slice(1).map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter full address"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter hotel description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-price">Price per Night ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price_per_night}
                  onChange={(e) => setFormData({...formData, price_per_night: Number(e.target.value)})}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="edit-rating">Star Rating</Label>
                <select
                  id="edit-rating"
                  value={formData.star_rating}
                  onChange={(e) => setFormData({...formData, star_rating: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {[1, 2, 3, 4, 5].map(rating => (
                    <option key={rating} value={rating}>{rating} Stars</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit-guests">Max Guests</Label>
                <Input
                  id="edit-guests"
                  type="number"
                  value={formData.max_guests}
                  onChange={(e) => setFormData({...formData, max_guests: Number(e.target.value)})}
                  placeholder="2"
                />
              </div>
            </div>
            <div>
              <Label>Amenities</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, amenities: [...formData.amenities, amenity]});
                        } else {
                          setFormData({...formData, amenities: formData.amenities.filter(a => a !== amenity)});
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-active"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-active" className="text-sm font-normal">Hotel is active and accepting bookings</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowEditDialog(false); resetForm();}}>Cancel</Button>
            <Button onClick={handleUpdateHotel} className="bg-orange-600 hover:bg-orange-700">Update Hotel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HotelsSection;
