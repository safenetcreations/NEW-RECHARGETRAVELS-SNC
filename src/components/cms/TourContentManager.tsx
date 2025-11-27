import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { dbService, authService, storageService } from '@/lib/firebase-services';
import { Plus, Edit, MapPin, Clock, Users, DollarSign } from 'lucide-react';

interface Tour {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category: string;
  duration_days: number;
  luxury_level: string;
  is_active: boolean;
  highlights?: string[];
}

export const TourContentManager = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_per_person: 0,
    category: 'cultural',
    duration_days: 1,
    luxury_level: 'standard',
  });

  const tourCategories = [
    { value: 'cultural', label: 'Cultural' },
    { value: 'wildlife', label: 'Wildlife' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'beach', label: 'Beach' }
  ];

  const luxuryLevels = [
    { value: 'budget', label: 'Budget' },
    { value: 'standard', label: 'Standard' },
    { value: 'luxury', label: 'Luxury' }
  ];

  const fetchTours = useCallback(async () => {
    try {
      const tours = await dbService.list('tour_packages', [
        { field: 'is_active', operator: '==', value: true }
      ], 'name');
      
      setTours(tours as Tour[]);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tours",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const handleSave = async () => {
    try {
      const tourData = {
        name: formData.title,
        description: formData.description,
        base_price: formData.price_per_person,
        duration_days: formData.duration_days,
        category: formData.category,
        luxury_level: formData.luxury_level,
        is_active: true
      };

      if (isCreating) {
        await dbService.create('tour_packages', tourData);

        toast({
          title: "Success",
          description: "Tour created successfully"
        });
      } else if (selectedTour) {
        await dbService.update('tour_packages', selectedTour.id, tourData);

        toast({
          title: "Success",
          description: "Tour updated successfully"
        });
      }

      fetchTours();
      resetForm();
    } catch (error) {
      console.error('Error saving tour:', error);
      toast({
        title: "Error",
        description: "Failed to save tour",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price_per_person: 0,
      category: 'cultural',
      duration_days: 1,
      luxury_level: 'standard',
    });
    setSelectedTour(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const startEdit = (tour: Tour) => {
    setSelectedTour(tour);
    setFormData({
      title: tour.name,
      description: tour.description || '',
      price_per_person: tour.base_price,
      category: tour.category,
      duration_days: tour.duration_days,
      luxury_level: tour.luxury_level,
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  const startCreate = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading tours...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tour Management</h2>
          <p className="text-muted-foreground">Manage tour packages and experiences</p>
        </div>
        <Button onClick={startCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Tour
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tours List */}
        <Card>
          <CardHeader>
            <CardTitle>Tours ({tours.length})</CardTitle>
            <CardDescription>All tour packages in your system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="border rounded-lg p-4 hover:bg-accent/5 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{tour.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">{tour.category}</Badge>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${tour.base_price}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => startEdit(tour)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {tour.duration_days} day{tour.duration_days > 1 ? 's' : ''}
                  </span>
                  <Badge variant="outline">{tour.luxury_level}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tour Editor */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>
                {isCreating ? 'Create New Tour' : `Edit ${selectedTour?.name}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="title">Tour Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter tour title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the tour experience..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tourCategories.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="luxury_level">Luxury Level</Label>
                  <Select
                    value={formData.luxury_level}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, luxury_level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {luxuryLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Base Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price_per_person}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_per_person: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration_days}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_days: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  {isCreating ? 'Create Tour' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};