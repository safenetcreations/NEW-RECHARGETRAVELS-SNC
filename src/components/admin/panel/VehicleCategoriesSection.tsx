import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Star } from 'lucide-react';

interface VehicleCategory {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  slug?: string;
  is_hero?: boolean;
  hero_order?: number;
  hero_images?: string[];
}

const VehicleCategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<VehicleCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    is_hero: false,
    hero_order: 1,
    heroImagesText: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const colRef = collection(db, 'vehicle_categories');
      const snapshot = await getDocs(orderBy('name') as any ? orderBy('name')(colRef as any) : colRef);
      // Fallback if orderBy cast fails - safer to just getDocs on collection
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as VehicleCategory[];
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching vehicle categories:', error);
      toast.error('Failed to load vehicle categories');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '',
      is_hero: false,
      hero_order: 1,
      heroImagesText: ''
    });
    setShowDialog(true);
  };

  const openEdit = (cat: VehicleCategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug || '',
      description: cat.description || '',
      icon: cat.icon || '',
      is_hero: !!cat.is_hero,
      hero_order: cat.hero_order ?? 1,
      heroImagesText: (cat.hero_images || []).join('\n')
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      const hero_images = formData.heroImagesText
        .split('\n')
        .map((u) => u.trim())
        .filter((u) => u.length > 0);

      const payload: Omit<VehicleCategory, 'id'> & { hero_images: string[] } = {
        name: formData.name,
        description: formData.description || null,
        icon: formData.icon || null,
        slug: formData.slug || formData.name.toLowerCase(),
        is_hero: formData.is_hero,
        hero_order: formData.hero_order,
        hero_images
      };

      if (editingCategory) {
        const ref = doc(db, 'vehicle_categories', editingCategory.id);
        await updateDoc(ref, payload as any);
        toast.success('Category updated');
      } else {
        await addDoc(collection(db, 'vehicle_categories'), {
          ...payload,
          created_at: new Date().toISOString()
        } as any);
        toast.success('Category created');
      }

      setShowDialog(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteDoc(doc(db, 'vehicle_categories', id));
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const heroCategories = categories
    .filter((c) => c.is_hero)
    .sort((a, b) => (a.hero_order ?? 999) - (b.hero_order ?? 999));

  return (
    <div className="space-y-4 mt-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Fleet Categories & Hero</h3>
          <p className="text-sm text-gray-600">
            Manage vehicle categories and choose which ones appear in the fleet hero section.
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-1" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
              <DialogDescription>
                These categories power the /vehicles hero section and filters.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cat-name">Name</Label>
                  <Input
                    id="cat-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sedans & Cars"
                  />
                </div>
                <div>
                  <Label htmlFor="cat-slug">Slug (for URL)</Label>
                  <Input
                    id="cat-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. car, van, suv"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cat-icon">Icon / Emoji</Label>
                  <Input
                    id="cat-icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g. 🚗 or SUV"
                  />
                </div>
                <div>
                  <Label htmlFor="cat-order">Hero Order (1–4)</Label>
                  <Input
                    id="cat-order"
                    type="number"
                    value={formData.hero_order}
                    onChange={(e) => setFormData({ ...formData, hero_order: Number(e.target.value) || 1 })}
                    min={1}
                    max={10}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="is-hero"
                  type="checkbox"
                  checked={formData.is_hero}
                  onChange={(e) => setFormData({ ...formData, is_hero: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is-hero" className="text-sm">
                  Show in hero (top 4 by order)
                </Label>
              </div>
              <div>
                <Label htmlFor="cat-description">Short Description</Label>
                <Textarea
                  id="cat-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Optional text used under the category card."
                />
              </div>
              <div>
                <Label htmlFor="cat-images">Hero Image URLs (one per line)</Label>
                <Textarea
                  id="cat-images"
                  value={formData.heroImagesText}
                  onChange={(e) => setFormData({ ...formData, heroImagesText: e.target.value })}
                  rows={3}
                  placeholder="https://...jpg\nhttps://...jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  First image is used in the hero mosaic and category cards. You can add up to ~5 per category.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowDialog(false); setEditingCategory(null); }}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Hero summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Hero Categories</span>
            <span className="text-sm text-gray-500">{heroCategories.length} selected (max 4 recommended)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {heroCategories.length === 0 && (
            <p className="text-sm text-gray-500">No hero categories selected yet. Mark up to 4 as hero.</p>
          )}
          {heroCategories.map((cat) => (
            <Badge key={cat.id} variant="secondary" className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500" />
              {cat.name} (order {cat.hero_order ?? 0})
            </Badge>
          ))}
        </CardContent>
      </Card>

      {/* All categories list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="hover:shadow-sm transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <span>{cat.icon || '🚘'}</span>
                <span>{cat.name}</span>
              </CardTitle>
              {cat.is_hero && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500" /> Hero
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {cat.description && (
                <p className="text-xs text-gray-600 line-clamp-2">{cat.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Slug: {cat.slug || '-'}</span>
                <span>Hero order: {cat.hero_order ?? '-'}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(cat)}>
                  <Edit className="w-3 h-3 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VehicleCategoriesSection;
