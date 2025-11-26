import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Hotel } from '../../../services/firebaseHotelService';

interface HotelFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Hotel>) => void;
  hotel?: Hotel | null;
}

const HotelFormDialog: React.FC<HotelFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  hotel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_per_night: 0,
    category: '',
    destination: '',
    amenities: [] as string[],
    images: [] as string[],
    rating: 4.5,
    is_active: true,
  });

  const [currentAmenity, setCurrentAmenity] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const categories = [
    'Luxury',
    'Boutique',
    'Budget',
    'Beach Resort',
    'Eco Lodge',
  ];

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || '',
        description: hotel.description || '',
        price_per_night: hotel.price_per_night || 0,
        category: hotel.category || '',
        destination: hotel.destination || '',
        amenities: hotel.amenities || [],
        images: hotel.images?.map((img: any) => (typeof img === 'string' ? img : img.url)) || [],
        rating: hotel.rating || 4.5,
        is_active: hotel.is_active !== undefined ? hotel.is_active : true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price_per_night: 0,
        category: '',
        destination: '',
        amenities: [],
        images: [],
        rating: 4.5,
        is_active: true,
      });
    }
  }, [hotel, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  const addAmenity = () => {
    if (currentAmenity.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, currentAmenity.trim()],
      }));
      setCurrentAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter a hotel name');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a hotel description');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.destination.trim()) {
      toast.error('Please enter a destination');
      return;
    }
    if (formData.price_per_night <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {hotel ? 'Edit Hotel' : 'Create New Hotel'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Hotel Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., The Grand Hotel"
                  required
                />
              </div>

              <div>
                <Label htmlFor="destination">Destination *</Label>
                <Input
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g., Kandy"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price_per_night">Price per Night ($) *</Label>
                <Input
                  id="price_per_night"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.price_per_night}
                  onChange={(e) => handleNumberChange('price_per_night', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => handleNumberChange('rating', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a detailed description of the hotel..."
                rows={6}
                required
                className="resize-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Amenities</h3>
            <div className="flex gap-2">
              <Input
                value={currentAmenity}
                onChange={(e) => setCurrentAmenity(e.target.value)}
                placeholder="e.g., Wifi, Pool, Gym"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              />
              <Button type="button" onClick={addAmenity} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((item, index) => (
                <div
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span className="text-sm">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeAmenity(index)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Images</h3>
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <Button type="button" onClick={addImageUrl} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {formData.images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Hotel image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              {formData.is_active ? 'Active' : 'Inactive'} - Hotel visible to customers
            </Label>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {hotel ? 'Update Hotel' : 'Create Hotel'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HotelFormDialog;
