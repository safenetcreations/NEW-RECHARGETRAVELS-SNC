import React, { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Car, Edit2, Plus, Trash2, Users, Luggage, Star } from 'lucide-react';

interface VehicleCategory {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  icon?: string | null;
  is_hero?: boolean;
  hero_order?: number;
  hero_images?: string[];
}

interface Vehicle {
  id: string;
  category_id: string;
  make: string;
  model: string;
  year: number | null;
  seats: number;
  luggage_capacity: number;
  has_child_seat: boolean;
  has_ac: boolean;
  has_wifi: boolean;
  daily_rate: number;
  extra_km_rate: number;
  image_urls: string[];
  description?: string | null;
  features?: string[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface FleetPageSettings {
  seoTitle: string;
  seoDescription: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaLink: string;
  heroOverlayTitle: string;
  heroOverlaySubtitle: string;
  sectionTitle: string;
  sectionSubtitle: string;
  badge1Label: string;
  badge2Label: string;
  badge3Label: string;
  statsVehiclesFallback: string;
  statsSeatsFallback: string;
  statsAcFallback: string;
}

const DEFAULT_FLEET_PAGE_SETTINGS: FleetPageSettings = {
  seoTitle: 'Our Vehicle Fleet | Chauffeur-Driven Cars, Vans & SUVs - Recharge Travels',
  seoDescription:
    'Browse our private fleet of chauffeur-driven cars, vans, SUVs and minibuses in Sri Lanka. All vehicles include licensed drivers and comfortable, air-conditioned interiors for airport transfers and tours.',
  heroBadge: 'Our Private Fleet',
  heroTitle: 'Chauffeur-driven vehicles for every journey',
  heroSubtitle:
    'Choose from sedans, SUVs, vans and luxury vehicles with trusted, professional drivers anywhere in Sri Lanka.',
  heroPrimaryCtaLabel: 'Get a custom quote',
  heroPrimaryCtaLink: '/vehicle-rental',
  heroOverlayTitle: 'Airport, round trips & custom tours',
  heroOverlaySubtitle: 'Licensed, insured and regularly serviced vehicles',
  sectionTitle: 'Fleet for every traveller',
  sectionSubtitle:
    'From solo business trips to big family holidays, pick the vehicle class that matches your journey.',
  badge1Label: 'Driver included',
  badge2Label: 'Luggage friendly',
  badge3Label: 'Hand-picked fleet',
  statsVehiclesFallback: '10+',
  statsSeatsFallback: '40+',
  statsAcFallback: 'All',
};

const FleetVehiclesManager: React.FC = () => {
  const [tab, setTab] = useState<'vehicles' | 'categories'>('vehicles');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSettings, setPageSettings] = useState<FleetPageSettings | null>(null);
  const [savingPage, setSavingPage] = useState(false);

  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleForm, setVehicleForm] = useState({
    category_id: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    seats: 4,
    luggage_capacity: 2,
    has_child_seat: false,
    has_ac: true,
    has_wifi: false,
    daily_rate: 0,
    extra_km_rate: 0,
    description: '',
    featuresText: '',
    imagesText: '',
    is_active: true,
  });

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<VehicleCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    is_hero: false,
    hero_order: 1,
    heroImagesText: '',
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [catSnap, vehSnap, settingsSnap] = await Promise.all([
        getDocs(query(collection(db, 'vehicle_categories'), orderBy('name'))),
        getDocs(query(collection(db, 'vehicles'), orderBy('created_at', 'desc'))),
        getDoc(doc(db, 'cmsContent', 'fleetPageSettings')),
      ]);

      const catData = catSnap.docs.map(d => ({ id: d.id, ...d.data() } as VehicleCategory));
      setCategories(catData || []);

      const vehData = vehSnap.docs.map(d => ({ id: d.id, ...d.data() } as Vehicle));
      setVehicles(vehData || []);

      if (settingsSnap.exists()) {
        const data = settingsSnap.data() as Partial<FleetPageSettings>;
        setPageSettings({ ...DEFAULT_FLEET_PAGE_SETTINGS, ...data });
      } else {
        setPageSettings(DEFAULT_FLEET_PAGE_SETTINGS);
      }
    } catch (error) {
      console.error('Error loading fleet data:', error);
      toast.error('Failed to load fleet data');
      // Ensure the Page Content tab never stays stuck on a loading state
      if (!pageSettings) {
        setPageSettings(DEFAULT_FLEET_PAGE_SETTINGS);
      }
    } finally {
      setLoading(false);
    }
  };

  const heroCategories = useMemo(
    () =>
      categories
        .filter((c) => c.is_hero)
        .sort((a, b) => (a.hero_order ?? 999) - (b.hero_order ?? 999))
        .slice(0, 4),
    [categories]
  );

  const handlePageSettingChange = <K extends keyof FleetPageSettings>(key: K, value: FleetPageSettings[K]) => {
    setPageSettings(prev => (prev ? { ...prev, [key]: value } : prev));
  };

  const saveFleetPageSettings = async () => {
    if (!pageSettings) return;

    try {
      setSavingPage(true);
      await setDoc(doc(db, 'cmsContent', 'fleetPageSettings'), pageSettings, { merge: true });
      toast.success('Fleet page content saved');
    } catch (error) {
      console.error('Error saving fleet page settings:', error);
      toast.error('Failed to save fleet page content');
    } finally {
      setSavingPage(false);
    }
  };

  const startCreateVehicle = () => {
    setEditingVehicle(null);
    setVehicleForm({
      category_id: categories[0]?.id || '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      seats: 4,
      luggage_capacity: 2,
      has_child_seat: false,
      has_ac: true,
      has_wifi: false,
      daily_rate: 0,
      extra_km_rate: 0,
      description: '',
      featuresText: '',
      imagesText: '',
      is_active: true,
    });
    setVehicleDialogOpen(true);
  };

  const startEditVehicle = (v: Vehicle) => {
    setEditingVehicle(v);
    setVehicleForm({
      category_id: v.category_id,
      make: v.make,
      model: v.model,
      year: v.year || new Date().getFullYear(),
      seats: v.seats,
      luggage_capacity: v.luggage_capacity,
      has_child_seat: v.has_child_seat,
      has_ac: v.has_ac,
      has_wifi: v.has_wifi,
      daily_rate: v.daily_rate,
      extra_km_rate: v.extra_km_rate,
      description: v.description || '',
      featuresText: (v.features || []).join(', '),
      imagesText: (v.image_urls || []).join('\n'),
      is_active: v.is_active,
    });
    setVehicleDialogOpen(true);
  };

  const saveVehicle = async () => {
    try {
      const image_urls = vehicleForm.imagesText
        .split('\n')
        .map((u) => u.trim())
        .filter((u) => u.length > 0);
      const features = vehicleForm.featuresText
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const payload = {
        category_id: vehicleForm.category_id,
        make: vehicleForm.make,
        model: vehicleForm.model,
        year: Number(vehicleForm.year) || null,
        seats: Number(vehicleForm.seats) || 0,
        luggage_capacity: Number(vehicleForm.luggage_capacity) || 0,
        has_child_seat: vehicleForm.has_child_seat,
        has_ac: vehicleForm.has_ac,
        has_wifi: vehicleForm.has_wifi,
        daily_rate: Number(vehicleForm.daily_rate) || 0,
        extra_km_rate: Number(vehicleForm.extra_km_rate) || 0,
        description: vehicleForm.description || '',
        features,
        image_urls,
        is_active: vehicleForm.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editingVehicle) {
        await updateDoc(doc(db, 'vehicles', editingVehicle.id), payload as any);
        toast.success('Vehicle updated');
      } else {
        await addDoc(collection(db, 'vehicles'), {
          ...payload,
          created_at: new Date().toISOString(),
        } as any);
        toast.success('Vehicle created');
      }

      setVehicleDialogOpen(false);
      setEditingVehicle(null);
      loadAll();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error('Failed to save vehicle');
    }
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm('Delete this vehicle?')) return;
    try {
      await deleteDoc(doc(db, 'vehicles', id));
      toast.success('Vehicle deleted');
      loadAll();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    }
  };

  const startCreateCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      icon: '',
      is_hero: false,
      hero_order: 1,
      heroImagesText: '',
    });
    setCategoryDialogOpen(true);
  };

  const startEditCategory = (c: VehicleCategory) => {
    setEditingCategory(c);
    setCategoryForm({
      name: c.name,
      slug: c.slug || '',
      description: c.description || '',
      icon: c.icon || '',
      is_hero: !!c.is_hero,
      hero_order: c.hero_order ?? 1,
      heroImagesText: (c.hero_images || []).join('\n'),
    });
    setCategoryDialogOpen(true);
  };

  const saveCategory = async () => {
    try {
      const hero_images = categoryForm.heroImagesText
        .split('\n')
        .map((u) => u.trim())
        .filter((u) => u.length > 0);

      const payload: Omit<VehicleCategory, 'id'> & { hero_images: string[] } = {
        name: categoryForm.name,
        slug: categoryForm.slug || categoryForm.name.toLowerCase(),
        description: categoryForm.description || null,
        icon: categoryForm.icon || null,
        is_hero: categoryForm.is_hero,
        hero_order: categoryForm.hero_order,
        hero_images,
      };

      if (editingCategory) {
        await updateDoc(doc(db, 'vehicle_categories', editingCategory.id), payload as any);
        toast.success('Category updated');
      } else {
        await addDoc(collection(db, 'vehicle_categories'), {
          ...payload,
          created_at: new Date().toISOString(),
        } as any);
        toast.success('Category created');
      }

      setCategoryDialogOpen(false);
      setEditingCategory(null);
      loadAll();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteDoc(doc(db, 'vehicle_categories', id));
      toast.success('Category deleted');
      loadAll();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Car className="w-6 h-6 text-emerald-600" /> Fleet &amp; Vehicles
          </h2>
          <p className="text-sm text-slate-600">
            Manage your own fleet vehicles, galleries and hero categories for the /vehicles page.
          </p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="categories">Categories &amp; Hero</TabsTrigger>
          <TabsTrigger value="content">Page Content</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Fleet Vehicles</CardTitle>
                <p className="text-xs text-slate-500">These entries power the Our Fleet page and vehicle details.</p>
              </div>
              <Button onClick={startCreateVehicle} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-1" /> Add Vehicle
              </Button>
            </CardHeader>
            <CardContent>
              {vehicles.length === 0 ? (
                <p className="text-sm text-slate-500">No vehicles yet. Click "Add Vehicle" to create your first one.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicles.map((v) => {
                    const category = categories.find((c) => c.id === v.category_id);
                    const mainImage = v.image_urls?.[0];
                    return (
                      <Card key={v.id} className="border border-slate-200 hover:shadow-sm transition-shadow">
                        {mainImage && (
                          <div className="h-40 w-full overflow-hidden">
                            <img src={mainImage} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-sm">
                                {v.make} {v.model}
                              </h3>
                              <p className="text-xs text-slate-500">{category?.name || 'Uncategorised'}</p>
                            </div>
                            <Badge variant={v.is_active ? 'default' : 'secondary'} className="text-[10px]">
                              {v.is_active ? 'Active' : 'Hidden'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" /> {v.seats} seats
                            </span>
                            <span className="flex items-center gap-1">
                              <Luggage className="w-3 h-3" /> {v.luggage_capacity} bags
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>${v.daily_rate}/day</span>
                            <span>+ ${v.extra_km_rate}/km</span>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => startEditVehicle(v)}>
                              <Edit2 className="w-3 h-3 mr-1" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteVehicle(v.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Fleet Categories &amp; Hero</CardTitle>
                <p className="text-xs text-slate-500">
                  Mark up to four categories as hero to appear in the /vehicles hero section.
                </p>
              </div>
              <Button onClick={startCreateCategory} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-1" /> Add Category
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <p className="text-xs text-slate-500">
                  Hero categories: {heroCategories.length} selected (max 4 recommended).
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {heroCategories.map((c) => (
                    <Badge key={c.id} variant="secondary" className="flex items-center gap-1 text-[11px]">
                      <Star className="w-3 h-3 text-amber-500" />
                      {c.name} (order {c.hero_order ?? '-'})
                    </Badge>
                  ))}
                </div>
              </div>

              {categories.length === 0 ? (
                <p className="text-sm text-slate-500">No categories yet. Create at least one to organise your fleet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((c) => (
                    <Card key={c.id} className="border border-slate-200 hover:shadow-sm transition-shadow">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                              <span>{c.icon || '🚘'}</span>
                              <span>{c.name}</span>
                            </h3>
                            <p className="text-[11px] text-slate-500">Slug: {c.slug || '-'}</p>
                          </div>
                          {c.is_hero && (
                            <Badge variant="secondary" className="text-[10px] flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500" /> Hero
                            </Badge>
                          )}
                        </div>
                        {c.description && (
                          <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
                        )}
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Hero order: {c.hero_order ?? '-'}</span>
                          <span>Images: {c.hero_images?.length || 0}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => startEditCategory(c)}>
                            <Edit2 className="w-3 h-3 mr-1" /> Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteCategory(c.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Fleet Page Content &amp; SEO</CardTitle>
              <p className="text-xs text-slate-500">
                Control the hero texts, badges and SEO metadata used on the public /vehicles fleet page.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {!pageSettings ? (
                <p className="text-sm text-slate-500">Loading fleet page settings...</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="seo-title">SEO Title</Label>
                      <Input
                        id="seo-title"
                        value={pageSettings.seoTitle}
                        onChange={(e) => handlePageSettingChange('seoTitle', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="seo-description">SEO Description</Label>
                      <Textarea
                        id="seo-description"
                        rows={3}
                        value={pageSettings.seoDescription}
                        onChange={(e) => handlePageSettingChange('seoDescription', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hero-badge">Hero Badge</Label>
                      <Input
                        id="hero-badge"
                        value={pageSettings.heroBadge}
                        onChange={(e) => handlePageSettingChange('heroBadge', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-title">Hero Title</Label>
                      <Input
                        id="hero-title"
                        value={pageSettings.heroTitle}
                        onChange={(e) => handlePageSettingChange('heroTitle', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                    <Textarea
                      id="hero-subtitle"
                      rows={3}
                      value={pageSettings.heroSubtitle}
                      onChange={(e) => handlePageSettingChange('heroSubtitle', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hero-cta-label">Primary Button Label</Label>
                      <Input
                        id="hero-cta-label"
                        value={pageSettings.heroPrimaryCtaLabel}
                        onChange={(e) => handlePageSettingChange('heroPrimaryCtaLabel', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-cta-link">Primary Button Link</Label>
                      <Input
                        id="hero-cta-link"
                        value={pageSettings.heroPrimaryCtaLink}
                        onChange={(e) => handlePageSettingChange('heroPrimaryCtaLink', e.target.value)}
                        placeholder="/vehicle-rental"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="overlay-title">Hero Overlay Title</Label>
                      <Input
                        id="overlay-title"
                        value={pageSettings.heroOverlayTitle}
                        onChange={(e) => handlePageSettingChange('heroOverlayTitle', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="overlay-subtitle">Hero Overlay Subtitle</Label>
                      <Input
                        id="overlay-subtitle"
                        value={pageSettings.heroOverlaySubtitle}
                        onChange={(e) => handlePageSettingChange('heroOverlaySubtitle', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="section-title">Section Title</Label>
                      <Input
                        id="section-title"
                        value={pageSettings.sectionTitle}
                        onChange={(e) => handlePageSettingChange('sectionTitle', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="section-subtitle">Section Subtitle</Label>
                      <Textarea
                        id="section-subtitle"
                        rows={2}
                        value={pageSettings.sectionSubtitle}
                        onChange={(e) => handlePageSettingChange('sectionSubtitle', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="badge1">Badge 1</Label>
                      <Input
                        id="badge1"
                        value={pageSettings.badge1Label}
                        onChange={(e) => handlePageSettingChange('badge1Label', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="badge2">Badge 2</Label>
                      <Input
                        id="badge2"
                        value={pageSettings.badge2Label}
                        onChange={(e) => handlePageSettingChange('badge2Label', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="badge3">Badge 3</Label>
                      <Input
                        id="badge3"
                        value={pageSettings.badge3Label}
                        onChange={(e) => handlePageSettingChange('badge3Label', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="fallback-vehicles">Fallback Vehicles Count</Label>
                      <Input
                        id="fallback-vehicles"
                        value={pageSettings.statsVehiclesFallback}
                        onChange={(e) => handlePageSettingChange('statsVehiclesFallback', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fallback-seats">Fallback Total Seats</Label>
                      <Input
                        id="fallback-seats"
                        value={pageSettings.statsSeatsFallback}
                        onChange={(e) => handlePageSettingChange('statsSeatsFallback', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fallback-ac">Fallback A/C Vehicles</Label>
                      <Input
                        id="fallback-ac"
                        value={pageSettings.statsAcFallback}
                        onChange={(e) => handlePageSettingChange('statsAcFallback', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={saveFleetPageSettings}
                      disabled={savingPage}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {savingPage ? 'Saving...' : 'Save Page Content'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Vehicle dialog */}
      <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
            <DialogDescription>
              These fields map directly to the fleet shown on the public /vehicles page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 max-h-[65vh] overflow-y-auto py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="v-make">Make</Label>
                <Input
                  id="v-make"
                  value={vehicleForm.make}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                  placeholder="Toyota"
                />
              </div>
              <div>
                <Label htmlFor="v-model">Model</Label>
                <Input
                  id="v-model"
                  value={vehicleForm.model}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                  placeholder="Hiace"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="v-year">Year</Label>
                <Input
                  id="v-year"
                  type="number"
                  value={vehicleForm.year}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, year: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="v-seats">Seats</Label>
                <Input
                  id="v-seats"
                  type="number"
                  value={vehicleForm.seats}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, seats: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="v-luggage">Luggage Capacity</Label>
                <Input
                  id="v-luggage"
                  type="number"
                  value={vehicleForm.luggage_capacity}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, luggage_capacity: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="v-daily">Daily Rate (USD)</Label>
                <Input
                  id="v-daily"
                  type="number"
                  value={vehicleForm.daily_rate}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, daily_rate: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="v-extra">Extra KM Rate (USD)</Label>
                <Input
                  id="v-extra"
                  type="number"
                  value={vehicleForm.extra_km_rate}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, extra_km_rate: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="v-category">Category</Label>
                <select
                  id="v-category"
                  value={vehicleForm.category_id}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, category_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={vehicleForm.has_ac}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, has_ac: e.target.checked })}
                  />
                  A/C
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={vehicleForm.has_wifi}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, has_wifi: e.target.checked })}
                  />
                  WiFi
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={vehicleForm.has_child_seat}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, has_child_seat: e.target.checked })}
                  />
                  Child Seat
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={vehicleForm.is_active}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, is_active: e.target.checked })}
                  />
                  Active
                </label>
              </div>
            </div>
            <div>
              <Label htmlFor="v-description">Description</Label>
              <Textarea
                id="v-description"
                value={vehicleForm.description}
                onChange={(e) => setVehicleForm({ ...vehicleForm, description: e.target.value })}
                rows={3}
                placeholder="Short description of this vehicle (shown on detail page)."
              />
            </div>
            <div>
              <Label htmlFor="v-features">Features (comma separated)</Label>
              <Input
                id="v-features"
                value={vehicleForm.featuresText}
                onChange={(e) => setVehicleForm({ ...vehicleForm, featuresText: e.target.value })}
                placeholder="A/C, WiFi, USB Charging, Leather Seats"
              />
            </div>
            <div>
              <Label htmlFor="v-images">Gallery Image URLs (one per line)</Label>
              <Textarea
                id="v-images"
                value={vehicleForm.imagesText}
                onChange={(e) => setVehicleForm({ ...vehicleForm, imagesText: e.target.value })}
                rows={3}
                placeholder="https://...jpg\nhttps://...jpg"
              />
              <p className="mt-1 text-xs text-slate-500">
                These images will power the main image and thumbnails on the /vehicles page and the vehicle detail page.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVehicleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveVehicle} className="bg-emerald-600 hover:bg-emerald-700">
              {editingVehicle ? 'Update Vehicle' : 'Create Vehicle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>
              These categories power the fleet hero and highlight cards on the /vehicles page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 max-h-[65vh] overflow-y-auto py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="c-name">Name</Label>
                <Input
                  id="c-name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Sedans & Cars"
                />
              </div>
              <div>
                <Label htmlFor="c-slug">Slug (for URL)</Label>
                <Input
                  id="c-slug"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="car, van, suv, luxury"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="c-icon">Icon / Emoji</Label>
                <Input
                  id="c-icon"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  placeholder="🚗"
                />
              </div>
              <div>
                <Label htmlFor="c-order">Hero Order (1–4)</Label>
                <Input
                  id="c-order"
                  type="number"
                  value={categoryForm.hero_order}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, hero_order: Number(e.target.value) || 1 })
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="c-hero"
                type="checkbox"
                checked={categoryForm.is_hero}
                onChange={(e) => setCategoryForm({ ...categoryForm, is_hero: e.target.checked })}
                className="rounded border-slate-300"
              />
              <Label htmlFor="c-hero" className="text-sm">
                Show in hero (max 4 recommended)
              </Label>
            </div>
            <div>
              <Label htmlFor="c-description">Short Description</Label>
              <Textarea
                id="c-description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="c-images">Hero Image URLs (one per line)</Label>
              <Textarea
                id="c-images"
                value={categoryForm.heroImagesText}
                onChange={(e) => setCategoryForm({ ...categoryForm, heroImagesText: e.target.value })}
                rows={3}
                placeholder="https://...jpg\nhttps://...jpg"
              />
              <p className="mt-1 text-xs text-slate-500">
                First image is used in the hero collage and category cards. You can add several per category.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCategory} className="bg-emerald-600 hover:bg-emerald-700">
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FleetVehiclesManager;
