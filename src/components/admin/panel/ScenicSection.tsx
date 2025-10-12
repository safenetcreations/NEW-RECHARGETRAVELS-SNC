import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Save, 
  Trash2, 
  Mountain,
  Waves,
  TreePine,
  Camera,
  Map,
  Navigation,
  Sunrise,
  Building
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { toast } from 'sonner';

interface ScenicLocation {
  id?: string;
  title: string;
  slug: string;
  description: string;
  heroHeading: string;
  highlights: string[];
  suggestedTours: string[];
  travelTips: string[];
  seoMetaDescription: string;
  seoFocusKeyword: string;
  category: string;
  featured: boolean;
  active: boolean;
  heroImages: string[];
  height?: string;
  bestTime: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  duration: string;
  location: {
    province: string;
    district: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  activities: string[];
  faqs: { question: string; answer: string; }[];
}

const scenicLocations = [
  {
    title: "Bambarakanda Falls",
    slug: "bambarakanda-falls",
    category: "Waterfall",
    icon: Waves,
    description: "Sri Lanka's tallest waterfall at 263 meters, surrounded by pine forests."
  },
  {
    title: "Arugam Bay Beach",
    slug: "arugam-bay-beach",
    category: "Beach",
    icon: Waves,
    description: "World-renowned surfing paradise with perfect right-hand breaks."
  },
  {
    title: "Haputale Viewpoint",
    slug: "haputale-scenic-views",
    category: "Viewpoint",
    icon: Mountain,
    description: "Misty hills with sweeping views of tea estates and valleys."
  },
  {
    title: "Diyaluma Falls", 
    slug: "diyaluma-falls",
    category: "Waterfall",
    icon: Waves,
    description: "Second tallest waterfall with natural infinity pools."
  },
  {
    title: "Ella Rock",
    slug: "ella-rock",
    category: "Hiking",
    icon: Mountain,
    description: "Rewarding hike with panoramic views of Ella valley."
  },
  {
    title: "Gregory Lake",
    slug: "gregory-lake",
    category: "Lake",
    icon: Waves,
    description: "Scenic lake in Nuwara Eliya with boating activities."
  },
  {
    title: "Pidurangala Rock",
    slug: "pidurangala-rock",
    category: "Viewpoint",
    icon: Mountain,
    description: "Ancient rock with best views of Sigiriya Lion Rock."
  },
  {
    title: "Belihuloya River",
    slug: "belihuloya",
    category: "River",
    icon: TreePine,
    description: "Nature retreat with pristine rivers and waterfalls."
  },
  {
    title: "Ravana Falls",
    slug: "ravana-falls",
    category: "Waterfall",
    icon: Waves,
    description: "Mythical waterfall connected to Ramayana legends."
  },
  {
    title: "Nine Arch Bridge",
    slug: "nine-arch-bridge",
    category: "Architecture",
    icon: Building,
    description: "Iconic colonial-era bridge with passing trains."
  }
];

const ScenicSection: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<ScenicLocation>({
    title: '',
    slug: '',
    description: '',
    heroHeading: '',
    highlights: [],
    suggestedTours: [],
    travelTips: [],
    seoMetaDescription: '',
    seoFocusKeyword: '',
    category: '',
    featured: false,
    active: true,
    heroImages: [],
    height: '',
    bestTime: '',
    difficulty: 'Easy',
    duration: '',
    location: {
      province: '',
      district: '',
      coordinates: { lat: 0, lng: 0 }
    },
    activities: [],
    faqs: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [newHighlight, setNewHighlight] = useState('');
  const [newTour, setNewTour] = useState('');
  const [newTip, setNewTip] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  // Load scenic location data from Firebase
  const loadLocationData = async (slug: string) => {
    try {
      setIsLoading(true);
      const scenicRef = collection(db, 'scenic-locations');
      const q = query(scenicRef, orderBy('title'));
      const querySnapshot = await getDocs(q);
      
      const locationDoc = querySnapshot.docs.find(doc => doc.data().slug === slug);
      if (locationDoc) {
        const data = { id: locationDoc.id, ...locationDoc.data() } as ScenicLocation;
        setLocationData(data);
      } else {
        // Create default structure for new location
        const defaultLoc = scenicLocations.find(loc => loc.slug === slug);
        if (defaultLoc) {
          setLocationData({
            title: defaultLoc.title,
            slug: defaultLoc.slug,
            description: defaultLoc.description,
            heroHeading: '',
            highlights: [],
            suggestedTours: [],
            travelTips: [],
            seoMetaDescription: '',
            seoFocusKeyword: defaultLoc.slug.replace(/-/g, ' '),
            category: defaultLoc.category,
            featured: false,
            active: true,
            heroImages: [],
            height: '',
            bestTime: 'Year round',
            difficulty: 'Easy',
            duration: 'Half day',
            location: {
              province: '',
              district: '',
              coordinates: { lat: 0, lng: 0 }
            },
            activities: [],
            faqs: []
          });
        }
      }
    } catch (error) {
      console.error('Error loading scenic location data:', error);
      toast.error('Failed to load location data');
    } finally {
      setIsLoading(false);
    }
  };

  // Save location data to Firebase
  const handleSave = async () => {
    try {
      setIsLoading(true);
      const scenicRef = collection(db, 'scenic-locations');
      
      if (locationData.id) {
        // Update existing location
        const { id, ...updateData } = locationData;
        await updateDoc(doc(db, 'scenic-locations', locationData.id), updateData);
        toast.success('Scenic location updated successfully!');
      } else {
        // Create new location
        const { id, ...newData } = locationData;
        await addDoc(scenicRef, newData);
        toast.success('Scenic location created successfully!');
      }
      
      // Reload data
      await loadLocationData(locationData.slug);
    } catch (error) {
      console.error('Error saving scenic location:', error);
      toast.error('Failed to save location');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form field updates
  const updateField = (field: keyof ScenicLocation, value: any) => {
    setLocationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle nested location field updates
  const updateLocationField = (field: string, value: any) => {
    setLocationData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  // Handle array field additions
  const addToArray = (field: 'highlights' | 'suggestedTours' | 'travelTips' | 'heroImages' | 'activities', value: string) => {
    if (value.trim()) {
      setLocationData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      
      // Clear input
      if (field === 'highlights') setNewHighlight('');
      if (field === 'suggestedTours') setNewTour('');
      if (field === 'travelTips') setNewTip('');
      if (field === 'heroImages') setNewImage('');
      if (field === 'activities') setNewActivity('');
    }
  };

  // Remove from array
  const removeFromArray = (field: 'highlights' | 'suggestedTours' | 'travelTips' | 'heroImages' | 'activities', index: number) => {
    setLocationData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Add FAQ
  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      setLocationData(prev => ({
        ...prev,
        faqs: [...prev.faqs, { ...newFaq }]
      }));
      setNewFaq({ question: '', answer: '' });
    }
  };

  // Remove FAQ
  const removeFaq = (index: number) => {
    setLocationData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    if (selectedLocation) {
      loadLocationData(selectedLocation);
    }
  }, [selectedLocation]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scenic Sri Lanka Content Management</CardTitle>
          <CardDescription>
            Manage content for scenic destinations including waterfalls, viewpoints, beaches, and landmarks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {scenicLocations.map((location) => (
              <Button
                key={location.slug}
                variant={selectedLocation === location.slug ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setSelectedLocation(location.slug)}
              >
                <location.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold text-xs">{location.title}</div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {location.category}
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Edit: {locationData.title}</span>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={locationData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={locationData.slug}
                      onChange={(e) => updateField('slug', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={locationData.category} onValueChange={(value) => updateField('category', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Waterfall">Waterfall</SelectItem>
                        <SelectItem value="Beach">Beach</SelectItem>
                        <SelectItem value="Viewpoint">Viewpoint</SelectItem>
                        <SelectItem value="Hiking">Hiking</SelectItem>
                        <SelectItem value="Lake">Lake</SelectItem>
                        <SelectItem value="River">River</SelectItem>
                        <SelectItem value="Architecture">Architecture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={locationData.difficulty} onValueChange={(value: 'Easy' | 'Moderate' | 'Challenging') => updateField('difficulty', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Challenging">Challenging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={locationData.duration}
                      onChange={(e) => updateField('duration', e.target.value)}
                      placeholder="e.g., 2 hours, Half day"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height/Elevation (if applicable)</Label>
                    <Input
                      id="height"
                      value={locationData.height || ''}
                      onChange={(e) => updateField('height', e.target.value)}
                      placeholder="e.g., 263 meters"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="heroHeading">Hero Heading</Label>
                  <Input
                    id="heroHeading"
                    value={locationData.heroHeading}
                    onChange={(e) => updateField('heroHeading', e.target.value)}
                    placeholder="Compelling headline for the hero section"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={locationData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bestTime">Best Time to Visit</Label>
                  <Input
                    id="bestTime"
                    value={locationData.bestTime}
                    onChange={(e) => updateField('bestTime', e.target.value)}
                    placeholder="e.g., March-May, Year round"
                  />
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                {/* Highlights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Highlights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        placeholder="Add new highlight"
                      />
                      <Button onClick={() => addToArray('highlights', newHighlight)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {locationData.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-2">
                          {highlight}
                          <button
                            onClick={() => removeFromArray('highlights', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                        placeholder="Add activity"
                      />
                      <Button onClick={() => addToArray('activities', newActivity)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {locationData.activities.map((activity, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-2">
                          {activity}
                          <button
                            onClick={() => removeFromArray('activities', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tours & Tips */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Suggested Tours</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newTour}
                          onChange={(e) => setNewTour(e.target.value)}
                          placeholder="Add tour"
                        />
                        <Button onClick={() => addToArray('suggestedTours', newTour)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {locationData.suggestedTours.map((tour, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{tour}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromArray('suggestedTours', index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Travel Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newTip}
                          onChange={(e) => setNewTip(e.target.value)}
                          placeholder="Add tip"
                        />
                        <Button onClick={() => addToArray('travelTips', newTip)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {locationData.travelTips.map((tip, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{tip}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromArray('travelTips', index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* FAQs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        value={newFaq.question}
                        onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                        placeholder="Question"
                      />
                      <Textarea
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                        placeholder="Answer"
                        rows={2}
                      />
                      <Button onClick={addFaq}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add FAQ
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {locationData.faqs.map((faq, index) => (
                        <div key={index} className="border rounded p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{faq.question}</p>
                              <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFaq(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Input
                      id="province"
                      value={locationData.location.province}
                      onChange={(e) => updateLocationField('province', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={locationData.location.district}
                      onChange={(e) => updateLocationField('district', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="0.000001"
                      value={locationData.location.coordinates.lat}
                      onChange={(e) => updateLocationField('coordinates', { 
                        ...locationData.location.coordinates, 
                        lat: parseFloat(e.target.value) || 0 
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lng">Longitude</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="0.000001"
                      value={locationData.location.coordinates.lng}
                      onChange={(e) => updateLocationField('coordinates', { 
                        ...locationData.location.coordinates, 
                        lng: parseFloat(e.target.value) || 0 
                      })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Hero Images</CardTitle>
                    <CardDescription>Add image URLs for the hero section carousel</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="Add image URL"
                      />
                      <Button onClick={() => addToArray('heroImages', newImage)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {locationData.heroImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Hero image ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => removeFromArray('heroImages', index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoKeyword">Focus Keyword</Label>
                  <Input
                    id="seoKeyword"
                    value={locationData.seoFocusKeyword}
                    onChange={(e) => updateField('seoFocusKeyword', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">Meta Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={locationData.seoMetaDescription}
                    onChange={(e) => updateField('seoMetaDescription', e.target.value)}
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-sm text-gray-500">
                    {locationData.seoMetaDescription.length}/160 characters
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={locationData.featured}
                      onChange={(e) => updateField('featured', e.target.checked)}
                    />
                    <span>Featured Location</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={locationData.active}
                      onChange={(e) => updateField('active', e.target.checked)}
                    />
                    <span>Active/Published</span>
                  </label>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScenicSection;