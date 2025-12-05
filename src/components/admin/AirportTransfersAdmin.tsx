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

interface VehiclePricing {
  id: string;
  name: string;
  basePrice: number; // USD
  pricePerKm: number; // USD per km
  passengers: number;
  luggage: number;
}

interface AirportTransfersContent {
  heroSlides: HeroSlide[];
  serviceFeatures: ServiceFeature[];
  priceRoutes: PriceRoute[];
  vehiclePricing: VehiclePricing[];
  trustIndicators: {
    rating: string;
    reviews: string;
    support: string;
  };
}

const defaultContent: AirportTransfersContent = {
  heroSlides: [
    {
      image: "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?auto=format&fit=crop&q=80",
      title: "Sri Lanka Airport Transfers",
      subtitle: "From Colombo Airport to Anywhere in Sri Lanka",
      description: "Professional meet & greet service at Bandaranaike International Airport (CMB). Safe, reliable transfers to all destinations."
    },
    {
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80",
      title: "Private Airport Pickup",
      subtitle: "Your Driver Waits at Arrivals",
      description: "Name board greeting, flight tracking, and complimentary 60-minute waiting time included with every transfer."
    },
    {
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80",
      title: "Comfortable Fleet",
      subtitle: "From Sedans to Luxury SUVs",
      description: "Air-conditioned vehicles with professional English-speaking drivers. Child seats and wheelchair access available."
    }
  ],
  serviceFeatures: [
    {
      title: "Meet & Greet Service",
      description: "Your driver will be waiting at arrivals with a name board",
      icon: "Users",
      feature: "Complimentary 60-min wait"
    },
    {
      title: "Flight Tracking",
      description: "We monitor your flight and adjust pickup time accordingly",
      icon: "Plane",
      feature: "No extra charge for delays"
    },
    {
      title: "24/7 Support",
      description: "WhatsApp & phone support available around the clock",
      icon: "Headphones",
      feature: "Instant response"
    },
    {
      title: "Fixed Prices",
      description: "No hidden fees, no surge pricing, pay what you see",
      icon: "DollarSign",
      feature: "All-inclusive rates"
    }
  ],
  priceRoutes: [
    { destination: "Colombo City", price: "$35", duration: "45 mins" },
    { destination: "Negombo Beach", price: "$15", duration: "15 mins" },
    { destination: "Kandy", price: "$85", duration: "3.5 hrs" },
    { destination: "Galle Fort", price: "$95", duration: "2.5 hrs" },
    { destination: "Sigiriya", price: "$110", duration: "4 hrs" },
    { destination: "Ella", price: "$145", duration: "6 hrs" },
    { destination: "Mirissa/Weligama", price: "$105", duration: "3 hrs" },
    { destination: "Bentota", price: "$65", duration: "1.5 hrs" },
    { destination: "Nuwara Eliya", price: "$120", duration: "5 hrs" },
    { destination: "Arugam Bay", price: "$175", duration: "7 hrs" },
    { destination: "Trincomalee", price: "$150", duration: "6 hrs" },
    { destination: "Jaffna", price: "$195", duration: "8 hrs" }
  ],
  vehiclePricing: [
    { id: 'economy', name: 'Economy Sedan', basePrice: 11, pricePerKm: 0.25, passengers: 3, luggage: 2 },
    { id: 'sedan', name: 'Premium Sedan', basePrice: 14, pricePerKm: 0.31, passengers: 3, luggage: 3 },
    { id: 'suv', name: 'SUV', basePrice: 23, pricePerKm: 0.47, passengers: 5, luggage: 4 },
    { id: 'van', name: 'Mini Van', basePrice: 20, pricePerKm: 0.41, passengers: 8, luggage: 6 },
    { id: 'luxury', name: 'Luxury Vehicle', basePrice: 47, pricePerKm: 0.78, passengers: 3, luggage: 3 },
    { id: 'luxury-suv', name: 'Luxury SUV', basePrice: 63, pricePerKm: 0.94, passengers: 5, luggage: 5 },
    { id: 'coach', name: 'Mini Coach', basePrice: 38, pricePerKm: 0.63, passengers: 15, luggage: 15 },
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

  // Vehicle Pricing Management
  const updateVehiclePricing = (index: number, field: keyof VehiclePricing, value: string | number) => {
    const newPricing = [...(content.vehiclePricing || defaultContent.vehiclePricing)];
    newPricing[index] = { ...newPricing[index], [field]: typeof value === 'string' && (field === 'basePrice' || field === 'pricePerKm' || field === 'passengers' || field === 'luggage') ? parseFloat(value) || 0 : value };
    setContent({ ...content, vehiclePricing: newPricing });
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero Slides</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicle Pricing</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="pricing">Routes</TabsTrigger>
          <TabsTrigger value="trust">Trust</TabsTrigger>
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

        {/* Vehicle Pricing Tab */}
        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Vehicle Pricing Configuration
              </CardTitle>
              <CardDescription>
                Set base prices (USD) and per-kilometer rates for each vehicle type. Total = Base Price + (Distance × Price per KM)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Pricing Formula:</strong> Total Price = Base Price + (Distance in km × Price per KM)
                  <br />
                  <strong>Example:</strong> Economy Sedan to Negombo (11km) = $11 + (11 × $0.25) = $13.75
                </p>
              </div>

              <div className="grid gap-4">
                {(content.vehiclePricing || defaultContent.vehiclePricing).map((vehicle, index) => (
                  <Card key={vehicle.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Car className="w-4 h-4 text-blue-600" />
                        {vehicle.name}
                      </h4>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">ID: {vehicle.id}</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs">Base Price (USD)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="number"
                            step="0.01"
                            value={vehicle.basePrice}
                            onChange={(e) => updateVehiclePricing(index, 'basePrice', e.target.value)}
                            className="pl-7"
                            placeholder="11.00"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Price per KM (USD)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="number"
                            step="0.01"
                            value={vehicle.pricePerKm}
                            onChange={(e) => updateVehiclePricing(index, 'pricePerKm', e.target.value)}
                            className="pl-7"
                            placeholder="0.25"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Max Passengers</Label>
                        <Input
                          type="number"
                          value={vehicle.passengers}
                          onChange={(e) => updateVehiclePricing(index, 'passengers', e.target.value)}
                          placeholder="3"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Max Luggage</Label>
                        <Input
                          type="number"
                          value={vehicle.luggage}
                          onChange={(e) => updateVehiclePricing(index, 'luggage', e.target.value)}
                          placeholder="2"
                        />
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-800">
                      <strong>Sample pricing (50km trip):</strong> ${vehicle.basePrice} + (50 × ${vehicle.pricePerKm}) = ${(vehicle.basePrice + (50 * vehicle.pricePerKm)).toFixed(2)}
                    </div>
                  </Card>
                ))}
              </div>
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