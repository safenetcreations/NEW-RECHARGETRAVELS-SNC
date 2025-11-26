import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Upload, 
  Plus, 
  Trash2, 
  GripVertical,
  Image as ImageIcon,
  Video,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { luxuryExperienceService } from '@/services/luxuryExperienceService';
import type { LuxuryExperience, Inclusion, ItineraryDay } from '@/types/luxury-experience';
import { toast } from 'sonner';

const experienceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subtitle: z.string().min(10, 'Subtitle must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  shortDescription: z.string().min(50, 'Short description must be at least 50 characters'),
  fullDescription: z.string().min(100, 'Full description must be at least 100 characters'),
  duration: z.string().min(1, 'Duration is required'),
  groupSize: z.string().min(1, 'Group size is required'),
  price: z.object({
    amount: z.number().min(1, 'Price must be greater than 0'),
    currency: z.string(),
    per: z.string()
  }),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean(),
  popular: z.boolean(),
  new: z.boolean()
});

interface ExperienceFormProps {
  experience?: LuxuryExperience | null;
  onClose: () => void;
}

const ExperienceForm = ({ experience, onClose }: ExperienceFormProps) => {
  const [loading, setLoading] = useState(false);
  const [heroImage, setHeroImage] = useState<string>(experience?.heroImage || '');
  const [gallery, setGallery] = useState(experience?.gallery || []);
  const [inclusions, setInclusions] = useState<Inclusion[]>(
    experience?.inclusions || [{ icon: '✓', title: '', description: '' }]
  );
  const [exclusions, setExclusions] = useState<string[]>(
    experience?.exclusions || ['']
  );
  const [highlights, setHighlights] = useState<string[]>(
    experience?.highlights || ['']
  );
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    experience?.itinerary || []
  );
  const [activeTab, setActiveTab] = useState('basic');

  const categories = luxuryExperienceService.getCategories();

  const form = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: experience?.title || '',
      subtitle: experience?.subtitle || '',
      category: experience?.category || '',
      shortDescription: experience?.shortDescription || '',
      fullDescription: experience?.fullDescription || '',
      duration: experience?.duration || '',
      groupSize: experience?.groupSize || '',
      price: {
        amount: experience?.price.amount || 0,
        currency: experience?.price.currency || 'USD',
        per: experience?.price.per || 'person'
      },
      status: experience?.status || 'draft',
      featured: experience?.featured || false,
      popular: experience?.popular || false,
      new: experience?.new || false
    }
  });

  const handleImageUpload = async (file: File, type: 'hero' | 'gallery') => {
    try {
      const tempId = experience?.id || 'temp-' + Date.now();
      const url = await luxuryExperienceService.uploadImage(file, tempId, type);
      
      if (type === 'hero') {
        setHeroImage(url);
      } else {
        setGallery([...gallery, {
          url,
          alt: file.name,
          caption: '',
          order: gallery.length
        }]);
      }
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const addInclusion = () => {
    setInclusions([...inclusions, { icon: '✓', title: '', description: '' }]);
  };

  const removeInclusion = (index: number) => {
    setInclusions(inclusions.filter((_, i) => i !== index));
  };

  const updateInclusion = (index: number, field: keyof Inclusion, value: string) => {
    const updated = [...inclusions];
    updated[index] = { ...updated[index], [field]: value };
    setInclusions(updated);
  };

  const addExclusion = () => {
    setExclusions([...exclusions, '']);
  };

  const removeExclusion = (index: number) => {
    setExclusions(exclusions.filter((_, i) => i !== index));
  };

  const updateExclusion = (index: number, value: string) => {
    const updated = [...exclusions];
    updated[index] = value;
    setExclusions(updated);
  };

  const addHighlight = () => {
    setHighlights([...highlights, '']);
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const updateHighlight = (index: number, value: string) => {
    const updated = [...highlights];
    updated[index] = value;
    setHighlights(updated);
  };

  const onSubmit = async (data: any) => {
    if (!heroImage) {
      toast.error('Please upload a hero image');
      return;
    }

    try {
      setLoading(true);

      const experienceData = {
        ...data,
        heroImage,
        gallery,
        inclusions: inclusions.filter(inc => inc.title),
        exclusions: exclusions.filter(Boolean),
        highlights: highlights.filter(Boolean),
        itinerary,
        locations: [{ name: 'Sri Lanka', coordinates: { lat: 7.8731, lng: 80.7718 } }],
        availability: {
          type: 'daily' as const,
          minimumNotice: 24
        },
        cancellationPolicy: 'Free cancellation up to 24 hours before the experience',
        seo: {
          metaTitle: data.title,
          metaDescription: data.shortDescription,
          keywords: [data.category, 'sri lanka', 'luxury', 'experience']
        }
      };

      if (experience) {
        await luxuryExperienceService.updateExperience(experience.id, experienceData);
        toast.success('Experience updated successfully');
      } else {
        await luxuryExperienceService.createExperience(experienceData);
        toast.success('Experience created successfully');
      }

      onClose();
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error('Failed to save experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Luxury Safari Experience" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="An unforgettable journey through..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="3 Days / 2 Nights" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="groupSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Size</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Max 8 people" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price.amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price.currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="LKR">LKR</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price.per"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Per</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="person">Person</SelectItem>
                          <SelectItem value="group">Group</SelectItem>
                          <SelectItem value="day">Day</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status & Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Featured</FormLabel>
                          <FormDescription>
                            Show this experience in featured sections
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="popular"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Popular</FormLabel>
                          <FormDescription>
                            Mark as a popular experience
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="new"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>New</FormLabel>
                          <FormDescription>
                            Show "New" badge on this experience
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={3}
                      placeholder="Brief description for listing pages..."
                    />
                  </FormControl>
                  <FormDescription>
                    This will appear on listing pages (50-150 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={8}
                      placeholder="Detailed description of the experience..."
                    />
                  </FormControl>
                  <FormDescription>
                    Complete description for the detail page
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      placeholder="Key highlight..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeHighlight(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addHighlight}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Highlight
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Image</CardTitle>
              </CardHeader>
              <CardContent>
                {heroImage ? (
                  <div className="relative">
                    <img 
                      src={heroImage} 
                      alt="Hero" 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setHeroImage('')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Upload hero image</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'hero');
                      }}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gallery Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {gallery.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image.url} 
                        alt={image.alt} 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">Add gallery images</p>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(file => handleImageUpload(file, 'gallery'));
                    }}
                    className="max-w-xs mx-auto"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inclusions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {inclusions.map((inclusion, index) => (
                  <div key={index} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex gap-2">
                      <Input
                        value={inclusion.icon}
                        onChange={(e) => updateInclusion(index, 'icon', e.target.value)}
                        placeholder="Icon"
                        className="w-20"
                      />
                      <Input
                        value={inclusion.title}
                        onChange={(e) => updateInclusion(index, 'title', e.target.value)}
                        placeholder="Inclusion title..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeInclusion(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={inclusion.description}
                      onChange={(e) => updateInclusion(index, 'description', e.target.value)}
                      placeholder="Description..."
                      rows={2}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addInclusion}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Inclusion
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's Not Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {exclusions.map((exclusion, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={exclusion}
                      onChange={(e) => updateExclusion(index, e.target.value)}
                      placeholder="Not included..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeExclusion(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExclusion}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exclusion
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="itinerary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Day by Day Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Itinerary builder coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : experience ? 'Update Experience' : 'Create Experience'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExperienceForm;
