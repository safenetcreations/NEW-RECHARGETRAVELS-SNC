import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  teaTrailsAdminService,
  TeaTrailsAdminContent,
  TeaTrailsTour,
  TeaTrailsRoute,
  TeaTrailsTestimonial,
  defaultTeaTrailsAdminContent
} from '@/services/teaTrailsAdminService';
import ImageUpload from '@/components/ui/image-upload';
import { Plus, RefreshCw, Trash2, ChevronUp, ChevronDown, Star, Coffee } from 'lucide-react';

const listToMultiline = (items: string[]) => items.join('\n');
const multilineToList = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const TeaTrailsManager = () => {
  const [content, setContent] = useState<TeaTrailsAdminContent>(defaultTeaTrailsAdminContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await teaTrailsAdminService.getContent();
        setContent(data);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Failed to load content',
          description: 'Unable to fetch Tea Trails data from Firestore.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [toast]);

  const updateContent = <K extends keyof TeaTrailsAdminContent>(
    key: K,
    value: TeaTrailsAdminContent[K]
  ) => {
    setContent((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await teaTrailsAdminService.saveContent(content);

      // Save tours
      for (const tour of content.tours) {
        if (tour.id.startsWith('new-')) {
          const { id, ...tourData } = tour;
          const newId = await teaTrailsAdminService.addTour(tourData);
          tour.id = newId;
        } else {
          await teaTrailsAdminService.updateTour(tour.id, tour);
        }
      }

      // Save routes
      for (const route of content.routes) {
        if (route.id.startsWith('new-')) {
          const { id, ...routeData } = route;
          const newId = await teaTrailsAdminService.addRoute(routeData);
          route.id = newId;
        } else {
          await teaTrailsAdminService.updateRoute(route.id, route);
        }
      }

      // Save testimonials
      for (const testimonial of content.testimonials) {
        if (testimonial.id.startsWith('new-')) {
          const { id, ...testimonialData } = testimonial;
          const newId = await teaTrailsAdminService.addTestimonial(testimonialData);
          testimonial.id = newId;
        } else {
          await teaTrailsAdminService.updateTestimonial(testimonial.id, testimonial);
        }
      }

      toast({
        title: 'Content saved successfully!',
        description: 'Tea Trails content has been updated.'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to save',
        description: 'Unable to save Tea Trails data.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // Tour handlers
  const addTour = () => {
    const newTour: TeaTrailsTour = {
      id: `new-${Date.now()}`,
      title: 'New Tea Trail Tour',
      thumbnail: '',
      badges: [],
      duration: '1 Day',
      salePriceUSD: 99,
      highlights: [],
      isPublished: false,
      order: content.tours.length
    };
    updateContent('tours', [...content.tours, newTour]);
  };

  const updateTour = (index: number, updates: Partial<TeaTrailsTour>) => {
    const updated = [...content.tours];
    updated[index] = { ...updated[index], ...updates };
    updateContent('tours', updated);
  };

  const deleteTour = async (index: number) => {
    const tour = content.tours[index];
    if (!tour.id.startsWith('new-')) {
      await teaTrailsAdminService.deleteTour(tour.id);
    }
    updateContent('tours', content.tours.filter((_, i) => i !== index));
  };

  // Route handlers
  const addRoute = () => {
    const newRoute: TeaTrailsRoute = {
      id: `new-${Date.now()}`,
      routeName: 'New Tea Trail Route',
      duration: '1 day',
      distanceKm: 50,
      bestClass: 'Private van',
      difficulty: 'Easy',
      elevation: '1000-1500m',
      isActive: true,
      order: content.routes.length
    };
    updateContent('routes', [...content.routes, newRoute]);
  };

  const updateRoute = (index: number, updates: Partial<TeaTrailsRoute>) => {
    const updated = [...content.routes];
    updated[index] = { ...updated[index], ...updates };
    updateContent('routes', updated);
  };

  const deleteRoute = async (index: number) => {
    const route = content.routes[index];
    if (!route.id.startsWith('new-')) {
      await teaTrailsAdminService.deleteRoute(route.id);
    }
    updateContent('routes', content.routes.filter((_, i) => i !== index));
  };

  // Testimonial handlers
  const addTestimonial = () => {
    const newTestimonial: TeaTrailsTestimonial = {
      id: `new-${Date.now()}`,
      name: '',
      country: '',
      comment: '',
      rating: 5,
      isActive: true
    };
    updateContent('testimonials', [...content.testimonials, newTestimonial]);
  };

  const updateTestimonial = (index: number, updates: Partial<TeaTrailsTestimonial>) => {
    const updated = [...content.testimonials];
    updated[index] = { ...updated[index], ...updates };
    updateContent('testimonials', updated);
  };

  const deleteTestimonial = async (index: number) => {
    const testimonial = content.testimonials[index];
    if (!testimonial.id.startsWith('new-')) {
      await teaTrailsAdminService.deleteTestimonial(testimonial.id);
    }
    updateContent('testimonials', content.testimonials.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-2">Loading Tea Trails content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Coffee className="w-6 h-6 text-green-600" />
            Tea Trails Management
          </h2>
          <p className="text-gray-500">Manage tours, routes, and content for the Tea Trails experience page</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="tours">Tours</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="testimonials">Reviews</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Configure the main banner of the Tea Trails page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={content.hero.title}
                  onChange={(e) => updateContent('hero', { ...content.hero, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input
                  value={content.hero.subtitle}
                  onChange={(e) => updateContent('hero', { ...content.hero, subtitle: e.target.value })}
                />
              </div>
              <div>
                <Label>Background Image</Label>
                <ImageUpload
                  value={content.hero.backgroundImage}
                  onChange={(url) => updateContent('hero', { ...content.hero, backgroundImage: url })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CTA Button Text</Label>
                  <Input
                    value={content.hero.ctaText}
                    onChange={(e) => updateContent('hero', { ...content.hero, ctaText: e.target.value })}
                  />
                </div>
                <div>
                  <Label>CTA Link</Label>
                  <Input
                    value={content.hero.ctaLink}
                    onChange={(e) => updateContent('hero', { ...content.hero, ctaLink: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Intro Paragraph</Label>
                <Textarea
                  value={content.intro.introParagraph}
                  onChange={(e) => updateContent('intro', { introParagraph: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tours Section */}
        <TabsContent value="tours">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Tea Trail Tours</span>
                <Button onClick={addTour} size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add Tour
                </Button>
              </CardTitle>
              <CardDescription>Manage available tea trail tour packages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.tours.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No tours yet. Click "Add Tour" to create one.</p>
              ) : (
                content.tours.map((tour, index) => (
                  <Card key={tour.id} className="border-l-4 border-l-green-500">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <Label>Tour Title</Label>
                            <Input
                              value={tour.title}
                              onChange={(e) => updateTour(index, { title: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Duration</Label>
                            <Input
                              value={tour.duration}
                              onChange={(e) => updateTour(index, { duration: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Sale Price (USD)</Label>
                            <Input
                              type="number"
                              value={tour.salePriceUSD}
                              onChange={(e) => updateTour(index, { salePriceUSD: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                          <div>
                            <Label>Regular Price (USD)</Label>
                            <Input
                              type="number"
                              value={tour.regularPriceUSD || ''}
                              onChange={(e) => updateTour(index, { regularPriceUSD: parseInt(e.target.value) || undefined })}
                            />
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteTour(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <Label>Thumbnail Image</Label>
                        <ImageUpload
                          value={tour.thumbnail}
                          onChange={(url) => updateTour(index, { thumbnail: url })}
                        />
                      </div>
                      <div>
                        <Label>Badges (comma separated)</Label>
                        <Input
                          value={tour.badges.join(', ')}
                          onChange={(e) => updateTour(index, { badges: e.target.value.split(',').map(b => b.trim()).filter(Boolean) })}
                          placeholder="Bestseller, Popular, Adventure"
                        />
                      </div>
                      <div>
                        <Label>Highlights (one per line)</Label>
                        <Textarea
                          value={listToMultiline(tour.highlights)}
                          onChange={(e) => updateTour(index, { highlights: multilineToList(e.target.value) })}
                          rows={4}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={tour.isPublished}
                          onCheckedChange={(checked) => updateTour(index, { isPublished: checked })}
                        />
                        <Label>Published</Label>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Routes Section */}
        <TabsContent value="routes">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Tea Trail Routes</span>
                <Button onClick={addRoute} size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add Route
                </Button>
              </CardTitle>
              <CardDescription>Manage tea trail routes shown on the map</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.routes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No routes yet. Click "Add Route" to create one.</p>
              ) : (
                content.routes.map((route, index) => (
                  <Card key={route.id} className="border-l-4 border-l-amber-500">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <Label>Route Name</Label>
                            <Input
                              value={route.routeName}
                              onChange={(e) => updateRoute(index, { routeName: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Duration</Label>
                            <Input
                              value={route.duration}
                              onChange={(e) => updateRoute(index, { duration: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Distance (km)</Label>
                            <Input
                              type="number"
                              value={route.distanceKm}
                              onChange={(e) => updateRoute(index, { distanceKm: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                          <div>
                            <Label>Best Class</Label>
                            <Input
                              value={route.bestClass}
                              onChange={(e) => updateRoute(index, { bestClass: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Difficulty</Label>
                            <Input
                              value={route.difficulty}
                              onChange={(e) => updateRoute(index, { difficulty: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Elevation</Label>
                            <Input
                              value={route.elevation}
                              onChange={(e) => updateRoute(index, { elevation: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteRoute(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={route.isActive}
                          onCheckedChange={(checked) => updateRoute(index, { isActive: checked })}
                        />
                        <Label>Active</Label>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Section */}
        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Testimonials / Reviews</span>
                <Button onClick={addTestimonial} size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add Review
                </Button>
              </CardTitle>
              <CardDescription>Manage customer testimonials for tea trails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.testimonials.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No testimonials yet. Click "Add Review" to create one.</p>
              ) : (
                content.testimonials.map((testimonial, index) => (
                  <Card key={testimonial.id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={testimonial.name}
                              onChange={(e) => updateTestimonial(index, { name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Country</Label>
                            <Input
                              value={testimonial.country}
                              onChange={(e) => updateTestimonial(index, { country: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Rating (1-5)</Label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-6 h-6 cursor-pointer ${star <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  onClick={() => updateTestimonial(index, { rating: star })}
                                />
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label>Tour Name (optional)</Label>
                            <Input
                              value={testimonial.tourName || ''}
                              onChange={(e) => updateTestimonial(index, { tourName: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteTestimonial(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <Label>Comment</Label>
                        <Textarea
                          value={testimonial.comment}
                          onChange={(e) => updateTestimonial(index, { comment: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={testimonial.isActive}
                          onCheckedChange={(checked) => updateTestimonial(index, { isActive: checked })}
                        />
                        <Label>Active</Label>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CTA Section */}
        <TabsContent value="cta">
          <Card>
            <CardHeader>
              <CardTitle>Call to Action Section</CardTitle>
              <CardDescription>Configure the CTA section at the bottom of the page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Headline</Label>
                <Input
                  value={content.cta.headline}
                  onChange={(e) => updateContent('cta', { ...content.cta, headline: e.target.value })}
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Textarea
                  value={content.cta.subtitle}
                  onChange={(e) => updateContent('cta', { ...content.cta, subtitle: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Button Text</Label>
                  <Input
                    value={content.cta.buttonText}
                    onChange={(e) => updateContent('cta', { ...content.cta, buttonText: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Button Link</Label>
                  <Input
                    value={content.cta.buttonLink}
                    onChange={(e) => updateContent('cta', { ...content.cta, buttonLink: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Configuration */}
        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle>Booking Configuration</CardTitle>
              <CardDescription>Configure booking settings and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Deposit Percentage</Label>
                  <Input
                    type="number"
                    value={content.booking.depositPercent}
                    onChange={(e) => updateContent('booking', { ...content.booking, depositPercent: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Response Time</Label>
                  <Input
                    value={content.booking.responseTime}
                    onChange={(e) => updateContent('booking', { ...content.booking, responseTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Deposit Note</Label>
                <Input
                  value={content.booking.depositNote}
                  onChange={(e) => updateContent('booking', { ...content.booking, depositNote: e.target.value })}
                />
              </div>
              <div>
                <Label>Cancellation Policy</Label>
                <Textarea
                  value={content.booking.cancellationPolicy}
                  onChange={(e) => updateContent('booking', { ...content.booking, cancellationPolicy: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>WhatsApp</Label>
                  <Input
                    value={content.booking.whatsapp}
                    onChange={(e) => updateContent('booking', { ...content.booking, whatsapp: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={content.booking.email}
                    onChange={(e) => updateContent('booking', { ...content.booking, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={content.booking.phone}
                    onChange={(e) => updateContent('booking', { ...content.booking, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Pickup Locations (one per line)</Label>
                <Textarea
                  value={listToMultiline(content.booking.pickupLocations)}
                  onChange={(e) => updateContent('booking', { ...content.booking, pickupLocations: multilineToList(e.target.value) })}
                  rows={4}
                />
              </div>
              <div>
                <Label>Payment Methods (one per line)</Label>
                <Textarea
                  value={listToMultiline(content.booking.paymentMethods)}
                  onChange={(e) => updateContent('booking', { ...content.booking, paymentMethods: multilineToList(e.target.value) })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeaTrailsManager;
