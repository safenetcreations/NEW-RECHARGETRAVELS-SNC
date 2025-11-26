import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Save, RefreshCw } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterSettings {
  description: string;
  phone: string;
  email: string;
  address: string;
  socialLinks: SocialLink[];
  certifications: {
    licensed: boolean;
    ecoCertified: boolean;
    conservation: boolean;
  };
  newsletterText: string;
  craftedByUrl: string;
  copyrightText: string;
}

const FooterSettingsSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<FooterSettings>({
    description: '🌿 Your gateway to Sri Lanka\'s wild heart. Experience the untamed beauty of tropical rainforests, majestic elephants, elusive leopards, and pristine beaches. Let nature recharge your soul.',
    phone: '+94 7777 21 999',
    email: 'info@rechargetravels.com',
    address: 'Colombo + Jaffna, Sri Lanka',
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/rechargetravels', icon: 'Facebook' },
      { platform: 'Twitter', url: 'https://twitter.com/rechargetravels', icon: 'Twitter' },
      { platform: 'Instagram', url: 'https://instagram.com/rechargetravels', icon: 'Instagram' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/rechargetravels', icon: 'Linkedin' },
      { platform: 'YouTube', url: 'https://youtube.com/rechargetravels', icon: 'Youtube' }
    ],
    certifications: {
      licensed: true,
      ecoCertified: true,
      conservation: true
    },
    newsletterText: 'Get exclusive safari deals, wildlife tips & adventure stories!',
    craftedByUrl: 'https://www.safenetcreations.com',
    copyrightText: '© 2025 Recharge Travels and Tours. All rights reserved.'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'footer');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSettings(docSnap.data() as FooterSettings);
      }
    } catch (error) {
      console.error('Error loading footer settings:', error);
      toast.error('Failed to load footer settings');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'settings', 'footer');
      await setDoc(docRef, settings, { merge: true });
      
      toast.success('Footer settings saved successfully!');
    } catch (error) {
      console.error('Error saving footer settings:', error);
      toast.error('Failed to save footer settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSocialLink = (index: number, field: 'url', value: string) => {
    const newLinks = [...settings.socialLinks];
    newLinks[index].url = value;
    setSettings({ ...settings, socialLinks: newLinks });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Footer Settings</h2>
          <p className="text-gray-500">Manage footer content, social links, and contact information</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadSettings} variant="outline" disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Update company description and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Footer Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                rows={4}
                placeholder="Enter footer description"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+94 7777 21 999"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="info@rechargetravels.com"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="Colombo + Jaffna, Sri Lanka"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Update your social media profile URLs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.socialLinks.map((link, index) => (
              <div key={link.platform}>
                <Label htmlFor={`social-${index}`} className="flex items-center gap-2">
                  {link.platform === 'Facebook' && <Facebook className="w-4 h-4" />}
                  {link.platform === 'Twitter' && <Twitter className="w-4 h-4" />}
                  {link.platform === 'Instagram' && <Instagram className="w-4 h-4" />}
                  {link.platform === 'LinkedIn' && <Linkedin className="w-4 h-4" />}
                  {link.platform === 'YouTube' && <Youtube className="w-4 h-4" />}
                  {link.platform}
                </Label>
                <Input
                  id={`social-${index}`}
                  type="url"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  placeholder={`https://${link.platform.toLowerCase()}.com/...`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications & Badges</CardTitle>
            <CardDescription>Manage certification badges display</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏛️</span>
                <Label htmlFor="licensed-checkbox">Tourism Board Licensed</Label>
              </div>
              <input
                id="licensed-checkbox"
                type="checkbox"
                checked={settings.certifications.licensed}
                onChange={(e) => setSettings({
                  ...settings,
                  certifications: { ...settings.certifications, licensed: e.target.checked }
                })}
                className="w-5 h-5"
                aria-label="Toggle Tourism Board Licensed certification"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌿</span>
                <Label htmlFor="eco-checkbox">Eco-Certified Travel</Label>
              </div>
              <input
                id="eco-checkbox"
                type="checkbox"
                checked={settings.certifications.ecoCertified}
                onChange={(e) => setSettings({
                  ...settings,
                  certifications: { ...settings.certifications, ecoCertified: e.target.checked }
                })}
                className="w-5 h-5"
                aria-label="Toggle Eco-Certified certification"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🦋</span>
                <Label htmlFor="conservation-checkbox">Wildlife Conservation Partner</Label>
              </div>
              <input
                id="conservation-checkbox"
                type="checkbox"
                checked={settings.certifications.conservation}
                onChange={(e) => setSettings({
                  ...settings,
                  certifications: { ...settings.certifications, conservation: e.target.checked }
                })}
                className="w-5 h-5"
                aria-label="Toggle Wildlife Conservation certification"
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Settings</CardTitle>
            <CardDescription>Newsletter and branding settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newsletter">Newsletter Tagline</Label>
              <Input
                id="newsletter"
                value={settings.newsletterText}
                onChange={(e) => setSettings({ ...settings, newsletterText: e.target.value })}
                placeholder="Get exclusive safari deals..."
              />
            </div>

            <div>
              <Label htmlFor="craftedBy">Crafted By URL</Label>
              <Input
                id="craftedBy"
                type="url"
                value={settings.craftedByUrl}
                onChange={(e) => setSettings({ ...settings, craftedByUrl: e.target.value })}
                placeholder="https://www.safenetcreations.com"
              />
            </div>

            <div>
              <Label htmlFor="copyright">Copyright Text</Label>
              <Input
                id="copyright"
                value={settings.copyrightText}
                onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                placeholder="© 2025 Recharge Travels..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FooterSettingsSection;
