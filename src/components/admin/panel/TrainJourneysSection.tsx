import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Save, Plus, Trash2, Edit2, ChevronUp, ChevronDown,
  Train, Eye, X, Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { trainJourneysPageService, TrainJourneysPageContent, RouteInfo, TrainClass, TourPackage, BookingTip, FAQ, JourneyHighlight, HeroImage } from '@/services/trainJourneysPageService';

const TrainJourneysSection = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [content, setContent] = useState<TrainJourneysPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await trainJourneysPageService.getPageContent();
      setContent(data);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;

    try {
      setSaving(true);
      await trainJourneysPageService.updatePageContent(content);
      toast.success('Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Hero Image Management
  const addHeroImage = () => {
    const newImage: HeroImage = {
      id: Date.now().toString(),
      url: '',
      caption: ''
    };
    setContent({
      ...content,
      hero: {
        ...content.hero,
        images: [...content.hero.images, newImage]
      }
    });
  };

  const updateHeroImage = (id: string, updates: Partial<HeroImage>) => {
    setContent({
      ...content,
      hero: {
        ...content.hero,
        images: content.hero.images.map(img => img.id === id ? { ...img, ...updates } : img)
      }
    });
  };

  const deleteHeroImage = (id: string) => {
    if (content.hero.images.length <= 1) {
      toast.error('Must have at least one hero image');
      return;
    }
    setContent({
      ...content,
      hero: {
        ...content.hero,
        images: content.hero.images.filter(img => img.id !== id)
      }
    });
  };

  // Route Management
  const addRoute = () => {
    const newRoute: RouteInfo = {
      id: Date.now().toString(),
      name: 'New Route',
      description: '',
      duration: '',
      distance: '',
      highlights: [],
      bestTime: '',
      price: '',
      difficulty: 'Easy'
    };
    setContent({ ...content, routes: [...content.routes, newRoute] });
  };

  const updateRoute = (id: string, updates: Partial<RouteInfo>) => {
    setContent({
      ...content,
      routes: content.routes.map(r => r.id === id ? { ...r, ...updates } : r)
    });
  };

  const deleteRoute = (id: string) => {
    setContent({
      ...content,
      routes: content.routes.filter(r => r.id !== id)
    });
  };

  const moveRoute = (index: number, direction: 'up' | 'down') => {
    const newRoutes = [...content.routes];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newRoutes.length) return;
    [newRoutes[index], newRoutes[newIndex]] = [newRoutes[newIndex], newRoutes[index]];
    setContent({ ...content, routes: newRoutes });
  };

  // Train Class Management
  const addTrainClass = () => {
    const newClass: TrainClass = {
      id: Date.now().toString(),
      name: 'New Class',
      description: '',
      price: '',
      features: [],
      iconName: 'Train'
    };
    setContent({ ...content, trainClasses: [...content.trainClasses, newClass] });
  };

  const updateTrainClass = (id: string, updates: Partial<TrainClass>) => {
    setContent({
      ...content,
      trainClasses: content.trainClasses.map(tc => tc.id === id ? { ...tc, ...updates } : tc)
    });
  };

  const deleteTrainClass = (id: string) => {
    setContent({
      ...content,
      trainClasses: content.trainClasses.filter(tc => tc.id !== id)
    });
  };

  // Tour Package Management
  const addPackage = () => {
    const newPackage: TourPackage = {
      id: Date.now().toString(),
      name: 'New Package',
      duration: '',
      price: '',
      highlights: [],
      included: [],
      iconName: 'Package'
    };
    setContent({ ...content, tourPackages: [...content.tourPackages, newPackage] });
  };

  const updatePackage = (id: string, updates: Partial<TourPackage>) => {
    setContent({
      ...content,
      tourPackages: content.tourPackages.map(p => p.id === id ? { ...p, ...updates } : p)
    });
  };

  const deletePackage = (id: string) => {
    setContent({
      ...content,
      tourPackages: content.tourPackages.filter(p => p.id !== id)
    });
  };

  // Booking Tip Management
  const addTip = () => {
    const newTip: BookingTip = {
      id: Date.now().toString(),
      title: 'New Tip',
      description: '',
      iconName: 'Info'
    };
    setContent({ ...content, bookingTips: [...content.bookingTips, newTip] });
  };

  const updateTip = (id: string, updates: Partial<BookingTip>) => {
    setContent({
      ...content,
      bookingTips: content.bookingTips.map(t => t.id === id ? { ...t, ...updates } : t)
    });
  };

  const deleteTip = (id: string) => {
    setContent({
      ...content,
      bookingTips: content.bookingTips.filter(t => t.id !== id)
    });
  };

  // Journey Highlight Management
  const addHighlight = () => {
    const newHighlight: JourneyHighlight = {
      id: Date.now().toString(),
      title: 'New Highlight',
      description: '',
      iconName: 'Star',
      image: ''
    };
    setContent({ ...content, journeyHighlights: [...content.journeyHighlights, newHighlight] });
  };

  const updateHighlight = (id: string, updates: Partial<JourneyHighlight>) => {
    setContent({
      ...content,
      journeyHighlights: content.journeyHighlights.map(h => h.id === id ? { ...h, ...updates } : h)
    });
  };

  const deleteHighlight = (id: string) => {
    setContent({
      ...content,
      journeyHighlights: content.journeyHighlights.filter(h => h.id !== id)
    });
  };

  // FAQ Management
  const addFAQ = () => {
    const newFAQ: FAQ = {
      id: Date.now().toString(),
      question: '',
      answer: ''
    };
    setContent({ ...content, faqs: [...content.faqs, newFAQ] });
  };

  const updateFAQ = (id: string, updates: Partial<FAQ>) => {
    setContent({
      ...content,
      faqs: content.faqs.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const deleteFAQ = (id: string) => {
    setContent({
      ...content,
      faqs: content.faqs.filter(f => f.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Train Journeys Page Management</h2>
          <p className="text-gray-600 mt-1">Manage all content for the scenic train journeys experience page</p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
          <TabsTrigger value="highlights">Highlights</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        {/* Hero Tab */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={content.hero.title}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, title: e.target.value }
                  })}
                  placeholder="Hero title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <Input
                  value={content.hero.subtitle}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, subtitle: e.target.value }
                  })}
                  placeholder="Hero subtitle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CTA Button Text</label>
                <Input
                  value={content.hero.ctaText}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, ctaText: e.target.value }
                  })}
                  placeholder="Button text"
                />
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Hero Images Carousel</h3>
                  <Button onClick={addHeroImage} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                </div>
                <div className="space-y-4">
                  {content.hero.images.map((image, index) => (
                    <Card key={image.id}>
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">Image {index + 1}</span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteHeroImage(image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Image URL</label>
                          <Input
                            value={image.url}
                            onChange={(e) => updateHeroImage(image.id, { url: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Caption</label>
                          <Input
                            value={image.caption}
                            onChange={(e) => updateHeroImage(image.id, { caption: e.target.value })}
                            placeholder="Image caption"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={content.overview.title}
                  onChange={(e) => setContent({
                    ...content,
                    overview: { ...content.overview, title: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={content.overview.description}
                  onChange={(e) => setContent({
                    ...content,
                    overview: { ...content.overview, description: e.target.value }
                  })}
                  rows={4}
                />
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.stats.map((stat, index) => (
                    <Card key={stat.id}>
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Stat {index + 1}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm mb-1">Label</label>
                            <Input
                              value={stat.label}
                              onChange={(e) => setContent({
                                ...content,
                                stats: content.stats.map(s => s.id === stat.id ? { ...s, label: e.target.value } : s)
                              })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Value</label>
                            <Input
                              value={stat.value}
                              onChange={(e) => setContent({
                                ...content,
                                stats: content.stats.map(s => s.id === stat.id ? { ...s, value: e.target.value } : s)
                              })}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Icon Name</label>
                          <Input
                            value={stat.iconName}
                            onChange={(e) => setContent({
                              ...content,
                              stats: content.stats.map(s => s.id === stat.id ? { ...s, iconName: e.target.value } : s)
                            })}
                            placeholder="Train, Mountain, Camera, etc."
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Train Routes</h3>
            <Button onClick={addRoute} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Route
            </Button>
          </div>
          <div className="space-y-4">
            {content.routes.map((route, index) => (
              <Card key={route.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-lg">{route.name || 'New Route'}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => moveRoute(index, 'up')} disabled={index === 0}>
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => moveRoute(index, 'down')} disabled={index === content.routes.length - 1}>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteRoute(route.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Route Name</label>
                      <Input
                        value={route.name}
                        onChange={(e) => updateRoute(route.id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Difficulty</label>
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        value={route.difficulty}
                        onChange={(e) => updateRoute(route.id, { difficulty: e.target.value as any })}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Challenging">Challenging</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration</label>
                      <Input
                        value={route.duration}
                        onChange={(e) => updateRoute(route.id, { duration: e.target.value })}
                        placeholder="6-7 hours"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Distance</label>
                      <Input
                        value={route.distance}
                        onChange={(e) => updateRoute(route.id, { distance: e.target.value })}
                        placeholder="140 km"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Price</label>
                      <Input
                        value={route.price}
                        onChange={(e) => updateRoute(route.id, { price: e.target.value })}
                        placeholder="From $3-$50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Best Time</label>
                      <Input
                        value={route.bestTime}
                        onChange={(e) => updateRoute(route.id, { bestTime: e.target.value })}
                        placeholder="Morning departure"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={route.description}
                      onChange={(e) => updateRoute(route.id, { description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Highlights (comma separated)</label>
                    <Input
                      value={route.highlights.join(', ')}
                      onChange={(e) => updateRoute(route.id, { highlights: e.target.value.split(',').map(h => h.trim()) })}
                      placeholder="Nine Arch Bridge, Tea Estates"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Train Classes Tab */}
        <TabsContent value="classes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Train Classes</h3>
            <Button onClick={addTrainClass} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </div>
          <div className="space-y-4">
            {content.trainClasses.map((trainClass) => (
              <Card key={trainClass.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-lg">{trainClass.name}</span>
                    <Button variant="destructive" size="sm" onClick={() => deleteTrainClass(trainClass.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Class Name</label>
                      <Input
                        value={trainClass.name}
                        onChange={(e) => updateTrainClass(trainClass.id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Price Range</label>
                      <Input
                        value={trainClass.price}
                        onChange={(e) => updateTrainClass(trainClass.id, { price: e.target.value })}
                        placeholder="$50-$60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Icon Name</label>
                      <Input
                        value={trainClass.iconName}
                        onChange={(e) => updateTrainClass(trainClass.id, { iconName: e.target.value })}
                        placeholder="Eye, Star, Users, Train"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={trainClass.description}
                      onChange={(e) => updateTrainClass(trainClass.id, { description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Features (comma separated)</label>
                    <Textarea
                      value={trainClass.features.join(', ')}
                      onChange={(e) => updateTrainClass(trainClass.id, { features: e.target.value.split(',').map(f => f.trim()) })}
                      rows={2}
                      placeholder="Large windows, Air conditioning, Reserved seating"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tour Packages Tab */}
        <TabsContent value="packages" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tour Packages</h3>
            <Button onClick={addPackage} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          </div>
          <div className="space-y-4">
            {content.tourPackages.map((pkg) => (
              <Card key={pkg.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-lg">{pkg.name}</span>
                    <Button variant="destructive" size="sm" onClick={() => deletePackage(pkg.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Package Name</label>
                      <Input
                        value={pkg.name}
                        onChange={(e) => updatePackage(pkg.id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration</label>
                      <Input
                        value={pkg.duration}
                        onChange={(e) => updatePackage(pkg.id, { duration: e.target.value })}
                        placeholder="2 Days"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Price</label>
                      <Input
                        value={pkg.price}
                        onChange={(e) => updatePackage(pkg.id, { price: e.target.value })}
                        placeholder="$180"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon Name</label>
                    <Input
                      value={pkg.iconName}
                      onChange={(e) => updatePackage(pkg.id, { iconName: e.target.value })}
                      placeholder="Package, Star, Mountain"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Highlights (one per line)</label>
                    <Textarea
                      value={pkg.highlights.join('\n')}
                      onChange={(e) => updatePackage(pkg.id, { highlights: e.target.value.split('\n').filter(h => h.trim()) })}
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Included Items (one per line)</label>
                    <Textarea
                      value={pkg.included.join('\n')}
                      onChange={(e) => updatePackage(pkg.id, { included: e.target.value.split('\n').filter(i => i.trim()) })}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Travel Tips Tab */}
        <TabsContent value="tips" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Booking Tips</h3>
            <Button onClick={addTip} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Tip
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.bookingTips.map((tip) => (
              <Card key={tip.id}>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold">{tip.title || 'New Tip'}</span>
                    <Button variant="destructive" size="sm" onClick={() => deleteTip(tip.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={tip.title}
                      onChange={(e) => updateTip(tip.id, { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon Name</label>
                    <Input
                      value={tip.iconName}
                      onChange={(e) => updateTip(tip.id, { iconName: e.target.value })}
                      placeholder="Calendar, Eye, Camera, Coffee"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={tip.description}
                      onChange={(e) => updateTip(tip.id, { description: e.target.value })}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Journey Highlights Tab */}
        <TabsContent value="highlights" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Journey Highlights</h3>
            <Button onClick={addHighlight} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Highlight
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.journeyHighlights.map((highlight) => (
              <Card key={highlight.id}>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold">{highlight.title}</span>
                    <Button variant="destructive" size="sm" onClick={() => deleteHighlight(highlight.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={highlight.title}
                      onChange={(e) => updateHighlight(highlight.id, { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon Name</label>
                    <Input
                      value={highlight.iconName}
                      onChange={(e) => updateHighlight(highlight.id, { iconName: e.target.value })}
                      placeholder="Navigation, TreePine, Mountain, Users"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <Input
                      value={highlight.image}
                      onChange={(e) => updateHighlight(highlight.id, { image: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={highlight.description}
                      onChange={(e) => updateHighlight(highlight.id, { description: e.target.value })}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
            <Button onClick={addFAQ} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </div>
          <div className="space-y-4">
            {content.faqs.map((faq, index) => (
              <Card key={faq.id}>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold">FAQ {index + 1}</span>
                    <Button variant="destructive" size="sm" onClick={() => deleteFAQ(faq.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Question</label>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateFAQ(faq.id, { question: e.target.value })}
                      placeholder="Enter question"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Answer</label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(faq.id, { answer: e.target.value })}
                      rows={3}
                      placeholder="Enter answer"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainJourneysSection;
