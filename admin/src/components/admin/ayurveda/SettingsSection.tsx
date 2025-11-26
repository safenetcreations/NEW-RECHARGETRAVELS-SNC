import React, { useEffect, useState } from 'react';
import { Save, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getSiteSettings, updateSiteSettings, SiteSettings } from '@/services/ayurveda/ayurvedaService';

const SettingsSection: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SiteSettings>({
    siteName: '',
    contactEmail: '',
    contactPhone: '',
    social: {
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: ''
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const { data } = await getSiteSettings();
    if (data) {
      setFormData(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateSiteSettings(formData);

    if (error) {
      toast.error('Failed to save settings');
    } else {
      toast.success('Settings saved successfully!');
    }
    setSaving(false);
  };

  const handleSocialChange = (platform: keyof SiteSettings['social'], value: string) => {
    setFormData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: value
      }
    }));
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-emerald-900">
            <Settings className="w-5 h-5" />
            General Settings
          </CardTitle>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                placeholder="e.g., Recharge Travels"
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="info@rechargetravels.com"
                  className="border-emerald-200 focus:border-emerald-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="+1 234 567 890"
                  className="border-emerald-200 focus:border-emerald-400"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-emerald-900">Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                value={formData.social.instagram}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                placeholder="https://instagram.com/..."
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input
                id="facebook"
                value={formData.social.facebook}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter URL</Label>
              <Input
                id="twitter"
                value={formData.social.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                placeholder="https://twitter.com/..."
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={formData.social.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/..."
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSection;
