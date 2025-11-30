// Global Tour Form Dialog Component
// Create/Edit form for global tours

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Trash2,
  X,
  Save,
  Image as ImageIcon,
  Globe,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  List,
  FileText,
  Settings,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import {
  GlobalTour,
  TourRegion,
  TourCategory,
  TourItineraryDay
} from '../../../services/globalTourAdminService';

interface GlobalTourFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tourData: Partial<GlobalTour>) => Promise<void>;
  tour: GlobalTour | null;
}

const regionOptions: { value: TourRegion; label: string }[] = [
  { value: 'sri-lanka', label: 'Sri Lanka' },
  { value: 'maldives', label: 'Maldives' },
  { value: 'india', label: 'India' },
  { value: 'southeast-asia', label: 'Southeast Asia' },
  { value: 'worldwide', label: 'Worldwide' }
];

const categoryOptions: { value: TourCategory; label: string }[] = [
  { value: 'wildlife', label: 'Wildlife Safari' },
  { value: 'cultural', label: 'Cultural Heritage' },
  { value: 'beach', label: 'Beach & Relaxation' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'wellness', label: 'Wellness & Spa' },
  { value: 'heritage', label: 'Heritage Sites' },
  { value: 'pilgrimage', label: 'Pilgrimage' },
  { value: 'honeymoon', label: 'Honeymoon' },
  { value: 'family', label: 'Family Friendly' },
  { value: 'luxury', label: 'Luxury' }
];

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const GlobalTourFormDialog: React.FC<GlobalTourFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tour
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Form state
  const [formData, setFormData] = useState<Partial<GlobalTour>>({
    title: '',
    subtitle: '',
    slug: '',
    region: 'sri-lanka',
    country: 'Sri Lanka',
    location: '',
    category: 'cultural',
    duration: { days: 1, nights: 0 },
    priceUSD: 0,
    pricePerPersonUSD: 0,
    originalPriceUSD: 0,
    description: '',
    shortDescription: '',
    highlights: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    heroImage: '',
    imageGallery: [],
    videoUrl: '',
    minGroupSize: 2,
    maxGroupSize: 12,
    rating: 4.5,
    reviewCount: 0,
    isFeatured: false,
    isPopular: false,
    isActive: true,
    sortOrder: 0,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: []
  });

  // Temporary input states for list items
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  // Load tour data when editing
  useEffect(() => {
    if (tour) {
      setFormData({
        ...tour,
        highlights: tour.highlights || [],
        itinerary: tour.itinerary || [],
        inclusions: tour.inclusions || [],
        exclusions: tour.exclusions || [],
        imageGallery: tour.imageGallery || [],
        seoKeywords: tour.seoKeywords || []
      });
    } else {
      // Reset form for new tour
      setFormData({
        title: '',
        subtitle: '',
        slug: '',
        region: 'sri-lanka',
        country: 'Sri Lanka',
        location: '',
        category: 'cultural',
        duration: { days: 1, nights: 0 },
        priceUSD: 0,
        pricePerPersonUSD: 0,
        originalPriceUSD: 0,
        description: '',
        shortDescription: '',
        highlights: [],
        itinerary: [],
        inclusions: [],
        exclusions: [],
        heroImage: '',
        imageGallery: [],
        videoUrl: '',
        minGroupSize: 2,
        maxGroupSize: 12,
        rating: 4.5,
        reviewCount: 0,
        isFeatured: false,
        isPopular: false,
        isActive: true,
        sortOrder: 0,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: []
      });
    }
    setActiveTab('basic');
  }, [tour, isOpen]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !tour) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title || '')
      }));
    }
  }, [formData.title, tour]);

  // Update country based on region
  useEffect(() => {
    const countryMap: Record<TourRegion, string> = {
      'sri-lanka': 'Sri Lanka',
      'maldives': 'Maldives',
      'india': 'India',
      'southeast-asia': 'Southeast Asia',
      'worldwide': 'Multiple Countries'
    };
    if (formData.region) {
      setFormData(prev => ({
        ...prev,
        country: countryMap[formData.region as TourRegion]
      }));
    }
  }, [formData.region]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDurationChange = (field: 'days' | 'nights', value: number) => {
    setFormData(prev => ({
      ...prev,
      duration: {
        ...prev.duration!,
        [field]: value
      }
    }));
  };

  // List management functions
  const addInclusion = () => {
    if (newInclusion.trim()) {
      setFormData(prev => ({
        ...prev,
        inclusions: [...(prev.inclusions || []), newInclusion.trim()]
      }));
      setNewInclusion('');
    }
  };

  const removeInclusion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions?.filter((_, i) => i !== index)
    }));
  };

  const addExclusion = () => {
    if (newExclusion.trim()) {
      setFormData(prev => ({
        ...prev,
        exclusions: [...(prev.exclusions || []), newExclusion.trim()]
      }));
      setNewExclusion('');
    }
  };

  const removeExclusion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exclusions: prev.exclusions?.filter((_, i) => i !== index)
    }));
  };

  const addGalleryImage = () => {
    if (newGalleryImage.trim()) {
      setFormData(prev => ({
        ...prev,
        imageGallery: [...(prev.imageGallery || []), newGalleryImage.trim()]
      }));
      setNewGalleryImage('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageGallery: prev.imageGallery?.filter((_, i) => i !== index)
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setFormData(prev => ({
        ...prev,
        seoKeywords: [...(prev.seoKeywords || []), newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: prev.seoKeywords?.filter((_, i) => i !== index)
    }));
  };

  // Highlight management
  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [
        ...(prev.highlights || []),
        { title: '', description: '', icon: 'Star' }
      ]
    }));
  };

  const updateHighlight = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights?.map((h, i) =>
        i === index ? { ...h, [field]: value } : h
      )
    }));
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights?.filter((_, i) => i !== index)
    }));
  };

  // Itinerary management
  const addItineraryDay = () => {
    const nextDay = (formData.itinerary?.length || 0) + 1;
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...(prev.itinerary || []),
        {
          day: nextDay,
          title: `Day ${nextDay}`,
          description: '',
          activities: [],
          meals: { breakfast: true, lunch: true, dinner: true },
          accommodation: '',
          location: ''
        }
      ]
    }));
  };

  const updateItineraryDay = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary?.map((day, i) =>
        i === index ? { ...day, [field]: value } : day
      )
    }));
  };

  const removeItineraryDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary?.filter((_, i) => i !== index).map((day, i) => ({
        ...day,
        day: i + 1
      }))
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title?.trim()) {
      toast.error('Tour title is required');
      setActiveTab('basic');
      return;
    }
    if (!formData.location?.trim()) {
      toast.error('Location is required');
      setActiveTab('basic');
      return;
    }
    if (!formData.priceUSD || formData.priceUSD <= 0) {
      toast.error('Price must be greater than 0');
      setActiveTab('pricing');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting tour:', error);
      toast.error('Failed to save tour');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Globe className="w-6 h-6 text-emerald-600" />
            {tour ? 'Edit Tour' : 'Create New Tour'}
          </DialogTitle>
          <DialogDescription>
            {tour ? 'Update tour details below' : 'Fill in the details to create a new global tour'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="basic">
                <FileText className="w-4 h-4 mr-2" /> Basic
              </TabsTrigger>
              <TabsTrigger value="pricing">
                <DollarSign className="w-4 h-4 mr-2" /> Pricing
              </TabsTrigger>
              <TabsTrigger value="content">
                <List className="w-4 h-4 mr-2" /> Content
              </TabsTrigger>
              <TabsTrigger value="itinerary">
                <Calendar className="w-4 h-4 mr-2" /> Itinerary
              </TabsTrigger>
              <TabsTrigger value="media">
                <ImageIcon className="w-4 h-4 mr-2" /> Media
              </TabsTrigger>
              <TabsTrigger value="seo">
                <Search className="w-4 h-4 mr-2" /> SEO
              </TabsTrigger>
            </TabsList>

            {/* Basic Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Tour Title *</Label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., 7-Day Cultural Triangle & Wildlife Safari"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={formData.subtitle || ''}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    placeholder="e.g., Explore Ancient Heritage & Wild Encounters"
                  />
                </div>
                <div>
                  <Label>URL Slug</Label>
                  <Input
                    value={formData.slug || ''}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="7-day-cultural-triangle"
                  />
                </div>
                <div>
                  <Label>Location *</Label>
                  <Input
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Colombo, Sigiriya, Kandy"
                  />
                </div>
                <div>
                  <Label>Region</Label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {regionOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Category</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Duration (Days)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.duration?.days || 1}
                    onChange={(e) => handleDurationChange('days', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <Label>Duration (Nights)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.duration?.nights || 0}
                    onChange={(e) => handleDurationChange('nights', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Min Group Size</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.minGroupSize || 2}
                    onChange={(e) => handleInputChange('minGroupSize', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <Label>Max Group Size</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.maxGroupSize || 12}
                    onChange={(e) => handleInputChange('maxGroupSize', parseInt(e.target.value) || 12)}
                  />
                </div>
              </div>

              <div className="col-span-2">
                <Label>Short Description</Label>
                <Textarea
                  value={formData.shortDescription || ''}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="Brief summary of the tour..."
                  rows={2}
                />
              </div>

              <div className="col-span-2">
                <Label>Full Description</Label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the tour experience..."
                  rows={5}
                />
              </div>

              <div className="flex gap-6 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                  />
                  <Label>Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => handleInputChange('isPopular', checked)}
                  />
                  <Label>Popular</Label>
                </div>
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Price (USD) *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.priceUSD || ''}
                    onChange={(e) => handleInputChange('priceUSD', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Price Per Person (USD)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.pricePerPersonUSD || ''}
                    onChange={(e) => handleInputChange('pricePerPersonUSD', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Original Price (USD)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.originalPriceUSD || ''}
                    onChange={(e) => handleInputChange('originalPriceUSD', parseFloat(e.target.value) || 0)}
                    placeholder="For showing discount"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label>Rating (0-5)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating || 4.5}
                    onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Review Count</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.reviewCount || 0}
                    onChange={(e) => handleInputChange('reviewCount', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.sortOrder || 0}
                  onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
                  className="w-32"
                />
                <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              {/* Highlights */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-lg font-semibold">Tour Highlights</Label>
                  <Button type="button" size="sm" onClick={addHighlight}>
                    <Plus className="w-4 h-4 mr-1" /> Add Highlight
                  </Button>
                </div>
                {formData.highlights?.map((highlight, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-start p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Title"
                        value={highlight.title}
                        onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                      />
                      <Input
                        placeholder="Description"
                        value={highlight.description}
                        className="col-span-2"
                        onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeHighlight(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Inclusions */}
              <div>
                <Label className="text-lg font-semibold">What's Included</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="e.g., Airport transfers"
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
                  />
                  <Button type="button" onClick={addInclusion}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.inclusions?.map((item, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {item}
                      <button type="button" onClick={() => removeInclusion(index)} className="hover:text-green-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Exclusions */}
              <div>
                <Label className="text-lg font-semibold">What's Not Included</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="e.g., International flights"
                    value={newExclusion}
                    onChange={(e) => setNewExclusion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExclusion())}
                  />
                  <Button type="button" onClick={addExclusion}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.exclusions?.map((item, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {item}
                      <button type="button" onClick={() => removeExclusion(index)} className="hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Itinerary Tab */}
            <TabsContent value="itinerary" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-lg font-semibold">Day-by-Day Itinerary</Label>
                <Button type="button" onClick={addItineraryDay}>
                  <Plus className="w-4 h-4 mr-1" /> Add Day
                </Button>
              </div>

              {formData.itinerary?.map((day, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-emerald-700">Day {day.day}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItineraryDay(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Day Title"
                      value={day.title}
                      onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                    />
                    <Input
                      placeholder="Location"
                      value={day.location}
                      onChange={(e) => updateItineraryDay(index, 'location', e.target.value)}
                    />
                  </div>
                  <Textarea
                    placeholder="Day Description"
                    value={day.description}
                    onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                    rows={2}
                  />
                  <Input
                    placeholder="Accommodation"
                    value={day.accommodation}
                    onChange={(e) => updateItineraryDay(index, 'accommodation', e.target.value)}
                  />
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={day.meals.breakfast}
                        onChange={(e) => updateItineraryDay(index, 'meals', { ...day.meals, breakfast: e.target.checked })}
                      />
                      Breakfast
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={day.meals.lunch}
                        onChange={(e) => updateItineraryDay(index, 'meals', { ...day.meals, lunch: e.target.checked })}
                      />
                      Lunch
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={day.meals.dinner}
                        onChange={(e) => updateItineraryDay(index, 'meals', { ...day.meals, dinner: e.target.checked })}
                      />
                      Dinner
                    </label>
                  </div>
                </div>
              ))}

              {(!formData.itinerary || formData.itinerary.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No itinerary days added yet</p>
                  <p className="text-sm">Click "Add Day" to create the tour schedule</p>
                </div>
              )}
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              <div>
                <Label>Hero Image URL</Label>
                <Input
                  value={formData.heroImage || ''}
                  onChange={(e) => handleInputChange('heroImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.heroImage && (
                  <img
                    src={formData.heroImage}
                    alt="Hero preview"
                    className="mt-2 w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>

              <div>
                <Label>Video URL (Optional)</Label>
                <Input
                  value={formData.videoUrl || ''}
                  onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div>
                <Label className="text-lg font-semibold">Image Gallery</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Image URL"
                    value={newGalleryImage}
                    onChange={(e) => setNewGalleryImage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
                  />
                  <Button type="button" onClick={addGalleryImage}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {formData.imageGallery?.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4">
              <div>
                <Label>SEO Title</Label>
                <Input
                  value={formData.seoTitle || ''}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  placeholder="Custom title for search engines"
                />
              </div>
              <div>
                <Label>SEO Description</Label>
                <Textarea
                  value={formData.seoDescription || ''}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  placeholder="Meta description for search engines (150-160 characters recommended)"
                  rows={3}
                />
              </div>
              <div>
                <Label>SEO Keywords</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add keyword"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <Button type="button" onClick={addKeyword}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.seoKeywords?.map((keyword, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {keyword}
                      <button type="button" onClick={() => removeKeyword(index)} className="hover:text-blue-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {tour ? 'Update Tour' : 'Create Tour'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalTourFormDialog;
