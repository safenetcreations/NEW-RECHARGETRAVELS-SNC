import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { 
  Save, Plus, Trash2, Globe, Users, Leaf, Award,
  MapPin, Camera, FileText, Settings, Upload,
  Eye, Edit2, X, Check, Star, Play, Image as ImageIcon,
  MessageSquare, Video, Palmtree, Mountain
} from 'lucide-react';

/**
 * ABOUT SRI LANKA MANAGEMENT - ADMIN PANEL
 * 
 * Comprehensive admin interface for managing the About Sri Lanka page content
 * 
 * Features:
 * ✅ Hero Section Management
 * ✅ Statistics Editor
 * ✅ Highlights Management
 * ✅ Destinations CRUD
 * ✅ Experiences CRUD
 * ✅ Gallery Management with Image Upload
 * ✅ Testimonials CRUD
 * ✅ Video Tours Management
 * ✅ SEO Settings
 * ✅ Real-time Preview
 * ✅ Image Upload to Firebase Storage
 * ✅ Form Validation
 * ✅ Loading States
 * ✅ Error Handling
 */

interface StatItem {
  value: string;
  label: string;
  desc: string;
}

interface Destination {
  name: string;
  description: string;
  image: string;
  region?: string;
}

interface Experience {
  title: string;
  description: string;
  image: string;
  icon?: string;
}

interface GalleryImage {
  url: string;
  caption?: string;
}

interface Testimonial {
  name: string;
  location: string;
  text: string;
  avatar?: string;
  rating?: number;
}

interface VideoTour {
  title: string;
  url: string;
  thumbnail: string;
  duration?: string;
}

interface AboutSriLankaContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  mainDescription: string;
  secondaryDescription: string;
  stats: {
    area: StatItem;
    population: StatItem;
    species: StatItem;
    unesco: StatItem;
  };
  highlights: string[];
  culturalInfo: string;
  naturalInfo: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  destinations?: Destination[];
  experiences?: Experience[];
  gallery?: GalleryImage[];
  testimonials?: Testimonial[];
  videoTours?: VideoTour[];
}

const defaultContent: AboutSriLankaContent = {
  heroTitle: "The Pearl of the Indian Ocean",
  heroSubtitle: "Discover Sri Lanka's Rich Heritage and Natural Beauty",
  heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920",
  mainDescription: "",
  secondaryDescription: "",
  stats: {
    area: { value: "65,610", label: "Square Kilometers", desc: "Compact island paradise" },
    population: { value: "22M", label: "Population", desc: "Warm & welcoming people" },
    species: { value: "3,000+", label: "Endemic Species", desc: "Biodiversity hotspot" },
    unesco: { value: "8", label: "UNESCO Sites", desc: "World heritage treasures" }
  },
  highlights: [],
  culturalInfo: "",
  naturalInfo: "",
  seoTitle: "About Sri Lanka | Recharge Travels",
  seoDescription: "",
  seoKeywords: "",
  destinations: [],
  experiences: [],
  gallery: [],
  testimonials: [],
  videoTours: []
};

const AboutSriLankaManagement: React.FC = () => {
  const [content, setContent] = useState<AboutSriLankaContent>(defaultContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  // Edit state for sections
  const [editingDestination, setEditingDestination] = useState<number | null>(null);
  const [editingExperience, setEditingExperience] = useState<number | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<number | null>(null);
  const [editingVideo, setEditingVideo] = useState<number | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'page-content', 'about-sri-lanka');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as AboutSriLankaContent;
        setContent({ ...defaultContent, ...data });
        toast.success('Content loaded successfully');
      } else {
        toast.info('Using default content');
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'page-content', 'about-sri-lanka');
      await setDoc(docRef, content);
      toast.success('Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }
      
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }

      // Create unique filename
      const timestamp = Date.now();
      const filename = `about-sri-lanka/${timestamp}_${file.name}`;
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const url = await getDownloadURL(storageRef);
      
      toast.success('Image uploaded successfully');
      return url;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      setContent({ ...content, [field]: url });
    } catch (error) {
      // Error already handled in uploadImage
    }
  };

  // Highlight management
  const addHighlight = () => {
    setContent({
      ...content,
      highlights: [...content.highlights, '']
    });
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...content.highlights];
    newHighlights[index] = value;
    setContent({ ...content, highlights: newHighlights });
  };

  const removeHighlight = (index: number) => {
    const newHighlights = content.highlights.filter((_, i) => i !== index);
    setContent({ ...content, highlights: newHighlights });
  };

  // Destination management
  const addDestination = () => {
    const newDestinations = content.destinations || [];
    setContent({
      ...content,
      destinations: [...newDestinations, { name: '', description: '', image: '', region: '' }]
    });
    setEditingDestination((content.destinations?.length || 0));
  };

  const updateDestination = (index: number, field: keyof Destination, value: string) => {
    const newDestinations = [...(content.destinations || [])];
    newDestinations[index] = { ...newDestinations[index], [field]: value };
    setContent({ ...content, destinations: newDestinations });
  };

  const removeDestination = (index: number) => {
    const newDestinations = (content.destinations || []).filter((_, i) => i !== index);
    setContent({ ...content, destinations: newDestinations });
    toast.success('Destination removed');
  };

  const handleDestinationImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      updateDestination(index, 'image', url);
    } catch (error) {
      // Error already handled
    }
  };

  // Experience management
  const addExperience = () => {
    const newExperiences = content.experiences || [];
    setContent({
      ...content,
      experiences: [...newExperiences, { title: '', description: '', image: '', icon: '' }]
    });
    setEditingExperience((content.experiences?.length || 0));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const newExperiences = [...(content.experiences || [])];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    setContent({ ...content, experiences: newExperiences });
  };

  const removeExperience = (index: number) => {
    const newExperiences = (content.experiences || []).filter((_, i) => i !== index);
    setContent({ ...content, experiences: newExperiences });
    toast.success('Experience removed');
  };

  // Gallery management
  const addGalleryImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      const newGallery = content.gallery || [];
      setContent({
        ...content,
        gallery: [...newGallery, { url, caption: '' }]
      });
      toast.success('Image added to gallery');
    } catch (error) {
      // Error already handled
    }
  };

  const updateGalleryCaption = (index: number, caption: string) => {
    const newGallery = [...(content.gallery || [])];
    newGallery[index] = { ...newGallery[index], caption };
    setContent({ ...content, gallery: newGallery });
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = (content.gallery || []).filter((_, i) => i !== index);
    setContent({ ...content, gallery: newGallery });
    toast.success('Image removed from gallery');
  };

  // Testimonial management
  const addTestimonial = () => {
    const newTestimonials = content.testimonials || [];
    setContent({
      ...content,
      testimonials: [...newTestimonials, { name: '', location: '', text: '', avatar: '', rating: 5 }]
    });
    setEditingTestimonial((content.testimonials?.length || 0));
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string | number) => {
    const newTestimonials = [...(content.testimonials || [])];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    setContent({ ...content, testimonials: newTestimonials });
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = (content.testimonials || []).filter((_, i) => i !== index);
    setContent({ ...content, testimonials: newTestimonials });
    toast.success('Testimonial removed');
  };

  // Video tour management
  const addVideoTour = () => {
    const newVideos = content.videoTours || [];
    setContent({
      ...content,
      videoTours: [...newVideos, { title: '', url: '', thumbnail: '', duration: '' }]
    });
    setEditingVideo((content.videoTours?.length || 0));
  };

  const updateVideoTour = (index: number, field: keyof VideoTour, value: string) => {
    const newVideos = [...(content.videoTours || [])];
    newVideos[index] = { ...newVideos[index], [field]: value };
    setContent({ ...content, videoTours: newVideos });
  };

  const removeVideoTour = (index: number) => {
    const newVideos = (content.videoTours || []).filter((_, i) => i !== index);
    setContent({ ...content, videoTours: newVideos });
    toast.success('Video tour removed');
  };

  // Stats update helper
  const updateStat = (statKey: keyof AboutSriLankaContent['stats'], field: keyof StatItem, value: string) => {
    setContent({
      ...content,
      stats: {
        ...content.stats,
        [statKey]: {
          ...content.stats[statKey],
          [field]: value
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-teal-50">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <Globe className="w-8 h-8 text-blue-600" />
                About Sri Lanka Page Management
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Complete control over all content on the About Sri Lanka page
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={loadContent} 
                variant="outline"
                className="border-2"
                disabled={loading}
              >
                <Eye className="w-4 h-4 mr-2" />
                Reload
              </Button>
              <Button 
                onClick={saveContent} 
                disabled={saving || uploading}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Saving...' : 'Save All Changes'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Card className="shadow-xl">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9 mb-8">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="destinations">Destinations</TabsTrigger>
              <TabsTrigger value="experiences">Experiences</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            {/* Hero Section Tab */}
            <TabsContent value="hero" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Hero Title</Label>
                  <Input
                    value={content.heroTitle}
                    onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                    placeholder="Enter hero title"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Hero Subtitle</Label>
                  <Input
                    value={content.heroSubtitle}
                    onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                    placeholder="Enter hero subtitle"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Hero Image</Label>
                  <div className="flex gap-2">
                    <Input
                      value={content.heroImage}
                      onChange={(e) => setContent({ ...content, heroImage: e.target.value })}
                      placeholder="Enter image URL or upload"
                      className="flex-1"
                    />
                    <label htmlFor="hero-image-upload">
                      <Button type="button" variant="outline" disabled={uploading} asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading ? 'Uploading...' : 'Upload'}
                        </span>
                      </Button>
                    </label>
                    <input
                      id="hero-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'heroImage')}
                    />
                  </div>
                  {content.heroImage && (
                    <div className="mt-4 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img src={content.heroImage} alt="Hero preview" className="w-full h-64 object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Main Description</Label>
                  <Textarea
                    value={content.mainDescription}
                    onChange={(e) => setContent({ ...content, mainDescription: e.target.value })}
                    rows={4}
                    placeholder="Enter main description"
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Secondary Description</Label>
                  <Textarea
                    value={content.secondaryDescription}
                    onChange={(e) => setContent({ ...content, secondaryDescription: e.target.value })}
                    rows={4}
                    placeholder="Enter secondary description"
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Cultural Information</Label>
                  <Textarea
                    value={content.culturalInfo}
                    onChange={(e) => setContent({ ...content, culturalInfo: e.target.value })}
                    rows={4}
                    placeholder="Enter cultural information"
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Natural Information</Label>
                  <Textarea
                    value={content.naturalInfo}
                    onChange={(e) => setContent({ ...content, naturalInfo: e.target.value })}
                    rows={4}
                    placeholder="Enter natural information"
                    className="text-base"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-semibold">Highlights</Label>
                    <Button onClick={addHighlight} size="sm" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Highlight
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {content.highlights.map((highlight, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={highlight}
                          onChange={(e) => updateHighlight(index, e.target.value)}
                          placeholder="Enter highlight"
                        />
                        <Button
                          onClick={() => removeHighlight(index)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Area Stats */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      Area Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Value</Label>
                      <Input
                        value={content.stats.area.value}
                        onChange={(e) => updateStat('area', 'value', e.target.value)}
                        placeholder="e.g., 65,610"
                      />
                    </div>
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={content.stats.area.label}
                        onChange={(e) => updateStat('area', 'label', e.target.value)}
                        placeholder="e.g., Square Kilometers"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={content.stats.area.desc}
                        onChange={(e) => updateStat('area', 'desc', e.target.value)}
                        placeholder="e.g., Compact island paradise"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Population Stats */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Population Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Value</Label>
                      <Input
                        value={content.stats.population.value}
                        onChange={(e) => updateStat('population', 'value', e.target.value)}
                        placeholder="e.g., 22M"
                      />
                    </div>
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={content.stats.population.label}
                        onChange={(e) => updateStat('population', 'label', e.target.value)}
                        placeholder="e.g., Population"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={content.stats.population.desc}
                        onChange={(e) => updateStat('population', 'desc', e.target.value)}
                        placeholder="e.g., Warm & welcoming people"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Species Stats */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-600" />
                      Species Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Value</Label>
                      <Input
                        value={content.stats.species.value}
                        onChange={(e) => updateStat('species', 'value', e.target.value)}
                        placeholder="e.g., 3,000+"
                      />
                    </div>
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={content.stats.species.label}
                        onChange={(e) => updateStat('species', 'label', e.target.value)}
                        placeholder="e.g., Endemic Species"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={content.stats.species.desc}
                        onChange={(e) => updateStat('species', 'desc', e.target.value)}
                        placeholder="e.g., Biodiversity hotspot"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* UNESCO Stats */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      UNESCO Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Value</Label>
                      <Input
                        value={content.stats.unesco.value}
                        onChange={(e) => updateStat('unesco', 'value', e.target.value)}
                        placeholder="e.g., 8"
                      />
                    </div>
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={content.stats.unesco.label}
                        onChange={(e) => updateStat('unesco', 'label', e.target.value)}
                        placeholder="e.g., UNESCO Sites"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={content.stats.unesco.desc}
                        onChange={(e) => updateStat('unesco', 'desc', e.target.value)}
                        placeholder="e.g., World heritage treasures"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Destinations Tab */}
            <TabsContent value="destinations" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Featured Destinations</h3>
                <Button onClick={addDestination} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Destination
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(content.destinations || []).map((destination, index) => (
                  <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="mb-2">Destination {index + 1}</Badge>
                        <Button
                          onClick={() => removeDestination(index)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={destination.name}
                          onChange={(e) => updateDestination(index, 'name', e.target.value)}
                          placeholder="Destination name"
                        />
                      </div>
                      <div>
                        <Label>Region</Label>
                        <Input
                          value={destination.region || ''}
                          onChange={(e) => updateDestination(index, 'region', e.target.value)}
                          placeholder="e.g., Southern Coast"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={destination.description}
                          onChange={(e) => updateDestination(index, 'description', e.target.value)}
                          placeholder="Brief description"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Image</Label>
                        <div className="flex gap-2">
                          <Input
                            value={destination.image}
                            onChange={(e) => updateDestination(index, 'image', e.target.value)}
                            placeholder="Image URL"
                            className="flex-1"
                          />
                          <label>
                            <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                              <span><Upload className="w-4 h-4" /></span>
                            </Button>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleDestinationImageUpload(e, index)}
                            />
                          </label>
                        </div>
                        {destination.image && (
                          <img src={destination.image} alt={destination.name} className="w-full h-32 object-cover rounded mt-2" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {(content.destinations || []).length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No destinations added yet</p>
                  <Button onClick={addDestination}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Destination
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Experiences Tab - Similar structure */}
            <TabsContent value="experiences" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Experiences</h3>
                <Button onClick={addExperience} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Experience
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(content.experiences || []).map((experience, index) => (
                  <Card key={index} className="shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline">Experience {index + 1}</Badge>
                        <Button
                          onClick={() => removeExperience(index)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={experience.title}
                          onChange={(e) => updateExperience(index, 'title', e.target.value)}
                          placeholder="Experience title"
                        />
                      </div>
                      <div>
                        <Label>Icon (Emoji)</Label>
                        <Input
                          value={experience.icon || ''}
                          onChange={(e) => updateExperience(index, 'icon', e.target.value)}
                          placeholder="e.g., 🏖️"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={experience.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          placeholder="Brief description"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Image</Label>
                        <Input
                          value={experience.image}
                          onChange={(e) => updateExperience(index, 'image', e.target.value)}
                          placeholder="Image URL"
                        />
                        {experience.image && (
                          <img src={experience.image} alt={experience.title} className="w-full h-32 object-cover rounded mt-2" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {(content.experiences || []).length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No experiences added yet</p>
                  <Button onClick={addExperience}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Experience
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Photo Gallery</h3>
                <label>
                  <Button disabled={uploading} asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Add Image'}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={addGalleryImage}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(content.gallery || []).map((image, index) => (
                  <Card key={index} className="overflow-hidden shadow-lg group">
                    <div className="relative">
                      <img src={image.url} alt={image.caption || ''} className="w-full h-48 object-cover" />
                      <Button
                        onClick={() => removeGalleryImage(index)}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardContent className="p-3">
                      <Input
                        value={image.caption || ''}
                        onChange={(e) => updateGalleryCaption(index, e.target.value)}
                        placeholder="Caption (optional)"
                        className="text-sm"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {(content.gallery || []).length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No images in gallery yet</p>
                  <label>
                    <Button disabled={uploading}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Your First Image
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={addGalleryImage}
                    />
                  </label>
                </div>
              )}
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Testimonials</h3>
                <Button onClick={addTestimonial} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Testimonial
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(content.testimonials || []).map((testimonial, index) => (
                  <Card key={index} className="shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline">Testimonial {index + 1}</Badge>
                        <Button
                          onClick={() => removeTestimonial(index)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={testimonial.name}
                          onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                          placeholder="Customer name"
                        />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={testimonial.location}
                          onChange={(e) => updateTestimonial(index, 'location', e.target.value)}
                          placeholder="e.g., New York, USA"
                        />
                      </div>
                      <div>
                        <Label>Testimonial Text</Label>
                        <Textarea
                          value={testimonial.text}
                          onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
                          placeholder="Their experience..."
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label>Avatar URL (optional)</Label>
                        <Input
                          value={testimonial.avatar || ''}
                          onChange={(e) => updateTestimonial(index, 'avatar', e.target.value)}
                          placeholder="Avatar image URL"
                        />
                      </div>
                      <div>
                        <Label>Rating (1-5)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={testimonial.rating || 5}
                          onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value) || 5)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {(content.testimonials || []).length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No testimonials added yet</p>
                  <Button onClick={addTestimonial}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Testimonial
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Video Tours</h3>
                <Button onClick={addVideoTour} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Video
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(content.videoTours || []).map((video, index) => (
                  <Card key={index} className="shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline">Video {index + 1}</Badge>
                        <Button
                          onClick={() => removeVideoTour(index)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={video.title}
                          onChange={(e) => updateVideoTour(index, 'title', e.target.value)}
                          placeholder="Video title"
                        />
                      </div>
                      <div>
                        <Label>YouTube Embed URL</Label>
                        <Input
                          value={video.url}
                          onChange={(e) => updateVideoTour(index, 'url', e.target.value)}
                          placeholder="https://www.youtube.com/embed/..."
                        />
                      </div>
                      <div>
                        <Label>Thumbnail URL</Label>
                        <Input
                          value={video.thumbnail}
                          onChange={(e) => updateVideoTour(index, 'thumbnail', e.target.value)}
                          placeholder="Thumbnail image URL"
                        />
                        {video.thumbnail && (
                          <img src={video.thumbnail} alt={video.title} className="w-full h-32 object-cover rounded mt-2" />
                        )}
                      </div>
                      <div>
                        <Label>Duration (optional)</Label>
                        <Input
                          value={video.duration || ''}
                          onChange={(e) => updateVideoTour(index, 'duration', e.target.value)}
                          placeholder="e.g., 3:45"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {(content.videoTours || []).length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No video tours added yet</p>
                  <Button onClick={addVideoTour}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Video
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    SEO Settings
                  </CardTitle>
                  <CardDescription>
                    Optimize your page for search engines
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">SEO Title</Label>
                    <Input
                      value={content.seoTitle}
                      onChange={(e) => setContent({ ...content, seoTitle: e.target.value })}
                      placeholder="Page title for search engines"
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {content.seoTitle.length}/60 characters (recommended: 50-60)
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-base font-semibold">SEO Description</Label>
                    <Textarea
                      value={content.seoDescription}
                      onChange={(e) => setContent({ ...content, seoDescription: e.target.value })}
                      rows={3}
                      placeholder="Meta description for search engines"
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {content.seoDescription.length}/160 characters (recommended: 150-160)
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-base font-semibold">SEO Keywords</Label>
                    <Input
                      value={content.seoKeywords}
                      onChange={(e) => setContent({ ...content, seoKeywords: e.target.value })}
                      placeholder="Keywords separated by commas"
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate keywords with commas
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button (sticky bottom) */}
          <div className="sticky bottom-0 bg-white border-t-2 pt-6 mt-8 flex justify-end gap-4">
            <Button 
              onClick={loadContent} 
              variant="outline"
              size="lg"
              disabled={loading}
            >
              Cancel & Reload
            </Button>
            <Button 
              onClick={saveContent} 
              disabled={saving || uploading}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg px-8"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutSriLankaManagement;


