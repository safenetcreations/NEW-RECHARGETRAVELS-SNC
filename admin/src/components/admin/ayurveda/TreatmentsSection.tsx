import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  getAllTreatments,
  createTreatment,
  updateTreatment,
  deleteTreatment,
  Treatment
} from '@/services/ayurveda/ayurvedaService';

const TreatmentsSection: React.FC = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
    order: 1,
    isActive: true
  });

  useEffect(() => {
    loadTreatments();
  }, []);

  const loadTreatments = async () => {
    setLoading(true);
    const { data } = await getAllTreatments();
    if (data) {
      setTreatments(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      icon: '',
      description: '',
      order: treatments.length + 1,
      isActive: true
    });
    setSelectedTreatment(null);
  };

  const openModal = (treatment?: Treatment) => {
    if (treatment) {
      setSelectedTreatment(treatment);
      setFormData({
        name: treatment.name,
        icon: treatment.icon,
        description: treatment.description,
        order: treatment.order,
        isActive: treatment.isActive
      });
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.icon || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);

    if (selectedTreatment?.id) {
      const { error } = await updateTreatment(selectedTreatment.id, formData);
      if (error) {
        toast.error('Failed to update treatment');
      } else {
        toast.success('Treatment updated successfully!');
        loadTreatments();
        setModalOpen(false);
      }
    } else {
      const { error } = await createTreatment(formData);
      if (error) {
        toast.error('Failed to create treatment');
      } else {
        toast.success('Treatment created successfully!');
        loadTreatments();
        setModalOpen(false);
      }
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!selectedTreatment?.id) return;

    const { error } = await deleteTreatment(selectedTreatment.id);
    if (error) {
      toast.error('Failed to delete treatment');
    } else {
      toast.success('Treatment deleted successfully!');
      loadTreatments();
    }
    setDeleteDialogOpen(false);
    setSelectedTreatment(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-emerald-900">
            <Sparkles className="w-5 h-5" />
            Manage Treatments
          </CardTitle>
          <Button
            onClick={() => openModal()}
            className="bg-amber-500 hover:bg-amber-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Treatment
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          ) : treatments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No treatments found. Click "Add Treatment" to create one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Icon</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Description</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.map((treatment) => (
                    <tr key={treatment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="text-amber-600 font-mono text-sm">{treatment.icon}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{treatment.name}</td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{treatment.description}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModal(treatment)}
                            className="border-emerald-200 hover:bg-emerald-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTreatment(treatment);
                              setDeleteDialogOpen(true);
                            }}
                            className="border-red-200 hover:bg-red-50 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedTreatment ? 'Edit Treatment' : 'Add New Treatment'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Treatment Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Shirodhara"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon Name (Lucide) *</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="e.g., droplets, hand, sparkles"
              />
              <p className="text-xs text-gray-500">
                Browse icons at{' '}
                <a
                  href="https://lucide.dev/icons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:underline"
                >
                  lucide.dev/icons
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the treatment..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                placeholder="1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {saving ? 'Saving...' : 'Save Treatment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Treatment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTreatment?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TreatmentsSection;
