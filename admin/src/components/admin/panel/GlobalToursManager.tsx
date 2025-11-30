// Global Tours Manager Component
// Admin panel for managing all global tours

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Star,
  Sparkles,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  MapPin,
  Users,
  Globe,
  Filter,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';
import {
  GlobalTour,
  TourRegion,
  TourCategory,
  getAllToursAdmin,
  createTour,
  updateTour,
  deleteTour,
  toggleTourStatus,
  toggleTourFeatured,
  seedSampleTours,
  getBookingStatistics,
  BookingStatistics
} from '../../../services/globalTourAdminService';
import GlobalTourFormDialog from './GlobalTourFormDialog';

interface GlobalToursManagerProps {
  className?: string;
}

const regionLabels: Record<TourRegion, string> = {
  'sri-lanka': 'Sri Lanka',
  'maldives': 'Maldives',
  'india': 'India',
  'southeast-asia': 'Southeast Asia',
  'worldwide': 'Worldwide'
};

const categoryLabels: Record<TourCategory, string> = {
  'wildlife': 'Wildlife',
  'cultural': 'Cultural',
  'beach': 'Beach',
  'adventure': 'Adventure',
  'wellness': 'Wellness',
  'heritage': 'Heritage',
  'pilgrimage': 'Pilgrimage',
  'honeymoon': 'Honeymoon',
  'family': 'Family',
  'luxury': 'Luxury'
};

const categoryColors: Record<TourCategory, string> = {
  'wildlife': 'bg-green-100 text-green-800',
  'cultural': 'bg-purple-100 text-purple-800',
  'beach': 'bg-blue-100 text-blue-800',
  'adventure': 'bg-orange-100 text-orange-800',
  'wellness': 'bg-teal-100 text-teal-800',
  'heritage': 'bg-amber-100 text-amber-800',
  'pilgrimage': 'bg-indigo-100 text-indigo-800',
  'honeymoon': 'bg-pink-100 text-pink-800',
  'family': 'bg-cyan-100 text-cyan-800',
  'luxury': 'bg-yellow-100 text-yellow-800'
};

const GlobalToursManager: React.FC<GlobalToursManagerProps> = ({ className }) => {
  const [tours, setTours] = useState<GlobalTour[]>([]);
  const [filteredTours, setFilteredTours] = useState<GlobalTour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<GlobalTour | null>(null);
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState<BookingStatistics | null>(null);

  // Load tours on mount
  useEffect(() => {
    loadTours();
    loadStats();
  }, []);

  // Filter tours based on search and filters
  useEffect(() => {
    let filtered = tours;

    if (searchTerm) {
      filtered = filtered.filter(
        tour =>
          tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (regionFilter && regionFilter !== 'all') {
      filtered = filtered.filter(tour => tour.region === regionFilter);
    }

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(tour => tour.category === categoryFilter);
    }

    if (statusFilter === 'active') {
      filtered = filtered.filter(tour => tour.isActive);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(tour => !tour.isActive);
    } else if (statusFilter === 'featured') {
      filtered = filtered.filter(tour => tour.isFeatured);
    }

    setFilteredTours(filtered);
  }, [tours, searchTerm, regionFilter, categoryFilter, statusFilter]);

  const loadTours = async () => {
    setIsLoading(true);
    try {
      const data = await getAllToursAdmin();
      setTours(data);
      setFilteredTours(data);
      toast.success(`Loaded ${data.length} tours`);
    } catch (error) {
      console.error('Error loading tours:', error);
      toast.error('Failed to load tours');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getBookingStatistics();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSeedTours = async () => {
    if (!confirm('This will add sample tours to your database. Continue?')) return;

    setIsLoading(true);
    try {
      const count = await seedSampleTours();
      toast.success(`Successfully added ${count} sample tours`);
      loadTours();
    } catch (error) {
      console.error('Error seeding tours:', error);
      toast.error('Failed to seed tours');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTour(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tour: GlobalTour) => {
    setSelectedTour(tour);
    setIsFormOpen(true);
  };

  const handleDelete = async (tourId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteTour(tourId);
      toast.success('Tour deleted successfully');
      loadTours();
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast.error('Failed to delete tour');
    }
  };

  const handleToggleStatus = async (tourId: string, isActive: boolean) => {
    try {
      await toggleTourStatus(tourId, !isActive);
      toast.success(`Tour ${isActive ? 'deactivated' : 'activated'} successfully`);
      loadTours();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update tour status');
    }
  };

  const handleToggleFeatured = async (tourId: string, isFeatured: boolean) => {
    try {
      await toggleTourFeatured(tourId, !isFeatured);
      toast.success(`Tour ${isFeatured ? 'unfeatured' : 'featured'} successfully`);
      loadTours();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Failed to update featured status');
    }
  };

  const handleFormSubmit = async (tourData: Partial<GlobalTour>) => {
    try {
      if (selectedTour) {
        await updateTour(selectedTour.id, tourData);
        toast.success('Tour updated successfully');
      } else {
        await createTour(tourData as any);
        toast.success('Tour created successfully');
      }
      setIsFormOpen(false);
      loadTours();
    } catch (error) {
      console.error('Error saving tour:', error);
      toast.error('Failed to save tour');
    }
  };

  const getUniqueRegions = () => {
    const regions = tours.map(tour => tour.region);
    return ['all', ...Array.from(new Set(regions))];
  };

  const getUniqueCategories = () => {
    const categories = tours.map(tour => tour.category);
    return ['all', ...Array.from(new Set(categories))];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header Section */}
      <Card className="mb-6 border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Globe className="w-8 h-8 text-emerald-600" />
                Global Tours Management
              </CardTitle>
              <p className="text-gray-600">
                Manage all tour packages across regions - Sri Lanka, Maldives, India & more
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={loadTours}
                variant="outline"
                size="lg"
                className="bg-white hover:bg-gray-50"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh
              </Button>
              {tours.length === 0 && (
                <Button
                  onClick={handleSeedTours}
                  variant="outline"
                  size="lg"
                  className="bg-white hover:bg-gray-50 text-gray-700 shadow-sm"
                >
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                  Import Sample Tours
                </Button>
              )}
              <Button
                onClick={handleCreate}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Tour
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tours</p>
                <h3 className="text-3xl font-bold text-gray-900">{tours.length}</h3>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <Globe className="w-6 h-6 text-emerald-600" />
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
                  {tours.filter(t => t.isActive).length}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {tours.filter(t => t.isFeatured).length}
                </h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {stats?.totalBookings || 0}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  ${(stats?.totalRevenue || 0).toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6 shadow-md">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search tours by title, description, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Regions</option>
              {Object.entries(regionLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="featured">Featured Only</option>
            </select>
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
            <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-teal-600 overflow-hidden">
              {tour.heroImage ? (
                <img
                  src={tour.heroImage}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-white/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge
                  className={`${tour.isActive
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                    } text-white`}
                >
                  {tour.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {tour.isFeatured && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Star className="w-3 h-3 mr-1" /> Featured
                  </Badge>
                )}
              </div>

              {/* Region Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/90 text-gray-800">
                  {regionLabels[tour.region]}
                </Badge>
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-4 left-4">
                <div className="bg-white rounded-lg px-3 py-2 shadow-lg">
                  <div className="text-2xl font-bold text-emerald-600">
                    ${tour.pricePerPersonUSD || tour.priceUSD}
                    <span className="text-sm font-normal text-gray-500">/person</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg px-2 py-1 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-gray-800">{tour.rating}</span>
                <span className="text-xs text-gray-500">({tour.reviewCount})</span>
              </div>
            </div>

            {/* Tour Details */}
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                {tour.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {tour.shortDescription || tour.description}
              </p>

              {/* Tour Meta */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
                  {tour.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-teal-500" />
                  {tour.duration.days} Days / {tour.duration.nights} Nights
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  {tour.minGroupSize} - {tour.maxGroupSize} people
                </div>
              </div>

              {/* Category Badge */}
              <div className="mb-4">
                <Badge className={categoryColors[tour.category]}>
                  {categoryLabels[tour.category]}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Button
                  onClick={() => handleEdit(tour)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="sm"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(tour.id, tour.title)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleToggleStatus(tour.id, tour.isActive)}
                  variant="outline"
                  size="sm"
                  className={tour.isActive ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-green-300 text-green-600 hover:bg-green-50'}
                >
                  {tour.isActive ? (
                    <><EyeOff className="w-4 h-4 mr-2" /> Deactivate</>
                  ) : (
                    <><Eye className="w-4 h-4 mr-2" /> Activate</>
                  )}
                </Button>
                <Button
                  onClick={() => handleToggleFeatured(tour.id, tour.isFeatured)}
                  variant="outline"
                  size="sm"
                  className={tour.isFeatured ? 'border-yellow-300 text-yellow-600 hover:bg-yellow-50' : 'border-gray-300'}
                >
                  <Star className={`w-4 h-4 mr-2 ${tour.isFeatured ? 'fill-yellow-500' : ''}`} />
                  {tour.isFeatured ? 'Unfeature' : 'Feature'}
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
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tours Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || regionFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first global tour'}
            </p>
            {!searchTerm && regionFilter === 'all' && categoryFilter === 'all' && statusFilter === 'all' && (
              <div className="flex flex-col gap-3 items-center">
                <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Tour
                </Button>
                <Button onClick={handleSeedTours} variant="outline" className="text-yellow-600 border-yellow-200 hover:bg-yellow-50">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Import Sample Tours
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tour Form Dialog */}
      <GlobalTourFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        tour={selectedTour}
      />
    </div>
  );
};

export default GlobalToursManager;
