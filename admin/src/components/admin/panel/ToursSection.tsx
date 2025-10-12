import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, Filter, MapPin, DollarSign, Users, Clock } from 'lucide-react';
import { getDocs, collection, query, orderBy, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseService';

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  const tourTypes = ['all', 'luxury', 'adventure', 'cultural', 'wildlife', 'beach'];

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'tour_packages'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Tour[];
      setTours(data);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast.error('Failed to fetch tours');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTour = async (tourData: Omit<Tour, 'id' | 'created_at'>) => {
    try {
      await addDoc(collection(db, 'tour_packages'), tourData);
      toast.success('Tour created successfully');
      fetchTours();
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating tour:', error);
      toast.error('Failed to create tour');
    }
  };

  const handleUpdateTour = async (id: string, updates: Partial<Tour>) => {
    try {
      await updateDoc(doc(db, 'tour_packages', id), updates);
      toast.success('Tour updated successfully');
      fetchTours();
      setEditingTour(null);
    } catch (error) {
      console.error('Error updating tour:', error);
      toast.error('Failed to update tour');
    }
  };

  const handleDeleteTour = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;
    
    try {
      await deleteDoc(doc(db, 'tour_packages', id));
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
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Tour
        </Button>
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
                  onClick={() => setEditingTour(tour)}
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
    </div>
  );
};

export default ToursSection;