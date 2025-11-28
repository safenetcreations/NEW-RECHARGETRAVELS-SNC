import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CreditCard,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Users,
  TrendingUp,
  Send,
  Eye,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getAllSettlements,
  getPendingSettlements,
  updateSettlementStatus,
  processBatchPayouts,
  getPlatformRevenueSummary,
  DriverPaymentSettlement,
  PaymentStatus,
  formatCurrency,
  getPayoutStatusColor
} from '@/services/firebaseCommissionService';

const PaymentSettlementsPanel: React.FC = () => {
  const [settlements, setSettlements] = useState<DriverPaymentSettlement[]>([]);
  const [filteredSettlements, setFilteredSettlements] = useState<DriverPaymentSettlement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSettlements, setSelectedSettlements] = useState<string[]>([]);
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<DriverPaymentSettlement | null>(null);
  const [payoutMethod, setPayoutMethod] = useState('bank_transfer');
  const [payoutNotes, setPayoutNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [stats, setStats] = useState({
    totalPending: 0,
    totalPendingAmount: 0,
    totalCompleted: 0,
    totalCompletedAmount: 0
  });

  useEffect(() => {
    loadSettlements();
  }, []);

  useEffect(() => {
    filterSettlements();
  }, [settlements, searchTerm, statusFilter]);

  const loadSettlements = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSettlements();
      setSettlements(data);

      // Calculate stats
      const pending = data.filter(s => s.payment_status === 'pending');
      const completed = data.filter(s => s.payment_status === 'completed');

      setStats({
        totalPending: pending.length,
        totalPendingAmount: pending.reduce((sum, s) => sum + s.net_payout, 0),
        totalCompleted: completed.length,
        totalCompletedAmount: completed.reduce((sum, s) => sum + s.net_payout, 0)
      });

      toast.success(`Loaded ${data.length} settlements`);
    } catch (error) {
      console.error('Error loading settlements:', error);
      toast.error('Failed to load settlements');
    } finally {
      setIsLoading(false);
    }
  };

  const filterSettlements = () => {
    let filtered = settlements;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.payment_status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        (s.driver_name?.toLowerCase().includes(term)) ||
        (s.driver_email?.toLowerCase().includes(term)) ||
        s.driver_id.toLowerCase().includes(term) ||
        s.settlement_period.toLowerCase().includes(term)
      );
    }

    setFilteredSettlements(filtered);
  };

  const handleSelectAll = () => {
    if (selectedSettlements.length === filteredSettlements.filter(s => s.payment_status === 'pending').length) {
      setSelectedSettlements([]);
    } else {
      setSelectedSettlements(
        filteredSettlements
          .filter(s => s.payment_status === 'pending')
          .map(s => s.id)
      );
    }
  };

  const handleSelectSettlement = (settlementId: string) => {
    setSelectedSettlements(prev =>
      prev.includes(settlementId)
        ? prev.filter(id => id !== settlementId)
        : [...prev, settlementId]
    );
  };

  const handleViewDetails = (settlement: DriverPaymentSettlement) => {
    setSelectedSettlement(settlement);
    setShowDetailsDialog(true);
  };

  const handleProcessSingle = async (settlement: DriverPaymentSettlement) => {
    setSelectedSettlement(settlement);
    setSelectedSettlements([settlement.id]);
    setShowPayoutDialog(true);
  };

  const handleProcessBatch = () => {
    if (selectedSettlements.length === 0) {
      toast.error('Please select settlements to process');
      return;
    }
    setShowPayoutDialog(true);
  };

  const handleConfirmPayout = async () => {
    setIsProcessing(true);
    try {
      const result = await processBatchPayouts(
        selectedSettlements,
        'admin', // TODO: Get actual admin ID
        payoutMethod
      );

      if (result.success.length > 0) {
        toast.success(`Successfully processed ${result.success.length} payouts`);
      }
      if (result.failed.length > 0) {
        toast.error(`Failed to process ${result.failed.length} payouts`);
      }

      setShowPayoutDialog(false);
      setSelectedSettlements([]);
      setPayoutNotes('');
      loadSettlements();
    } catch (error) {
      console.error('Error processing payouts:', error);
      toast.error('Failed to process payouts');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusChange = async (settlementId: string, newStatus: PaymentStatus) => {
    try {
      await updateSettlementStatus(settlementId, newStatus);
      toast.success('Status updated successfully');
      loadSettlements();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
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
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-green-600" />
                Payment Settlements
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Manage driver payouts and settlements
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={loadSettlements}
                className="border-gray-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              {selectedSettlements.length > 0 && (
                <Button
                  onClick={handleProcessBatch}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Process Selected ({selectedSettlements.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Payouts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPendingAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalCompletedAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by driver name, email, or period..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Settlements Table */}
      <Card className="shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={selectedSettlements.length === filteredSettlements.filter(s => s.payment_status === 'pending').length && selectedSettlements.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Driver</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Period</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Trips</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Gross</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Net Payout</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSettlements.map((settlement) => (
                <tr key={settlement.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {settlement.payment_status === 'pending' && (
                      <Checkbox
                        checked={selectedSettlements.includes(settlement.id)}
                        onCheckedChange={() => handleSelectSettlement(settlement.id)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{settlement.driver_name}</p>
                      <p className="text-sm text-gray-500">{settlement.driver_email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{settlement.settlement_period}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(settlement.period_start).toLocaleDateString()} -
                        {new Date(settlement.period_end).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-medium">{settlement.total_trips}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-medium">{formatCurrency(settlement.gross_earnings)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-bold text-green-600">{formatCurrency(settlement.net_payout)}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={`${getPayoutStatusColor(settlement.payment_status)} flex items-center gap-1 justify-center`}>
                      {getStatusIcon(settlement.payment_status)}
                      {settlement.payment_status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(settlement)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {settlement.payment_status === 'pending' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleProcessSingle(settlement)}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSettlements.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No settlements found</p>
          </div>
        )}
      </Card>

      {/* Payout Dialog */}
      <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payout</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Processing {selectedSettlements.length} settlement(s)</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  settlements
                    .filter(s => selectedSettlements.includes(s.id))
                    .reduce((sum, s) => sum + s.net_payout, 0)
                )}
              </p>
            </div>
            <div>
              <Label htmlFor="payoutMethod">Payment Method</Label>
              <Select value={payoutMethod} onValueChange={setPayoutMethod}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payoutNotes">Notes (Optional)</Label>
              <Textarea
                id="payoutNotes"
                value={payoutNotes}
                onChange={(e) => setPayoutNotes(e.target.value)}
                placeholder="Add any notes for this payout..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayoutDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPayout}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Payout
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Settlement Details</DialogTitle>
          </DialogHeader>
          {selectedSettlement && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Driver</p>
                  <p className="font-medium">{selectedSettlement.driver_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Period</p>
                  <p className="font-medium">{selectedSettlement.settlement_period}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Earnings Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gross Earnings</span>
                    <span className="font-medium">{formatCurrency(selectedSettlement.gross_earnings)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Platform Fees</span>
                    <span>-{formatCurrency(selectedSettlement.platform_fees)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Commission</span>
                    <span>-{formatCurrency(selectedSettlement.commission_amount)}</span>
                  </div>
                  {selectedSettlement.total_bonuses > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Bonuses</span>
                      <span>+{formatCurrency(selectedSettlement.total_bonuses)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Net Payout</span>
                    <span className="text-green-600">{formatCurrency(selectedSettlement.net_payout)}</span>
                  </div>
                </div>
              </div>

              {selectedSettlement.total_bonuses > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Bonus Details</h4>
                  <div className="space-y-2 text-sm">
                    {selectedSettlement.completion_bonus > 0 && (
                      <div className="flex justify-between">
                        <span>Completion Bonus</span>
                        <span className="text-green-600">+{formatCurrency(selectedSettlement.completion_bonus)}</span>
                      </div>
                    )}
                    {selectedSettlement.rating_bonus > 0 && (
                      <div className="flex justify-between">
                        <span>Rating Bonus</span>
                        <span className="text-green-600">+{formatCurrency(selectedSettlement.rating_bonus)}</span>
                      </div>
                    )}
                    {selectedSettlement.batch_bonus > 0 && (
                      <div className="flex justify-between">
                        <span>Volume Bonus</span>
                        <span className="text-green-600">+{formatCurrency(selectedSettlement.batch_bonus)}</span>
                      </div>
                    )}
                    {selectedSettlement.referral_bonus > 0 && (
                      <div className="flex justify-between">
                        <span>Referral Bonus</span>
                        <span className="text-green-600">+{formatCurrency(selectedSettlement.referral_bonus)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Payment Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge className={getPayoutStatusColor(selectedSettlement.payment_status)}>
                      {selectedSettlement.payment_status}
                    </Badge>
                  </div>
                  {selectedSettlement.payment_method && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span>{selectedSettlement.payment_method}</span>
                    </div>
                  )}
                  {selectedSettlement.payment_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Date</span>
                      <span>{new Date(selectedSettlement.payment_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedSettlement.bank_reference && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference</span>
                      <span className="font-mono text-xs">{selectedSettlement.bank_reference}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentSettlementsPanel;
