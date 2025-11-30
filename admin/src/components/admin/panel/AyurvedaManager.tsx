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
  ayurvedaAdminService,
  AyurvedaAdminContent,
  AyurvedaRetreat,
  AyurvedaTreatment,
  AyurvedaTestimonial,
  defaultAyurvedaAdminContent
} from '@/services/ayurvedaAdminService';
import ImageUpload from '@/components/ui/image-upload';
import { Plus, RefreshCw, Trash2, ChevronUp, ChevronDown, Star } from 'lucide-react';

const listToMultiline = (items: string[]) => items.join('\n');
const multilineToList = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const AyurvedaManager = () => {
  const [content, setContent] = useState<AyurvedaAdminContent>(defaultAyurvedaAdminContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await ayurvedaAdminService.getContent();
        setContent(data);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Failed to load content',
          description: 'Unable to fetch Ayurveda data from Firestore.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [toast]);

  const updateContent = <K extends keyof AyurvedaAdminContent>(
    key: K,
    value: AyurvedaAdminContent[K]
  ) => {
    setContent((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await ayurvedaAdminService.saveContent(content);

      // Save retreats
      for (const retreat of content.retreats) {
        if (retreat.id.startsWith('new-')) {
          const { id, ...retreatData } = retreat;
          const newId = await ayurvedaAdminService.addRetreat(retreatData);
          retreat.id = newId;
        } else {
          await ayurvedaAdminService.updateRetreat(retreat.id, retreat);
        }
      }

      // Save treatments
      for (const treatment of content.treatments) {
        if (treatment.id.startsWith('new-')) {
          const { id, ...treatmentData } = treatment;
          const newId = await ayurvedaAdminService.addTreatment(treatmentData);
          treatment.id = newId;
        } else {
          await ayurvedaAdminService.updateTreatment(treatment.id, treatment);
        }
      }

      // Save testimonials
      for (const testimonial of content.testimonials) {
        if (testimonial.id.startsWith('new-')) {
          const { id, ...testimonialData } = testimonial;
          const newId = await ayurvedaAdminService.addTestimonial(testimonialData);
          testimonial.id = newId;
        } else {
          await ayurvedaAdminService.updateTestimonial(testimonial.id, testimonial);
        }
      }

      toast({ title: 'Saved', description: 'Ayurveda page updated successfully.' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Save failed',
        description: 'Could not persist the latest changes.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // Retreat management
  const addRetreat = () => {
    const newRetreat: AyurvedaRetreat = {
      id: `new-${Date.now()}`,
      title: 'New Retreat Package',
      description: '',
      duration: '7 Days / 6 Nights',
      price: 1500,
      image: '',
      highlights: [],
      includes: [],
      excludes: [],
      isActive: true,
      order: content.retreats.length,
      location: 'Kandy, Sri Lanka',
      maxGuests: 10,
      difficulty: 'Easy',
      bestFor: ['Relaxation', 'Detox']
    };
    updateContent('retreats', [...content.retreats, newRetreat]);
  };

  const updateRetreat = (index: number, updates: Partial<AyurvedaRetreat>) => {
    const updated = [...content.retreats];
    updated[index] = { ...updated[index], ...updates };
    updateContent('retreats', updated);
  };

  const deleteRetreat = async (index: number) => {
    const retreat = content.retreats[index];
    if (!retreat.id.startsWith('new-')) {
      await ayurvedaAdminService.deleteRetreat(retreat.id);
    }
    updateContent('retreats', content.retreats.filter((_, i) => i !== index));
  };

  const moveRetreat = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= content.retreats.length) return;
    const updated = [...content.retreats];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated.forEach((r, i) => (r.order = i));
    updateContent('retreats', updated);
  };

  // Treatment management
  const addTreatment = () => {
    const newTreatment: AyurvedaTreatment = {
      id: `new-${Date.now()}`,
      title: 'New Treatment',
      description: '',
      duration: '60 minutes',
      price: 75,
      image: '',
      benefits: [],
      isActive: true,
      order: content.treatments.length,
      category: 'Massage'
    };
    updateContent('treatments', [...content.treatments, newTreatment]);
  };

  const updateTreatment = (index: number, updates: Partial<AyurvedaTreatment>) => {
    const updated = [...content.treatments];
    updated[index] = { ...updated[index], ...updates };
    updateContent('treatments', updated);
  };

  const deleteTreatment = async (index: number) => {
    const treatment = content.treatments[index];
    if (!treatment.id.startsWith('new-')) {
      await ayurvedaAdminService.deleteTreatment(treatment.id);
    }
    updateContent('treatments', content.treatments.filter((_, i) => i !== index));
  };

  // Testimonial management
  const addTestimonial = () => {
    const newTestimonial: AyurvedaTestimonial = {
      id: `new-${Date.now()}`,
      name: '',
      country: '',
      comment: '',
      rating: 5,
      image: '',
      retreatName: '',
      isActive: true
    };
    updateContent('testimonials', [...content.testimonials, newTestimonial]);
  };

  const updateTestimonial = (index: number, updates: Partial<AyurvedaTestimonial>) => {
    const updated = [...content.testimonials];
    updated[index] = { ...updated[index], ...updates };
    updateContent('testimonials', updated);
  };

  const deleteTestimonial = async (index: number) => {
    const testimonial = content.testimonials[index];
    if (!testimonial.id.startsWith('new-')) {
      await ayurvedaAdminService.deleteTestimonial(testimonial.id);
    }
    updateContent('testimonials', content.testimonials.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="rounded-lg border border-dashed p-6 text-sm text-slate-500">Loading Ayurveda content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Ayurveda & Wellness Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage hero section, retreats, treatments, testimonials, and booking settings for the Ayurveda wellness page.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setContent(defaultAyurvedaAdminContent)}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reset to defaults
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="philosophy">Philosophy</TabsTrigger>
          <TabsTrigger value="retreats">Retreats</TabsTrigger>
          <TabsTrigger value="treatments">Treatments</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>The main banner for the Ayurveda wellness page.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content.hero.title}
                  onChange={(e) => updateContent('hero', { ...content.hero, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>CTA Text</Label>
                <Input
                  value={content.hero.ctaText}
                  onChange={(e) => updateContent('hero', { ...content.hero, ctaText: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Subtitle</Label>
                <Textarea
                  rows={2}
                  value={content.hero.subtitle}
                  onChange={(e) => updateContent('hero', { ...content.hero, subtitle: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Background Image</Label>
                <ImageUpload
                  value={content.hero.backgroundImage}
                  folder="ayurveda/hero"
                  onChange={(url) => updateContent('hero', { ...content.hero, backgroundImage: url })}
                  onRemove={() => updateContent('hero', { ...content.hero, backgroundImage: '' })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Philosophy Section */}
        <TabsContent value="philosophy" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Philosophy Section</CardTitle>
              <CardDescription>The healing philosophy and pillars.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={content.philosophy.label}
                  onChange={(e) => updateContent('philosophy', { ...content.philosophy, label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content.philosophy.title}
                  onChange={(e) => updateContent('philosophy', { ...content.philosophy, title: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  rows={4}
                  value={content.philosophy.description}
                  onChange={(e) => updateContent('philosophy', { ...content.philosophy, description: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Pillars (one per line)</Label>
                <Textarea
                  rows={3}
                  value={listToMultiline(content.philosophy.pillars)}
                  onChange={(e) => updateContent('philosophy', { ...content.philosophy, pillars: multilineToList(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Retreats Section */}
        <TabsContent value="retreats" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Wellness Retreats</CardTitle>
                <CardDescription>Manage retreat packages for the Ayurveda page.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addRetreat}>
                <Plus className="mr-2 h-4 w-4" /> Add Retreat
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.retreats.map((retreat, index) => (
                <Card key={retreat.id} className="border border-dashed">
                  <CardHeader className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" size="sm" onClick={() => moveRetreat(index, 'up')} disabled={index === 0}>
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => moveRetreat(index, 'down')} disabled={index === content.retreats.length - 1}>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle className="text-lg">{retreat.title || `Retreat ${index + 1}`}</CardTitle>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`retreat-active-${index}`}>Active</Label>
                        <Switch
                          id={`retreat-active-${index}`}
                          checked={retreat.isActive}
                          onCheckedChange={(checked) => updateRetreat(index, { isActive: checked })}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-500"
                        onClick={() => deleteRetreat(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={retreat.title}
                          onChange={(e) => updateRetreat(index, { title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          value={retreat.duration}
                          onChange={(e) => updateRetreat(index, { duration: e.target.value })}
                          placeholder="7 Days / 6 Nights"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price (USD)</Label>
                        <Input
                          type="number"
                          value={retreat.price}
                          onChange={(e) => updateRetreat(index, { price: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={retreat.location}
                          onChange={(e) => updateRetreat(index, { location: e.target.value })}
                          placeholder="Kandy, Sri Lanka"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Guests</Label>
                        <Input
                          type="number"
                          value={retreat.maxGuests}
                          onChange={(e) => updateRetreat(index, { maxGuests: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Difficulty</Label>
                        <Input
                          value={retreat.difficulty}
                          onChange={(e) => updateRetreat(index, { difficulty: e.target.value })}
                          placeholder="Easy / Moderate / Intensive"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={3}
                        value={retreat.description}
                        onChange={(e) => updateRetreat(index, { description: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Highlights (one per line)</Label>
                        <Textarea
                          rows={4}
                          value={listToMultiline(retreat.highlights)}
                          onChange={(e) => updateRetreat(index, { highlights: multilineToList(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Best For (one per line)</Label>
                        <Textarea
                          rows={4}
                          value={listToMultiline(retreat.bestFor)}
                          onChange={(e) => updateRetreat(index, { bestFor: multilineToList(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Includes (one per line)</Label>
                        <Textarea
                          rows={4}
                          value={listToMultiline(retreat.includes)}
                          onChange={(e) => updateRetreat(index, { includes: multilineToList(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Excludes (one per line)</Label>
                        <Textarea
                          rows={4}
                          value={listToMultiline(retreat.excludes)}
                          onChange={(e) => updateRetreat(index, { excludes: multilineToList(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Image</Label>
                      <ImageUpload
                        value={retreat.image}
                        folder="ayurveda/retreats"
                        onChange={(url) => updateRetreat(index, { image: url })}
                        onRemove={() => updateRetreat(index, { image: '' })}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              {content.retreats.length === 0 && (
                <p className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                  No retreats configured. Click "Add Retreat" to create your first wellness package.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Treatments Section */}
        <TabsContent value="treatments" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Signature Treatments</CardTitle>
                <CardDescription>Individual Ayurveda treatments and therapies.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addTreatment}>
                <Plus className="mr-2 h-4 w-4" /> Add Treatment
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.treatments.map((treatment, index) => (
                <Card key={treatment.id} className="border border-dashed">
                  <CardHeader className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="text-lg">{treatment.title || `Treatment ${index + 1}`}</CardTitle>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`treatment-active-${index}`}>Active</Label>
                        <Switch
                          id={`treatment-active-${index}`}
                          checked={treatment.isActive}
                          onCheckedChange={(checked) => updateTreatment(index, { isActive: checked })}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-500"
                        onClick={() => deleteTreatment(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={treatment.title}
                          onChange={(e) => updateTreatment(index, { title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          value={treatment.duration}
                          onChange={(e) => updateTreatment(index, { duration: e.target.value })}
                          placeholder="60 minutes"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price (USD)</Label>
                        <Input
                          type="number"
                          value={treatment.price}
                          onChange={(e) => updateTreatment(index, { price: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Input
                          value={treatment.category}
                          onChange={(e) => updateTreatment(index, { category: e.target.value })}
                          placeholder="Massage / Therapy / Facial"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={2}
                        value={treatment.description}
                        onChange={(e) => updateTreatment(index, { description: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Benefits (one per line)</Label>
                        <Textarea
                          rows={4}
                          value={listToMultiline(treatment.benefits)}
                          onChange={(e) => updateTreatment(index, { benefits: multilineToList(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Image</Label>
                        <ImageUpload
                          value={treatment.image}
                          folder="ayurveda/treatments"
                          onChange={(url) => updateTreatment(index, { image: url })}
                          onRemove={() => updateTreatment(index, { image: '' })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {content.treatments.length === 0 && (
                <p className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                  No treatments configured. Click "Add Treatment" to create your first therapy.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Section */}
        <TabsContent value="testimonials" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Guest Testimonials</CardTitle>
                <CardDescription>Reviews from wellness retreat guests.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addTestimonial}>
                <Plus className="mr-2 h-4 w-4" /> Add Testimonial
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.testimonials.map((testimonial, index) => (
                <Card key={testimonial.id} className="border border-dashed">
                  <CardHeader className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="text-lg">{testimonial.name || `Testimonial ${index + 1}`}</CardTitle>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`testimonial-active-${index}`}>Active</Label>
                        <Switch
                          id={`testimonial-active-${index}`}
                          checked={testimonial.isActive}
                          onCheckedChange={(checked) => updateTestimonial(index, { isActive: checked })}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-500"
                        onClick={() => deleteTestimonial(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={testimonial.name}
                          onChange={(e) => updateTestimonial(index, { name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input
                          value={testimonial.country}
                          onChange={(e) => updateTestimonial(index, { country: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Retreat Name</Label>
                        <Input
                          value={testimonial.retreatName}
                          onChange={(e) => updateTestimonial(index, { retreatName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Rating (1-5)</Label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => updateTestimonial(index, { rating: star })}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-6 w-6 ${star <= testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Comment</Label>
                      <Textarea
                        rows={3}
                        value={testimonial.comment}
                        onChange={(e) => updateTestimonial(index, { comment: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Guest Photo (optional)</Label>
                      <ImageUpload
                        value={testimonial.image}
                        folder="ayurveda/testimonials"
                        onChange={(url) => updateTestimonial(index, { image: url })}
                        onRemove={() => updateTestimonial(index, { image: '' })}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              {content.testimonials.length === 0 && (
                <p className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                  No testimonials added. Click "Add Testimonial" to add guest reviews.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Settings */}
        <TabsContent value="booking" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Configuration</CardTitle>
              <CardDescription>Settings for the booking form and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Deposit Percentage</Label>
                <Input
                  type="number"
                  value={content.booking.depositPercent}
                  onChange={(e) => updateContent('booking', { ...content.booking, depositPercent: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Response Time</Label>
                <Input
                  value={content.booking.responseTime}
                  onChange={(e) => updateContent('booking', { ...content.booking, responseTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input
                  value={content.booking.whatsapp}
                  onChange={(e) => updateContent('booking', { ...content.booking, whatsapp: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={content.booking.email}
                  onChange={(e) => updateContent('booking', { ...content.booking, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={content.booking.phone}
                  onChange={(e) => updateContent('booking', { ...content.booking, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Deposit Note</Label>
                <Textarea
                  rows={2}
                  value={content.booking.depositNote}
                  onChange={(e) => updateContent('booking', { ...content.booking, depositNote: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Cancellation Policy</Label>
                <Textarea
                  rows={3}
                  value={content.booking.cancellationPolicy}
                  onChange={(e) => updateContent('booking', { ...content.booking, cancellationPolicy: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Pickup Locations (one per line)</Label>
                <Textarea
                  rows={5}
                  value={listToMultiline(content.booking.pickupLocations)}
                  onChange={(e) => updateContent('booking', { ...content.booking, pickupLocations: multilineToList(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Methods (one per line)</Label>
                <Textarea
                  rows={5}
                  value={listToMultiline(content.booking.paymentMethods)}
                  onChange={(e) => updateContent('booking', { ...content.booking, paymentMethods: multilineToList(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CTA Section */}
        <TabsContent value="cta" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call to Action Section</CardTitle>
              <CardDescription>The final CTA banner at the bottom of the page.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content.cta.title}
                  onChange={(e) => updateContent('cta', { ...content.cta, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={content.cta.buttonText}
                  onChange={(e) => updateContent('cta', { ...content.cta, buttonText: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Subtitle</Label>
                <Textarea
                  rows={2}
                  value={content.cta.subtitle}
                  onChange={(e) => updateContent('cta', { ...content.cta, subtitle: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Background Image</Label>
                <ImageUpload
                  value={content.cta.backgroundImage}
                  folder="ayurveda/cta"
                  onChange={(url) => updateContent('cta', { ...content.cta, backgroundImage: url })}
                  onRemove={() => updateContent('cta', { ...content.cta, backgroundImage: '' })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AyurvedaManager;
