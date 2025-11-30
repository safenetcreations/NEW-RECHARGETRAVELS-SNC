import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X, Loader2, Sparkles, Settings, FileText, Quote, Star, Clock, DollarSign, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  getWellnessSettings, updateWellnessSettings,
  getWellnessPackages, addWellnessPackage, updateWellnessPackage, deleteWellnessPackage,
  getSpaServices, addSpaService, updateSpaService, deleteSpaService,
  getWellnessTestimonials, addWellnessTestimonial, updateWellnessTestimonial, deleteWellnessTestimonial,
  WellnessPageSettings, WellnessPackage, SpaService, WellnessTestimonial
} from '@/services/wellnessService';

const WellnessAdmin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');

  const [settings, setSettings] = useState<WellnessPageSettings | null>(null);
  const [packages, setPackages] = useState<WellnessPackage[]>([]);
  const [services, setServices] = useState<SpaService[]>([]);
  const [testimonials, setTestimonials] = useState<WellnessTestimonial[]>([]);

  const [editingPackage, setEditingPackage] = useState<WellnessPackage | null>(null);
  const [editingService, setEditingService] = useState<SpaService | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<WellnessTestimonial | null>(null);
  const [showNewPackage, setShowNewPackage] = useState(false);
  const [showNewService, setShowNewService] = useState(false);
  const [showNewTestimonial, setShowNewTestimonial] = useState(false);

  useEffect(() => { loadAllData(); }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [s, p, svc, t] = await Promise.all([getWellnessSettings(), getWellnessPackages(), getSpaServices(), getWellnessTestimonials()]);
      setSettings(s); setPackages(p); setServices(svc); setTestimonials(t);
    } catch (error) { toast({ title: 'Error loading data', variant: 'destructive' }); }
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    const success = await updateWellnessSettings(settings);
    setSaving(false);
    toast({ title: success ? 'Settings saved!' : 'Error saving', variant: success ? 'default' : 'destructive' });
  };

  const handleSavePackage = async (pkg: WellnessPackage) => {
    setSaving(true);
    const success = await updateWellnessPackage(pkg.id, pkg);
    setSaving(false);
    if (success) { setPackages(prev => prev.map(p => p.id === pkg.id ? pkg : p)); setEditingPackage(null); toast({ title: 'Package updated!' }); }
  };

  const handleAddPackage = async (pkg: Omit<WellnessPackage, 'id'>) => {
    setSaving(true);
    const id = await addWellnessPackage(pkg);
    setSaving(false);
    if (id) { setPackages(prev => [...prev, { ...pkg, id }]); setShowNewPackage(false); toast({ title: 'Package added!' }); }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Delete this package?')) return;
    if (await deleteWellnessPackage(id)) { setPackages(prev => prev.filter(p => p.id !== id)); toast({ title: 'Deleted!' }); }
  };

  const handleSaveService = async (svc: SpaService) => {
    setSaving(true);
    const success = await updateSpaService(svc.id, svc);
    setSaving(false);
    if (success) { setServices(prev => prev.map(s => s.id === svc.id ? svc : s)); setEditingService(null); toast({ title: 'Service updated!' }); }
  };

  const handleAddService = async (svc: Omit<SpaService, 'id'>) => {
    setSaving(true);
    const id = await addSpaService(svc);
    setSaving(false);
    if (id) { setServices(prev => [...prev, { ...svc, id }]); setShowNewService(false); toast({ title: 'Service added!' }); }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    if (await deleteSpaService(id)) { setServices(prev => prev.filter(s => s.id !== id)); toast({ title: 'Deleted!' }); }
  };

  const handleSaveTestimonial = async (t: WellnessTestimonial) => {
    setSaving(true);
    const success = await updateWellnessTestimonial(t.id, t);
    setSaving(false);
    if (success) { setTestimonials(prev => prev.map(x => x.id === t.id ? t : x)); setEditingTestimonial(null); toast({ title: 'Testimonial updated!' }); }
  };

  const handleAddTestimonial = async (t: Omit<WellnessTestimonial, 'id'>) => {
    setSaving(true);
    const id = await addWellnessTestimonial(t);
    setSaving(false);
    if (id) { setTestimonials(prev => [...prev, { ...t, id }]); setShowNewTestimonial(false); toast({ title: 'Testimonial added!' }); }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Delete?')) return;
    if (await deleteWellnessTestimonial(id)) { setTestimonials(prev => prev.filter(t => t.id !== id)); toast({ title: 'Deleted!' }); }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-rose-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-rose-700 to-rose-500 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2"><Sparkles className="w-8 h-8" /><h1 className="text-3xl font-bold">Wellness & Spa Admin</h1></div>
          <p className="text-rose-100">Manage packages, spa services, and testimonials</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-8">
            <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-2" />Settings</TabsTrigger>
            <TabsTrigger value="packages"><Sparkles className="w-4 h-4 mr-2" />Packages ({packages.length})</TabsTrigger>
            <TabsTrigger value="services"><FileText className="w-4 h-4 mr-2" />Services ({services.length})</TabsTrigger>
            <TabsTrigger value="testimonials"><Quote className="w-4 h-4 mr-2" />Testimonials ({testimonials.length})</TabsTrigger>
          </TabsList>

          {/* SETTINGS */}
          <TabsContent value="settings">
            {settings && (
              <div className="space-y-6">
                <Card><CardHeader><CardTitle>Hero Section</CardTitle></CardHeader><CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium">Hero Title</label><Input value={settings.heroTitle} onChange={e => setSettings({...settings, heroTitle: e.target.value})} /></div>
                    <div><label className="text-sm font-medium">Tagline</label><Input value={settings.heroTagline} onChange={e => setSettings({...settings, heroTagline: e.target.value})} /></div>
                  </div>
                  <div><label className="text-sm font-medium">Subtitle</label><Textarea value={settings.heroSubtitle} onChange={e => setSettings({...settings, heroSubtitle: e.target.value})} /></div>
                  <div><label className="text-sm font-medium">Hero Image URL</label><Input value={settings.heroImageUrl} onChange={e => setSettings({...settings, heroImageUrl: e.target.value})} /></div>
                </CardContent></Card>

                <Card><CardHeader><CardTitle>Section Titles</CardTitle></CardHeader><CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium">Packages Title</label><Input value={settings.packagesTitle} onChange={e => setSettings({...settings, packagesTitle: e.target.value})} /></div>
                    <div><label className="text-sm font-medium">Packages Subtitle</label><Input value={settings.packagesSubtitle} onChange={e => setSettings({...settings, packagesSubtitle: e.target.value})} /></div>
                    <div><label className="text-sm font-medium">Services Title</label><Input value={settings.servicesTitle} onChange={e => setSettings({...settings, servicesTitle: e.target.value})} /></div>
                    <div><label className="text-sm font-medium">Services Subtitle</label><Input value={settings.servicesSubtitle} onChange={e => setSettings({...settings, servicesSubtitle: e.target.value})} /></div>
                  </div>
                </CardContent></Card>

                <Card><CardHeader><CardTitle>CTA & Contact</CardTitle></CardHeader><CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium">CTA Title</label><Input value={settings.ctaTitle} onChange={e => setSettings({...settings, ctaTitle: e.target.value})} /></div>
                    <div><label className="text-sm font-medium">Phone Number</label><Input value={settings.phoneNumber} onChange={e => setSettings({...settings, phoneNumber: e.target.value})} /></div>
                  </div>
                  <div><label className="text-sm font-medium">CTA Subtitle</label><Textarea value={settings.ctaSubtitle} onChange={e => setSettings({...settings, ctaSubtitle: e.target.value})} /></div>
                  <div><label className="text-sm font-medium">CTA Background Image</label><Input value={settings.ctaBackgroundImage} onChange={e => setSettings({...settings, ctaBackgroundImage: e.target.value})} /></div>
                </CardContent></Card>

                <Button onClick={handleSaveSettings} disabled={saving} className="bg-rose-600 hover:bg-rose-700">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save Settings
                </Button>
              </div>
            )}
          </TabsContent>

          {/* PACKAGES */}
          <TabsContent value="packages">
            <div className="space-y-4">
              <div className="flex justify-between"><h2 className="text-xl font-semibold">Manage Packages</h2><Button onClick={() => setShowNewPackage(true)} className="bg-rose-600 hover:bg-rose-700"><Plus className="w-4 h-4 mr-2" />Add Package</Button></div>
              
              {showNewPackage && <PackageForm onSave={handleAddPackage} onCancel={() => setShowNewPackage(false)} saving={saving} />}

              {packages.map(pkg => (
                <Card key={pkg.id} className={!pkg.isActive ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    {editingPackage?.id === pkg.id ? <PackageForm package_={editingPackage} onSave={handleSavePackage} onCancel={() => setEditingPackage(null)} saving={saving} /> : (
                      <div className="flex items-center gap-4">
                        <img src={pkg.image} alt={pkg.name} className="w-24 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{pkg.name}</h3>
                            <Badge variant="outline">{pkg.category}</Badge>
                            {pkg.isFeatured && <Badge className="bg-amber-500">Featured</Badge>}
                            {!pkg.isActive && <Badge variant="secondary">Hidden</Badge>}
                          </div>
                          <p className="text-gray-600 text-sm">{pkg.resort}, {pkg.location}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{pkg.duration}</span>
                            <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />${pkg.price}</span>
                            <span className="flex items-center gap-1"><Star className="w-4 h-4" />{pkg.rating}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingPackage(pkg)}><Edit2 className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeletePackage(pkg.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SERVICES */}
          <TabsContent value="services">
            <div className="space-y-4">
              <div className="flex justify-between"><h2 className="text-xl font-semibold">Manage Spa Services</h2><Button onClick={() => setShowNewService(true)} className="bg-rose-600 hover:bg-rose-700"><Plus className="w-4 h-4 mr-2" />Add Service</Button></div>
              
              {showNewService && <ServiceForm onSave={handleAddService} onCancel={() => setShowNewService(false)} saving={saving} />}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(svc => (
                  <Card key={svc.id} className={!svc.isActive ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      {editingService?.id === svc.id ? <ServiceForm service={editingService} onSave={handleSaveService} onCancel={() => setEditingService(null)} saving={saving} /> : (
                        <div className="flex items-center gap-4">
                          <img src={svc.image} alt={svc.name} className="w-16 h-16 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h4 className="font-semibold">{svc.name}</h4>
                            <p className="text-sm text-gray-500">{svc.duration} • ${svc.price}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingService(svc)}><Edit2 className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteService(svc.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TESTIMONIALS */}
          <TabsContent value="testimonials">
            <div className="space-y-4">
              <div className="flex justify-between"><h2 className="text-xl font-semibold">Manage Testimonials</h2><Button onClick={() => setShowNewTestimonial(true)} className="bg-rose-600 hover:bg-rose-700"><Plus className="w-4 h-4 mr-2" />Add Testimonial</Button></div>
              
              {showNewTestimonial && <TestimonialForm onSave={handleAddTestimonial} onCancel={() => setShowNewTestimonial(false)} saving={saving} />}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.map(t => (
                  <Card key={t.id}>
                    <CardContent className="p-4">
                      {editingTestimonial?.id === t.id ? <TestimonialForm testimonial={editingTestimonial} onSave={handleSaveTestimonial} onCancel={() => setEditingTestimonial(null)} saving={saving} /> : (
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                            <div><h4 className="font-semibold">{t.name}</h4><p className="text-sm text-gray-500">{t.country}</p></div>
                          </div>
                          <p className="text-gray-600 text-sm italic line-clamp-3">"{t.quote}"</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex">{[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => setEditingTestimonial(t)}><Edit2 className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteTestimonial(t.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Package Form
const PackageForm = ({ package_, onSave, onCancel, saving }: { package_?: WellnessPackage; onSave: (p: any) => void; onCancel: () => void; saving: boolean }) => {
  const [form, setForm] = useState<Partial<WellnessPackage>>(package_ || {
    name: '', tagline: '', duration: '', nights: 3, price: 0, originalPrice: 0, image: '', gallery: [], resort: '', location: '', rating: 5, reviews: 0,
    category: 'spa', highlights: [], includes: [], schedule: [], bestFor: [], description: '', fullDescription: '', isActive: true, isFeatured: false, order: 1
  });
  const [highlightsText, setHighlightsText] = useState(form.highlights?.join('\n') || '');
  const [includesText, setIncludesText] = useState(form.includes?.join('\n') || '');
  const [bestForText, setBestForText] = useState(form.bestFor?.join('\n') || '');

  const handleSubmit = () => {
    onSave({ ...form, highlights: highlightsText.split('\n').filter(Boolean), includes: includesText.split('\n').filter(Boolean), bestFor: bestForText.split('\n').filter(Boolean) });
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Package Name</label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
        <div><label className="text-sm font-medium">Tagline</label><Input value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} /></div>
        <div><label className="text-sm font-medium">Duration</label><Input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="5 Days / 4 Nights" /></div>
        <div><label className="text-sm font-medium">Nights</label><Input type="number" value={form.nights} onChange={e => setForm({...form, nights: parseInt(e.target.value)})} /></div>
        <div><label className="text-sm font-medium">Price ($)</label><Input type="number" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value)})} /></div>
        <div><label className="text-sm font-medium">Original Price ($)</label><Input type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: parseFloat(e.target.value)})} /></div>
        <div><label className="text-sm font-medium">Resort</label><Input value={form.resort} onChange={e => setForm({...form, resort: e.target.value})} /></div>
        <div><label className="text-sm font-medium">Location</label><Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
        <div><label className="text-sm font-medium">Rating</label><Input type="number" step="0.1" max="5" value={form.rating} onChange={e => setForm({...form, rating: parseFloat(e.target.value)})} /></div>
        <div><label className="text-sm font-medium">Category</label>
          <Select value={form.category} onValueChange={v => setForm({...form, category: v as any})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="spa">Spa</SelectItem>
              <SelectItem value="detox">Detox</SelectItem>
              <SelectItem value="mindfulness">Mindfulness</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="retreat">Retreat</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div><label className="text-sm font-medium">Image URL</label><Input value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
      <div><label className="text-sm font-medium">Short Description</label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} /></div>
      <div><label className="text-sm font-medium">Full Description</label><Textarea value={form.fullDescription} onChange={e => setForm({...form, fullDescription: e.target.value})} rows={3} /></div>
      <div className="grid grid-cols-3 gap-4">
        <div><label className="text-sm font-medium">Highlights (one per line)</label><Textarea value={highlightsText} onChange={e => setHighlightsText(e.target.value)} rows={4} /></div>
        <div><label className="text-sm font-medium">Includes (one per line)</label><Textarea value={includesText} onChange={e => setIncludesText(e.target.value)} rows={4} /></div>
        <div><label className="text-sm font-medium">Best For (one per line)</label><Textarea value={bestForText} onChange={e => setBestForText(e.target.value)} rows={4} /></div>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2"><Switch checked={form.isActive} onCheckedChange={v => setForm({...form, isActive: v})} /><span className="text-sm">Active</span></label>
        <label className="flex items-center gap-2"><Switch checked={form.isFeatured} onCheckedChange={v => setForm({...form, isFeatured: v})} /><span className="text-sm">Featured</span></label>
        <div><label className="text-sm font-medium mr-2">Order:</label><Input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value)})} className="w-20 inline-block" /></div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={saving} className="bg-rose-600 hover:bg-rose-700">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

// Service Form
const ServiceForm = ({ service, onSave, onCancel, saving }: { service?: SpaService; onSave: (s: any) => void; onCancel: () => void; saving: boolean }) => {
  const [form, setForm] = useState<Partial<SpaService>>(service || { name: '', duration: '', price: 0, image: '', category: 'massage', description: '', benefits: [], isActive: true, order: 1 });
  const [benefitsText, setBenefitsText] = useState(form.benefits?.join('\n') || '');

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Service Name</label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
        <div><label className="text-sm font-medium">Duration</label><Input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="60 min" /></div>
        <div><label className="text-sm font-medium">Price ($)</label><Input type="number" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value)})} /></div>
        <div><label className="text-sm font-medium">Category</label>
          <Select value={form.category} onValueChange={v => setForm({...form, category: v as any})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="massage">Massage</SelectItem>
              <SelectItem value="facial">Facial</SelectItem>
              <SelectItem value="body">Body</SelectItem>
              <SelectItem value="bath">Bath</SelectItem>
              <SelectItem value="signature">Signature</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div><label className="text-sm font-medium">Image URL</label><Input value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
      <div><label className="text-sm font-medium">Description</label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} /></div>
      <div><label className="text-sm font-medium">Benefits (one per line)</label><Textarea value={benefitsText} onChange={e => setBenefitsText(e.target.value)} rows={3} /></div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2"><Switch checked={form.isActive} onCheckedChange={v => setForm({...form, isActive: v})} /><span className="text-sm">Active</span></label>
        <div><label className="text-sm font-medium mr-2">Order:</label><Input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value)})} className="w-20 inline-block" /></div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave({...form, benefits: benefitsText.split('\n').filter(Boolean)})} disabled={saving} className="bg-rose-600 hover:bg-rose-700">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

// Testimonial Form
const TestimonialForm = ({ testimonial, onSave, onCancel, saving }: { testimonial?: WellnessTestimonial; onSave: (t: any) => void; onCancel: () => void; saving: boolean }) => {
  const [form, setForm] = useState<Partial<WellnessTestimonial>>(testimonial || { name: '', country: '', image: '', quote: '', rating: 5, package: '', isActive: true, order: 1 });

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Name</label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
        <div><label className="text-sm font-medium">Country</label><Input value={form.country} onChange={e => setForm({...form, country: e.target.value})} /></div>
        <div><label className="text-sm font-medium">Image URL</label><Input value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
        <div><label className="text-sm font-medium">Package</label><Input value={form.package} onChange={e => setForm({...form, package: e.target.value})} /></div>
      </div>
      <div><label className="text-sm font-medium">Quote</label><Textarea value={form.quote} onChange={e => setForm({...form, quote: e.target.value})} rows={3} /></div>
      <div className="flex items-center gap-4">
        <div><label className="text-sm font-medium mr-2">Rating:</label><Input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({...form, rating: parseInt(e.target.value)})} className="w-20 inline-block" /></div>
        <label className="flex items-center gap-2"><Switch checked={form.isActive} onCheckedChange={v => setForm({...form, isActive: v})} /><span className="text-sm">Active</span></label>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(form)} disabled={saving} className="bg-rose-600 hover:bg-rose-700">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default WellnessAdmin;
