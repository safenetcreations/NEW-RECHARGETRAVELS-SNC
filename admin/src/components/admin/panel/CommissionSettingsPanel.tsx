import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  DollarSign,
  Percent,
  Award,
  Calendar,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getCommissionSettings,
  updateCommissionSettings,
  CommissionSettings,
  DEFAULT_COMMISSION_SETTINGS,
  formatCurrency
} from '@/services/firebaseCommissionService';

const CommissionSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<CommissionSettings>(DEFAULT_COMMISSION_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await getCommissionSettings();
      setSettings(data);
      setHasChanges(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load commission settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CommissionSettings, value: number | string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateCommissionSettings(settings);
      toast.success('Commission settings saved successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save commission settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_COMMISSION_SETTINGS);
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-6 h-6 text-indigo-600" />
                Commission Settings
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Configure platform fees, commissions, and driver bonuses
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-gray-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Default
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-yellow-800">You have unsaved changes</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Fees */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Platform Fees
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="platform_fee_fixed">Fixed Fee per Booking (LKR)</Label>
              <Input
                id="platform_fee_fixed"
                type="number"
                value={settings.platform_fee_fixed}
                onChange={(e) => handleChange('platform_fee_fixed', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Fixed amount deducted from each booking
              </p>
            </div>
            <div>
              <Label htmlFor="commission_percentage">Commission Percentage (%)</Label>
              <Input
                id="commission_percentage"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={settings.commission_percentage}
                onChange={(e) => handleChange('commission_percentage', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Percentage of booking value taken as commission
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bonus Rates */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Bonus Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="completion_bonus_rate">Completion Bonus Rate (%)</Label>
              <Input
                id="completion_bonus_rate"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={settings.completion_bonus_rate}
                onChange={(e) => handleChange('completion_bonus_rate', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Bonus for 100% on-time completion rate
              </p>
            </div>
            <div>
              <Label htmlFor="rating_bonus_rate">Rating Bonus Rate (%)</Label>
              <Input
                id="rating_bonus_rate"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={settings.rating_bonus_rate}
                onChange={(e) => handleChange('rating_bonus_rate', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Bonus for rating above {settings.rating_bonus_threshold} stars
              </p>
            </div>
            <div>
              <Label htmlFor="batch_bonus_rate">Volume Bonus Rate (%)</Label>
              <Input
                id="batch_bonus_rate"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={settings.batch_bonus_rate}
                onChange={(e) => handleChange('batch_bonus_rate', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Bonus for completing {settings.batch_bonus_threshold}+ trips/month
              </p>
            </div>
            <div>
              <Label htmlFor="referral_bonus">Referral Bonus (LKR)</Label>
              <Input
                id="referral_bonus"
                type="number"
                value={settings.referral_bonus}
                onChange={(e) => handleChange('referral_bonus', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Fixed bonus per successful driver referral
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Thresholds */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-600" />
              Bonus Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="rating_bonus_threshold">Rating Threshold (Stars)</Label>
              <Input
                id="rating_bonus_threshold"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={settings.rating_bonus_threshold}
                onChange={(e) => handleChange('rating_bonus_threshold', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum rating to qualify for rating bonus
              </p>
            </div>
            <div>
              <Label htmlFor="batch_bonus_threshold">Trip Threshold (Trips/Month)</Label>
              <Input
                id="batch_bonus_threshold"
                type="number"
                min="1"
                value={settings.batch_bonus_threshold}
                onChange={(e) => handleChange('batch_bonus_threshold', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum trips per month for volume bonus
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payout Settings */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Payout Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="min_payout_amount">Minimum Payout Amount (LKR)</Label>
              <Input
                id="min_payout_amount"
                type="number"
                value={settings.min_payout_amount}
                onChange={(e) => handleChange('min_payout_amount', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum balance required for payout
              </p>
            </div>
            <div>
              <Label htmlFor="payout_frequency">Payout Frequency</Label>
              <Select
                value={settings.payout_frequency}
                onValueChange={(value) => handleChange('payout_frequency', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payout_hold_days">Payout Hold Period (Days)</Label>
              <Input
                id="payout_hold_days"
                type="number"
                min="0"
                max="30"
                value={settings.payout_hold_days}
                onChange={(e) => handleChange('payout_hold_days', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Days to hold earnings before payout eligibility
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Example Calculation */}
      <Card className="shadow-md bg-gradient-to-br from-gray-50 to-slate-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Example Calculation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm text-gray-600 mb-4">
              For a booking worth <strong>{formatCurrency(10000)}</strong> with all bonuses:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-gray-500">Platform Fee</p>
                <p className="text-lg font-bold text-red-600">
                  -{formatCurrency(settings.platform_fee_fixed)}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-gray-500">Commission ({settings.commission_percentage}%)</p>
                <p className="text-lg font-bold text-red-600">
                  -{formatCurrency(10000 * settings.commission_percentage / 100)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-500">Total Bonuses</p>
                <p className="text-lg font-bold text-green-600">
                  +{formatCurrency(10000 * (settings.completion_bonus_rate + settings.rating_bonus_rate + settings.batch_bonus_rate) / 100)}
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-xs text-gray-500">Driver Earns</p>
                <p className="text-lg font-bold text-indigo-600">
                  {formatCurrency(
                    10000
                    - settings.platform_fee_fixed
                    - (10000 * settings.commission_percentage / 100)
                    + (10000 * (settings.completion_bonus_rate + settings.rating_bonus_rate + settings.batch_bonus_rate) / 100)
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionSettingsPanel;
