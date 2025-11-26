import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, Star, Clock, Tag } from 'lucide-react';
import { cmsService } from '@/services/cmsService';
import { FeaturedDestination, FeaturedDestinationFormData } from '@/types/cms';
import FeaturedDestinationForm from './FeaturedDestinationForm';

const FeaturedDestinationsSection: React.FC = () => {
  const [destinations, setDestinations] = useState<FeaturedDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDestination, setEditingDestination] = useState<FeaturedDestination | null>(null);

  const destinationCategories = ['all', 'Heritage', 'Nature', 'Culture', 'Beach', 'Wildlife'];

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const data = await cmsService.featuredDestinations.getAll();
      setDestinations(data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error('Failed to fetch destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDestination = async (destinationData: FeaturedDestinationFormData) => {
    try {
      const response = await cmsService.featuredDestinations.create(destinationData);
      if (response.success) {
        toast.success('Destination created successfully');
        fetchDestinations();
        setShowCreateForm(false);
      } else {
        toast.error(response.error || 'Failed to create destination');
      }
    } catch (error) {
      console.error('Error creating destination:', error);
      toast.error('Failed to create destination');
    }
  };

  const handleUpdateDestination = async (id: string, updates: Partial<FeaturedDestinationFormData>) => {
    try {
      const response = await cmsService.featuredDestinations.update(id, updates);
      if (response.success) {
        toast.success('Destination updated successfully');
        fetchDestinations();
        setEditingDestination(null);
      } else {
        toast.error(response.error || 'Failed to update destination');
      }
    } catch (error) {
      console.error('Error updating destination:', error);
      toast.error('Failed to update destination');
    }
  };

  const handleDeleteDestination = async (id: string) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;

    try {
      const response = await cmsService.featuredDestinations.delete(id);
      if (response.success) {
        toast.success('Destination deleted successfully');
        fetchDestinations();
      } else {
        toast.error(response.error || 'Failed to delete destination');
      }
    } catch (error) {
      console.error('Error deleting destination:', error);
      toast.error('Failed to delete destination');
    }
  };

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = (destination.name || destination.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || destination.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
      {showCreateForm || editingDestination ? (
        <FeaturedDestinationForm
          destination={editingDestination}
          onSubmit={editingDestination ? (data) => handleUpdateDestination(editingDestination.id, data) : handleCreateDestination}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingDestination(null);
          }}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Destinations</h2>
              <p className="text-gray-600">Manage featured destinations on your homepage</p>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Destination
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search destinations..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  {destinationCategories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Destinations List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="relative h-40 w-full mb-4">
                    <img src={destination.image} alt={destination.name} className="rounded-t-lg object-cover w-full h-full" />
                  </div>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {destination.name}
                    </CardTitle>
                    <Badge variant={destination.isActive ? "default" : "secondary"}>
                      {destination.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{destination.title}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {destination.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Tag className="w-4 h-4 mr-2" />
                      {destination.category}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {destination.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 mr-2" />
                      {destination.rating}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Tag className="w-4 h-4 mr-2" />
                      {destination.currency}{destination.price}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(destination.features || []).map(feature => (
                      <Badge key={feature} variant="outline">{feature}</Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingDestination(destination)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteDestination(destination.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">No destinations found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default FeaturedDestinationsSection;
