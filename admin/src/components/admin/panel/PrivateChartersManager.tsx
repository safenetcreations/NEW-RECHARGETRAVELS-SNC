import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import ImageUpload from '@/components/ui/image-upload';
import { Switch } from '@/components/ui/switch';
import VideoUpload from '@/components/ui/video-upload';
import { useToast } from '@/components/ui/use-toast';
import {
  privateChartersAdminService,
  defaultPrivateChartersAdminContent,
  AdminPrivateChartersContent,
  AdminHeroSlide,
  AdminOverviewHighlight,
  AdminStatChip,
  AdminFleetAsset,
  AdminSignatureJourney,
  AdminServiceTier,
  AdminGalleryImage,
  AdminFAQEntry,
  AdminHeroMicroForm,
  AdminHeroMicroFormField,
  AdminMissionTimelineEntry,
  AdminCrewHighlight,
  AdminLifestyleRitual
} from '@/services/privateChartersAdminService';

const PrivateChartersManager = () => {
  const [content, setContent] = useState<AdminPrivateChartersContent>(defaultPrivateChartersAdminContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await privateChartersAdminService.getContent();
        const merged: AdminPrivateChartersContent = {
          ...defaultPrivateChartersAdminContent,
          ...data,
          overview: {
            ...defaultPrivateChartersAdminContent.overview,
            ...(data.overview ?? defaultPrivateChartersAdminContent.overview)
          },
          hero: {
            ...defaultPrivateChartersAdminContent.hero,
            ...(data.hero ?? defaultPrivateChartersAdminContent.hero),
            microForm: {
              ...defaultPrivateChartersAdminContent.hero.microForm,
              ...(data.hero?.microForm ?? defaultPrivateChartersAdminContent.hero.microForm),
              fields:
                data.hero?.microForm?.fields && data.hero.microForm.fields.length > 0
                  ? data.hero.microForm.fields
                  : defaultPrivateChartersAdminContent.hero.microForm.fields
            }
          },
          stats: data.stats ?? defaultPrivateChartersAdminContent.stats,
          fleet: data.fleet ?? defaultPrivateChartersAdminContent.fleet,
          journeys: data.journeys ?? defaultPrivateChartersAdminContent.journeys,
          serviceTiers: data.serviceTiers ?? defaultPrivateChartersAdminContent.serviceTiers,
          missions: data.missions ?? defaultPrivateChartersAdminContent.missions,
          crew: data.crew ?? defaultPrivateChartersAdminContent.crew,
          rituals: data.rituals ?? defaultPrivateChartersAdminContent.rituals,
          booking: {
            ...defaultPrivateChartersAdminContent.booking,
            ...(data.booking ?? defaultPrivateChartersAdminContent.booking)
          },
          pricing: {
            ...defaultPrivateChartersAdminContent.pricing,
            ...(data.pricing ?? defaultPrivateChartersAdminContent.pricing)
          },
          gallery: data.gallery ?? defaultPrivateChartersAdminContent.gallery,
          testimonials: data.testimonials ?? defaultPrivateChartersAdminContent.testimonials,
          partners: data.partners ?? defaultPrivateChartersAdminContent.partners,
          faqs: data.faqs ?? defaultPrivateChartersAdminContent.faqs,
          seo: {
            ...defaultPrivateChartersAdminContent.seo,
            ...(data.seo ?? defaultPrivateChartersAdminContent.seo)
          }
        };
        setContent(merged);
      } catch (error) {
        console.error(error);
        toast({ title: 'Failed to load charter content', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await privateChartersAdminService.save(content);
      toast({ title: 'Private charter content saved' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to save charter content', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const updateHeroSlide = (index: number, field: keyof AdminHeroSlide, value: string) => {
    const slides = [...content.hero.images];
    slides[index] = { ...slides[index], [field]: value };
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, images: slides } }));
  };

  const addHeroSlide = () => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        images: [...prev.hero.images, { id: `slide-${Date.now()}`, image: '', caption: '', tag: '' }]
      }
    }));
  };

  const removeHeroSlide = (index: number) => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        images: prev.hero.images.filter((_, i) => i !== index)
      }
    }));
  };

  const updateMicroForm = (key: keyof AdminHeroMicroForm, value: string | AdminHeroMicroFormField[]) => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        microForm: {
          ...prev.hero.microForm,
          [key]: value
        }
      }
    }));
  };

  const updateMicroFormField = (
    index: number,
    field: keyof AdminHeroMicroFormField,
    value: string | string[]
  ) => {
    const fields = [...content.hero.microForm.fields];
    fields[index] = { ...fields[index], [field]: value };
    updateMicroForm('fields', fields);
  };

  const addMicroFormField = () => {
    const fields = [
      ...content.hero.microForm.fields,
      {
        id: `field-${Date.now()}`,
        label: 'New field',
        type: 'text',
        placeholder: ''
      }
    ];
    updateMicroForm('fields', fields);
  };

  const removeMicroFormField = (index: number) => {
    const fields = content.hero.microForm.fields.filter((_, i) => i !== index);
    updateMicroForm('fields', fields);
  };

  const updateArray = <T,>(key: keyof AdminPrivateChartersContent, index: number, value: T) => {
    const arr = [...((content[key] as unknown) as T[])];
    arr[index] = value;
    setContent((prev) => ({ ...prev, [key]: arr }));
  };

  const removeArrayItem = (key: keyof AdminPrivateChartersContent, index: number) => {
    const arr = [...((content[key] as unknown) as any[])];
    arr.splice(index, 1);
    setContent((prev) => ({ ...prev, [key]: arr }));
  };

  const addArrayItem = <T,>(key: keyof AdminPrivateChartersContent, item: T) => {
    const arr = [...((content[key] as unknown) as T[])];
    arr.push(item);
    setContent((prev) => ({ ...prev, [key]: arr }));
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading private charter content…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Private Charters Management</h1>
          <p className="text-sm text-muted-foreground">
            Control hero sliders, fleet assets, signature journeys, and booking copy for the concierge page.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setContent(defaultPrivateChartersAdminContent)}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reset to defaults
          </Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
          <TabsTrigger value="journeys">Journeys</TabsTrigger>
          <TabsTrigger value="services">Service tiers</TabsTrigger>
          <TabsTrigger value="booking">Booking & Pricing</TabsTrigger>
          <TabsTrigger value="stories">Missions & Crew</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="brand">Testimonials & Partners</TabsTrigger>
          <TabsTrigger value="faqs">FAQs & SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero copy</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input value={content.hero.badge} onChange={(e) => setContent((prev) => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))} />
              </div>
              <div className="space-y-2">
                <Label>CTA text</Label>
                <Input value={content.hero.ctaText} onChange={(e) => setContent((prev) => ({ ...prev, hero: { ...prev.hero, ctaText: e.target.value } }))} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Title</Label>
                <Input value={content.hero.title} onChange={(e) => setContent((prev) => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Subtitle</Label>
                <Textarea rows={3} value={content.hero.subtitle} onChange={(e) => setContent((prev) => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hero video</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <VideoUpload
                value={content.hero.videoUrl}
                poster={content.hero.videoPoster}
                onChange={(url) => setContent((prev) => ({ ...prev, hero: { ...prev.hero, videoUrl: url } }))}
                onRemove={() => setContent((prev) => ({ ...prev, hero: { ...prev.hero, videoUrl: '' } }))}
                folder="experiences/private-charters/video"
              />
              <div className="space-y-2">
                <Label>Fallback poster image</Label>
                <ImageUpload
                  value={content.hero.videoPoster || ''}
                  onChange={(url) => setContent((prev) => ({ ...prev, hero: { ...prev.hero, videoPoster: url } }))}
                  onRemove={() => setContent((prev) => ({ ...prev, hero: { ...prev.hero, videoPoster: '' } }))}
                  folder="experiences/private-charters/hero"
                  helperText="Shown while video buffers or as fallback."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Hero concierge micro-form</CardTitle>
              <Button variant="outline" size="sm" onClick={addMicroFormField}>
                <Plus className="mr-2 h-4 w-4" /> Add field
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input
                    value={content.hero.microForm.heading}
                    onChange={(e) => updateMicroForm('heading', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subheading</Label>
                  <Input
                    value={content.hero.microForm.subheading}
                    onChange={(e) => updateMicroForm('subheading', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Submit label</Label>
                  <Input
                    value={content.hero.microForm.submitLabel}
                    onChange={(e) => updateMicroForm('submitLabel', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Success message</Label>
                  <Input
                    value={content.hero.microForm.successMessage}
                    onChange={(e) => updateMicroForm('successMessage', e.target.value)}
                  />
                </div>
              </div>

              {content.hero.microForm.fields.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No micro-form fields yet. Add fields to capture quick manifest details.
                </p>
              )}

              {content.hero.microForm.fields.map((field, index) => (
                <div key={field.id} className="space-y-3 rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Field {index + 1}</p>
                    <Button variant="ghost" size="icon" onClick={() => removeMicroFormField(index)}>
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      placeholder="Label"
                      value={field.label}
                      onChange={(e) => updateMicroFormField(index, 'label', e.target.value)}
                    />
                    <select
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                      value={field.type}
                      onChange={(e) => updateMicroFormField(index, 'type', e.target.value)}
                      aria-label={`${field.label || 'Field'} type`}
                    >
                      <option value="text">Text</option>
                      <option value="date">Date</option>
                      <option value="select">Select</option>
                      <option value="number">Number</option>
                    </select>
                  </div>
                  <Input
                    placeholder="Placeholder"
                    value={field.placeholder || ''}
                    onChange={(e) => updateMicroFormField(index, 'placeholder', e.target.value)}
                  />
                  {field.type === 'select' && (
                    <Input
                      placeholder="Options (comma separated)"
                      value={(field.options || []).join(', ')}
                      onChange={(e) =>
                        updateMicroFormField(
                          index,
                          'options',
                          e.target.value.split(',').map((item) => item.trim()).filter(Boolean)
                        )
                      }
                    />
                  )}
                  <Input
                    placeholder="Default value"
                    value={field.defaultValue || ''}
                    onChange={(e) => updateMicroFormField(index, 'defaultValue', e.target.value)}
                  />
                </div>
              ))}
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
              {content.hero.images.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No slides yet. Add one to start the carousel.
                </p>
              )}
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
                    folder="experiences/private-charters/hero"
                  />
                  <Input placeholder="Caption" value={slide.caption} onChange={(e) => updateHeroSlide(index, 'caption', e.target.value)} />
                  <Input placeholder="Tag" value={slide.tag ?? ''} onChange={(e) => updateHeroSlide(index, 'tag', e.target.value)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea rows={4} value={content.overview.summary} onChange={(e) => setContent((prev) => ({ ...prev, overview: { ...prev.overview, summary: e.target.value } }))} />
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
                        highlights: [...prev.overview.highlights, { id: `hl-${Date.now()}`, label: 'New highlight', description: '' }]
                      }
                    }))
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add highlight
                </Button>
              </div>
              {content.overview.highlights.map((highlight, index) => (
                <div key={highlight.id} className="space-y-2 rounded-2xl border border-slate-200 p-4">
                  <Input
                    placeholder="Label"
                    value={highlight.label}
                    onChange={(e) => {
                      const next: AdminOverviewHighlight = { ...highlight, label: e.target.value };
                      const arr = [...content.overview.highlights];
                      arr[index] = next;
                      setContent((prev) => ({ ...prev, overview: { ...prev.overview, highlights: arr } }));
                    }}
                  />
                  <Textarea
                    rows={2}
                    placeholder="Description"
                    value={highlight.description}
                    onChange={(e) => {
                      const next: AdminOverviewHighlight = { ...highlight, description: e.target.value };
                      const arr = [...content.overview.highlights];
                      arr[index] = next;
                      setContent((prev) => ({ ...prev, overview: { ...prev.overview, highlights: arr } }));
                    }}
                  />
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = content.overview.highlights.filter((_, i) => i !== index);
                    setContent((prev) => ({ ...prev, overview: { ...prev.overview, highlights: arr } }));
                  }}>
                    <Trash2 className="mr-2 h-4 w-4 text-rose-500" /> Remove
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          {content.stats.map((stat, index) => (
            <Card key={stat.id}>
              <CardContent className="grid gap-4 md:grid-cols-3 p-4">
                <Input placeholder="Label" value={stat.label} onChange={(e) => updateArray('stats', index, { ...stat, label: e.target.value })} />
                <Input placeholder="Value" value={stat.value} onChange={(e) => updateArray('stats', index, { ...stat, value: e.target.value })} />
                <Input placeholder="Icon (lucide name)" value={stat.iconName} onChange={(e) => updateArray('stats', index, { ...stat, iconName: e.target.value })} />
                <Button variant="ghost" size="sm" onClick={() => removeArrayItem('stats', index)}>
                  <Trash2 className="mr-2 h-4 w-4 text-rose-500" /> Remove
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" onClick={() => addArrayItem('stats', { id: `stat-${Date.now()}`, label: '', value: '', iconName: 'Star' } as AdminStatChip)}>
            <Plus className="mr-2 h-4 w-4" /> Add stat
          </Button>
        </TabsContent>

        <TabsContent value="fleet" className="space-y-4">
          {content.fleet.map((asset, index) => (
            <Card key={asset.id}>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>{asset.name || 'Fleet asset'}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => removeArrayItem('fleet', index)}>
                  <Trash2 className="h-4 w-4 text-rose-500" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input placeholder="Name" value={asset.name} onChange={(e) => updateArray('fleet', index, { ...asset, name: e.target.value })} />
                  <Input placeholder="Vessel type" value={asset.vesselType} onChange={(e) => updateArray('fleet', index, { ...asset, vesselType: e.target.value })} />
                  <Input placeholder="Capacity" value={asset.capacity} onChange={(e) => updateArray('fleet', index, { ...asset, capacity: e.target.value })} />
                  <Input placeholder="Range" value={asset.range} onChange={(e) => updateArray('fleet', index, { ...asset, range: e.target.value })} />
                  <Input placeholder="Price" value={asset.priceLabel} onChange={(e) => updateArray('fleet', index, { ...asset, priceLabel: e.target.value })} />
                  <Input placeholder="Icon" value={asset.iconName} onChange={(e) => updateArray('fleet', index, { ...asset, iconName: e.target.value })} />
                </div>
                <ImageUpload
                  value={asset.image}
                  onChange={(url) => updateArray('fleet', index, { ...asset, image: url })}
                  onRemove={() => updateArray('fleet', index, { ...asset, image: '' })}
                  folder="experiences/private-charters/fleet"
                />
                <Textarea
                  rows={3}
                  placeholder="Highlights (comma separated)"
                  value={asset.highlights.join(', ')}
                  onChange={(e) => updateArray('fleet', index, { ...asset, highlights: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) })}
                />
                <Textarea
                  rows={3}
                  placeholder="Hospitality (comma separated)"
                  value={asset.hospitality.join(', ')}
                  onChange={(e) => updateArray('fleet', index, { ...asset, hospitality: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) })}
                />
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              addArrayItem('fleet', {
                id: `fleet-${Date.now()}`,
                name: '',
                vesselType: '',
                capacity: '',
                range: '',
                priceLabel: '',
                iconName: 'Anchor',
                image: '',
                highlights: [],
                hospitality: []
              } as AdminFleetAsset)
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add fleet asset
          </Button>
        </TabsContent>

        <TabsContent value="journeys" className="space-y-4">
          {content.journeys.map((journey, index) => (
            <Card key={journey.id}>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>{journey.title || 'Signature journey'}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => removeArrayItem('journeys', index)}>
                  <Trash2 className="h-4 w-4 text-rose-500" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Title" value={journey.title} onChange={(e) => updateArray('journeys', index, { ...journey, title: e.target.value })} />
                <Input placeholder="Duration" value={journey.duration} onChange={(e) => updateArray('journeys', index, { ...journey, duration: e.target.value })} />
                <Input placeholder="Route" value={journey.route} onChange={(e) => updateArray('journeys', index, { ...journey, route: e.target.value })} />
                <Textarea rows={3} placeholder="Description" value={journey.description} onChange={(e) => updateArray('journeys', index, { ...journey, description: e.target.value })} />
                <Textarea
                  rows={2}
                  placeholder="Services (comma separated)"
                  value={journey.services.join(', ')}
                  onChange={(e) => updateArray('journeys', index, { ...journey, services: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) })}
                />
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              addArrayItem('journeys', {
                id: `journey-${Date.now()}`,
                title: '',
                duration: '',
                route: '',
                description: '',
                services: []
              } as AdminSignatureJourney)
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add journey
          </Button>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          {content.serviceTiers.map((tier, index) => (
            <Card key={tier.id}>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>{tier.name || 'Service tier'}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => removeArrayItem('serviceTiers', index)}>
                  <Trash2 className="h-4 w-4 text-rose-500" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Name" value={tier.name} onChange={(e) => updateArray('serviceTiers', index, { ...tier, name: e.target.value })} />
                <Input placeholder="Icon name" value={tier.iconName} onChange={(e) => updateArray('serviceTiers', index, { ...tier, iconName: e.target.value })} />
                <Textarea rows={2} placeholder="Description" value={tier.description} onChange={(e) => updateArray('serviceTiers', index, { ...tier, description: e.target.value })} />
                <Textarea
                  rows={2}
                  placeholder="Deliverables (comma separated)"
                  value={tier.deliverables.join(', ')}
                  onChange={(e) => updateArray('serviceTiers', index, { ...tier, deliverables: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) })}
                />
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              addArrayItem('serviceTiers', {
                id: `tier-${Date.now()}`,
                name: '',
                iconName: 'Star',
                description: '',
                deliverables: []
              } as AdminServiceTier)
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add service tier
          </Button>
        </TabsContent>

        <TabsContent value="booking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking copy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea rows={3} placeholder="Concierge note" value={content.booking.conciergeNote} onChange={(e) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, conciergeNote: e.target.value } }))} />
              <div className="grid gap-4 md:grid-cols-2">
                <Input placeholder="Phone" value={content.booking.contactPhone} onChange={(e) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, contactPhone: e.target.value } }))} />
                <Input placeholder="WhatsApp" value={content.booking.whatsapp} onChange={(e) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, whatsapp: e.target.value } }))} />
                <Input placeholder="Email" value={content.booking.email} onChange={(e) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, email: e.target.value } }))} />
                <Input placeholder="Response time" value={content.booking.responseTime} onChange={(e) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, responseTime: e.target.value } }))} />
              </div>
              <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Desk live?</p>
                  <p className="text-xs text-slate-500">Toggle to indicate real-time concierge coverage.</p>
                </div>
                <Switch
                  checked={content.booking.isLive}
                  onCheckedChange={(checked) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, isLive: checked } }))}
                />
              </div>
              <Input
                placeholder="Next availability window"
                value={content.booking.nextAvailabilityWindow}
                onChange={(e) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, nextAvailabilityWindow: e.target.value } }))}
              />
              <Textarea rows={2} placeholder="Deposit note" value={content.booking.depositNote} onChange={(e) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, depositNote: e.target.value } }))} />
              <Textarea rows={2} placeholder="Contract note" value={content.booking.contractNote} onChange={(e) => setContent((prev) => ({ ...prev, booking: { ...prev.booking, contractNote: e.target.value } }))} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing tokens</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Currency" value={content.pricing.currency} onChange={(e) => setContent((prev) => ({ ...prev, pricing: { ...prev.pricing, currency: e.target.value } }))} />
              <Input type="number" placeholder="Yacht minimum" value={content.pricing.yachtMinimum} onChange={(e) => setContent((prev) => ({ ...prev, pricing: { ...prev.pricing, yachtMinimum: Number(e.target.value) } }))} />
              <Input type="number" placeholder="Jet minimum" value={content.pricing.jetMinimum} onChange={(e) => setContent((prev) => ({ ...prev, pricing: { ...prev.pricing, jetMinimum: Number(e.target.value) } }))} />
              <Input type="number" placeholder="Helicopter minimum" value={content.pricing.helicopterMinimum} onChange={(e) => setContent((prev) => ({ ...prev, pricing: { ...prev.pricing, helicopterMinimum: Number(e.target.value) } }))} />
              <Textarea
                className="md:col-span-2"
                rows={2}
                placeholder="Add-ons (comma separated)"
                value={content.pricing.addOns.join(', ')}
                onChange={(e) => setContent((prev) => ({ ...prev, pricing: { ...prev.pricing, addOns: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) } }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stories" className="space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Mission timeline</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  addArrayItem('missions', {
                    id: `mission-${Date.now()}`,
                    title: 'New mission phase',
                    timestamp: '',
                    description: '',
                    iconName: 'Navigation',
                    quote: ''
                  } as AdminMissionTimelineEntry)
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add mission entry
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.missions.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Document a recent dispatch to build trust—add mission entries detailing each touchpoint.
                </p>
              )}
              {content.missions.map((mission, index) => (
                <div key={mission.id} className="space-y-3 rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <Input
                      className="font-semibold"
                      value={mission.title}
                      onChange={(e) => updateArray('missions', index, { ...mission, title: e.target.value })}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeArrayItem('missions', index)}>
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      placeholder="Timestamp"
                      value={mission.timestamp}
                      onChange={(e) => updateArray('missions', index, { ...mission, timestamp: e.target.value })}
                    />
                    <Input
                      placeholder="Icon name (lucide)"
                      value={mission.iconName}
                      onChange={(e) => updateArray('missions', index, { ...mission, iconName: e.target.value })}
                    />
                  </div>
                  <Textarea
                    rows={2}
                    placeholder="Description"
                    value={mission.description}
                    onChange={(e) => updateArray('missions', index, { ...mission, description: e.target.value })}
                  />
                  <Textarea
                    rows={2}
                    placeholder="Concierge quote"
                    value={mission.quote || ''}
                    onChange={(e) => updateArray('missions', index, { ...mission, quote: e.target.value })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Crew highlights</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  addArrayItem('crew', {
                    id: `crew-${Date.now()}`,
                    name: '',
                    role: '',
                    bio: '',
                    badges: []
                  } as AdminCrewHighlight)
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add crew member
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.crew.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Spotlight your captain, chief steward, wellness lead, and security chief to build confidence.
                </p>
              )}
              {content.crew.map((crewMember, index) => (
                <div key={crewMember.id} className="space-y-3 rounded-2xl border border-slate-200 p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      placeholder="Name"
                      value={crewMember.name}
                      onChange={(e) => updateArray('crew', index, { ...crewMember, name: e.target.value })}
                    />
                    <Input
                      placeholder="Role"
                      value={crewMember.role}
                      onChange={(e) => updateArray('crew', index, { ...crewMember, role: e.target.value })}
                    />
                  </div>
                  <Textarea
                    rows={2}
                    placeholder="Short bio"
                    value={crewMember.bio}
                    onChange={(e) => updateArray('crew', index, { ...crewMember, bio: e.target.value })}
                  />
                  <Input
                    placeholder="Badges (comma separated)"
                    value={crewMember.badges.join(', ')}
                    onChange={(e) =>
                      updateArray('crew', index, {
                        ...crewMember,
                        badges: e.target.value.split(',').map((item) => item.trim()).filter(Boolean)
                      })
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Image URL (optional)"
                      value={crewMember.image || ''}
                      onChange={(e) => updateArray('crew', index, { ...crewMember, image: e.target.value })}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeArrayItem('crew', index)}>
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Lifestyle rituals</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  addArrayItem('rituals', {
                    id: `ritual-${Date.now()}`,
                    title: '',
                    description: '',
                    iconName: 'Sparkles',
                    tag: ''
                  } as AdminLifestyleRitual)
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add ritual
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.rituals.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Capture the hospitality moments—wellness labs, DJ residencies, armored transfers, etc.
                </p>
              )}
              {content.rituals.map((ritual, index) => (
                <div key={ritual.id} className="space-y-3 rounded-2xl border border-slate-200 p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      placeholder="Title"
                      value={ritual.title}
                      onChange={(e) => updateArray('rituals', index, { ...ritual, title: e.target.value })}
                    />
                    <Input
                      placeholder="Icon name"
                      value={ritual.iconName}
                      onChange={(e) => updateArray('rituals', index, { ...ritual, iconName: e.target.value })}
                    />
                  </div>
                  <Textarea
                    rows={2}
                    placeholder="Description"
                    value={ritual.description}
                    onChange={(e) => updateArray('rituals', index, { ...ritual, description: e.target.value })}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Tag (optional)"
                      value={ritual.tag || ''}
                      onChange={(e) => updateArray('rituals', index, { ...ritual, tag: e.target.value })}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeArrayItem('rituals', index)}>
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          {content.gallery.map((image, index) => (
            <Card key={image.id} className="flex flex-col gap-4 p-4 md:flex-row">
              <ImageUpload
                value={image.image}
                onChange={(url) => updateArray('gallery', index, { ...image, image: url })}
                onRemove={() => updateArray('gallery', index, { ...image, image: '' })}
                folder="experiences/private-charters/gallery"
              />
              <div className="flex-1 space-y-2">
                <Input placeholder="Caption" value={image.caption} onChange={(e) => updateArray('gallery', index, { ...image, caption: e.target.value })} />
                <Button variant="ghost" size="sm" onClick={() => removeArrayItem('gallery', index)}>
                  <Trash2 className="mr-2 h-4 w-4 text-rose-500" /> Remove
                </Button>
              </div>
            </Card>
          ))}
          <Button variant="outline" onClick={() => addArrayItem('gallery', { id: `gal-${Date.now()}`, image: '', caption: '' } as AdminGalleryImage)}>
            <Plus className="mr-2 h-4 w-4" /> Add image
          </Button>
        </TabsContent>

        <TabsContent value="brand" className="space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Testimonials</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    testimonials: [...prev.testimonials, { quote: '', author: '' }]
                  }))
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add testimonial
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.testimonials.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Add 2-3 marquee quotes to showcase the concierge desk pedigree.
                </p>
              )}
              {content.testimonials.map((testimonial, index) => (
                <div key={`testimonial-${index}`} className="space-y-3 rounded-2xl border border-slate-200 p-4">
                  <Textarea
                    rows={3}
                    placeholder="Quote"
                    value={testimonial.quote}
                    onChange={(e) => {
                      const arr = [...content.testimonials];
                      arr[index] = { ...testimonial, quote: e.target.value };
                      setContent((prev) => ({ ...prev, testimonials: arr }));
                    }}
                  />
                  <Input
                    placeholder="Author / attribution"
                    value={testimonial.author}
                    onChange={(e) => {
                      const arr = [...content.testimonials];
                      arr[index] = { ...testimonial, author: e.target.value };
                      setContent((prev) => ({ ...prev, testimonials: arr }));
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const arr = content.testimonials.filter((_, i) => i !== index);
                      setContent((prev) => ({ ...prev, testimonials: arr }));
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4 text-rose-500" /> Remove
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Partner logos / brands</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setContent((prev) => ({ ...prev, partners: [...prev.partners, ''] }))}>
                <Plus className="mr-2 h-4 w-4" /> Add partner
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.partners.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  List the yacht builders, aviation partners, or hospitality houses you collaborate with.
                </p>
              )}
              {content.partners.map((partner, index) => (
                <div key={`partner-${index}`} className="flex gap-3">
                  <Input
                    placeholder="Partner name"
                    value={partner}
                    onChange={(e) => {
                      const arr = [...content.partners];
                      arr[index] = e.target.value;
                      setContent((prev) => ({ ...prev, partners: arr }));
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const arr = content.partners.filter((_, i) => i !== index);
                      setContent((prev) => ({ ...prev, partners: arr }));
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-rose-500" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          {content.faqs.map((faq, index) => (
            <Card key={faq.id}>
              <CardContent className="space-y-3 p-4">
                <Input placeholder="Question" value={faq.question} onChange={(e) => updateArray('faqs', index, { ...faq, question: e.target.value })} />
                <Textarea rows={2} placeholder="Answer" value={faq.answer} onChange={(e) => updateArray('faqs', index, { ...faq, answer: e.target.value })} />
                <Button variant="ghost" size="sm" onClick={() => removeArrayItem('faqs', index)}>
                  <Trash2 className="mr-2 h-4 w-4 text-rose-500" /> Remove
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" onClick={() => addArrayItem('faqs', { id: `faq-${Date.now()}`, question: '', answer: '' } as AdminFAQEntry)}>
            <Plus className="mr-2 h-4 w-4" /> Add FAQ
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="SEO title" value={content.seo.title} onChange={(e) => setContent((prev) => ({ ...prev, seo: { ...prev.seo, title: e.target.value } }))} />
              <Textarea rows={2} placeholder="SEO description" value={content.seo.description} onChange={(e) => setContent((prev) => ({ ...prev, seo: { ...prev.seo, description: e.target.value } }))} />
              <Textarea
                rows={2}
                placeholder="Keywords (comma separated)"
                value={content.seo.keywords.join(', ')}
                onChange={(e) => setContent((prev) => ({ ...prev, seo: { ...prev.seo, keywords: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) } }))}
              />
              <Input placeholder="OG image URL" value={content.seo.ogImage} onChange={(e) => setContent((prev) => ({ ...prev, seo: { ...prev.seo, ogImage: e.target.value } }))} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrivateChartersManager;
