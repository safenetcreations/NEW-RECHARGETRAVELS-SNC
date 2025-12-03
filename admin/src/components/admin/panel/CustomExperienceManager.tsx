import React, { useState, useEffect } from 'react';
import { Loader2, Save, Plus, Trash2, Compass, Star } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { useToast } from '../../../components/ui/use-toast';
import customExperienceAdminService, {
  AdminCustomExperienceContent,
  defaultAdminCustomExperienceContent
} from '../../../services/customExperienceAdminService';

const CustomExperienceManager: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<AdminCustomExperienceContent>(defaultAdminCustomExperienceContent);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const data = await customExperienceAdminService.getContent();
      setContent(data);
    } catch (error) {
      console.error('Failed to load content:', error);
      toast({ title: 'Error', description: 'Failed to load custom experience content', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const success = await customExperienceAdminService.saveContent(content);
      if (success) {
        toast({ title: 'Success', description: 'Custom experience content saved successfully' });
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Failed to save content:', error);
      toast({ title: 'Error', description: 'Failed to save content', variant: 'destructive' });
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
    updateOverview('badges', [...content.overview.badges, { label: '', value: '', iconName: 'Compass' }]);
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

  const updateExperienceType = (index: number, field: string, value: any) => {
    const updated = [...content.experienceTypes];
    updated[index] = { ...updated[index], [field]: value };
    setContent((prev) => ({ ...prev, experienceTypes: updated }));
  };

  const addExperienceType = () => {
    setContent((prev) => ({
      ...prev,
      experienceTypes: [...prev.experienceTypes, { id: `exp-${Date.now()}`, icon: '✨', title: '', description: '' }]
    }));
  };

  const removeExperienceType = (index: number) => {
    setContent((prev) => ({ ...prev, experienceTypes: prev.experienceTypes.filter((_, i) => i !== index) }));
  };

  const updateBenefit = (index: number, field: string, value: any) => {
    const updated = [...content.benefits];
    updated[index] = { ...updated[index], [field]: value };
    setContent((prev) => ({ ...prev, benefits: updated }));
  };

  const addBenefit = () => {
    setContent((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { id: `benefit-${Date.now()}`, title: '', description: '', image: '', icon: '✨' }]
    }));
  };

  const removeBenefit = (index: number) => {
    setContent((prev) => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) }));
  };

  const updateTestimonial = (index: number, field: string, value: any) => {
    const updated = [...content.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setContent((prev) => ({ ...prev, testimonials: updated }));
  };

  const addTestimonial = () => {
    setContent((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, { id: `test-${Date.now()}`, name: '', location: '', text: '', rating: 5, avatar: '', tripType: '' }]
    }));
  };

  const removeTestimonial = (index: number) => {
    setContent((prev) => ({ ...prev, testimonials: prev.testimonials.filter((_, i) => i !== index) }));
  };

  const updateBooking = (field: string, value: string) => {
    setContent((prev) => ({ ...prev, booking: { ...prev.booking, [field]: value } }));
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
          <h1 className="text-2xl font-bold text-gray-900">Custom Experience Manager</h1>
          <p className="text-sm text-gray-500">Manage custom trip planner page content</p>
        </div>
        <Button onClick={saveContent} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="types">Experience Types</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Hero Tab */}
        <TabsContent value="hero" className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
            <div className="grid gap-4">
              <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={content.hero.title} onChange={(e) => updateHero('title', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Subtitle</label><textarea value={content.hero.subtitle} onChange={(e) => updateHero('subtitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={3} /></div>
              <div><label className="block text-sm font-medium mb-1">Badge Text</label><input type="text" value={content.hero.badge} onChange={(e) => updateHero('badge', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
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
            <div><label className="block text-sm font-medium mb-1">Summary</label><textarea value={content.overview.summary} onChange={(e) => updateOverview('summary', e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={4} /></div>
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

        {/* Experience Types Tab */}
        <TabsContent value="types" className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Experience Types</h3>
              <Button size="sm" variant="outline" onClick={addExperienceType}><Plus className="h-4 w-4 mr-1" /> Add Type</Button>
            </div>
            {content.experienceTypes.map((expType, index) => (
              <div key={expType.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
                <div className="grid gap-4 md:grid-cols-4">
                  <input type="text" placeholder="Icon (emoji)" value={expType.icon} onChange={(e) => updateExperienceType(index, 'icon', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="Title" value={expType.title} onChange={(e) => updateExperienceType(index, 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg md:col-span-2" />
                  <Button size="sm" variant="destructive" onClick={() => removeExperienceType(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
                <textarea placeholder="Description" value={expType.description} onChange={(e) => updateExperienceType(index, 'description', e.target.value)} className="w-full px-3 py-2 border rounded-lg mt-3" rows={2} />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits" className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Benefits</h3>
              <Button size="sm" variant="outline" onClick={addBenefit}><Plus className="h-4 w-4 mr-1" /> Add Benefit</Button>
            </div>
            {content.benefits.map((benefit, index) => (
              <div key={benefit.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
                <div className="grid gap-4 md:grid-cols-3">
                  <input type="text" placeholder="Icon (emoji)" value={benefit.icon || ''} onChange={(e) => updateBenefit(index, 'icon', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="Title" value={benefit.title} onChange={(e) => updateBenefit(index, 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg md:col-span-2" />
                </div>
                <textarea placeholder="Description" value={benefit.description} onChange={(e) => updateBenefit(index, 'description', e.target.value)} className="w-full px-3 py-2 border rounded-lg mt-3" rows={2} />
                <div className="flex gap-2 mt-3">
                  <input type="text" placeholder="Image URL" value={benefit.image} onChange={(e) => updateBenefit(index, 'image', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" />
                  <Button size="sm" variant="destructive" onClick={() => removeBenefit(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials" className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Testimonials</h3>
              <Button size="sm" variant="outline" onClick={addTestimonial}><Plus className="h-4 w-4 mr-1" /> Add Testimonial</Button>
            </div>
            {content.testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
                <div className="grid gap-4 md:grid-cols-3">
                  <input type="text" placeholder="Name" value={testimonial.name} onChange={(e) => updateTestimonial(index, 'name', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="Location" value={testimonial.location} onChange={(e) => updateTestimonial(index, 'location', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="Trip Type" value={testimonial.tripType || ''} onChange={(e) => updateTestimonial(index, 'tripType', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <textarea placeholder="Testimonial text" value={testimonial.text} onChange={(e) => updateTestimonial(index, 'text', e.target.value)} className="w-full px-3 py-2 border rounded-lg mt-3" rows={3} />
                <div className="grid gap-4 md:grid-cols-3 mt-3">
                  <input type="text" placeholder="Avatar URL" value={testimonial.avatar} onChange={(e) => updateTestimonial(index, 'avatar', e.target.value)} className="w-full px-3 py-2 border rounded-lg md:col-span-2" />
                  <div className="flex gap-2">
                    <input type="number" min={1} max={5} placeholder="Rating" value={testimonial.rating} onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
                    <Button size="sm" variant="destructive" onClick={() => removeTestimonial(index)}><Trash2 className="h-4 w-4" /></Button>
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

export default CustomExperienceManager;







