import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  Trash2, 
  Plus, 
  Upload, 
  Image as ImageIcon,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Activity,
  Info,
  Users,
  Building,
  Sun
} from 'lucide-react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}

interface Attraction {
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  duration: string;
  price: string;
}

interface Activity {
  name: string;
  description: string;
  icon: string;
  price: string;
  duration: string;
  popular?: boolean;
}

interface DestinationInfo {
  population: string;
  area: string;
  elevation: string;
  bestTime: string;
  language: string;
  currency: string;
}

interface DestinationContent {
  heroSlides: HeroSlide[];
  attractions: Attraction[];
  activities: Activity[];
  destinationInfo: DestinationInfo;
}

const defaultContent: DestinationContent = {
  heroSlides: [
    {
      image: "https://images.unsplash.com/photo-1577718335397-f6f60e23de14?auto=format&fit=crop&q=80",
      title: "Welcome to Colombo",
      subtitle: "Sri Lanka's Vibrant Capital City"
    }
  ],
  attractions: [
    {
      name: "Gangaramaya Temple",
      description: "One of Colombo's most important Buddhist temples",
      image: "https://images.unsplash.com/photo-1609921141835-ed42426faa5f?auto=format&fit=crop&q=80",
      category: "Religious Sites",
      rating: 4.7,
      duration: "2-3 hours",
      price: "$5"
    }
  ],
  activities: [
    {
      name: "Colombo City Tour",
      description: "Comprehensive guided tour covering major attractions",
      icon: "Navigation",
      price: "From $35",
      duration: "Full Day",
      popular: true
    }
  ],
  destinationInfo: {
    population: "752,993",
    area: "37.31 km²",
    elevation: "1 m",
    bestTime: "January to March",
    language: "Sinhala, Tamil, English",
    currency: "Sri Lankan Rupee (LKR)"
  }
};

interface DestinationAdminProps {
  destinationId: string;
  destinationName: string;
}

const DestinationAdmin: React.FC<DestinationAdminProps> = ({ destinationId, destinationName }) => {
  const [content, setContent] = useState<DestinationContent>(defaultContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, [destinationId]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'destinations', destinationId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setContent(docSnap.data() as DestinationContent);
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
      const docRef = doc(db, 'destinations', destinationId);
      await setDoc(docRef, content);
      toast.success(`${destinationName} content saved successfully!`);
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  // Hero Slides Management
  const updateHeroSlide = (index: number, field: keyof HeroSlide, value: string) => {
    const newSlides = [...content.heroSlides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setContent({ ...content, heroSlides: newSlides });
  };

  const addHeroSlide = () => {
    setContent({
      ...content,
      heroSlides: [
        ...content.heroSlides,
        {
          image: '',
          title: '',
          subtitle: ''
        }
      ]
    });
  };

  const removeHeroSlide = (index: number) => {
    const newSlides = content.heroSlides.filter((_, i) => i !== index);
    setContent({ ...content, heroSlides: newSlides });
  };

  // Attractions Management
  const updateAttraction = (index: number, field: keyof Attraction, value: any) => {
    const newAttractions = [...content.attractions];
    newAttractions[index] = { ...newAttractions[index], [field]: value };
    setContent({ ...content, attractions: newAttractions });
  };

  const addAttraction = () => {
    setContent({
      ...content,
      attractions: [
        ...content.attractions,
        {
          name: '',
          description: '',
          image: '',
          category: '',
          rating: 4.5,
          duration: '',
          price: ''
        }
      ]
    });
  };

  const removeAttraction = (index: number) => {
    const newAttractions = content.attractions.filter((_, i) => i !== index);
    setContent({ ...content, attractions: newAttractions });
  };

  // Activities Management
  const updateActivity = (index: number, field: keyof Activity, value: any) => {
    const newActivities = [...content.activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    setContent({ ...content, activities: newActivities });
  };

  const addActivity = () => {
    setContent({
      ...content,
      activities: [
        ...content.activities,
        {
          name: '',
          description: '',
          icon: 'Activity',
          price: '',
          duration: '',
          popular: false
        }
      ]
    });
  };

  const removeActivity = (index: number) => {
    const newActivities = content.activities.filter((_, i) => i !== index);
    setContent({ ...content, activities: newActivities });
  };

  // Destination Info Update
  const updateDestinationInfo = (field: keyof DestinationInfo, value: string) => {
    setContent({
      ...content,
      destinationInfo: {
        ...content.destinationInfo,
        [field]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            {destinationName} Content Management
          </h2>
          <p className="text-gray-600 mt-1">Manage hero slides, attractions, activities, and destination information</p>
        </div>
        <Button 
          onClick={saveContent} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero Slides</TabsTrigger>
          <TabsTrigger value="attractions">Attractions</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="info">Destination Info</TabsTrigger>
        </TabsList>

        {/* Hero Slides Tab */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Slides</CardTitle>
              <CardDescription>
                Manage the rotating hero images and content for {destinationName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.heroSlides.map((slide, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Slide {index + 1}
                      </h4>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeHeroSlide(index)}
                        disabled={content.heroSlides.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <Label>Image URL</Label>
                        <Input
                          value={slide.image}
                          onChange={(e) => updateHeroSlide(index, 'image', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={slide.title}
                            onChange={(e) => updateHeroSlide(index, 'title', e.target.value)}
                            placeholder="Welcome to {destinationName}"
                          />
                        </div>

                        <div>
                          <Label>Subtitle</Label>
                          <Input
                            value={slide.subtitle}
                            onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)}
                            placeholder="Discover the beauty..."
                          />
                        </div>
                      </div>

                      {slide.image && (
                        <div className="mt-4">
                          <Label>Preview</Label>
                          <img 
                            src={slide.image} 
                            alt={slide.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              <Button onClick={addHeroSlide} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Slide
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attractions Tab */}
        <TabsContent value="attractions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attractions</CardTitle>
              <CardDescription>
                Manage tourist attractions in {destinationName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.attractions.map((attraction, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Attraction {index + 1}
                      </h4>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeAttraction(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={attraction.name}
                          onChange={(e) => updateAttraction(index, 'name', e.target.value)}
                          placeholder="Attraction Name"
                        />
                      </div>

                      <div>
                        <Label>Category</Label>
                        <Input
                          value={attraction.category}
                          onChange={(e) => updateAttraction(index, 'category', e.target.value)}
                          placeholder="e.g., Religious Sites, Museums"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={attraction.description}
                        onChange={(e) => updateAttraction(index, 'description', e.target.value)}
                        placeholder="Describe the attraction..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Image URL</Label>
                        <Input
                          value={attraction.image}
                          onChange={(e) => updateAttraction(index, 'image', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div>
                        <Label>Rating (1-5)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          step="0.1"
                          value={attraction.rating}
                          onChange={(e) => updateAttraction(index, 'rating', parseFloat(e.target.value))}
                          placeholder="4.5"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Duration</Label>
                        <Input
                          value={attraction.duration}
                          onChange={(e) => updateAttraction(index, 'duration', e.target.value)}
                          placeholder="2-3 hours"
                        />
                      </div>

                      <div>
                        <Label>Price</Label>
                        <Input
                          value={attraction.price}
                          onChange={(e) => updateAttraction(index, 'price', e.target.value)}
                          placeholder="$5 or Free"
                        />
                      </div>
                    </div>

                    {attraction.image && (
                      <div>
                        <Label>Preview</Label>
                        <img 
                          src={attraction.image} 
                          alt={attraction.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              <Button onClick={addAttraction} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Attraction
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activities & Tours</CardTitle>
              <CardDescription>
                Manage activities and tour options in {destinationName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.activities.map((activity, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Activity {index + 1}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={activity.popular || false}
                            onCheckedChange={(checked) => updateActivity(index, 'popular', checked)}
                          />
                          <Label>Popular</Label>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeActivity(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Activity Name</Label>
                        <Input
                          value={activity.name}
                          onChange={(e) => updateActivity(index, 'name', e.target.value)}
                          placeholder="City Tour"
                        />
                      </div>

                      <div>
                        <Label>Icon (Lucide icon name)</Label>
                        <Input
                          value={activity.icon}
                          onChange={(e) => updateActivity(index, 'icon', e.target.value)}
                          placeholder="Navigation"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={activity.description}
                        onChange={(e) => updateActivity(index, 'description', e.target.value)}
                        placeholder="Describe the activity..."
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Price</Label>
                        <Input
                          value={activity.price}
                          onChange={(e) => updateActivity(index, 'price', e.target.value)}
                          placeholder="From $35"
                        />
                      </div>

                      <div>
                        <Label>Duration</Label>
                        <Input
                          value={activity.duration}
                          onChange={(e) => updateActivity(index, 'duration', e.target.value)}
                          placeholder="Full Day"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              <Button onClick={addActivity} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Activity
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Destination Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Destination Information</CardTitle>
              <CardDescription>
                General information about {destinationName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Population
                  </Label>
                  <Input
                    value={content.destinationInfo.population}
                    onChange={(e) => updateDestinationInfo('population', e.target.value)}
                    placeholder="752,993"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Area
                  </Label>
                  <Input
                    value={content.destinationInfo.area}
                    onChange={(e) => updateDestinationInfo('area', e.target.value)}
                    placeholder="37.31 km²"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Elevation
                  </Label>
                  <Input
                    value={content.destinationInfo.elevation}
                    onChange={(e) => updateDestinationInfo('elevation', e.target.value)}
                    placeholder="1 m"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Best Time to Visit
                  </Label>
                  <Input
                    value={content.destinationInfo.bestTime}
                    onChange={(e) => updateDestinationInfo('bestTime', e.target.value)}
                    placeholder="January to March"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Language
                  </Label>
                  <Input
                    value={content.destinationInfo.language}
                    onChange={(e) => updateDestinationInfo('language', e.target.value)}
                    placeholder="Sinhala, Tamil, English"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Currency
                  </Label>
                  <Input
                    value={content.destinationInfo.currency}
                    onChange={(e) => updateDestinationInfo('currency', e.target.value)}
                    placeholder="Sri Lankan Rupee (LKR)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DestinationAdmin;