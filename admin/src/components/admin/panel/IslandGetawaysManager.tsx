import React, { useEffect, useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  AdminIslandGetawaysBookingContent,
  defaultAdminIslandGetawaysContent,
  islandGetawaysAdminService
} from '@/services/islandGetawaysAdminService';
import { Plus, Trash2, RefreshCw } from 'lucide-react';

const arrayToMultiline = (items: string[]) => items.join('\n');
const multilineToArray = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const IslandGetawaysManager = () => {
  const [content, setContent] = useState<AdminIslandGetawaysBookingContent>(defaultAdminIslandGetawaysContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await islandGetawaysAdminService.getContent();
        setContent(data);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Failed to load',
          description: 'Unable to fetch Island Getaways content.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [toast]);

  const updateContent = <K extends keyof AdminIslandGetawaysBookingContent>(key: K, value: AdminIslandGetawaysBookingContent[K]) => {
    setContent((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const updateHeroGallery = (index: number, field: 'image' | 'caption' | 'tag', value: string) => {
    const gallery = [...content.hero.gallery];
    gallery[index] = { ...gallery[index], [field]: value };
    updateContent('hero', { ...content.hero, gallery });
  };

  const addHeroSlide = () => {
    updateContent('hero', {
      ...content.hero,
      gallery: [...content.hero.gallery, { image: '', caption: '', tag: '' }]
    });
  };

  const removeHeroSlide = (index: number) => {
    updateContent('hero', {
      ...content.hero,
      gallery: content.hero.gallery.filter((_, i) => i !== index)
    });
  };

  const updateExperience = (index: number, field: string, value: string | string[]) => {
    const experiences = [...content.experiences];
    // @ts-expect-error dynamic assignment
    experiences[index][field] = value;
    updateContent('experiences', experiences);
  };

  const addExperience = () => {
    updateContent('experiences', [
      ...content.experiences,
      {
        id: `experience-${content.experiences.length + 1}`,
        name: '',
        summary: '',
        duration: '',
        priceLabel: '',
        level: 'All Levels',
        includes: [],
        iconName: 'Anchor',
        image: ''
      }
    ]);
  };

  const updateCombo = (index: number, field: string, value: string | string[]) => {
    const combos = [...content.combos];
    // @ts-expect-error dynamic assignment
    combos[index][field] = value;
    updateContent('combos', combos);
  };

  const addCombo = () => {
    updateContent('combos', [
      ...content.combos,
      {
        id: `combo-${content.combos.length + 1}`,
        name: '',
        badge: '',
        duration: '',
        priceLabel: '',
        highlights: [],
        includes: [],
        iconName: 'Sparkles'
      }
    ]);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await islandGetawaysAdminService.saveContent(content);
      toast({ title: 'Saved', description: 'Island Getaways content updated.' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Save failed',
        description: 'Could not save the latest changes.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading Island Getaways content…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Island Getaways Management</h1>
          <p className="text-sm text-muted-foreground">
            Control the hero slider, experience cards, logistics, gallery, and booking contact for the live page.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setContent(defaultAdminIslandGetawaysContent)}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reset to defaults
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
          <TabsTrigger value="combos">Combos</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="safety">Safety & FAQ</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Content</CardTitle>
              <CardDescription>Controls the top slider headline and badge.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={content.hero.title} onChange={(e) => updateContent('hero', { ...content.hero, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Badge</label>
                <Input value={content.hero.badge} onChange={(e) => updateContent('hero', { ...content.hero, badge: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Subtitle</label>
                <Textarea
                  rows={2}
                  value={content.hero.subtitle}
                  onChange={(e) => updateContent('hero', { ...content.hero, subtitle: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Hero Slides</CardTitle>
                <CardDescription>Upload 1920×1080 imagery with captions + tags.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addHeroSlide}>
                <Plus className="mr-2 h-4 w-4" /> Add slide
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.hero.gallery.map((slide, index) => (
                <div key={`hero-slide-${index}`} className="space-y-3 rounded-2xl border border-dashed border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Slide {index + 1}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHeroSlide(index)}
                      className="text-rose-500 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Image URL"
                    value={slide.image}
                    onChange={(e) => updateHeroGallery(index, 'image', e.target.value)}
                  />
                  <Input
                    placeholder="Caption"
                    value={slide.caption}
                    onChange={(e) => updateHeroGallery(index, 'caption', e.target.value)}
                  />
                  <Input
                    placeholder="Tag (optional)"
                    value={slide.tag ?? ''}
                    onChange={(e) => updateHeroGallery(index, 'tag', e.target.value)}
                  />
                </div>
              ))}
              {content.hero.gallery.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No slides yet. Click "Add slide" to create one.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={4}
                value={content.overview.summary}
                placeholder="High level blurb shown near the top of the public page"
                onChange={(e) => updateContent('overview', { ...content.overview, summary: e.target.value })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Stats badges</CardTitle>
                <CardDescription>Label + value + lucide icon name.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('overview', {
                    ...content.overview,
                    badges: [...content.overview.badges, { label: 'Label', value: 'Value', iconName: 'Anchor' }]
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add badge
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.overview.badges.map((badge, index) => (
                <div key={`badge-${index}`} className="grid gap-2 rounded-2xl border border-slate-200 p-3 md:grid-cols-3">
                  <Input
                    value={badge.label}
                    placeholder="Label"
                    onChange={(e) => {
                      const badges = [...content.overview.badges];
                      badges[index] = { ...badge, label: e.target.value };
                      updateContent('overview', { ...content.overview, badges });
                    }}
                  />
                  <Input
                    value={badge.value}
                    placeholder="Value"
                    onChange={(e) => {
                      const badges = [...content.overview.badges];
                      badges[index] = { ...badge, value: e.target.value };
                      updateContent('overview', { ...content.overview, badges });
                    }}
                  />
                  <Input
                    value={badge.iconName}
                    placeholder="Icon (e.g. Anchor)"
                    onChange={(e) => {
                      const badges = [...content.overview.badges];
                      badges[index] = { ...badge, iconName: e.target.value };
                      updateContent('overview', { ...content.overview, badges });
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Highlights</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('overview', {
                    ...content.overview,
                    highlights: [...content.overview.highlights, { label: 'Title', description: 'Description' }]
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add highlight
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.overview.highlights.map((highlight, index) => (
                <div key={`highlight-${index}`} className="space-y-2 rounded-2xl border border-slate-200 p-3">
                  <Input
                    value={highlight.label}
                    placeholder="Title"
                    onChange={(e) => {
                      const highlights = [...content.overview.highlights];
                      highlights[index] = { ...highlight, label: e.target.value };
                      updateContent('overview', { ...content.overview, highlights });
                    }}
                  />
                  <Textarea
                    rows={2}
                    value={highlight.description}
                    placeholder="Supporting copy"
                    onChange={(e) => {
                      const highlights = [...content.overview.highlights];
                      highlights[index] = { ...highlight, description: e.target.value };
                      updateContent('overview', { ...content.overview, highlights });
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateContent('overview', {
                        ...content.overview,
                        highlights: content.overview.highlights.filter((_, i) => i !== index)
                      })
                    }
                    className="text-rose-500 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experiences" className="mt-6 space-y-4">
          {content.experiences.map((experience, index) => (
            <Card key={experience.id} className="border border-slate-200">
              <CardHeader className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>{experience.name || `Experience ${index + 1}`}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    updateContent(
                      'experiences',
                      content.experiences.filter((_, i) => i !== index)
                    )
                  }
                  className="text-rose-500 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Experience title"
                    value={experience.name}
                    onChange={(e) => updateExperience(index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Duration"
                    value={experience.duration}
                    onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                  />
                </div>
                <Textarea
                  rows={3}
                  placeholder="Short description / selling copy"
                  value={experience.summary}
                  onChange={(e) => updateExperience(index, 'summary', e.target.value)}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Price label (e.g. USD 65 per guest)"
                    value={experience.priceLabel}
                    onChange={(e) => updateExperience(index, 'priceLabel', e.target.value)}
                  />
                  <Input
                    placeholder="Skill level"
                    value={experience.level}
                    onChange={(e) => updateExperience(index, 'level', e.target.value)}
                  />
                </div>
                <Textarea
                  rows={3}
                  placeholder="Includes (one perk per line)"
                  value={arrayToMultiline(experience.includes)}
                  onChange={(e) => updateExperience(index, 'includes', multilineToArray(e.target.value))}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Hero image URL"
                    value={experience.image ?? ''}
                    onChange={(e) => updateExperience(index, 'image', e.target.value)}
                  />
                  <Input
                    placeholder="Icon name (lucide)"
                    value={experience.iconName}
                    onChange={(e) => updateExperience(index, 'iconName', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" onClick={addExperience}>
            <Plus className="mr-2 h-4 w-4" /> Add experience
          </Button>
        </TabsContent>

        <TabsContent value="combos" className="mt-6 space-y-4">
          {content.combos.map((combo, index) => (
            <Card key={combo.id}>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>{combo.name || `Combo ${index + 1}`}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    updateContent(
                      'combos',
                      content.combos.filter((_, i) => i !== index)
                    )
                  }
                  className="text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Combo name" value={combo.name} onChange={(e) => updateCombo(index, 'name', e.target.value)} />
                <div className="grid gap-4 md:grid-cols-3">
                  <Input placeholder="Badge" value={combo.badge} onChange={(e) => updateCombo(index, 'badge', e.target.value)} />
                  <Input placeholder="Duration" value={combo.duration} onChange={(e) => updateCombo(index, 'duration', e.target.value)} />
                  <Input
                    placeholder="Price label"
                    value={combo.priceLabel}
                    onChange={(e) => updateCombo(index, 'priceLabel', e.target.value)}
                  />
                </div>
                <Textarea
                  rows={3}
                  placeholder="Highlights (one per line)"
                  value={arrayToMultiline(combo.highlights)}
                  onChange={(e) => updateCombo(index, 'highlights', multilineToArray(e.target.value))}
                />
                <Textarea
                  rows={3}
                  placeholder="Includes (one per line)"
                  value={arrayToMultiline(combo.includes)}
                  onChange={(e) => updateCombo(index, 'includes', multilineToArray(e.target.value))}
                />
                <Input
                  placeholder="Icon name"
                  value={combo.iconName}
                  onChange={(e) => updateCombo(index, 'iconName', e.target.value)}
                />
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" onClick={addCombo}>
            <Plus className="mr-2 h-4 w-4" /> Add combo
          </Button>
        </TabsContent>

        <TabsContent value="logistics" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operational logistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Meeting point"
                value={content.logistics.meetingPoint}
                onChange={(e) => updateContent('logistics', { ...content.logistics, meetingPoint: e.target.value })}
              />
              <Input
                placeholder="Base location blurb"
                value={content.logistics.baseLocation}
                onChange={(e) => updateContent('logistics', { ...content.logistics, baseLocation: e.target.value })}
              />
              <Textarea
                rows={2}
                placeholder="Transfer note"
                value={content.logistics.transferNote}
                onChange={(e) => updateContent('logistics', { ...content.logistics, transferNote: e.target.value })}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Textarea
                  rows={3}
                  placeholder="Session times (one per line)"
                  value={arrayToMultiline(content.logistics.sessionTimes)}
                  onChange={(e) => updateContent('logistics', { ...content.logistics, sessionTimes: multilineToArray(e.target.value) })}
                />
                <Textarea
                  rows={3}
                  placeholder="Gear provided (one per line)"
                  value={arrayToMultiline(content.logistics.gearProvided)}
                  onChange={(e) => updateContent('logistics', { ...content.logistics, gearProvided: multilineToArray(e.target.value) })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Textarea
                  rows={3}
                  placeholder="Bring list"
                  value={arrayToMultiline(content.logistics.bringList)}
                  onChange={(e) => updateContent('logistics', { ...content.logistics, bringList: multilineToArray(e.target.value) })}
                />
                <Textarea
                  rows={3}
                  placeholder="Weather / safety policy"
                  value={content.logistics.weatherPolicy}
                  onChange={(e) => updateContent('logistics', { ...content.logistics, weatherPolicy: e.target.value })}
                />
              </div>
              <Textarea
                rows={2}
                placeholder="Safety note"
                value={content.logistics.safetyNote}
                onChange={(e) => updateContent('logistics', { ...content.logistics, safetyNote: e.target.value })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Safety callouts</CardTitle>
              <CardDescription>Shown in the navy section of the public page.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={5}
                placeholder="One safety item per line"
                value={arrayToMultiline(content.safety)}
                onChange={(e) => updateContent('safety', multilineToArray(e.target.value))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>FAQs</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('faqs', [
                    ...content.faqs,
                    { id: `faq-${content.faqs.length + 1}`, question: '', answer: '' }
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add FAQ
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.faqs.map((faq, index) => (
                <div key={faq.id} className="space-y-2 rounded-2xl border border-slate-200 p-4">
                  <Input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => {
                      const faqs = [...content.faqs];
                      faqs[index] = { ...faq, question: e.target.value };
                      updateContent('faqs', faqs);
                    }}
                  />
                  <Textarea
                    rows={3}
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => {
                      const faqs = [...content.faqs];
                      faqs[index] = { ...faq, answer: e.target.value };
                      updateContent('faqs', faqs);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-500"
                    onClick={() => updateContent('faqs', content.faqs.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Gallery images</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('gallery', [
                    ...content.gallery,
                    { id: `gallery-${content.gallery.length + 1}`, image: '', caption: '' }
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add image
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.gallery.map((item, index) => (
                <div key={item.id} className="space-y-2 rounded-2xl border border-slate-200 p-3">
                  <Input
                    placeholder="Image URL"
                    value={item.image}
                    onChange={(e) => {
                      const gallery = [...content.gallery];
                      gallery[index] = { ...item, image: e.target.value };
                      updateContent('gallery', gallery);
                    }}
                  />
                  <Input
                    placeholder="Caption"
                    value={item.caption}
                    onChange={(e) => {
                      const gallery = [...content.gallery];
                      gallery[index] = { ...item, caption: e.target.value };
                      updateContent('gallery', gallery);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-500"
                    onClick={() => updateContent('gallery', content.gallery.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking & concierge contact</CardTitle>
              <CardDescription>These values feed the teal CTA + booking form left rail.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Hotline / phone"
                value={content.booking.contactPhone}
                onChange={(e) => updateContent('booking', { ...content.booking, contactPhone: e.target.value })}
              />
              <Input
                placeholder="WhatsApp link (https://wa.me/...)"
                value={content.booking.whatsapp}
                onChange={(e) => updateContent('booking', { ...content.booking, whatsapp: e.target.value })}
              />
              <Input
                placeholder="Concierge email"
                value={content.booking.email}
                onChange={(e) => updateContent('booking', { ...content.booking, email: e.target.value })}
              />
              <Input
                placeholder="Response time"
                value={content.booking.responseTime}
                onChange={(e) => updateContent('booking', { ...content.booking, responseTime: e.target.value })}
              />
              <Textarea
                rows={3}
                placeholder="Concierge note"
                value={content.booking.conciergeNote}
                onChange={(e) => updateContent('booking', { ...content.booking, conciergeNote: e.target.value })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing callouts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Currency (USD, LKR, EUR)"
                  value={content.pricing.currency}
                  onChange={(e) => updateContent('pricing', { ...content.pricing, currency: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Starting price"
                  value={content.pricing.startingPrice}
                  onChange={(e) => updateContent('pricing', { ...content.pricing, startingPrice: Number(e.target.value) })}
                />
              </div>
              <Textarea
                rows={2}
                placeholder="Deposit note"
                value={content.pricing.depositNote}
                onChange={(e) => updateContent('pricing', { ...content.pricing, depositNote: e.target.value })}
              />
              <Textarea
                rows={2}
                placeholder="Refund policy"
                value={content.pricing.refundPolicy}
                onChange={(e) => updateContent('pricing', { ...content.pricing, refundPolicy: e.target.value })}
              />
              <Textarea
                rows={2}
                placeholder="Extras / optional add-ons"
                value={content.pricing.extrasNote}
                onChange={(e) => updateContent('pricing', { ...content.pricing, extrasNote: e.target.value })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO meta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Meta title"
                value={content.seo.title}
                onChange={(e) => updateContent('seo', { ...content.seo, title: e.target.value })}
              />
              <Textarea
                rows={3}
                placeholder="Meta description"
                value={content.seo.description}
                onChange={(e) => updateContent('seo', { ...content.seo, description: e.target.value })}
              />
              <Textarea
                rows={2}
                placeholder="Keywords (one per line)"
                value={arrayToMultiline(content.seo.keywords)}
                onChange={(e) => updateContent('seo', { ...content.seo, keywords: multilineToArray(e.target.value) })}
              />
              <Input
                placeholder="OG image URL"
                value={content.seo.ogImage}
                onChange={(e) => updateContent('seo', { ...content.seo, ogImage: e.target.value })}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IslandGetawaysManager;







