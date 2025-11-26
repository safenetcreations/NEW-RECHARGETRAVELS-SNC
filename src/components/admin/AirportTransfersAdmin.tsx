import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  Save, 
  Trash2, 
  Plus, 
  Upload, 
  Image as ImageIcon,
  Plane,
  DollarSign,
  Star,
  Clock,
  Shield,
  Car
} from 'lucide-react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

interface ServiceFeature {
  title: string;
  description: string;
  icon: string;
  feature: string;
}

interface PriceRoute {
  destination: string;
  price: string;
  duration: string;
}

interface AirportTransfersContent {
  heroSlides: HeroSlide[];
  serviceFeatures: ServiceFeature[];
  priceRoutes: PriceRoute[];
  trustIndicators: {
    rating: string;
    reviews: string;
    support: string;
  };
}

const defaultContent: AirportTransfersContent = {
  heroSlides: [
    {
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80",
      title: "Premium Airport Transfers",
      subtitle: "Your Journey Begins with Comfort",
      description: "Professional drivers, luxury vehicles, and seamless transfers to and from Bandaranaike International Airport"
    }
  ],
  serviceFeatures: [
    {
      title: "Meet & Greet Service",
      description: "Your driver will be waiting at arrivals with a name board",
      icon: "Users",
      feature: "Complimentary waiting time"
    }
  ],
  priceRoutes: [
    {
      destination: "Colombo City",
      price: "$35",
      duration: "45 mins"
    }
  ],
  trustIndicators: {
    rating: "4.9/5",
    reviews: "2,847",
    support: "24/7 Support"
  }
};

const AirportTransfersAdmin: React.FC = () => {
  const [content, setContent] = useState<AirportTransfersContent>(defaultContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'page-content', 'airport-transfers');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setContent(docSnap.data() as AirportTransfersContent);
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
      const docRef = doc(db, 'page-content', 'airport-transfers');
      await setDoc(docRef, content);
      toast.success('Content saved successfully!');
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
          subtitle: '',
          description: ''
        }
      ]
    });
  };

  const removeHeroSlide = (index: number) => {
    const newSlides = content.heroSlides.filter((_, i) => i !== index);
    setContent({ ...content, heroSlides: newSlides });
  };

  // Service Features Management
  const updateServiceFeature = (index: number, field: keyof ServiceFeature, value: string) => {
    const newFeatures = [...content.serviceFeatures];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setContent({ ...content, serviceFeatures: newFeatures });
  };

  const addServiceFeature = () => {
    setContent({
      ...content,
      serviceFeatures: [
        ...content.serviceFeatures,
        {
          title: '',
          description: '',
          icon: 'Car',
          feature: ''
        }
      ]
    });
  };

  const removeServiceFeature = (index: number) => {
    const newFeatures = content.serviceFeatures.filter((_, i) => i !== index);
    setContent({ ...content, serviceFeatures: newFeatures });
  };

  // Price Routes Management
  const updatePriceRoute = (index: number, field: keyof PriceRoute, value: string) => {
    const newRoutes = [...content.priceRoutes];
    newRoutes[index] = { ...newRoutes[index], [field]: value };
    setContent({ ...content, priceRoutes: newRoutes });
  };

  const addPriceRoute = () => {
    setContent({
      ...content,
      priceRoutes: [
        ...content.priceRoutes,
        {
          destination: '',
          price: '',
          duration: ''
        }
      ]
    });
  };

  const removePriceRoute = (index: number) => {
    const newRoutes = content.priceRoutes.filter((_, i) => i !== index);
    setContent({ ...content, priceRoutes: newRoutes });
  };

  // Trust Indicators Update
  const updateTrustIndicators = (field: keyof typeof content.trustIndicators, value: string) => {
    setContent({
      ...content,
      trustIndicators: {
        ...content.trustIndicators,
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
            <Plane className="w-8 h-8 text-blue-600" />
            Airport Transfers Content Management
          </h2>
          <p className="text-gray-600 mt-1">Manage hero slides, services, pricing, and more</p>
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
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="trust">Trust Indicators</TabsTrigger>
        </TabsList>

        {/* Hero Slides Tab */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Slides</CardTitle>
              <CardDescription>
                Manage the rotating hero images and content for the airport transfers page
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
                            placeholder="Premium Airport Transfers"
                          />
                        </div>

                        <div>
                          <Label>Subtitle</Label>
                          <Input
                            value={slide.subtitle}
                            onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)}
                            placeholder="Your Journey Begins with Comfort"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={slide.description}
                          onChange={(e) => updateHeroSlide(index, 'description', e.target.value)}
                          placeholder="Professional drivers, luxury vehicles..."
                          rows={2}
                        />
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

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Features</CardTitle>
              <CardDescription>
                Manage the key features and services offered
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.serviceFeatures.map((feature, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Feature {index + 1}</h4>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeServiceFeature(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={feature.title}
                          onChange={(e) => updateServiceFeature(index, 'title', e.target.value)}
                          placeholder="Meet & Greet Service"
                        />
                      </div>

                      <div>
                        <Label>Icon (Lucide icon name)</Label>
                        <Input
                          value={feature.icon}
                          onChange={(e) => updateServiceFeature(index, 'icon', e.target.value)}
                          placeholder="Users"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={feature.description}
                        onChange={(e) => updateServiceFeature(index, 'description', e.target.value)}
                        placeholder="Your driver will be waiting..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Feature Highlight</Label>
                      <Input
                        value={feature.feature}
                        onChange={(e) => updateServiceFeature(index, 'feature', e.target.value)}
                        placeholder="Complimentary waiting time"
                      />
                    </div>
                  </div>
                </Card>
              ))}

              <Button onClick={addServiceFeature} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Feature
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Pricing</CardTitle>
              <CardDescription>
                Manage fixed prices for popular destinations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.priceRoutes.map((route, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Route {index + 1}
                    </h4>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePriceRoute(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Destination</Label>
                      <Input
                        value={route.destination}
                        onChange={(e) => updatePriceRoute(index, 'destination', e.target.value)}
                        placeholder="Colombo City"
                      />
                    </div>

                    <div>
                      <Label>Price</Label>
                      <Input
                        value={route.price}
                        onChange={(e) => updatePriceRoute(index, 'price', e.target.value)}
                        placeholder="$35"
                      />
                    </div>

                    <div>
                      <Label>Duration</Label>
                      <Input
                        value={route.duration}
                        onChange={(e) => updatePriceRoute(index, 'duration', e.target.value)}
                        placeholder="45 mins"
                      />
                    </div>
                  </div>
                </Card>
              ))}

              <Button onClick={addPriceRoute} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Route
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trust Indicators Tab */}
        <TabsContent value="trust" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trust Indicators</CardTitle>
              <CardDescription>
                Update ratings, reviews, and support information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Rating
                  </Label>
                  <Input
                    value={content.trustIndicators.rating}
                    onChange={(e) => updateTrustIndicators('rating', e.target.value)}
                    placeholder="4.9/5"
                  />
                </div>

                <div>
                  <Label>Number of Reviews</Label>
                  <Input
                    value={content.trustIndicators.reviews}
                    onChange={(e) => updateTrustIndicators('reviews', e.target.value)}
                    placeholder="2,847"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Support Availability
                  </Label>
                  <Input
                    value={content.trustIndicators.support}
                    onChange={(e) => updateTrustIndicators('support', e.target.value)}
                    placeholder="24/7 Support"
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

export default AirportTransfersAdmin;