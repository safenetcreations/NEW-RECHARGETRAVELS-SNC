import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Save,
  RefreshCw,
  Plane,
  Map,
  Activity as ActivityIcon,
  ListPlus,
  Trash2,
  HelpCircle,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  duration: string;
  price: string;
  highlights: string[];
}

interface ActivityItem {
  id: string;
  name: string;
  description: string;
  icon: string; // string key mapped in frontend
  price: string;
  duration: string;
  popular?: boolean;
}

interface Itinerary {
  id: string;
  title: string;
  duration: string;
  description: string;
  highlights: string[];
  price: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface TravelTipItem {
  id: string;
  title: string;
  icon: string; // string key; frontend maps to icon component
  tips: string[];
}

interface Overview {
  title: string;
  description: string;
  highlights: string[];
}

interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
}

interface NegomboContentAdmin {
  hero: {
    slides: HeroSlide[];
    title: string;
    subtitle: string;
  };
  overview: Overview;
  seo: SEOSettings;
  attractions: Attraction[];
  activities: ActivityItem[];
  itineraries: Itinerary[];
  faqs: FAQItem[];
  gallery: string[];
  travelTips: TravelTipItem[];
  updatedAt?: any;
}

const DEFAULT_CONTENT: NegomboContentAdmin = {
  hero: {
    slides: [
      {
        id: '1',
        image:
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80',
        title: 'Welcome to Negombo',
        subtitle: 'The Beach Gateway to Sri Lanka',
      },
      {
        id: '2',
        image:
          'https://images.unsplash.com/photo-1586500036706-41963de24d8b?auto=format&fit=crop&q=80',
        title: 'Fishing Heritage',
        subtitle: 'Experience Traditional Lagoon Life',
      },
      {
        id: '3',
        image:
          'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80',
        title: 'Dutch Canals',
        subtitle: 'Navigate Historic Waterways',
      },
    ],
    title: 'Negombo',
    subtitle: 'Beach Gateway Near Airport with Canals',
  },
  overview: {
    title: 'Why Visit Negombo?',
    description:
      "Negombo, known as 'Little Rome' for its strong Catholic heritage, is a vibrant beach town just minutes from Colombo's international airport. This historic fishing town offers beautiful beaches, Dutch-era canals, colorful fish markets, and colonial architecture.",
    highlights: [
      'Just 10km from Colombo International Airport',
      'Long sandy beaches with water sports',
      'Historic Dutch canals and Hamilton Canal',
      'Colorful Negombo Fish Market (Lellama)',
    ],
  },
  seo: {
    title:
      'Negombo Beach Sri Lanka - Airport Hotels & Beach Guide | Recharge Travels',
    description:
      "Discover Negombo's beaches, Dutch canals, and fish markets just 10km from Colombo Airport. Perfect for transit stays or beach holidays near the airport.",
    keywords:
      'Negombo beach, hotels near Colombo airport, Negombo fish market, Dutch canals Sri Lanka, Negombo lagoon, airport beach hotels, Negombo travel guide, Little Rome Sri Lanka',
  },
  attractions: [],
  activities: [],
  itineraries: [],
  faqs: [],
  gallery: [],
  travelTips: [],
};

const NegomboDestinationManagement: React.FC = () => {
  const [content, setContent] = useState<NegomboContentAdmin | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero-overview');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const ref = doc(db, 'destinations', 'negombo');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as Partial<NegomboContentAdmin>;
        setContent({
          ...DEFAULT_CONTENT,
          ...data,
          hero: {
            ...DEFAULT_CONTENT.hero,
            ...(data.hero || {}),
          },
          overview: {
            ...DEFAULT_CONTENT.overview,
            ...(data.overview || {}),
          },
          seo: {
            ...DEFAULT_CONTENT.seo,
            ...(data.seo || {}),
          },
          attractions: data.attractions || DEFAULT_CONTENT.attractions,
          activities: data.activities || DEFAULT_CONTENT.activities,
          itineraries: data.itineraries || DEFAULT_CONTENT.itineraries,
          faqs: data.faqs || DEFAULT_CONTENT.faqs,
          gallery: data.gallery || DEFAULT_CONTENT.gallery,
          travelTips: data.travelTips || DEFAULT_CONTENT.travelTips,
        });
        toast.success('Negombo content loaded');
      } else {
        setContent(DEFAULT_CONTENT);
        toast.info('No existing Negombo doc found. Using defaults; Save to create.');
      }
    } catch (error) {
      console.error('Error loading Negombo destination content:', error);
      toast.error('Failed to load Negombo content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const ref = doc(db, 'destinations', 'negombo');
      await setDoc(
        ref,
        {
          ...content,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      toast.success('Negombo destination content saved');
    } catch (error) {
      console.error('Error saving Negombo destination content:', error);
      toast.error('Failed to save Negombo content');
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof NegomboContentAdmin>(
    key: K,
    value: NegomboContentAdmin[K],
  ) => {
    if (!content) return;
    setContent({ ...content, [key]: value });
  };

  const updateHeroSlide = (index: number, field: keyof HeroSlide, value: string) => {
    if (!content) return;
    const slides = [...content.hero.slides];
    slides[index] = { ...slides[index], [field]: value };
    updateField('hero', { ...content.hero, slides });
  };

  const addHeroSlide = () => {
    if (!content) return;
    const slides = [
      ...content.hero.slides,
      {
        id: String(Date.now()),
        image: '',
        title: '',
        subtitle: '',
      },
    ];
    updateField('hero', { ...content.hero, slides });
  };

  const removeHeroSlide = (index: number) => {
    if (!content) return;
    const slides = content.hero.slides.filter((_, i) => i !== index);
    updateField('hero', { ...content.hero, slides });
  };

  const addAttraction = () => {
    if (!content) return;
    const next: Attraction = {
      id: String(Date.now()),
      name: '',
      description: '',
      image: '',
      category: '',
      rating: 4.5,
      duration: '',
      price: '',
      highlights: [],
    };
    updateField('attractions', [...content.attractions, next]);
  };

  const updateAttraction = (
    index: number,
    field: keyof Attraction,
    value: string | number | string[],
  ) => {
    if (!content) return;
    const list = [...content.attractions];
    (list[index] as any)[field] = value;
    updateField('attractions', list);
  };

  const removeAttraction = (index: number) => {
    if (!content) return;
    updateField(
      'attractions',
      content.attractions.filter((_, i) => i !== index),
    );
  };

  const addActivity = () => {
    if (!content) return;
    const next: ActivityItem = {
      id: String(Date.now()),
      name: '',
      description: '',
      icon: 'Plane',
      price: '',
      duration: '',
      popular: false,
    };
    updateField('activities', [...content.activities, next]);
  };

  const updateActivity = (
    index: number,
    field: keyof ActivityItem,
    value: string | boolean,
  ) => {
    if (!content) return;
    const list = [...content.activities];
    (list[index] as any)[field] = value;
    updateField('activities', list);
  };

  const removeActivity = (index: number) => {
    if (!content) return;
    updateField(
      'activities',
      content.activities.filter((_, i) => i !== index),
    );
  };

  const addItinerary = () => {
    if (!content) return;
    const next: Itinerary = {
      id: String(Date.now()),
      title: '',
      duration: '',
      description: '',
      highlights: [],
      price: '',
    };
    updateField('itineraries', [...content.itineraries, next]);
  };

  const updateItinerary = (
    index: number,
    field: keyof Itinerary,
    value: string | string[],
  ) => {
    if (!content) return;
    const list = [...content.itineraries];
    (list[index] as any)[field] = value;
    updateField('itineraries', list);
  };

  const removeItinerary = (index: number) => {
    if (!content) return;
    updateField(
      'itineraries',
      content.itineraries.filter((_, i) => i !== index),
    );
  };

  const addFaq = () => {
    if (!content) return;
    const next: FAQItem = {
      id: String(Date.now()),
      question: '',
      answer: '',
    };
    updateField('faqs', [...content.faqs, next]);
  };

  const updateFaq = (
    index: number,
    field: keyof FAQItem,
    value: string,
  ) => {
    if (!content) return;
    const list = [...content.faqs];
    (list[index] as any)[field] = value;
    updateField('faqs', list);
  };

  const removeFaq = (index: number) => {
    if (!content) return;
    updateField(
      'faqs',
      content.faqs.filter((_, i) => i !== index),
    );
  };

  const addTravelTip = () => {
    if (!content) return;
    const next: TravelTipItem = {
      id: String(Date.now()),
      title: '',
      icon: 'Plane',
      tips: [],
    };
    updateField('travelTips', [...content.travelTips, next]);
  };

  const updateTravelTip = (
    index: number,
    field: keyof TravelTipItem,
    value: string | string[],
  ) => {
    if (!content) return;
    const list = [...content.travelTips];
    (list[index] as any)[field] = value;
    updateField('travelTips', list);
  };

  const removeTravelTip = (index: number) => {
    if (!content) return;
    updateField(
      'travelTips',
      content.travelTips.filter((_, i) => i !== index),
    );
  };

  const addGalleryImage = () => {
    if (!content) return;
    updateField('gallery', [...content.gallery, '']);
  };

  const updateGalleryImage = (index: number, url: string) => {
    if (!content) return;
    const list = [...content.gallery];
    list[index] = url;
    updateField('gallery', list);
  };

  const removeGalleryImage = (index: number) => {
    if (!content) return;
    updateField(
      'gallery',
      content.gallery.filter((_, i) => i !== index),
    );
  };

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading Negombo destination content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Map className="w-6 h-6 text-blue-600" />
              Negombo Destination Page Management
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Manage hero, attractions, activities, tours, FAQs, tips and SEO for the
              Negombo destination page.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadContent}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-1" /> Reload
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-xl">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-6">
              <TabsTrigger value="hero-overview">Hero & Overview</TabsTrigger>
              <TabsTrigger value="attractions">Attractions</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="itineraries">Tours</TabsTrigger>
              <TabsTrigger value="tips-faqs">Travel Tips & FAQs</TabsTrigger>
              <TabsTrigger value="gallery-seo">Gallery & SEO</TabsTrigger>
            </TabsList>

            {/* Hero & Overview */}
            <TabsContent value="hero-overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hero Title</Label>
                  <Input
                    value={content.hero.title}
                    onChange={(e) =>
                      updateField('hero', { ...content.hero, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Subtitle</Label>
                  <Input
                    value={content.hero.subtitle}
                    onChange={(e) =>
                      updateField('hero', { ...content.hero, subtitle: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Hero Slides ({content.hero.slides.length})
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={addHeroSlide}>
                  <ListPlus className="w-4 h-4 mr-1" /> Add Slide
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {content.hero.slides.map((slide, index) => (
                  <Card key={slide.id || index} className="border border-dashed">
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
                          onChange={(e) =>
                            updateHeroSlide(index, 'image', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Title</Label>
                        <Input
                          value={slide.title}
                          onChange={(e) =>
                            updateHeroSlide(index, 'title', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Subtitle</Label>
                        <Input
                          value={slide.subtitle}
                          onChange={(e) =>
                            updateHeroSlide(index, 'subtitle', e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Overview Title</Label>
                  <Input
                    value={content.overview.title}
                    onChange={(e) =>
                      updateField('overview', {
                        ...content.overview,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Overview Description</Label>
                  <Textarea
                    rows={4}
                    value={content.overview.description}
                    onChange={(e) =>
                      updateField('overview', {
                        ...content.overview,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Overview Highlights</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateField('overview', {
                          ...content.overview,
                          highlights: [...content.overview.highlights, ''],
                        })
                      }
                    >
                      <ListPlus className="w-4 h-4 mr-1" /> Add Highlight
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {content.overview.highlights.map((h, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={h}
                          onChange={(e) => {
                            const list = [...content.overview.highlights];
                            list[idx] = e.target.value;
                            updateField('overview', {
                              ...content.overview,
                              highlights: list,
                            });
                          }}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            const list = content.overview.highlights.filter(
                              (_, i) => i !== idx,
                            );
                            updateField('overview', {
                              ...content.overview,
                              highlights: list,
                            });
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Attractions */}
            <TabsContent value="attractions" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Attractions ({content.attractions.length})
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={addAttraction}>
                  <ListPlus className="w-4 h-4 mr-1" /> Add Attraction
                </Button>
              </div>
              {content.attractions.length === 0 && (
                <p className="text-sm text-gray-500">
                  No attractions yet. Add items to power the "Top Attractions in
                  Negombo" grid.
                </p>
              )}
              <div className="space-y-4">
                {content.attractions.map((attraction, index) => (
                  <Card key={attraction.id || index} className="border border-dashed">
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
                      <div className="space-y-1 md:col-span-2">
                        <Label>Highlights (comma-separated)</Label>
                        <Input
                          value={attraction.highlights.join(', ')}
                          onChange={(e) =>
                            updateAttraction(index, 'highlights',
                              e.target.value
                                .split(',')
                                .map((v) => v.trim())
                                .filter(Boolean),
                            )
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Activities */}
            <TabsContent value="activities" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ActivityIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Activities ({content.activities.length})
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={addActivity}>
                  <ListPlus className="w-4 h-4 mr-1" /> Add Activity
                </Button>
              </div>
              {content.activities.length === 0 && (
                <p className="text-sm text-gray-500">
                  No activities yet. Use icon keys like Plane, Ship, Fish, Utensils,
                  Activity, Church to match the Negombo page icons.
                </p>
              )}
              <div className="space-y-4">
                {content.activities.map((activity, index) => (
                  <Card key={activity.id || index} className="border border-dashed">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <CardTitle className="text-sm font-semibold">
                          {activity.name || 'Untitled activity'}
                        </CardTitle>
                        {activity.popular && (
                          <Badge className="bg-blue-500 text-white ml-2">
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
                        <Label>Icon Key (Plane, Ship, Fish, Utensils, Activity, Church)</Label>
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
                        <div className="space-y-1 mt-6 flex items-center gap-2">
                          <Input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={activity.popular ?? false}
                            onChange={(e) =>
                              updateActivity(index, 'popular', e.target.checked)
                            }
                          />
                          <span className="text-xs text-gray-600">
                            Mark as popular
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Itineraries / Tours */}
            <TabsContent value="itineraries" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Suggested Tours ({content.itineraries.length})
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={addItinerary}>
                  <ListPlus className="w-4 h-4 mr-1" /> Add Tour
                </Button>
              </div>
              {content.itineraries.length === 0 && (
                <p className="text-sm text-gray-500">
                  No tours yet. These power the "Suggested Tours & Itineraries" section
                  on the Negombo page.
                </p>
              )}
              <div className="space-y-4">
                {content.itineraries.map((itinerary, index) => (
                  <Card key={itinerary.id || index} className="border border-dashed">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <CardTitle className="text-sm font-semibold">
                          {itinerary.title || 'Untitled tour'}
                        </CardTitle>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeItinerary(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label>Title</Label>
                          <Input
                            value={itinerary.title}
                            onChange={(e) =>
                              updateItinerary(index, 'title', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Duration</Label>
                          <Input
                            value={itinerary.duration}
                            onChange={(e) =>
                              updateItinerary(index, 'duration', e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label>Description</Label>
                        <Textarea
                          rows={2}
                          value={itinerary.description}
                          onChange={(e) =>
                            updateItinerary(index, 'description', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Highlights (one per line)</Label>
                        <Textarea
                          rows={3}
                          value={itinerary.highlights.join('\n')}
                          onChange={(e) =>
                            updateItinerary(index, 'highlights',
                              e.target.value
                                .split('\n')
                                .map((v) => v.trim())
                                .filter(Boolean),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Price</Label>
                        <Input
                          value={itinerary.price}
                          onChange={(e) =>
                            updateItinerary(index, 'price', e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Travel Tips & FAQs */}
            <TabsContent value="tips-faqs" className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      Travel Tips ({content.travelTips.length})
                    </span>
                  </div>
                  <Button size="sm" variant="outline" onClick={addTravelTip}>
                    <ListPlus className="w-4 h-4 mr-1" /> Add Tips Section
                  </Button>
                </div>
                {content.travelTips.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No tips yet. These power the "Travel Tips for Negombo" tab.
                  </p>
                )}
                <div className="space-y-4">
                  {content.travelTips.map((tip, index) => (
                    <Card key={tip.id || index} className="border border-dashed">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <CardTitle className="text-sm font-semibold">
                            {tip.title || 'Untitled tips section'}
                          </CardTitle>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeTravelTip(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Title</Label>
                            <Input
                              value={tip.title}
                              onChange={(e) =>
                                updateTravelTip(index, 'title', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Icon Key (Plane, Calendar, Navigation, etc.)</Label>
                            <Input
                              value={tip.icon}
                              onChange={(e) =>
                                updateTravelTip(index, 'icon', e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label>Tips (one per line)</Label>
                          <Textarea
                            rows={3}
                            value={tip.tips.join('\n')}
                            onChange={(e) =>
                              updateTravelTip(index, 'tips',
                                e.target.value
                                  .split('\n')
                                  .map((v) => v.trim())
                                  .filter(Boolean),
                              )
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      FAQs ({content.faqs.length})
                    </span>
                  </div>
                  <Button size="sm" variant="outline" onClick={addFaq}>
                    <ListPlus className="w-4 h-4 mr-1" /> Add FAQ
                  </Button>
                </div>
                {content.faqs.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No FAQs yet. These power the FAQ accordion tab on the Negombo
                    page.
                  </p>
                )}
                <div className="space-y-4">
                  {content.faqs.map((faq, index) => (
                    <Card key={faq.id || index} className="border border-dashed">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <CardTitle className="text-sm font-semibold">
                            {faq.question || 'FAQ question'}
                          </CardTitle>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeFaq(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label>Question</Label>
                          <Input
                            value={faq.question}
                            onChange={(e) =>
                              updateFaq(index, 'question', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Answer</Label>
                          <Textarea
                            rows={3}
                            value={faq.answer}
                            onChange={(e) =>
                              updateFaq(index, 'answer', e.target.value)
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Gallery & SEO */}
            <TabsContent value="gallery-seo" className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      Gallery Images ({content.gallery.length})
                    </span>
                  </div>
                  <Button size="sm" variant="outline" onClick={addGalleryImage}>
                    <ListPlus className="w-4 h-4 mr-1" /> Add Image URL
                  </Button>
                </div>
                {content.gallery.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No gallery images yet. These power the Negombo gallery carousel
                    near the bottom of the page.
                  </p>
                )}
                <div className="space-y-2">
                  {content.gallery.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => updateGalleryImage(index, e.target.value)}
                        placeholder="Image URL"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    SEO Settings
                  </span>
                </div>
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input
                    value={content.seo.title}
                    onChange={(e) =>
                      updateField('seo', { ...content.seo, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
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
                <div className="space-y-2">
                  <Label>Keywords (comma-separated)</Label>
                  <Textarea
                    rows={2}
                    value={content.seo.keywords}
                    onChange={(e) =>
                      updateField('seo', {
                        ...content.seo,
                        keywords: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NegomboDestinationManagement;
