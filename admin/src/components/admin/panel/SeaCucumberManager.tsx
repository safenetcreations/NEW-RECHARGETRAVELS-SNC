import { useEffect, useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, RefreshCw, Save } from 'lucide-react';
import ImageUpload from '@/components/ui/image-upload';
import { useToast } from '@/components/ui/use-toast';
import {
  defaultSeaCucumberAdminContent,
  seaCucumberAdminService,
  AdminSeaCucumberContent,
  AdminSeaCucumberHeroSlide,
  AdminSeaCucumberFarm,
  AdminSeaCucumberExperience,
  AdminResearchTrack,
  AdminGalleryImage,
  AdminFAQEntry
} from '@/services/seaCucumberAdminService';

const SeaCucumberManager = () => {
  const [content, setContent] = useState<AdminSeaCucumberContent>(defaultSeaCucumberAdminContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await seaCucumberAdminService.getContent();
        setContent(data);
      } catch (error) {
        console.error(error);
        toast({ title: 'Failed to load content', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await seaCucumberAdminService.save(content);
      toast({ title: 'Sea cucumber page saved' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to save content', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const updateHeroSlide = (index: number, field: keyof AdminSeaCucumberHeroSlide, value: string) => {
    const slides = [...content.hero.images];
    slides[index] = { ...slides[index], [field]: value };
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, images: slides } }));
  };

  const addHeroSlide = () => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        images: [
          ...prev.hero.images,
          { id: `hero-${Date.now()}`, image: '', caption: '', tag: '' }
        ]
      }
    }));
  };

  const removeHeroSlide = (index: number) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, images: prev.hero.images.filter((_, i) => i !== index) }
    }));
  };

  const updateArrayItem = <T,>(
    key: keyof AdminSeaCucumberContent,
    index: number,
    value: T
  ) => {
    const arr = [...(content[key] as T[])];
    arr[index] = value;
    setContent((prev) => ({ ...prev, [key]: arr }));
  };

  const addArrayItem = <T,>(key: keyof AdminSeaCucumberContent, item: T) => {
    const arr = [...(content[key] as T[])];
    arr.push(item);
    setContent((prev) => ({ ...prev, [key]: arr }));
  };

  const removeArrayItem = (key: keyof AdminSeaCucumberContent, index: number) => {
    const arr = [...(content[key] as unknown as any[])];
    arr.splice(index, 1);
    setContent((prev) => ({ ...prev, [key]: arr }));
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading sea cucumber content…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Sea Cucumber Experience Management</h1>
          <p className="text-sm text-muted-foreground">
            Control hero sliders, farm modules, experiences, research tracks, gallery, and booking details.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setContent(defaultSeaCucumberAdminContent)}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reset to defaults
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : (
              <span className="inline-flex items-center">
                <Save className="mr-2 h-4 w-4" /> Save changes
              </span>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="overview">Overview & Stats</TabsTrigger>
          <TabsTrigger value="farms">Farms</TabsTrigger>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="faq">FAQ & SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero content</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input
                  value={content.hero.badge}
                  onChange={(e) => setContent((prev) => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label>CTA text</Label>
                <Input
                  value={content.hero.ctaText}
                  onChange={(e) => setContent((prev) => ({ ...prev, hero: { ...prev.hero, ctaText: e.target.value } }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Title</Label>
                <Input
                  value={content.hero.title}
                  onChange={(e) => setContent((prev) => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Subtitle</Label>
                <Textarea
                  rows={3}
                  value={content.hero.subtitle}
                  onChange={(e) => setContent((prev) => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Hero slides</CardTitle>
              <Button variant="outline" size="sm" onClick={addHeroSlide}>
                <Plus className="mr-2 h-4 w-4" /> Add slide
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.hero.images.map((slide, index) => (
                <div key={slide.id} className="space-y-3 rounded-2xl border border-dashed border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Slide {index + 1}</p>
                    <Button variant="ghost" size="icon" onClick={() => removeHeroSlide(index)}>
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                  <ImageUpload
                    value={slide.image}
                    onChange={(url) => updateHeroSlide(index, 'image', url)}
                    onRemove={() => updateHeroSlide(index, 'image', '')}
                    folder="experiences/sea-cucumber/hero"
                  />
                  <Input
                    placeholder="Caption"
                    value={slide.caption}
                    onChange={(e) => updateHeroSlide(index, 'caption', e.target.value)}
                  />
                  <Input
                    placeholder="Tag"
                    value={slide.tag ?? ''}
                    onChange={(e) => updateHeroSlide(index, 'tag', e.target.value)}
                  />
                </div>
              ))}
              {!content.hero.images.length && <p className="text-sm text-slate-500">No slides yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview copy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Summary</Label>
              <Textarea
                rows={4}
                value={content.overview.summary}
                onChange={(e) => setContent((prev) => ({ ...prev, overview: { ...prev.overview, summary: e.target.value } }))}
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Highlights</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        overview: {
                          ...prev.overview,
                          highlights: [
                            ...prev.overview.highlights,
                            { id: `hl-${Date.now()}`, label: 'New highlight', description: '' }
                          ]
                        }
                      }))
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                </div>
                {content.overview.highlights.map((highlight, index) => (
                  <div key={highlight.id} className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={highlight.label}
                        onChange={(e) => {
                          const next = [...content.overview.highlights];
                          next[index] = { ...highlight, label: e.target.value };
                          setContent((prev) => ({ ...prev, overview: { ...prev.overview, highlights: next } }));
                        }}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={2}
                        value={highlight.description}
                        onChange={(e) => {
                          const next = [...content.overview.highlights];
                          next[index] = { ...highlight, description: e.target.value };
                          setContent((prev) => ({ ...prev, overview: { ...prev.overview, highlights: next } }));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.stats.map((stat, index) => (
                <div key={stat.id} className="grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => {
                        const next = [...content.stats];
                        next[index] = { ...stat, label: e.target.value };
                        setContent((prev) => ({ ...prev, stats: next }));
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => {
                        const next = [...content.stats];
                        next[index] = { ...stat, value: e.target.value };
                        setContent((prev) => ({ ...prev, stats: next }));
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Input
                      value={stat.iconName}
                      onChange={(e) => {
                        const next = [...content.stats];
                        next[index] = { ...stat, iconName: e.target.value };
                        setContent((prev) => ({ ...prev, stats: next }));
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="farms" className="space-y-6">
          {content.farms.map((farm, index) => (
            <Card key={farm.id}>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>{farm.name}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => removeArrayItem('farms', index)}>
                  <Trash2 className="h-4 w-4 text-rose-500" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={farm.name}
                    onChange={(e) => {
                      const next: AdminSeaCucumberFarm = { ...farm, name: e.target.value };
                      updateArrayItem('farms', index, next);
                    }}
                    placeholder="Name"
                  />
                  <Input
                    value={farm.region}
                    onChange={(e) => updateArrayItem('farms', index, { ...farm, region: e.target.value })}
                    placeholder="Region"
                  />
                  <Input
                    value={farm.badge}
                    onChange={(e) => updateArrayItem('farms', index, { ...farm, badge: e.target.value })}
                    placeholder="Badge"
                  />
                  <Input
                    value={farm.capacity}
                    onChange={(e) => updateArrayItem('farms', index, { ...farm, capacity: e.target.value })}
                    placeholder="Capacity"
                  />
                </div>
                <Textarea
                  rows={3}
                  value={farm.description}
                  onChange={(e) => updateArrayItem('farms', index, { ...farm, description: e.target.value })}
                />
                <div className="grid gap-4 md:grid-cols-3">
                  <Input
                    value={farm.duration}
                    onChange={(e) => updateArrayItem('farms', index, { ...farm, duration: e.target.value })}
                    placeholder="Duration"
                  />
                  <Input
                    value={farm.focus}
                    onChange={(e) => updateArrayItem('farms', index, { ...farm, focus: e.target.value })}
                    placeholder="Focus"
                  />
                  <Input
                    value={farm.logistics.bestSeason}
                    onChange={(e) =>
                      updateArrayItem('farms', index, {
                        ...farm,
                        logistics: { ...farm.logistics, bestSeason: e.target.value }
                      })
                    }
                    placeholder="Best season"
                  />
                </div>
                <Input
                  value={farm.logistics.meetingPoint}
                  onChange={(e) =>
                    updateArrayItem('farms', index, {
                      ...farm,
                      logistics: { ...farm.logistics, meetingPoint: e.target.value }
                    })
                  }
                  placeholder="Meeting point"
                />
                <Textarea
                  rows={2}
                  value={farm.logistics.transferNote}
                  onChange={(e) =>
                    updateArrayItem('farms', index, {
                      ...farm,
                      logistics: { ...farm.logistics, transferNote: e.target.value }
                    })
                  }
                  placeholder="Transfer note"
                />
                <Textarea
                  rows={2}
                  value={farm.highlights.join('\n')}
                  onChange={(e) =>
                    updateArrayItem('farms', index, {
                      ...farm,
                      highlights: e.target.value.split('\n').filter(Boolean)
                    })
                  }
                  placeholder="Highlights (one per line)"
                />
                <ImageUpload
                  value={farm.image}
                  onChange={(url) => updateArrayItem('farms', index, { ...farm, image: url })}
                  onRemove={() => updateArrayItem('farms', index, { ...farm, image: '' })}
                  folder="experiences/sea-cucumber/farms"
                />
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              addArrayItem<AdminSeaCucumberFarm>('farms', {
                id: `farm-${Date.now()}`,
                name: 'New farm',
                region: '',
                badge: '',
                description: '',
                duration: '',
                capacity: '',
                focus: '',
                highlights: [],
                logistics: { meetingPoint: '', bestSeason: '', transferNote: '', gear: [] },
                image: ''
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add farm
          </Button>
        </TabsContent>

        <TabsContent value="experiences" className="space-y-6">
          {content.experiences.map((experience, index) => (
            <Card key={experience.id}>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>{experience.name}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => removeArrayItem('experiences', index)}>
                  <Trash2 className="h-4 w-4 text-rose-500" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={experience.name}
                    onChange={(e) => updateArrayItem('experiences', index, { ...experience, name: e.target.value })}
                    placeholder="Name"
                  />
                  <Input
                    value={experience.level}
                    onChange={(e) => updateArrayItem('experiences', index, { ...experience, level: e.target.value })}
                    placeholder="Level"
                  />
                  <Input
                    value={experience.duration}
                    onChange={(e) => updateArrayItem('experiences', index, { ...experience, duration: e.target.value })}
                    placeholder="Duration"
                  />
                  <Input
                    value={experience.priceLabel}
                    onChange={(e) => updateArrayItem('experiences', index, { ...experience, priceLabel: e.target.value })}
                    placeholder="Price label"
                  />
                </div>
                <Textarea
                  rows={3}
                  value={experience.summary}
                  onChange={(e) => updateArrayItem('experiences', index, { ...experience, summary: e.target.value })}
                  placeholder="Summary"
                />
                <Textarea
                  rows={3}
                  value={experience.highlights.join('\n')}
                  onChange={(e) =>
                    updateArrayItem('experiences', index, {
                      ...experience,
                      highlights: e.target.value.split('\n').filter(Boolean)
                    })
                  }
                  placeholder="Highlights (one per line)"
                />
                <Textarea
                  rows={3}
                  value={experience.included.join('\n')}
                  onChange={(e) =>
                    updateArrayItem('experiences', index, {
                      ...experience,
                      included: e.target.value.split('\n').filter(Boolean)
                    })
                  }
                  placeholder="Included (one per line)"
                />
                <ImageUpload
                  value={experience.image}
                  onChange={(url) => updateArrayItem('experiences', index, { ...experience, image: url })}
                  onRemove={() => updateArrayItem('experiences', index, { ...experience, image: '' })}
                  folder="experiences/sea-cucumber/packages"
                />
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              addArrayItem<AdminSeaCucumberExperience>('experiences', {
                id: `exp-${Date.now()}`,
                name: 'New experience',
                summary: '',
                duration: '',
                priceLabel: '',
                level: '',
                iconName: 'Shell',
                image: '',
                highlights: [],
                included: []
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add experience
          </Button>
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          {content.researchTracks.map((track, index) => (
            <Card key={track.id}>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>{track.title}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => removeArrayItem('researchTracks', index)}>
                  <Trash2 className="h-4 w-4 text-rose-500" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={track.title}
                    onChange={(e) => updateArrayItem('researchTracks', index, { ...track, title: e.target.value })}
                    placeholder="Title"
                  />
                  <Input
                    value={track.badge}
                    onChange={(e) => updateArrayItem('researchTracks', index, { ...track, badge: e.target.value })}
                    placeholder="Badge"
                  />
                </div>
                <Textarea
                  rows={3}
                  value={track.description}
                  onChange={(e) => updateArrayItem('researchTracks', index, { ...track, description: e.target.value })}
                />
                <Textarea
                  rows={3}
                  value={track.bullets.join('\n')}
                  onChange={(e) =>
                    updateArrayItem('researchTracks', index, {
                      ...track,
                      bullets: e.target.value.split('\n').filter(Boolean)
                    })
                  }
                  placeholder="Bullets"
                />
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              addArrayItem<AdminResearchTrack>('researchTracks', {
                id: `rt-${Date.now()}`,
                title: 'New track',
                badge: 'Tag',
                description: '',
                bullets: []
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add research track
          </Button>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          {content.gallery.map((image, index) => (
            <Card key={image.id} className="flex items-center gap-4 p-4">
              <ImageUpload
                value={image.image}
                onChange={(url) => updateArrayItem('gallery', index, { ...image, image: url })}
                onRemove={() => updateArrayItem('gallery', index, { ...image, image: '' })}
                folder="experiences/sea-cucumber/gallery"
              />
              <div className="grid flex-1 gap-2">
                <Input
                  value={image.caption}
                  onChange={(e) => updateArrayItem('gallery', index, { ...image, caption: e.target.value })}
                  placeholder="Caption"
                />
                <Button variant="ghost" size="sm" onClick={() => removeArrayItem('gallery', index)}>
                  <Trash2 className="mr-2 h-4 w-4 text-rose-500" /> Remove
                </Button>
              </div>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              addArrayItem<AdminGalleryImage>('gallery', {
                id: `gal-${Date.now()}`,
                image: '',
                caption: ''
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add gallery image
          </Button>
        </TabsContent>

        <TabsContent value="booking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Concierge copy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                rows={3}
                value={content.booking.conciergeNote}
                onChange={(e) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, conciergeNote: e.target.value } }))}
                placeholder="Concierge note"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  value={content.booking.contactPhone}
                  onChange={(e) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, contactPhone: e.target.value } }))}
                  placeholder="Phone"
                />
                <Input
                  value={content.booking.whatsapp}
                  onChange={(e) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, whatsapp: e.target.value } }))}
                  placeholder="WhatsApp link"
                />
                <Input
                  value={content.booking.email}
                  onChange={(e) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, email: e.target.value } }))}
                  placeholder="Email"
                />
                <Input
                  value={content.booking.responseTime}
                  onChange={(e) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, responseTime: e.target.value } }))}
                  placeholder="Response time"
                />
              </div>
              <Textarea
                rows={2}
                value={content.booking.depositNote}
                onChange={(e) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, depositNote: e.target.value } }))}
                placeholder="Deposit note"
              />
              <Textarea
                rows={2}
                value={content.booking.groupSuitability}
                onChange={(e) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, groupSuitability: e.target.value } }))}
                placeholder="Group suitability"
              />
              <Textarea
                rows={3}
                value={content.booking.addOns.join('\n')}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, booking: { ...prev.booking, addOns: e.target.value.split('\n').filter(Boolean) } }))
                }
                placeholder="Add-ons (one per line)"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing tokens</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Input
                value={content.pricing.currency}
                onChange={(e) => setContent((prev) => ({ ...prev, pricing: { ...prev.pricing, currency: e.target.value } }))}
                placeholder="Currency"
              />
              <Input
                type="number"
                value={content.pricing.dayRate}
                onChange={(e) => setContent((prev) => ({ ...prev, pricing: { ...prev.pricing, dayRate: Number(e.target.value) } }))}
                placeholder="Day rate"
              />
              <Input
                type="number"
                value={content.pricing.labAddon}
                onChange={(e) => setContent((prev) => ({ ...prev, pricing: { ...prev.pricing, labAddon: Number(e.target.value) } }))}
                placeholder="Lab add-on"
              />
              <Input
                type="number"
                value={content.pricing.privateCharter}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, pricing: { ...prev.pricing, privateCharter: Number(e.target.value) } }))
                }
                placeholder="Private charter"
              />
              <Input
                type="number"
                value={content.pricing.familyBundle}
                onChange={(e) => setContent((prev) => ({ ...prev, pricing: { ...prev.pricing, familyBundle: Number(e.target.value) } }))}
                placeholder="Family bundle"
              />
              <Textarea
                rows={3}
                value={content.pricing.extras.join('\n')}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, pricing: { ...prev.pricing, extras: e.target.value.split('\n').filter(Boolean) } }))
                }
                placeholder="Extras"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>FAQs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.faqs.map((faq, index) => (
                <div key={faq.id} className="space-y-2 rounded-2xl border border-slate-200 p-4">
                  <Input
                    value={faq.question}
                    onChange={(e) => updateArrayItem('faqs', index, { ...faq, question: e.target.value })}
                    placeholder="Question"
                  />
                  <Textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => updateArrayItem('faqs', index, { ...faq, answer: e.target.value })}
                    placeholder="Answer"
                  />
                  <Button variant="ghost" size="sm" onClick={() => removeArrayItem('faqs', index)}>
                    <Trash2 className="mr-2 h-4 w-4 text-rose-500" /> Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  addArrayItem<AdminFAQEntry>('faqs', {
                    id: `faq-${Date.now()}`,
                    question: 'New question',
                    answer: ''
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add FAQ
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={content.seo.title}
                onChange={(e) => setContent((prev) => ({ ...prev, seo: { ...prev.seo, title: e.target.value } }))}
                placeholder="SEO title"
              />
              <Textarea
                rows={3}
                value={content.seo.description}
                onChange={(e) => setContent((prev) => ({ ...prev, seo: { ...prev.seo, description: e.target.value } }))}
                placeholder="SEO description"
              />
              <Textarea
                rows={2}
                value={content.seo.keywords.join(', ')}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, keywords: e.target.value.split(',').map((kw) => kw.trim()).filter(Boolean) }
                  }))
                }
                placeholder="Keywords (comma separated)"
              />
              <Input
                value={content.seo.ogImage}
                onChange={(e) => setContent((prev) => ({ ...prev, seo: { ...prev.seo, ogImage: e.target.value } }))}
                placeholder="OG image URL"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SeaCucumberManager;
