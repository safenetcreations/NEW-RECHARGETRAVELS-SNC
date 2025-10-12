/**
 * Why Choose Us Manager
 * Admin interface for managing "Why Choose Us" features and benefits
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, CheckCircle, GripVertical } from 'lucide-react';
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
import { whyChooseUsService } from '@/services/cmsService';
import { WhyChooseUsFeature, WhyChooseUsFormData } from '@/types/cms';

const WhyChooseUsManager: React.FC = () => {
  const [features, setFeatures] = useState<WhyChooseUsFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<WhyChooseUsFeature | null>(null);
  const [formData, setFormData] = useState<WhyChooseUsFormData>({
    icon: '',
    title: '',
    description: '',
    order: 0,
    isActive: true,
  });

  // Load all features
  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      const data = await whyChooseUsService.getAll();
      setFeatures(data);
    } catch (error) {
      console.error('Error loading features:', error);
      toast.error('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingFeature) {
        // Update existing feature
        const response = await whyChooseUsService.update(editingFeature.id, formData);
        if (response.success) {
          toast.success('Feature updated successfully');
          loadFeatures();
          closeDialog();
        } else {
          toast.error(response.error || 'Failed to update feature');
        }
      } else {
        // Create new feature
        const response = await whyChooseUsService.create(formData);
        if (response.success) {
          toast.success('Feature created successfully');
          loadFeatures();
          closeDialog();
        } else {
          toast.error(response.error || 'Failed to create feature');
        }
      }
    } catch (error) {
      console.error('Error saving feature:', error);
      toast.error('An error occurred while saving the feature');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) {
      return;
    }

    try {
      const response = await whyChooseUsService.delete(id);
      if (response.success) {
        toast.success('Feature deleted successfully');
        loadFeatures();
      } else {
        toast.error(response.error || 'Failed to delete feature');
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error('An error occurred while deleting the feature');
    }
  };

  // Handle toggle active status
  const toggleActive = async (feature: WhyChooseUsFeature) => {
    try {
      const response = await whyChooseUsService.update(feature.id, {
        isActive: !feature.isActive,
      });
      if (response.success) {
        toast.success(`Feature ${feature.isActive ? 'deactivated' : 'activated'} successfully`);
        loadFeatures();
      } else {
        toast.error(response.error || 'Failed to update feature status');
      }
    } catch (error) {
      console.error('Error toggling feature status:', error);
      toast.error('An error occurred while updating the feature');
    }
  };

  // Open dialog for editing
  const openEditDialog = (feature: WhyChooseUsFeature) => {
    setEditingFeature(feature);
    setFormData({
      icon: feature.icon,
      title: feature.title,
      description: feature.description,
      order: feature.order,
      isActive: feature.isActive,
    });
    setIsDialogOpen(true);
  };

  // Open dialog for creating
  const openCreateDialog = () => {
    setEditingFeature(null);
    setFormData({
      icon: '',
      title: '',
      description: '',
      order: features.length,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  // Close dialog and reset form
  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingFeature(null);
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof WhyChooseUsFormData, value: any) => {
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
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Us Manager</h2>
          <p className="text-gray-600 mt-1">Manage features and benefits that make you stand out</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Feature
        </Button>
      </div>

      {/* Features Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {features.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No features yet</h3>
            <p className="text-gray-600 mb-6">Add features that highlight why customers should choose you</p>
            <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add First Feature
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`relative group bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all ${
                  !feature.isActive ? 'opacity-60' : ''
                }`}
              >
                {/* Drag Handle */}
                <div className="absolute top-3 left-3 cursor-move text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Order Number */}
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="text-4xl mb-4">{feature.icon}</div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{feature.description}</p>

                {/* Status & Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  {/* Status Badge */}
                  {feature.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Inactive
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(feature)}
                      title={feature.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {feature.isActive ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(feature)}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(feature.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
              {editingFeature ? 'Edit Feature' : 'Add New Feature'}
            </DialogTitle>
            <DialogDescription>
              {editingFeature
                ? 'Update the feature details below'
                : 'Add a new feature or benefit'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Icon */}
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (Emoji or Text) *</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => handleFieldChange('icon', e.target.value)}
                placeholder="e.g., ⭐ or 🎯 or Icon Name"
                required
              />
              <p className="text-sm text-gray-500">
                Enter an emoji, symbol, or lucide-react icon name
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="e.g., 24/7 Customer Support"
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
                placeholder="Brief description of this feature..."
                rows={3}
                required
              />
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
                {editingFeature ? 'Update Feature' : 'Add Feature'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WhyChooseUsManager;
