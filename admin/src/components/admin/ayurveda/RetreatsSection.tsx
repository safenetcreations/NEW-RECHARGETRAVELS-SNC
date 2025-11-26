import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Tent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  getAllRetreats,
  createRetreat,
  updateRetreat,
  deleteRetreat,
  Retreat
} from '@/services/ayurveda/ayurvedaService';

const categories = [
  'Detox & Purification',
  'Mind & Body',
  'Inner Peace',
  'Anti-Aging',
  'Together',
  'Ultimate Experience'
];

const RetreatsSection: React.FC = () => {
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRetreat, setSelectedRetreat] = useState<Retreat | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    duration: '',
    description: '',
    price: 0,
    image: '',
    order: 1,
    isActive: true
  });

  useEffect(() => {
    loadRetreats();
  }, []);

  const loadRetreats = async () => {
    setLoading(true);
    const { data, error } = await getAllRetreats();
    if (data) {
      setRetreats(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      duration: '',
      description: '',
      price: 0,
      image: '',
      order: retreats.length + 1,
      isActive: true
    });
    setSelectedRetreat(null);
  };

  const openModal = (retreat?: Retreat) => {
    if (retreat) {
      setSelectedRetreat(retreat);
      setFormData({
        title: retreat.title,
        category: retreat.category,
        duration: retreat.duration,
        description: retreat.description,
        price: retreat.price,
        image: retreat.image,
        order: retreat.order,
        isActive: retreat.isActive
      });
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);

    if (selectedRetreat?.id) {
      const { error } = await updateRetreat(selectedRetreat.id, formData);
      if (error) {
        toast.error('Failed to update retreat');
      } else {
        toast.success('Retreat updated successfully!');
        loadRetreats();
        setModalOpen(false);
      }
    } else {
      const { error } = await createRetreat(formData);
      if (error) {
        toast.error('Failed to create retreat');
      } else {
        toast.success('Retreat created successfully!');
        loadRetreats();
        setModalOpen(false);
      }
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!selectedRetreat?.id) return;

    const { error } = await deleteRetreat(selectedRetreat.id);
    if (error) {
      toast.error('Failed to delete retreat');
    } else {
      toast.success('Retreat deleted successfully!');
      loadRetreats();
    }
    setDeleteDialogOpen(false);
    setSelectedRetreat(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-emerald-900">
            <Tent className="w-5 h-5" />
            Manage Retreats
          </CardTitle>
          <Button
            onClick={() => openModal()}
            className="bg-amber-500 hover:bg-amber-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Retreat
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          ) : retreats.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Tent className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No retreats found. Click "Add Retreat" to create one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Image</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Title</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Duration</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {retreats.map((retreat) => (
                    <tr key={retreat.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <img
                          src={retreat.image}
                          alt={retreat.title}
                          className="w-16 h-12 object-cover rounded-md"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{retreat.title}</td>
                      <td className="py-3 px-4 text-gray-600">{retreat.category}</td>
                      <td className="py-3 px-4 text-gray-600">{retreat.duration}</td>
                      <td className="py-3 px-4 text-gray-600">${retreat.price.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModal(retreat)}
                            className="border-emerald-200 hover:bg-emerald-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRetreat(retreat);
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRetreat ? 'Edit Retreat' : 'Add New Retreat'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Panchakarma Detox"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 7-14 Days"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the retreat experience..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                  placeholder="2500"
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

            <div className="space-y-2">
              <Label htmlFor="image">Image URL *</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg mt-2"
                />
              )}
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
              {saving ? 'Saving...' : 'Save Retreat'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Retreat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedRetreat?.title}"? This action cannot be undone.
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

export default RetreatsSection;
