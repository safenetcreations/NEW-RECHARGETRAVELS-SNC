import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FeaturedDestination, FeaturedDestinationFormData, HeroImage } from '@/types/cms';
import ImageUpload from '@/components/ui/image-upload';
import { Plus, Trash2, Image as ImageIcon, Edit2 } from 'lucide-react';

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
    images: [],
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
        images: destination.images || [],
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

      {/* Hero Images Section - Up to 5 images with titles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Hero Images with Titles (16:9 format, up to 5)</Label>
          <span className="text-sm text-gray-500">{formData.images.length}/5 images</span>
        </div>

        {/* Display existing images with title/subtitle editing */}
        <div className="space-y-4">
          {formData.images.map((img, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex gap-4">
                {/* Image Preview */}
                <div className="relative w-48 flex-shrink-0">
                  <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                    <img src={img.url} alt={img.title || `Hero ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    {index + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, images: newImages, image: newImages[0]?.url || '' }));
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Title and Subtitle Fields */}
                <div className="flex-1 space-y-3">
                  <div>
                    <Label className="text-sm">Image {index + 1} Title (displays over image)</Label>
                    <Input
                      value={img.title}
                      onChange={(e) => {
                        const newImages = [...formData.images];
                        newImages[index] = { ...newImages[index], title: e.target.value };
                        setFormData(prev => ({ ...prev, images: newImages }));
                      }}
                      placeholder="e.g., Discover Sigiriya"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Image {index + 1} Subtitle (displays below title)</Label>
                    <Input
                      value={img.subtitle}
                      onChange={(e) => {
                        const newImages = [...formData.images];
                        newImages[index] = { ...newImages[index], subtitle: e.target.value };
                        setFormData(prev => ({ ...prev, images: newImages }));
                      }}
                      placeholder="e.g., Ancient Rock Fortress"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add new image slot */}
        {formData.images.length < 5 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-3">Add Image {formData.images.length + 1} of 5</p>
            <ImageUpload
              value=""
              onChange={(url) => {
                if (url && formData.images.length < 5) {
                  const newImage: HeroImage = {
                    url: url,
                    title: `Discover ${formData.name || 'Destination'}`,
                    subtitle: ''
                  };
                  const newImages = [...formData.images, newImage];
                  setFormData(prev => ({
                    ...prev,
                    images: newImages,
                    image: newImages[0]?.url || url
                  }));
                }
              }}
              onRemove={() => {}}
              folder="destinations"
              helperText="Recommended: 1920x1080px (16:9 ratio). Max: 10MB. Formats: JPG, PNG, WEBP"
            />
          </div>
        )}

        <p className="text-xs text-gray-500">
          Each image can have its own title and subtitle that displays as an overlay. First image will be used as the primary/thumbnail.
        </p>
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