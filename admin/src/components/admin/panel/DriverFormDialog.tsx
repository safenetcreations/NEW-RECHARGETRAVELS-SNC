import React, { useState, useEffect, useRef } from 'react';
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
  User, Car, CreditCard, FileText, Star, Languages, Shield, Camera, Save, X, Loader2, Upload, Image, Trash2
} from 'lucide-react';
import { Driver, DriverTier, DriverStatus, VehicleType, firebaseDriverService } from '../../../services/firebaseDriverService';
import { toast } from 'sonner';

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
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  
  // File input refs
  const profilePhotosRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);
  const vehiclePhotosRef = useRef<HTMLInputElement>(null);
  
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
        profile_photos: driver.profile_photos || (driver.profile_photo ? [driver.profile_photo] : []),
        vehicle_photos: driver.vehicle_photos || (driver.vehicle_photo ? [driver.vehicle_photo] : []),
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
        profile_photos: [],
        cover_image: '',
        vehicle_photos: [],
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

  // Image upload handler
  const handleImageUpload = async (
    file: File,
    type: 'profile' | 'cover' | 'vehicle' | 'sltda_license' | 'driver_license' | 'national_id',
    fieldName: keyof Driver
  ) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    
    setUploadingImage(type);
    
    try {
      // If driver exists, use their ID, otherwise generate a temp ID
      const driverId = driver?.id || `temp_${Date.now()}`;
      const url = await firebaseDriverService.uploadDriverPhoto(file, driverId, type as any);
      handleChange(fieldName, url);
      toast.success(`${type.replace('_', ' ')} uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(null);
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
                        placeholder="+94 77 772 1999"
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
              {/* Driver Profile Photos (up to 5) */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-500" /> 
                  Driver Profile Photos 
                  <span className="text-sm font-normal text-gray-500">(up to 5 photos)</span>
                </h3>
                
                <input
                  type="file"
                  ref={profilePhotosRef}
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    const currentPhotos = formData.profile_photos || [];
                    if (currentPhotos.length + files.length > 5) {
                      toast.error('Maximum 5 profile photos allowed');
                      return;
                    }
                    for (const file of files) {
                      setUploadingImage('profile');
                      try {
                        const driverId = driver?.id || `temp_${Date.now()}`;
                        const url = await firebaseDriverService.uploadDriverPhoto(file, driverId, 'profile');
                        handleChange('profile_photos', [...(formData.profile_photos || []), url]);
                        // Also set first photo as main profile photo
                        if (!formData.profile_photo) {
                          handleChange('profile_photo', url);
                        }
                      } catch (error) {
                        toast.error('Failed to upload image');
                      }
                    }
                    setUploadingImage(null);
                    e.target.value = '';
                  }}
                />
                
                <div className="grid grid-cols-5 gap-3">
                  {/* Show existing photos */}
                  {(formData.profile_photos || []).map((photo, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img 
                        src={photo} 
                        alt={`Profile ${index + 1}`} 
                        className={`w-full h-full object-cover rounded-xl border-2 ${index === 0 ? 'border-blue-500' : 'border-gray-200'}`}
                      />
                      {index === 0 && (
                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">Main</span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-1">
                        {index !== 0 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              // Set as main photo
                              handleChange('profile_photo', photo);
                              const newPhotos = [photo, ...(formData.profile_photos || []).filter((_, i) => i !== index)];
                              handleChange('profile_photos', newPhotos);
                            }}
                            title="Set as main"
                          >
                            <Star className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            const newPhotos = (formData.profile_photos || []).filter((_, i) => i !== index);
                            handleChange('profile_photos', newPhotos);
                            if (formData.profile_photo === photo) {
                              handleChange('profile_photo', newPhotos[0] || '');
                            }
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add photo button */}
                  {(formData.profile_photos?.length || 0) < 5 && (
                    <button
                      type="button"
                      onClick={() => profilePhotosRef.current?.click()}
                      disabled={uploadingImage === 'profile'}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      {uploadingImage === 'profile' ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-[10px] text-gray-500">Add Photo</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Image className="w-5 h-5 text-purple-500" /> Cover Image
                </h3>
                
                <input
                  type="file"
                  ref={coverImageRef}
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadingImage('cover');
                      try {
                        const driverId = driver?.id || `temp_${Date.now()}`;
                        const url = await firebaseDriverService.uploadDriverPhoto(file, driverId, 'cover');
                        handleChange('cover_image', url);
                        toast.success('Cover image uploaded');
                      } catch (error) {
                        toast.error('Failed to upload cover image');
                      }
                      setUploadingImage(null);
                    }
                  }}
                />
                
                {formData.cover_image ? (
                  <div className="relative group">
                    <img 
                      src={formData.cover_image} 
                      alt="Cover" 
                      className="w-full h-40 object-cover rounded-xl border-2 border-gray-200" 
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                      <Button type="button" size="sm" variant="secondary" onClick={() => coverImageRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-1" /> Replace
                      </Button>
                      <Button type="button" size="sm" variant="destructive" onClick={() => handleChange('cover_image', '')}>
                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => coverImageRef.current?.click()}
                    disabled={uploadingImage === 'cover'}
                    className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-purple-400 hover:bg-purple-50 transition-colors"
                  >
                    {uploadingImage === 'cover' ? (
                      <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                    ) : (
                      <>
                        <Image className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-500">Click to upload cover image</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Vehicle Photos (multiple) */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Car className="w-5 h-5 text-green-500" /> 
                  Vehicle Photos 
                  <span className="text-sm font-normal text-gray-500">(multiple photos)</span>
                </h3>
                
                <input
                  type="file"
                  ref={vehiclePhotosRef}
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    for (const file of files) {
                      setUploadingImage('vehicle');
                      try {
                        const driverId = driver?.id || `temp_${Date.now()}`;
                        const url = await firebaseDriverService.uploadDriverPhoto(file, driverId, 'vehicle');
                        handleChange('vehicle_photos', [...(formData.vehicle_photos || []), url]);
                        // Also set first photo as main vehicle photo
                        if (!formData.vehicle_photo) {
                          handleChange('vehicle_photo', url);
                        }
                      } catch (error) {
                        toast.error('Failed to upload vehicle image');
                      }
                    }
                    setUploadingImage(null);
                    e.target.value = '';
                  }}
                />
                
                <div className="grid grid-cols-4 gap-3">
                  {/* Show existing vehicle photos */}
                  {(formData.vehicle_photos || []).map((photo, index) => (
                    <div key={index} className="relative group aspect-video">
                      <img 
                        src={photo} 
                        alt={`Vehicle ${index + 1}`} 
                        className={`w-full h-full object-cover rounded-xl border-2 ${index === 0 ? 'border-green-500' : 'border-gray-200'}`}
                      />
                      {index === 0 && (
                        <span className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded">Main</span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-1">
                        {index !== 0 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              handleChange('vehicle_photo', photo);
                              const newPhotos = [photo, ...(formData.vehicle_photos || []).filter((_, i) => i !== index)];
                              handleChange('vehicle_photos', newPhotos);
                            }}
                            title="Set as main"
                          >
                            <Star className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            const newPhotos = (formData.vehicle_photos || []).filter((_, i) => i !== index);
                            handleChange('vehicle_photos', newPhotos);
                            if (formData.vehicle_photo === photo) {
                              handleChange('vehicle_photo', newPhotos[0] || '');
                            }
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add vehicle photo button */}
                  <button
                    type="button"
                    onClick={() => vehiclePhotosRef.current?.click()}
                    disabled={uploadingImage === 'vehicle'}
                    className="aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-green-400 hover:bg-green-50 transition-colors"
                  >
                    {uploadingImage === 'vehicle' ? (
                      <Loader2 className="w-5 h-5 animate-spin text-green-500" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-[10px] text-gray-500">Add Vehicle Photo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Licenses Section */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-500" /> License Numbers
                  </h3>

                  <div>
                    <Label>SLTDA License Number</Label>
                    <Input
                      value={formData.sltda_license_number || ''}
                      onChange={(e) => handleChange('sltda_license_number', e.target.value)}
                      placeholder="SLTDA-XXXX-XXXX"
                    />
                  </div>

                  <div>
                    <Label>Driver's License Number</Label>
                    <Input
                      value={formData.drivers_license_number || ''}
                      onChange={(e) => handleChange('drivers_license_number', e.target.value)}
                      placeholder="B1234567"
                    />
                  </div>

                  <div>
                    <Label>National ID Number</Label>
                    <Input
                      value={formData.national_id_number || ''}
                      onChange={(e) => handleChange('national_id_number', e.target.value)}
                      placeholder="123456789V"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" /> License Expiry Dates
                  </h3>

                  <div>
                    <Label>SLTDA License Expiry</Label>
                    <Input
                      type="date"
                      value={formData.sltda_license_expiry || ''}
                      onChange={(e) => handleChange('sltda_license_expiry', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Driver's License Expiry</Label>
                    <Input
                      type="date"
                      value={formData.drivers_license_expiry || ''}
                      onChange={(e) => handleChange('drivers_license_expiry', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Police Clearance Expiry</Label>
                    <Input
                      type="date"
                      value={formData.police_clearance_expiry || ''}
                      onChange={(e) => handleChange('police_clearance_expiry', e.target.value)}
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
