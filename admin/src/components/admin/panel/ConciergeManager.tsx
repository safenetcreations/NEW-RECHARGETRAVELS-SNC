import React, { useState, useEffect } from 'react';
import {
  Crown,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ChefHat,
  Shield,
  Sparkles,
  Car,
  Stethoscope,
  Image,
  GripVertical,
  Calendar,
  Users,
  DollarSign,
  Settings,
  LayoutDashboard,
  FileText,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Download,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import {
  getConciergeServices,
  createConciergeService,
  updateConciergeService,
  deleteConciergeService,
  reorderConciergeServices,
  getConciergeBookings,
  updateConciergeBooking,
  deleteConciergeBooking,
  getConciergeHeroContent,
  updateConciergeHeroContent,
  getConciergeSettings,
  updateConciergeSettings,
  getConciergeStats,
  seedDefaultConciergeServices,
  ConciergeService,
  ConciergeBooking,
  ConciergeHeroContent,
  ConciergeSettings
} from '@/services/conciergeAdminService';

// Icon mapping for services
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ChefHat,
  Shield,
  Sparkles,
  Crown,
  Car,
  Stethoscope
};

// Tabs
type Tab = 'dashboard' | 'services' | 'bookings' | 'hero' | 'settings';

const ConciergeManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [services, setServices] = useState<ConciergeService[]>([]);
  const [bookings, setBookings] = useState<ConciergeBooking[]>([]);
  const [heroContent, setHeroContent] = useState<ConciergeHeroContent | null>(null);
  const [settings, setSettings] = useState<ConciergeSettings | null>(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Service editing
  const [editingService, setEditingService] = useState<ConciergeService | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  // Booking filters
  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState('');

  // Hero editing
  const [editingHero, setEditingHero] = useState(false);
  const [heroForm, setHeroForm] = useState<Partial<ConciergeHeroContent>>({});

  // Settings editing
  const [editingSettings, setEditingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState<Partial<ConciergeSettings>>({});

  // Selected booking for detail view
  const [selectedBooking, setSelectedBooking] = useState<ConciergeBooking | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [servicesData, bookingsData, heroData, settingsData, statsData] = await Promise.all([
        getConciergeServices(),
        getConciergeBookings(),
        getConciergeHeroContent(),
        getConciergeSettings(),
        getConciergeStats()
      ]);
      setServices(servicesData);
      setBookings(bookingsData);
      setHeroContent(heroData);
      setSettings(settingsData);
      setStats(statsData);

      if (heroData) {
        setHeroForm(heroData);
      }
      if (settingsData) {
        setSettingsForm(settingsData);
      }
    } catch (err) {
      console.error('Error loading concierge data:', err);
      setError('Failed to load concierge data');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Service handlers
  const handleSaveService = async () => {
    if (!editingService) return;

    setSaving(true);
    setError(null);
    try {
      if (isNewService) {
        await createConciergeService({
          ...editingService,
          order: services.length + 1
        } as Omit<ConciergeService, 'id'>);
        showSuccess('Service created successfully');
      } else if (editingService.id) {
        await updateConciergeService(editingService.id, editingService);
        showSuccess('Service updated successfully');
      }
      setEditingService(null);
      setIsNewService(false);
      loadData();
    } catch (err) {
      console.error('Error saving service:', err);
      setError('Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    setSaving(true);
    try {
      await deleteConciergeService(id);
      showSuccess('Service deleted successfully');
      loadData();
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Failed to delete service');
    } finally {
      setSaving(false);
    }
  };

  const handleSeedServices = async () => {
    if (!window.confirm('This will seed default concierge services. Continue?')) return;

    setSaving(true);
    try {
      await seedDefaultConciergeServices();
      showSuccess('Default services seeded successfully');
      loadData();
    } catch (err) {
      console.error('Error seeding services:', err);
      setError('Failed to seed services');
    } finally {
      setSaving(false);
    }
  };

  // Booking handlers
  const handleUpdateBookingStatus = async (id: string, status: ConciergeBooking['status']) => {
    setSaving(true);
    try {
      await updateConciergeBooking(id, { status });
      showSuccess('Booking status updated');
      loadData();
    } catch (err) {
      console.error('Error updating booking:', err);
      setError('Failed to update booking');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    setSaving(true);
    try {
      await deleteConciergeBooking(id);
      showSuccess('Booking deleted successfully');
      setSelectedBooking(null);
      loadData();
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Failed to delete booking');
    } finally {
      setSaving(false);
    }
  };

  // Hero handlers
  const handleSaveHero = async () => {
    setSaving(true);
    try {
      await updateConciergeHeroContent(heroForm);
      showSuccess('Hero content updated');
      setEditingHero(false);
      loadData();
    } catch (err) {
      console.error('Error saving hero:', err);
      setError('Failed to save hero content');
    } finally {
      setSaving(false);
    }
  };

  // Settings handlers
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateConciergeSettings(settingsForm);
      showSuccess('Settings updated');
      setEditingSettings(false);
      loadData();
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = bookingFilter === 'all' || booking.status === bookingFilter;
    const matchesSearch = !bookingSearch ||
      booking.firstName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      booking.lastName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      booking.email.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      booking.bookingRef.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">VIP Concierge Manager</h1>
            <p className="text-gray-500">Manage luxury concierge services and bookings</p>
          </div>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'services', label: 'Services', icon: Crown },
          { id: 'bookings', label: 'Bookings', icon: Calendar },
          { id: 'hero', label: 'Hero Section', icon: Image },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completedBookings}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Services Overview
              </h3>
              <div className="space-y-3">
                {services.slice(0, 5).map(service => (
                  <div key={service.id} className="flex items-center justify-between">
                    <span className="text-gray-600">{service.category}</span>
                    <span className={`px-2 py-1 rounded text-xs ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
                {services.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No services yet</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Recent Bookings
              </h3>
              <div className="space-y-3">
                {bookings.slice(0, 5).map(booking => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-900 font-medium">{booking.firstName} {booking.lastName}</span>
                      <span className="text-gray-500 text-sm ml-2">#{booking.bookingRef}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No bookings yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {/* Actions */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Concierge Services</h2>
            <div className="flex gap-2">
              {services.length === 0 && (
                <button
                  onClick={handleSeedServices}
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  Seed Default Services
                </button>
              )}
              <button
                onClick={() => {
                  setEditingService({
                    category: '',
                    icon: 'Crown',
                    image: '',
                    description: '',
                    services: [],
                    startingPrice: 0,
                    isActive: true,
                    order: services.length + 1
                  });
                  setIsNewService(true);
                }}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(service => {
              const IconComponent = iconMap[service.icon] || Crown;
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {service.image && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <IconComponent className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{service.category}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-600 font-semibold">From ${service.startingPrice}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setIsNewService(false);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => service.id && handleDeleteService(service.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Service Edit Modal */}
          {editingService && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {isNewService ? 'Add New Service' : 'Edit Service'}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingService(null);
                        setIsNewService(false);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                    <input
                      type="text"
                      value={editingService.category}
                      onChange={e => setEditingService({ ...editingService, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="e.g., Culinary Excellence"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <select
                      value={editingService.icon}
                      onChange={e => setEditingService({ ...editingService, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="ChefHat">Chef Hat</option>
                      <option value="Shield">Shield</option>
                      <option value="Sparkles">Sparkles</option>
                      <option value="Crown">Crown</option>
                      <option value="Car">Car</option>
                      <option value="Stethoscope">Stethoscope</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={editingService.image}
                      onChange={e => setEditingService({ ...editingService, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingService.description}
                      onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      rows={3}
                      placeholder="Brief description of the service category..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Services (one per line)</label>
                    <textarea
                      value={editingService.services.join('\n')}
                      onChange={e => setEditingService({ ...editingService, services: e.target.value.split('\n').filter(s => s.trim()) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      rows={5}
                      placeholder="Private Chef Experience&#10;Wine Tasting&#10;Exclusive Dining"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price ($)</label>
                      <input
                        type="number"
                        value={editingService.startingPrice}
                        onChange={e => setEditingService({ ...editingService, startingPrice: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={editingService.isActive ? 'active' : 'inactive'}
                        onChange={e => setEditingService({ ...editingService, isActive: e.target.value === 'active' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setEditingService(null);
                      setIsNewService(false);
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveService}
                    disabled={saving}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Service'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={bookingSearch}
                onChange={e => setBookingSearch(e.target.value)}
                placeholder="Search by name, email, or reference..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <select
              value={bookingFilter}
              onChange={e => setBookingFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-medium text-amber-600">{booking.bookingRef}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{booking.firstName} {booking.lastName}</p>
                          <p className="text-sm text-gray-500">{booking.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{booking.preferredDate}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">${booking.estimatedTotal.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => booking.id && handleDeleteBooking(booking.id)}
                            className="p-2 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Booking Detail Modal */}
          {selectedBooking && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Booking #{selectedBooking.bookingRef}</h3>
                      <p className="text-sm text-gray-500">
                        Created: {selectedBooking.createdAt?.toDate().toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Customer Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{selectedBooking.firstName} {selectedBooking.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedBooking.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{selectedBooking.countryCode} {selectedBooking.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{selectedBooking.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Booking Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                      <div>
                        <p className="text-sm text-gray-500">Preferred Date</p>
                        <p className="font-medium">{selectedBooking.preferredDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Alternate Date</p>
                        <p className="font-medium">{selectedBooking.alternateDate || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="font-medium">{selectedBooking.guests}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{selectedBooking.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="font-medium">{selectedBooking.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-medium capitalize">{selectedBooking.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  {/* Selected Services */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Selected Services
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ul className="space-y-2">
                        {selectedBooking.selectedServiceDetails.map((service, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {selectedBooking.specialRequests && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Special Requests
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                      </div>
                    </div>
                  )}

                  {/* Status Update */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(status => (
                        <button
                          key={status}
                          onClick={() => selectedBooking.id && handleUpdateBookingStatus(selectedBooking.id, status as ConciergeBooking['status'])}
                          disabled={saving || selectedBooking.status === status}
                          className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                            selectedBooking.status === status
                              ? 'bg-amber-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } disabled:opacity-50`}
                        >
                          {status.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-between">
                  <button
                    onClick={() => selectedBooking.id && handleDeleteBooking(selectedBooking.id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Booking
                  </button>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Estimated Total</p>
                    <p className="text-2xl font-bold text-amber-600">${selectedBooking.estimatedTotal.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hero Tab */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Hero Section Content</h2>
            {!editingHero && (
              <button
                onClick={() => setEditingHero(true)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Hero
              </button>
            )}
          </div>

          {editingHero ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={heroForm.title || ''}
                  onChange={e => setHeroForm({ ...heroForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <textarea
                  value={heroForm.subtitle || ''}
                  onChange={e => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
                <input
                  type="text"
                  value={heroForm.heroImage || ''}
                  onChange={e => setHeroForm({ ...heroForm, heroImage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                <input
                  type="text"
                  value={heroForm.badge || ''}
                  onChange={e => setHeroForm({ ...heroForm, badge: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setEditingHero(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveHero}
                  disabled={saving}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              {heroContent ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Title</p>
                    <p className="text-xl font-semibold">{heroContent.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subtitle</p>
                    <p className="text-gray-700">{heroContent.subtitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Badge</p>
                    <p className="text-amber-600 font-medium">{heroContent.badge}</p>
                  </div>
                  {heroContent.heroImage && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Hero Image</p>
                      <img
                        src={heroContent.heroImage}
                        alt="Hero"
                        className="w-full max-w-md h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hero content configured yet. Click Edit to add content.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Concierge Settings</h2>
            {!editingSettings && (
              <button
                onClick={() => setEditingSettings(true)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Settings
              </button>
            )}
          </div>

          {editingSettings ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={settingsForm.contactPhone || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Response Time</label>
                  <input
                    type="text"
                    value={settingsForm.responseTime || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, responseTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., Within 2 hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Response</label>
                  <input
                    type="text"
                    value={settingsForm.emergencyResponse || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, emergencyResponse: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., 24/7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    value={settingsForm.currency || 'USD'}
                    onChange={e => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="LKR">LKR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Booking Notice (days)</label>
                  <input
                    type="number"
                    value={settingsForm.minBookingNotice || 0}
                    onChange={e => setSettingsForm({ ...settingsForm, minBookingNotice: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Policy</label>
                <textarea
                  value={settingsForm.cancellationPolicy || ''}
                  onChange={e => setSettingsForm({ ...settingsForm, cancellationPolicy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setEditingSettings(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              {settings ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Phone className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Phone</p>
                      <p className="font-medium">{settings.contactPhone || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Mail className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Email</p>
                      <p className="font-medium">{settings.contactEmail || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">WhatsApp</p>
                      <p className="font-medium">{settings.whatsappNumber || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Response Time</p>
                      <p className="font-medium">{settings.responseTime || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Emergency Response</p>
                      <p className="font-medium">{settings.emergencyResponse || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Currency</p>
                      <p className="font-medium">{settings.currency || 'USD'}</p>
                    </div>
                  </div>
                  {settings.cancellationPolicy && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Cancellation Policy</p>
                      <p className="text-gray-700">{settings.cancellationPolicy}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No settings configured yet. Click Edit to add settings.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConciergeManager;
