
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface CulturalSettingsProps {
  onSave: () => void;
}

const CulturalSettings: React.FC<CulturalSettingsProps> = ({ onSave }) => {
  const [settings, setSettings] = useState({
    companyName: 'Recharge Travels',
    tagline: 'Your Gateway to Sri Lanka\'s Cultural Heritage',
    phone: '+94 77 772 1999',
    email: 'info@rechargetravels.com',
    whatsapp: '+94 77 772 1999',
    address: 'Galle Road, Colombo, Sri Lanka',
    mission: 'To provide our valued customers with a courteous, comfortable, safe and memorable tour service all around Sri Lanka, on an affordable budget'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <section className="admin-section active">
      <div className="section-header">
        <h2 className="section-title">General Settings</h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={settings.companyName}
                  onChange={handleInputChange}
                  className="cultural-input"
                />
              </div>

              <div className="form-group">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  name="tagline"
                  value={settings.tagline}
                  onChange={handleInputChange}
                  className="cultural-input"
                />
              </div>

              <div className="form-group">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={settings.phone}
                  onChange={handleInputChange}
                  className="cultural-input"
                />
              </div>

              <div className="form-group">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  className="cultural-input"
                />
              </div>

              <div className="form-group">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  value={settings.whatsapp}
                  onChange={handleInputChange}
                  className="cultural-input"
                />
              </div>

              <div className="form-group">
                <Label htmlFor="address">Office Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={settings.address}
                  onChange={handleInputChange}
                  className="cultural-input"
                />
              </div>
            </div>

            <div className="form-group">
              <Label htmlFor="mission">Mission Statement</Label>
              <Textarea
                id="mission"
                name="mission"
                value={settings.mission}
                onChange={handleInputChange}
                rows={3}
                className="cultural-input"
              />
            </div>

            <Button type="submit" className="btn-primary">
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default CulturalSettings;
