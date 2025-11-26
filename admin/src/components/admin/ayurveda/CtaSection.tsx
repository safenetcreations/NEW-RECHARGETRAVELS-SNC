import React, { useEffect, useState } from 'react';
import { Save, Megaphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getCtaContent, updateCtaContent, CtaContent } from '@/services/ayurveda/ayurvedaService';

const CtaSection: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CtaContent>({
    label: '',
    title: '',
    subtitle: '',
    primaryButton: '',
    secondaryButton: ''
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    const { data } = await getCtaContent();
    if (data) {
      setFormData(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateCtaContent(formData);

    if (error) {
      toast.error('Failed to save CTA content');
    } else {
      toast.success('CTA section saved successfully!');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
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
            <Megaphone className="w-5 h-5" />
            Call-to-Action Content
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
              <Label htmlFor="label">Section Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                placeholder="e.g., Begin Your Journey"
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Transform Your Life"
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Let us curate a personalized wellness journey..."
                className="border-emerald-200 focus:border-emerald-400 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryButton">Primary Button Text</Label>
                <Input
                  id="primaryButton"
                  value={formData.primaryButton}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryButton: e.target.value }))}
                  placeholder="e.g., Schedule Consultation"
                  className="border-emerald-200 focus:border-emerald-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryButton">Secondary Button Text</Label>
                <Input
                  id="secondaryButton"
                  value={formData.secondaryButton}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondaryButton: e.target.value }))}
                  placeholder="e.g., Download Brochure"
                  className="border-emerald-200 focus:border-emerald-400"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CtaSection;
