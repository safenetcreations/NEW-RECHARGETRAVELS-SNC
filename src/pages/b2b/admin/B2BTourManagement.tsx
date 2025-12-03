import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  Clock,
  Users,
  DollarSign,
  Loader2,
  X,
  Save
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Tour {
  id: string;
  tourName: string;
  category: string;
  description: string;
  priceUSD: number;
  duration: string;
  maxCapacity: number;
  isActive: boolean;
  images: string[];
  createdAt: any;
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'beach', label: 'Beach' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'honeymoon', label: 'Honeymoon' }
];

const B2BTourManagement = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [formData, setFormData] = useState({
    tourName: '',
    category: 'cultural',
    description: '',
    priceUSD: 0,
    duration: '',
    maxCapacity: 20,
    isActive: true,
    images: ['']
  });

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('/api/b2b/admin/tours', {
          headers: {
            'Authorization': `Bearer ${await user?.getIdToken()}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setTours(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch tours:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && isAdmin) {
      fetchTours();
    }
  }, [user, isAdmin]);

  const handleToggleActive = async (tourId: string, currentStatus: boolean) => {
    setActionLoading(tourId);
    try {
      const response = await fetch(`/api/b2b/admin/tours/${tourId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        setTours(tours.map(t => 
          t.id === tourId ? { ...t, isActive: !currentStatus } : t
        ));
      }
    } catch (error) {
      console.error('Failed to toggle tour status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (tourId: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;
    
    setActionLoading(tourId);
    try {
      const response = await fetch(`/api/b2b/admin/tours/${tourId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await user?.getIdToken()}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setTours(tours.filter(t => t.id !== tourId));
      }
    } catch (error) {
      console.error('Failed to delete tour:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('form');
    
    try {
      const url = editingTour 
        ? `/api/b2b/admin/tours/${editingTour.id}`
        : '/api/b2b/admin/tours';
      
      const response = await fetch(url, {
        method: editingTour ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        if (editingTour) {
          setTours(tours.map(t => t.id === editingTour.id ? { ...t, ...formData } : t));
        } else {
          setTours([...tours, { id: data.tourId, ...formData, createdAt: new Date() }]);
        }
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save tour:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const resetForm = () => {
    setFormData({
      tourName: '',
      category: 'cultural',
      description: '',
      priceUSD: 0,
      duration: '',
      maxCapacity: 20,
      isActive: true,
      images: ['']
    });
    setEditingTour(null);
  };

  const openEditModal = (tour: Tour) => {
    setEditingTour(tour);
    setFormData({
      tourName: tour.tourName,
      category: tour.category,
      description: tour.description,
      priceUSD: tour.priceUSD,
      duration: tour.duration,
      maxCapacity: tour.maxCapacity,
      isActive: tour.isActive,
      images: tour.images || ['']
    });
    setShowModal(true);
  };

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const filteredTours = tours.filter(tour =>
    (tour.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     tour.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!categoryFilter || tour.category === categoryFilter)
  );

  return (
    <>
      <Helmet>
        <title>Tour Management | B2B Admin | Recharge Travels</title>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50/30 to-teal-50/30 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <Link
                to="/admin/b2b"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Tour Management</h1>
              <p className="text-slate-600">Create, edit, and manage B2B tour packages</p>
            </div>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 mt-4 md:mt-0"
            >
              <Plus className="w-5 h-5" />
              Add New Tour
            </button>
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
                  placeholder="Search tours..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tours Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : filteredTours.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <div
                  key={tour.id}
                  className={`bg-white rounded-2xl shadow-lg border overflow-hidden transition-all ${
                    tour.isActive ? 'border-slate-200/50' : 'border-red-200 opacity-75'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-40 bg-gradient-to-br from-emerald-400 to-teal-500">
                    {tour.images?.[0] && (
                      <img src={tour.images[0]} alt={tour.tourName} className="w-full h-full object-cover" />
                    )}
                    {!tour.isActive && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Inactive
                        </span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-black/50 text-white px-2 py-1 rounded-lg text-xs capitalize">
                      {tour.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{tour.tourName}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">{tour.description}</p>

                    <div className="grid grid-cols-3 gap-2 text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${tour.priceUSD}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {tour.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Max {tour.maxCapacity}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => openEditModal(tour)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(tour.id, tour.isActive)}
                        disabled={actionLoading === tour.id}
                        className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm ${
                          tour.isActive 
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        {tour.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {tour.isActive ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={() => handleDelete(tour.id)}
                        disabled={actionLoading === tour.id}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No tours found</h3>
              <p className="text-slate-500 mb-4">Create your first B2B tour package</p>
              <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg"
              >
                <Plus className="w-5 h-5" />
                Add Tour
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingTour ? 'Edit Tour' : 'Add New Tour'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tour Name *</label>
                <input
                  type="text"
                  required
                  value={formData.tourName}
                  onChange={(e) => setFormData({ ...formData, tourName: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.priceUSD}
                    onChange={(e) => setFormData({ ...formData, priceUSD: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 2 Days"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.images[0]}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-emerald-500 border-slate-300 rounded"
                />
                <span className="text-sm text-slate-700">Active (visible to agencies)</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'form'}
                  className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading === 'form' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {editingTour ? 'Update Tour' : 'Create Tour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default B2BTourManagement;
