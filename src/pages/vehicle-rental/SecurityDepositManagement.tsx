import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  XCircle,
  RefreshCw,
  Car,
  User,
  Calendar,
  FileText,
  Camera,
  Eye,
  Lock,
  Unlock,
  ArrowRight,
  Filter,
  Search,
  Info
} from 'lucide-react';

// Types for security deposit management
interface SecurityDeposit {
  id: string;
  bookingId: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  customerName: string;
  customerId: string;
  amount: number;
  status: 'held' | 'under_review' | 'released' | 'partially_deducted' | 'fully_deducted';
  holdDate: Date;
  releaseDate?: Date;
  expectedReleaseDate: Date;
  deductions: Array<{
    id: string;
    reason: string;
    amount: number;
    evidence?: string[];
    createdAt: Date;
    status: 'pending' | 'approved' | 'disputed';
  }>;
  bookingDates: {
    start: Date;
    end: Date;
  };
  vehicleCondition?: {
    preRental: {
      mileage: number;
      fuelLevel: number;
      inspectionDate: Date;
      notes: string;
      photos: string[];
    };
    postRental?: {
      mileage: number;
      fuelLevel: number;
      inspectionDate: Date;
      notes: string;
      photos: string[];
    };
  };
  timeline: Array<{
    action: string;
    date: Date;
    details: string;
    actor: string;
  }>;
}

interface DepositStats {
  totalHeld: number;
  totalReleased: number;
  totalDeducted: number;
  pendingReview: number;
  avgReleaseTime: number; // in hours
}

const SecurityDepositManagement: React.FC = () => {
  const [deposits, setDeposits] = useState<SecurityDeposit[]>([]);
  const [stats, setStats] = useState<DepositStats>({
    totalHeld: 0,
    totalReleased: 0,
    totalDeducted: 0,
    pendingReview: 0,
    avgReleaseTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeposit, setSelectedDeposit] = useState<SecurityDeposit | null>(null);
  const [showDeductionModal, setShowDeductionModal] = useState(false);
  const [deductionAmount, setDeductionAmount] = useState('');
  const [deductionReason, setDeductionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadDeposits();
  }, []);

  const loadDeposits = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock deposit data
      const mockDeposits: SecurityDeposit[] = [
        {
          id: 'dep-001',
          bookingId: 'booking-001',
          vehicleId: 'vehicle-001',
          vehicleName: '2024 Toyota Land Cruiser',
          vehicleImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200',
          customerName: 'John Anderson',
          customerId: 'cust-001',
          amount: 200,
          status: 'held',
          holdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          expectedReleaseDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          deductions: [],
          bookingDates: {
            start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          },
          vehicleCondition: {
            preRental: {
              mileage: 15420,
              fuelLevel: 85,
              inspectionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              notes: 'Vehicle in excellent condition. Minor wear on front tires.',
              photos: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400']
            }
          },
          timeline: [
            {
              action: 'Deposit Held',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              details: 'Security deposit of $200 held via Stripe',
              actor: 'System'
            },
            {
              action: 'Booking Confirmed',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              details: 'Booking confirmed for 3-day rental',
              actor: 'John Anderson'
            }
          ]
        },
        {
          id: 'dep-002',
          bookingId: 'booking-002',
          vehicleId: 'vehicle-002',
          vehicleName: '2023 Honda CR-V',
          vehicleImage: 'https://images.unsplash.com/photo-1568844293986-8c2a5c87f5b7?w=200',
          customerName: 'Sarah Williams',
          customerId: 'cust-002',
          amount: 150,
          status: 'under_review',
          holdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          expectedReleaseDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          deductions: [
            {
              id: 'ded-001',
              reason: 'Minor scratch on rear bumper',
              amount: 50,
              evidence: ['https://images.unsplash.com/photo-1568844293986-8c2a5c87f5b7?w=400'],
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              status: 'pending'
            }
          ],
          bookingDates: {
            start: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            end: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          },
          vehicleCondition: {
            preRental: {
              mileage: 28350,
              fuelLevel: 100,
              inspectionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              notes: 'Vehicle fully cleaned and inspected',
              photos: []
            },
            postRental: {
              mileage: 28750,
              fuelLevel: 75,
              inspectionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              notes: 'Minor scratch on rear bumper detected during return inspection',
              photos: []
            }
          },
          timeline: [
            {
              action: 'Deposit Held',
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              details: 'Security deposit of $150 held via PayPal',
              actor: 'System'
            },
            {
              action: 'Rental Completed',
              date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              details: 'Vehicle returned at Colombo City Center',
              actor: 'Sarah Williams'
            },
            {
              action: 'Damage Reported',
              date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              details: 'Minor scratch on rear bumper - $50 deduction proposed',
              actor: 'Owner'
            },
            {
              action: 'Under Review',
              date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              details: 'Awaiting customer response on deduction',
              actor: 'System'
            }
          ]
        },
        {
          id: 'dep-003',
          bookingId: 'booking-003',
          vehicleId: 'vehicle-001',
          vehicleName: '2024 Toyota Land Cruiser',
          vehicleImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200',
          customerName: 'Michael Chen',
          customerId: 'cust-003',
          amount: 200,
          status: 'released',
          holdDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          releaseDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          expectedReleaseDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          deductions: [],
          bookingDates: {
            start: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
            end: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
          },
          timeline: [
            {
              action: 'Deposit Held',
              date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
              details: 'Security deposit of $200 held',
              actor: 'System'
            },
            {
              action: 'Rental Completed',
              date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
              details: 'Vehicle returned in excellent condition',
              actor: 'Michael Chen'
            },
            {
              action: 'Deposit Released',
              date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
              details: 'Full deposit of $200 released to customer',
              actor: 'System'
            }
          ]
        },
        {
          id: 'dep-004',
          bookingId: 'booking-004',
          vehicleId: 'vehicle-003',
          vehicleName: '2023 Suzuki Jimny',
          vehicleImage: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=200',
          customerName: 'Emma Thompson',
          customerId: 'cust-004',
          amount: 100,
          status: 'partially_deducted',
          holdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          releaseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          expectedReleaseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          deductions: [
            {
              id: 'ded-002',
              reason: 'Extra cleaning required due to sand/mud',
              amount: 25,
              createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
              status: 'approved'
            }
          ],
          bookingDates: {
            start: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
            end: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          },
          timeline: [
            {
              action: 'Deposit Held',
              date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
              details: 'Security deposit of $100 held',
              actor: 'System'
            },
            {
              action: 'Cleaning Fee Deducted',
              date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
              details: '$25 deducted for extra cleaning',
              actor: 'Owner'
            },
            {
              action: 'Partial Release',
              date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              details: '$75 released to customer (after $25 deduction)',
              actor: 'System'
            }
          ]
        }
      ];

      setDeposits(mockDeposits);

      // Calculate stats
      const statsCalc: DepositStats = {
        totalHeld: mockDeposits
          .filter(d => d.status === 'held' || d.status === 'under_review')
          .reduce((sum, d) => sum + d.amount, 0),
        totalReleased: mockDeposits
          .filter(d => d.status === 'released')
          .reduce((sum, d) => sum + d.amount, 0),
        totalDeducted: mockDeposits
          .flatMap(d => d.deductions.filter(ded => ded.status === 'approved'))
          .reduce((sum, d) => sum + d.amount, 0),
        pendingReview: mockDeposits.filter(d => d.status === 'under_review').length,
        avgReleaseTime: 48
      };

      setStats(statsCalc);
    } catch (error) {
      console.error('Error loading deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      held: {
        color: 'bg-blue-100 text-blue-800',
        icon: <Lock className="h-3 w-3 mr-1" />,
        label: 'Held'
      },
      under_review: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="h-3 w-3 mr-1" />,
        label: 'Under Review'
      },
      released: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
        label: 'Released'
      },
      partially_deducted: {
        color: 'bg-orange-100 text-orange-800',
        icon: <AlertTriangle className="h-3 w-3 mr-1" />,
        label: 'Partial Deduction'
      },
      fully_deducted: {
        color: 'bg-red-100 text-red-800',
        icon: <XCircle className="h-3 w-3 mr-1" />,
        label: 'Fully Deducted'
      }
    };
    return configs[status as keyof typeof configs] || configs.held;
  };

  const releaseDeposit = async (depositId: string) => {
    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDeposits(prev => prev.map(d => 
        d.id === depositId 
          ? { ...d, status: 'released' as const, releaseDate: new Date() }
          : d
      ));
      
      alert('Deposit released successfully!');
      setSelectedDeposit(null);
    } catch (error) {
      console.error('Error releasing deposit:', error);
      alert('Failed to release deposit');
    } finally {
      setProcessing(false);
    }
  };

  const submitDeduction = async () => {
    if (!selectedDeposit || !deductionAmount || !deductionReason) return;

    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const amount = parseFloat(deductionAmount);
      
      setDeposits(prev => prev.map(d => {
        if (d.id === selectedDeposit.id) {
          const newDeduction = {
            id: `ded-${Date.now()}`,
            reason: deductionReason,
            amount: amount,
            createdAt: new Date(),
            status: 'pending' as const
          };
          return {
            ...d,
            status: 'under_review' as const,
            deductions: [...d.deductions, newDeduction]
          };
        }
        return d;
      }));
      
      setShowDeductionModal(false);
      setDeductionAmount('');
      setDeductionReason('');
      alert('Deduction submitted for review');
    } catch (error) {
      console.error('Error submitting deduction:', error);
      alert('Failed to submit deduction');
    } finally {
      setProcessing(false);
    }
  };

  const getFilteredDeposits = () => {
    let filtered = [...deposits];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(d => d.status === filterStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.vehicleName.toLowerCase().includes(query) ||
        d.customerName.toLowerCase().includes(query) ||
        d.bookingId.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-emerald-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading security deposits...</p>
        </div>
      </div>
    );
  }

  const filteredDeposits = getFilteredDeposits();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Shield className="h-8 w-8 mr-3" />
                Security Deposits
              </h1>
              <p className="mt-1 text-blue-100">Manage security deposit holds and releases</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/vehicle-rental/owner/dashboard"
                className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Back to Dashboard
              </Link>
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
                <p className="text-sm text-gray-500">Currently Held</p>
                <p className="text-2xl font-bold text-blue-600">${stats.totalHeld.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Released</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalReleased.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Unlock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Deducted</p>
                <p className="text-2xl font-bold text-orange-600">${stats.totalDeducted.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingReview}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800">Security Deposit Policy</h3>
              <p className="text-sm text-blue-700 mt-1">
                Deposits are automatically released 72 hours after vehicle return if no damage claims are filed.
                You can propose deductions for damages or cleaning within this period.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by vehicle, customer, or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                title="Filter by deposit status"
              >
                <option value="all">All Status</option>
                <option value="held">Held</option>
                <option value="under_review">Under Review</option>
                <option value="released">Released</option>
                <option value="partially_deducted">Partial Deduction</option>
                <option value="fully_deducted">Fully Deducted</option>
              </select>
            </div>
          </div>
        </div>

        {/* Deposits List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Deposit Records ({filteredDeposits.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredDeposits.length === 0 ? (
              <div className="p-8 text-center">
                <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No deposits found</h3>
                <p className="text-gray-500 mt-1">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Security deposits will appear here after bookings'}
                </p>
              </div>
            ) : (
              filteredDeposits.map((deposit) => {
                const statusConfig = getStatusConfig(deposit.status);
                const totalDeductions = deposit.deductions
                  .filter(d => d.status === 'approved')
                  .reduce((sum, d) => sum + d.amount, 0);
                const netAmount = deposit.amount - totalDeductions;

                return (
                  <div key={deposit.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={deposit.vehicleImage}
                        alt={deposit.vehicleName}
                        className="w-20 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{deposit.vehicleName}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <User className="h-4 w-4 mr-1" />
                              {deposit.customerName}
                              <span className="mx-2">•</span>
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(deposit.bookingDates.start)} - {formatDate(deposit.bookingDates.end)}
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Deposit Amount</p>
                            <p className="font-semibold text-gray-900">${deposit.amount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Deductions</p>
                            <p className={`font-semibold ${totalDeductions > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                              {totalDeductions > 0 ? `-$${totalDeductions.toFixed(2)}` : '$0.00'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Net Amount</p>
                            <p className="font-semibold text-emerald-600">${netAmount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              {deposit.releaseDate ? 'Released On' : 'Expected Release'}
                            </p>
                            <p className="font-semibold text-gray-900">
                              {formatDate(deposit.releaseDate || deposit.expectedReleaseDate)}
                            </p>
                          </div>
                        </div>

                        {/* Pending Deductions */}
                        {deposit.deductions.filter(d => d.status === 'pending').length > 0 && (
                          <div className="mt-4 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                            <h4 className="text-sm font-medium text-yellow-800 mb-2">Pending Deductions</h4>
                            {deposit.deductions.filter(d => d.status === 'pending').map(ded => (
                              <div key={ded.id} className="flex items-center justify-between text-sm">
                                <span className="text-yellow-700">{ded.reason}</span>
                                <span className="font-medium text-yellow-800">${ded.amount.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            onClick={() => setSelectedDeposit(deposit)}
                            className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View deposit details"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </button>
                          
                          {(deposit.status === 'held' || deposit.status === 'under_review') && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedDeposit(deposit);
                                  setShowDeductionModal(true);
                                }}
                                className="inline-flex items-center px-3 py-1.5 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                title="Report damage and propose deduction"
                              >
                                <Camera className="h-4 w-4 mr-1" />
                                Report Damage
                              </button>
                              
                              {deposit.status === 'held' && deposit.deductions.length === 0 && (
                                <button
                                  onClick={() => releaseDeposit(deposit.id)}
                                  disabled={processing}
                                  className="inline-flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                  title="Release deposit to customer"
                                >
                                  <Unlock className="h-4 w-4 mr-1" />
                                  Release Deposit
                                </button>
                              )}
                            </>
                          )}

                          <Link
                            to={`/vehicle-rental/invoice/${deposit.bookingId}`}
                            className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View Invoice
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDeposit && !showDeductionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Deposit Details</h2>
                <button
                  onClick={() => setSelectedDeposit(null)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Close modal"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Booking Info */}
              <div className="flex items-center gap-4">
                <img
                  src={selectedDeposit.vehicleImage}
                  alt={selectedDeposit.vehicleName}
                  className="w-24 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{selectedDeposit.vehicleName}</h3>
                  <p className="text-gray-600">{selectedDeposit.customerName}</p>
                  <p className="text-sm text-gray-500">Booking: {selectedDeposit.bookingId}</p>
                </div>
              </div>

              {/* Deposit Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Deposit Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Original Amount</p>
                    <p className="font-semibold">${selectedDeposit.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusConfig(selectedDeposit.status).color}`}>
                      {getStatusConfig(selectedDeposit.status).label}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500">Hold Date</p>
                    <p className="font-semibold">{formatDate(selectedDeposit.holdDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{selectedDeposit.releaseDate ? 'Released' : 'Expected Release'}</p>
                    <p className="font-semibold">
                      {formatDate(selectedDeposit.releaseDate || selectedDeposit.expectedReleaseDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Condition */}
              {selectedDeposit.vehicleCondition && (
                <div>
                  <h4 className="font-medium mb-3">Vehicle Condition</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <h5 className="text-sm font-medium text-green-800 mb-2">Pre-Rental</h5>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>Mileage: {selectedDeposit.vehicleCondition.preRental.mileage.toLocaleString()} km</p>
                        <p>Fuel: {selectedDeposit.vehicleCondition.preRental.fuelLevel}%</p>
                        <p className="text-xs">{selectedDeposit.vehicleCondition.preRental.notes}</p>
                      </div>
                    </div>
                    {selectedDeposit.vehicleCondition.postRental && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <h5 className="text-sm font-medium text-blue-800 mb-2">Post-Rental</h5>
                        <div className="text-sm text-blue-700 space-y-1">
                          <p>Mileage: {selectedDeposit.vehicleCondition.postRental.mileage.toLocaleString()} km</p>
                          <p>Fuel: {selectedDeposit.vehicleCondition.postRental.fuelLevel}%</p>
                          <p className="text-xs">{selectedDeposit.vehicleCondition.postRental.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Deductions */}
              {selectedDeposit.deductions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Deductions</h4>
                  <div className="space-y-2">
                    {selectedDeposit.deductions.map(ded => (
                      <div key={ded.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{ded.reason}</p>
                          <p className="text-sm text-gray-500">{formatDate(ded.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">-${ded.amount.toFixed(2)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            ded.status === 'approved' ? 'bg-green-100 text-green-800' :
                            ded.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {ded.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="font-medium mb-3">Activity Timeline</h4>
                <div className="relative pl-6">
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                  {selectedDeposit.timeline.map((event, index) => (
                    <div key={index} className="relative pb-4 last:pb-0">
                      <div className="absolute left-[-16px] w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
                      <div className="ml-4">
                        <p className="font-medium text-sm">{event.action}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(event.date)}</p>
                        <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedDeposit(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
              {selectedDeposit.status === 'held' && selectedDeposit.deductions.length === 0 && (
                <button
                  onClick={() => releaseDeposit(selectedDeposit.id)}
                  disabled={processing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Release Deposit'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deduction Modal */}
      {showDeductionModal && selectedDeposit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Report Damage / Deduction</h2>
                <button
                  onClick={() => {
                    setShowDeductionModal(false);
                    setDeductionAmount('');
                    setDeductionReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  title="Close deduction modal"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Deposit Amount:</strong> ${selectedDeposit.amount.toFixed(2)}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Maximum deduction allowed: ${selectedDeposit.amount.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deduction Amount ($)
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedDeposit.amount}
                  step="0.01"
                  value={deductionAmount}
                  onChange={(e) => setDeductionAmount(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Deduction
                </label>
                <select
                  value={deductionReason}
                  onChange={(e) => setDeductionReason(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  title="Select reason for deduction"
                >
                  <option value="">Select a reason...</option>
                  <option value="Minor scratch on body">Minor scratch on body</option>
                  <option value="Dent on door/panel">Dent on door/panel</option>
                  <option value="Interior damage/stains">Interior damage/stains</option>
                  <option value="Extra cleaning required">Extra cleaning required</option>
                  <option value="Missing accessories">Missing accessories</option>
                  <option value="Windshield damage">Windshield damage</option>
                  <option value="Tire damage">Tire damage</option>
                  <option value="Other damage">Other damage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Evidence (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Drag photos here or click to upload
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="evidence-upload"
                  />
                  <label
                    htmlFor="evidence-upload"
                    className="mt-2 inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                  >
                    Select Photos
                  </label>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                  <p className="text-sm text-yellow-700">
                    Deductions are subject to review. The customer will be notified and can dispute the claim.
                    Provide clear evidence to support your deduction request.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeductionModal(false);
                  setDeductionAmount('');
                  setDeductionReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={submitDeduction}
                disabled={processing || !deductionAmount || !deductionReason}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {processing ? 'Submitting...' : 'Submit Deduction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityDepositManagement;
