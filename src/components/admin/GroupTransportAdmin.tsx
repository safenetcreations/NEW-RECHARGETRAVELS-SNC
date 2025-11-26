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
  Bus,
  DollarSign,
  Star,
  Clock,
  Users,
  Shield,
  Heart
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

interface VehicleOption {
  name: string;
  capacity: string;
  features: string[];
  price: string;
  image: string;
  popular?: boolean;
}

interface ServiceFeature {
  title: string;
  description: string;
  icon: string;
  highlight: string;
}

interface GroupBenefit {
  title: string;
  description: string;
  icon: string;
}

interface GroupTransportContent {
  heroSlides: HeroSlide[];
  vehicleOptions: VehicleOption[];
  serviceFeatures: ServiceFeature[];
  groupBenefits: GroupBenefit[];
  trustIndicators: {
    rating: string;
    reviews: string;
    support: string;
  };
}

const defaultContent: GroupTransportContent = {
  heroSlides: [
    {
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80",
      title: "Travel Together, Save Together",
      subtitle: "Premium Group Transportation Solutions",
      description: "Comfortable coaches and vans for families, corporate groups, and large tour parties"
    }
  ],
  vehicleOptions: [
    {
      name: "Premium Van",
      capacity: "8-10 Passengers",
      features: ["Air Conditioning", "Comfortable Seats"],
      price: "From $80/day",
      image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80",
      popular: true
    }
  ],
  serviceFeatures: [
    {
      title: "Professional Drivers",
      description: "Experienced, licensed drivers with excellent safety records",
      icon: "Users",
      highlight: "English speaking"
    }
  ],
  groupBenefits: [
    {
      title: "Cost Effective",
      description: "Save up to 60% compared to multiple cars",
      icon: "Heart"
    }
  ],
  trustIndicators: {
    rating: "4.8/5",
    reviews: "1,456",
    support: "24/7 Support"
  }
};

const GroupTransportAdmin: React.FC = () => {
  const [content, setContent] = useState<GroupTransportContent>(defaultContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'page-content', 'group-transport');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setContent(docSnap.data() as GroupTransportContent);
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
      const docRef = doc(db, 'page-content', 'group-transport');
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

  // Vehicle Options Management
  const updateVehicleOption = (index: number, field: keyof VehicleOption, value: any) => {
    const newOptions = [...content.vehicleOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setContent({ ...content, vehicleOptions: newOptions });
  };

  const updateVehicleFeature = (vehicleIndex: number, featureIndex: number, value: string) => {
    const newOptions = [...content.vehicleOptions];
    newOptions[vehicleIndex].features[featureIndex] = value;
    setContent({ ...content, vehicleOptions: newOptions });
  };

  const addVehicleFeature = (vehicleIndex: number) => {
    const newOptions = [...content.vehicleOptions];
    newOptions[vehicleIndex].features.push('');
    setContent({ ...content, vehicleOptions: newOptions });
  };

  const removeVehicleFeature = (vehicleIndex: number, featureIndex: number) => {
    const newOptions = [...content.vehicleOptions];
    newOptions[vehicleIndex].features = newOptions[vehicleIndex].features.filter((_, i) => i !== featureIndex);
    setContent({ ...content, vehicleOptions: newOptions });
  };

  const addVehicleOption = () => {
    setContent({
      ...content,
      vehicleOptions: [
        ...content.vehicleOptions,
        {
          name: '',
          capacity: '',
          features: [''],
          price: '',
          image: '',
          popular: false
        }
      ]
    });
  };

  const removeVehicleOption = (index: number) => {
    const newOptions = content.vehicleOptions.filter((_, i) => i !== index);
    setContent({ ...content, vehicleOptions: newOptions });
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
          icon: 'Bus',
          highlight: ''
        }
      ]
    });
  };

  const removeServiceFeature = (index: number) => {
    const newFeatures = content.serviceFeatures.filter((_, i) => i !== index);
    setContent({ ...content, serviceFeatures: newFeatures });
  };

  // Group Benefits Management
  const updateGroupBenefit = (index: number, field: keyof GroupBenefit, value: string) => {
    const newBenefits = [...content.groupBenefits];
    newBenefits[index] = { ...newBenefits[index], [field]: value };
    setContent({ ...content, groupBenefits: newBenefits });
  };

  const addGroupBenefit = () => {
    setContent({
      ...content,
      groupBenefits: [
        ...content.groupBenefits,
        {
          title: '',
          description: '',
          icon: 'Users'
        }
      ]
    });
  };

  const removeGroupBenefit = (index: number) => {
    const newBenefits = content.groupBenefits.filter((_, i) => i !== index);
    setContent({ ...content, groupBenefits: newBenefits });
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
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
            <Bus className="w-8 h-8 text-green-600" />
            Group Transport Content Management
          </h2>
          <p className="text-gray-600 mt-1">Manage hero slides, vehicle options, services, and more</p>
        </div>
        <Button 
          onClick={saveContent} 
          disabled={saving}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero Slides</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="trust">Trust</TabsTrigger>
        </TabsList>

        {/* Hero Slides Tab */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Slides</CardTitle>
              <CardDescription>
                Manage the rotating hero images and content for the group transport page
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
                            placeholder="Travel Together, Save Together"
                          />
                        </div>

                        <div>
                          <Label>Subtitle</Label>
                          <Input
                            value={slide.subtitle}
                            onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)}
                            placeholder="Premium Group Transportation"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={slide.description}
                          onChange={(e) => updateHeroSlide(index, 'description', e.target.value)}
                          placeholder="Comfortable coaches and vans..."
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

        {/* Vehicle Options Tab */}
        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Fleet</CardTitle>
              <CardDescription>
                Manage available vehicles and their specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.vehicleOptions.map((vehicle, vehicleIndex) => (
                <Card key={vehicleIndex} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Bus className="w-4 h-4" />
                        Vehicle {vehicleIndex + 1}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={vehicle.popular || false}
                            onCheckedChange={(checked) => updateVehicleOption(vehicleIndex, 'popular', checked)}
                          />
                          <Label>Popular</Label>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeVehicleOption(vehicleIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Vehicle Name</Label>
                        <Input
                          value={vehicle.name}
                          onChange={(e) => updateVehicleOption(vehicleIndex, 'name', e.target.value)}
                          placeholder="Premium Van"
                        />
                      </div>

                      <div>
                        <Label>Capacity</Label>
                        <Input
                          value={vehicle.capacity}
                          onChange={(e) => updateVehicleOption(vehicleIndex, 'capacity', e.target.value)}
                          placeholder="8-10 Passengers"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Price</Label>
                        <Input
                          value={vehicle.price}
                          onChange={(e) => updateVehicleOption(vehicleIndex, 'price', e.target.value)}
                          placeholder="From $80/day"
                        />
                      </div>

                      <div>
                        <Label>Image URL</Label>
                        <Input
                          value={vehicle.image}
                          onChange={(e) => updateVehicleOption(vehicleIndex, 'image', e.target.value)}
                          placeholder="https://example.com/vehicle.jpg"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Vehicle Features</Label>
                      <div className="space-y-2 mt-2">
                        {vehicle.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex gap-2">
                            <Input
                              value={feature}
                              onChange={(e) => updateVehicleFeature(vehicleIndex, featureIndex, e.target.value)}
                              placeholder="Air Conditioning"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVehicleFeature(vehicleIndex, featureIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addVehicleFeature(vehicleIndex)}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Feature
                        </Button>
                      </div>
                    </div>

                    {vehicle.image && (
                      <div>
                        <Label>Preview</Label>
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              <Button onClick={addVehicleOption} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Vehicle
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
                          placeholder="Professional Drivers"
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
                        placeholder="Experienced, licensed drivers..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Highlight</Label>
                      <Input
                        value={feature.highlight}
                        onChange={(e) => updateServiceFeature(index, 'highlight', e.target.value)}
                        placeholder="English speaking"
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

        {/* Group Benefits Tab */}
        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Travel Benefits</CardTitle>
              <CardDescription>
                Manage the benefits of group transportation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.groupBenefits.map((benefit, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Benefit {index + 1}</h4>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeGroupBenefit(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={benefit.title}
                          onChange={(e) => updateGroupBenefit(index, 'title', e.target.value)}
                          placeholder="Cost Effective"
                        />
                      </div>

                      <div>
                        <Label>Icon (Lucide icon name)</Label>
                        <Input
                          value={benefit.icon}
                          onChange={(e) => updateGroupBenefit(index, 'icon', e.target.value)}
                          placeholder="Heart"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={benefit.description}
                        onChange={(e) => updateGroupBenefit(index, 'description', e.target.value)}
                        placeholder="Save up to 60% compared to multiple cars"
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
              ))}

              <Button onClick={addGroupBenefit} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Benefit
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
                    placeholder="4.8/5"
                  />
                </div>

                <div>
                  <Label>Number of Reviews</Label>
                  <Input
                    value={content.trustIndicators.reviews}
                    onChange={(e) => updateTrustIndicators('reviews', e.target.value)}
                    placeholder="1,456"
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

export default GroupTransportAdmin;