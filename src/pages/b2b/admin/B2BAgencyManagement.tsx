import { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Mail,
  Phone,
  Globe,
  Calendar,
  Loader2,
  MoreVertical,
  Eye,
  Ban,
  CheckCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Agency {
  id: string;
  agencyName: string;
  email: string;
  phone: string;
  country: string;
  companySize: string;
  taxId: string;
  status: 'pending' | 'active' | 'suspended';
  emailVerified: boolean;
  totalBookings: number;
  totalRevenue: number;
  createdAt: any;
}

const statusFilters = [
  { value: '', label: 'All Agencies' },
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' }
];

const B2BAgencyManagement = () => {
  const { user, isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        
        const response = await fetch(`/api/b2b/admin/agencies?${params}`, {
          headers: {
            'Authorization': `Bearer ${await user?.getIdToken()}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setAgencies(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch agencies:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && isAdmin) {
      fetchAgencies();
    }
  }, [user, isAdmin, statusFilter]);

  const handleStatusChange = async (agencyId: string, newStatus: string) => {
    setActionLoading(agencyId);
    try {
      const response = await fetch(`/api/b2b/admin/agencies/${agencyId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        setAgencies(agencies.map(a => 
          a.id === agencyId ? { ...a, status: newStatus as any } : a
        ));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const filteredAgencies = agencies.filter(agency =>
    agency.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle };
      case 'pending':
        return { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock };
      case 'suspended':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: Ban };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-700', icon: Clock };
    }
  };

  return (
    <>
      <Helmet>
        <title>Agency Management | B2B Admin | Recharge Travels</title>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50/30 to-teal-50/30 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/admin/b2b"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Agency Management</h1>
            <p className="text-slate-600">Review, approve, and manage B2B partner agencies</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or country..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => {
                      setStatusFilter(filter.value);
                      setSearchParams(filter.value ? { status: filter.value } : {});
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      statusFilter === filter.value
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Agency List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : filteredAgencies.length > 0 ? (
            <div className="space-y-4">
              {filteredAgencies.map((agency) => {
                const statusStyle = getStatusBadge(agency.status);
                const StatusIcon = statusStyle.icon;
                
                return (
                  <div
                    key={agency.id}
                    className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden hover:shadow-xl transition-all"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Agency Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-bold text-slate-900">{agency.agencyName}</h3>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {agency.status}
                                </span>
                                {agency.emailVerified && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                    <CheckCheck className="w-3 h-3" />
                                    Verified
                                  </span>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Mail className="w-4 h-4 text-slate-400" />
                                  {agency.email}
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Phone className="w-4 h-4 text-slate-400" />
                                  {agency.phone}
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Globe className="w-4 h-4 text-slate-400" />
                                  {agency.country}
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Calendar className="w-4 h-4 text-slate-400" />
                                  {new Date(agency.createdAt?.seconds * 1000 || agency.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats & Actions */}
                        <div className="flex items-center gap-6">
                          <div className="text-center px-4 border-r border-slate-200">
                            <p className="text-2xl font-bold text-slate-900">{agency.totalBookings}</p>
                            <p className="text-xs text-slate-500">Bookings</p>
                          </div>
                          <div className="text-center px-4">
                            <p className="text-2xl font-bold text-emerald-600">${agency.totalRevenue.toLocaleString()}</p>
                            <p className="text-xs text-slate-500">Revenue</p>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {agency.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(agency.id, 'active')}
                                  disabled={actionLoading === agency.id}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50"
                                >
                                  {actionLoading === agency.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleStatusChange(agency.id, 'suspended')}
                                  disabled={actionLoading === agency.id}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </>
                            )}
                            {agency.status === 'active' && (
                              <button
                                onClick={() => handleStatusChange(agency.id, 'suspended')}
                                disabled={actionLoading === agency.id}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 disabled:opacity-50"
                              >
                                <Ban className="w-4 h-4" />
                                Suspend
                              </button>
                            )}
                            {agency.status === 'suspended' && (
                              <button
                                onClick={() => handleStatusChange(agency.id, 'active')}
                                disabled={actionLoading === agency.id}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 disabled:opacity-50"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Reactivate
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No agencies found</h3>
              <p className="text-slate-500">
                {searchTerm || statusFilter 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No agencies have registered yet'}
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default B2BAgencyManagement;
