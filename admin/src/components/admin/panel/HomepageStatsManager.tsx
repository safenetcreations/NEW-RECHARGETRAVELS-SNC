/**
 * Homepage Stats Manager
 * Admin interface for managing homepage statistics and metrics
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, TrendingUp, GripVertical } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { homepageStatsService } from '@/services/cmsService';
import { HomepageStat, HomepageStatFormData } from '@/types/cms';

const HomepageStatsManager: React.FC = () => {
  const [stats, setStats] = useState<HomepageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<HomepageStat | null>(null);
  const [formData, setFormData] = useState<HomepageStatFormData>({
    label: '',
    value: '',
    icon: '',
    order: 0,
    isActive: true,
  });

  // Load all stats
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await homepageStatsService.getAll();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingStat) {
        // Update existing stat
        const response = await homepageStatsService.update(editingStat.id, formData);
        if (response.success) {
          toast.success('Stat updated successfully');
          loadStats();
          closeDialog();
        } else {
          toast.error(response.error || 'Failed to update stat');
        }
      } else {
        // Create new stat
        const response = await homepageStatsService.create(formData);
        if (response.success) {
          toast.success('Stat created successfully');
          loadStats();
          closeDialog();
        } else {
          toast.error(response.error || 'Failed to create stat');
        }
      }
    } catch (error) {
      console.error('Error saving stat:', error);
      toast.error('An error occurred while saving the stat');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stat?')) {
      return;
    }

    try {
      const response = await homepageStatsService.delete(id);
      if (response.success) {
        toast.success('Stat deleted successfully');
        loadStats();
      } else {
        toast.error(response.error || 'Failed to delete stat');
      }
    } catch (error) {
      console.error('Error deleting stat:', error);
      toast.error('An error occurred while deleting the stat');
    }
  };

  // Handle toggle active status
  const toggleActive = async (stat: HomepageStat) => {
    try {
      const response = await homepageStatsService.update(stat.id, {
        isActive: !stat.isActive,
      });
      if (response.success) {
        toast.success(`Stat ${stat.isActive ? 'deactivated' : 'activated'} successfully`);
        loadStats();
      } else {
        toast.error(response.error || 'Failed to update stat status');
      }
    } catch (error) {
      console.error('Error toggling stat status:', error);
      toast.error('An error occurred while updating the stat');
    }
  };

  // Open dialog for editing
  const openEditDialog = (stat: HomepageStat) => {
    setEditingStat(stat);
    setFormData({
      label: stat.label,
      value: stat.value,
      icon: stat.icon || '',
      order: stat.order,
      isActive: stat.isActive,
    });
    setIsDialogOpen(true);
  };

  // Open dialog for creating
  const openCreateDialog = () => {
    setEditingStat(null);
    setFormData({
      label: '',
      value: '',
      icon: '',
      order: stats.length,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  // Close dialog and reset form
  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingStat(null);
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof HomepageStatFormData, value: any) => {
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
          <h2 className="text-3xl font-bold text-gray-900">Homepage Stats Manager</h2>
          <p className="text-gray-600 mt-1">Manage statistics displayed on the homepage</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Stat
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {stats.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No stats yet</h3>
            <p className="text-gray-600 mb-6">Add statistics to showcase your achievements</p>
            <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add First Stat
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className={`relative group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 hover:shadow-lg transition-all ${
                  !stat.isActive ? 'opacity-60' : ''
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

                {/* Icon (if provided) */}
                {stat.icon && (
                  <div className="text-4xl mb-3 text-center">{stat.icon}</div>
                )}

                {/* Value */}
                <div className="text-4xl font-bold text-gray-900 text-center mb-2">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-sm text-gray-600 text-center mb-4">
                  {stat.label}
                </div>

                {/* Status & Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  {/* Status Badge */}
                  {stat.isActive ? (
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
                      onClick={() => toggleActive(stat)}
                      title={stat.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {stat.isActive ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(stat)}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(stat.id)}
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
              {editingStat ? 'Edit Stat' : 'Add New Stat'}
            </DialogTitle>
            <DialogDescription>
              {editingStat
                ? 'Update the stat details below'
                : 'Add a new statistic to showcase on the homepage'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => handleFieldChange('label', e.target.value)}
                placeholder="e.g., Happy Travelers"
                required
              />
              <p className="text-sm text-gray-500">
                The description shown below the value
              </p>
            </div>

            {/* Value */}
            <div className="space-y-2">
              <Label htmlFor="value">Value *</Label>
              <Input
                id="value"
                value={formData.value}
                onChange={(e) => handleFieldChange('value', e.target.value)}
                placeholder="e.g., 2,847+ or 4.9/5 or 98%"
                required
              />
              <p className="text-sm text-gray-500">
                The main statistic value (can include symbols)
              </p>
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (Emoji - Optional)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => handleFieldChange('icon', e.target.value)}
                placeholder="e.g., 📈 or ⭐"
              />
              <p className="text-sm text-gray-500">
                Optional emoji to display above the stat
              </p>
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

            {/* Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-600 mb-3 font-medium">Preview</p>
              {formData.icon && (
                <div className="text-4xl mb-3">{formData.icon}</div>
              )}
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {formData.value || '0'}
              </div>
              <div className="text-sm text-gray-600">
                {formData.label || 'Stat Label'}
              </div>
            </div>

            {/* Form Actions */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingStat ? 'Update Stat' : 'Add Stat'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomepageStatsManager;
