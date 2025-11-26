
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { type Lodge } from '@/services/wildlifeService';

interface LodgeModalProps {
  lodge: Lodge | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const LodgeModal: React.FC<LodgeModalProps> = ({ lodge, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: lodge?.name || '',
    location: lodge?.location || '',
    description: lodge?.description || '',
    price_per_night: lodge?.price_per_night || 0,
    capacity: lodge?.capacity || 2,
    features: lodge?.features?.join(', ') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save to Supabase
    console.log('Saving lodge:', formData);
    onSave();
    onClose();
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {lodge ? 'Edit Lodge' : 'Add New Lodge'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Lodge Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price per Night</Label>
              <Input
                id="price"
                type="number"
                value={formData.price_per_night}
                onChange={(e) => handleChange('price_per_night', Number(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleChange('capacity', Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Input
              id="features"
              value={formData.features}
              onChange={(e) => handleChange('features', e.target.value)}
              placeholder="e.g., Private Pool, Spa, Wildlife Views"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Save Lodge
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LodgeModal;
