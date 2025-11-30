import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  whaleBookingAdminService,
  AdminWhaleBookingContent,
  defaultAdminWhaleBookingContent,
} from '@/services/whaleBookingAdminService';
import { Plus, Trash2, RefreshCw } from 'lucide-react';

const arrayToTextarea = (arr: string[]) => arr.join('\n');
const textareaToArray = (value: string) =>
  value.split('\n').map((line) => line.trim()).filter(Boolean);

const WhaleBookingManager: React.FC = () => {
  const [content, setContent] = useState<AdminWhaleBookingContent>(defaultAdminWhaleBookingContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await whaleBookingAdminService.getContent();
        setContent(data);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Failed to load whale booking content.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [toast]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await whaleBookingAdminService.saveContent(content);
      toast({
        title: 'Content saved',
        description: 'Whale booking page content updated successfully.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Save failed',
        description: 'Unable to update whale booking content.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateContent = <K extends keyof AdminWhaleBookingContent>(
    key: K,
    value: AdminWhaleBookingContent[K],
  ) => {
    setContent((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateSeason = (index: number, field: string, value: string | string[]) => {
    const updated = [...content.seasons];
    // @ts-expect-error dynamic assignment
    updated[index][field] = value;
    updateContent('seasons', updated);
  };

  const updateHero = (value: Partial<AdminWhaleBookingContent['hero']>) => {
    updateContent('hero', { ...content.hero, ...value });
  };

  const addHeroGallerySlide = () => {
    const gallery = [...(content.hero.gallery || [])];
    gallery.push({ image: '', caption: '' });
    updateHero({ gallery });
  };

  const updateHeroGallerySlide = (index: number, field: 'image' | 'caption', value: string) => {
    const gallery = [...(content.hero.gallery || [])];
    gallery[index] = { ...gallery[index], [field]: value };
    updateHero({ gallery });
  };

  const removeHeroGallerySlide = (index: number) => {
    const gallery = (content.hero.gallery || []).filter((_, i) => i !== index);
    updateHero({ gallery });
  };

  if (loading) {
    return <div className="p-6">Loading whale booking content…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Whale Booking Manager</h2>
          <p className="text-muted-foreground">
            Control the TripAdvisor-style whale booking page content and pricing.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setContent(defaultAdminWhaleBookingContent)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to defaults
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="seasons">Seasons</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="operator">Operator</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Update the hero title, subtitle, and background.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={content.hero.title} onChange={(e) => updateHero({ title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Badge</label>
                <Input value={content.hero.badge} onChange={(e) => updateHero({ badge: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Subtitle</label>
                <Textarea value={content.hero.subtitle} onChange={(e) => updateHero({ subtitle: e.target.value })} rows={3} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Background image URL</label>
                <Input
                  value={content.hero.backgroundImage}
                  onChange={(e) => updateHero({ backgroundImage: e.target.value })}
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Hero gallery slides</label>
                  <Button type="button" variant="outline" size="sm" onClick={addHeroGallerySlide}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add slide
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add multiple ocean shots to automatically fade through at the top of the page.
                </p>
                <div className="space-y-3">
                  {(content.hero.gallery || []).map((slide, index) => (
                    <div
                      key={`hero-slide-${index}`}
                      className="space-y-3 rounded-2xl border border-dashed border-slate-200 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Slide {index + 1}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHeroGallerySlide(index)}
                          className="text-rose-500 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wide text-slate-500">Image URL</label>
                        <Input
                          value={slide.image}
                          onChange={(e) => updateHeroGallerySlide(index, 'image', e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wide text-slate-500">Caption (optional)</label>
                        <Input
                          value={slide.caption || ''}
                          onChange={(e) => updateHeroGallerySlide(index, 'caption', e.target.value)}
                          placeholder="Describe the scene or vessel"
                        />
                      </div>
                    </div>
                  ))}
                  {(content.hero.gallery || []).length === 0 && (
                    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                      No hero gallery slides yet. Click “Add slide” to rotate multiple whale/ocean photos.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasons" className="mt-6 space-y-4">
          {content.seasons.map((season, index) => (
            <Card key={season.id}>
              <CardHeader>
                <CardTitle>{season.title}</CardTitle>
                <CardDescription>Season highlight card</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={season.title}
                      onChange={(e) => updateSeason(index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Season months</label>
                    <Input
                      value={season.months}
                      onChange={(e) => updateSeason(index, 'months', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Success stat</label>
                    <Input
                      value={season.successStat}
                      onChange={(e) => updateSeason(index, 'successStat', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Departure time</label>
                    <Input
                      value={season.departure}
                      onChange={(e) => updateSeason(index, 'departure', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup point</label>
                    <Input
                      value={season.pickupPoint}
                      onChange={(e) => updateSeason(index, 'pickupPoint', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Highlights (one per line)</label>
                    <Textarea
                      rows={4}
                      value={arrayToTextarea(season.highlights)}
                      onChange={(e) => updateSeason(index, 'highlights', textareaToArray(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    rows={3}
                    value={season.description}
                    onChange={(e) => updateSeason(index, 'description', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview Section</CardTitle>
              <CardDescription>Summary, badges, and highlights.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Summary</label>
                <Textarea
                  rows={4}
                  value={content.overview.summary}
                  onChange={(e) => updateContent('overview', { ...content.overview, summary: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Badges (one per line)</label>
                  <Textarea
                    rows={4}
                    value={arrayToTextarea(content.overview.badges)}
                    onChange={(e) =>
                      updateContent('overview', { ...content.overview, badges: textareaToArray(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Highlights</label>
                  <Textarea
                    rows={4}
                    value={arrayToTextarea(content.overview.highlights)}
                    onChange={(e) =>
                      updateContent('overview', { ...content.overview, highlights: textareaToArray(e.target.value) })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>Core experience metadata.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {[
                ['Duration', 'duration'],
                ['Pickup info', 'pickupInfo'],
                ['Ticket type', 'ticketType'],
                ['Cancellation', 'cancellation'],
                ['Accessibility', 'accessibility'],
                ['Age range', 'ageRange'],
              ].map(([label, field]) => (
                <div className="space-y-2" key={field}>
                  <label className="text-sm font-medium">{label}</label>
                  <Input
                    value={(content.details as any)[field]}
                    onChange={(e) =>
                      updateContent('details', { ...content.details, [field]: e.target.value } as any)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Lists & Notes</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {[
                ['Languages', 'languages'],
                ['Includes', 'includes'],
                ['Excludes', 'excludes'],
                ['Important notes', 'importantNotes'],
              ].map(([label, field]) => (
                <div className="space-y-2" key={field}>
                  <label className="text-sm font-medium">{label}</label>
                  <Textarea
                    rows={4}
                    value={arrayToTextarea((content.details as any)[field])}
                    onChange={(e) =>
                      updateContent('details', {
                        ...content.details,
                        [field]: textareaToArray(e.target.value),
                      } as any)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="itinerary" className="mt-6 space-y-4">
          {content.itinerary.map((item, index) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Stop {index + 1}</CardTitle>
                  <CardDescription>{item.title}</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = content.itinerary.filter((_, i) => i !== index);
                    updateContent('itinerary', updated);
                  }}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Remove
                </Button>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...content.itinerary];
                      updated[index] = { ...item, title: e.target.value };
                      updateContent('itinerary', updated);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <Input
                    value={item.duration}
                    onChange={(e) => {
                      const updated = [...content.itinerary];
                      updated[index] = { ...item, duration: e.target.value };
                      updateContent('itinerary', updated);
                    }}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Location (optional)</label>
                  <Input
                    value={item.location || ''}
                    onChange={(e) => {
                      const updated = [...content.itinerary];
                      updated[index] = { ...item, location: e.target.value };
                      updateContent('itinerary', updated);
                    }}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    rows={3}
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...content.itinerary];
                      updated[index] = { ...item, description: e.target.value };
                      updateContent('itinerary', updated);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              updateContent('itinerary', [
                ...content.itinerary,
                {
                  id: `stop-${Date.now()}`,
                  title: 'New stop',
                  description: 'Describe this itinerary stop…',
                  duration: '1 hour',
                  location: '',
                },
              ])
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add itinerary stop
          </Button>
        </TabsContent>

        <TabsContent value="operator" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operator Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Operator name</label>
                <Input
                  value={content.operator.name}
                  onChange={(e) => updateContent('operator', { ...content.operator, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <Input
                  type="number"
                  step="0.01"
                  value={content.operator.rating}
                  onChange={(e) =>
                    updateContent('operator', { ...content.operator, rating: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reviews count</label>
                <Input
                  type="number"
                  value={content.operator.reviewsCount}
                  onChange={(e) =>
                    updateContent('operator', { ...content.operator, reviewsCount: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact phone</label>
                <Input
                  value={content.operator.contactPhone}
                  onChange={(e) => updateContent('operator', { ...content.operator, contactPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact email</label>
                <Input
                  value={content.operator.contactEmail}
                  onChange={(e) => updateContent('operator', { ...content.operator, contactEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Support hours</label>
                <Input
                  value={content.operator.supportHours}
                  onChange={(e) => updateContent('operator', { ...content.operator, supportHours: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  rows={3}
                  value={content.operator.description}
                  onChange={(e) => updateContent('operator', { ...content.operator, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Licenses (one per line)</label>
                <Textarea
                  rows={4}
                  value={arrayToTextarea(content.operator.licenses)}
                  onChange={(e) =>
                    updateContent('operator', { ...content.operator, licenses: textareaToArray(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Assurances</label>
                <Textarea
                  rows={4}
                  value={arrayToTextarea(content.operator.assurances)}
                  onChange={(e) =>
                    updateContent('operator', { ...content.operator, assurances: textareaToArray(e.target.value) })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6 space-y-4">
          {content.reviews.map((review, index) => (
            <Card key={review.id}>
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>{review.name}</CardTitle>
                  <CardDescription>{review.date}</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = content.reviews.filter((_, i) => i !== index);
                    updateContent('reviews', updated);
                  }}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Remove
                </Button>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reviewer name</label>
                  <Input
                    value={review.name}
                    onChange={(e) => {
                      const updated = [...content.reviews];
                      updated[index] = { ...review, name: e.target.value };
                      updateContent('reviews', updated);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date label</label>
                  <Input
                    value={review.date}
                    onChange={(e) => {
                      const updated = [...content.reviews];
                      updated[index] = { ...review, date: e.target.value };
                      updateContent('reviews', updated);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={review.rating}
                    onChange={(e) => {
                      const updated = [...content.reviews];
                      updated[index] = { ...review, rating: parseFloat(e.target.value) || 0 };
                      updateContent('reviews', updated);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Traveler type</label>
                  <Input
                    value={review.travelerType || ''}
                    onChange={(e) => {
                      const updated = [...content.reviews];
                      updated[index] = { ...review, travelerType: e.target.value };
                      updateContent('reviews', updated);
                    }}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={review.title}
                    onChange={(e) => {
                      const updated = [...content.reviews];
                      updated[index] = { ...review, title: e.target.value };
                      updateContent('reviews', updated);
                    }}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Comment</label>
                  <Textarea
                    rows={3}
                    value={review.comment}
                    onChange={(e) => {
                      const updated = [...content.reviews];
                      updated[index] = { ...review, comment: e.target.value };
                      updateContent('reviews', updated);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              updateContent('reviews', [
                ...content.reviews,
                {
                  id: `review-${Date.now()}`,
                  name: 'New reviewer',
                  date: 'Month Year',
                  rating: 5,
                  title: 'Review title',
                  comment: 'Share guest feedback…',
                  travelerType: '',
                },
              ])
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add review
          </Button>
        </TabsContent>

        <TabsContent value="about" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  rows={4}
                  value={content.about.description}
                  onChange={(e) => updateContent('about', { ...content.about, description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sustainability commitments</label>
                  <Textarea
                    rows={4}
                    value={arrayToTextarea(content.about.sustainabilityCommitments)}
                    onChange={(e) =>
                      updateContent('about', {
                        ...content.about,
                        sustainabilityCommitments: textareaToArray(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">FAQs (JSON)</label>
                  <Textarea
                    rows={4}
                    value={JSON.stringify(content.about.faqs, null, 2)}
                    onChange={(e) => {
                      try {
                        const nextFaqs = JSON.parse(e.target.value);
                        updateContent('about', { ...content.about, faqs: nextFaqs });
                      } catch {
                        // ignore malformed JSON
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Quick edit: paste an array of objects with <code>question</code> and <code>answer</code>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Policies</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Input
                  value={content.pricing.currency}
                  onChange={(e) => updateContent('pricing', { ...content.pricing, currency: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Adult price</label>
                <Input
                  type="number"
                  value={content.pricing.adultPrice}
                  onChange={(e) =>
                    updateContent('pricing', { ...content.pricing, adultPrice: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Child price</label>
                <Input
                  type="number"
                  value={content.pricing.childPrice}
                  onChange={(e) =>
                    updateContent('pricing', { ...content.pricing, childPrice: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Deposit note</label>
                <Textarea
                  rows={2}
                  value={content.pricing.depositNote}
                  onChange={(e) => updateContent('pricing', { ...content.pricing, depositNote: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Lowest price guarantee</label>
                <Textarea
                  rows={2}
                  value={content.pricing.lowestPriceGuarantee}
                  onChange={(e) =>
                    updateContent('pricing', { ...content.pricing, lowestPriceGuarantee: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Refund policy</label>
                <Textarea
                  rows={2}
                  value={content.pricing.refundPolicy}
                  onChange={(e) => updateContent('pricing', { ...content.pricing, refundPolicy: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Disclaimer</label>
                <Textarea
                  rows={2}
                  value={content.pricing.disclaimer}
                  onChange={(e) => updateContent('pricing', { ...content.pricing, disclaimer: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhaleBookingManager;

