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
  Route,
  DollarSign,
  Star,
  Clock,
  Users,
  Globe,
  Camera
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

interface TourPackage {
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  popular?: boolean;
}

interface ServiceFeature {
  title: string;
  description: string;
  icon: string;
  benefit: string;
}

interface PrivateToursContent {
  heroSlides: HeroSlide[];
  tourPackages: TourPackage[];
  serviceFeatures: ServiceFeature[];
  trustIndicators: {
    rating: string;
    reviews: string;
    support: string;
  };
}

const defaultContent: PrivateToursContent = {
  heroSlides: [
    {
      image: "https://images.unsplash.com/photo-1588979355313-6711a095465f?auto=format&fit=crop&q=80",
      title: "Discover Sri Lanka Your Way",
      subtitle: "Private Tours with Local Experts",
      description: "Create unforgettable memories with personalized tours guided by experienced locals"
    }
  ],
  tourPackages: [
    {
      name: "Cultural Triangle Tour",
      duration: "3 Days",
      price: "$350",
      highlights: ["Sigiriya Rock", "Dambulla Cave Temple"],
      popular: true
    }
  ],
  serviceFeatures: [
    {
      title: "Expert Local Guides",
      description: "Knowledgeable guides who share insider stories",
      icon: "User",
      benefit: "Authentic experiences"
    }
  ],
  trustIndicators: {
    rating: "4.9/5",
    reviews: "1,892",
    support: "24/7 Support"
  }
};

const PrivateToursAdmin: React.FC = () => {
  const [content, setContent] = useState<PrivateToursContent>(defaultContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'page-content', 'private-tours');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setContent(docSnap.data() as PrivateToursContent);
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
      const docRef = doc(db, 'page-content', 'private-tours');
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

  // Tour Packages Management
  const updateTourPackage = (index: number, field: keyof TourPackage, value: any) => {
    const newPackages = [...content.tourPackages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setContent({ ...content, tourPackages: newPackages });
  };

  const updateTourHighlight = (packageIndex: number, highlightIndex: number, value: string) => {
    const newPackages = [...content.tourPackages];
    newPackages[packageIndex].highlights[highlightIndex] = value;
    setContent({ ...content, tourPackages: newPackages });
  };

  const addTourHighlight = (packageIndex: number) => {
    const newPackages = [...content.tourPackages];
    newPackages[packageIndex].highlights.push('');
    setContent({ ...content, tourPackages: newPackages });
  };

  const removeTourHighlight = (packageIndex: number, highlightIndex: number) => {
    const newPackages = [...content.tourPackages];
    newPackages[packageIndex].highlights = newPackages[packageIndex].highlights.filter((_, i) => i !== highlightIndex);
    setContent({ ...content, tourPackages: newPackages });
  };

  const addTourPackage = () => {
    setContent({
      ...content,
      tourPackages: [
        ...content.tourPackages,
        {
          name: '',
          duration: '',
          price: '',
          highlights: [''],
          popular: false
        }
      ]
    });
  };

  const removeTourPackage = (index: number) => {
    const newPackages = content.tourPackages.filter((_, i) => i !== index);
    setContent({ ...content, tourPackages: newPackages });
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
          icon: 'Globe',
          benefit: ''
        }
      ]
    });
  };

  const removeServiceFeature = (index: number) => {
    const newFeatures = content.serviceFeatures.filter((_, i) => i !== index);
    setContent({ ...content, serviceFeatures: newFeatures });
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
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
            <Route className="w-8 h-8 text-purple-600" />
            Private Tours Content Management
          </h2>
          <p className="text-gray-600 mt-1">Manage hero slides, tour packages, services, and more</p>
        </div>
        <Button 
          onClick={saveContent} 
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero Slides</TabsTrigger>
          <TabsTrigger value="packages">Tour Packages</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="trust">Trust Indicators</TabsTrigger>
        </TabsList>

        {/* Hero Slides Tab */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Slides</CardTitle>
              <CardDescription>
                Manage the rotating hero images and content for the private tours page
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
                            placeholder="Discover Sri Lanka Your Way"
                          />
                        </div>

                        <div>
                          <Label>Subtitle</Label>
                          <Input
                            value={slide.subtitle}
                            onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)}
                            placeholder="Private Tours with Local Experts"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={slide.description}
                          onChange={(e) => updateHeroSlide(index, 'description', e.target.value)}
                          placeholder="Create unforgettable memories..."
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

        {/* Tour Packages Tab */}
        <TabsContent value="packages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tour Packages</CardTitle>
              <CardDescription>
                Manage available tour packages and their details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.tourPackages.map((pkg, packageIndex) => (
                <Card key={packageIndex} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Package {packageIndex + 1}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={pkg.popular || false}
                            onCheckedChange={(checked) => updateTourPackage(packageIndex, 'popular', checked)}
                          />
                          <Label>Popular</Label>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTourPackage(packageIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Package Name</Label>
                        <Input
                          value={pkg.name}
                          onChange={(e) => updateTourPackage(packageIndex, 'name', e.target.value)}
                          placeholder="Cultural Triangle Tour"
                        />
                      </div>

                      <div>
                        <Label>Duration</Label>
                        <Input
                          value={pkg.duration}
                          onChange={(e) => updateTourPackage(packageIndex, 'duration', e.target.value)}
                          placeholder="3 Days"
                        />
                      </div>

                      <div>
                        <Label>Price</Label>
                        <Input
                          value={pkg.price}
                          onChange={(e) => updateTourPackage(packageIndex, 'price', e.target.value)}
                          placeholder="$350"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Tour Highlights</Label>
                      <div className="space-y-2 mt-2">
                        {pkg.highlights.map((highlight, highlightIndex) => (
                          <div key={highlightIndex} className="flex gap-2">
                            <Input
                              value={highlight}
                              onChange={(e) => updateTourHighlight(packageIndex, highlightIndex, e.target.value)}
                              placeholder="Sigiriya Rock"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTourHighlight(packageIndex, highlightIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTourHighlight(packageIndex)}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Highlight
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              <Button onClick={addTourPackage} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Package
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
                          placeholder="Expert Local Guides"
                        />
                      </div>

                      <div>
                        <Label>Icon (Lucide icon name)</Label>
                        <Input
                          value={feature.icon}
                          onChange={(e) => updateServiceFeature(index, 'icon', e.target.value)}
                          placeholder="User"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={feature.description}
                        onChange={(e) => updateServiceFeature(index, 'description', e.target.value)}
                        placeholder="Knowledgeable guides who share insider stories..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Benefit</Label>
                      <Input
                        value={feature.benefit}
                        onChange={(e) => updateServiceFeature(index, 'benefit', e.target.value)}
                        placeholder="Authentic experiences"
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
                    placeholder="1,892"
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

export default PrivateToursAdmin;