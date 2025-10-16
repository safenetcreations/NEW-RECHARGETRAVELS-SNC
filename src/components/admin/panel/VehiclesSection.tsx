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
import { Plus, Edit, Trash2, Search, Car, Users, Fuel, Calendar, DollarSign, MapPin } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  type: string;
  fuel_type: string;
  seat_capacity: number;
  price_per_day: number;
  price_per_km: number;
  location: string;
  features: string[];
  is_available: boolean;
  images: string[];
  description: string;
  created_at: string;
}

const VehiclesSection: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'sedan',
    fuel_type: 'petrol',
    seat_capacity: 4,
    price_per_day: 0,
    price_per_km: 0,
    location: '',
    features: [] as string[],
    is_available: true,
    description: ''
  });

  const vehicleTypes = ['all', 'sedan', 'suv', 'van', 'luxury', 'bus', 'motorcycle'];
  const fuelTypes = ['petrol', 'diesel', 'hybrid', 'electric'];
  const featuresList = ['AC', 'GPS', 'Bluetooth', 'USB Charger', 'Child Seat', 'Roof Rack', 'First Aid Kit', 'Insurance'];

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const vehiclesCollection = collection(db, 'vehicles');
      const q = query(vehiclesCollection, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Vehicle[];
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVehicle = async () => {
    try {
      await addDoc(collection(db, 'vehicles'), {
        ...formData,
        images: [],
        created_at: new Date().toISOString(),
      });
      toast.success('Vehicle created successfully');
      fetchVehicles();
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error creating vehicle:', error);
      toast.error('Failed to create vehicle');
    }
  };

  const handleUpdateVehicle = async () => {
    if (!editingVehicle) return;
    
    try {
      const vehicleDoc = doc(db, 'vehicles', editingVehicle.id);
      await updateDoc(vehicleDoc, formData);
      toast.success('Vehicle updated successfully');
      fetchVehicles();
      setShowEditDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Failed to update vehicle');
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      const vehicleDoc = doc(db, 'vehicles', id);
      await deleteDoc(vehicleDoc);
      toast.success('Vehicle deleted successfully');
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    }
  };

  const toggleVehicleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const vehicleDoc = doc(db, 'vehicles', id);
      await updateDoc(vehicleDoc, { is_available: !currentStatus });
      toast.success(`Vehicle ${!currentStatus ? 'marked as available' : 'marked as unavailable'}`);
      fetchVehicles();
    } catch (error) {
      console.error('Error updating vehicle availability:', error);
      toast.error('Failed to update vehicle availability');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      type: 'sedan',
      fuel_type: 'petrol',
      seat_capacity: 4,
      price_per_day: 0,
      price_per_km: 0,
      location: '',
      features: [],
      is_available: true,
      description: ''
    });
    setEditingVehicle(null);
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year || new Date().getFullYear(),
      type: vehicle.type || 'sedan',
      fuel_type: vehicle.fuel_type || 'petrol',
      seat_capacity: vehicle.seat_capacity || 4,
      price_per_day: vehicle.price_per_day || 0,
      price_per_km: vehicle.price_per_km || 0,
      location: vehicle.location || '',
      features: vehicle.features || [],
      is_available: vehicle.is_available,
      description: vehicle.description || ''
    });
    setShowEditDialog(true);
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || vehicle.type === selectedType;
    return matchesSearch && matchesType;
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
          <h2 className="text-2xl font-bold text-gray-900">Vehicles Management</h2>
          <p className="text-gray-600">Manage your vehicle fleet and availability</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>
                Add a new vehicle to your fleet
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Toyota Prius 2023"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Vehicle Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {vehicleTypes.slice(1).map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => setFormData({...formData, make: e.target.value})}
                    placeholder="Toyota"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    placeholder="Prius"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
                    placeholder="2023"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fuel">Fuel Type</Label>
                  <select
                    id="fuel"
                    value={formData.fuel_type}
                    onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {fuelTypes.map(fuel => (
                      <option key={fuel} value={fuel}>
                        {fuel.charAt(0).toUpperCase() + fuel.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="seats">Seat Capacity</Label>
                  <Input
                    id="seats"
                    type="number"
                    value={formData.seat_capacity}
                    onChange={(e) => setFormData({...formData, seat_capacity: Number(e.target.value)})}
                    placeholder="4"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price-day">Price per Day ($)</Label>
                  <Input
                    id="price-day"
                    type="number"
                    value={formData.price_per_day}
                    onChange={(e) => setFormData({...formData, price_per_day: Number(e.target.value)})}
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label htmlFor="price-km">Price per KM ($)</Label>
                  <Input
                    id="price-km"
                    type="number"
                    step="0.01"
                    value={formData.price_per_km}
                    onChange={(e) => setFormData({...formData, price_per_km: Number(e.target.value)})}
                    placeholder="0.50"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Colombo"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter vehicle description"
                  rows={3}
                />
              </div>
              <div>
                <Label>Features</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {featuresList.map(feature => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, features: [...formData.features, feature]});
                          } else {
                            setFormData({...formData, features: formData.features.filter(f => f !== feature)});
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {setShowCreateDialog(false); resetForm();}}>Cancel</Button>
              <Button onClick={handleCreateVehicle} className="bg-orange-600 hover:bg-orange-700">Create Vehicle</Button>
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
                <Car className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Car className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vehicles.filter(v => v.is_available).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vehicles.reduce((sum, v) => sum + (v.seat_capacity || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Price/Day</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(vehicles.reduce((sum, v) => sum + (v.price_per_day || 0), 0) / vehicles.length || 0).toFixed(0)}
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
                placeholder="Search vehicles..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              {vehicleTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {vehicle.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {vehicle.make} {vehicle.model} • {vehicle.year}
                  </p>
                </div>
                <Badge variant={vehicle.is_available ? "default" : "secondary"}>
                  {vehicle.is_available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {vehicle.description || 'No description available'}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Car className="w-4 h-4 mr-1" />
                    Type
                  </span>
                  <span className="font-medium capitalize">{vehicle.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Fuel className="w-4 h-4 mr-1" />
                    Fuel
                  </span>
                  <span className="font-medium capitalize">{vehicle.fuel_type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Seats
                  </span>
                  <span className="font-medium">{vehicle.seat_capacity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Location
                  </span>
                  <span className="font-medium">{vehicle.location || 'Not specified'}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Per Day</p>
                    <p className="text-lg font-semibold">${vehicle.price_per_day}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Per KM</p>
                    <p className="text-lg font-semibold">${vehicle.price_per_km}</p>
                  </div>
                </div>
              </div>

              {vehicle.features && vehicle.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {vehicle.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {vehicle.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{vehicle.features.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleVehicleAvailability(vehicle.id, vehicle.is_available)}
                  className="flex-1"
                >
                  {vehicle.is_available ? 'Mark Unavailable' : 'Mark Available'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(vehicle)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No vehicles found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>
              Update vehicle information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Vehicle Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Toyota Prius 2023"
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Vehicle Type</Label>
                <select
                  id="edit-type"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {vehicleTypes.slice(1).map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-make">Make</Label>
                <Input
                  id="edit-make"
                  value={formData.make}
                  onChange={(e) => setFormData({...formData, make: e.target.value})}
                  placeholder="Toyota"
                />
              </div>
              <div>
                <Label htmlFor="edit-model">Model</Label>
                <Input
                  id="edit-model"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  placeholder="Prius"
                />
              </div>
              <div>
                <Label htmlFor="edit-year">Year</Label>
                <Input
                  id="edit-year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
                  placeholder="2023"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-fuel">Fuel Type</Label>
                <select
                  id="edit-fuel"
                  value={formData.fuel_type}
                  onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {fuelTypes.map(fuel => (
                    <option key={fuel} value={fuel}>
                      {fuel.charAt(0).toUpperCase() + fuel.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit-seats">Seat Capacity</Label>
                <Input
                  id="edit-seats"
                  type="number"
                  value={formData.seat_capacity}
                  onChange={(e) => setFormData({...formData, seat_capacity: Number(e.target.value)})}
                  placeholder="4"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price-day">Price per Day ($)</Label>
                <Input
                  id="edit-price-day"
                  type="number"
                  value={formData.price_per_day}
                  onChange={(e) => setFormData({...formData, price_per_day: Number(e.target.value)})}
                  placeholder="50"
                />
              </div>
              <div>
                <Label htmlFor="edit-price-km">Price per KM ($)</Label>
                <Input
                  id="edit-price-km"
                  type="number"
                  step="0.01"
                  value={formData.price_per_km}
                  onChange={(e) => setFormData({...formData, price_per_km: Number(e.target.value)})}
                  placeholder="0.50"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Colombo"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter vehicle description"
                rows={3}
              />
            </div>
            <div>
              <Label>Features</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {featuresList.map(feature => (
                  <label key={feature} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, features: [...formData.features, feature]});
                        } else {
                          setFormData({...formData, features: formData.features.filter(f => f !== feature)});
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-available"
                checked={formData.is_available}
                onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-available" className="text-sm font-normal">Vehicle is available for booking</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowEditDialog(false); resetForm();}}>Cancel</Button>
            <Button onClick={handleUpdateVehicle} className="bg-orange-600 hover:bg-orange-700">Update Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehiclesSection;