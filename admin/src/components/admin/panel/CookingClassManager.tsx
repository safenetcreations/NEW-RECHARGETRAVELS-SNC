import React, { useState, useEffect } from 'react';
import { Loader2, Save, Plus, Trash2, UtensilsCrossed, ChefHat } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { useToast } from '../../../components/ui/use-toast';
import cookingClassAdminService, {
  AdminCookingClassContent,
  defaultAdminCookingClassContent
} from '../../../services/cookingClassAdminService';

const CookingClassManager: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<AdminCookingClassContent>(defaultAdminCookingClassContent);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const data = await cookingClassAdminService.getContent();
      setContent(data);
    } catch (error) {
      console.error('Failed to load content:', error);
      toast({ title: 'Error', description: 'Failed to load cooking class content', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const success = await cookingClassAdminService.saveContent(content);
      if (success) {
        toast({ title: 'Success', description: 'Cooking class content saved successfully' });
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Failed to save content:', error);
      toast({ title: 'Error', description: 'Failed to save cooking class content', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (field: string, value: any) => {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  const updateHeroSlide = (index: number, field: string, value: string) => {
    const updated = [...content.hero.gallery];
    updated[index] = { ...updated[index], [field]: value };
    updateHero('gallery', updated);
  };

  const addHeroSlide = () => {
    updateHero('gallery', [...content.hero.gallery, { image: '', caption: '', tag: '' }]);
  };

  const removeHeroSlide = (index: number) => {
    updateHero('gallery', content.hero.gallery.filter((_, i) => i !== index));
  };

  const updateOverview = (field: string, value: any) => {
    setContent((prev) => ({ ...prev, overview: { ...prev.overview, [field]: value } }));
  };

  const updateBadge = (index: number, field: string, value: string) => {
    const updated = [...content.overview.badges];
    updated[index] = { ...updated[index], [field]: value };
    updateOverview('badges', updated);
  };

  const addBadge = () => {
    updateOverview('badges', [...content.overview.badges, { label: '', value: '', iconName: 'UtensilsCrossed' }]);
  };

  const removeBadge = (index: number) => {
    updateOverview('badges', content.overview.badges.filter((_, i) => i !== index));
  };

  const updateHighlight = (index: number, field: string, value: string) => {
    const updated = [...content.overview.highlights];
    updated[index] = { ...updated[index], [field]: value };
    updateOverview('highlights', updated);
  };

  const addHighlight = () => {
    updateOverview('highlights', [...content.overview.highlights, { label: '', description: '' }]);
  };

  const removeHighlight = (index: number) => {
    updateOverview('highlights', content.overview.highlights.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...content.experiences];
    updated[index] = { ...updated[index], [field]: value };
    setContent((prev) => ({ ...prev, experiences: updated }));
  };

  const addExperience = () => {
    setContent((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: `exp-${Date.now()}`,
          name: '',
          city: '',
          summary: '',
          duration: '',
          priceLabel: '',
          level: 'All Levels' as const,
          includes: [],
          iconName: 'UtensilsCrossed',
          image: '',
          rating: 4.5,
          reviews: 0
        }
      ]
    }));
  };

  const removeExperience = (index: number) => {
    setContent((prev) => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }));
  };

  const updateCombo = (index: number, field: string, value: any) => {
    const updated = [...content.combos];
    updated[index] = { ...updated[index], [field]: value };
    setContent((prev) => ({ ...prev, combos: updated }));
  };

  const addCombo = () => {
    setContent((prev) => ({
      ...prev,
      combos: [
        ...prev.combos,
        {
          id: `combo-${Date.now()}`,
          name: '',
          badge: '',
          duration: '',
          priceLabel: '',
          highlights: [],
          includes: [],
          iconName: 'Sparkles'
        }
      ]
    }));
  };

  const removeCombo = (index: number) => {
    setContent((prev) => ({ ...prev, combos: prev.combos.filter((_, i) => i !== index) }));
  };

  const updateLogistics = (field: string, value: any) => {
    setContent((prev) => ({ ...prev, logistics: { ...prev.logistics, [field]: value } }));
  };

  const updateFaq = (index: number, field: string, value: string) => {
    const updated = [...content.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setContent((prev) => ({ ...prev, faqs: updated }));
  };

  const addFaq = () => {
    setContent((prev) => ({ ...prev, faqs: [...prev.faqs, { id: `faq-${Date.now()}`, question: '', answer: '' }] }));
  };

  const removeFaq = (index: number) => {
    setContent((prev) => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
  };

  const updateGalleryImage = (index: number, field: string, value: string) => {
    const updated = [...content.gallery];
    updated[index] = { ...updated[index], [field]: value };
    setContent((prev) => ({ ...prev, gallery: updated }));
  };

  const addGalleryImage = () => {
    setContent((prev) => ({
      ...prev,
      gallery: [...prev.gallery, { id: `gallery-${Date.now()}`, image: '', caption: '' }]
    }));
  };

  const removeGalleryImage = (index: number) => {
    setContent((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
  };

  const updateBooking = (field: string, value: string) => {
    setContent((prev) => ({ ...prev, booking: { ...prev.booking, [field]: value } }));
  };

  const updatePricing = (field: string, value: any) => {
    setContent((prev) => ({ ...prev, pricing: { ...prev.pricing, [field]: value } }));
  };

  const updateSeo = (field: string, value: any) => {
    setContent((prev) => ({ ...prev, seo: { ...prev.seo, [field]: value } }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cooking Class Manager</h1>
          <p className="text-sm text-gray-500">Manage cooking class page content</p>
        </div>
        <Button onClick={saveContent} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experiences">Classes</TabsTrigger>
          <TabsTrigger value="combos">Combos</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="chefs">Chefs</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Hero Tab */}
        <TabsContent value="hero" className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={content.hero.title} onChange={(e) => updateHero('title', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <textarea value={content.hero.subtitle} onChange={(e) => updateHero('subtitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Badge Text</label>
                <input type="text" value={content.hero.badge} onChange={(e) => updateHero('badge', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Hero Slides</h4>
                <Button size="sm" variant="outline" onClick={addHeroSlide}><Plus className="h-4 w-4 mr-1" /> Add Slide</Button>
              </div>
              {content.hero.gallery.map((slide, index) => (
                <div key={index} className="border rounded-lg p-4 mb-3 bg-gray-50">
                  <div className="grid gap-3 md:grid-cols-3">
                    <input type="text" placeholder="Image URL" value={slide.image} onChange={(e) => updateHeroSlide(index, 'image', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                    <input type="text" placeholder="Caption" value={slide.caption} onChange={(e) => updateHeroSlide(index, 'caption', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                    <div className="flex gap-2">
                      <input type="text" placeholder="Tag" value={slide.tag || ''} onChange={(e) => updateHeroSlide(index, 'tag', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" />
                      <Button size="sm" variant="destructive" onClick={() => removeHeroSlide(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Overview Section</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Summary</label>
              <textarea value={content.overview.summary} onChange={(e) => updateOverview('summary', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500" rows={4} />
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Badges</h4>
                <Button size="sm" variant="outline" onClick={addBadge}><Plus className="h-4 w-4 mr-1" /> Add Badge</Button>
              </div>
              {content.overview.badges.map((badge, index) => (
                <div key={index} className="border rounded-lg p-4 mb-3 bg-gray-50">
                  <div className="grid gap-3 md:grid-cols-4">
                    <input type="text" placeholder="Label" value={badge.label} onChange={(e) => updateBadge(index, 'label', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                    <input type="text" placeholder="Value" value={badge.value} onChange={(e) => updateBadge(index, 'value', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                    <input type="text" placeholder="Icon Name" value={badge.iconName} onChange={(e) => updateBadge(index, 'iconName', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                    <Button size="sm" variant="destructive" onClick={() => removeBadge(index)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Highlights</h4>
                <Button size="sm" variant="outline" onClick={addHighlight}><Plus className="h-4 w-4 mr-1" /> Add Highlight</Button>
              </div>
              {content.overview.highlights.map((highlight, index) => (
                <div key={index} className="border rounded-lg p-4 mb-3 bg-gray-50">
                  <div className="grid gap-3">
                    <input type="text" placeholder="Label" value={highlight.label} onChange={(e) => updateHighlight(index, 'label', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                    <div className="flex gap-2">
                      <textarea placeholder="Description" value={highlight.description} onChange={(e) => updateHighlight(index, 'description', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" rows={2} />
                      <Button size="sm" variant="destructive" onClick={() => removeHighlight(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Experiences Tab */}
        <TabsContent value="experiences" className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Cooking Classes</h3>
              <Button size="sm" variant="outline" onClick={addExperience}><Plus className="h-4 w-4 mr-1" /> Add Class</Button>
            </div>
            {content.experiences.map((experience, index) => (
              <div key={experience.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
                <div className="grid gap-4 md:grid-cols-2">
                  <input type="text" placeholder="Class Name" value={experience.name} onChange={(e) => updateExperience(index, 'name', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="City" value={experience.city} onChange={(e) => updateExperience(index, 'city', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <textarea placeholder="Summary" value={experience.summary} onChange={(e) => updateExperience(index, 'summary', e.target.value)} className="w-full px-3 py-2 border rounded-lg mt-3" rows={2} />
                <div className="grid gap-4 md:grid-cols-4 mt-3">
                  <input type="text" placeholder="Duration" value={experience.duration} onChange={(e) => updateExperience(index, 'duration', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="Price Label" value={experience.priceLabel} onChange={(e) => updateExperience(index, 'priceLabel', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                  <select value={experience.level} onChange={(e) => updateExperience(index, 'level', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                  <input type="text" placeholder="Icon Name" value={experience.iconName} onChange={(e) => updateExperience(index, 'iconName', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 mt-3">
                  <input type="number" step="0.1" placeholder="Rating" value={experience.rating} onChange={(e) => updateExperience(index, 'rating', parseFloat(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
                  <input type="number" placeholder="Reviews" value={experience.reviews} onChange={(e) => updateExperience(index, 'reviews', parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <input type="text" placeholder="Image URL" value={experience.image || ''} onChange={(e) => updateExperience(index, 'image', e.target.value)} className="w-full px-3 py-2 border rounded-lg mt-3" />
                <textarea placeholder="Includes (one per line)" value={experience.includes.join('\n')} onChange={(e) => updateExperience(index, 'includes', e.target.value.split('\n'))} className="w-full px-3 py-2 border rounded-lg mt-3" rows={3} />
                <Button size="sm" variant="destructive" onClick={() => removeExperience(index)} className="mt-3"><Trash2 className="h-4 w-4 mr-1" /> Remove Class</Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Combos Tab */}
        <TabsContent value="combos" className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Combo Packages</h3>
              <Button size="sm" variant="outline" onClick={addCombo}><Plus className="h-4 w-4 mr-1" /> Add Combo</Button>
            </div>
            {content.combos.map((combo, index) => (
              <div key={combo.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
                <div className="grid gap-4 md:grid-cols-2">
                  <input type="text" placeholder="Name" value={combo.name} onChange={(e) => updateCombo(index, 'name', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="Badge" value={combo.badge} onChange={(e) => updateCombo(index, 'badge', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="grid gap-4 md:grid-cols-3 mt-3">
                  <input type="text" placeholder="Duration" value={combo.duration} onChange={(e) => updateCombo(index, 'duration', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="Price Label" value={combo.priceLabel} onChange={(e) => updateCombo(index, 'priceLabel', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="Icon Name" value={combo.iconName} onChange={(e) => updateCombo(index, 'iconName', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <textarea placeholder="Highlights (one per line)" value={combo.highlights.join('\n')} onChange={(e) => updateCombo(index, 'highlights', e.target.value.split('\n'))} className="w-full px-3 py-2 border rounded-lg mt-3" rows={3} />
                <textarea placeholder="Includes (one per line)" value={combo.includes.join('\n')} onChange={(e) => updateCombo(index, 'includes', e.target.value.split('\n'))} className="w-full px-3 py-2 border rounded-lg mt-3" rows={3} />
                <Button size="sm" variant="destructive" onClick={() => removeCombo(index)} className="mt-3"><Trash2 className="h-4 w-4 mr-1" /> Remove Combo</Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Logistics Tab */}
        <TabsContent value="logistics" className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Logistics</h3>
            <div className="grid gap-4">
              <div><label className="block text-sm font-medium mb-1">Meeting Point</label><input type="text" value={content.logistics.meetingPoint} onChange={(e) => updateLogistics('meetingPoint', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Session Times (one per line)</label><textarea value={content.logistics.sessionTimes.join('\n')} onChange={(e) => updateLogistics('sessionTimes', e.target.value.split('\n'))} className="w-full px-3 py-2 border rounded-lg" rows={3} /></div>
              <div><label className="block text-sm font-medium mb-1">Base Location</label><input type="text" value={content.logistics.baseLocation} onChange={(e) => updateLogistics('baseLocation', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Transfer Note</label><textarea value={content.logistics.transferNote} onChange={(e) => updateLogistics('transferNote', e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
              <div><label className="block text-sm font-medium mb-1">Gear Provided (one per line)</label><textarea value={content.logistics.gearProvided.join('\n')} onChange={(e) => updateLogistics('gearProvided', e.target.value.split('\n'))} className="w-full px-3 py-2 border rounded-lg" rows={3} /></div>
              <div><label className="block text-sm font-medium mb-1">Bring List (one per line)</label><textarea value={content.logistics.bringList.join('\n')} onChange={(e) => updateLogistics('bringList', e.target.value.split('\n'))} className="w-full px-3 py-2 border rounded-lg" rows={3} /></div>
              <div><label className="block text-sm font-medium mb-1">Dietary Note</label><textarea value={content.logistics.dietaryNote} onChange={(e) => updateLogistics('dietaryNote', e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
              <div><label className="block text-sm font-medium mb-1">Safety Note</label><textarea value={content.logistics.safetyNote} onChange={(e) => updateLogistics('safetyNote', e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
            </div>
          </div>
        </TabsContent>

        {/* Chefs Tab */}
        <TabsContent value="chefs" className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Chef Credentials</h3>
            <div><label className="block text-sm font-medium mb-1">Credentials (one per line)</label><textarea value={content.chefCredentials.join('\n')} onChange={(e) => setContent((prev) => ({ ...prev, chefCredentials: e.target.value.split('\n') }))} className="w-full px-3 py-2 border rounded-lg" rows={8} /></div>
          </div>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">FAQs</h3>
              <Button size="sm" variant="outline" onClick={addFaq}><Plus className="h-4 w-4 mr-1" /> Add FAQ</Button>
            </div>
            {content.faqs.map((faq, index) => (
              <div key={faq.id} className="border rounded-lg p-4 mb-3 bg-gray-50">
                <input type="text" placeholder="Question" value={faq.question} onChange={(e) => updateFaq(index, 'question', e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-2" />
                <div className="flex gap-2">
                  <textarea placeholder="Answer" value={faq.answer} onChange={(e) => updateFaq(index, 'answer', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" rows={3} />
                  <Button size="sm" variant="destructive" onClick={() => removeFaq(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Gallery Images</h3>
              <Button size="sm" variant="outline" onClick={addGalleryImage}><Plus className="h-4 w-4 mr-1" /> Add Image</Button>
            </div>
            {content.gallery.map((image, index) => (
              <div key={image.id} className="border rounded-lg p-4 mb-3 bg-gray-50">
                <div className="grid gap-3 md:grid-cols-3">
                  <input type="text" placeholder="Image URL" value={image.image} onChange={(e) => updateGalleryImage(index, 'image', e.target.value)} className="md:col-span-2 w-full px-3 py-2 border rounded-lg" />
                  <div className="flex gap-2">
                    <input type="text" placeholder="Caption" value={image.caption} onChange={(e) => updateGalleryImage(index, 'caption', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" />
                    <Button size="sm" variant="destructive" onClick={() => removeGalleryImage(index)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Booking Tab */}
        <TabsContent value="booking" className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Booking Info</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="block text-sm font-medium mb-1">Contact Phone</label><input type="text" value={content.booking.contactPhone} onChange={(e) => updateBooking('contactPhone', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">WhatsApp Link</label><input type="text" value={content.booking.whatsapp} onChange={(e) => updateBooking('whatsapp', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={content.booking.email} onChange={(e) => updateBooking('email', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Response Time</label><input type="text" value={content.booking.responseTime} onChange={(e) => updateBooking('responseTime', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
            </div>
            <div className="mt-4"><label className="block text-sm font-medium mb-1">Concierge Note</label><textarea value={content.booking.conciergeNote} onChange={(e) => updateBooking('conciergeNote', e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={3} /></div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Pricing</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="block text-sm font-medium mb-1">Currency</label><input type="text" value={content.pricing.currency} onChange={(e) => updatePricing('currency', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Starting Price</label><input type="number" value={content.pricing.startingPrice} onChange={(e) => updatePricing('startingPrice', Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" /></div>
            </div>
            <div className="mt-4"><label className="block text-sm font-medium mb-1">Deposit Note</label><textarea value={content.pricing.depositNote} onChange={(e) => updatePricing('depositNote', e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
            <div className="mt-4"><label className="block text-sm font-medium mb-1">Refund Policy</label><textarea value={content.pricing.refundPolicy} onChange={(e) => updatePricing('refundPolicy', e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
            <div className="mt-4"><label className="block text-sm font-medium mb-1">Extras Note</label><textarea value={content.pricing.extrasNote} onChange={(e) => updatePricing('extrasNote', e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
            <div className="grid gap-4">
              <div><label className="block text-sm font-medium mb-1">Page Title</label><input type="text" value={content.seo.title} onChange={(e) => updateSeo('title', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Meta Description</label><textarea value={content.seo.description} onChange={(e) => updateSeo('description', e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={3} /></div>
              <div><label className="block text-sm font-medium mb-1">Keywords (comma separated)</label><input type="text" value={content.seo.keywords.join(', ')} onChange={(e) => updateSeo('keywords', e.target.value.split(',').map((k) => k.trim()))} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">OG Image URL</label><input type="text" value={content.seo.ogImage} onChange={(e) => updateSeo('ogImage', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CookingClassManager;







