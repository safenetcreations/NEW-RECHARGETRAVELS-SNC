import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User, Car, CreditCard, FileText, Star, Languages, Shield, Camera, Save, X, Loader2
} from 'lucide-react';
import { Driver, DriverTier, DriverStatus, VehicleType } from '../../../services/firebaseDriverService';

interface DriverFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (driver: Partial<Driver>) => Promise<void>;
  driver: Driver | null;
}

const TIERS: { value: DriverTier; label: string; description: string }[] = [
  { value: 'chauffeur_guide', label: 'Chauffeur Guide (SLTDA)', description: 'Licensed to guide at heritage sites' },
  { value: 'national_guide', label: 'National Guide', description: 'Licensed for larger groups' },
  { value: 'tourist_driver', label: 'Tourist Driver (SLITHM)', description: 'Trained driver, no guiding' },
  { value: 'freelance_driver', label: 'Freelance Driver', description: 'Standard driver' },
];

const STATUSES: { value: DriverStatus; label: string; color: string }[] = [
  { value: 'verified', label: 'Verified', color: 'bg-green-100 text-green-800' },
  { value: 'pending_verification', label: 'Pending Verification', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'incomplete', label: 'Incomplete', color: 'bg-gray-100 text-gray-800' },
  { value: 'suspended', label: 'Suspended', color: 'bg-red-100 text-red-800' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-600' },
];

const VEHICLE_TYPES: { value: VehicleType; label: string; capacity: string }[] = [
  { value: 'sedan', label: 'Sedan', capacity: '3 passengers' },
  { value: 'suv', label: 'SUV', capacity: '5 passengers' },
  { value: 'van', label: 'Van/KDH', capacity: '8 passengers' },
  { value: 'mini_coach', label: 'Mini Coach', capacity: '15 passengers' },
  { value: 'luxury', label: 'Luxury', capacity: '3 passengers' },
];

const LANGUAGES = ['English', 'Sinhala', 'Tamil', 'German', 'French', 'Spanish', 'Italian', 'Japanese', 'Chinese', 'Korean', 'Russian', 'Hindi'];

const DriverFormDialog: React.FC<DriverFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  driver,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<Partial<Driver>>({
    full_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    tier: 'freelance_driver',
    current_status: 'pending_verification',
    biography: '',
    specialty_languages: ['English'],
    years_experience: 0,
    is_sltda_approved: false,
    is_guide: false,
    is_chauffeur: true,
    vehicle_type: 'sedan',
    vehicle_make_model: '',
    vehicle_registration: '',
    vehicle_capacity: 4,
    vehicle_ac: true,
    vehicle_wifi: false,
    vehicle_preference: 'own_vehicle',
    daily_rate: 0,
    hourly_rate: 0,
    airport_rate: 0,
    per_km_rate: 0,
    average_rating: 5.0,
    profile_photo: '',
    cover_image: '',
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        ...driver,
        specialty_languages: driver.specialty_languages || ['English'],
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        whatsapp: '',
        tier: 'freelance_driver',
        current_status: 'pending_verification',
        biography: '',
        specialty_languages: ['English'],
        years_experience: 0,
        is_sltda_approved: false,
        is_guide: false,
        is_chauffeur: true,
        vehicle_type: 'sedan',
        vehicle_make_model: '',
        vehicle_registration: '',
        vehicle_capacity: 4,
        vehicle_ac: true,
        vehicle_wifi: false,
        vehicle_preference: 'own_vehicle',
        daily_rate: 0,
        hourly_rate: 0,
        airport_rate: 0,
        per_km_rate: 0,
        average_rating: 5.0,
        profile_photo: '',
        cover_image: '',
      });
    }
    setActiveTab('basic');
  }, [driver, isOpen]);

  const handleChange = (field: keyof Driver, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleLanguage = (lang: string) => {
    const current = formData.specialty_languages || [];
    if (current.includes(lang)) {
      handleChange('specialty_languages', current.filter(l => l !== lang));
    } else {
      handleChange('specialty_languages', [...current, lang]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <User className="w-6 h-6 text-blue-600" />
            {driver ? 'Edit Driver' : 'Add New Driver'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <User className="w-4 h-4" /> Basic
              </TabsTrigger>
              <TabsTrigger value="vehicle" className="flex items-center gap-2">
                <Car className="w-4 h-4" /> Vehicle
              </TabsTrigger>
              <TabsTrigger value="rates" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Rates
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Docs
              </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    Personal Information
                  </h3>

                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      value={formData.full_name || ''}
                      onChange={(e) => handleChange('full_name', e.target.value)}
                      placeholder="John Perera"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Phone *</Label>
                      <Input
                        value={formData.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+94 77 123 4567"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Biography</Label>
                    <Textarea
                      value={formData.biography || ''}
                      onChange={(e) => handleChange('biography', e.target.value)}
                      placeholder="Experienced driver with 10+ years..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    Status & Classification
                  </h3>

                  <div>
                    <Label>Driver Tier *</Label>
                    <Select value={formData.tier} onValueChange={(v) => handleChange('tier', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TIERS.map((tier) => (
                          <SelectItem key={tier.value} value={tier.value}>{tier.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Status *</Label>
                    <Select value={formData.current_status} onValueChange={(v) => handleChange('current_status', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            <Badge className={s.color}>{s.label}</Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Years of Experience</Label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.years_experience || 0}
                      onChange={(e) => handleChange('years_experience', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <Label>SLTDA Approved</Label>
                      <Switch checked={formData.is_sltda_approved || false} onCheckedChange={(v) => handleChange('is_sltda_approved', v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Licensed Guide</Label>
                      <Switch checked={formData.is_guide || false} onCheckedChange={(v) => handleChange('is_guide', v)} />
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Languages className="w-4 h-4" /> Languages
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.slice(0, 8).map((lang) => {
                        const isSelected = (formData.specialty_languages || []).includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => toggleLanguage(lang)}
                            className={`px-2 py-1 rounded-full text-xs transition ${
                              isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            {lang}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Vehicle Tab */}
            <TabsContent value="vehicle" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Car className="w-5 h-5 text-blue-500" /> Vehicle Details
                  </h3>

                  <div>
                    <Label>Vehicle Type</Label>
                    <Select value={formData.vehicle_type} onValueChange={(v) => handleChange('vehicle_type', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {VEHICLE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label} ({type.capacity})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Make & Model</Label>
                    <Input
                      value={formData.vehicle_make_model || ''}
                      onChange={(e) => handleChange('vehicle_make_model', e.target.value)}
                      placeholder="Toyota Prado 2020"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Registration</Label>
                      <Input
                        value={formData.vehicle_registration || ''}
                        onChange={(e) => handleChange('vehicle_registration', e.target.value)}
                        placeholder="CAB-1234"
                      />
                    </div>
                    <div>
                      <Label>Capacity</Label>
                      <Input
                        type="number"
                        min={1}
                        value={formData.vehicle_capacity || 4}
                        onChange={(e) => handleChange('vehicle_capacity', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Features</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Air Conditioning</Label>
                      <Switch checked={formData.vehicle_ac || false} onCheckedChange={(v) => handleChange('vehicle_ac', v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>WiFi Available</Label>
                      <Switch checked={formData.vehicle_wifi || false} onCheckedChange={(v) => handleChange('vehicle_wifi', v)} />
                    </div>
                  </div>
                  <div>
                    <Label>Vehicle Photo URL</Label>
                    <Input
                      value={formData.vehicle_photo || ''}
                      onChange={(e) => handleChange('vehicle_photo', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Rates Tab */}
            <TabsContent value="rates" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-500" /> Pricing (USD)
                  </h3>

                  <div>
                    <Label>Daily Rate</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        min={0}
                        value={formData.daily_rate || 0}
                        onChange={(e) => handleChange('daily_rate', parseFloat(e.target.value))}
                        className="pl-7"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Airport Transfer Rate</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        min={0}
                        value={formData.airport_rate || 0}
                        onChange={(e) => handleChange('airport_rate', parseFloat(e.target.value))}
                        className="pl-7"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Per KM Rate</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={formData.per_km_rate || 0}
                        onChange={(e) => handleChange('per_km_rate', parseFloat(e.target.value))}
                        className="pl-7"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" /> Rating
                  </h3>

                  <div>
                    <Label>Average Rating (0-5)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      value={formData.average_rating || 5.0}
                      onChange={(e) => handleChange('average_rating', parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Total Reviews</Label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.total_reviews || 0}
                      onChange={(e) => handleChange('total_reviews', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-500" /> Licenses
                  </h3>

                  <div>
                    <Label>SLTDA License Number</Label>
                    <Input
                      value={formData.sltda_license_number || ''}
                      onChange={(e) => handleChange('sltda_license_number', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Driver's License Number</Label>
                    <Input
                      value={formData.drivers_license_number || ''}
                      onChange={(e) => handleChange('drivers_license_number', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>National ID</Label>
                    <Input
                      value={formData.national_id_number || ''}
                      onChange={(e) => handleChange('national_id_number', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-500" /> Photos
                  </h3>

                  <div>
                    <Label>Profile Photo URL</Label>
                    <Input
                      value={formData.profile_photo || ''}
                      onChange={(e) => handleChange('profile_photo', e.target.value)}
                    />
                    {formData.profile_photo && (
                      <img src={formData.profile_photo} alt="Profile" className="w-16 h-16 rounded-full object-cover mt-2" />
                    )}
                  </div>

                  <div>
                    <Label>Cover Image URL</Label>
                    <Input
                      value={formData.cover_image || ''}
                      onChange={(e) => handleChange('cover_image', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 to-indigo-600">
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> {driver ? 'Update' : 'Create'}</>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DriverFormDialog;
