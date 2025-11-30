/**
 * Hero Section Manager
 * Admin interface for managing homepage hero carousel slides
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Image as ImageIcon } from 'lucide-react';
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
import { heroSlidesService } from '@/services/cmsService';
import { HeroSlide, HeroSlideFormData } from '@/types/cms';
import ImageUpload from '@/components/ui/image-upload';

const HeroSectionManager: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState<HeroSlideFormData>({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    order: 0,
    isActive: true,
    ctaText: '',
    ctaLink: '',
  });

  // Load all slides
  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      setLoading(true);
      const data = await heroSlidesService.getAllAdmin();
      setSlides(data);
    } catch (error) {
      console.error('Error loading slides:', error);
      toast.error('Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSlide) {
        // Update existing slide
        const response = await heroSlidesService.update(editingSlide.id, formData);
        if (response.success) {
          toast.success('Hero slide updated successfully');
          loadSlides();
          closeDialog();
        } else {
          toast.error(response.error || 'Failed to update slide');
        }
      } else {
        // Create new slide
        const response = await heroSlidesService.create(formData);
        if (response.success) {
          toast.success('Hero slide created successfully');
          loadSlides();
          closeDialog();
        } else {
          toast.error(response.error || 'Failed to create slide');
        }
      }
    } catch (error: any) {
      console.error('Error saving slide:', error);
      if (error.code === 'permission-denied' || error.message?.includes('permission-denied')) {
        toast.error('Permission denied. You do not have admin privileges to perform this action.');
      } else {
        toast.error('An error occurred while saving the slide');
      }
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) {
      return;
    }

    try {
      const response = await heroSlidesService.delete(id);
      if (response.success) {
        toast.success('Hero slide deleted successfully');
        loadSlides();
      } else {
        toast.error(response.error || 'Failed to delete slide');
      }
    } catch (error: any) {
      console.error('Error deleting slide:', error);
      if (error.code === 'permission-denied' || error.message?.includes('permission-denied')) {
        toast.error('Permission denied. You do not have admin privileges to perform this action.');
      } else {
        toast.error('An error occurred while deleting the slide');
      }
    }
  };

  // Handle toggle active status
  const toggleActive = async (slide: HeroSlide) => {
    try {
      const response = await heroSlidesService.update(slide.id, {
        isActive: !slide.isActive,
      });
      if (response.success) {
        toast.success(`Slide ${slide.isActive ? 'deactivated' : 'activated'} successfully`);
        loadSlides();
      } else {
        toast.error(response.error || 'Failed to update slide status');
      }
    } catch (error: any) {
      console.error('Error toggling slide status:', error);
      if (error.code === 'permission-denied' || error.message?.includes('permission-denied')) {
        toast.error('Permission denied. You do not have admin privileges to perform this action.');
      } else {
        toast.error('An error occurred while updating the slide');
      }
    }
  };

  // Open dialog for editing
  const openEditDialog = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      image: slide.image,
      order: slide.order,
      isActive: slide.isActive,
      ctaText: slide.ctaText || '',
      ctaLink: slide.ctaLink || '',
    });
    setIsDialogOpen(true);
  };

  // Open dialog for creating
  const openCreateDialog = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      order: slides.length,
      isActive: true,
      ctaText: '',
      ctaLink: '',
    });
    setIsDialogOpen(true);
  };

  // Close dialog and reset form
  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      order: 0,
      isActive: true,
      ctaText: '',
      ctaLink: '',
    });
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof HeroSlideFormData, value: any) => {
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
          <h2 className="text-3xl font-bold text-gray-900">Hero Section Manager</h2>
          <p className="text-gray-600 mt-1">Manage homepage hero carousel slides</p>
          {/* Debug Info */}
          {/* <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-500">
            Debug: Role check - Admin access required. |
            {/* @ts-ignore */}
          {/* Project: {import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Hardcoded/Default'}
          </div> */}
        </div>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Slide
        </Button>
      </div>

      {/* Slides List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {slides.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hero slides yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first hero slide</p>
            <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create First Slide
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors ${!slide.isActive ? 'opacity-60' : ''
                  }`}
              >
                {/* Drag Handle */}
                <div className="cursor-move text-gray-400 hover:text-gray-600">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Order Number */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                  {index + 1}
                </div>

                {/* Slide Preview */}
                <div className="flex-shrink-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                </div>

                {/* Slide Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{slide.title}</h3>
                  <p className="text-sm text-gray-600 truncate">{slide.subtitle}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{slide.description}</p>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  {slide.isActive ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Inactive
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive(slide)}
                    title={slide.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {slide.isActive ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(slide)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(slide.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
              {editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}
            </DialogTitle>
            <DialogDescription>
              {editingSlide
                ? 'Update the hero slide details below'
                : 'Fill in the details to create a new hero slide'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="e.g., Sigiriya Rock Fortress"
                required
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle *</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                placeholder="e.g., The Eighth Wonder of the World"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Brief description of the destination"
                rows={3}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Hero Image *</Label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => handleFieldChange('image', url)}
                onRemove={() => handleFieldChange('image', '')}
                folder="hero-slides"
                helperText="Recommended: 1920x1080px (16:9). Max: 10MB. Formats: JPG, PNG, WEBP"
              />
            </div>

            {/* CTA Text & Link */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaText">CTA Button Text (Optional)</Label>
                <Input
                  id="ctaText"
                  value={formData.ctaText}
                  onChange={(e) => handleFieldChange('ctaText', e.target.value)}
                  placeholder="e.g., Explore Now"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaLink">CTA Link (Optional)</Label>
                <Input
                  id="ctaLink"
                  value={formData.ctaLink}
                  onChange={(e) => handleFieldChange('ctaLink', e.target.value)}
                  placeholder="/destinations/sigiriya"
                />
              </div>
            </div>

            {/* Order & Active Status */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Form Actions */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingSlide ? 'Update Slide' : 'Create Slide'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroSectionManager;
