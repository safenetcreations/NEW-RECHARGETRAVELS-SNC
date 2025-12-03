import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save, RefreshCw, Plane, Anchor, Car, Home, Crown, Sparkles, Shield, Eye } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import ImageUpload from '@/components/ui/image-upload';

// Types
interface HeroImage {
  url: string;
  title: string;
  subtitle: string;
}

interface LuxuryPageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImages: HeroImage[];
  seoTitle?: string;
  seoDescription?: string;
  contactPhone?: string;
  contactEmail?: string;
  updatedAt?: any;
}

interface FleetItem {
  id: string;
  name: string;
  image: string;
  description: string;
  features: string[];
  pricePerHour?: string;
  pricePerDay?: string;
  passengers?: number;
  isActive: boolean;
  sortOrder: number;
  [key: string]: any;
}

const LUXURY_PAGES = [
  { id: 'helicopter-charters', label: 'Helicopter Charters', icon: Plane, collection: 'helicopterFleet' },
  { id: 'private-yachts', label: 'Private Yachts', icon: Anchor, collection: 'yachtFleet' },
  { id: 'private-jets', label: 'Private Jets', icon: Plane, collection: 'jetFleet' },
  { id: 'luxury-vehicles', label: 'Luxury Vehicles', icon: Car, collection: 'vehicleFleet' },
  { id: 'exclusive-villas', label: 'Exclusive Villas', icon: Home, collection: 'villaCollection' },
  { id: 'dream-journeys', label: 'Dream Journeys', icon: Crown, collection: 'dreamJourneys' },
  { id: 'vip-concierge', label: 'VIP Concierge', icon: Sparkles, collection: 'vipConciergeServices' },
  { id: 'exclusive-access', label: 'Exclusive Access', icon: Shield, collection: 'exclusiveAccessExperiences' },
  { id: 'luxury-hotels', label: 'Luxury Hotels', icon: Home, collection: 'luxuryHotels' },
  { id: 'luxury-apartments', label: 'Luxury Apartments', icon: Home, collection: 'luxuryApartments' },
  { id: 'luxury-houses', label: 'Luxury Houses', icon: Home, collection: 'luxuryHouses' },
];

const LuxuryContentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('helicopter-charters');
  const [pageContent, setPageContent] = useState<LuxuryPageContent | null>(null);
  const [fleetItems, setFleetItems] = useState<FleetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<FleetItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const currentPage = LUXURY_PAGES.find(p => p.id === activeTab);

  useEffect(() => {
    loadPageData();
  }, [activeTab]);

  const loadPageData = async () => {
    setLoading(true);
    try {
      // Load page content
      const pageDoc = await getDoc(doc(db, 'luxuryPages', activeTab));
      if (pageDoc.exists()) {
        setPageContent(pageDoc.data() as LuxuryPageContent);
      } else {
        setPageContent({
          heroTitle: '',
          heroSubtitle: '',
          heroImages: [],
        });
      }

      // Load fleet/items
      if (currentPage?.collection) {
        const itemsQuery = query(collection(db, currentPage.collection), orderBy('sortOrder', 'asc'));
        const snapshot = await getDocs(itemsQuery);
        setFleetItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FleetItem)));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const savePageContent = async () => {
    if (!pageContent) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'luxuryPages', activeTab), {
        ...pageContent,
        updatedAt: new Date()
      }, { merge: true });
      toast.success('Page content saved successfully');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const addFleetItem = async (item: Omit<FleetItem, 'id'>) => {
    if (!currentPage?.collection) return;
    try {
      await addDoc(collection(db, currentPage.collection), {
        ...item,
        createdAt: new Date(),
        sortOrder: fleetItems.length + 1
      });
      toast.success('Item added successfully');
      loadPageData();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  const updateFleetItem = async (id: string, updates: Partial<FleetItem>) => {
    if (!currentPage?.collection) return;
    try {
      await updateDoc(doc(db, currentPage.collection, id), {
        ...updates,
        updatedAt: new Date()
      });
      toast.success('Item updated successfully');
      loadPageData();
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  const deleteFleetItem = async (id: string) => {
    if (!currentPage?.collection) return;
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteDoc(doc(db, currentPage.collection, id));
      toast.success('Item deleted successfully');
      loadPageData();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleHeroImageAdd = (url: string) => {
    if (!pageContent) return;
    const newImage: HeroImage = { url, title: '', subtitle: '' };
    setPageContent({
      ...pageContent,
      heroImages: [...(pageContent.heroImages || []), newImage]
    });
  };

  const handleHeroImageUpdate = (index: number, field: keyof HeroImage, value: string) => {
    if (!pageContent) return;
    const updated = [...(pageContent.heroImages || [])];
    updated[index] = { ...updated[index], [field]: value };
    setPageContent({ ...pageContent, heroImages: updated });
  };

  const handleHeroImageDelete = (index: number) => {
    if (!pageContent) return;
    const updated = (pageContent.heroImages || []).filter((_, i) => i !== index);
    setPageContent({ ...pageContent, heroImages: updated });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Luxury Content Manager</h2>
          <p className="text-gray-600">Manage all luxury experience pages and content</p>
        </div>
        <Button onClick={loadPageData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap gap-1 h-auto p-2 bg-gray-100">
          {LUXURY_PAGES.map((page) => {
            const Icon = page.icon;
            return (
              <TabsTrigger
                key={page.id}
                value={page.id}
                className="flex items-center gap-1 text-xs px-3 py-2"
              >
                <Icon className="w-3 h-3" />
                {page.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {LUXURY_PAGES.map((page) => (
          <TabsContent key={page.id} value={page.id} className="space-y-6">
            {/* Page Hero Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <page.icon className="w-5 h-5" />
                  {page.label} - Page Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Hero Title</Label>
                    <Input
                      value={pageContent?.heroTitle || ''}
                      onChange={(e) => setPageContent(prev => prev ? { ...prev, heroTitle: e.target.value } : null)}
                      placeholder="Enter hero title"
                    />
                  </div>
                  <div>
                    <Label>Hero Subtitle</Label>
                    <Input
                      value={pageContent?.heroSubtitle || ''}
                      onChange={(e) => setPageContent(prev => prev ? { ...prev, heroSubtitle: e.target.value } : null)}
                      placeholder="Enter hero subtitle"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>SEO Title</Label>
                    <Input
                      value={pageContent?.seoTitle || ''}
                      onChange={(e) => setPageContent(prev => prev ? { ...prev, seoTitle: e.target.value } : null)}
                      placeholder="SEO page title"
                    />
                  </div>
                  <div>
                    <Label>Contact Phone</Label>
                    <Input
                      value={pageContent?.contactPhone || ''}
                      onChange={(e) => setPageContent(prev => prev ? { ...prev, contactPhone: e.target.value } : null)}
                      placeholder="+94 777 721 999"
                    />
                  </div>
                </div>

                <div>
                  <Label>SEO Description</Label>
                  <Textarea
                    value={pageContent?.seoDescription || ''}
                    onChange={(e) => setPageContent(prev => prev ? { ...prev, seoDescription: e.target.value } : null)}
                    placeholder="SEO meta description"
                  />
                </div>

                {/* Hero Images */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Hero Images (up to 5)</Label>
                  <div className="space-y-4">
                    {(pageContent?.heroImages || []).map((img, index) => (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg bg-gray-50">
                        <div className="w-40 h-24 overflow-hidden rounded">
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Input
                            value={img.title}
                            onChange={(e) => handleHeroImageUpdate(index, 'title', e.target.value)}
                            placeholder="Image title"
                          />
                          <Input
                            value={img.subtitle}
                            onChange={(e) => handleHeroImageUpdate(index, 'subtitle', e.target.value)}
                            placeholder="Image subtitle"
                          />
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleHeroImageDelete(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {(pageContent?.heroImages?.length || 0) < 5 && (
                      <ImageUpload
                        value=""
                        onChange={handleHeroImageAdd}
                        onRemove={() => {}}
                        folder="luxury"
                        helperText="Add hero image (1920x1080 recommended)"
                      />
                    )}
                  </div>
                </div>

                <Button onClick={savePageContent} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Page Settings'}
                </Button>
              </CardContent>
            </Card>

            {/* Fleet/Items List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {page.label} Items ({fleetItems.length})
                </CardTitle>
                <Button onClick={() => setShowAddForm(true)} className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </CardHeader>
              <CardContent>
                {showAddForm && (
                  <FleetItemForm
                    onSubmit={addFleetItem}
                    onCancel={() => setShowAddForm(false)}
                    pageType={page.id}
                  />
                )}

                {editingItem && (
                  <FleetItemForm
                    item={editingItem}
                    onSubmit={(data) => updateFleetItem(editingItem.id, data)}
                    onCancel={() => setEditingItem(null)}
                    pageType={page.id}
                  />
                )}

                {!showAddForm && !editingItem && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fleetItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        {item.image && (
                          <div className="h-40 overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant={item.isActive ? 'default' : 'secondary'}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => deleteFleetItem(item.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {fleetItems.length === 0 && (
                      <div className="col-span-full text-center py-12 text-gray-500">
                        No items found. Click "Add New" to create your first item.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Fleet Item Form Component
interface FleetItemFormProps {
  item?: FleetItem;
  onSubmit: (data: Omit<FleetItem, 'id'>) => void;
  onCancel: () => void;
  pageType: string;
}

const FleetItemForm: React.FC<FleetItemFormProps> = ({ item, onSubmit, onCancel, pageType }) => {
  const [formData, setFormData] = useState<Omit<FleetItem, 'id'>>({
    name: item?.name || '',
    image: item?.image || '',
    description: item?.description || '',
    features: item?.features || [],
    pricePerHour: item?.pricePerHour || '',
    pricePerDay: item?.pricePerDay || '',
    passengers: item?.passengers || 0,
    isActive: item?.isActive ?? true,
    sortOrder: item?.sortOrder || 0,
  });

  const [featuresText, setFeaturesText] = useState((item?.features || []).join(', '));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      features: featuresText.split(',').map(f => f.trim()).filter(f => f)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50 mb-6">
      <h3 className="font-semibold text-lg">{item ? 'Edit Item' : 'Add New Item'}</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label>Price Per Hour/Day</Label>
          <Input
            value={formData.pricePerHour || formData.pricePerDay || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, pricePerHour: e.target.value }))}
            placeholder="USD 5,000"
          />
        </div>
      </div>

      <div>
        <Label>Image</Label>
        <ImageUpload
          value={formData.image}
          onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
          onRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
          folder="luxury"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div>
        <Label>Features (comma separated)</Label>
        <Input
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          placeholder="Feature 1, Feature 2, Feature 3"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Passengers/Guests</Label>
          <Input
            type="number"
            value={formData.passengers || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, passengers: parseInt(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <Label>Sort Order</Label>
          <Input
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
          {item ? 'Update' : 'Add'} Item
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default LuxuryContentManager;
