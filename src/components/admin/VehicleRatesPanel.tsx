// Admin Panel for Vehicle Rates & Service Charges Management
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Car, DollarSign, Loader2, Plus, Trash2, Save, Settings, Percent } from 'lucide-react';

interface VehicleType {
  id: string;
  name: string;
  description: string;
  capacity: number;
  dailyRate: number;
  perKmRate: number;
  airportRate: number;
  image?: string;
}

interface ServiceCharge {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  active: boolean;
}

interface PricingConfig {
  vehicles: VehicleType[];
  serviceCharges: ServiceCharge[];
  fuelSurcharge: number;
  nightDrivingCharge: number;
  waitingChargePerHour: number;
  minimumBookingHours: number;
  cancellationFee: number;
  updatedAt: string;
}

const DEFAULT_CONFIG: PricingConfig = {
  vehicles: [
    {
      id: 'sedan',
      name: 'Sedan (Toyota Axio/Premio)',
      description: 'Comfortable sedan for up to 3 passengers',
      capacity: 3,
      dailyRate: 50,
      perKmRate: 0.25,
      airportRate: 35,
    },
    {
      id: 'suv',
      name: 'SUV (Toyota Prado/Fortuner)',
      description: 'Spacious SUV for up to 5 passengers',
      capacity: 5,
      dailyRate: 80,
      perKmRate: 0.35,
      airportRate: 55,
    },
    {
      id: 'van',
      name: 'Mini Van (Toyota KDH)',
      description: 'Comfortable van for up to 8 passengers',
      capacity: 8,
      dailyRate: 100,
      perKmRate: 0.45,
      airportRate: 70,
    },
    {
      id: 'luxury',
      name: 'Luxury (Mercedes/BMW)',
      description: 'Premium luxury vehicle for VIP transfers',
      capacity: 3,
      dailyRate: 150,
      perKmRate: 0.60,
      airportRate: 100,
    },
    {
      id: 'bus',
      name: 'Coach Bus (33 Seater)',
      description: 'Large coach for group transfers',
      capacity: 33,
      dailyRate: 250,
      perKmRate: 1.00,
      airportRate: 180,
    },
  ],
  serviceCharges: [
    {
      id: 'service_fee',
      name: 'Service Fee',
      type: 'percentage',
      value: 10,
      description: 'Platform service charge',
      active: true,
    },
    {
      id: 'driver_tip',
      name: 'Driver Accommodation',
      type: 'fixed',
      value: 15,
      description: 'Driver accommodation per night',
      active: true,
    },
    {
      id: 'gst',
      name: 'GST/VAT',
      type: 'percentage',
      value: 0,
      description: 'Government tax',
      active: false,
    },
  ],
  fuelSurcharge: 0,
  nightDrivingCharge: 10,
  waitingChargePerHour: 5,
  minimumBookingHours: 4,
  cancellationFee: 20,
  updatedAt: new Date().toISOString(),
};

const VehicleRatesPanel = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'charges' | 'settings'>('vehicles');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const configDoc = await getDoc(doc(db, 'settings', 'pricing_config'));
      if (configDoc.exists()) {
        setConfig({ ...DEFAULT_CONFIG, ...configDoc.data() as PricingConfig });
      }
    } catch (error) {
      console.error('Error loading pricing config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'pricing_config'), {
        ...config,
        updatedAt: new Date().toISOString(),
      });
      toast({
        title: 'Settings Saved',
        description: 'Vehicle rates and service charges have been updated.',
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateVehicle = (id: string, field: keyof VehicleType, value: any) => {
    setConfig(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(v =>
        v.id === id ? { ...v, [field]: value } : v
      ),
    }));
  };

  const addVehicle = () => {
    const newVehicle: VehicleType = {
      id: `vehicle_${Date.now()}`,
      name: 'New Vehicle',
      description: 'Description',
      capacity: 4,
      dailyRate: 60,
      perKmRate: 0.30,
      airportRate: 40,
    };
    setConfig(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, newVehicle],
    }));
  };

  const removeVehicle = (id: string) => {
    setConfig(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter(v => v.id !== id),
    }));
  };

  const updateServiceCharge = (id: string, field: keyof ServiceCharge, value: any) => {
    setConfig(prev => ({
      ...prev,
      serviceCharges: prev.serviceCharges.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  const addServiceCharge = () => {
    const newCharge: ServiceCharge = {
      id: `charge_${Date.now()}`,
      name: 'New Charge',
      type: 'fixed',
      value: 0,
      description: 'Description',
      active: false,
    };
    setConfig(prev => ({
      ...prev,
      serviceCharges: [...prev.serviceCharges, newCharge],
    }));
  };

  const removeServiceCharge = (id: string) => {
    setConfig(prev => ({
      ...prev,
      serviceCharges: prev.serviceCharges.filter(s => s.id !== id),
    }));
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Vehicle Rates & Service Charges</CardTitle>
                <CardDescription>
                  Manage pricing for all vehicles and additional charges
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={saveConfig}
              disabled={isSaving}
              className="bg-gradient-to-r from-teal-500 to-emerald-500"
            >
              {isSaving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Save All Changes</>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {[
          { id: 'vehicles', label: 'Vehicle Rates', icon: Car },
          { id: 'charges', label: 'Service Charges', icon: Percent },
          { id: 'settings', label: 'Other Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white shadow text-teal-600'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Vehicle Rates Tab */}
      {activeTab === 'vehicles' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Vehicle Types & Rates</CardTitle>
              <Button onClick={addVehicle} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" /> Add Vehicle
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {config.vehicles.map((vehicle, index) => (
                <div
                  key={vehicle.id}
                  className="p-4 border rounded-xl bg-gray-50 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-teal-600">
                      Vehicle #{index + 1}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVehicle(vehicle.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Vehicle Name</Label>
                      <Input
                        value={vehicle.name}
                        onChange={(e) => updateVehicle(vehicle.id, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Passenger Capacity</Label>
                      <Input
                        type="number"
                        value={vehicle.capacity}
                        onChange={(e) => updateVehicle(vehicle.id, 'capacity', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Input
                      value={vehicle.description}
                      onChange={(e) => updateVehicle(vehicle.id, 'description', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Daily Rate (USD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="number"
                          value={vehicle.dailyRate}
                          onChange={(e) => updateVehicle(vehicle.id, 'dailyRate', parseFloat(e.target.value))}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Per KM Rate (USD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="number"
                          step="0.01"
                          value={vehicle.perKmRate}
                          onChange={(e) => updateVehicle(vehicle.id, 'perKmRate', parseFloat(e.target.value))}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Airport Rate (USD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="number"
                          value={vehicle.airportRate}
                          onChange={(e) => updateVehicle(vehicle.id, 'airportRate', parseFloat(e.target.value))}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Charges Tab */}
      {activeTab === 'charges' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Service Charges & Fees</CardTitle>
              <Button onClick={addServiceCharge} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" /> Add Charge
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {config.serviceCharges.map((charge) => (
                <div
                  key={charge.id}
                  className={`p-4 border rounded-xl space-y-4 ${
                    charge.active ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={charge.active}
                          onChange={(e) => updateServiceCharge(charge.id, 'active', e.target.checked)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="font-medium">{charge.active ? 'Active' : 'Inactive'}</span>
                      </label>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeServiceCharge(charge.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Charge Name</Label>
                      <Input
                        value={charge.name}
                        onChange={(e) => updateServiceCharge(charge.id, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <select
                        value={charge.type}
                        onChange={(e) => updateServiceCharge(charge.id, 'type', e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount ($)</option>
                      </select>
                    </div>
                    <div>
                      <Label>Value</Label>
                      <div className="relative">
                        {charge.type === 'percentage' ? (
                          <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        ) : (
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        )}
                        <Input
                          type="number"
                          step="0.01"
                          value={charge.value}
                          onChange={(e) => updateServiceCharge(charge.id, 'value', parseFloat(e.target.value))}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Input
                      value={charge.description}
                      onChange={(e) => updateServiceCharge(charge.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Settings Tab */}
      {activeTab === 'settings' && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Pricing Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Fuel Surcharge (%)</Label>
                  <Input
                    type="number"
                    value={config.fuelSurcharge}
                    onChange={(e) => setConfig(prev => ({ ...prev, fuelSurcharge: parseFloat(e.target.value) }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Applied when fuel prices increase</p>
                </div>

                <div>
                  <Label>Night Driving Charge (USD/trip)</Label>
                  <Input
                    type="number"
                    value={config.nightDrivingCharge}
                    onChange={(e) => setConfig(prev => ({ ...prev, nightDrivingCharge: parseFloat(e.target.value) }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">For trips between 10 PM - 6 AM</p>
                </div>

                <div>
                  <Label>Waiting Charge (USD/hour)</Label>
                  <Input
                    type="number"
                    value={config.waitingChargePerHour}
                    onChange={(e) => setConfig(prev => ({ ...prev, waitingChargePerHour: parseFloat(e.target.value) }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">After 30 minutes free waiting</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Minimum Booking Hours</Label>
                  <Input
                    type="number"
                    value={config.minimumBookingHours}
                    onChange={(e) => setConfig(prev => ({ ...prev, minimumBookingHours: parseInt(e.target.value) }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum hours for daily bookings</p>
                </div>

                <div>
                  <Label>Cancellation Fee (%)</Label>
                  <Input
                    type="number"
                    value={config.cancellationFee}
                    onChange={(e) => setConfig(prev => ({ ...prev, cancellationFee: parseFloat(e.target.value) }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Fee for cancellations within 24 hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last Updated */}
      <p className="text-sm text-gray-500 text-center">
        Last updated: {new Date(config.updatedAt).toLocaleString()}
      </p>
    </div>
  );
};

export default VehicleRatesPanel;
