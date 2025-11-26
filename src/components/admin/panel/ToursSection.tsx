import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, Filter, MapPin, DollarSign, Users, Clock } from 'lucide-react';

interface Tour {
  id: string;
  name: string;
  title?: string;
  description: string;
  base_price: number;
  price?: number;
  duration_days: number;
  duration?: string;
  max_participants?: number;
  category: string;
  tour_type?: string;
  luxury_level: string;
  is_active: boolean;
  created_at: string;
}

const ToursSection: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: 0,
    duration_days: 1,
    max_participants: 10,
    category: 'cultural',
    luxury_level: 'standard',
    is_active: true,
    highlights: '',
    included: '',
    excluded: '',
    itinerary: ''
  });

  const tourTypes = ['all', 'luxury', 'adventure', 'cultural', 'wildlife', 'beach'];

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const toursCollection = collection(db, 'tour_packages');
      const q = query(toursCollection, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tour[];
      setTours(data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast.error('Failed to fetch tours');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTour = async () => {
    try {
      await addDoc(collection(db, 'tour_packages'), formData);
      toast.success('Tour created successfully');
      fetchTours();
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error creating tour:', error);
      toast.error('Failed to create tour');
    }
  };

  const handleUpdateTour = async () => {
    if (!editingTour) return;
    
    try {
      const tourDoc = doc(db, 'tour_packages', editingTour.id);
      await updateDoc(tourDoc, formData);
      toast.success('Tour updated successfully');
      fetchTours();
      setShowEditDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error updating tour:', error);
      toast.error('Failed to update tour');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      base_price: 0,
      duration_days: 1,
      max_participants: 10,
      category: 'cultural',
      luxury_level: 'standard',
      is_active: true,
      highlights: '',
      included: '',
      excluded: '',
      itinerary: ''
    });
    setEditingTour(null);
  };

  const openEditDialog = (tour: Tour) => {
    setEditingTour(tour);
    setFormData({
      name: tour.name || tour.title || '',
      description: tour.description || '',
      base_price: tour.base_price || tour.price || 0,
      duration_days: tour.duration_days || 1,
      max_participants: tour.max_participants || 10,
      category: tour.category || 'cultural',
      luxury_level: tour.luxury_level || 'standard',
      is_active: tour.is_active,
      highlights: '',
      included: '',
      excluded: '',
      itinerary: ''
    });
    setShowEditDialog(true);
  };

  const handleDeleteTour = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;
    
    try {
      const tourDoc = doc(db, 'tour_packages', id);
      await deleteDoc(tourDoc);
      toast.success('Tour deleted successfully');
      fetchTours();
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast.error('Failed to delete tour');
    }
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = (tour.name || tour.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || tour.category === selectedType || tour.luxury_level === selectedType;
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
          <h2 className="text-2xl font-bold text-gray-900">Tours & Packages</h2>
          <p className="text-gray-600">Manage tour packages and experiences</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Tour
          </Button>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Tour</DialogTitle>
              <DialogDescription>
                Add a new tour package with all the necessary details
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tour Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter tour name"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="cultural">Cultural</option>
                    <option value="wildlife">Wildlife</option>
                    <option value="adventure">Adventure</option>
                    <option value="beach">Beach</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter tour description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Base Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.base_price}
                    onChange={(e) => setFormData({...formData, base_price: Number(e.target.value)})}
                    placeholder="500"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({...formData, duration_days: Number(e.target.value)})}
                    placeholder="3"
                  />
                </div>
                <div>
                  <Label htmlFor="participants">Max Participants</Label>
                  <Input
                    id="participants"
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({...formData, max_participants: Number(e.target.value)})}
                    placeholder="20"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="luxury">Luxury Level</Label>
                <select
                  id="luxury"
                  value={formData.luxury_level}
                  onChange={(e) => setFormData({...formData, luxury_level: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="budget">Budget</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              <div>
                <Label htmlFor="highlights">Tour Highlights (one per line)</Label>
                <Textarea
                  id="highlights"
                  value={formData.highlights}
                  onChange={(e) => setFormData({...formData, highlights: e.target.value})}
                  placeholder="Visit ancient temples\nExplore local markets\nEnjoy traditional cuisine"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="included">What's Included (one per line)</Label>
                <Textarea
                  id="included"
                  value={formData.included}
                  onChange={(e) => setFormData({...formData, included: e.target.value})}
                  placeholder="Hotel accommodation\nBreakfast and lunch\nProfessional guide"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="excluded">What's Excluded (one per line)</Label>
                <Textarea
                  id="excluded"
                  value={formData.excluded}
                  onChange={(e) => setFormData({...formData, excluded: e.target.value})}
                  placeholder="International flights\nTravel insurance\nPersonal expenses"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="active" className="text-sm font-normal">Tour is active and available for booking</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {setShowCreateDialog(false); resetForm();}}>Cancel</Button>
              <Button onClick={handleCreateTour} className="bg-orange-600 hover:bg-orange-700">Create Tour</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tours..."
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
              {tourTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tours List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.map((tour) => (
          <Card key={tour.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {tour.name || tour.title}
                </CardTitle>
                <Badge variant={tour.is_active ? "default" : "secondary"}>
                  {tour.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {tour.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  ${tour.base_price || tour.price}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {tour.duration_days} days
                </div>
                {tour.max_participants && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    Max {tour.max_participants} people
                  </div>
                )}
              </div>

              <Badge variant="outline" className="mb-4">
                {tour.category}
              </Badge>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(tour)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteTour(tour.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTours.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No tours found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tour</DialogTitle>
            <DialogDescription>
              Update tour package details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Tour Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter tour name"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <select
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="cultural">Cultural</option>
                  <option value="wildlife">Wildlife</option>
                  <option value="adventure">Adventure</option>
                  <option value="beach">Beach</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter tour description"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-price">Base Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.base_price}
                  onChange={(e) => setFormData({...formData, base_price: Number(e.target.value)})}
                  placeholder="500"
                />
              </div>
              <div>
                <Label htmlFor="edit-duration">Duration (days)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({...formData, duration_days: Number(e.target.value)})}
                  placeholder="3"
                />
              </div>
              <div>
                <Label htmlFor="edit-participants">Max Participants</Label>
                <Input
                  id="edit-participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({...formData, max_participants: Number(e.target.value)})}
                  placeholder="20"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-luxury">Luxury Level</Label>
              <select
                id="edit-luxury"
                value={formData.luxury_level}
                onChange={(e) => setFormData({...formData, luxury_level: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="budget">Budget</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            <div>
              <Label htmlFor="edit-highlights">Tour Highlights (one per line)</Label>
              <Textarea
                id="edit-highlights"
                value={formData.highlights}
                onChange={(e) => setFormData({...formData, highlights: e.target.value})}
                placeholder="Visit ancient temples\nExplore local markets\nEnjoy traditional cuisine"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-included">What's Included (one per line)</Label>
              <Textarea
                id="edit-included"
                value={formData.included}
                onChange={(e) => setFormData({...formData, included: e.target.value})}
                placeholder="Hotel accommodation\nBreakfast and lunch\nProfessional guide"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-excluded">What's Excluded (one per line)</Label>
              <Textarea
                id="edit-excluded"
                value={formData.excluded}
                onChange={(e) => setFormData({...formData, excluded: e.target.value})}
                placeholder="International flights\nTravel insurance\nPersonal expenses"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-active"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-active" className="text-sm font-normal">Tour is active and available for booking</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowEditDialog(false); resetForm();}}>Cancel</Button>
            <Button onClick={handleUpdateTour} className="bg-orange-600 hover:bg-orange-700">Update Tour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ToursSection;