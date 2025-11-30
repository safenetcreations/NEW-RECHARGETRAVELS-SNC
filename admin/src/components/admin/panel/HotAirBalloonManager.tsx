import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ui/image-upload';
import {
  AdminHotAirBalloonContent,
  defaultHotAirBalloonAdminContent,
  hotAirBalloonSigiriyaAdminService
} from '@/services/hotAirBalloonSigiriyaAdminService';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';

const listToMultiline = (items: string[]) => items.join('\n');
const multilineToList = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const HotAirBalloonManager = () => {
  const [content, setContent] = useState<AdminHotAirBalloonContent>(defaultHotAirBalloonAdminContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await hotAirBalloonSigiriyaAdminService.getContent();
        setContent(data);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Failed to load',
          description: 'Unable to fetch hot air balloon content.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [toast]);

  const updateContent = <K extends keyof AdminHotAirBalloonContent>(key: K, value: AdminHotAirBalloonContent[K]) => {
    setContent((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await hotAirBalloonSigiriyaAdminService.saveContent(content);
      toast({ title: 'Saved', description: 'Hot air balloon content updated.' });
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

  const updateArrayItem = <T,>(items: T[], index: number, value: Partial<T>, cb: (next: T[]) => void) => {
    const clone = [...items];
    clone[index] = { ...clone[index], ...value };
    cb(clone);
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading hot air balloon CMS…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Hot Air Balloon Sigiriya</h1>
          <p className="text-sm text-muted-foreground">
            Manage hero slides, flight packages, logistics, gallery, and booking copy for the ballooning page.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setContent(defaultHotAirBalloonAdminContent)}>
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
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="journey">Journey</TabsTrigger>
          <TabsTrigger value="operator">Operator</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="booking">Booking & Pricing</TabsTrigger>
          <TabsTrigger value="faq">FAQ & CTA</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero content</CardTitle>
              <CardDescription>Controls the hero copy and CTA button.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input value={content.hero.badge} onChange={(e) => updateContent('hero', { ...content.hero, badge: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={content.hero.title} onChange={(e) => updateContent('hero', { ...content.hero, title: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Subtitle</Label>
                <Textarea rows={2} value={content.hero.subtitle} onChange={(e) => updateContent('hero', { ...content.hero, subtitle: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>CTA text</Label>
                <Input value={content.hero.ctaText} onChange={(e) => updateContent('hero', { ...content.hero, ctaText: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Hero slides</CardTitle>
                <CardDescription>Images rotate in the hero background.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('hero', {
                    ...content.hero,
                    images: [...content.hero.images, { id: crypto.randomUUID(), image: '', caption: '', tag: '' }]
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add slide
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.hero.images.map((slide, index) => (
                <Card key={slide.id} className="border border-dashed">
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-base">Slide {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-500"
                      onClick={() =>
                        updateContent('hero', {
                          ...content.hero,
                          images: content.hero.images.filter((_, i) => i !== index)
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Label>Image</Label>
                      <div className="mt-2">
                        <ImageUpload
                          value={slide.image}
                          folder="hot-air-balloon/hero"
                          onChange={(url) =>
                            updateContent('hero', {
                              ...content.hero,
                              images: content.hero.images.map((img, i) => (i === index ? { ...img, image: url } : img))
                            })
                          }
                          onRemove={() =>
                            updateContent('hero', {
                              ...content.hero,
                              images: content.hero.images.map((img, i) => (i === index ? { ...img, image: '' } : img))
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Caption</Label>
                      <Input
                        value={slide.caption}
                        onChange={(e) =>
                          updateContent('hero', {
                            ...content.hero,
                            images: content.hero.images.map((img, i) => (i === index ? { ...img, caption: e.target.value } : img))
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tag</Label>
                      <Input
                        value={slide.tag ?? ''}
                        onChange={(e) =>
                          updateContent('hero', {
                            ...content.hero,
                            images: content.hero.images.map((img, i) => (i === index ? { ...img, tag: e.target.value } : img))
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              {content.hero.images.length === 0 && <p className="text-sm text-muted-foreground">No hero slides yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={3}
                value={content.overview.summary}
                onChange={(e) => updateContent('overview', { ...content.overview, summary: e.target.value })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Highlights</CardTitle>
                <CardDescription>Appears next to the overview paragraph.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('overview', {
                    ...content.overview,
                    highlights: [...content.overview.highlights, { id: crypto.randomUUID(), label: '', description: '' }]
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add highlight
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.overview.highlights.map((highlight, index) => (
                <div key={highlight.id} className="rounded-2xl border border-dashed p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Highlight {index + 1}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-500"
                      onClick={() =>
                        updateContent('overview', {
                          ...content.overview,
                          highlights: content.overview.highlights.filter((_, i) => i !== index)
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={highlight.label}
                      onChange={(e) =>
                        updateArrayItem(content.overview.highlights, index, { label: e.target.value }, (next) =>
                          updateContent('overview', { ...content.overview, highlights: next })
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      rows={2}
                      value={highlight.description}
                      onChange={(e) =>
                        updateArrayItem(content.overview.highlights, index, { description: e.target.value }, (next) =>
                          updateContent('overview', { ...content.overview, highlights: next })
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Stat chips</CardTitle>
                <CardDescription>Used below the hero headline.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('stats', [
                    ...content.stats,
                    { id: crypto.randomUUID(), iconName: 'Navigation', label: '', value: '' }
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add stat
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.stats.map((stat, index) => (
                <div key={stat.id} className="grid gap-3 md:grid-cols-4">
                  <Input
                    value={stat.label}
                    onChange={(e) => updateArrayItem(content.stats, index, { label: e.target.value }, (next) => updateContent('stats', next))}
                    placeholder="Label"
                  />
                  <Input
                    value={stat.value}
                    onChange={(e) => updateArrayItem(content.stats, index, { value: e.target.value }, (next) => updateContent('stats', next))}
                    placeholder="Value"
                  />
                  <Input
                    value={stat.iconName}
                    onChange={(e) => updateArrayItem(content.stats, index, { iconName: e.target.value }, (next) => updateContent('stats', next))}
                    placeholder="Icon name"
                  />
                  <Button
                    variant="ghost"
                    className="text-rose-500"
                    onClick={() => updateContent('stats', content.stats.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Flight packages</CardTitle>
                <CardDescription>Featured cards on the public page.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('packages', [
                    ...content.packages,
                    {
                      id: crypto.randomUUID(),
                      name: '',
                      duration: '',
                      priceLabel: '',
                      bestFor: '',
                      iconName: 'Sunrise',
                      image: '',
                      highlights: [],
                      included: []
                    }
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add package
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.packages.map((pkg, index) => (
                <Card key={pkg.id} className="border border-dashed">
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pkg.name || `Package ${index + 1}`}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-500"
                      onClick={() => updateContent('packages', content.packages.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={pkg.name}
                          onChange={(e) => updateArrayItem(content.packages, index, { name: e.target.value }, (next) => updateContent('packages', next))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          value={pkg.duration}
                          onChange={(e) => updateArrayItem(content.packages, index, { duration: e.target.value }, (next) => updateContent('packages', next))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price label</Label>
                        <Input
                          value={pkg.priceLabel}
                          onChange={(e) => updateArrayItem(content.packages, index, { priceLabel: e.target.value }, (next) => updateContent('packages', next))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Best for</Label>
                        <Input
                          value={pkg.bestFor}
                          onChange={(e) => updateArrayItem(content.packages, index, { bestFor: e.target.value }, (next) => updateContent('packages', next))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon name</Label>
                        <Input
                          value={pkg.iconName}
                          onChange={(e) => updateArrayItem(content.packages, index, { iconName: e.target.value }, (next) => updateContent('packages', next))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Highlights (one per line)</Label>
                      <Textarea
                        rows={3}
                        value={listToMultiline(pkg.highlights)}
                        onChange={(e) => updateArrayItem(content.packages, index, { highlights: multilineToList(e.target.value) }, (next) => updateContent('packages', next))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Included (one per line)</Label>
                      <Textarea
                        rows={3}
                        value={listToMultiline(pkg.included)}
                        onChange={(e) => updateArrayItem(content.packages, index, { included: multilineToList(e.target.value) }, (next) => updateContent('packages', next))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image</Label>
                      <ImageUpload
                        value={pkg.image}
                        folder="hot-air-balloon/packages"
                        onChange={(url) => updateArrayItem(content.packages, index, { image: url }, (next) => updateContent('packages', next))}
                        onRemove={() => updateArrayItem(content.packages, index, { image: '' }, (next) => updateContent('packages', next))}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journey" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Journey timeline</CardTitle>
                <CardDescription>Shown as the numbered timeline on the public page.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('journey', [
                    ...content.journey,
                    { id: crypto.randomUUID(), title: '', duration: '', description: '' }
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add stage
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.journey.map((stage, index) => (
                <div key={stage.id} className="rounded-2xl border border-dashed p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Stage {index + 1}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-500"
                      onClick={() => updateContent('journey', content.journey.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={stage.title}
                        onChange={(e) => updateArrayItem(content.journey, index, { title: e.target.value }, (next) => updateContent('journey', next))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input
                        value={stage.duration}
                        onChange={(e) => updateArrayItem(content.journey, index, { duration: e.target.value }, (next) => updateContent('journey', next))}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={2}
                        value={stage.description}
                        onChange={(e) => updateArrayItem(content.journey, index, { description: e.target.value }, (next) => updateContent('journey', next))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operator" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operator details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={content.operator.name}
                    onChange={(e) => updateContent('operator', { ...content.operator, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={content.operator.rating}
                    onChange={(e) => updateContent('operator', { ...content.operator, rating: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reviews count</Label>
                  <Input
                    type="number"
                    value={content.operator.reviews}
                    onChange={(e) => updateContent('operator', { ...content.operator, reviews: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Support hours</Label>
                  <Input
                    value={content.operator.supportHours}
                    onChange={(e) => updateContent('operator', { ...content.operator, supportHours: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={content.operator.description}
                  onChange={(e) => updateContent('operator', { ...content.operator, description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Licenses (comma separated)</Label>
                  <Textarea
                    rows={2}
                    value={content.operator.licenses.join(', ')}
                    onChange={(e) =>
                      updateContent('operator', {
                        ...content.operator,
                        licenses: e.target.value.split(',').map((item) => item.trim()).filter(Boolean)
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assurances (comma separated)</Label>
                  <Textarea
                    rows={2}
                    value={content.operator.assurances.join(', ')}
                    onChange={(e) =>
                      updateContent('operator', {
                        ...content.operator,
                        assurances: e.target.value.split(',').map((item) => item.trim()).filter(Boolean)
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Contact phone</Label>
                  <Input
                    value={content.operator.contactPhone}
                    onChange={(e) => updateContent('operator', { ...content.operator, contactPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact email</Label>
                  <Input
                    value={content.operator.contactEmail}
                    onChange={(e) => updateContent('operator', { ...content.operator, contactEmail: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logistics" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logistics + Weather</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Meeting point</Label>
                <Textarea
                  rows={2}
                  value={content.logistics.meetingPoint}
                  onChange={(e) => updateContent('logistics', { ...content.logistics, meetingPoint: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Pickup windows (one per line)</Label>
                  <Textarea
                    rows={3}
                    value={listToMultiline(content.logistics.pickupWindows)}
                    onChange={(e) => updateContent('logistics', { ...content.logistics, pickupWindows: multilineToList(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gear provided (one per line)</Label>
                  <Textarea
                    rows={3}
                    value={listToMultiline(content.logistics.gearProvided)}
                    onChange={(e) => updateContent('logistics', { ...content.logistics, gearProvided: multilineToList(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Bring along list (one per line)</Label>
                  <Textarea
                    rows={3}
                    value={listToMultiline(content.logistics.bringAlong)}
                    onChange={(e) => updateContent('logistics', { ...content.logistics, bringAlong: multilineToList(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Flight season</Label>
                  <Input
                    value={content.logistics.flightSeason}
                    onChange={(e) => updateContent('logistics', { ...content.logistics, flightSeason: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Total duration</Label>
                  <Input value={content.logistics.duration} onChange={(e) => updateContent('logistics', { ...content.logistics, duration: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Dress code</Label>
                  <Input value={content.logistics.dressCode} onChange={(e) => updateContent('logistics', { ...content.logistics, dressCode: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Weather policy</Label>
                <Textarea
                  rows={2}
                  value={content.logistics.weatherPolicy}
                  onChange={(e) => updateContent('logistics', { ...content.logistics, weatherPolicy: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Gallery</CardTitle>
                <CardDescription>Appears in the photo grid.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateContent('gallery', [...content.gallery, { id: crypto.randomUUID(), image: '', caption: '' }])}
              >
                <Plus className="mr-2 h-4 w-4" /> Add photo
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.gallery.map((image, index) => (
                <div key={image.id} className="grid gap-4 rounded-2xl border border-dashed p-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Image</Label>
                    <ImageUpload
                      value={image.image}
                      folder="hot-air-balloon/gallery"
                      onChange={(url) => updateArrayItem(content.gallery, index, { image: url }, (next) => updateContent('gallery', next))}
                      onRemove={() => updateArrayItem(content.gallery, index, { image: '' }, (next) => updateContent('gallery', next))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Caption</Label>
                    <Input
                      value={image.caption}
                      onChange={(e) => updateArrayItem(content.gallery, index, { caption: e.target.value }, (next) => updateContent('gallery', next))}
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-rose-500" onClick={() => updateContent('gallery', content.gallery.filter((_, i) => i !== index))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking & concierge</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Concierge note</Label>
                <Textarea
                  rows={3}
                  value={content.booking.conciergeNote}
                  onChange={(e) => updateContent('booking', { ...content.booking, conciergeNote: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Response time</Label>
                <Input
                  value={content.booking.responseTime}
                  onChange={(e) => updateContent('booking', { ...content.booking, responseTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Contact phone</Label>
                <Input value={content.booking.contactPhone} onChange={(e) => updateContent('booking', { ...content.booking, contactPhone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp link</Label>
                <Input value={content.booking.whatsapp} onChange={(e) => updateContent('booking', { ...content.booking, whatsapp: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={content.booking.email} onChange={(e) => updateContent('booking', { ...content.booking, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Deposit note</Label>
                <Textarea
                  rows={2}
                  value={content.booking.depositNote}
                  onChange={(e) => updateContent('booking', { ...content.booking, depositNote: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Seat hold policy</Label>
                <Textarea
                  rows={2}
                  value={content.booking.seatHoldPolicy}
                  onChange={(e) => updateContent('booking', { ...content.booking, seatHoldPolicy: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input value={content.pricing.currency} onChange={(e) => updateContent('pricing', { ...content.pricing, currency: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Starting price</Label>
                <Input
                  type="number"
                  value={content.pricing.startingPrice}
                  onChange={(e) => updateContent('pricing', { ...content.pricing, startingPrice: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Private charter price</Label>
                <Input
                  type="number"
                  value={content.pricing.privateCharterPrice}
                  onChange={(e) => updateContent('pricing', { ...content.pricing, privateCharterPrice: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Add-ons (one per line)</Label>
                <Textarea
                  rows={3}
                  value={listToMultiline(content.pricing.addOns)}
                  onChange={(e) => updateContent('pricing', { ...content.pricing, addOns: multilineToList(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>FAQs</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateContent('faqs', [...content.faqs, { id: crypto.randomUUID(), question: '', answer: '' }])}
              >
                <Plus className="mr-2 h-4 w-4" /> Add FAQ
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.faqs.map((faq, index) => (
                <div key={faq.id} className="rounded-2xl border border-dashed p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">FAQ {index + 1}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-500"
                      onClick={() => updateContent('faqs', content.faqs.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateArrayItem(content.faqs, index, { question: e.target.value }, (next) => updateContent('faqs', next))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Answer</Label>
                    <Textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => updateArrayItem(content.faqs, index, { answer: e.target.value }, (next) => updateContent('faqs', next))}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CTA banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={content.cta.title} onChange={(e) => updateContent('cta', { ...content.cta, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={content.cta.description}
                  onChange={(e) => updateContent('cta', { ...content.cta, description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Primary button text</Label>
                  <Input value={content.cta.primaryButtonText} onChange={(e) => updateContent('cta', { ...content.cta, primaryButtonText: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Secondary button text</Label>
                  <Input value={content.cta.secondaryButtonText} onChange={(e) => updateContent('cta', { ...content.cta, secondaryButtonText: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>SEO title</Label>
                <Input value={content.seo.title} onChange={(e) => updateContent('seo', { ...content.seo, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>SEO description</Label>
                <Textarea
                  rows={2}
                  value={content.seo.description}
                  onChange={(e) => updateContent('seo', { ...content.seo, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Keywords (comma separated)</Label>
                <Textarea
                  rows={2}
                  value={content.seo.keywords.join(', ')}
                  onChange={(e) =>
                    updateContent('seo', {
                      ...content.seo,
                      keywords: e.target.value.split(',').map((item) => item.trim()).filter(Boolean)
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>OG image</Label>
                <Input value={content.seo.ogImage} onChange={(e) => updateContent('seo', { ...content.seo, ogImage: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HotAirBalloonManager;
