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
import { X, Sparkles, Upload, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Tour } from '../../../services/firebaseTourService';
import { aiService } from '@/services/aiService';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface TourFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Tour>) => void;
  tour?: Tour | null;
}

const TourFormDialog: React.FC<TourFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tour,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_days: 1,
    price_per_person: 0,
    category: '',
    destination: '',
    difficulty_level: 'Easy',
    max_group_size: 10,
    included_items: [] as string[],
    excluded_items: [] as string[],
    itinerary: [] as any[],
    images: [] as string[],
    rating: 4.5,
    is_active: true,
  });

  const [currentIncludedItem, setCurrentIncludedItem] = useState('');
  const [currentExcludedItem, setCurrentExcludedItem] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiDialog, setShowAiDialog] = useState(false);

  // Categories for tours
  const categories = [
    'Cultural Heritage',
    'Wildlife Safari',
    'Beach & Relaxation',
    'Adventure',
    'Wellness & Spa',
    'Culinary',
    'Photography',
    'Luxury',
    'Ecotourism',
    'Hill Country',
  ];

  const difficultyLevels = ['Easy', 'Moderate', 'Challenging', 'Extreme'];

  // Initialize form with tour data if editing
  useEffect(() => {
    if (tour) {
      setFormData({
        title: tour.title || '',
        description: tour.description || '',
        duration_days: tour.duration_days || 1,
        price_per_person: tour.price_per_person || 0,
        category: tour.category || '',
        destination: tour.destination || '',
        difficulty_level: tour.difficulty_level || 'Easy',
        max_group_size: tour.max_group_size || 10,
        included_items: tour.included_items || [],
        excluded_items: tour.excluded_items || [],
        itinerary: tour.itinerary || [],
        images: tour.images?.map((img: any) => (typeof img === 'string' ? img : img.url)) || [],
        rating: tour.rating || 4.5,
        is_active: tour.is_active !== undefined ? tour.is_active : true,
      });
    } else {
      // Reset form for new tour
      setFormData({
        title: '',
        description: '',
        duration_days: 1,
        price_per_person: 0,
        category: '',
        destination: '',
        difficulty_level: 'Easy',
        max_group_size: 10,
        included_items: [],
        excluded_items: [],
        itinerary: [],
        images: [],
        rating: 4.5,
        is_active: true,
      });
    }
  }, [tour, isOpen]);

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

  // Add included item
  const addIncludedItem = () => {
    if (currentIncludedItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        included_items: [...prev.included_items, currentIncludedItem.trim()],
      }));
      setCurrentIncludedItem('');
    }
  };

  // Remove included item
  const removeIncludedItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      included_items: prev.included_items.filter((_, i) => i !== index),
    }));
  };

  // Add excluded item
  const addExcludedItem = () => {
    if (currentExcludedItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        excluded_items: [...prev.excluded_items, currentExcludedItem.trim()],
      }));
      setCurrentExcludedItem('');
    }
  };

  // Remove excluded item
  const removeExcludedItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      excluded_items: prev.excluded_items.filter((_, i) => i !== index),
    }));
  };

  // Add image URL
  const addImageUrl = () => {
    if (imageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl('');
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Upload image to Firebase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Log file size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    console.log(`📁 Tour image: ${file.name}, Size: ${sizeInMB}MB`);
    toast.info(`Uploading ${sizeInMB}MB image...`);

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `tours/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, downloadURL],
      }));

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Generate content with AI
  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for AI generation');
      return;
    }

    setIsGenerating(true);
    toast.info('Generating content with AI...');

    const prompt = `
      Generate complete tour package details for: "${aiPrompt}".
      Return ONLY a valid JSON object (no markdown, no extra text) with this exact structure:
      {
        "title": "Tour name",
        "description": "Detailed 200-word description",
        "duration_days": 5,
        "price_per_person": 1299,
        "category": "Wildlife Safari",
        "destination": "Yala National Park",
        "difficulty_level": "Easy",
        "max_group_size": 12,
        "included_items": ["Hotel accommodation", "All meals", "Park entrance fees", "Professional guide"],
        "excluded_items": ["International flights", "Personal expenses", "Travel insurance"],
        "images": ["https://images.unsplash.com/photo-relevant-image-1", "https://images.unsplash.com/photo-relevant-image-2"]
      }
    `;

    try {
      const responseText = await aiService.generateContent(prompt);
      const cleanedJson = responseText.replace(/```json\n|```/g, '').trim();
      const generatedData = JSON.parse(cleanedJson);

      setFormData((prev) => ({
        ...prev,
        title: generatedData.title || prev.title,
        description: generatedData.description || prev.description,
        duration_days: generatedData.duration_days || prev.duration_days,
        price_per_person: generatedData.price_per_person || prev.price_per_person,
        category: generatedData.category || prev.category,
        destination: generatedData.destination || prev.destination,
        difficulty_level: generatedData.difficulty_level || prev.difficulty_level,
        max_group_size: generatedData.max_group_size || prev.max_group_size,
        included_items: generatedData.included_items || prev.included_items,
        excluded_items: generatedData.excluded_items || prev.excluded_items,
        images: generatedData.images || prev.images,
      }));

      toast.success('AI content generated successfully!');
      setShowAiDialog(false);
      setAiPrompt('');
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast.error('Failed to generate AI content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a tour title');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a tour description');
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
    if (formData.price_per_person <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    onSubmit(formData);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">
                {tour ? 'Edit Tour' : 'Create New Tour'}
              </DialogTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAiDialog(true)}
                className="text-purple-600 border-purple-300 hover:bg-purple-50"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Tour Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Yala Wildlife Safari Adventure"
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
                    placeholder="e.g., Yala National Park"
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
                  <Label htmlFor="difficulty_level">Difficulty Level</Label>
                  <Select
                    value={formData.difficulty_level}
                    onValueChange={(value) => handleSelectChange('difficulty_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration_days">Duration (Days) *</Label>
                  <Input
                    id="duration_days"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.duration_days}
                    onChange={(e) => handleNumberChange('duration_days', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price_per_person">Price per Person ($) *</Label>
                  <Input
                    id="price_per_person"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.price_per_person}
                    onChange={(e) => handleNumberChange('price_per_person', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="max_group_size">Max Group Size</Label>
                  <Input
                    id="max_group_size"
                    type="number"
                    min="1"
                    value={formData.max_group_size}
                    onChange={(e) => handleNumberChange('max_group_size', e.target.value)}
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
                  placeholder="Write a detailed description of the tour..."
                  rows={6}
                  required
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length} characters
                </p>
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Tour Images</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image-url">Add Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image-url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button type="button" onClick={addImageUrl} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="image-upload">Upload Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="cursor-pointer"
                    />
                    {isUploading && (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Tour image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Included Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                What's Included
              </h3>
              <div className="flex gap-2">
                <Input
                  value={currentIncludedItem}
                  onChange={(e) => setCurrentIncludedItem(e.target.value)}
                  placeholder="e.g., Hotel accommodation, All meals, Park fees"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncludedItem())}
                />
                <Button type="button" onClick={addIncludedItem} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.included_items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeIncludedItem(index)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Excluded Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                What's Not Included
              </h3>
              <div className="flex gap-2">
                <Input
                  value={currentExcludedItem}
                  onChange={(e) => setCurrentExcludedItem(e.target.value)}
                  placeholder="e.g., International flights, Travel insurance"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExcludedItem())}
                />
                <Button type="button" onClick={addExcludedItem} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.excluded_items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeExcludedItem(index)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2 pt-4 border-t">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                {formData.is_active ? 'Active' : 'Inactive'} - Tour visible to customers
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
                {tour ? 'Update Tour' : 'Create Tour'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* AI Generation Dialog */}
      <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Tour with AI</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Describe the tour you want to create and AI will generate all the details for you.
            </p>
            <Textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., A 7-day luxury safari in Yala National Park with leopard tracking and beach relaxation"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAiDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerateWithAI}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TourFormDialog;
