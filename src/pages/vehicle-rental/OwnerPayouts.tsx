import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Car,
  User,
  CreditCard,
  Download,
  Filter,
  RefreshCw,
  TrendingUp,
  Wallet,
  Building,
  ArrowRight,
  FileText,
  ChevronDown,
  ChevronUp,
  Eye
} from 'lucide-react';

// Types based on the 50/50 payment timeline
interface PayoutSchedule {
  id: string;
  bookingId: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  customerName: string;
  bookingDates: {
    start: Date;
    end: Date;
  };
  totalBookingAmount: number;
  commissionRate: number;
  commissionAmount: number;
  ownerPayout: number;
  payouts: {
    first: {
      amount: number;
      percentage: number;
      scheduledDate: Date;
      status: 'pending' | 'processing' | 'completed' | 'failed';
      paidDate?: Date;
      transactionId?: string;
    };
    second: {
      amount: number;
      percentage: number;
      scheduledDate: Date;
      status: 'pending' | 'processing' | 'completed' | 'failed' | 'withheld';
      paidDate?: Date;
      transactionId?: string;
      withholdReason?: string;
    };
  };
  createdAt: Date;
}

interface PayoutStats {
  totalEarnings: number;
  pendingPayouts: number;
  processingPayouts: number;
  completedPayouts: number;
  withheldPayouts: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
}

interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  branchCode: string;
  isVerified: boolean;
}

const OwnerPayouts: React.FC = () => {
  const [payoutSchedules, setPayoutSchedules] = useState<PayoutSchedule[]>([]);
  const [stats, setStats] = useState<PayoutStats>({
    totalEarnings: 0,
    pendingPayouts: 0,
    processingPayouts: 0,
    completedPayouts: 0,
    withheldPayouts: 0,
    thisMonthEarnings: 0,
    lastMonthEarnings: 0
  });
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPayoutData();
  }, []);

  const loadPayoutData = async () => {
    setLoading(true);
    try {
      // Simulated data - replace with actual Firebase calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock payout schedules based on 50/50 timeline
      const mockSchedules: PayoutSchedule[] = [
        {
          id: 'payout-001',
          bookingId: 'booking-001',
          vehicleId: 'vehicle-001',
          vehicleName: '2024 Toyota Land Cruiser',
          vehicleImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200',
          customerName: 'John Anderson',
          bookingDates: {
            start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          },
          totalBookingAmount: 450,
          commissionRate: 15,
          commissionAmount: 67.50,
          ownerPayout: 382.50,
          payouts: {
            first: {
              amount: 191.25,
              percentage: 50,
              scheduledDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
              status: 'pending',
            },
            second: {
              amount: 191.25,
              percentage: 50,
              scheduledDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
              status: 'pending',
            }
          },
          createdAt: new Date()
        },
        {
          id: 'payout-002',
          bookingId: 'booking-002',
          vehicleId: 'vehicle-002',
          vehicleName: '2023 Honda CR-V',
          vehicleImage: 'https://images.unsplash.com/photo-1568844293986-8c2a5c87f5b7?w=200',
          customerName: 'Sarah Williams',
          bookingDates: {
            start: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            end: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          },
          totalBookingAmount: 280,
          commissionRate: 15,
          commissionAmount: 42,
          ownerPayout: 238,
          payouts: {
            first: {
              amount: 119,
              percentage: 50,
              scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              status: 'completed',
              paidDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              transactionId: 'TXN-2024-00456'
            },
            second: {
              amount: 119,
              percentage: 50,
              scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              status: 'processing',
            }
          },
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'payout-003',
          bookingId: 'booking-003',
          vehicleId: 'vehicle-001',
          vehicleName: '2024 Toyota Land Cruiser',
          vehicleImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200',
          customerName: 'Michael Chen',
          bookingDates: {
            start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            end: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          },
          totalBookingAmount: 600,
          commissionRate: 15,
          commissionAmount: 90,
          ownerPayout: 510,
          payouts: {
            first: {
              amount: 255,
              percentage: 50,
              scheduledDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
              status: 'completed',
              paidDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
              transactionId: 'TXN-2024-00389'
            },
            second: {
              amount: 255,
              percentage: 50,
              scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              status: 'completed',
              paidDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              transactionId: 'TXN-2024-00412'
            }
          },
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'payout-004',
          bookingId: 'booking-004',
          vehicleId: 'vehicle-003',
          vehicleName: '2023 Suzuki Jimny',
          vehicleImage: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=200',
          customerName: 'Emma Thompson',
          bookingDates: {
            start: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            end: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          },
          totalBookingAmount: 200,
          commissionRate: 15,
          commissionAmount: 30,
          ownerPayout: 170,
          payouts: {
            first: {
              amount: 85,
              percentage: 50,
              scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              status: 'completed',
              paidDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              transactionId: 'TXN-2024-00445'
            },
            second: {
              amount: 85,
              percentage: 50,
              scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              status: 'withheld',
              withholdReason: 'Damage claim under review - minor scratch reported by customer'
            }
          },
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      ];

      setPayoutSchedules(mockSchedules);

      // Calculate stats
      let pendingTotal = 0;
      let processingTotal = 0;
      let completedTotal = 0;
      let withheldTotal = 0;

      mockSchedules.forEach(schedule => {
        [schedule.payouts.first, schedule.payouts.second].forEach(payout => {
          switch (payout.status) {
            case 'pending':
              pendingTotal += payout.amount;
              break;
            case 'processing':
              processingTotal += payout.amount;
              break;
            case 'completed':
              completedTotal += payout.amount;
              break;
            case 'withheld':
              withheldTotal += payout.amount;
              break;
          }
        });
      });

      setStats({
        totalEarnings: pendingTotal + processingTotal + completedTotal,
        pendingPayouts: pendingTotal,
        processingPayouts: processingTotal,
        completedPayouts: completedTotal,
        withheldPayouts: withheldTotal,
        thisMonthEarnings: 890.50,
        lastMonthEarnings: 1250.00
      });

      // Mock bank details
      setBankDetails({
        accountName: 'Premium Auto Rentals',
        accountNumber: '****7890',
        bankName: 'Commercial Bank',
        branchCode: '7421',
        isVerified: true
      });

    } catch (error) {
      console.error('Error loading payout data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadPayoutData();
    setRefreshing(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      withheld: 'bg-orange-100 text-orange-800'
    };
    
    const icons = {
      pending: <Clock className="h-3 w-3 mr-1" />,
      processing: <RefreshCw className="h-3 w-3 mr-1 animate-spin" />,
      completed: <CheckCircle className="h-3 w-3 mr-1" />,
      failed: <AlertTriangle className="h-3 w-3 mr-1" />,
      withheld: <AlertTriangle className="h-3 w-3 mr-1" />
    };

    const labels = {
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed',
      failed: 'Failed',
      withheld: 'On Hold'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const getFilteredSchedules = () => {
    let filtered = [...payoutSchedules];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(schedule => 
        schedule.payouts.first.status === filterStatus || 
        schedule.payouts.second.status === filterStatus
      );
    }

    if (filterMonth !== 'all') {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      if (filterMonth === 'this-month') {
        filtered = filtered.filter(s => new Date(s.createdAt) >= monthStart);
      } else if (filterMonth === 'last-month') {
        filtered = filtered.filter(s => 
          new Date(s.createdAt) >= lastMonthStart && new Date(s.createdAt) < monthStart
        );
      }
    }

    return filtered;
  };

  const downloadStatement = () => {
    alert('Generating payout statement PDF...');
    // Implement PDF generation
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading payout data...</p>
        </div>
      </div>
    );
  }

  const filteredSchedules = getFilteredSchedules();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Payout Dashboard</h1>
              <p className="mt-1 text-emerald-100">Track your earnings and payout schedule</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={refreshData}
                className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                disabled={refreshing}
                title="Refresh payout data"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={downloadStatement}
                className="inline-flex items-center px-4 py-2 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                title="Download payout statement"
              >
                <Download className="h-4 w-4 mr-2" />
                Statement
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="text-emerald-600 font-medium">
                ${stats.thisMonthEarnings.toFixed(2)}
              </span>
              <span className="ml-1">this month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Payouts</p>
                <p className="text-2xl font-bold text-yellow-600">${stats.pendingPayouts.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Awaiting payout schedule
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Processing</p>
                <p className="text-2xl font-bold text-blue-600">${stats.processingPayouts.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Being transferred to your bank
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">${stats.completedPayouts.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Successfully paid out
            </div>
          </div>
        </div>

        {/* Withheld Alert */}
        {stats.withheldPayouts > 0 && (
          <div className="mb-8 bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-medium text-orange-800">Payouts On Hold</h3>
                <p className="text-sm text-orange-700 mt-1">
                  ${stats.withheldPayouts.toFixed(2)} is currently on hold due to pending claims or verification.
                  These funds will be released after review.
                </p>
                <Link to="/vehicle-rental/owner/support" className="text-sm text-orange-600 hover:text-orange-800 font-medium mt-2 inline-block">
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payout Schedule List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">Payout Schedule</h2>
                  <div className="flex gap-3">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                      title="Filter by payout status"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="withheld">On Hold</option>
                    </select>
                    <select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                      title="Filter by time period"
                    >
                      <option value="all">All Time</option>
                      <option value="this-month">This Month</option>
                      <option value="last-month">Last Month</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredSchedules.length === 0 ? (
                  <div className="p-8 text-center">
                    <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No payouts found</h3>
                    <p className="text-gray-500 mt-1">
                      {filterStatus !== 'all' || filterMonth !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Your payout schedule will appear here after bookings are confirmed'}
                    </p>
                  </div>
                ) : (
                  filteredSchedules.map((schedule) => (
                    <div key={schedule.id} className="p-6">
                      <button 
                        type="button"
                        className="cursor-pointer w-full text-left"
                        onClick={() => setExpandedBooking(expandedBooking === schedule.id ? null : schedule.id)}
                        title={`Toggle details for ${schedule.vehicleName} booking`}
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={schedule.vehicleImage}
                            alt={schedule.vehicleName}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 truncate">
                                {schedule.vehicleName}
                              </h3>
                              {expandedBooking === schedule.id ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <User className="h-4 w-4 mr-1" />
                              {schedule.customerName}
                              <span className="mx-2">•</span>
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(schedule.bookingDates.start)} - {formatDate(schedule.bookingDates.end)}
                            </div>
                            <div className="flex items-center mt-2">
                              <span className="text-lg font-semibold text-emerald-600">
                                ${schedule.ownerPayout.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                ({schedule.commissionRate}% commission deducted)
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Expanded Details */}
                      {expandedBooking === schedule.id && (
                        <div className="mt-6 pl-20">
                          {/* Payment Timeline Visualization */}
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Timeline (50/50 Split)</h4>
                            <div className="relative">
                              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                              
                              {/* First Payout - 50% after 6 hours */}
                              <div className="relative pl-10 pb-6">
                                <div className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center ${
                                  schedule.payouts.first.status === 'completed' ? 'bg-green-500' :
                                  schedule.payouts.first.status === 'processing' ? 'bg-blue-500' :
                                  'bg-gray-300'
                                }`}>
                                  {schedule.payouts.first.status === 'completed' && (
                                    <CheckCircle className="h-3 w-3 text-white" />
                                  )}
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                      <span className="font-medium text-gray-900">First Payout (50%)</span>
                                      <span className="ml-2 text-sm text-gray-500">
                                        After 6 hours of payment
                                      </span>
                                    </div>
                                    {getStatusBadge(schedule.payouts.first.status)}
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="text-gray-600">
                                      <Clock className="h-4 w-4 inline mr-1" />
                                      {schedule.payouts.first.status === 'completed' ? 'Paid on' : 'Scheduled'}: {formatDate(schedule.payouts.first.paidDate || schedule.payouts.first.scheduledDate)}
                                      {' at '}
                                      {formatTime(schedule.payouts.first.paidDate || schedule.payouts.first.scheduledDate)}
                                    </div>
                                    <span className="font-semibold text-emerald-600">
                                      ${schedule.payouts.first.amount.toFixed(2)}
                                    </span>
                                  </div>
                                  {schedule.payouts.first.transactionId && (
                                    <div className="mt-2 text-xs text-gray-500">
                                      Transaction ID: {schedule.payouts.first.transactionId}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Second Payout - 50% after 72 hours verification */}
                              <div className="relative pl-10">
                                <div className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center ${
                                  schedule.payouts.second.status === 'completed' ? 'bg-green-500' :
                                  schedule.payouts.second.status === 'processing' ? 'bg-blue-500' :
                                  schedule.payouts.second.status === 'withheld' ? 'bg-orange-500' :
                                  'bg-gray-300'
                                }`}>
                                  {schedule.payouts.second.status === 'completed' && (
                                    <CheckCircle className="h-3 w-3 text-white" />
                                  )}
                                  {schedule.payouts.second.status === 'withheld' && (
                                    <AlertTriangle className="h-3 w-3 text-white" />
                                  )}
                                </div>
                                <div className={`rounded-lg p-4 border ${
                                  schedule.payouts.second.status === 'withheld' 
                                    ? 'bg-orange-50 border-orange-200' 
                                    : 'bg-gray-50 border-gray-100'
                                }`}>
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                      <span className="font-medium text-gray-900">Second Payout (50%)</span>
                                      <span className="ml-2 text-sm text-gray-500">
                                        After 72 hours verification
                                      </span>
                                    </div>
                                    {getStatusBadge(schedule.payouts.second.status)}
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="text-gray-600">
                                      <Clock className="h-4 w-4 inline mr-1" />
                                      {schedule.payouts.second.status === 'completed' ? 'Paid on' : 'Scheduled'}: {formatDate(schedule.payouts.second.paidDate || schedule.payouts.second.scheduledDate)}
                                    </div>
                                    <span className="font-semibold text-emerald-600">
                                      ${schedule.payouts.second.amount.toFixed(2)}
                                    </span>
                                  </div>
                                  {schedule.payouts.second.transactionId && (
                                    <div className="mt-2 text-xs text-gray-500">
                                      Transaction ID: {schedule.payouts.second.transactionId}
                                    </div>
                                  )}
                                  {schedule.payouts.second.withholdReason && (
                                    <div className="mt-2 p-2 bg-orange-100 rounded text-sm text-orange-800">
                                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                                      {schedule.payouts.second.withholdReason}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Revenue Breakdown */}
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Revenue Breakdown</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Booking Amount</span>
                                <span className="font-medium">${schedule.totalBookingAmount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-red-600">
                                <span>Platform Commission ({schedule.commissionRate}%)</span>
                                <span>-${schedule.commissionAmount.toFixed(2)}</span>
                              </div>
                              <div className="border-t pt-2 flex justify-between font-semibold text-emerald-600">
                                <span>Your Payout</span>
                                <span>${schedule.ownerPayout.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end space-x-3">
                            <Link
                              to={`/vehicle-rental/booking/${schedule.bookingId}`}
                              className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Booking
                            </Link>
                            <button 
                              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700"
                              title="Download invoice for this booking"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Download Invoice
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bank Account Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Account</h3>
              
              {bankDetails ? (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                      <Building className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{bankDetails.bankName}</p>
                      <p className="text-sm text-gray-500">{bankDetails.accountNumber}</p>
                    </div>
                    {bankDetails.isVerified && (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Account: {bankDetails.accountName}</p>
                    <p>Branch: {bankDetails.branchCode}</p>
                  </div>
                  <Link
                    to="/vehicle-rental/owner/settings"
                    className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Update Bank Details
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No bank account linked</p>
                  <Link
                    to="/vehicle-rental/owner/settings"
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Add Bank Account
                  </Link>
                </div>
              )}
            </div>

            {/* Payout Info Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How Payouts Work</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">50% after 6 hours</p>
                    <p className="text-gray-600">First half released after payment confirmation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">50% after 72 hours</p>
                    <p className="text-gray-600">Second half after rental verification period</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Bank Transfer</p>
                    <p className="text-gray-600">Funds transferred within 1-2 business days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/vehicle-rental/owner/vehicles"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700">My Vehicles</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  to="/vehicle-rental/owner/calendar"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Availability Calendar</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  to="/vehicle-rental/owner/analytics"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700">View Analytics</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerPayouts;
