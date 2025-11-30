import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, Plus, Trash2, Edit2, X, ChevronDown, ChevronUp, 
  Image, DollarSign, Clock, MapPin, Star, Settings, FileText,
  Leaf, Users, Building2, Quote, Eye, EyeOff, GripVertical,
  Check, AlertCircle, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  getAyurvedaSettings,
  updateAyurvedaSettings,
  getAyurvedaTreatments,
  addAyurvedaTreatment,
  updateAyurvedaTreatment,
  deleteAyurvedaTreatment,
  getAyurvedaRetreats,
  addAyurvedaRetreat,
  updateAyurvedaRetreat,
  deleteAyurvedaRetreat,
  getAyurvedaTestimonials,
  addAyurvedaTestimonial,
  updateAyurvedaTestimonial,
  deleteAyurvedaTestimonial,
  AyurvedaPageSettings,
  AyurvedaTreatment,
  WellnessRetreat,
  AyurvedaTestimonial
} from '@/services/ayurvedaService';

const AyurvedaAdmin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');

  // Data states
  const [settings, setSettings] = useState<AyurvedaPageSettings | null>(null);
  const [treatments, setTreatments] = useState<AyurvedaTreatment[]>([]);
  const [retreats, setRetreats] = useState<WellnessRetreat[]>([]);
  const [testimonials, setTestimonials] = useState<AyurvedaTestimonial[]>([]);

  // Edit states
  const [editingTreatment, setEditingTreatment] = useState<AyurvedaTreatment | null>(null);
  const [editingRetreat, setEditingRetreat] = useState<WellnessRetreat | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<AyurvedaTestimonial | null>(null);
  const [showNewTreatment, setShowNewTreatment] = useState(false);
  const [showNewRetreat, setShowNewRetreat] = useState(false);
  const [showNewTestimonial, setShowNewTestimonial] = useState(false);

  // Load data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [settingsData, treatmentsData, retreatsData, testimonialsData] = await Promise.all([
        getAyurvedaSettings(),
        getAyurvedaTreatments(),
        getAyurvedaRetreats(),
        getAyurvedaTestimonials()
      ]);
      setSettings(settingsData);
      setTreatments(treatmentsData);
      setRetreats(retreatsData);
      setTestimonials(testimonialsData);
    } catch (error) {
      toast({ title: 'Error loading data', variant: 'destructive' });
    }
    setLoading(false);
  };

  // ===== SETTINGS HANDLERS =====
  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    const success = await updateAyurvedaSettings(settings);
    setSaving(false);
    if (success) {
      toast({ title: 'Settings saved successfully!' });
    } else {
      toast({ title: 'Error saving settings', variant: 'destructive' });
    }
  };

  // ===== TREATMENT HANDLERS =====
  const handleSaveTreatment = async (treatment: AyurvedaTreatment) => {
    setSaving(true);
    const success = await updateAyurvedaTreatment(treatment.id, treatment);
    setSaving(false);
    if (success) {
      setTreatments(prev => prev.map(t => t.id === treatment.id ? treatment : t));
      setEditingTreatment(null);
      toast({ title: 'Treatment updated!' });
    } else {
      toast({ title: 'Error updating treatment', variant: 'destructive' });
    }
  };

  const handleAddTreatment = async (treatment: Omit<AyurvedaTreatment, 'id'>) => {
    setSaving(true);
    const id = await addAyurvedaTreatment(treatment);
    setSaving(false);
    if (id) {
      setTreatments(prev => [...prev, { ...treatment, id }]);
      setShowNewTreatment(false);
      toast({ title: 'Treatment added!' });
    } else {
      toast({ title: 'Error adding treatment', variant: 'destructive' });
    }
  };

  const handleDeleteTreatment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this treatment?')) return;
    const success = await deleteAyurvedaTreatment(id);
    if (success) {
      setTreatments(prev => prev.filter(t => t.id !== id));
      toast({ title: 'Treatment deleted!' });
    } else {
      toast({ title: 'Error deleting treatment', variant: 'destructive' });
    }
  };

  // ===== RETREAT HANDLERS =====
  const handleSaveRetreat = async (retreat: WellnessRetreat) => {
    setSaving(true);
    const success = await updateAyurvedaRetreat(retreat.id, retreat);
    setSaving(false);
    if (success) {
      setRetreats(prev => prev.map(r => r.id === retreat.id ? retreat : r));
      setEditingRetreat(null);
      toast({ title: 'Retreat updated!' });
    } else {
      toast({ title: 'Error updating retreat', variant: 'destructive' });
    }
  };

  const handleAddRetreat = async (retreat: Omit<WellnessRetreat, 'id'>) => {
    setSaving(true);
    const id = await addAyurvedaRetreat(retreat);
    setSaving(false);
    if (id) {
      setRetreats(prev => [...prev, { ...retreat, id }]);
      setShowNewRetreat(false);
      toast({ title: 'Retreat added!' });
    } else {
      toast({ title: 'Error adding retreat', variant: 'destructive' });
    }
  };

  const handleDeleteRetreat = async (id: string) => {
    if (!confirm('Are you sure you want to delete this retreat?')) return;
    const success = await deleteAyurvedaRetreat(id);
    if (success) {
      setRetreats(prev => prev.filter(r => r.id !== id));
      toast({ title: 'Retreat deleted!' });
    } else {
      toast({ title: 'Error deleting retreat', variant: 'destructive' });
    }
  };

  // ===== TESTIMONIAL HANDLERS =====
  const handleSaveTestimonial = async (testimonial: AyurvedaTestimonial) => {
    setSaving(true);
    const success = await updateAyurvedaTestimonial(testimonial.id, testimonial);
    setSaving(false);
    if (success) {
      setTestimonials(prev => prev.map(t => t.id === testimonial.id ? testimonial : t));
      setEditingTestimonial(null);
      toast({ title: 'Testimonial updated!' });
    } else {
      toast({ title: 'Error updating testimonial', variant: 'destructive' });
    }
  };

  const handleAddTestimonial = async (testimonial: Omit<AyurvedaTestimonial, 'id'>) => {
    setSaving(true);
    const id = await addAyurvedaTestimonial(testimonial);
    setSaving(false);
    if (id) {
      setTestimonials(prev => [...prev, { ...testimonial, id }]);
      setShowNewTestimonial(false);
      toast({ title: 'Testimonial added!' });
    } else {
      toast({ title: 'Error adding testimonial', variant: 'destructive' });
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    const success = await deleteAyurvedaTestimonial(id);
    if (success) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast({ title: 'Testimonial deleted!' });
    } else {
      toast({ title: 'Error deleting testimonial', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Ayurveda Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Leaf className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Ayurveda Wellness Admin</h1>
          </div>
          <p className="text-emerald-100">Manage treatments, retreats, testimonials, and page settings</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-8">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="treatments" className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Treatments ({treatments.length})
            </TabsTrigger>
            <TabsTrigger value="retreats" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Retreats ({retreats.length})
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <Quote className="w-4 h-4" />
              Testimonials ({testimonials.length})
            </TabsTrigger>
          </TabsList>

          {/* ===== SETTINGS TAB ===== */}
          <TabsContent value="settings">
            {settings && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Hero Section
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Hero Title</label>
                        <Input
                          value={settings.heroTitle}
                          onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Sinhala Text</label>
                        <Input
                          value={settings.heroSinhalaText}
                          onChange={(e) => setSettings({ ...settings, heroSinhalaText: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Hero Subtitle</label>
                      <Textarea
                        value={settings.heroSubtitle}
                        onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Hero Image URL</label>
                        <Input
                          value={settings.heroImageUrl}
                          onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Hero Video URL (optional)</label>
                        <Input
                          value={settings.heroVideoUrl}
                          onChange={(e) => setSettings({ ...settings, heroVideoUrl: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Philosophy Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Title</label>
                      <Input
                        value={settings.philosophyTitle}
                        onChange={(e) => setSettings({ ...settings, philosophyTitle: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <Textarea
                        rows={4}
                        value={settings.philosophyDescription}
                        onChange={(e) => setSettings({ ...settings, philosophyDescription: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>CTA Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">CTA Title</label>
                        <Input
                          value={settings.ctaTitle}
                          onChange={(e) => setSettings({ ...settings, ctaTitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">CTA Background Image</label>
                        <Input
                          value={settings.ctaBackgroundImage}
                          onChange={(e) => setSettings({ ...settings, ctaBackgroundImage: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">CTA Subtitle</label>
                      <Textarea
                        value={settings.ctaSubtitle}
                        onChange={(e) => setSettings({ ...settings, ctaSubtitle: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <Input
                          value={settings.phoneNumber}
                          onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">WhatsApp Number</label>
                        <Input
                          value={settings.whatsappNumber}
                          onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleSaveSettings} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Settings
                </Button>
              </div>
            )}
          </TabsContent>

          {/* ===== TREATMENTS TAB ===== */}
          <TabsContent value="treatments">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Treatments</h2>
                <Button onClick={() => setShowNewTreatment(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Treatment
                </Button>
              </div>

              {/* New Treatment Form */}
              {showNewTreatment && (
                <TreatmentForm
                  onSave={handleAddTreatment}
                  onCancel={() => setShowNewTreatment(false)}
                  saving={saving}
                />
              )}

              {/* Treatment List */}
              <div className="space-y-4">
                {treatments.map((treatment) => (
                  <Card key={treatment.id} className={!treatment.isActive ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      {editingTreatment?.id === treatment.id ? (
                        <TreatmentForm
                          treatment={editingTreatment}
                          onSave={handleSaveTreatment}
                          onCancel={() => setEditingTreatment(null)}
                          saving={saving}
                        />
                      ) : (
                        <div className="flex items-center gap-4">
                          <img src={treatment.image} alt={treatment.name} className="w-20 h-20 object-cover rounded-lg" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{treatment.name}</h3>
                              <span className="text-amber-600 text-sm">{treatment.sinhala}</span>
                              {!treatment.isActive && <Badge variant="secondary">Hidden</Badge>}
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-1">{treatment.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{treatment.duration}</span>
                              <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />${treatment.price}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{treatment.locations.length} locations</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setEditingTreatment(treatment)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteTreatment(treatment.id)} className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ===== RETREATS TAB ===== */}
          <TabsContent value="retreats">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Retreats</h2>
                <Button onClick={() => setShowNewRetreat(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Retreat
                </Button>
              </div>

              {showNewRetreat && (
                <RetreatForm
                  onSave={handleAddRetreat}
                  onCancel={() => setShowNewRetreat(false)}
                  saving={saving}
                />
              )}

              <div className="space-y-4">
                {retreats.map((retreat) => (
                  <Card key={retreat.id} className={!retreat.isActive ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      {editingRetreat?.id === retreat.id ? (
                        <RetreatForm
                          retreat={editingRetreat}
                          onSave={handleSaveRetreat}
                          onCancel={() => setEditingRetreat(null)}
                          saving={saving}
                        />
                      ) : (
                        <div className="flex items-center gap-4">
                          <img src={retreat.image} alt={retreat.name} className="w-24 h-16 object-cover rounded-lg" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{retreat.name}</h3>
                              {!retreat.isActive && <Badge variant="secondary">Hidden</Badge>}
                            </div>
                            <p className="text-gray-600 text-sm">{retreat.resort}, {retreat.location}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{retreat.duration}</span>
                              <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />${retreat.price.toLocaleString()}</span>
                              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" />{retreat.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setEditingRetreat(retreat)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteRetreat(retreat.id)} className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ===== TESTIMONIALS TAB ===== */}
          <TabsContent value="testimonials">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Testimonials</h2>
                <Button onClick={() => setShowNewTestimonial(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>

              {showNewTestimonial && (
                <TestimonialForm
                  onSave={handleAddTestimonial}
                  onCancel={() => setShowNewTestimonial(false)}
                  saving={saving}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className={!testimonial.isActive ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      {editingTestimonial?.id === testimonial.id ? (
                        <TestimonialForm
                          testimonial={editingTestimonial}
                          onSave={handleSaveTestimonial}
                          onCancel={() => setEditingTestimonial(null)}
                          saving={saving}
                        />
                      ) : (
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                              <h4 className="font-semibold">{testimonial.name}</h4>
                              <p className="text-sm text-gray-500">{testimonial.title}</p>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm italic line-clamp-3">"{testimonial.quote}"</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => setEditingTestimonial(testimonial)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteTestimonial(testimonial.id)} className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
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

// ===== TREATMENT FORM COMPONENT =====
const TreatmentForm = ({ 
  treatment, 
  onSave, 
  onCancel, 
  saving 
}: { 
  treatment?: AyurvedaTreatment; 
  onSave: (t: any) => void; 
  onCancel: () => void; 
  saving: boolean;
}) => {
  const [form, setForm] = useState<Partial<AyurvedaTreatment>>(treatment || {
    name: '', sinhala: '', duration: '', price: 0, image: '', description: '', fullDescription: '',
    benefits: [], bestFor: [], whatToExpect: [], preparation: [], locations: [], contraindications: [],
    isActive: true, order: 1
  });
  const [benefitsText, setBenefitsText] = useState(form.benefits?.join('\n') || '');
  const [bestForText, setBestForText] = useState(form.bestFor?.join('\n') || '');
  const [expectText, setExpectText] = useState(form.whatToExpect?.join('\n') || '');
  const [prepText, setPrepText] = useState(form.preparation?.join('\n') || '');
  const [contraText, setContraText] = useState(form.contraindications?.join('\n') || '');
  const [locationsText, setLocationsText] = useState(form.locations?.map(l => `${l.name}|${l.area}|${l.rating}`).join('\n') || '');

  const handleSubmit = () => {
    const data = {
      ...form,
      benefits: benefitsText.split('\n').filter(Boolean),
      bestFor: bestForText.split('\n').filter(Boolean),
      whatToExpect: expectText.split('\n').filter(Boolean),
      preparation: prepText.split('\n').filter(Boolean),
      contraindications: contraText.split('\n').filter(Boolean),
      locations: locationsText.split('\n').filter(Boolean).map(l => {
        const [name, area, rating] = l.split('|');
        return { name, area, rating: parseFloat(rating) || 5 };
      })
    };
    onSave(data);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Sinhala Name</label>
          <Input value={form.sinhala} onChange={(e) => setForm({ ...form, sinhala: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Duration</label>
          <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="60 min" />
        </div>
        <div>
          <label className="text-sm font-medium">Price ($)</label>
          <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Image URL</label>
        <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium">Short Description</label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
      </div>
      <div>
        <label className="text-sm font-medium">Full Description</label>
        <Textarea value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Benefits (one per line)</label>
          <Textarea value={benefitsText} onChange={(e) => setBenefitsText(e.target.value)} rows={4} />
        </div>
        <div>
          <label className="text-sm font-medium">Best For (one per line)</label>
          <Textarea value={bestForText} onChange={(e) => setBestForText(e.target.value)} rows={4} />
        </div>
        <div>
          <label className="text-sm font-medium">What to Expect (one per line)</label>
          <Textarea value={expectText} onChange={(e) => setExpectText(e.target.value)} rows={4} />
        </div>
        <div>
          <label className="text-sm font-medium">Preparation (one per line)</label>
          <Textarea value={prepText} onChange={(e) => setPrepText(e.target.value)} rows={4} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Locations (name|area|rating per line)</label>
        <Textarea value={locationsText} onChange={(e) => setLocationsText(e.target.value)} rows={3} placeholder="Anantara Peace Haven|Tangalle|5.0" />
      </div>
      <div>
        <label className="text-sm font-medium">Contraindications (one per line)</label>
        <Textarea value={contraText} onChange={(e) => setContraText(e.target.value)} rows={2} />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
          <span className="text-sm">Active</span>
        </label>
        <div>
          <label className="text-sm font-medium mr-2">Order:</label>
          <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })} className="w-20 inline-block" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

// ===== RETREAT FORM COMPONENT =====
const RetreatForm = ({ retreat, onSave, onCancel, saving }: { retreat?: WellnessRetreat; onSave: (r: any) => void; onCancel: () => void; saving: boolean; }) => {
  const [form, setForm] = useState<Partial<WellnessRetreat>>(retreat || {
    name: '', duration: '', price: 0, image: '', resort: '', location: '', rating: 5, highlights: [], description: '', fullDescription: '', includes: [], isActive: true, order: 1
  });
  const [highlightsText, setHighlightsText] = useState(form.highlights?.join('\n') || '');
  const [includesText, setIncludesText] = useState(form.includes?.join('\n') || '');

  const handleSubmit = () => {
    onSave({
      ...form,
      highlights: highlightsText.split('\n').filter(Boolean),
      includes: includesText.split('\n').filter(Boolean)
    });
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Retreat Name</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Duration</label>
          <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="14 Nights" />
        </div>
        <div>
          <label className="text-sm font-medium">Price ($)</label>
          <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} />
        </div>
        <div>
          <label className="text-sm font-medium">Rating</label>
          <Input type="number" step="0.1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })} />
        </div>
        <div>
          <label className="text-sm font-medium">Resort Name</label>
          <Input value={form.resort} onChange={(e) => setForm({ ...form, resort: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Location</label>
          <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Image URL</label>
        <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium">Short Description</label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
      </div>
      <div>
        <label className="text-sm font-medium">Full Description</label>
        <Textarea value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Highlights (one per line)</label>
          <Textarea value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} rows={4} />
        </div>
        <div>
          <label className="text-sm font-medium">Package Includes (one per line)</label>
          <Textarea value={includesText} onChange={(e) => setIncludesText(e.target.value)} rows={4} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
          <span className="text-sm">Active</span>
        </label>
        <div>
          <label className="text-sm font-medium mr-2">Order:</label>
          <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })} className="w-20 inline-block" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

// ===== TESTIMONIAL FORM COMPONENT =====
const TestimonialForm = ({ testimonial, onSave, onCancel, saving }: { testimonial?: AyurvedaTestimonial; onSave: (t: any) => void; onCancel: () => void; saving: boolean; }) => {
  const [form, setForm] = useState<Partial<AyurvedaTestimonial>>(testimonial || {
    name: '', title: '', image: '', quote: '', rating: 5, program: '', isActive: true, order: 1
  });

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Title/Location</label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="London, UK" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Image URL</label>
          <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Program</label>
          <Input value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} placeholder="Royal Panchakarma Retreat" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Quote</label>
        <Textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={3} />
      </div>
      <div className="flex items-center gap-4">
        <div>
          <label className="text-sm font-medium mr-2">Rating:</label>
          <Input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} className="w-20 inline-block" />
        </div>
        <label className="flex items-center gap-2">
          <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
          <span className="text-sm">Active</span>
        </label>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(form)} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default AyurvedaAdmin;
