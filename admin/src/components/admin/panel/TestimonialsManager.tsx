/**
 * Testimonials Manager
 * Admin interface for managing customer testimonials
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { testimonialsService } from '@/services/cmsService';
import { Testimonial, TestimonialFormData } from '@/types/cms';

const TestimonialsManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    location: '',
    image: '',
    rating: 5,
    text: '',
    tripType: '',
    date: '',
    isActive: true,
    isFeatured: false,
    order: 0,
  });

  // Load all testimonials
  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await testimonialsService.getAll();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTestimonial) {
        // Update existing testimonial
        const response = await testimonialsService.update(editingTestimonial.id, formData);
        if (response.success) {
          toast.success('Testimonial updated successfully');
          loadTestimonials();
          closeDialog();
        } else {
          toast.error(response.error || 'Failed to update testimonial');
        }
      } else {
        // Create new testimonial
        const response = await testimonialsService.create(formData);
        if (response.success) {
          toast.success('Testimonial created successfully');
          loadTestimonials();
          closeDialog();
        } else {
          toast.error(response.error || 'Failed to create testimonial');
        }
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('An error occurred while saving the testimonial');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      const response = await testimonialsService.delete(id);
      if (response.success) {
        toast.success('Testimonial deleted successfully');
        loadTestimonials();
      } else {
        toast.error(response.error || 'Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('An error occurred while deleting the testimonial');
    }
  };

  // Handle toggle active status
  const toggleActive = async (testimonial: Testimonial) => {
    try {
      const response = await testimonialsService.update(testimonial.id, {
        isActive: !testimonial.isActive,
      });
      if (response.success) {
        toast.success(`Testimonial ${testimonial.isActive ? 'deactivated' : 'activated'} successfully`);
        loadTestimonials();
      } else {
        toast.error(response.error || 'Failed to update testimonial status');
      }
    } catch (error) {
      console.error('Error toggling testimonial status:', error);
      toast.error('An error occurred while updating the testimonial');
    }
  };

  // Open dialog for editing
  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      location: testimonial.location,
      image: testimonial.image,
      rating: testimonial.rating,
      text: testimonial.text,
      tripType: testimonial.tripType,
      date: testimonial.date,
      isActive: testimonial.isActive,
      isFeatured: testimonial.isFeatured,
      order: testimonial.order,
    });
    setIsDialogOpen(true);
  };

  // Open dialog for creating
  const openCreateDialog = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      location: '',
      image: '',
      rating: 5,
      text: '',
      tripType: '',
      date: '',
      isActive: true,
      isFeatured: false,
      order: testimonials.length,
    });
    setIsDialogOpen(true);
  };

  // Close dialog and reset form
  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTestimonial(null);
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof TestimonialFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Testimonials Manager</h2>
          <p className="text-gray-600 mt-1">Manage customer reviews and testimonials</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Testimonials Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No testimonials yet</h3>
            <p className="text-gray-600 mb-6">Start building trust by adding customer testimonials</p>
            <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add First Testimonial
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !testimonial.isActive ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-6">
                  {/* Customer Photo */}
                  <div className="flex-shrink-0">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>

                  {/* Testimonial Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">{testimonial.text}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
                        {testimonial.tripType}
                      </span>
                      <span>{testimonial.date}</span>
                      {testimonial.isFeatured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Status Badge */}
                    {testimonial.isActive ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActive(testimonial)}
                        title={testimonial.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {testimonial.isActive ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(testimonial)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(testimonial.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </DialogTitle>
            <DialogDescription>
              {editingTestimonial
                ? 'Update the testimonial details below'
                : 'Fill in the customer testimonial details'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="e.g., Sarah Johnson"
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                placeholder="e.g., New York, USA"
                required
              />
            </div>

            {/* Customer Photo URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Photo URL *</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleFieldChange('image', e.target.value)}
                placeholder="https://example.com/photo.jpg"
                required
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5) *</Label>
              <Input
                id="rating"
                type="number"
                min={1}
                max={5}
                value={formData.rating}
                onChange={(e) => handleFieldChange('rating', parseInt(e.target.value))}
                required
              />
              <div className="flex gap-1 mt-1">
                {[...Array(formData.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            {/* Testimonial Text */}
            <div className="space-y-2">
              <Label htmlFor="text">Testimonial Text *</Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) => handleFieldChange('text', e.target.value)}
                placeholder="Share the customer's experience..."
                rows={4}
                required
              />
            </div>

            {/* Trip Type & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tripType">Trip Type *</Label>
                <Input
                  id="tripType"
                  value={formData.tripType}
                  onChange={(e) => handleFieldChange('tripType', e.target.value)}
                  placeholder="e.g., Honeymoon Trip"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) => handleFieldChange('date', e.target.value)}
                  placeholder="e.g., December 2023"
                  required
                />
              </div>
            </div>

            {/* Order, Active & Featured Status */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleFieldChange('order', parseInt(e.target.value))}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">Active Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleFieldChange('isActive', checked)}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isFeatured">Featured</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleFieldChange('isFeatured', checked)}
                  />
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    {formData.isFeatured ? 'Yes' : 'No'}
                  </Label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsManager;
