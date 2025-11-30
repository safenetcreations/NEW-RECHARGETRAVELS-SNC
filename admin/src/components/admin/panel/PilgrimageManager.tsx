import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  Image as ImageIcon,
  Heart,
  Mountain,
  MapPin,
  Edit,
  RefreshCw
} from 'lucide-react';
import {
  pilgrimageAdminService,
  PilgrimageHeroContent,
  PilgrimageIntroContent,
  PilgrimageHighlight,
  PilgrimageSite,
  PilgrimageTour,
  PilgrimageGalleryImage,
  PilgrimageFAQ,
  PilgrimageCtaContent,
  PilgrimageTestimonial,
  PilgrimageBookingConfig,
  defaultPilgrimageHero,
  defaultPilgrimageIntro,
  defaultPilgrimageHighlights,
  defaultPilgrimageCta,
  defaultPilgrimageBooking
} from '@/services/pilgrimageAdminService';

const PilgrimageManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  // Content states
  const [hero, setHero] = useState<PilgrimageHeroContent>(defaultPilgrimageHero);
  const [intro, setIntro] = useState<PilgrimageIntroContent>(defaultPilgrimageIntro);
  const [highlights, setHighlights] = useState<PilgrimageHighlight[]>(defaultPilgrimageHighlights);
  const [sites, setSites] = useState<PilgrimageSite[]>([]);
  const [tours, setTours] = useState<PilgrimageTour[]>([]);
  const [gallery, setGallery] = useState<PilgrimageGalleryImage[]>([]);
  const [faqs, setFaqs] = useState<PilgrimageFAQ[]>([]);
  const [cta, setCta] = useState<PilgrimageCtaContent>(defaultPilgrimageCta);
  const [testimonials, setTestimonials] = useState<PilgrimageTestimonial[]>([]);
  const [booking, setBooking] = useState<PilgrimageBookingConfig>(defaultPilgrimageBooking);

  // Edit states
  const [editingSite, setEditingSite] = useState<PilgrimageSite | null>(null);
  const [editingTour, setEditingTour] = useState<PilgrimageTour | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const content = await pilgrimageAdminService.getContent();
      setHero(content.hero);
      setIntro(content.intro);
      setHighlights(content.highlights);
      setSites(content.sites);
      setTours(content.tours);
      setGallery(content.gallery);
      setFaqs(content.faqs);
      setCta(content.cta);
      setTestimonials(content.testimonials);
      setBooking(content.booking);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const saveHero = async () => {
    setSaving(true);
    try {
      await pilgrimageAdminService.saveHero(hero);
      toast.success('Hero section saved successfully');
    } catch (error) {
      toast.error('Failed to save hero section');
    } finally {
      setSaving(false);
    }
  };

  const saveIntro = async () => {
    setSaving(true);
    try {
      await pilgrimageAdminService.saveIntro(intro);
      toast.success('Introduction saved successfully');
    } catch (error) {
      toast.error('Failed to save introduction');
    } finally {
      setSaving(false);
    }
  };

  const saveHighlights = async () => {
    setSaving(true);
    try {
      await pilgrimageAdminService.saveHighlights(highlights);
      toast.success('Highlights saved successfully');
    } catch (error) {
      toast.error('Failed to save highlights');
    } finally {
      setSaving(false);
    }
  };

  const saveCta = async () => {
    setSaving(true);
    try {
      await pilgrimageAdminService.saveCta(cta);
      toast.success('CTA section saved successfully');
    } catch (error) {
      toast.error('Failed to save CTA section');
    } finally {
      setSaving(false);
    }
  };

  const saveBooking = async () => {
    setSaving(true);
    try {
      await pilgrimageAdminService.saveBookingConfig(booking);
      toast.success('Booking config saved successfully');
    } catch (error) {
      toast.error('Failed to save booking config');
    } finally {
      setSaving(false);
    }
  };

  // Tour CRUD
  const saveTour = async (tour: PilgrimageTour) => {
    setSaving(true);
    try {
      if (tour.id && tours.find(t => t.id === tour.id)) {
        await pilgrimageAdminService.updateTour(tour.id, tour);
        setTours(tours.map(t => t.id === tour.id ? tour : t));
      } else {
        const { id, ...tourData } = tour;
        const newId = await pilgrimageAdminService.addTour(tourData);
        setTours([...tours, { ...tour, id: newId }]);
      }
      setEditingTour(null);
      toast.success('Tour saved successfully');
    } catch (error) {
      toast.error('Failed to save tour');
    } finally {
      setSaving(false);
    }
  };

  const deleteTour = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;
    try {
      await pilgrimageAdminService.deleteTour(id);
      setTours(tours.filter(t => t.id !== id));
      toast.success('Tour deleted');
    } catch (error) {
      toast.error('Failed to delete tour');
    }
  };

  // Site CRUD
  const saveSite = async (site: PilgrimageSite) => {
    setSaving(true);
    try {
      if (site.id && sites.find(s => s.id === site.id)) {
        await pilgrimageAdminService.updateSite(site.id, site);
        setSites(sites.map(s => s.id === site.id ? site : s));
      } else {
        const { id, ...siteData } = site;
        const newId = await pilgrimageAdminService.addSite(siteData);
        setSites([...sites, { ...site, id: newId }]);
      }
      setEditingSite(null);
      toast.success('Site saved successfully');
    } catch (error) {
      toast.error('Failed to save site');
    } finally {
      setSaving(false);
    }
  };

  const deleteSite = async (id: string) => {
    if (!confirm('Are you sure you want to delete this site?')) return;
    try {
      await pilgrimageAdminService.deleteSite(id);
      setSites(sites.filter(s => s.id !== id));
      toast.success('Site deleted');
    } catch (error) {
      toast.error('Failed to delete site');
    }
  };

  // FAQ CRUD
  const addFaq = () => {
    const newFaq: PilgrimageFAQ = {
      id: '',
      question: '',
      answer: '',
      order: faqs.length,
      isActive: true
    };
    setFaqs([...faqs, newFaq]);
  };

  const saveFaq = async (faq: PilgrimageFAQ, index: number) => {
    setSaving(true);
    try {
      if (faq.id) {
        await pilgrimageAdminService.updateFAQ(faq.id, faq);
      } else {
        const { id, ...faqData } = faq;
        const newId = await pilgrimageAdminService.addFAQ(faqData);
        const updatedFaqs = [...faqs];
        updatedFaqs[index] = { ...faq, id: newId };
        setFaqs(updatedFaqs);
      }
      toast.success('FAQ saved');
    } catch (error) {
      toast.error('Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  const deleteFaq = async (id: string, index: number) => {
    if (!id) {
      setFaqs(faqs.filter((_, i) => i !== index));
      return;
    }
    try {
      await pilgrimageAdminService.deleteFAQ(id);
      setFaqs(faqs.filter(f => f.id !== id));
      toast.success('FAQ deleted');
    } catch (error) {
      toast.error('Failed to delete FAQ');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        <span className="ml-2">Loading Pilgrimage content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Heart className="w-6 h-6 text-amber-600" />
            Pilgrimage Tours Manager
          </h1>
          <p className="text-gray-600">Manage pilgrimage page content and tours</p>
        </div>
        <Button variant="outline" onClick={loadContent}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="tours">Tours</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
        </TabsList>

        {/* Hero Tab */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={hero.title}
                    onChange={(e) => setHero({ ...hero, title: e.target.value })}
                    placeholder="Sacred Pilgrimage Sites"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={hero.subtitle}
                    onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                    placeholder="Spiritual Journeys..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background Image URL</Label>
                <Input
                  value={hero.backgroundImage}
                  onChange={(e) => setHero({ ...hero, backgroundImage: e.target.value })}
                  placeholder="https://..."
                />
                {hero.backgroundImage && (
                  <img src={hero.backgroundImage} alt="Hero preview" className="mt-2 h-32 w-full object-cover rounded" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA Button Text</Label>
                  <Input
                    value={hero.ctaText}
                    onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                    placeholder="Begin Your Pilgrimage"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Link</Label>
                  <Input
                    value={hero.ctaLink}
                    onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })}
                    placeholder="#tours"
                  />
                </div>
              </div>
              <Button onClick={saveHero} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Hero
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Introduction Paragraph</Label>
                <Textarea
                  value={intro.introParagraph}
                  onChange={(e) => setIntro({ ...intro, introParagraph: e.target.value })}
                  rows={4}
                  placeholder="Sri Lanka is a land of profound spirituality..."
                />
              </div>
              <Button onClick={saveIntro} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Introduction
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {highlights.map((highlight, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 p-4 border rounded-lg">
                  <div className="col-span-2">
                    <Label>Icon (Emoji)</Label>
                    <Input
                      value={highlight.icon}
                      onChange={(e) => {
                        const updated = [...highlights];
                        updated[index] = { ...highlight, icon: e.target.value };
                        setHighlights(updated);
                      }}
                      placeholder="🛕"
                    />
                  </div>
                  <div className="col-span-4">
                    <Label>Title</Label>
                    <Input
                      value={highlight.title}
                      onChange={(e) => {
                        const updated = [...highlights];
                        updated[index] = { ...highlight, title: e.target.value };
                        setHighlights(updated);
                      }}
                      placeholder="Sacred Temples"
                    />
                  </div>
                  <div className="col-span-6">
                    <Label>Description</Label>
                    <Input
                      value={highlight.blurb60}
                      onChange={(e) => {
                        const updated = [...highlights];
                        updated[index] = { ...highlight, blurb60: e.target.value };
                        setHighlights(updated);
                      }}
                      placeholder="Visit ancient Buddhist temples..."
                    />
                  </div>
                </div>
              ))}
              <Button onClick={saveHighlights} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Highlights
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sites Tab */}
        <TabsContent value="sites" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sacred Sites</h3>
            <Button onClick={() => setEditingSite({
              id: '',
              name: '',
              description: '',
              location: '',
              significance: '',
              highlights: [],
              bestTime: '',
              duration: '',
              religion: '',
              image: '',
              isActive: true,
              order: sites.length
            })} className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Site
            </Button>
          </div>

          {editingSite && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle>{editingSite.id ? 'Edit Site' : 'Add New Site'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={editingSite.name}
                      onChange={(e) => setEditingSite({ ...editingSite, name: e.target.value })}
                      placeholder="Temple of the Tooth"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={editingSite.location}
                      onChange={(e) => setEditingSite({ ...editingSite, location: e.target.value })}
                      placeholder="Kandy"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editingSite.description}
                    onChange={(e) => setEditingSite({ ...editingSite, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Significance</Label>
                    <Input
                      value={editingSite.significance}
                      onChange={(e) => setEditingSite({ ...editingSite, significance: e.target.value })}
                      placeholder="UNESCO World Heritage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Religion</Label>
                    <Input
                      value={editingSite.religion}
                      onChange={(e) => setEditingSite({ ...editingSite, religion: e.target.value })}
                      placeholder="Buddhist, Hindu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      value={editingSite.duration}
                      onChange={(e) => setEditingSite({ ...editingSite, duration: e.target.value })}
                      placeholder="2-3 hours"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Best Time to Visit</Label>
                    <Input
                      value={editingSite.bestTime}
                      onChange={(e) => setEditingSite({ ...editingSite, bestTime: e.target.value })}
                      placeholder="During Puja times"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={editingSite.image || ''}
                      onChange={(e) => setEditingSite({ ...editingSite, image: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Highlights (comma-separated)</Label>
                  <Input
                    value={editingSite.highlights.join(', ')}
                    onChange={(e) => setEditingSite({ ...editingSite, highlights: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="Sacred Tooth Relic, Daily Rituals, Museum"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingSite.isActive}
                    onCheckedChange={(checked) => setEditingSite({ ...editingSite, isActive: checked })}
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => saveSite(editingSite)} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Site
                  </Button>
                  <Button variant="outline" onClick={() => setEditingSite(null)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {sites.map((site) => (
              <Card key={site.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {site.image && (
                        <img src={site.image} alt={site.name} className="w-20 h-20 object-cover rounded" />
                      )}
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {site.name}
                          {!site.isActive && <Badge variant="secondary">Inactive</Badge>}
                        </h4>
                        <p className="text-sm text-gray-600">{site.location} • {site.duration}</p>
                        <p className="text-sm text-gray-500">{site.religion}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingSite(site)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteSite(site.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tours Tab */}
        <TabsContent value="tours" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Pilgrimage Tours</h3>
            <Button onClick={() => setEditingTour({
              id: '',
              title: '',
              thumbnail: '',
              badges: [],
              duration: '',
              salePriceUSD: 0,
              highlights: [],
              included: [],
              type: 'Buddhist',
              isPublished: true,
              order: tours.length
            })} className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Tour
            </Button>
          </div>

          {editingTour && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle>{editingTour.id ? 'Edit Tour' : 'Add New Tour'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editingTour.title}
                      onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })}
                      placeholder="Buddhist Heritage Circuit"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      value={editingTour.duration}
                      onChange={(e) => setEditingTour({ ...editingTour, duration: e.target.value })}
                      placeholder="5 Days / 4 Nights"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Sale Price (USD)</Label>
                    <Input
                      type="number"
                      value={editingTour.salePriceUSD}
                      onChange={(e) => setEditingTour({ ...editingTour, salePriceUSD: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Regular Price (USD)</Label>
                    <Input
                      type="number"
                      value={editingTour.regularPriceUSD || ''}
                      onChange={(e) => setEditingTour({ ...editingTour, regularPriceUSD: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Input
                      value={editingTour.type}
                      onChange={(e) => setEditingTour({ ...editingTour, type: e.target.value })}
                      placeholder="Buddhist / Multi-faith"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Thumbnail URL</Label>
                  <Input
                    value={editingTour.thumbnail}
                    onChange={(e) => setEditingTour({ ...editingTour, thumbnail: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Badges (comma-separated)</Label>
                  <Input
                    value={editingTour.badges.join(', ')}
                    onChange={(e) => setEditingTour({ ...editingTour, badges: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="Bestseller, Small Group"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Highlights (comma-separated)</Label>
                  <Textarea
                    value={editingTour.highlights.join(', ')}
                    onChange={(e) => setEditingTour({ ...editingTour, highlights: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="Temple of Tooth visit, Anuradhapura sacred sites..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Included (comma-separated)</Label>
                  <Textarea
                    value={editingTour.included.join(', ')}
                    onChange={(e) => setEditingTour({ ...editingTour, included: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="Accommodation, Buddhist guide, All temple entries..."
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingTour.isPublished}
                    onCheckedChange={(checked) => setEditingTour({ ...editingTour, isPublished: checked })}
                  />
                  <Label>Published</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => saveTour(editingTour)} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Tour
                  </Button>
                  <Button variant="outline" onClick={() => setEditingTour(null)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {tours.map((tour) => (
              <Card key={tour.id} className="hover:shadow-md transition-shadow overflow-hidden">
                {tour.thumbnail && (
                  <img src={tour.thumbnail} alt={tour.title} className="w-full h-32 object-cover" />
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {tour.title}
                        {!tour.isPublished && <Badge variant="secondary">Draft</Badge>}
                      </h4>
                      <p className="text-sm text-gray-600">{tour.duration}</p>
                      <p className="text-lg font-bold text-amber-600">${tour.salePriceUSD}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingTour(tour)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteTour(tour.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">FAQs</h3>
            <Button onClick={addFaq} className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={faq.id || index}>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => {
                        const updated = [...faqs];
                        updated[index] = { ...faq, question: e.target.value };
                        setFaqs(updated);
                      }}
                      placeholder="What should I wear when visiting religious sites?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Answer</Label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => {
                        const updated = [...faqs];
                        updated[index] = { ...faq, answer: e.target.value };
                        setFaqs(updated);
                      }}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={faq.isActive}
                        onCheckedChange={(checked) => {
                          const updated = [...faqs];
                          updated[index] = { ...faq, isActive: checked };
                          setFaqs(updated);
                        }}
                      />
                      <Label>Active</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveFaq(faq, index)} disabled={saving}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteFaq(faq.id, index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* CTA Tab */}
        <TabsContent value="cta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call to Action Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Headline</Label>
                <Input
                  value={cta.headline}
                  onChange={(e) => setCta({ ...cta, headline: e.target.value })}
                  placeholder="Begin Your Spiritual Journey"
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Textarea
                  value={cta.subtitle}
                  onChange={(e) => setCta({ ...cta, subtitle: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input
                    value={cta.buttonText}
                    onChange={(e) => setCta({ ...cta, buttonText: e.target.value })}
                    placeholder="Book Pilgrimage Tour"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button Link</Label>
                  <Input
                    value={cta.buttonLink}
                    onChange={(e) => setCta({ ...cta, buttonLink: e.target.value })}
                    placeholder="/booking/pilgrimage"
                  />
                </div>
              </div>
              <Button onClick={saveCta} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save CTA
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Tab */}
        <TabsContent value="booking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Deposit Percent</Label>
                  <Input
                    type="number"
                    value={booking.depositPercent}
                    onChange={(e) => setBooking({ ...booking, depositPercent: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deposit Note</Label>
                  <Input
                    value={booking.depositNote}
                    onChange={(e) => setBooking({ ...booking, depositNote: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cancellation Policy</Label>
                <Textarea
                  value={booking.cancellationPolicy}
                  onChange={(e) => setBooking({ ...booking, cancellationPolicy: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input
                    value={booking.whatsapp}
                    onChange={(e) => setBooking({ ...booking, whatsapp: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={booking.email}
                    onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={booking.phone}
                    onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Response Time</Label>
                <Input
                  value={booking.responseTime}
                  onChange={(e) => setBooking({ ...booking, responseTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Pickup Locations (comma-separated)</Label>
                <Textarea
                  value={booking.pickupLocations.join(', ')}
                  onChange={(e) => setBooking({ ...booking, pickupLocations: e.target.value.split(',').map(s => s.trim()) })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Methods (comma-separated)</Label>
                <Input
                  value={booking.paymentMethods.join(', ')}
                  onChange={(e) => setBooking({ ...booking, paymentMethods: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>
              <Button onClick={saveBooking} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Booking Config
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PilgrimageManager;
