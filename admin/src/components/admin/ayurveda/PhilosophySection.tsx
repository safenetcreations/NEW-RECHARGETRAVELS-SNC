import React, { useEffect, useState } from 'react';
import { Save, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getPhilosophyContent, updatePhilosophyContent, PhilosophyContent } from '@/services/ayurveda/ayurvedaService';

const PhilosophySection: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<PhilosophyContent>({
    label: '',
    title: '',
    description: '',
    pillars: ['', '', '']
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    const { data } = await getPhilosophyContent();
    if (data) {
      setFormData({
        ...data,
        pillars: data.pillars?.length ? data.pillars : ['', '', '']
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updatePhilosophyContent(formData);

    if (error) {
      toast.error('Failed to save philosophy content');
    } else {
      toast.success('Philosophy section saved successfully!');
    }
    setSaving(false);
  };

  const handlePillarChange = (index: number, value: string) => {
    const newPillars = [...formData.pillars];
    newPillars[index] = value;
    setFormData(prev => ({ ...prev, pillars: newPillars }));
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
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
            <BookOpen className="w-5 h-5" />
            Philosophy Content
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
                placeholder="e.g., The Ancient Wisdom"
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., The Art of Healing & Renewal"
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter the philosophy description..."
                className="border-emerald-200 focus:border-emerald-400 min-h-[120px]"
              />
            </div>

            <div className="space-y-4">
              <Label>Three Pillars</Label>
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-sm text-gray-500">Pillar {index + 1}</Label>
                    <Input
                      value={formData.pillars[index] || ''}
                      onChange={(e) => handlePillarChange(index, e.target.value)}
                      placeholder={['Balance', 'Harmony', 'Renewal'][index]}
                      className="border-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhilosophySection;
