/**
 * Promo Code Manager Component
 * Admin interface for managing vehicle rental promo codes
 */
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  Tag,
  Percent,
  DollarSign,
  Calendar,
  Users,
  BarChart3,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
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
import vehiclePromoCodeService, {
  PromoCode,
  DiscountType,
  PromoCodeStatus
} from '@/services/vehiclePromoCodeService';

const STATUS_COLORS: Record<PromoCodeStatus, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  expired: 'bg-red-100 text-red-800',
  depleted: 'bg-yellow-100 text-yellow-800'
};

const STATUS_ICONS: Record<PromoCodeStatus, React.ReactNode> = {
  active: <CheckCircle className="w-3 h-3" />,
  inactive: <XCircle className="w-3 h-3" />,
  expired: <Clock className="w-3 h-3" />,
  depleted: <AlertCircle className="w-3 h-3" />
};

interface PromoFormData {
  code: string;
  name: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxUses: number | null;
  maxUsesPerCustomer: number;
  minBookingAmount: number;
  maxDiscountAmount: number | null;
  startDate: string;
  endDate: string;
  status: PromoCodeStatus;
  newCustomersOnly: boolean;
  applicableVehicleTypes: string[];
  notes: string;
}

const initialFormData: PromoFormData = {
  code: '',
  name: '',
  description: '',
  discountType: 'percentage',
  discountValue: 10,
  maxUses: null,
  maxUsesPerCustomer: 1,
  minBookingAmount: 0,
  maxDiscountAmount: null,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: 'active',
  newCustomersOnly: false,
  applicableVehicleTypes: [],
  notes: ''
};

export const PromoCodeManager: React.FC = () => {
  const { toast } = useToast();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState<PromoFormData>(initialFormData);
  const [copied, setCopied] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<{
    totalPromoCodes: number;
    activePromoCodes: number;
    totalUsage: number;
    totalDiscountGiven: number;
    topPromoCodes: Array<{ code: string; uses: number; discount: number }>;
  } | null>(null);

  useEffect(() => {
    loadPromoCodes();
    loadAnalytics();
  }, []);

  const loadPromoCodes = async () => {
    setIsLoading(true);
    try {
      const codes = await vehiclePromoCodeService.getAllPromoCodes(true);
      setPromoCodes(codes);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load promo codes',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await vehiclePromoCodeService.getOverallPromoAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handleCreatePromo = async () => {
    if (!formData.code || !formData.name) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in code and name',
        variant: 'destructive'
      });
      return;
    }

    try {
      await vehiclePromoCodeService.createPromoCode({
        ...formData,
        applicableOwnerIds: [],
        excludedVehicleIds: [],
        createdBy: 'admin'
      });

      toast({
        title: 'Success',
        description: 'Promo code created successfully'
      });

      setShowCreateDialog(false);
      setFormData(initialFormData);
      loadPromoCodes();
      loadAnalytics();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create promo code',
        variant: 'destructive'
      });
    }
  };

  const handleUpdatePromo = async () => {
    if (!editingPromo?.id) return;

    try {
      await vehiclePromoCodeService.updatePromoCode(editingPromo.id, formData);

      toast({
        title: 'Success',
        description: 'Promo code updated successfully'
      });

      setEditingPromo(null);
      setFormData(initialFormData);
      loadPromoCodes();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update promo code',
        variant: 'destructive'
      });
    }
  };

  const handleDeletePromo = async (promoId: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;

    try {
      await vehiclePromoCodeService.deletePromoCode(promoId);
      toast({
        title: 'Deleted',
        description: 'Promo code deleted successfully'
      });
      loadPromoCodes();
      loadAnalytics();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete promo code',
        variant: 'destructive'
      });
    }
  };

  const handleToggleStatus = async (promo: PromoCode) => {
    const newStatus = promo.status === 'active' ? 'inactive' : 'active';
    try {
      await vehiclePromoCodeService.updatePromoCode(promo.id!, { status: newStatus });
      toast({
        title: 'Status Updated',
        description: `Promo code is now ${newStatus}`
      });
      loadPromoCodes();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateCode = () => {
    const code = vehiclePromoCodeService.generatePromoCode('RT', 6);
    setFormData(prev => ({ ...prev, code }));
  };

  const openEditDialog = (promo: PromoCode) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      name: promo.name,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      maxUses: promo.maxUses,
      maxUsesPerCustomer: promo.maxUsesPerCustomer,
      minBookingAmount: promo.minBookingAmount,
      maxDiscountAmount: promo.maxDiscountAmount,
      startDate: promo.startDate.split('T')[0],
      endDate: promo.endDate.split('T')[0],
      status: promo.status,
      newCustomersOnly: promo.newCustomersOnly,
      applicableVehicleTypes: promo.applicableVehicleTypes,
      notes: promo.notes || ''
    });
  };

  const filteredPromoCodes = promoCodes.filter(promo => {
    const matchesSearch = promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          promo.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || promo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const PromoForm = () => (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Promo Code</Label>
          <div className="flex gap-2">
            <Input
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="SUMMER20"
              className="flex-1"
            />
            <Button type="button" variant="outline" size="icon" onClick={generateCode}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Summer Sale"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Get 20% off on all rentals this summer!"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Discount Type</Label>
          <Select
            value={formData.discountType}
            onValueChange={(v) => setFormData(prev => ({ ...prev, discountType: v as DiscountType }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed_amount">Fixed Amount (LKR)</SelectItem>
              <SelectItem value="free_days">Free Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            Discount Value
            {formData.discountType === 'percentage' ? ' (%)' :
             formData.discountType === 'fixed_amount' ? ' (LKR)' : ' (Days)'}
          </Label>
          <Input
            type="number"
            value={formData.discountValue}
            onChange={(e) => setFormData(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
            min={0}
            max={formData.discountType === 'percentage' ? 100 : undefined}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Max Uses (leave empty for unlimited)</Label>
          <Input
            type="number"
            value={formData.maxUses ?? ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              maxUses: e.target.value ? Number(e.target.value) : null
            }))}
            min={0}
            placeholder="Unlimited"
          />
        </div>

        <div className="space-y-2">
          <Label>Max Uses Per Customer</Label>
          <Input
            type="number"
            value={formData.maxUsesPerCustomer}
            onChange={(e) => setFormData(prev => ({ ...prev, maxUsesPerCustomer: Number(e.target.value) }))}
            min={1}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Booking Amount (LKR)</Label>
          <Input
            type="number"
            value={formData.minBookingAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, minBookingAmount: Number(e.target.value) }))}
            min={0}
          />
        </div>

        {formData.discountType === 'percentage' && (
          <div className="space-y-2">
            <Label>Max Discount Amount (LKR)</Label>
            <Input
              type="number"
              value={formData.maxDiscountAmount ?? ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                maxDiscountAmount: e.target.value ? Number(e.target.value) : null
              }))}
              min={0}
              placeholder="No cap"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <div>
          <Label>New Customers Only</Label>
          <p className="text-sm text-muted-foreground">Restrict to first-time renters</p>
        </div>
        <Switch
          checked={formData.newCustomersOnly}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, newCustomersOnly: checked }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Internal Notes (Admin Only)</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Campaign tracking info, partner details..."
          rows={2}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Promo Codes</h1>
          <p className="text-muted-foreground">Manage promotional codes and discounts</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Promo Code
        </Button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Codes</p>
                  <p className="text-2xl font-bold">{analytics.totalPromoCodes}</p>
                </div>
                <Tag className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Codes</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.activePromoCodes}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Uses</p>
                  <p className="text-2xl font-bold">{analytics.totalUsage}</p>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Discount Given</p>
                  <p className="text-2xl font-bold">LKR {analytics.totalDiscountGiven.toLocaleString()}</p>
                </div>
                <Percent className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search promo codes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="depleted">Depleted</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadPromoCodes}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Promo Codes Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromoCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {isLoading ? 'Loading...' : 'No promo codes found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPromoCodes.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded font-mono text-sm">
                          {promo.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyCode(promo.code)}
                        >
                          {copied === promo.code ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{promo.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {promo.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {vehiclePromoCodeService.formatDiscount(promo)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{promo.usesCount}</span>
                        <span className="text-muted-foreground">
                          {promo.maxUses ? ` / ${promo.maxUses}` : ' uses'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(promo.startDate).toLocaleDateString()}</p>
                        <p className="text-muted-foreground">to {new Date(promo.endDate).toLocaleDateString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[promo.status]}>
                        <span className="flex items-center gap-1">
                          {STATUS_ICONS[promo.status]}
                          {promo.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(promo)}
                          title={promo.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {promo.status === 'active' ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(promo)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePromo(promo.id!)}
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

      {/* Top Promo Codes */}
      {analytics && analytics.topPromoCodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Top Performing Promo Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topPromoCodes.map((promo, index) => (
                <div key={promo.code} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                    <div>
                      <code className="font-mono font-medium">{promo.code}</code>
                      <p className="text-sm text-muted-foreground">{promo.uses} uses</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">LKR {promo.discount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">discount given</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Promo Code</DialogTitle>
            <DialogDescription>
              Create a new promotional code for vehicle rentals
            </DialogDescription>
          </DialogHeader>
          <PromoForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePromo}>
              Create Promo Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingPromo} onOpenChange={() => setEditingPromo(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Promo Code</DialogTitle>
            <DialogDescription>
              Update promotional code settings
            </DialogDescription>
          </DialogHeader>
          <PromoForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPromo(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePromo}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromoCodeManager;
