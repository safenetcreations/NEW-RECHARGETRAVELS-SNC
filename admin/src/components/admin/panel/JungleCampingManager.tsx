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
import { useToast } from '@/hooks/use-toast';
import {
  AdminCampingEssentialCategory,
  AdminCampingPackage,
  AdminFaq,
  AdminGalleryImage,
  AdminJungleCampingContent,
  AdminStat,
  AdminOverviewHighlight,
  AdminWildlifeSpotting,
  defaultJungleCampingAdminContent,
  jungleCampingAdminService
} from '@/services/jungleCampingAdminService';
import ImageUpload from '@/components/ui/image-upload';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';

const listToMultiline = (items: string[]) => items.join('\n');
const multilineToList = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const JungleCampingManager = () => {
  const [content, setContent] = useState<AdminJungleCampingContent>(defaultJungleCampingAdminContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await jungleCampingAdminService.getContent();
        setContent(data);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Failed to load jungle content',
          description: 'Unable to fetch jungle camping data from Firestore.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [toast]);

  const updateContent = <K extends keyof AdminJungleCampingContent>(
    key: K,
    value: AdminJungleCampingContent[K]
  ) => {
    setContent((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const updateArrayItem = <T,>(array: T[], index: number, value: Partial<T>, cb: (next: T[]) => void) => {
    const clone = [...array];
    clone[index] = { ...clone[index], ...value };
    cb(clone);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await jungleCampingAdminService.saveContent(content);
      toast({ title: 'Saved', description: 'Jungle camping page updated successfully.' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Save failed',
        description: 'Could not persist the latest jungle camping changes.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-lg border border-dashed p-6 text-sm text-slate-500">Loading jungle camping data…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Jungle Camping Management</h1>
          <p className="text-sm text-muted-foreground">
            Control the hero slider, camp styles, wildlife blocks, logistics, gallery, and booking form for the jungle camping experience page.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setContent(defaultJungleCampingAdminContent)}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reset to defaults
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="camps">Camp styles</TabsTrigger>
          <TabsTrigger value="wildlife">Wildlife</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="booking">Booking & Pricing</TabsTrigger>
          <TabsTrigger value="faq">FAQ & CTA</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Hero */}
        <TabsContent value="hero" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero headline</CardTitle>
              <CardDescription>Controls the hero title, badge, and CTA button.</CardDescription>
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
                <Label>Badge</Label>
                <Input
                  value={content.hero.badge}
                  onChange={(e) => updateContent('hero', { ...content.hero, badge: e.target.value })}
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
                <Label>Primary button label</Label>
                <Input
                  value={content.hero.ctaText}
                  onChange={(e) => updateContent('hero', { ...content.hero, ctaText: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Hero slides</CardTitle>
                <CardDescription>Images rotate every 6 seconds on the public hero.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => updateContent('hero', { ...content.hero, images: [...content.hero.images, { id: crypto.randomUUID(), url: '', caption: '', tag: '' }] })}>
                <Plus className="mr-2 h-4 w-4" /> Add slide
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.hero.images.map((slide, index) => (
                <Card key={slide.id} className="border border-dashed">
                  <CardHeader className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="text-base">Slide {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-500 hover:text-rose-600"
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
                          value={slide.url}
                          folder="jungle-camping/hero"
                          onChange={(url) =>
                            updateContent('hero', {
                              ...content.hero,
                              images: content.hero.images.map((img, i) => (i === index ? { ...img, url } : img))
                            })
                          }
                          onRemove={() =>
                            updateContent('hero', {
                              ...content.hero,
                              images: content.hero.images.map((img, i) => (i === index ? { ...img, url: '' } : img))
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
                            images: content.hero.images.map((img, i) =>
                              i === index ? { ...img, caption: e.target.value } : img
                            )
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tag (optional)</Label>
                      <Input
                        value={slide.tag ?? ''}
                        onChange={(e) =>
                          updateContent('hero', {
                            ...content.hero,
                            images: content.hero.images.map((img, i) =>
                              i === index ? { ...img, tag: e.target.value } : img
                            )
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              {content.hero.images.length === 0 && (
                <p className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                  No slides yet. Click “Add slide” to upload imagery.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview */}
        <TabsContent value="overview" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview copy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Section title</Label>
                <Input
                  value={content.overview.title}
                  onChange={(e) => updateContent('overview', { ...content.overview, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Intro paragraph</Label>
                <Textarea
                  rows={3}
                  value={content.overview.description}
                  onChange={(e) =>
                    updateContent('overview', { ...content.overview, description: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Highlights</CardTitle>
                <CardDescription>Displayed as cards under the overview paragraph.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('overview', {
                    ...content.overview,
                    highlights: [
                      ...content.overview.highlights,
                      { id: crypto.randomUUID(), label: '', description: '' }
                    ]
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
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={highlight.label}
                        onChange={(e) =>
                          updateArrayItem<AdminOverviewHighlight>(
                            content.overview.highlights,
                            index,
                            { label: e.target.value },
                            (next) => updateContent('overview', { ...content.overview, highlights: next })
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={2}
                        value={highlight.description}
                        onChange={(e) =>
                          updateArrayItem<AdminOverviewHighlight>(
                            content.overview.highlights,
                            index,
                            { description: e.target.value },
                            (next) => updateContent('overview', { ...content.overview, highlights: next })
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
              {content.overview.highlights.length === 0 && (
                <p className="text-sm text-muted-foreground">No highlight cards configured yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats */}
        <TabsContent value="stats" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Stat chips</CardTitle>
                <CardDescription>These appear under the hero on the live page.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('stats', [
                    ...content.stats,
                    { id: crypto.randomUUID(), iconName: 'Star', label: '', value: '' }
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add stat
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.stats.map((stat, index) => (
                <div key={stat.id} className="grid gap-3 rounded-2xl border border-dashed p-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) =>
                        updateArrayItem<AdminStat>(
                          content.stats,
                          index,
                          { label: e.target.value },
                          (next) => updateContent('stats', next)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) =>
                        updateArrayItem<AdminStat>(
                          content.stats,
                          index,
                          { value: e.target.value },
                          (next) => updateContent('stats', next)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon name</Label>
                    <Input
                      value={stat.iconName}
                      onChange={(e) =>
                        updateArrayItem<AdminStat>(
                          content.stats,
                          index,
                          { iconName: e.target.value },
                          (next) => updateContent('stats', next)
                        )
                      }
                      placeholder="Tent, Leaf, Shield…"
                    />
                  </div>
                  <div className="flex items-end justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-500"
                      onClick={() =>
                        updateContent('stats', content.stats.filter((_, i) => i !== index))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {content.stats.length === 0 && (
                <p className="text-sm text-muted-foreground">No stats configured yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Camp styles */}
        <TabsContent value="camps" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Camp styles</CardTitle>
                <CardDescription>Shown as the featured camp cards section.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('campingPackages', [
                    ...content.campingPackages,
                    {
                      id: crypto.randomUUID(),
                      name: '',
                      duration: '',
                      priceLabel: '',
                      summary: '',
                      highlights: [],
                      included: [],
                      iconName: 'Tent',
                      difficulty: 'Easy',
                      image: '',
                      startLocation: '',
                      transportNote: ''
                    }
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add camp
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.campingPackages.map((pkg, index) => (
                <Card key={pkg.id} className="border border-dashed">
                  <CardHeader className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="text-lg">{pkg.name || `Camp ${index + 1}`}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-500"
                      onClick={() =>
                        updateContent(
                          'campingPackages',
                          content.campingPackages.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={pkg.name}
                          onChange={(e) =>
                            updateArrayItem<AdminCampingPackage>(
                              content.campingPackages,
                              index,
                              { name: e.target.value },
                              (next) => updateContent('campingPackages', next)
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration / location</Label>
                        <Input
                          value={pkg.duration}
                          onChange={(e) =>
                            updateArrayItem<AdminCampingPackage>(
                              content.campingPackages,
                              index,
                              { duration: e.target.value },
                              (next) => updateContent('campingPackages', next)
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price label</Label>
                        <Input
                          value={pkg.priceLabel}
                          onChange={(e) =>
                            updateArrayItem<AdminCampingPackage>(
                              content.campingPackages,
                              index,
                              { priceLabel: e.target.value },
                              (next) => updateContent('campingPackages', next)
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Difficulty</Label>
                        <Input
                          value={pkg.difficulty}
                          onChange={(e) =>
                            updateArrayItem<AdminCampingPackage>(
                              content.campingPackages,
                              index,
                              { difficulty: e.target.value },
                              (next) => updateContent('campingPackages', next)
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon name</Label>
                        <Input
                          value={pkg.iconName}
                          onChange={(e) =>
                            updateArrayItem<AdminCampingPackage>(
                              content.campingPackages,
                              index,
                              { iconName: e.target.value },
                              (next) => updateContent('campingPackages', next)
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start location</Label>
                        <Input
                          value={pkg.startLocation}
                          onChange={(e) =>
                            updateArrayItem<AdminCampingPackage>(
                              content.campingPackages,
                              index,
                              { startLocation: e.target.value },
                              (next) => updateContent('campingPackages', next)
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Transport note</Label>
                      <Textarea
                        rows={2}
                        value={pkg.transportNote}
                        onChange={(e) =>
                          updateArrayItem<AdminCampingPackage>(
                            content.campingPackages,
                            index,
                            { transportNote: e.target.value },
                            (next) => updateContent('campingPackages', next)
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Summary</Label>
                      <Textarea
                        rows={3}
                        value={pkg.summary}
                        onChange={(e) =>
                          updateArrayItem<AdminCampingPackage>(
                            content.campingPackages,
                            index,
                            { summary: e.target.value },
                            (next) => updateContent('campingPackages', next)
                          )
                        }
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Highlights (one per line)</Label>
                        <Textarea
                          rows={4}
                          value={listToMultiline(pkg.highlights)}
                          onChange={(e) =>
                            updateArrayItem<AdminCampingPackage>(
                              content.campingPackages,
                              index,
                              { highlights: multilineToList(e.target.value) },
                              (next) => updateContent('campingPackages', next)
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Included (one per line)</Label>
                        <Textarea
                          rows={4}
                          value={listToMultiline(pkg.included)}
                          onChange={(e) =>
                            updateArrayItem<AdminCampingPackage>(
                              content.campingPackages,
                              index,
                              { included: multilineToList(e.target.value) },
                              (next) => updateContent('campingPackages', next)
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Hero image</Label>
                      <ImageUpload
                        value={pkg.image}
                        folder="jungle-camping/camps"
                        onChange={(url) =>
                          updateArrayItem<AdminCampingPackage>(
                            content.campingPackages,
                            index,
                            { image: url },
                            (next) => updateContent('campingPackages', next)
                          )
                        }
                        onRemove={() =>
                          updateArrayItem<AdminCampingPackage>(
                            content.campingPackages,
                            index,
                            { image: '' },
                            (next) => updateContent('campingPackages', next)
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              {content.campingPackages.length === 0 && (
                <p className="text-sm text-muted-foreground">No camp styles configured yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wildlife */}
        <TabsContent value="wildlife" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Wildlife encounters</CardTitle>
                <CardDescription>Used in the wildlife callouts grid.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('wildlifeSpottings', [
                    ...content.wildlifeSpottings,
                    {
                      id: crypto.randomUUID(),
                      animal: '',
                      bestTime: '',
                      frequency: 'Regular',
                      description: ''
                    }
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add highlight
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.wildlifeSpottings.map((spotting, index) => (
                <div key={spotting.id} className="rounded-2xl border border-dashed p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{spotting.animal || `Species ${index + 1}`}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-500"
                      onClick={() =>
                        updateContent(
                          'wildlifeSpottings',
                          content.wildlifeSpottings.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Animal</Label>
                      <Input
                        value={spotting.animal}
                        onChange={(e) =>
                          updateArrayItem<AdminWildlifeSpotting>(
                            content.wildlifeSpottings,
                            index,
                            { animal: e.target.value },
                            (next) => updateContent('wildlifeSpottings', next)
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Best time</Label>
                      <Input
                        value={spotting.bestTime}
                        onChange={(e) =>
                          updateArrayItem<AdminWildlifeSpotting>(
                            content.wildlifeSpottings,
                            index,
                            { bestTime: e.target.value },
                            (next) => updateContent('wildlifeSpottings', next)
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Input
                        value={spotting.frequency}
                        onChange={(e) =>
                          updateArrayItem<AdminWildlifeSpotting>(
                            content.wildlifeSpottings,
                            index,
                            { frequency: e.target.value as AdminWildlifeSpotting['frequency'] },
                            (next) => updateContent('wildlifeSpottings', next)
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={2}
                        value={spotting.description}
                        onChange={(e) =>
                          updateArrayItem<AdminWildlifeSpotting>(
                            content.wildlifeSpottings,
                            index,
                            { description: e.target.value },
                            (next) => updateContent('wildlifeSpottings', next)
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
              {content.wildlifeSpottings.length === 0 && (
                <p className="text-sm text-muted-foreground">No wildlife items added yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logistics */}
        <TabsContent value="logistics" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logistics content</CardTitle>
              <CardDescription>Displayed in the “Everything dialed in” section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Meeting point</Label>
                <Textarea
                  rows={2}
                  value={content.logistics.meetingPoint}
                  onChange={(e) =>
                    updateContent('logistics', { ...content.logistics, meetingPoint: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Stay length note</Label>
                  <Input
                    value={content.logistics.stayLength}
                    onChange={(e) =>
                      updateContent('logistics', { ...content.logistics, stayLength: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Transfer note</Label>
                  <Input
                    value={content.logistics.transferNote}
                    onChange={(e) =>
                      updateContent('logistics', { ...content.logistics, transferNote: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Base camp description</Label>
                <Textarea
                  rows={2}
                  value={content.logistics.baseCampDescription}
                  onChange={(e) =>
                    updateContent('logistics', {
                      ...content.logistics,
                      baseCampDescription: e.target.value
                    })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start windows (one per line)</Label>
                  <Textarea
                    rows={3}
                    value={listToMultiline(content.logistics.startWindows)}
                    onChange={(e) =>
                      updateContent('logistics', {
                        ...content.logistics,
                        startWindows: multilineToList(e.target.value)
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Amenities (one per line)</Label>
                  <Textarea
                    rows={3}
                    value={listToMultiline(content.logistics.amenities)}
                    onChange={(e) =>
                      updateContent('logistics', {
                        ...content.logistics,
                        amenities: multilineToList(e.target.value)
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Packing list (one per line)</Label>
                  <Textarea
                    rows={3}
                    value={listToMultiline(content.logistics.packingList)}
                    onChange={(e) =>
                      updateContent('logistics', {
                        ...content.logistics,
                        packingList: multilineToList(e.target.value)
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Weather note</Label>
                  <Textarea
                    rows={3}
                    value={content.logistics.weatherNote}
                    onChange={(e) =>
                      updateContent('logistics', {
                        ...content.logistics,
                        weatherNote: e.target.value
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Essentials cards</CardTitle>
                <CardDescription>Used for the “What to pack / we provide” grid.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('campingEssentials', [
                    ...content.campingEssentials,
                    { id: crypto.randomUUID(), category: '', iconName: 'Backpack', items: [] }
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add category
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.campingEssentials.map((item, index) => (
                <div key={item.id} className="rounded-2xl border border-dashed p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.category || `Category ${index + 1}`}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-500"
                      onClick={() =>
                        updateContent(
                          'campingEssentials',
                          content.campingEssentials.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Category label</Label>
                      <Input
                        value={item.category}
                        onChange={(e) =>
                          updateArrayItem<AdminCampingEssentialCategory>(
                            content.campingEssentials,
                            index,
                            { category: e.target.value },
                            (next) => updateContent('campingEssentials', next)
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon name</Label>
                      <Input
                        value={item.iconName}
                        onChange={(e) =>
                          updateArrayItem<AdminCampingEssentialCategory>(
                            content.campingEssentials,
                            index,
                            { iconName: e.target.value },
                            (next) => updateContent('campingEssentials', next)
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Items (one per line)</Label>
                    <Textarea
                      rows={3}
                      value={listToMultiline(item.items)}
                      onChange={(e) =>
                        updateArrayItem<AdminCampingEssentialCategory>(
                          content.campingEssentials,
                          index,
                          { items: multilineToList(e.target.value) },
                          (next) => updateContent('campingEssentials', next)
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              {content.campingEssentials.length === 0 && (
                <p className="text-sm text-muted-foreground">No essentials listed yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gallery */}
        <TabsContent value="gallery" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Gallery items</CardTitle>
                <CardDescription>Used in the photo grid above the booking form.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('gallery', [
                    ...content.gallery,
                    { id: crypto.randomUUID(), url: '', alt: '' }
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add image
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.gallery.map((image, index) => (
                <div key={image.id} className="grid gap-4 rounded-2xl border border-dashed p-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Image</Label>
                    <ImageUpload
                      value={image.url}
                      folder="jungle-camping/gallery"
                      onChange={(url) =>
                        updateArrayItem<AdminGalleryImage>(
                          content.gallery,
                          index,
                          { url },
                          (next) => updateContent('gallery', next)
                        )
                      }
                      onRemove={() =>
                        updateArrayItem<AdminGalleryImage>(
                          content.gallery,
                          index,
                          { url: '' },
                          (next) => updateContent('gallery', next)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Caption / alt text</Label>
                    <Input
                      value={image.alt}
                      onChange={(e) =>
                        updateArrayItem<AdminGalleryImage>(
                          content.gallery,
                          index,
                          { alt: e.target.value },
                          (next) => updateContent('gallery', next)
                        )
                      }
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-500"
                      onClick={() =>
                        updateContent('gallery', content.gallery.filter((_, i) => i !== index))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {content.gallery.length === 0 && (
                <p className="text-sm text-muted-foreground">No gallery images added yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking & pricing */}
        <TabsContent value="booking" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Concierge contact</CardTitle>
              <CardDescription>Controls the left column of the booking section.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Concierge note</Label>
                <Textarea
                  rows={3}
                  value={content.booking.conciergeNote}
                  onChange={(e) =>
                    updateContent('booking', { ...content.booking, conciergeNote: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Response time</Label>
                <Input
                  value={content.booking.responseTime}
                  onChange={(e) =>
                    updateContent('booking', { ...content.booking, responseTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp link</Label>
                <Input
                  value={content.booking.whatsapp}
                  onChange={(e) =>
                    updateContent('booking', { ...content.booking, whatsapp: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Contact phone</Label>
                <Input
                  value={content.booking.contactPhone}
                  onChange={(e) =>
                    updateContent('booking', { ...content.booking, contactPhone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={content.booking.email}
                  onChange={(e) =>
                    updateContent('booking', { ...content.booking, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Deposit note</Label>
                <Textarea
                  rows={2}
                  value={content.booking.depositNote}
                  onChange={(e) =>
                    updateContent('booking', { ...content.booking, depositNote: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Included bullets (one per line)</Label>
                <Textarea
                  rows={3}
                  value={listToMultiline(content.booking.priceIncludes)}
                  onChange={(e) =>
                    updateContent('booking', {
                      ...content.booking,
                      priceIncludes: multilineToList(e.target.value)
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing sidebar</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input
                  value={content.pricing.currency}
                  onChange={(e) =>
                    updateContent('pricing', { ...content.pricing, currency: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Starting price</Label>
                <Input
                  type="number"
                  value={content.pricing.startingPrice}
                  onChange={(e) =>
                    updateContent('pricing', {
                      ...content.pricing,
                      startingPrice: Number(e.target.value)
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Teen discount (%)</Label>
                <Input
                  type="number"
                  value={content.pricing.teenDiscountPercent}
                  onChange={(e) =>
                    updateContent('pricing', {
                      ...content.pricing,
                      teenDiscountPercent: Number(e.target.value)
                    })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Private camp surcharge text</Label>
                <Input
                  value={content.pricing.privateCampSurcharge}
                  onChange={(e) =>
                    updateContent('pricing', {
                      ...content.pricing,
                      privateCampSurcharge: e.target.value
                    })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Add-ons (one per line)</Label>
                <Textarea
                  rows={3}
                  value={listToMultiline(content.pricing.addOns)}
                  onChange={(e) =>
                    updateContent('pricing', {
                      ...content.pricing,
                      addOns: multilineToList(e.target.value)
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ + CTA */}
        <TabsContent value="faq" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>FAQ items</CardTitle>
                <CardDescription>Rendered in the accordion near the bottom.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateContent('faqs', [
                    ...content.faqs,
                    { id: crypto.randomUUID(), question: '', answer: '' }
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add FAQ
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.faqs.map((faq, index) => (
                <div key={faq.id} className="rounded-2xl border border-dashed p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{faq.question || `Question ${index + 1}`}</p>
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
                      onChange={(e) =>
                        updateArrayItem<AdminFaq>(
                          content.faqs,
                          index,
                          { question: e.target.value },
                          (next) => updateContent('faqs', next)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Answer</Label>
                    <Textarea
                      rows={3}
                      value={faq.answer}
                      onChange={(e) =>
                        updateArrayItem<AdminFaq>(
                          content.faqs,
                          index,
                          { answer: e.target.value },
                          (next) => updateContent('faqs', next)
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              {content.faqs.length === 0 && (
                <p className="text-sm text-muted-foreground">No FAQs configured.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CTA banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content.cta.title}
                  onChange={(e) => updateContent('cta', { ...content.cta, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={content.cta.description}
                  onChange={(e) =>
                    updateContent('cta', { ...content.cta, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Primary button</Label>
                  <Input
                    value={content.cta.primaryButtonText}
                    onChange={(e) =>
                      updateContent('cta', { ...content.cta, primaryButtonText: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary button</Label>
                  <Input
                    value={content.cta.secondaryButtonText}
                    onChange={(e) =>
                      updateContent('cta', { ...content.cta, secondaryButtonText: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO & contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>SEO title</Label>
                <Input
                  value={content.seo.title}
                  onChange={(e) => updateContent('seo', { ...content.seo, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>SEO description</Label>
                <Textarea
                  rows={2}
                  value={content.seo.description}
                  onChange={(e) =>
                    updateContent('seo', { ...content.seo, description: e.target.value })
                  }
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
                      keywords: e.target.value
                        .split(',')
                        .map((keyword) => keyword.trim())
                        .filter(Boolean)
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>OG image URL</Label>
                <Input
                  value={content.seo.ogImage}
                  onChange={(e) => updateContent('seo', { ...content.seo, ogImage: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Contact phone</Label>
                  <Input
                    value={content.contact.phone}
                    onChange={(e) =>
                      updateContent('contact', { ...content.contact, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone note</Label>
                  <Input
                    value={content.contact.phoneNote}
                    onChange={(e) =>
                      updateContent('contact', { ...content.contact, phoneNote: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={content.contact.email}
                    onChange={(e) =>
                      updateContent('contact', { ...content.contact, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email note</Label>
                  <Input
                    value={content.contact.emailNote}
                    onChange={(e) =>
                      updateContent('contact', { ...content.contact, emailNote: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={content.contact.website}
                    onChange={(e) =>
                      updateContent('contact', { ...content.contact, website: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website note</Label>
                  <Input
                    value={content.contact.websiteNote}
                    onChange={(e) =>
                      updateContent('contact', { ...content.contact, websiteNote: e.target.value })
                    }
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

export default JungleCampingManager;

