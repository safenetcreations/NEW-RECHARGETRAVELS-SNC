import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ImageUpload from '@/components/ui/image-upload';
import { toast } from 'sonner';
import {
  bookNowAdminService,
  AdminBookNowHeroSlide,
  AdminBookNowPackage,
} from '@/services/bookNowAdminService';
import { Loader2, Plus, Trash2, Save } from 'lucide-react';

const emptyHeroSlide: AdminBookNowHeroSlide = {
  image: '',
  title: '',
  subtitle: '',
};

const emptyPackage: AdminBookNowPackage = {
  image: '',
  title: '',
  badge: '',
  duration: '',
  groupSize: '',
  price: 0,
};

const BookNowManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [heroSlides, setHeroSlides] = useState<AdminBookNowHeroSlide[]>([]);
  const [packages, setPackages] = useState<AdminBookNowPackage[]>([]);
  const [savingHeroId, setSavingHeroId] = useState<string | null>(null);
  const [savingPackageId, setSavingPackageId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [slidesData, packageData] = await Promise.all([
        bookNowAdminService.fetchHeroSlides(),
        bookNowAdminService.fetchPackages(),
      ]);
      setHeroSlides(slidesData);
      setPackages(packageData);
    } catch (error) {
      console.error('Failed to load Book Now data', error);
      toast.error('Failed to load Book Now content');
    } finally {
      setLoading(false);
    }
  };

  const updateHeroField = (index: number, field: keyof AdminBookNowHeroSlide, value: string) => {
    setHeroSlides(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSaveHeroSlide = async (slide: AdminBookNowHeroSlide, index: number) => {
    if (!slide.image || !slide.title || !slide.subtitle) {
      toast.error('Hero slides need image, title, and subtitle');
      return;
    }

    try {
      setSavingHeroId(slide.id ?? `temp-${index}`);
      const saved = await bookNowAdminService.saveHeroSlide(slide);
      setHeroSlides(prev => {
        const next = [...prev];
        next[index] = saved;
        return next;
      });
      toast.success('Hero slide saved');
    } catch (error) {
      console.error('Failed to save hero slide', error);
      toast.error('Failed to save hero slide');
    } finally {
      setSavingHeroId(null);
    }
  };

  const handleDeleteHeroSlide = async (slide: AdminBookNowHeroSlide, index: number) => {
    if (!slide.id) {
      setHeroSlides(prev => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      await bookNowAdminService.deleteHeroSlide(slide.id);
      setHeroSlides(prev => prev.filter((_, i) => i !== index));
      toast.success('Hero slide deleted');
    } catch (error) {
      console.error('Failed to delete hero slide', error);
      toast.error('Failed to delete hero slide');
    }
  };

  const updatePackageField = (
    index: number,
    field: keyof AdminBookNowPackage,
    value: string,
  ) => {
    setPackages(prev => {
      const next = [...prev];
      if (field === 'price') {
        next[index] = { ...next[index], price: Number(value) || 0 };
      } else {
        next[index] = { ...next[index], [field]: value as never };
      }
      return next;
    });
  };

  const handleSavePackage = async (pkg: AdminBookNowPackage, index: number) => {
    if (!pkg.image || !pkg.title || !pkg.badge || !pkg.duration || !pkg.groupSize) {
      toast.error('Packages need image, title, badge, duration, and group size');
      return;
    }

    try {
      setSavingPackageId(pkg.id ?? `temp-${index}`);
      const saved = await bookNowAdminService.savePackage(pkg);
      setPackages(prev => {
        const next = [...prev];
        next[index] = saved;
        return next;
      });
      toast.success('Package saved');
    } catch (error) {
      console.error('Failed to save package', error);
      toast.error('Failed to save package');
    } finally {
      setSavingPackageId(null);
    }
  };

  const handleDeletePackage = async (pkg: AdminBookNowPackage, index: number) => {
    if (!pkg.id) {
      setPackages(prev => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      await bookNowAdminService.deletePackage(pkg.id);
      setPackages(prev => prev.filter((_, i) => i !== index));
      toast.success('Package deleted');
    } catch (error) {
      console.error('Failed to delete package', error);
      toast.error('Failed to delete package');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-3xl">Book Now Hero Slides</CardTitle>
          <CardDescription>
            Manage the rotating hero images and copy for the Book Now page hero section.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={() => setHeroSlides(prev => [...prev, { ...emptyHeroSlide }])}
            className="bg-indigo-600 hover:bg-indigo-700 text-white self-start"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Hero Slide
          </Button>

          {heroSlides.length === 0 && (
            <p className="text-sm text-muted-foreground">No hero slides yet. Add one to get started.</p>
          )}

          <div className="grid gap-6">
            {heroSlides.map((slide, index) => (
              <Card key={slide.id ?? `hero-${index}`} className="border shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">Slide {index + 1}</CardTitle>
                    <CardDescription>Displayed in the Book Now hero carousel.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveHeroSlide(slide, index)}
                      disabled={savingHeroId === (slide.id ?? `temp-${index}`)}
                    >
                      {savingHeroId === (slide.id ?? `temp-${index}`) ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteHeroSlide(slide, index)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-[1fr_1fr]">
                  <div>
                    <Label className="mb-2 block">Hero Image</Label>
                    <ImageUpload
                      value={slide.image}
                      onChange={(url) => updateHeroField(index, 'image', url)}
                      onRemove={() => updateHeroField(index, 'image', '')}
                      folder="book-now/hero"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={slide.title}
                        onChange={(e) => updateHeroField(index, 'title', e.target.value)}
                        placeholder="Book your Sri Lanka journey"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Subtitle</Label>
                      <Input
                        value={slide.subtitle}
                        onChange={(e) => updateHeroField(index, 'subtitle', e.target.value)}
                        placeholder="Premium transfers and tours"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-3xl">Popular Packages</CardTitle>
          <CardDescription>
            These cards appear under the form on the Book Now page to highlight curated experiences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={() => setPackages(prev => [...prev, { ...emptyPackage }])}
            className="bg-teal-600 hover:bg-teal-700 text-white self-start"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Package
          </Button>

          {packages.length === 0 && (
            <p className="text-sm text-muted-foreground">No packages yet. Add one to get started.</p>
          )}

          <div className="grid gap-6">
            {packages.map((pkg, index) => (
              <Card key={pkg.id ?? `pkg-${index}`} className="border shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">{pkg.title || `Package ${index + 1}`}</CardTitle>
                    <CardDescription>Displayed in the Book Now packages grid.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSavePackage(pkg, index)}
                      disabled={savingPackageId === (pkg.id ?? `temp-${index}`)}
                    >
                      {savingPackageId === (pkg.id ?? `temp-${index}`) ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePackage(pkg, index)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-[1fr_1fr]">
                  <div>
                    <Label className="mb-2 block">Package Image</Label>
                    <ImageUpload
                      value={pkg.image}
                      onChange={(url) => updatePackageField(index, 'image', url)}
                      onRemove={() => updatePackageField(index, 'image', '')}
                      folder="book-now/packages"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={pkg.title}
                        onChange={(e) => updatePackageField(index, 'title', e.target.value)}
                        placeholder="Coastal Escape"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Badge</Label>
                        <Input
                          value={pkg.badge}
                          onChange={(e) => updatePackageField(index, 'badge', e.target.value)}
                          placeholder="Most Popular"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Duration</Label>
                        <Input
                          value={pkg.duration}
                          onChange={(e) => updatePackageField(index, 'duration', e.target.value)}
                          placeholder="5 Days"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Group Size</Label>
                        <Input
                          value={pkg.groupSize}
                          onChange={(e) => updatePackageField(index, 'groupSize', e.target.value)}
                          placeholder="2-6 Pax"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Price (USD)</Label>
                        <Input
                          type="number"
                          value={pkg.price}
                          onChange={(e) => updatePackageField(index, 'price', e.target.value)}
                          placeholder="899"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookNowManager;

