
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Globe, 
  Mail, 
  Shield, 
  Palette, 
  CreditCard,
  Search,
  Database,
  Bell,
  Users,
  Lock,
  Settings as SettingsIcon,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface SiteSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    timezone: string;
    language: string;
    currency: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    whatsapp: string;
    facebook: string;
    instagram: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    googleAnalytics: string;
    googleTagManager: string;
    facebookPixel: string;
  };
  payment: {
    stripeEnabled: boolean;
    paypalEnabled: boolean;
    stripeKey: string;
    paypalClientId: string;
    currency: string;
    taxRate: number;
  };
  security: {
    allowRegistration: boolean;
    requireEmailVerification: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
    twoFactorAuth: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    bookingConfirmations: boolean;
    paymentNotifications: boolean;
    adminAlerts: boolean;
    smsNotifications: boolean;
  };
  maintenance: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    allowedIPs: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    darkMode: boolean;
    customCSS: string;
  };
}

const SettingsSection: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    general: {
      siteName: 'Recharge Travels',
      siteDescription: 'Discover the Wonder of Sri Lanka - Your Premier Travel Partner',
      siteUrl: 'https://rechargetravels.com',
      timezone: 'Asia/Colombo',
      language: 'en',
      currency: 'USD'
    },
    contact: {
      email: 'info@rechargetravels.com',
      phone: '+94 77 772 1999',
      address: '123 Travel Street, Colombo 01, Sri Lanka',
      whatsapp: '+94 77 772 1999',
      facebook: 'rechargetravels',
      instagram: 'rechargetravels'
    },
    seo: {
      metaTitle: 'Recharge Travels - Sri Lanka Travel & Tourism',
      metaDescription: 'Discover the beauty of Sri Lanka with Recharge Travels. Book tours, hotels, and experiences across the island.',
      googleAnalytics: 'GA-XXXXXXXXX-X',
      googleTagManager: 'GTM-XXXXXXX',
      facebookPixel: 'XXXXXXXXXX'
    },
    payment: {
      stripeEnabled: true,
      paypalEnabled: true,
      stripeKey: 'pk_test_...',
      paypalClientId: 'client_id_...',
      currency: 'USD',
      taxRate: 15
    },
    security: {
      allowRegistration: true,
      requireEmailVerification: true,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      twoFactorAuth: false
    },
    notifications: {
      emailNotifications: true,
      bookingConfirmations: true,
      paymentNotifications: true,
      adminAlerts: true,
      smsNotifications: false
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
      allowedIPs: '127.0.0.1,192.168.1.1'
    },
    theme: {
      primaryColor: '#f39c12',
      secondaryColor: '#1abc9c',
      accentColor: '#e74c3c',
      darkMode: false,
      customCSS: ''
    }
  });

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // Load settings from API/localStorage
    console.log('Loading settings...');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save settings to API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setLastSaved(new Date());
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (category: keyof SiteSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const resetToDefaults = () => {
    // Reset settings to defaults
    console.log('Resetting to defaults...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600">Configure your website settings and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          {lastSaved && (
            <Badge variant="outline" className="text-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Saved {lastSaved.toLocaleTimeString()}
            </Badge>
          )}
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Defaults
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="general" className="flex items-center gap-1 text-xs">
            <Globe className="w-3 h-3" />
            General
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-1 text-xs">
            <Mail className="w-3 h-3" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-1 text-xs">
            <Search className="w-3 h-3" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-1 text-xs">
            <CreditCard className="w-3 h-3" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1 text-xs">
            <Shield className="w-3 h-3" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1 text-xs">
            <Bell className="w-3 h-3" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-1 text-xs">
            <AlertTriangle className="w-3 h-3" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-1 text-xs">
            <Palette className="w-3 h-3" />
            Theme
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Site Name</label>
                  <Input
                    value={settings.general.siteName}
                    onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
                    placeholder="Enter site name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Site URL</label>
                  <Input
                    value={settings.general.siteUrl}
                    onChange={(e) => updateSettings('general', 'siteUrl', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Site Description</label>
                <Textarea
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                  rows={3}
                  placeholder="Enter site description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <Select value={settings.general.timezone} onValueChange={(value) => updateSettings('general', 'timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Colombo">Asia/Colombo</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <Select value={settings.general.language} onValueChange={(value) => updateSettings('general', 'language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="si">Sinhala</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <Select value={settings.general.currency} onValueChange={(value) => updateSettings('general', 'currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="LKR">LKR (Rs)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Email</label>
                  <Input
                    type="email"
                    value={settings.contact.email}
                    onChange={(e) => updateSettings('contact', 'email', e.target.value)}
                    placeholder="info@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Phone</label>
                  <Input
                    value={settings.contact.phone}
                    onChange={(e) => updateSettings('contact', 'phone', e.target.value)}
                    placeholder="+94 11 234 5678"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <Textarea
                  value={settings.contact.address}
                  onChange={(e) => updateSettings('contact', 'address', e.target.value)}
                  rows={2}
                  placeholder="Enter business address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">WhatsApp</label>
                  <Input
                    value={settings.contact.whatsapp}
                    onChange={(e) => updateSettings('contact', 'whatsapp', e.target.value)}
                    placeholder="+94 77 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Facebook</label>
                  <Input
                    value={settings.contact.facebook}
                    onChange={(e) => updateSettings('contact', 'facebook', e.target.value)}
                    placeholder="facebook_username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Instagram</label>
                  <Input
                    value={settings.contact.instagram}
                    onChange={(e) => updateSettings('contact', 'instagram', e.target.value)}
                    placeholder="instagram_username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-600" />
                SEO & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Meta Title</label>
                <Input
                  value={settings.seo.metaTitle}
                  onChange={(e) => updateSettings('seo', 'metaTitle', e.target.value)}
                  placeholder="Enter meta title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Meta Description</label>
                <Textarea
                  value={settings.seo.metaDescription}
                  onChange={(e) => updateSettings('seo', 'metaDescription', e.target.value)}
                  rows={3}
                  placeholder="Enter meta description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Google Analytics ID</label>
                  <Input
                    value={settings.seo.googleAnalytics}
                    onChange={(e) => updateSettings('seo', 'googleAnalytics', e.target.value)}
                    placeholder="GA-XXXXXXXXX-X"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Google Tag Manager</label>
                  <Input
                    value={settings.seo.googleTagManager}
                    onChange={(e) => updateSettings('seo', 'googleTagManager', e.target.value)}
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Facebook Pixel</label>
                  <Input
                    value={settings.seo.facebookPixel}
                    onChange={(e) => updateSettings('seo', 'facebookPixel', e.target.value)}
                    placeholder="XXXXXXXXXX"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                Payment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Stripe Payments</h4>
                    <p className="text-sm text-gray-600">Credit card processing</p>
                  </div>
                  <Switch
                    checked={settings.payment.stripeEnabled}
                    onCheckedChange={(checked) => updateSettings('payment', 'stripeEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">PayPal Payments</h4>
                    <p className="text-sm text-gray-600">PayPal integration</p>
                  </div>
                  <Switch
                    checked={settings.payment.paypalEnabled}
                    onCheckedChange={(checked) => updateSettings('payment', 'paypalEnabled', checked)}
                  />
                </div>
              </div>

              {settings.payment.stripeEnabled && (
                <div>
                  <label className="block text-sm font-medium mb-2">Stripe Public Key</label>
                  <Input
                    value={settings.payment.stripeKey}
                    onChange={(e) => updateSettings('payment', 'stripeKey', e.target.value)}
                    placeholder="pk_test_..."
                  />
                </div>
              )}

              {settings.payment.paypalEnabled && (
                <div>
                  <label className="block text-sm font-medium mb-2">PayPal Client ID</label>
                  <Input
                    value={settings.payment.paypalClientId}
                    onChange={(e) => updateSettings('payment', 'paypalClientId', e.target.value)}
                    placeholder="client_id_..."
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <Select value={settings.payment.currency} onValueChange={(value) => updateSettings('payment', 'currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="LKR">LKR (Rs)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                  <Input
                    type="number"
                    value={settings.payment.taxRate}
                    onChange={(e) => updateSettings('payment', 'taxRate', parseFloat(e.target.value))}
                    placeholder="15"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Allow User Registration</h4>
                    <p className="text-sm text-gray-600">Allow new users to register</p>
                  </div>
                  <Switch
                    checked={settings.security.allowRegistration}
                    onCheckedChange={(checked) => updateSettings('security', 'allowRegistration', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Require Email Verification</h4>
                    <p className="text-sm text-gray-600">Users must verify email before login</p>
                  </div>
                  <Switch
                    checked={settings.security.requireEmailVerification}
                    onCheckedChange={(checked) => updateSettings('security', 'requireEmailVerification', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Enable 2FA for admin accounts</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => updateSettings('security', 'twoFactorAuth', checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Max Login Attempts</label>
                  <Input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                  <Input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Lock className="w-4 h-4 mr-2" />
                  Reset All Passwords
                </Button>
                <Button variant="outline" className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  View Security Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Send email notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSettings('notifications', 'emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Booking Confirmations</h4>
                    <p className="text-sm text-gray-600">Send booking confirmation emails</p>
                  </div>
                  <Switch
                    checked={settings.notifications.bookingConfirmations}
                    onCheckedChange={(checked) => updateSettings('notifications', 'bookingConfirmations', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Payment Notifications</h4>
                    <p className="text-sm text-gray-600">Send payment confirmation emails</p>
                  </div>
                  <Switch
                    checked={settings.notifications.paymentNotifications}
                    onCheckedChange={(checked) => updateSettings('notifications', 'paymentNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Admin Alerts</h4>
                    <p className="text-sm text-gray-600">Send alerts to admin</p>
                  </div>
                  <Switch
                    checked={settings.notifications.adminAlerts}
                    onCheckedChange={(checked) => updateSettings('notifications', 'adminAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Send SMS notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => updateSettings('notifications', 'smsNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Settings */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Maintenance Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Enable Maintenance Mode</h4>
                  <p className="text-sm text-gray-600">Show maintenance page to visitors</p>
                </div>
                <Switch
                  checked={settings.maintenance.maintenanceMode}
                  onCheckedChange={(checked) => updateSettings('maintenance', 'maintenanceMode', checked)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Maintenance Message</label>
                <Textarea
                  value={settings.maintenance.maintenanceMessage}
                  onChange={(e) => updateSettings('maintenance', 'maintenanceMessage', e.target.value)}
                  rows={3}
                  placeholder="Enter maintenance message"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Allowed IP Addresses</label>
                <Input
                  value={settings.maintenance.allowedIPs}
                  onChange={(e) => updateSettings('maintenance', 'allowedIPs', e.target.value)}
                  placeholder="127.0.0.1,192.168.1.1"
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated list of IPs that can access the site during maintenance</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Settings */}
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                Theme Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Color</label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      value={settings.theme.primaryColor} 
                      onChange={(e) => updateSettings('theme', 'primaryColor', e.target.value)}
                      className="w-16 h-10" 
                    />
                    <Input 
                      value={settings.theme.primaryColor} 
                      onChange={(e) => updateSettings('theme', 'primaryColor', e.target.value)}
                      className="flex-1" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Color</label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      value={settings.theme.secondaryColor} 
                      onChange={(e) => updateSettings('theme', 'secondaryColor', e.target.value)}
                      className="w-16 h-10" 
                    />
                    <Input 
                      value={settings.theme.secondaryColor} 
                      onChange={(e) => updateSettings('theme', 'secondaryColor', e.target.value)}
                      className="flex-1" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Accent Color</label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      value={settings.theme.accentColor} 
                      onChange={(e) => updateSettings('theme', 'accentColor', e.target.value)}
                      className="w-16 h-10" 
                    />
                    <Input 
                      value={settings.theme.accentColor} 
                      onChange={(e) => updateSettings('theme', 'accentColor', e.target.value)}
                      className="flex-1" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Dark Mode</h4>
                  <p className="text-sm text-gray-600">Enable dark theme</p>
                </div>
                <Switch
                  checked={settings.theme.darkMode}
                  onCheckedChange={(checked) => updateSettings('theme', 'darkMode', checked)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Custom CSS</label>
                <Textarea
                  value={settings.theme.customCSS}
                  onChange={(e) => updateSettings('theme', 'customCSS', e.target.value)}
                  rows={6}
                  placeholder="Enter custom CSS code"
                />
              </div>
              
              <Button variant="outline" className="w-full">
                Reset to Default Theme
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsSection;
