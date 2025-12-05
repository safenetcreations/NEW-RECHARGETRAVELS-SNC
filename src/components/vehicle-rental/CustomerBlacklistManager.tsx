/**
 * Customer Blacklist Manager Component
 * Admin UI for managing customer restrictions and risk assessment
 */
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Ban,
  Flag,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Car,
  DollarSign,
  FileText,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  Shield,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3
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
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import customerBlacklistService, {
  BlacklistEntry,
  BlacklistStatus,
  BlacklistReason,
  CustomerRiskProfile
} from '@/services/customerBlacklistService';

const STATUS_CONFIG: Record<BlacklistStatus, { label: string; color: string; icon: React.ReactNode }> = {
  blacklisted: { label: 'Blacklisted', color: 'bg-red-100 text-red-800', icon: <Ban className="w-3 h-3" /> },
  flagged: { label: 'Flagged', color: 'bg-orange-100 text-orange-800', icon: <Flag className="w-3 h-3" /> },
  warning: { label: 'Warning', color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="w-3 h-3" /> },
  cleared: { label: 'Cleared', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> }
};

const RISK_LEVELS: Record<string, { label: string; color: string }> = {
  critical: { label: 'Critical', color: 'bg-red-500' },
  high: { label: 'High', color: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'bg-yellow-500' },
  low: { label: 'Low', color: 'bg-green-500' }
};

interface FormData {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: BlacklistStatus;
  reason: BlacklistReason;
  reasonDetails: string;
  incidentDate: string;
  incidentBookingId: string;
  incidentBookingReference: string;
  vehicleId: string;
  vehicleName: string;
  ownerId: string;
  ownerName: string;
  outstandingAmount: number;
  damageAmount: number;
  notes: string;
  reviewRequired: boolean;
  expiresAt: string;
}

const initialFormData: FormData = {
  customerId: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  status: 'warning',
  reason: 'other',
  reasonDetails: '',
  incidentDate: new Date().toISOString().split('T')[0],
  incidentBookingId: '',
  incidentBookingReference: '',
  vehicleId: '',
  vehicleName: '',
  ownerId: '',
  ownerName: '',
  outstandingAmount: 0,
  damageAmount: 0,
  notes: '',
  reviewRequired: false,
  expiresAt: ''
};

export const CustomerBlacklistManager: React.FC = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<BlacklistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<BlacklistEntry | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [statistics, setStatistics] = useState<{
    totalBlacklisted: number;
    totalFlagged: number;
    totalWarnings: number;
    byReason: Record<BlacklistReason, number>;
    recentIncidents: BlacklistEntry[];
    pendingReviews: number;
    totalOutstanding: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  // Customer check state
  const [checkCustomerId, setCheckCustomerId] = useState('');
  const [checkEmail, setCheckEmail] = useState('');
  const [checkResult, setCheckResult] = useState<{
    isBlacklisted: boolean;
    isFlagged: boolean;
    hasWarnings: boolean;
    canBook: boolean;
    message: string;
    entries: BlacklistEntry[];
    riskProfile?: CustomerRiskProfile;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [entriesData, statsData] = await Promise.all([
        customerBlacklistService.getAllEntries(),
        customerBlacklistService.getStatistics()
      ]);
      setEntries(entriesData);
      setStatistics(statsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load blacklist data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEntry = async () => {
    if (!formData.customerId || !formData.customerName || !formData.reasonDetails) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in customer ID, name, and reason details',
        variant: 'destructive'
      });
      return;
    }

    try {
      await customerBlacklistService.addToBlacklist({
        ...formData,
        addedBy: 'admin',
        addedByName: 'Admin User',
        evidenceUrls: []
      });

      toast({
        title: 'Success',
        description: 'Customer added to blacklist'
      });

      setShowCreateDialog(false);
      setFormData(initialFormData);
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add customer to blacklist',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to remove this entry?')) return;

    try {
      await customerBlacklistService.removeFromBlacklist(entryId);
      toast({
        title: 'Removed',
        description: 'Blacklist entry removed'
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove entry',
        variant: 'destructive'
      });
    }
  };

  const handleClearStatus = async (entry: BlacklistEntry) => {
    const notes = prompt('Enter review notes for clearing this customer:');
    if (notes === null) return;

    try {
      await customerBlacklistService.clearCustomerStatus(entry.id!, 'admin', notes);
      toast({
        title: 'Cleared',
        description: 'Customer status has been cleared'
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear status',
        variant: 'destructive'
      });
    }
  };

  const handleCheckCustomer = async () => {
    if (!checkCustomerId && !checkEmail) {
      toast({
        title: 'Missing Information',
        description: 'Enter customer ID or email to check',
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await customerBlacklistService.checkCustomer(
        checkCustomerId,
        checkEmail || undefined
      );
      setCheckResult(result);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to check customer',
        variant: 'destructive'
      });
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch =
      entry.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.customerId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesReason = reasonFilter === 'all' || entry.reason === reasonFilter;
    return matchesSearch && matchesStatus && matchesReason;
  });

  const reasonLabels = customerBlacklistService.getAllReasonLabels();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Customer Blacklist</h1>
          <p className="text-muted-foreground">Manage customer restrictions and risk assessment</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add to Blacklist
        </Button>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Blacklisted</p>
                  <p className="text-2xl font-bold text-red-600">{statistics.totalBlacklisted}</p>
                </div>
                <Ban className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Flagged</p>
                  <p className="text-2xl font-bold text-orange-600">{statistics.totalFlagged}</p>
                </div>
                <Flag className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-600">{statistics.totalWarnings}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  <p className="text-2xl font-bold">{statistics.pendingReviews}</p>
                </div>
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="text-2xl font-bold">LKR {statistics.totalOutstanding.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Blacklist</TabsTrigger>
          <TabsTrigger value="check">Check Customer</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Blacklist Tab */}
        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search by name, email, or ID..."
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
                    <SelectItem value="blacklisted">Blacklisted</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="cleared">Cleared</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={reasonFilter} onValueChange={setReasonFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reasons</SelectItem>
                    {Object.entries(reasonLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={loadData}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Entries Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Incident Date</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {isLoading ? 'Loading...' : 'No entries found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium">{entry.customerName}</p>
                              <p className="text-sm text-muted-foreground">{entry.customerEmail}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={STATUS_CONFIG[entry.status].color}>
                            <span className="flex items-center gap-1">
                              {STATUS_CONFIG[entry.status].icon}
                              {STATUS_CONFIG[entry.status].label}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{reasonLabels[entry.reason]}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {entry.reasonDetails}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(entry.incidentDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {entry.outstandingAmount ? (
                            <span className="text-red-600 font-medium">
                              LKR {entry.outstandingAmount.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{new Date(entry.createdAt).toLocaleDateString()}</p>
                            <p className="text-xs text-muted-foreground">by {entry.addedByName || 'System'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedEntry(entry);
                                setShowDetailDialog(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {entry.status !== 'cleared' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleClearStatus(entry)}
                                title="Clear Status"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteEntry(entry.id!)}
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

        {/* Check Customer Tab */}
        <TabsContent value="check" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Check Customer Status</CardTitle>
              <CardDescription>Verify if a customer can make bookings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer ID</Label>
                  <Input
                    value={checkCustomerId}
                    onChange={(e) => setCheckCustomerId(e.target.value)}
                    placeholder="Enter customer ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email (optional)</Label>
                  <Input
                    value={checkEmail}
                    onChange={(e) => setCheckEmail(e.target.value)}
                    placeholder="customer@email.com"
                  />
                </div>
              </div>
              <Button onClick={handleCheckCustomer}>
                <Search className="w-4 h-4 mr-2" />
                Check Customer
              </Button>

              {checkResult && (
                <div className="mt-6 space-y-4">
                  {/* Result Summary */}
                  <Alert variant={checkResult.canBook ? 'default' : 'destructive'}>
                    {checkResult.canBook ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <AlertDescription>
                      <strong>{checkResult.canBook ? 'Can Book' : 'Cannot Book'}</strong>
                      <p className="mt-1">{checkResult.message}</p>
                    </AlertDescription>
                  </Alert>

                  {/* Status Badges */}
                  <div className="flex gap-2">
                    <Badge variant={checkResult.isBlacklisted ? 'destructive' : 'outline'}>
                      {checkResult.isBlacklisted ? 'Blacklisted' : 'Not Blacklisted'}
                    </Badge>
                    <Badge variant={checkResult.isFlagged ? 'default' : 'outline'} className={checkResult.isFlagged ? 'bg-orange-500' : ''}>
                      {checkResult.isFlagged ? 'Flagged' : 'Not Flagged'}
                    </Badge>
                    <Badge variant={checkResult.hasWarnings ? 'default' : 'outline'} className={checkResult.hasWarnings ? 'bg-yellow-500' : ''}>
                      {checkResult.hasWarnings ? 'Has Warnings' : 'No Warnings'}
                    </Badge>
                  </div>

                  {/* Risk Profile */}
                  {checkResult.riskProfile && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Risk Profile
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Risk Score</span>
                            <div className="flex items-center gap-2">
                              <Progress value={checkResult.riskProfile.riskScore} className="w-32" />
                              <span className="font-medium">{checkResult.riskProfile.riskScore}/100</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Risk Level</span>
                            <Badge className={RISK_LEVELS[checkResult.riskProfile.riskLevel]?.color || ''}>
                              {checkResult.riskProfile.riskLevel.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div>
                              <p className="text-sm text-muted-foreground">No Shows</p>
                              <p className="font-medium">{checkResult.riskProfile.noShows}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Late Returns</p>
                              <p className="font-medium">{checkResult.riskProfile.lateReturns}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Damage Incidents</p>
                              <p className="font-medium">{checkResult.riskProfile.damageIncidents}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Payment Issues</p>
                              <p className="font-medium">{checkResult.riskProfile.paymentIssues}</p>
                            </div>
                          </div>
                          {checkResult.riskProfile.outstandingBalance > 0 && (
                            <div className="pt-2 border-t">
                              <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                              <p className="font-medium text-red-600">
                                LKR {checkResult.riskProfile.outstandingBalance.toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Related Entries */}
                  {checkResult.entries.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Related Entries ({checkResult.entries.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {checkResult.entries.map((entry) => (
                            <div key={entry.id} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div>
                                <Badge className={STATUS_CONFIG[entry.status].color} size="sm">
                                  {STATUS_CONFIG[entry.status].label}
                                </Badge>
                                <span className="ml-2 text-sm">{reasonLabels[entry.reason]}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(entry.incidentDate).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {statistics && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Incidents by Reason
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(statistics.byReason)
                      .filter(([_, count]) => count > 0)
                      .sort(([_, a], [__, b]) => b - a)
                      .map(([reason, count]) => {
                        const total = Object.values(statistics.byReason).reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        return (
                          <div key={reason} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{reasonLabels[reason as BlacklistReason]}</span>
                              <span className="font-medium">{count}</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Incidents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {statistics.recentIncidents.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No recent incidents in the last 30 days
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {statistics.recentIncidents.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge className={STATUS_CONFIG[entry.status].color}>
                              {STATUS_CONFIG[entry.status].icon}
                            </Badge>
                            <div>
                              <p className="font-medium">{entry.customerName}</p>
                              <p className="text-sm text-muted-foreground">{reasonLabels[entry.reason]}</p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add to Blacklist</DialogTitle>
            <DialogDescription>
              Record a customer restriction or warning
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer ID *</Label>
                <Input
                  value={formData.customerId}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                  placeholder="customer_123"
                />
              </div>
              <div className="space-y-2">
                <Label>Customer Name *</Label>
                <Input
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.customerPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                  placeholder="+94 77 123 4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as BlacklistStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blacklisted">Blacklisted (Cannot Book)</SelectItem>
                    <SelectItem value="flagged">Flagged (Review Required)</SelectItem>
                    <SelectItem value="warning">Warning (Can Book)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Reason</Label>
                <Select
                  value={formData.reason}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, reason: v as BlacklistReason }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(reasonLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reason Details *</Label>
              <Textarea
                value={formData.reasonDetails}
                onChange={(e) => setFormData(prev => ({ ...prev, reasonDetails: e.target.value }))}
                placeholder="Describe the incident in detail..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Incident Date</Label>
                <Input
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, incidentDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Booking Reference</Label>
                <Input
                  value={formData.incidentBookingReference}
                  onChange={(e) => setFormData(prev => ({ ...prev, incidentBookingReference: e.target.value }))}
                  placeholder="VR-123456"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Outstanding Amount (LKR)</Label>
                <Input
                  type="number"
                  value={formData.outstandingAmount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, outstandingAmount: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Damage Amount (LKR)</Label>
                <Input
                  type="number"
                  value={formData.damageAmount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, damageAmount: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Expires At (for temporary restrictions)</Label>
              <Input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <Label>Review Required</Label>
                <p className="text-sm text-muted-foreground">Flag for admin review</p>
              </div>
              <Switch
                checked={formData.reviewRequired}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, reviewRequired: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Internal Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes for admin reference..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEntry}>
              Add to Blacklist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Blacklist Entry Details</DialogTitle>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{selectedEntry.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedEntry.customerEmail}</p>
                  {selectedEntry.customerPhone && (
                    <p className="text-sm text-muted-foreground">{selectedEntry.customerPhone}</p>
                  )}
                </div>
                <Badge className={`ml-auto ${STATUS_CONFIG[selectedEntry.status].color}`}>
                  {STATUS_CONFIG[selectedEntry.status].label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="font-medium">{reasonLabels[selectedEntry.reason]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Incident Date</p>
                  <p className="font-medium">{new Date(selectedEntry.incidentDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Details</p>
                <p className="mt-1">{selectedEntry.reasonDetails}</p>
              </div>

              {selectedEntry.incidentBookingReference && (
                <div>
                  <p className="text-sm text-muted-foreground">Booking Reference</p>
                  <p className="font-medium">{selectedEntry.incidentBookingReference}</p>
                </div>
              )}

              {(selectedEntry.outstandingAmount || selectedEntry.damageAmount) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedEntry.outstandingAmount && (
                    <div>
                      <p className="text-sm text-muted-foreground">Outstanding</p>
                      <p className="font-medium text-red-600">LKR {selectedEntry.outstandingAmount.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedEntry.damageAmount && (
                    <div>
                      <p className="text-sm text-muted-foreground">Damage</p>
                      <p className="font-medium text-red-600">LKR {selectedEntry.damageAmount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedEntry.reviewedAt && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Reviewed:</strong> {new Date(selectedEntry.reviewedAt).toLocaleDateString()} by {selectedEntry.reviewedBy}
                  </p>
                  {selectedEntry.reviewNotes && (
                    <p className="text-sm text-green-700 mt-1">{selectedEntry.reviewNotes}</p>
                  )}
                </div>
              )}

              <div className="text-sm text-muted-foreground pt-2 border-t">
                Added by {selectedEntry.addedByName || 'System'} on {new Date(selectedEntry.createdAt).toLocaleDateString()}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerBlacklistManager;
