import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  FileText,
  Star,
  Crown,
  ChevronRight,
  User,
  MapPin,
  Clock,
  Eye,
  Edit,
  X,
  Upload,
  Plus,
  RefreshCw
} from 'lucide-react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Customer Profile Interface
interface CustomerProfile {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  passport?: {
    number?: string;
    expiryDate?: string;
    nationality?: string;
  };
  stats: {
    totalBookings: number;
    totalSpent: number;
    lastBookingDate?: Date | Timestamp;
    firstBookingDate?: Date | Timestamp;
  };
  bookingReferences: string[];
  documents?: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date | Timestamp;
  }[];
  notes?: string;
  vipStatus?: 'regular' | 'silver' | 'gold' | 'platinum';
  preferences?: {
    preferredVehicleType?: string;
    preferredLanguage?: string;
    specialRequirements?: string;
    dietaryRestrictions?: string;
  };
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

const VIPBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors = {
    regular: 'bg-gray-100 text-gray-700',
    silver: 'bg-slate-200 text-slate-800',
    gold: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    platinum: 'bg-purple-100 text-purple-800 border border-purple-300'
  };

  const icons = {
    regular: null,
    silver: <Star className="w-3 h-3" />,
    gold: <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />,
    platinum: <Crown className="w-3 h-3 fill-purple-500 text-purple-500" />
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.regular}`}>
      {icons[status as keyof typeof icons]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const CustomerCrmManager: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newThisMonth: 0,
    totalRevenue: 0,
    vipBreakdown: { regular: 0, silver: 0, gold: 0, platinum: 0 }
  });
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');

  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CustomerProfile[];
      setCustomers(data);

      // Calculate stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newThisMonth = data.filter(c => {
        const createdAt = c.createdAt instanceof Timestamp
          ? c.createdAt.toDate()
          : new Date(c.createdAt);
        return createdAt >= startOfMonth;
      }).length;

      const totalRevenue = data.reduce((sum, c) => sum + (c.stats?.totalSpent || 0), 0);
      const vipBreakdown = {
        regular: data.filter(c => c.vipStatus === 'regular' || !c.vipStatus).length,
        silver: data.filter(c => c.vipStatus === 'silver').length,
        gold: data.filter(c => c.vipStatus === 'gold').length,
        platinum: data.filter(c => c.vipStatus === 'platinum').length
      };

      setStats({
        totalCustomers: data.length,
        newThisMonth,
        totalRevenue,
        vipBreakdown
      });
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery) ||
      customer.customerId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || customer.vipStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Format date
  const formatDate = (date: Date | Timestamp | undefined) => {
    if (!date) return 'N/A';
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Save notes
  const saveNotes = async () => {
    if (!selectedCustomer) return;
    try {
      const docRef = doc(db, 'customers', selectedCustomer.id);
      await updateDoc(docRef, {
        notes: notesValue,
        updatedAt: serverTimestamp()
      });
      setSelectedCustomer({ ...selectedCustomer, notes: notesValue });
      setEditingNotes(false);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  // Update VIP status
  const updateVIPStatus = async (customerId: string, newStatus: string) => {
    try {
      const docRef = doc(db, 'customers', customerId);
      await updateDoc(docRef, {
        vipStatus: newStatus,
        updatedAt: serverTimestamp()
      });
      fetchCustomers();
      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer({ ...selectedCustomer, vipStatus: newStatus as any });
      }
    } catch (error) {
      console.error('Error updating VIP status:', error);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Customer ID', 'Name', 'Email', 'Phone', 'VIP Status', 'Total Bookings', 'Total Spent', 'First Booking', 'Last Booking'];
    const rows = filteredCustomers.map(c => [
      c.customerId,
      `${c.firstName} ${c.lastName}`,
      c.email,
      c.phone,
      c.vipStatus || 'regular',
      c.stats?.totalBookings || 0,
      `$${c.stats?.totalSpent || 0}`,
      formatDate(c.stats?.firstBookingDate),
      formatDate(c.stats?.lastBookingDate)
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-sky-600" />
              Customer CRM
            </h1>
            <p className="text-gray-500 mt-1">Manage customer profiles and booking history</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchCustomers}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-sky-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">New This Month</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.newThisMonth}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-amber-600">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">VIP Members</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.vipBreakdown.silver + stats.vipBreakdown.gold + stats.vipBreakdown.platinum}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">S: {stats.vipBreakdown.silver}</span>
            <span className="text-xs bg-yellow-100 px-2 py-0.5 rounded">G: {stats.vipBreakdown.gold}</span>
            <span className="text-xs bg-purple-100 px-2 py-0.5 rounded">P: {stats.vipBreakdown.platinum}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or customer ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="all">All Status</option>
              <option value="regular">Regular</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No customers found</p>
            <p className="text-gray-400 text-sm mt-1">Customers will appear here when bookings are made</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Bookings</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Total Spent</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Last Booking</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                          <span className="text-sky-600 font-semibold">
                            {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{customer.firstName} {customer.lastName}</p>
                          <p className="text-sm text-gray-500">{customer.customerId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" /> {customer.email}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> {customer.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <VIPBadge status={customer.vipStatus || 'regular'} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">{customer.stats?.totalBookings || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-600 font-semibold">${(customer.stats?.totalSpent || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{formatDate(customer.stats?.lastBookingDate)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setNotesValue(customer.notes || '');
                          setShowDetailModal(true);
                        }}
                        className="px-3 py-1.5 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                  <span className="text-sky-600 font-bold text-lg">
                    {selectedCustomer.firstName?.charAt(0)}{selectedCustomer.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedCustomer.customerId}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* VIP Status */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">VIP Status</span>
                </div>
                <select
                  value={selectedCustomer.vipStatus || 'regular'}
                  onChange={(e) => updateVIPStatus(selectedCustomer.id, e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                >
                  <option value="regular">Regular</option>
                  <option value="silver">Silver ($1,000+)</option>
                  <option value="gold">Gold ($2,000+)</option>
                  <option value="platinum">Platinum ($5,000+)</option>
                </select>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  {selectedCustomer.whatsapp && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-green-500" />
                      <span>WhatsApp: {selectedCustomer.whatsapp}</span>
                    </div>
                  )}
                  {selectedCustomer.passport?.nationality && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{selectedCustomer.passport.nationality}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Stats */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Booking Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-sky-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-sky-600">{selectedCustomer.stats?.totalBookings || 0}</p>
                    <p className="text-sm text-gray-500">Total Bookings</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">${(selectedCustomer.stats?.totalSpent || 0).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total Spent</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <p className="text-sm font-bold text-amber-600">{formatDate(selectedCustomer.stats?.firstBookingDate)}</p>
                    <p className="text-sm text-gray-500">First Booking</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <p className="text-sm font-bold text-purple-600">{formatDate(selectedCustomer.stats?.lastBookingDate)}</p>
                    <p className="text-sm text-gray-500">Last Booking</p>
                  </div>
                </div>
              </div>

              {/* Booking References */}
              {selectedCustomer.bookingReferences?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Booking History</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.bookingReferences.map((ref) => (
                      <span key={ref} className="px-3 py-1.5 bg-sky-50 text-sky-600 rounded-lg text-sm font-mono">
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences */}
              {selectedCustomer.preferences && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Preferences</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    {selectedCustomer.preferences.preferredVehicleType && (
                      <p className="text-sm"><span className="text-gray-500">Preferred Vehicle:</span> {selectedCustomer.preferences.preferredVehicleType}</p>
                    )}
                    {selectedCustomer.preferences.specialRequirements && (
                      <p className="text-sm"><span className="text-gray-500">Special Requirements:</span> {selectedCustomer.preferences.specialRequirements}</p>
                    )}
                    {selectedCustomer.preferences.dietaryRestrictions && (
                      <p className="text-sm"><span className="text-gray-500">Dietary Restrictions:</span> {selectedCustomer.preferences.dietaryRestrictions}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Admin Notes</h3>
                  {!editingNotes && (
                    <button
                      onClick={() => setEditingNotes(true)}
                      className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
                {editingNotes ? (
                  <div className="space-y-3">
                    <textarea
                      value={notesValue}
                      onChange={(e) => setNotesValue(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[120px]"
                      placeholder="Add internal notes about this customer..."
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setEditingNotes(false);
                          setNotesValue(selectedCustomer.notes || '');
                        }}
                        className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveNotes}
                        className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 min-h-[80px]">
                    {selectedCustomer.notes ? (
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedCustomer.notes}</p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No notes added yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Documents */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Documents</h3>
                  <button className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1">
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                </div>
                {selectedCustomer.documents && selectedCustomer.documents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCustomer.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">{doc.name}</span>
                          <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded">{doc.type}</span>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:text-sky-700 text-sm"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No documents uploaded</p>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Account Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Account Created</p>
                      <p className="text-xs text-gray-500">{formatDate(selectedCustomer.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-gray-500">{formatDate(selectedCustomer.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCrmManager;
