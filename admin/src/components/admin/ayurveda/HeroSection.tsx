import React, { useEffect, useState } from 'react';
import { Save, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getHeroContent, updateHeroContent, HeroContent } from '@/services/ayurveda/ayurvedaService';

const HeroSection: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<HeroContent>({
    title: '',
    subtitle: '',
    label: '',
    ctaText: '',
    backgroundImage: ''
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    const { data, error } = await getHeroContent();
    if (data) {
      setFormData(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateHeroContent(formData);

    if (error) {
      toast.error('Failed to save hero content');
    } else {
      toast.success('Hero section saved successfully!');
    }
    setSaving(false);
  };

  const handleChange = (field: keyof HeroContent, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-emerald-900">
            <ImageIcon className="w-5 h-5" />
            Hero Content
          </CardTitle>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label Text (above title)</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="e.g., Recharge Travels Presents"
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Ayurveda & Wellness"
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle / Tagline</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="e.g., Journey Within, Transform Forever"
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaText">CTA Button Text</Label>
              <Input
                id="ctaText"
                value={formData.ctaText}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                placeholder="e.g., Explore Retreats"
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundImage">Background Image URL</Label>
              <Input
                id="backgroundImage"
                value={formData.backgroundImage}
                onChange={(e) => handleChange('backgroundImage', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="border-emerald-200 focus:border-emerald-400"
              />
              {formData.backgroundImage && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-2">Preview:</p>
                  <img
                    src={formData.backgroundImage}
                    alt="Hero background preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroSection;
