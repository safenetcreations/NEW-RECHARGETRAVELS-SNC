import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FeaturedDestination, FeaturedDestinationFormData } from '@/types/cms';

interface FeaturedDestinationFormProps {
  destination: FeaturedDestination | null;
  onSubmit: (data: FeaturedDestinationFormData) => void;
  onCancel: () => void;
}

const FeaturedDestinationForm: React.FC<FeaturedDestinationFormProps> = ({ destination, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<FeaturedDestinationFormData>({
    name: '',
    category: '',
    price: 0,
    currency: '$',
    title: '',
    description: '',
    duration: '',
    rating: 5,
    features: [],
    image: '',
    isActive: true,
    isFeatured: false,
    order: 0,
    bestTimeToVisit: '',
    popularActivities: [],
    link: ''
  });

  useEffect(() => {
    if (destination) {
      setFormData({
        name: destination.name,
        category: destination.category,
        price: destination.price || 0,
        currency: destination.currency || '$',
        title: destination.title || '',
        description: destination.description,
        duration: destination.duration || '',
        rating: destination.rating || 5,
        features: destination.features || [],
        image: destination.image,
        isActive: destination.isActive,
        isFeatured: destination.isFeatured,
        order: destination.order,
        bestTimeToVisit: destination.bestTimeToVisit || '',
        popularActivities: destination.popularActivities || [],
        link: destination.link || ''
      });
    }
  }, [destination]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const features = e.target.value.split(',').map(f => f.trim()).filter(f => f);
    setFormData(prev => ({ ...prev, features }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label>Category</Label>
          <Input name="category" value={formData.category} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Price</Label>
          <Input name="price" type="number" value={formData.price} onChange={handleNumberChange} />
        </div>
        <div>
          <Label>Currency</Label>
          <Input name="currency" value={formData.currency} onChange={handleChange} />
        </div>
        <div>
          <Label>Duration</Label>
          <Input name="duration" value={formData.duration} onChange={handleChange} />
        </div>
      </div>

      <div>
        <Label>Title</Label>
        <Input name="title" value={formData.title} onChange={handleChange} />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea name="description" value={formData.description} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Rating (0-5)</Label>
          <Input name="rating" type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={handleNumberChange} />
        </div>
        <div>
          <Label>Order</Label>
          <Input name="order" type="number" value={formData.order} onChange={handleNumberChange} />
        </div>
      </div>

      <div>
        <Label>Image URL</Label>
        <Input name="image" value={formData.image} onChange={handleChange} required />
      </div>

      <div>
        <Label>Features (comma separated)</Label>
        <Input name="features" value={formData.features.join(', ')} onChange={handleFeaturesChange} />
      </div>

      <div>
        <Label>Best Time to Visit</Label>
        <Input name="bestTimeToVisit" value={formData.bestTimeToVisit} onChange={handleChange} />
      </div>

      <div className="flex gap-8">
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => handleSwitchChange('isFeatured', checked)}
          />
          <Label htmlFor="isFeatured">Featured</Label>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default FeaturedDestinationForm;