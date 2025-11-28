import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Save,
  RefreshCw,
  MapPin,
  Cloud,
  Sun,
  Activity as ActivityIcon,
  Info,
  ListPlus,
  Trash2,
  Hotel,
  Utensils,
  FileText,
  Sparkles,
} from 'lucide-react';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

interface ActivityItem {
  name: string;
  description: string;
  icon: string; // string key, mapped in frontend to Lucide icon
  price: string;
  duration: string;
  popular?: boolean;
}

interface Restaurant {
  name: string;
  description: string;
  image: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  address: string;
}

interface HotelItem {
  name: string;
  description: string;
  image: string;
  starRating: number;
  priceRange: string;
  amenities: string[];
  address: string;
}

interface DestinationInfo {
  population: string;
  area: string;
  elevation: string;
  bestTime: string;
  language: string;
  currency: string;
}

interface WeatherInfo {
  temperature: string;
  humidity: string;
  rainfall: string;
  season: string;
}

interface TravelTip {
  title: string;
  content: string;
  icon?: string;
  category: string;
}

interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
}

interface CTASection {
  title: string;
  subtitle: string;
  buttonText: string;
}

interface DestinationContentAdmin {
  id?: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  heroSlides: HeroSlide[];
  attractions: Attraction[];
  activities: ActivityItem[];
  restaurants: Restaurant[];
  hotels: HotelItem[];
  destinationInfo: DestinationInfo;
  weatherInfo: WeatherInfo;
  travelTips: TravelTip[];
  seo: SEOSettings;
  ctaSection?: CTASection;
  isPublished: boolean;
}

const DEFAULT_KANDY_CONTENT: DestinationContentAdmin = {
  id: 'kandy',
  name: 'Kandy',
  slug: 'kandy',
  tagline: 'Cultural capital of Sri Lanka',
  description:
    'Kandy is Sri Lanka\'s hill-country capital, home to the Temple of the Tooth and surrounded by lush tea country, misty hills and a tranquil lake.',
  heroSlides: [
    {
      image:
        'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&q=80',
      title: 'Discover Kandy',
      subtitle: 'The Cultural Capital of Sri Lanka',
    },
  ],
  attractions: [],
  activities: [],
  restaurants: [],
  hotels: [],
  destinationInfo: {
    population: '125,400',
    area: '26.55 km²',
    elevation: '500 m',
    bestTime: 'January to April',
    language: 'Sinhala, Tamil, English',
    currency: 'Sri Lankan Rupee (LKR)',
  },
  weatherInfo: {
    temperature: '20-28°C',
    humidity: '75-85%',
    rainfall: 'Moderate',
    season: 'Tropical Highland',
  },
  travelTips: [],
  seo: {
    title: 'Kandy - Cultural Capital of Sri Lanka | Sacred Sites, Tours & Travel Guide',
    description:
      "Discover Kandy's Temple of the Tooth, botanical gardens, and cultural heritage. Plan your visit to Sri Lanka's hill capital with our complete travel guide.",
    keywords: ['Kandy', 'Sri Lanka', 'Temple of the Tooth', 'hill country', 'travel guide'],
  },
  ctaSection: {
    title: 'Ready to Explore Kandy?',
    subtitle: "Immerse yourself in Sri Lanka's cultural heart with our hand-crafted tours.",
    buttonText: 'Book Kandy Experience',
  },
  isPublished: true,
};

const DestinationContentManager: React.FC = () => {
  const [slug, setSlug] = useState('kandy');
  const [content, setContent] = useState<DestinationContentAdmin | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    loadContent(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadContent = async (currentSlug: string) => {
    setLoading(true);
    try {
      const ref = doc(db, 'destinations', currentSlug);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as DestinationContentAdmin;
        setContent({ ...DEFAULT_KANDY_CONTENT, ...data, slug: currentSlug });
        toast.success('Destination content loaded');
      } else {
        // Initialize with defaults in UI only; save happens when user clicks Save
        if (currentSlug === 'kandy') {
          setContent({ ...DEFAULT_KANDY_CONTENT });
        } else {
          setContent({
            ...DEFAULT_KANDY_CONTENT,
            id: currentSlug,
            name: currentSlug.charAt(0).toUpperCase() + currentSlug.slice(1),
            slug: currentSlug,
            heroSlides: DEFAULT_KANDY_CONTENT.heroSlides,
          });
        }
        toast.info('No existing document found. Edit and click Save to create it.');
      }
    } catch (error) {
      console.error('Error loading destination content:', error);
      toast.error('Failed to load destination content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const ref = doc(db, 'destinations', slug);
      const payload: DestinationContentAdmin = {
        ...content,
        slug,
        id: slug,
      };
      await setDoc(ref, {
        ...payload,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast.success('Destination content saved');
    } catch (error) {
      console.error('Error saving destination content:', error);
      toast.error('Failed to save destination content');
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof DestinationContentAdmin>(key: K, value: DestinationContentAdmin[K]) => {
    if (!content) return;
    setContent({ ...content, [key]: value });
  };

  const addHeroSlide = () => {
    if (!content) return;
    updateField('heroSlides', [
      ...content.heroSlides,
      { image: '', title: '', subtitle: '' },
    ]);
  };

  const updateHeroSlide = (index: number, field: keyof HeroSlide, value: string) => {
    if (!content) return;
    const slides = [...content.heroSlides];
    slides[index] = { ...slides[index], [field]: value };
    updateField('heroSlides', slides);
  };

  const removeHeroSlide = (index: number) => {
    if (!content) return;
    const slides = content.heroSlides.filter((_, i) => i !== index);
    updateField('heroSlides', slides);
  };

  const addAttraction = () => {
    if (!content) return;
    updateField('attractions', [
      ...content.attractions,
      {
        name: '',
        description: '',
        image: '',
        category: '',
        rating: 4.5,
        duration: '',
        price: '',
      },
    ]);
  };

  const updateAttraction = (index: number, field: keyof Attraction, value: string | number) => {
    if (!content) return;
    const list = [...content.attractions];
    list[index] = { ...list[index], [field]: value } as Attraction;
    updateField('attractions', list);
  };

  const removeAttraction = (index: number) => {
    if (!content) return;
    const list = content.attractions.filter((_, i) => i !== index);
    updateField('attractions', list);
  };

  const addActivity = () => {
    if (!content) return;
    updateField('activities', [
      ...content.activities,
      {
        name: '',
        description: '',
        icon: 'Crown',
        price: '',
        duration: '',
        popular: false,
      },
    ]);
  };

  const updateActivity = (index: number, field: keyof ActivityItem, value: string | boolean) => {
    if (!content) return;
    const list = [...content.activities];
    (list[index] as any)[field] = value;
    updateField('activities', list);
  };

  const removeActivity = (index: number) => {
    if (!content) return;
    const list = content.activities.filter((_, i) => i !== index);
    updateField('activities', list);
  };

  const addHotel = () => {
    if (!content) return;
    updateField('hotels', [
      ...content.hotels,
      {
        name: '',
        description: '',
        image: '',
        starRating: 4,
        priceRange: '',
        amenities: [],
        address: '',
      },
    ]);
  };

  const updateHotel = (index: number, field: keyof HotelItem, value: string | number) => {
    if (!content) return;
    const list = [...content.hotels];
    if (field === 'amenities') {
      return;
    }
    (list[index] as any)[field] = value;
    updateField('hotels', list);
  };

  const updateHotelAmenities = (index: number, value: string) => {
    if (!content) return;
    const list = [...content.hotels];
    list[index].amenities = value
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);
    updateField('hotels', list);
  };

  const removeHotel = (index: number) => {
    if (!content) return;
    const list = content.hotels.filter((_, i) => i !== index);
    updateField('hotels', list);
  };

  const addRestaurant = () => {
    if (!content) return;
    updateField('restaurants', [
      ...content.restaurants,
      {
        name: '',
        description: '',
        image: '',
        cuisine: '',
        priceRange: '',
        rating: 4.5,
        address: '',
      },
    ]);
  };

  const updateRestaurant = (index: number, field: keyof Restaurant, value: string | number) => {
    if (!content) return;
    const list = [...content.restaurants];
    (list[index] as any)[field] = value;
    updateField('restaurants', list);
  };

  const removeRestaurant = (index: number) => {
    if (!content) return;
    const list = content.restaurants.filter((_, i) => i !== index);
    updateField('restaurants', list);
  };

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading destination content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MapPin className="w-6 h-6 text-amber-600" />
              Destination Content Manager
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Manage dynamic content for destination pages. Currently editing
              <span className="font-semibold"> {content.name}</span> ({slug}).
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="slug" className="text-sm font-semibold">
                Slug
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.trim())}
                className="w-32"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadContent(slug)}
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4 mr-1" /> Reload
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="published-switch" className="text-sm">
                  Published
                </Label>
                <Switch
                  id="published-switch"
                  checked={content.isPublished}
                  onCheckedChange={(checked) => updateField('isPublished', checked)}
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save All Changes'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-xl">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-7 mb-6">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="attractions">Attractions</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
              <TabsTrigger value="info-weather">Info & Weather</TabsTrigger>
              <TabsTrigger value="seo">SEO & CTA</TabsTrigger>
            </TabsList>

            <TabsContent value="hero" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Destination Name</Label>
                  <Input
                    value={content.name}
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input
                    value={content.tagline || ''}
                    onChange={(e) => updateField('tagline', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Short Description</Label>
                <Textarea
                  rows={3}
                  value={content.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <ActivityIcon className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Hero Slides ({content.heroSlides.length})
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={addHeroSlide}>
                  <ListPlus className="w-4 h-4 mr-1" />
                  Add Slide
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-2">
                {content.heroSlides.map((slide, index) => (
                  <Card key={index} className="border border-dashed">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-semibold">
                        Slide {index + 1}
                      </CardTitle>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeHeroSlide(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label>Image URL</Label>
                        <Input
                          value={slide.image}
                          onChange={(e) => updateHeroSlide(index, 'image', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Title</Label>
                        <Input
                          value={slide.title}
                          onChange={(e) => updateHeroSlide(index, 'title', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Subtitle</Label>
                        <Input
                          value={slide.subtitle}
                          onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="attractions" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Attractions ({content.attractions.length})
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={addAttraction}>
                  <ListPlus className="w-4 h-4 mr-1" />
                  Add Attraction
                </Button>
              </div>

              {content.attractions.length === 0 && (
                <p className="text-sm text-gray-500">
                  No attractions added yet. Use "Add Attraction" to create your first
                  item.
                </p>
              )}

              <div className="space-y-4">
                {content.attractions.map((attraction, index) => (
                  <Card key={index} className="border border-dashed">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <CardTitle className="text-sm font-semibold">
                          {attraction.name || 'Untitled attraction'}
                        </CardTitle>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeAttraction(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Name</Label>
                        <Input
                          value={attraction.name}
                          onChange={(e) =>
                            updateAttraction(index, 'name', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Category</Label>
                        <Input
                          value={attraction.category}
                          onChange={(e) =>
                            updateAttraction(index, 'category', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={2}
                          value={attraction.description}
                          onChange={(e) =>
                            updateAttraction(index, 'description', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Image URL</Label>
                        <Input
                          value={attraction.image}
                          onChange={(e) =>
                            updateAttraction(index, 'image', e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label>Rating</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={attraction.rating}
                            onChange={(e) =>
                              updateAttraction(
                                index,
                                'rating',
                                Number(e.target.value) || 0,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Duration</Label>
                          <Input
                            value={attraction.duration}
                            onChange={(e) =>
                              updateAttraction(index, 'duration', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Price</Label>
                          <Input
                            value={attraction.price}
                            onChange={(e) =>
                              updateAttraction(index, 'price', e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activities" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ActivityIcon className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Activities ({content.activities.length})
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={addActivity}>
                  <ListPlus className="w-4 h-4 mr-1" />
                  Add Activity
                </Button>
              </div>

              {content.activities.length === 0 && (
                <p className="text-sm text-gray-500">
                  No activities added yet. Use "Add Activity" to create curated
                  experiences like train rides, cooking classes and temple walks.
                </p>
              )}

              <div className="space-y-4">
                {content.activities.map((activity, index) => (
                  <Card key={index} className="border border-dashed">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <CardTitle className="text-sm font-semibold">
                          {activity.name || 'Untitled activity'}
                        </CardTitle>
                        {activity.popular && (
                          <Badge className="bg-amber-500 text-white ml-2">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeActivity(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Name</Label>
                        <Input
                          value={activity.name}
                          onChange={(e) =>
                            updateActivity(index, 'name', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Icon Key (e.g. Crown, Train, TreePine)</Label>
                        <Input
                          value={activity.icon}
                          onChange={(e) =>
                            updateActivity(index, 'icon', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={2}
                          value={activity.description}
                          onChange={(e) =>
                            updateActivity(index, 'description', e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label>Duration</Label>
                          <Input
                            value={activity.duration}
                            onChange={(e) =>
                              updateActivity(index, 'duration', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Price</Label>
                          <Input
                            value={activity.price}
                            onChange={(e) =>
                              updateActivity(index, 'price', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1 flex items-center gap-2 mt-6">
                          <Switch
                            checked={activity.popular ?? false}
                            onCheckedChange={(checked) =>
                              updateActivity(index, 'popular', checked)
                            }
                          />
                          <span className="text-xs text-gray-600">Mark as popular</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hotels" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Hotels ({content.hotels.length})
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={addHotel}>
                  <ListPlus className="w-4 h-4 mr-1" />
                  Add Hotel
                </Button>
              </div>

              {content.hotels.length === 0 && (
                <p className="text-sm text-gray-500">
                  No hotels added yet. Use "Add Hotel" to curate recommended stays
                  in Kandy.
                </p>
              )}

              <div className="space-y-4">
                {content.hotels.map((hotel, index) => (
                  <Card key={index} className="border border-dashed">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <CardTitle className="text-sm font-semibold">
                          {hotel.name || 'Unnamed hotel'}
                        </CardTitle>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeHotel(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Name</Label>
                        <Input
                          value={hotel.name}
                          onChange={(e) =>
                            updateHotel(index, 'name', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Star Rating</Label>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          value={hotel.starRating}
                          onChange={(e) =>
                            updateHotel(
                              index,
                              'starRating',
                              Number(e.target.value) || 0,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={2}
                          value={hotel.description}
                          onChange={(e) =>
                            updateHotel(index, 'description', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Image URL</Label>
                        <Input
                          value={hotel.image}
                          onChange={(e) =>
                            updateHotel(index, 'image', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Price Range</Label>
                        <Input
                          value={hotel.priceRange}
                          onChange={(e) =>
                            updateHotel(index, 'priceRange', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label>Amenities (comma-separated)</Label>
                        <Input
                          value={hotel.amenities.join(', ')}
                          onChange={(e) =>
                            updateHotelAmenities(index, e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label>Address</Label>
                        <Input
                          value={hotel.address}
                          onChange={(e) =>
                            updateHotel(index, 'address', e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="restaurants" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Restaurants ({content.restaurants.length})
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={addRestaurant}>
                  <ListPlus className="w-4 h-4 mr-1" />
                  Add Restaurant
                </Button>
              </div>

              {content.restaurants.length === 0 && (
                <p className="text-sm text-gray-500">
                  No restaurants added yet. Use "Add Restaurant" to feature dining
                  spots in Kandy.
                </p>
              )}

              <div className="space-y-4">
                {content.restaurants.map((rest, index) => (
                  <Card key={index} className="border border-dashed">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <CardTitle className="text-sm font-semibold">
                          {rest.name || 'Unnamed restaurant'}
                        </CardTitle>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeRestaurant(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Name</Label>
                        <Input
                          value={rest.name}
                          onChange={(e) =>
                            updateRestaurant(index, 'name', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Cuisine</Label>
                        <Input
                          value={rest.cuisine}
                          onChange={(e) =>
                            updateRestaurant(index, 'cuisine', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={2}
                          value={rest.description}
                          onChange={(e) =>
                            updateRestaurant(index, 'description', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Image URL</Label>
                        <Input
                          value={rest.image}
                          onChange={(e) =>
                            updateRestaurant(index, 'image', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Price Range</Label>
                        <Input
                          value={rest.priceRange}
                          onChange={(e) =>
                            updateRestaurant(index, 'priceRange', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Rating</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={rest.rating}
                          onChange={(e) =>
                            updateRestaurant(
                              index,
                              'rating',
                              Number(e.target.value) || 0,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label>Address</Label>
                        <Input
                          value={rest.address}
                          onChange={(e) =>
                            updateRestaurant(index, 'address', e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="info-weather" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-amber-600" />
                      Destination Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <Label>Population</Label>
                      <Input
                        value={content.destinationInfo.population}
                        onChange={(e) =>
                          updateField('destinationInfo', {
                            ...content.destinationInfo,
                            population: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Area</Label>
                      <Input
                        value={content.destinationInfo.area}
                        onChange={(e) =>
                          updateField('destinationInfo', {
                            ...content.destinationInfo,
                            area: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Elevation</Label>
                      <Input
                        value={content.destinationInfo.elevation}
                        onChange={(e) =>
                          updateField('destinationInfo', {
                            ...content.destinationInfo,
                            elevation: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Best Time</Label>
                      <Input
                        value={content.destinationInfo.bestTime}
                        onChange={(e) =>
                          updateField('destinationInfo', {
                            ...content.destinationInfo,
                            bestTime: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Language</Label>
                      <Input
                        value={content.destinationInfo.language}
                        onChange={(e) =>
                          updateField('destinationInfo', {
                            ...content.destinationInfo,
                            language: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Currency</Label>
                      <Input
                        value={content.destinationInfo.currency}
                        onChange={(e) =>
                          updateField('destinationInfo', {
                            ...content.destinationInfo,
                            currency: e.target.value,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cloud className="w-5 h-5 text-blue-500" />
                      Weather Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <Label>Temperature</Label>
                      <Input
                        value={content.weatherInfo.temperature}
                        onChange={(e) =>
                          updateField('weatherInfo', {
                            ...content.weatherInfo,
                            temperature: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Humidity</Label>
                      <Input
                        value={content.weatherInfo.humidity}
                        onChange={(e) =>
                          updateField('weatherInfo', {
                            ...content.weatherInfo,
                            humidity: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Rainfall</Label>
                      <Input
                        value={content.weatherInfo.rainfall}
                        onChange={(e) =>
                          updateField('weatherInfo', {
                            ...content.weatherInfo,
                            rainfall: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Season</Label>
                      <Input
                        value={content.weatherInfo.season}
                        onChange={(e) =>
                          updateField('weatherInfo', {
                            ...content.weatherInfo,
                            season: e.target.value,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    SEO Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label>Meta Title</Label>
                    <Input
                      value={content.seo.title}
                      onChange={(e) =>
                        updateField('seo', {
                          ...content.seo,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Meta Description</Label>
                    <Textarea
                      rows={3}
                      value={content.seo.description}
                      onChange={(e) =>
                        updateField('seo', {
                          ...content.seo,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Keywords (comma-separated)</Label>
                    <Input
                      value={content.seo.keywords.join(', ')}
                      onChange={(e) =>
                        updateField('seo', {
                          ...content.seo,
                          keywords: e.target.value
                            .split(',')
                            .map((k) => k.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber-500" />
                    CTA Section
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label>CTA Title</Label>
                    <Input
                      value={content.ctaSection?.title || ''}
                      onChange={(e) =>
                        updateField('ctaSection', {
                          ...(content.ctaSection || DEFAULT_KANDY_CONTENT.ctaSection!),
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>CTA Subtitle</Label>
                    <Textarea
                      rows={2}
                      value={content.ctaSection?.subtitle || ''}
                      onChange={(e) =>
                        updateField('ctaSection', {
                          ...(content.ctaSection || DEFAULT_KANDY_CONTENT.ctaSection!),
                          subtitle: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Button Text</Label>
                    <Input
                      value={content.ctaSection?.buttonText || ''}
                      onChange={(e) =>
                        updateField('ctaSection', {
                          ...(content.ctaSection || DEFAULT_KANDY_CONTENT.ctaSection!),
                          buttonText: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DestinationContentManager;
