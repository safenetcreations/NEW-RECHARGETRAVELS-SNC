import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Destination {
  id: string;
  name: string;
  category: string;
  price: number;
  title: string;
  description: string;
  duration: string;
  rating: number;
  features: string[];
  image: string;
  is_active: boolean;
  created_at: string;
}

interface FeaturedDestinationFormProps {
  destination: Destination | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const FeaturedDestinationForm: React.FC<FeaturedDestinationFormProps> = ({ destination, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(destination || {});

  useEffect(() => {
    setFormData(destination || {});
  }, [destination]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input name="name" value={formData.name || ''} onChange={handleChange} />
      </div>
      <div>
        <Label>Category</Label>
        <Input name="category" value={formData.category || ''} onChange={handleChange} />
      </div>
      <div>
        <Label>Price</Label>
        <Input name="price" type="number" value={formData.price || ''} onChange={handleChange} />
      </div>
      <div>
        <Label>Title</Label>
        <Input name="title" value={formData.title || ''} onChange={handleChange} />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea name="description" value={formData.description || ''} onChange={handleChange} />
      </div>
      <div>
        <Label>Duration</Label>
        <Input name="duration" value={formData.duration || ''} onChange={handleChange} />
      </div>
      <div>
        <Label>Rating</Label>
        <Input name="rating" type="number" value={formData.rating || ''} onChange={handleChange} />
      </div>
      <div>
        <Label>Image URL</Label>
        <Input name="image" value={formData.image || ''} onChange={handleChange} />
      </div>
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default FeaturedDestinationForm;