import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Eye,
  Upload,
  Sparkles,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  MapPin,
  Users,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import TourFormDialog from './TourFormDialog';
import { firebaseTourService, Tour } from '../../../services/firebaseTourService';

interface ToursManagementProps {
  className?: string;
}

const ToursManagement: React.FC<ToursManagementProps> = ({ className }) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Load tours on mount
  useEffect(() => {
    loadTours();
  }, []);

  // Filter tours based on search and category
  useEffect(() => {
    let filtered = tours;

    if (searchTerm) {
      filtered = filtered.filter(
        tour =>
          tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(tour => tour.category === categoryFilter);
    }

    setFilteredTours(filtered);
  }, [tours, searchTerm, categoryFilter]);

  const loadTours = async () => {
    setIsLoading(true);
    try {
      const data = await firebaseTourService.getAllTours();
      setTours(data);
      setFilteredTours(data);
      toast.success(`Loaded ${data.length} tours successfully`);
    } catch (error) {
      console.error('Error loading tours:', error);
      toast.error('Failed to load tours');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTour(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tour: Tour) => {
    setSelectedTour(tour);
    setIsFormOpen(true);
  };

  const handleDelete = async (tourId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await firebaseTourService.deleteTour(tourId);
      toast.success('Tour deleted successfully');
      loadTours();
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast.error('Failed to delete tour');
    }
  };

  const handleFormSubmit = async (tourData: Partial<Tour>) => {
    try {
      if (selectedTour) {
        await firebaseTourService.updateTour(selectedTour.id, tourData);
        toast.success('Tour updated successfully');
      } else {
        await firebaseTourService.createTour(tourData as Omit<Tour, 'id' | 'created_at' | 'updated_at'>);
        toast.success('Tour created successfully');
      }
      setIsFormOpen(false);
      loadTours();
    } catch (error) {
      console.error('Error saving tour:', error);
      toast.error('Failed to save tour');
    }
  };

  const getUniqueCategories = () => {
    const categories = tours.map(tour => tour.category);
    return ['all', ...Array.from(new Set(categories))];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header Section */}
      <Card className="mb-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Tours Management
              </CardTitle>
              <p className="text-gray-600">
                Manage all tour packages, itineraries, and bookings
              </p>
            </div>
            <Button
              onClick={handleCreate}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Tour
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tours</p>
                <h3 className="text-3xl font-bold text-gray-900">{tours.length}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tours</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {tours.filter(t => t.is_active).length}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Price</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  ${Math.round(tours.reduce((acc, t) => acc + t.price_per_person, 0) / tours.length || 0)}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {getUniqueCategories().length - 1}
                </h3>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6 shadow-md">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search tours by title, description, destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {getUniqueCategories().map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
              }}
              className="border-2"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTours.map((tour) => (
          <Card
            key={tour.id}
            className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group"
          >
            {/* Tour Image */}
            <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden">
              {tour.images && tour.images.length > 0 ? (
                <img
                  src={tour.images[0].url || tour.images[0]}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-white/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    tour.is_active
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {tour.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-4 left-4">
                <div className="bg-white rounded-lg px-3 py-2 shadow-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    ${tour.price_per_person}
                    <span className="text-sm font-normal text-gray-500">/person</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tour Details */}
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {tour.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>

              {/* Tour Meta */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  {tour.destination}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-green-500" />
                  {tour.duration_days} {tour.duration_days === 1 ? 'Day' : 'Days'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-purple-500" />
                  Max {tour.max_group_size || 10} people
                </div>
              </div>

              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {tour.category}
                </span>
                {tour.difficulty_level && (
                  <span className="inline-block ml-2 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {tour.difficulty_level}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(tour)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(tour.id, tour.title)}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTours.length === 0 && (
        <Card className="shadow-md">
          <CardContent className="py-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tours Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || categoryFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first tour'}
            </p>
            {!searchTerm && categoryFilter === 'all' && (
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Tour
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tour Form Dialog */}
      <TourFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        tour={selectedTour}
      />
    </div>
  );
};

export default ToursManagement;
