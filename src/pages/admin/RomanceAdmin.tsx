import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, Loader2, Heart, Settings, FileText, Quote, Star, Clock, DollarSign, Users, HelpCircle, CalendarCheck, Eye, CheckCircle, XCircle, Mail, Phone } from 'lucide-react';
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
  getRomanceSettings, updateRomanceSettings,
  getWeddingPackages, addWeddingPackage, updateWeddingPackage, deleteWeddingPackage,
  getHoneymoonPackages, addHoneymoonPackage, updateHoneymoonPackage, deleteHoneymoonPackage,
  getRomanceFAQs, addRomanceFAQ, updateRomanceFAQ, deleteRomanceFAQ,
  getRomanceTestimonials, addRomanceTestimonial, updateRomanceTestimonial, deleteRomanceTestimonial,
  getRomanceBookings, updateRomanceBookingStatus,
  RomancePageSettings, WeddingPackage, HoneymoonPackage, RomanceFAQ, RomanceTestimonial, RomanceBooking
} from '@/services/romanceService';

const RomanceAdmin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings');

  const [settings, setSettings] = useState<RomancePageSettings | null>(null);
  const [weddingPkgs, setWeddingPkgs] = useState<WeddingPackage[]>([]);
  const [honeymoonPkgs, setHoneymoonPkgs] = useState<HoneymoonPackage[]>([]);
  const [faqs, setFaqs] = useState<RomanceFAQ[]>([]);
  const [testimonials, setTestimonials] = useState<RomanceTestimonial[]>([]);
  const [bookings, setBookings] = useState<RomanceBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<RomanceBooking | null>(null);

  const [editingWedding, setEditingWedding] = useState<WeddingPackage | null>(null);
  const [editingHoneymoon, setEditingHoneymoon] = useState<HoneymoonPackage | null>(null);
  const [editingFaq, setEditingFaq] = useState<RomanceFAQ | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<RomanceTestimonial | null>(null);
  const [showNew, setShowNew] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [s, w, h, f, t, b] = await Promise.all([getRomanceSettings(), getWeddingPackages(), getHoneymoonPackages(), getRomanceFAQs(), getRomanceTestimonials(), getRomanceBookings()]);
    setSettings(s); setWeddingPkgs(w); setHoneymoonPkgs(h); setFaqs(f); setTestimonials(t); setBookings(b);
    setLoading(false);
  };

  const handleSaveSettings = async () => { if (!settings) return; setSaving(true); await updateRomanceSettings(settings); setSaving(false); toast({ title: 'Settings saved!' }); };

  // Wedding handlers
  const handleSaveWedding = async (pkg: WeddingPackage) => { setSaving(true); await updateWeddingPackage(pkg.id, pkg); setWeddingPkgs(prev => prev.map(p => p.id === pkg.id ? pkg : p)); setEditingWedding(null); setSaving(false); toast({ title: 'Updated!' }); };
  const handleAddWedding = async (pkg: Omit<WeddingPackage, 'id'>) => { setSaving(true); const id = await addWeddingPackage(pkg); if (id) setWeddingPkgs(prev => [...prev, { ...pkg, id }]); setShowNew(null); setSaving(false); toast({ title: 'Added!' }); };
  const handleDeleteWedding = async (id: string) => { if (!confirm('Delete?')) return; await deleteWeddingPackage(id); setWeddingPkgs(prev => prev.filter(p => p.id !== id)); toast({ title: 'Deleted!' }); };

  // Honeymoon handlers
  const handleSaveHoneymoon = async (pkg: HoneymoonPackage) => { setSaving(true); await updateHoneymoonPackage(pkg.id, pkg); setHoneymoonPkgs(prev => prev.map(p => p.id === pkg.id ? pkg : p)); setEditingHoneymoon(null); setSaving(false); toast({ title: 'Updated!' }); };
  const handleAddHoneymoon = async (pkg: Omit<HoneymoonPackage, 'id'>) => { setSaving(true); const id = await addHoneymoonPackage(pkg); if (id) setHoneymoonPkgs(prev => [...prev, { ...pkg, id }]); setShowNew(null); setSaving(false); toast({ title: 'Added!' }); };
  const handleDeleteHoneymoon = async (id: string) => { if (!confirm('Delete?')) return; await deleteHoneymoonPackage(id); setHoneymoonPkgs(prev => prev.filter(p => p.id !== id)); toast({ title: 'Deleted!' }); };

  // FAQ handlers
  const handleSaveFaq = async (faq: RomanceFAQ) => { setSaving(true); await updateRomanceFAQ(faq.id, faq); setFaqs(prev => prev.map(f => f.id === faq.id ? faq : f)); setEditingFaq(null); setSaving(false); toast({ title: 'Updated!' }); };
  const handleAddFaq = async (faq: Omit<RomanceFAQ, 'id'>) => { setSaving(true); const id = await addRomanceFAQ(faq); if (id) setFaqs(prev => [...prev, { ...faq, id }]); setShowNew(null); setSaving(false); toast({ title: 'Added!' }); };
  const handleDeleteFaq = async (id: string) => { if (!confirm('Delete?')) return; await deleteRomanceFAQ(id); setFaqs(prev => prev.filter(f => f.id !== id)); toast({ title: 'Deleted!' }); };

  // Testimonial handlers
  const handleSaveTestimonial = async (t: RomanceTestimonial) => { setSaving(true); await updateRomanceTestimonial(t.id, t); setTestimonials(prev => prev.map(x => x.id === t.id ? t : x)); setEditingTestimonial(null); setSaving(false); toast({ title: 'Updated!' }); };
  const handleAddTestimonial = async (t: Omit<RomanceTestimonial, 'id'>) => { setSaving(true); const id = await addRomanceTestimonial(t); if (id) setTestimonials(prev => [...prev, { ...t, id }]); setShowNew(null); setSaving(false); toast({ title: 'Added!' }); };
  const handleDeleteTestimonial = async (id: string) => { if (!confirm('Delete?')) return; await deleteRomanceTestimonial(id); setTestimonials(prev => prev.filter(t => t.id !== id)); toast({ title: 'Deleted!' }); };

  // Booking handlers
  const handleUpdateBookingStatus = async (id: string, status: RomanceBooking['status']) => {
    setSaving(true);
    await updateRomanceBookingStatus(id, status);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    setSaving(false);
    toast({ title: `Booking ${status}!` });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-rose-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-rose-700 to-pink-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2"><Heart className="w-8 h-8" /><h1 className="text-3xl font-bold">Romance Admin</h1></div>
          <p className="text-rose-100">Manage weddings, honeymoons, FAQs & testimonials</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full max-w-4xl mb-8">
            <TabsTrigger value="bookings"><CalendarCheck className="w-4 h-4 mr-1" />Bookings ({bookings.length})</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-1" />Settings</TabsTrigger>
            <TabsTrigger value="weddings"><Heart className="w-4 h-4 mr-1" />Weddings ({weddingPkgs.length})</TabsTrigger>
            <TabsTrigger value="honeymoons"><FileText className="w-4 h-4 mr-1" />Honeymoons ({honeymoonPkgs.length})</TabsTrigger>
            <TabsTrigger value="faqs"><HelpCircle className="w-4 h-4 mr-1" />FAQs ({faqs.length})</TabsTrigger>
            <TabsTrigger value="testimonials"><Quote className="w-4 h-4 mr-1" />Reviews ({testimonials.length})</TabsTrigger>
          </TabsList>

          {/* BOOKINGS */}
          <TabsContent value="bookings">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Booking Enquiries</h2>
                <div className="flex gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800">{bookings.filter(b => b.status === 'pending').length} Pending</Badge>
                  <Badge className="bg-green-100 text-green-800">{bookings.filter(b => b.status === 'confirmed').length} Confirmed</Badge>
                </div>
              </div>
              
              {bookings.length === 0 ? (
                <Card><CardContent className="p-8 text-center text-gray-500">No bookings yet</CardContent></Card>
              ) : (
                bookings.map(booking => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className={`w-2 ${booking.status === 'pending' ? 'bg-yellow-500' : booking.status === 'confirmed' ? 'bg-green-500' : booking.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'}`} />
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">{booking.firstName} {booking.lastName}</h3>
                                <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                                <Badge variant="outline">{booking.type}</Badge>
                              </div>
                              <p className="text-rose-600 font-medium">{booking.packageName}</p>
                              <p className="text-gray-500 text-sm">Ref: {booking.bookingRef}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-light text-rose-600">${booking.totalAmount.toLocaleString()}</p>
                              <p className="text-gray-500 text-sm">{booking.guests} guests</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4 bg-gray-50 p-3 rounded-lg">
                            <div><span className="text-gray-500">Date:</span><br/><strong>{booking.eventDate}</strong></div>
                            <div className="flex items-center gap-1"><Mail className="w-4 h-4 text-gray-400" /><a href={`mailto:${booking.email}`} className="text-rose-600 hover:underline">{booking.email}</a></div>
                            <div className="flex items-center gap-1"><Phone className="w-4 h-4 text-gray-400" /><a href={`tel:${booking.phone}`} className="text-rose-600 hover:underline">{booking.phone}</a></div>
                            <div><span className="text-gray-500">Country:</span><br/><strong>{booking.country}</strong></div>
                          </div>

                          {booking.specialRequests && (
                            <div className="mb-4 p-3 bg-rose-50 rounded-lg">
                              <span className="text-gray-500 text-sm">Special Requests:</span>
                              <p className="text-gray-700">{booking.specialRequests}</p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            {booking.status === 'pending' && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdateBookingStatus(booking.id!, 'confirmed')} disabled={saving}>
                                  <CheckCircle className="w-4 h-4 mr-1" />Confirm
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 border-red-300" onClick={() => handleUpdateBookingStatus(booking.id!, 'cancelled')} disabled={saving}>
                                  <XCircle className="w-4 h-4 mr-1" />Reject
                                </Button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleUpdateBookingStatus(booking.id!, 'completed')} disabled={saving}>
                                <CheckCircle className="w-4 h-4 mr-1" />Mark Complete
                              </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => window.open(`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}`, '_blank')}>
                              WhatsApp
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* SETTINGS */}
          <TabsContent value="settings">
            {settings && (
              <div className="space-y-6">
                <Card><CardHeader><CardTitle>Hero Section</CardTitle></CardHeader><CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium">Hero Title</label><Input value={settings.heroTitle} onChange={e => setSettings({...settings, heroTitle: e.target.value})} /></div>
                    <div><label className="text-sm font-medium">Hero Subtitle</label><Input value={settings.heroSubtitle} onChange={e => setSettings({...settings, heroSubtitle: e.target.value})} /></div>
                  </div>
                  <div><label className="text-sm font-medium">Hero Image URL</label><Input value={settings.heroImageUrl} onChange={e => setSettings({...settings, heroImageUrl: e.target.value})} /></div>
                </CardContent></Card>
                <Card><CardHeader><CardTitle>Intro Text</CardTitle></CardHeader><CardContent className="space-y-4">
                  <div><label className="text-sm font-medium">Wedding Intro</label><Textarea value={settings.weddingIntro} onChange={e => setSettings({...settings, weddingIntro: e.target.value})} rows={2} /></div>
                  <div><label className="text-sm font-medium">Honeymoon Intro</label><Textarea value={settings.honeymoonIntro} onChange={e => setSettings({...settings, honeymoonIntro: e.target.value})} rows={2} /></div>
                </CardContent></Card>
                <Card><CardHeader><CardTitle>Contact</CardTitle></CardHeader><CardContent className="grid grid-cols-3 gap-4">
                  <div><label className="text-sm font-medium">Phone</label><Input value={settings.phoneNumber} onChange={e => setSettings({...settings, phoneNumber: e.target.value})} /></div>
                  <div><label className="text-sm font-medium">WhatsApp</label><Input value={settings.whatsappNumber} onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} /></div>
                  <div><label className="text-sm font-medium">Email</label><Input value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} /></div>
                </CardContent></Card>
                <Button onClick={handleSaveSettings} disabled={saving} className="bg-rose-600 hover:bg-rose-700">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save Settings</Button>
              </div>
            )}
          </TabsContent>

          {/* WEDDINGS */}
          <TabsContent value="weddings">
            <div className="space-y-4">
              <div className="flex justify-between"><h2 className="text-xl font-semibold">Wedding Packages</h2><Button onClick={() => setShowNew('wedding')} className="bg-rose-600"><Plus className="w-4 h-4 mr-2" />Add Package</Button></div>
              {showNew === 'wedding' && <WeddingForm onSave={handleAddWedding} onCancel={() => setShowNew(null)} saving={saving} />}
              {weddingPkgs.map(pkg => (
                <Card key={pkg.id} className={!pkg.isActive ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    {editingWedding?.id === pkg.id ? <WeddingForm pkg={editingWedding} onSave={handleSaveWedding} onCancel={() => setEditingWedding(null)} saving={saving} /> : (
                      <div className="flex items-center gap-4">
                        <img src={pkg.image} alt={pkg.name} className="w-24 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1"><h3 className="font-semibold">{pkg.name}</h3><Badge variant="outline">{pkg.type}</Badge>{pkg.isFeatured && <Badge className="bg-amber-500">Featured</Badge>}</div>
                          <p className="text-gray-500 text-sm">${pkg.priceFrom.toLocaleString()} • Up to {pkg.guestsUpTo} guests</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingWedding(pkg)}><Edit2 className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteWedding(pkg.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* HONEYMOONS */}
          <TabsContent value="honeymoons">
            <div className="space-y-4">
              <div className="flex justify-between"><h2 className="text-xl font-semibold">Honeymoon Packages</h2><Button onClick={() => setShowNew('honeymoon')} className="bg-rose-600"><Plus className="w-4 h-4 mr-2" />Add Package</Button></div>
              {showNew === 'honeymoon' && <HoneymoonForm onSave={handleAddHoneymoon} onCancel={() => setShowNew(null)} saving={saving} />}
              {honeymoonPkgs.map(pkg => (
                <Card key={pkg.id} className={!pkg.isActive ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    {editingHoneymoon?.id === pkg.id ? <HoneymoonForm pkg={editingHoneymoon} onSave={handleSaveHoneymoon} onCancel={() => setEditingHoneymoon(null)} saving={saving} /> : (
                      <div className="flex items-center gap-4">
                        <img src={pkg.image} alt={pkg.name} className="w-24 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1"><h3 className="font-semibold">{pkg.name}</h3><Badge variant="outline">{pkg.tier}</Badge>{pkg.isFeatured && <Badge className="bg-amber-500">Featured</Badge>}</div>
                          <p className="text-gray-500 text-sm">${pkg.priceFrom.toLocaleString()} • {pkg.nights} nights</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingHoneymoon(pkg)}><Edit2 className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteHoneymoon(pkg.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FAQS */}
          <TabsContent value="faqs">
            <div className="space-y-4">
              <div className="flex justify-between"><h2 className="text-xl font-semibold">FAQs</h2><Button onClick={() => setShowNew('faq')} className="bg-rose-600"><Plus className="w-4 h-4 mr-2" />Add FAQ</Button></div>
              {showNew === 'faq' && <FaqForm onSave={handleAddFaq} onCancel={() => setShowNew(null)} saving={saving} />}
              {faqs.map(faq => (
                <Card key={faq.id}><CardContent className="p-4">
                  {editingFaq?.id === faq.id ? <FaqForm faq={editingFaq} onSave={handleSaveFaq} onCancel={() => setEditingFaq(null)} saving={saving} /> : (
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1"><Badge variant="outline">{faq.category}</Badge><h4 className="font-medium">{faq.question}</h4></div>
                        <p className="text-gray-500 text-sm line-clamp-2">{faq.answer}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingFaq(faq)}><Edit2 className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteFaq(faq.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  )}
                </CardContent></Card>
              ))}
            </div>
          </TabsContent>

          {/* TESTIMONIALS */}
          <TabsContent value="testimonials">
            <div className="space-y-4">
              <div className="flex justify-between"><h2 className="text-xl font-semibold">Testimonials</h2><Button onClick={() => setShowNew('testimonial')} className="bg-rose-600"><Plus className="w-4 h-4 mr-2" />Add Testimonial</Button></div>
              {showNew === 'testimonial' && <TestimonialForm onSave={handleAddTestimonial} onCancel={() => setShowNew(null)} saving={saving} />}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map(t => (
                  <Card key={t.id}><CardContent className="p-4">
                    {editingTestimonial?.id === t.id ? <TestimonialForm testimonial={editingTestimonial} onSave={handleSaveTestimonial} onCancel={() => setEditingTestimonial(null)} saving={saving} /> : (
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <img src={t.image} alt={t.names} className="w-12 h-12 rounded-full object-cover" />
                          <div><h4 className="font-semibold">{t.names}</h4><p className="text-sm text-gray-500">{t.country} • {t.type}</p></div>
                        </div>
                        <p className="text-gray-600 text-sm italic line-clamp-2">"{t.quote}"</p>
                        <div className="flex justify-between mt-3">
                          <div className="flex">{[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingTestimonial(t)}><Edit2 className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteTestimonial(t.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent></Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Forms
const WeddingForm = ({ pkg, onSave, onCancel, saving }: { pkg?: WeddingPackage; onSave: (p: any) => void; onCancel: () => void; saving: boolean }) => {
  const [form, setForm] = useState<Partial<WeddingPackage>>(pkg || { name: '', tagline: '', type: 'beach', priceFrom: 0, guestsUpTo: 50, image: '', gallery: [], description: '', fullDescription: '', includes: [], highlights: [], venues: [], addOns: [], isActive: true, isFeatured: false, order: 1 });
  const [includesText, setIncludesText] = useState(form.includes?.join('\n') || '');
  const [highlightsText, setHighlightsText] = useState(form.highlights?.join('\n') || '');
  const [venuesText, setVenuesText] = useState(form.venues?.join('\n') || '');

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Name</label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
        <div><label className="text-sm font-medium">Tagline</label><Input value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} /></div>
        <div><label className="text-sm font-medium">Type</label>
          <Select value={form.type} onValueChange={v => setForm({...form, type: v as any})}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="beach">Beach</SelectItem><SelectItem value="elephant">Elephant</SelectItem><SelectItem value="cultural">Cultural</SelectItem><SelectItem value="tea-country">Tea Country</SelectItem><SelectItem value="elopement">Elopement</SelectItem><SelectItem value="luxury">Luxury</SelectItem></SelectContent>
          </Select></div>
        <div><label className="text-sm font-medium">Price From ($)</label><Input type="number" value={form.priceFrom} onChange={e => setForm({...form, priceFrom: parseInt(e.target.value)})} /></div>
        <div><label className="text-sm font-medium">Guests Up To</label><Input type="number" value={form.guestsUpTo} onChange={e => setForm({...form, guestsUpTo: parseInt(e.target.value)})} /></div>
        <div><label className="text-sm font-medium">Image URL</label><Input value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
      </div>
      <div><label className="text-sm font-medium">Short Description</label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} /></div>
      <div><label className="text-sm font-medium">Full Description</label><Textarea value={form.fullDescription} onChange={e => setForm({...form, fullDescription: e.target.value})} rows={3} /></div>
      <div className="grid grid-cols-3 gap-4">
        <div><label className="text-sm font-medium">Includes (one/line)</label><Textarea value={includesText} onChange={e => setIncludesText(e.target.value)} rows={4} /></div>
        <div><label className="text-sm font-medium">Highlights (one/line)</label><Textarea value={highlightsText} onChange={e => setHighlightsText(e.target.value)} rows={4} /></div>
        <div><label className="text-sm font-medium">Venues (one/line)</label><Textarea value={venuesText} onChange={e => setVenuesText(e.target.value)} rows={4} /></div>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2"><Switch checked={form.isActive} onCheckedChange={v => setForm({...form, isActive: v})} /><span className="text-sm">Active</span></label>
        <label className="flex items-center gap-2"><Switch checked={form.isFeatured} onCheckedChange={v => setForm({...form, isFeatured: v})} /><span className="text-sm">Featured</span></label>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave({...form, includes: includesText.split('\n').filter(Boolean), highlights: highlightsText.split('\n').filter(Boolean), venues: venuesText.split('\n').filter(Boolean)})} disabled={saving} className="bg-rose-600">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

const HoneymoonForm = ({ pkg, onSave, onCancel, saving }: { pkg?: HoneymoonPackage; onSave: (p: any) => void; onCancel: () => void; saving: boolean }) => {
  const [form, setForm] = useState<Partial<HoneymoonPackage>>(pkg || { name: '', tagline: '', tier: 'signature', priceFrom: 0, nights: 7, image: '', gallery: [], description: '', fullDescription: '', highlights: [], includes: [], itinerary: [], isActive: true, isFeatured: false, order: 1 });
  const [highlightsText, setHighlightsText] = useState(form.highlights?.join('\n') || '');
  const [includesText, setIncludesText] = useState(form.includes?.join('\n') || '');

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Name</label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
        <div><label className="text-sm font-medium">Tagline</label><Input value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} /></div>
        <div><label className="text-sm font-medium">Tier</label>
          <Select value={form.tier} onValueChange={v => setForm({...form, tier: v as any})}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="budget">Budget</SelectItem><SelectItem value="signature">Signature</SelectItem><SelectItem value="luxury">Luxury</SelectItem></SelectContent>
          </Select></div>
        <div><label className="text-sm font-medium">Price From ($)</label><Input type="number" value={form.priceFrom} onChange={e => setForm({...form, priceFrom: parseInt(e.target.value)})} /></div>
        <div><label className="text-sm font-medium">Nights</label><Input type="number" value={form.nights} onChange={e => setForm({...form, nights: parseInt(e.target.value)})} /></div>
        <div><label className="text-sm font-medium">Image URL</label><Input value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
      </div>
      <div><label className="text-sm font-medium">Short Description</label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Highlights (one/line)</label><Textarea value={highlightsText} onChange={e => setHighlightsText(e.target.value)} rows={4} /></div>
        <div><label className="text-sm font-medium">Includes (one/line)</label><Textarea value={includesText} onChange={e => setIncludesText(e.target.value)} rows={4} /></div>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2"><Switch checked={form.isActive} onCheckedChange={v => setForm({...form, isActive: v})} /><span className="text-sm">Active</span></label>
        <label className="flex items-center gap-2"><Switch checked={form.isFeatured} onCheckedChange={v => setForm({...form, isFeatured: v})} /><span className="text-sm">Featured</span></label>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave({...form, highlights: highlightsText.split('\n').filter(Boolean), includes: includesText.split('\n').filter(Boolean)})} disabled={saving} className="bg-rose-600">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

const FaqForm = ({ faq, onSave, onCancel, saving }: { faq?: RomanceFAQ; onSave: (f: any) => void; onCancel: () => void; saving: boolean }) => {
  const [form, setForm] = useState<Partial<RomanceFAQ>>(faq || { question: '', answer: '', category: 'general', isActive: true, order: 1 });
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3"><label className="text-sm font-medium">Question</label><Input value={form.question} onChange={e => setForm({...form, question: e.target.value})} /></div>
        <div><label className="text-sm font-medium">Category</label>
          <Select value={form.category} onValueChange={v => setForm({...form, category: v as any})}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="wedding">Wedding</SelectItem><SelectItem value="honeymoon">Honeymoon</SelectItem><SelectItem value="general">General</SelectItem></SelectContent>
          </Select></div>
      </div>
      <div><label className="text-sm font-medium">Answer</label><Textarea value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} rows={3} /></div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(form)} disabled={saving} className="bg-rose-600">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

const TestimonialForm = ({ testimonial, onSave, onCancel, saving }: { testimonial?: RomanceTestimonial; onSave: (t: any) => void; onCancel: () => void; saving: boolean }) => {
  const [form, setForm] = useState<Partial<RomanceTestimonial>>(testimonial || { names: '', country: '', image: '', quote: '', type: 'wedding', package: '', rating: 5, isActive: true, order: 1 });
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Names</label><Input value={form.names} onChange={e => setForm({...form, names: e.target.value})} placeholder="e.g., John & Jane" /></div>
        <div><label className="text-sm font-medium">Country</label><Input value={form.country} onChange={e => setForm({...form, country: e.target.value})} /></div>
        <div><label className="text-sm font-medium">Image URL</label><Input value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
        <div><label className="text-sm font-medium">Type</label>
          <Select value={form.type} onValueChange={v => setForm({...form, type: v as any})}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="wedding">Wedding</SelectItem><SelectItem value="honeymoon">Honeymoon</SelectItem></SelectContent>
          </Select></div>
      </div>
      <div><label className="text-sm font-medium">Quote</label><Textarea value={form.quote} onChange={e => setForm({...form, quote: e.target.value})} rows={3} /></div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(form)} disabled={saving} className="bg-rose-600">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default RomanceAdmin;
