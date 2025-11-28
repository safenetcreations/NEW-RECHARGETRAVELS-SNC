
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, Globe, Mail, Shield, Palette, Key } from 'lucide-react';

const SettingsSection: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'Recharge Travels',
    siteDescription: 'Discover the Wonder of Sri Lanka',
    contactEmail: 'info@rechargetravels.com',
    contactPhone: '+94 77 772 1999',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
  });
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Save other settings
      console.log('Saving settings:', settings);

      // Save the API key
      const response = await fetch('/api/save-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      if (response.ok) {
        setSuccess('Settings saved successfully!');
      } else {
        setError('Error saving API key');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }

    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700" disabled={isSaving}>
          {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save All Changes</>}
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Site Description</label>
              <Textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Maintenance Mode</label>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Contact Email</label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Contact Phone</label>
              <Input
                value={settings.contactPhone}
                onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Email Notifications</label>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Allow User Registration</label>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
              />
            </div>
            
            <Button variant="outline" className="w-full">
              Reset All User Passwords
            </Button>
            
            <Button variant="outline" className="w-full">
              View Security Logs
            </Button>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Theme Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex gap-2">
                <Input type="color" defaultValue="#f39c12" className="w-16 h-10" />
                <Input value="#f39c12" className="flex-1" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <div className="flex gap-2">
                <Input type="color" defaultValue="#1abc9c" className="w-16 h-10" />
                <Input value="#1abc9c" className="flex-1" />
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Reset to Default Theme
            </Button>
          </CardContent>
        </Card>

        {/* API Key Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Key Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Gemini API Key</label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsSection;
