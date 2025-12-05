/**
 * Seasonal Pricing Manager Component
 * Admin UI for managing seasonal rates and dynamic pricing rules
 */
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Sun,
  Cloud,
  Snowflake,
  Umbrella,
  Star,
  TrendingUp,
  TrendingDown,
  Percent,
  DollarSign,
  AlertCircle,
  Check,
  Copy,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// ==========================================
// TYPES
// ==========================================

export type SeasonType = 'peak' | 'high' | 'regular' | 'low' | 'off';

export type PriceAdjustmentType = 'percentage' | 'fixed_amount';

export interface SeasonalRate {
  id?: string;
  name: string;
  description: string;
  seasonType: SeasonType;

  // Date range
  startDate: string;
  endDate: string;
  recurring: boolean; // Repeat every year

  // Price adjustment
  adjustmentType: PriceAdjustmentType;
  adjustmentValue: number; // Percentage (can be negative) or fixed amount

  // Targeting
  applicableVehicleTypes: string[]; // Empty = all
  applicableOwnerIds: string[]; // Empty = all
  excludedVehicleIds: string[];

  // Status
  isActive: boolean;
  priority: number; // Higher priority takes precedence

  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface SpecialDateRate {
  id?: string;
  name: string;
  date: string; // Single date or start of range
  endDate?: string; // For multi-day events
  adjustmentType: PriceAdjustmentType;
  adjustmentValue: number;
  isActive: boolean;
  createdAt: string;
}

// ==========================================
// CONSTANTS
// ==========================================

const SEASONAL_RATES_COLLECTION = 'vehicle_seasonal_rates';
const SPECIAL_DATES_COLLECTION = 'vehicle_special_dates';

const SEASON_CONFIG: Record<SeasonType, { label: string; color: string; icon: React.ReactNode; description: string }> = {
  peak: {
    label: 'Peak Season',
    color: 'bg-red-100 text-red-800',
    icon: <Sun className="w-4 h-4" />,
    description: 'Highest demand period (festivals, holidays)'
  },
  high: {
    label: 'High Season',
    color: 'bg-orange-100 text-orange-800',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Above average demand'
  },
  regular: {
    label: 'Regular Season',
    color: 'bg-blue-100 text-blue-800',
    icon: <Calendar className="w-4 h-4" />,
    description: 'Standard pricing period'
  },
  low: {
    label: 'Low Season',
    color: 'bg-green-100 text-green-800',
    icon: <TrendingDown className="w-4 h-4" />,
    description: 'Below average demand'
  },
  off: {
    label: 'Off Season',
    color: 'bg-gray-100 text-gray-800',
    icon: <Cloud className="w-4 h-4" />,
    description: 'Lowest demand period'
  }
};

const VEHICLE_TYPES = [
  'Sedan',
  'SUV',
  'Hatchback',
  'Van',
  'Luxury',
  'Sports',
  'Pickup',
  'Electric'
];

const PRESET_SEASONS = [
  {
    name: 'December Peak',
    seasonType: 'peak' as SeasonType,
    startDate: '12-15',
    endDate: '01-10',
    adjustmentValue: 50,
    description: 'Christmas and New Year holiday season'
  },
  {
    name: 'April Peak (New Year)',
    seasonType: 'peak' as SeasonType,
    startDate: '04-10',
    endDate: '04-20',
    adjustmentValue: 40,
    description: 'Sinhala/Tamil New Year period'
  },
  {
    name: 'Monsoon Low Season',
    seasonType: 'low' as SeasonType,
    startDate: '05-15',
    endDate: '09-15',
    adjustmentValue: -15,
    description: 'Southwest monsoon period'
  },
  {
    name: 'Winter High Season',
    seasonType: 'high' as SeasonType,
    startDate: '11-01',
    endDate: '12-14',
    adjustmentValue: 25,
    description: 'Pre-Christmas tourist season'
  }
];

const SPECIAL_DATES = [
  { name: 'Vesak Day', date: '05-23', adjustment: 35 },
  { name: 'Poson Day', date: '06-20', adjustment: 30 },
  { name: 'Independence Day', date: '02-04', adjustment: 25 },
  { name: 'Christmas Day', date: '12-25', adjustment: 50 },
  { name: 'New Year Day', date: '01-01', adjustment: 50 }
];

// ==========================================
// COMPONENT
// ==========================================

export const SeasonalPricingManager: React.FC = () => {
  const { toast } = useToast();
  const [seasonalRates, setSeasonalRates] = useState<SeasonalRate[]>([]);
  const [specialDates, setSpecialDates] = useState<SpecialDateRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSpecialDateDialog, setShowSpecialDateDialog] = useState(false);
  const [editingRate, setEditingRate] = useState<SeasonalRate | null>(null);
  const [activeTab, setActiveTab] = useState('seasons');

  // Form state
  const [formData, setFormData] = useState<Partial<SeasonalRate>>({
    name: '',
    description: '',
    seasonType: 'regular',
    startDate: '',
    endDate: '',
    recurring: true,
    adjustmentType: 'percentage',
    adjustmentValue: 0,
    applicableVehicleTypes: [],
    applicableOwnerIds: [],
    excludedVehicleIds: [],
    isActive: true,
    priority: 1,
    notes: ''
  });

  const [specialDateForm, setSpecialDateForm] = useState({
    name: '',
    date: '',
    endDate: '',
    adjustmentType: 'percentage' as PriceAdjustmentType,
    adjustmentValue: 0,
    isActive: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load seasonal rates
      const ratesQuery = query(
        collection(db, SEASONAL_RATES_COLLECTION),
        orderBy('priority', 'desc')
      );
      const ratesSnapshot = await getDocs(ratesQuery);
      setSeasonalRates(ratesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SeasonalRate)));

      // Load special dates
      const datesQuery = query(
        collection(db, SPECIAL_DATES_COLLECTION),
        orderBy('date', 'asc')
      );
      const datesSnapshot = await getDocs(datesQuery);
      setSpecialDates(datesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SpecialDateRate)));
    } catch (error) {
      console.error('Error loading pricing data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pricing data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRate = async () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      const rateRef = doc(collection(db, SEASONAL_RATES_COLLECTION));
      const now = new Date().toISOString();

      const rate: SeasonalRate = {
        ...(formData as SeasonalRate),
        id: rateRef.id,
        createdBy: 'admin',
        createdAt: now,
        updatedAt: now
      };

      await setDoc(rateRef, rate);

      toast({
        title: 'Success',
        description: 'Seasonal rate created successfully'
      });

      setShowCreateDialog(false);
      resetForm();
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create seasonal rate',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateRate = async () => {
    if (!editingRate?.id) return;

    try {
      await updateDoc(doc(db, SEASONAL_RATES_COLLECTION, editingRate.id), {
        ...formData,
        updatedAt: new Date().toISOString()
      });

      toast({
        title: 'Success',
        description: 'Seasonal rate updated successfully'
      });

      setEditingRate(null);
      resetForm();
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update seasonal rate',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteRate = async (rateId: string) => {
    if (!confirm('Are you sure you want to delete this seasonal rate?')) return;

    try {
      await deleteDoc(doc(db, SEASONAL_RATES_COLLECTION, rateId));
      toast({
        title: 'Deleted',
        description: 'Seasonal rate deleted successfully'
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete seasonal rate',
        variant: 'destructive'
      });
    }
  };

  const handleToggleRateStatus = async (rate: SeasonalRate) => {
    try {
      await updateDoc(doc(db, SEASONAL_RATES_COLLECTION, rate.id!), {
        isActive: !rate.isActive,
        updatedAt: new Date().toISOString()
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const handleCreateSpecialDate = async () => {
    if (!specialDateForm.name || !specialDateForm.date) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in name and date',
        variant: 'destructive'
      });
      return;
    }

    try {
      const dateRef = doc(collection(db, SPECIAL_DATES_COLLECTION));
      const now = new Date().toISOString();

      await setDoc(dateRef, {
        ...specialDateForm,
        id: dateRef.id,
        createdAt: now
      });

      toast({
        title: 'Success',
        description: 'Special date added successfully'
      });

      setShowSpecialDateDialog(false);
      setSpecialDateForm({
        name: '',
        date: '',
        endDate: '',
        adjustmentType: 'percentage',
        adjustmentValue: 0,
        isActive: true
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add special date',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteSpecialDate = async (dateId: string) => {
    try {
      await deleteDoc(doc(db, SPECIAL_DATES_COLLECTION, dateId));
      toast({
        title: 'Deleted',
        description: 'Special date removed'
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete special date',
        variant: 'destructive'
      });
    }
  };

  const applyPreset = (preset: typeof PRESET_SEASONS[0]) => {
    const currentYear = new Date().getFullYear();
    setFormData({
      ...formData,
      name: preset.name,
      description: preset.description,
      seasonType: preset.seasonType,
      startDate: `${currentYear}-${preset.startDate}`,
      endDate: preset.endDate.startsWith('01') ? `${currentYear + 1}-${preset.endDate}` : `${currentYear}-${preset.endDate}`,
      adjustmentType: 'percentage',
      adjustmentValue: preset.adjustmentValue,
      recurring: true
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      seasonType: 'regular',
      startDate: '',
      endDate: '',
      recurring: true,
      adjustmentType: 'percentage',
      adjustmentValue: 0,
      applicableVehicleTypes: [],
      applicableOwnerIds: [],
      excludedVehicleIds: [],
      isActive: true,
      priority: 1,
      notes: ''
    });
  };

  const openEditDialog = (rate: SeasonalRate) => {
    setEditingRate(rate);
    setFormData(rate);
  };

  const formatAdjustment = (type: PriceAdjustmentType, value: number): string => {
    if (type === 'percentage') {
      return value >= 0 ? `+${value}%` : `${value}%`;
    }
    return value >= 0 ? `+LKR ${value.toLocaleString()}` : `-LKR ${Math.abs(value).toLocaleString()}`;
  };

  const RateForm = () => (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      {/* Presets */}
      {!editingRate && (
        <div className="space-y-2">
          <Label>Quick Presets (Sri Lanka)</Label>
          <div className="flex flex-wrap gap-2">
            {PRESET_SEASONS.map((preset) => (
              <Button
                key={preset.name}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
              >
                {SEASON_CONFIG[preset.seasonType].icon}
                <span className="ml-1">{preset.name}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Season Name *</Label>
          <Input
            value={formData.name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="December Peak Season"
          />
        </div>

        <div className="space-y-2">
          <Label>Season Type</Label>
          <Select
            value={formData.seasonType}
            onValueChange={(v) => setFormData(prev => ({ ...prev, seasonType: v as SeasonType }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SEASON_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    {config.icon}
                    {config.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Holiday season with high tourist demand"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date *</Label>
          <Input
            type="date"
            value={formData.startDate || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>End Date *</Label>
          <Input
            type="date"
            value={formData.endDate || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <div>
          <Label>Recurring Yearly</Label>
          <p className="text-sm text-muted-foreground">Automatically repeat every year</p>
        </div>
        <Switch
          checked={formData.recurring}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, recurring: checked }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Adjustment Type</Label>
          <Select
            value={formData.adjustmentType}
            onValueChange={(v) => setFormData(prev => ({ ...prev, adjustmentType: v as PriceAdjustmentType }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed_amount">Fixed Amount (LKR)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            Adjustment Value
            {formData.adjustmentType === 'percentage' ? ' (%)' : ' (LKR)'}
          </Label>
          <Input
            type="number"
            value={formData.adjustmentValue || 0}
            onChange={(e) => setFormData(prev => ({ ...prev, adjustmentValue: Number(e.target.value) }))}
            placeholder="Use negative for discount"
          />
          <p className="text-xs text-muted-foreground">
            Use negative values for discounts (e.g., -15 for 15% off)
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Apply to Vehicle Types (leave empty for all)</Label>
        <div className="flex flex-wrap gap-2">
          {VEHICLE_TYPES.map((type) => (
            <Badge
              key={type}
              variant={formData.applicableVehicleTypes?.includes(type) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => {
                const types = formData.applicableVehicleTypes || [];
                if (types.includes(type)) {
                  setFormData(prev => ({
                    ...prev,
                    applicableVehicleTypes: types.filter(t => t !== type)
                  }));
                } else {
                  setFormData(prev => ({
                    ...prev,
                    applicableVehicleTypes: [...types, type]
                  }));
                }
              }}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority (higher = takes precedence)</Label>
          <Input
            type="number"
            value={formData.priority || 1}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
            min={1}
            max={100}
          />
        </div>

        <div className="space-y-2 flex items-end">
          <div className="flex items-center justify-between w-full p-3 bg-muted rounded-lg">
            <Label>Active</Label>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Internal Notes (Admin Only)</Label>
        <Textarea
          value={formData.notes || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Reason for this rate, partner agreements..."
          rows={2}
        />
      </div>

      {/* Preview */}
      <Alert>
        <Info className="w-4 h-4" />
        <AlertDescription>
          <strong>Price Impact:</strong> Base price will be adjusted by{' '}
          <span className={formData.adjustmentValue! >= 0 ? 'text-red-600' : 'text-green-600'}>
            {formatAdjustment(formData.adjustmentType!, formData.adjustmentValue!)}
          </span>
          {' '}during this period.
          {formData.adjustmentType === 'percentage' && (
            <span> (e.g., LKR 10,000/day becomes LKR {(10000 * (1 + (formData.adjustmentValue || 0) / 100)).toLocaleString()}/day)</span>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Seasonal Pricing</h1>
          <p className="text-muted-foreground">Manage seasonal rates and special date pricing</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="seasons">Seasonal Rates</TabsTrigger>
          <TabsTrigger value="special">Special Dates</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        {/* Seasonal Rates Tab */}
        <TabsContent value="seasons" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Seasonal Rate
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Season</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Adjustment</TableHead>
                    <TableHead>Vehicle Types</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seasonalRates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {isLoading ? 'Loading...' : 'No seasonal rates configured'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    seasonalRates.map((rate) => (
                      <TableRow key={rate.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={SEASON_CONFIG[rate.seasonType].color}>
                              {SEASON_CONFIG[rate.seasonType].icon}
                              <span className="ml-1">{SEASON_CONFIG[rate.seasonType].label}</span>
                            </Badge>
                          </div>
                          <p className="font-medium mt-1">{rate.name}</p>
                          <p className="text-xs text-muted-foreground">{rate.description}</p>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{new Date(rate.startDate).toLocaleDateString()}</p>
                            <p className="text-muted-foreground">to {new Date(rate.endDate).toLocaleDateString()}</p>
                            {rate.recurring && (
                              <Badge variant="outline" className="mt-1 text-xs">Yearly</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${rate.adjustmentValue >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatAdjustment(rate.adjustmentType, rate.adjustmentValue)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {rate.applicableVehicleTypes.length === 0 ? (
                            <span className="text-muted-foreground text-sm">All types</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {rate.applicableVehicleTypes.slice(0, 2).map((type) => (
                                <Badge key={type} variant="outline" className="text-xs">{type}</Badge>
                              ))}
                              {rate.applicableVehicleTypes.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{rate.applicableVehicleTypes.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{rate.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={rate.isActive ? 'default' : 'secondary'}>
                            {rate.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleRateStatus(rate)}
                            >
                              {rate.isActive ? (
                                <AlertCircle className="w-4 h-4" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(rate)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRate(rate.id!)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Special Dates Tab */}
        <TabsContent value="special" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowSpecialDateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Special Date
            </Button>
          </div>

          {/* Quick Add Presets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Add Sri Lankan Holidays</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {SPECIAL_DATES.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSpecialDateForm({
                        name: preset.name,
                        date: `${new Date().getFullYear()}-${preset.date}`,
                        endDate: '',
                        adjustmentType: 'percentage',
                        adjustmentValue: preset.adjustment,
                        isActive: true
                      });
                      setShowSpecialDateDialog(true);
                    }}
                  >
                    <Star className="w-3 h-3 mr-1" />
                    {preset.name} (+{preset.adjustment}%)
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Adjustment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {specialDates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No special dates configured
                      </TableCell>
                    </TableRow>
                  ) : (
                    specialDates.map((date) => (
                      <TableRow key={date.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(date.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                            {date.endDate && (
                              <span className="text-muted-foreground">
                                - {new Date(date.endDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{date.name}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${date.adjustmentValue >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatAdjustment(date.adjustmentType, date.adjustmentValue)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={date.isActive ? 'default' : 'secondary'}>
                            {date.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSpecialDate(date.id!)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar View Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Calendar</CardTitle>
              <CardDescription>Visual overview of seasonal pricing for the year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: 12 }, (_, month) => {
                  const monthName = new Date(2024, month).toLocaleDateString('en-US', { month: 'short' });
                  const daysInMonth = new Date(2024, month + 1, 0).getDate();

                  // Check if any seasonal rate applies to this month
                  const applicableRate = seasonalRates.find(rate => {
                    const start = new Date(rate.startDate);
                    const end = new Date(rate.endDate);
                    const monthStart = new Date(2024, month, 1);
                    const monthEnd = new Date(2024, month, daysInMonth);

                    return rate.isActive && (
                      (start <= monthEnd && end >= monthStart) ||
                      (rate.recurring && (start.getMonth() <= month || end.getMonth() >= month))
                    );
                  });

                  return (
                    <div key={month} className="text-center">
                      <p className="text-xs font-medium mb-1">{monthName}</p>
                      <div
                        className={`h-8 rounded ${
                          applicableRate
                            ? SEASON_CONFIG[applicableRate.seasonType].color
                            : 'bg-gray-100'
                        }`}
                        title={applicableRate ? `${applicableRate.name}: ${formatAdjustment(applicableRate.adjustmentType, applicableRate.adjustmentValue)}` : 'Regular pricing'}
                      />
                      {applicableRate && (
                        <p className={`text-xs mt-1 ${applicableRate.adjustmentValue >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {applicableRate.adjustmentValue >= 0 ? '+' : ''}{applicableRate.adjustmentValue}%
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
                {Object.entries(SEASON_CONFIG).map(([key, config]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${config.color}`} />
                    <span className="text-sm">{config.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Seasonal Rate Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Seasonal Rate</DialogTitle>
            <DialogDescription>
              Set up pricing adjustments for specific seasons
            </DialogDescription>
          </DialogHeader>
          <RateForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreateRate}>
              Create Rate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Seasonal Rate Dialog */}
      <Dialog open={!!editingRate} onOpenChange={() => { setEditingRate(null); resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Seasonal Rate</DialogTitle>
            <DialogDescription>
              Update seasonal pricing settings
            </DialogDescription>
          </DialogHeader>
          <RateForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingRate(null); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Special Date Dialog */}
      <Dialog open={showSpecialDateDialog} onOpenChange={setShowSpecialDateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Special Date</DialogTitle>
            <DialogDescription>
              Set pricing adjustments for specific dates or events
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Event Name *</Label>
              <Input
                value={specialDateForm.name}
                onChange={(e) => setSpecialDateForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Christmas Day"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={specialDateForm.date}
                  onChange={(e) => setSpecialDateForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>End Date (optional)</Label>
                <Input
                  type="date"
                  value={specialDateForm.endDate}
                  onChange={(e) => setSpecialDateForm(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Adjustment Type</Label>
                <Select
                  value={specialDateForm.adjustmentType}
                  onValueChange={(v) => setSpecialDateForm(prev => ({ ...prev, adjustmentType: v as PriceAdjustmentType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount (LKR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Adjustment Value</Label>
                <Input
                  type="number"
                  value={specialDateForm.adjustmentValue}
                  onChange={(e) => setSpecialDateForm(prev => ({ ...prev, adjustmentValue: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSpecialDateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSpecialDate}>
              Add Special Date
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SeasonalPricingManager;
