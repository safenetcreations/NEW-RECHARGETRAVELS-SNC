import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Car, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  FileText,
  User,
  Calendar,
  MapPin,
  DollarSign,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Shield,
  Star,
  MoreVertical,
  ExternalLink,
  MessageSquare,
  Ban,
  Check,
  X,
  RefreshCw,
  Download,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { collection, doc, getDocs, query, where, orderBy, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface VehicleSubmission {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerVerified: boolean;
  
  // Vehicle Info
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  vehicleType: string;
  seatingCapacity: number;
  transmission: string;
  fuelType: string;
  color: string;
  
  // Pricing
  dailyRate: number;
  weeklyRate: number;
  withDriverDaily: number;
  securityDeposit: number;
  
  // Documents
  documents: {
    type: string;
    url: string;
    status: 'pending' | 'verified' | 'rejected';
    expiryDate?: Date;
  }[];
  
  // Photos
  photos: string[];
  
  // Location
  city: string;
  serviceAreas: string[];
  
  // Status
  status: 'pending_review' | 'active' | 'suspended' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  
  // Stats
  rating: number;
  reviewCount: number;
  totalBookings: number;
}

// Mock data for demo
const mockVehicles: VehicleSubmission[] = [
  {
    id: 'v1',
    ownerId: 'o1',
    ownerName: 'Nuwan Perera',
    ownerEmail: 'nuwan@email.com',
    ownerPhone: '+94 77 772 1999',
    ownerVerified: true,
    make: 'Toyota',
    model: 'Prius',
    year: 2021,
    registrationNumber: 'CAB-1234',
    vehicleType: 'sedan',
    seatingCapacity: 5,
    transmission: 'automatic',
    fuelType: 'hybrid',
    color: 'White',
    dailyRate: 45,
    weeklyRate: 280,
    withDriverDaily: 65,
    securityDeposit: 150,
    documents: [
      { type: 'registration', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400', status: 'pending' },
      { type: 'insurance', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400', status: 'pending', expiryDate: new Date('2025-12-31') },
      { type: 'roadworthiness', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400', status: 'pending' }
    ],
    photos: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400'
    ],
    city: 'Colombo',
    serviceAreas: ['Colombo', 'Gampaha', 'Kalutara'],
    status: 'pending_review',
    submittedAt: new Date('2025-11-25'),
    rating: 0,
    reviewCount: 0,
    totalBookings: 0
  },
  {
    id: 'v2',
    ownerId: 'o2',
    ownerName: 'Kasun Silva',
    ownerEmail: 'kasun@email.com',
    ownerPhone: '+94 77 987 6543',
    ownerVerified: true,
    make: 'Honda',
    model: 'Vezel',
    year: 2022,
    registrationNumber: 'KV-5678',
    vehicleType: 'suv',
    seatingCapacity: 5,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'Black',
    dailyRate: 55,
    weeklyRate: 350,
    withDriverDaily: 75,
    securityDeposit: 200,
    documents: [
      { type: 'registration', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400', status: 'verified' },
      { type: 'insurance', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400', status: 'verified', expiryDate: new Date('2025-06-15') },
      { type: 'roadworthiness', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400', status: 'pending' }
    ],
    photos: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400'
    ],
    city: 'Kandy',
    serviceAreas: ['Kandy', 'Matale', 'Nuwara Eliya'],
    status: 'pending_review',
    submittedAt: new Date('2025-11-26'),
    rating: 0,
    reviewCount: 0,
    totalBookings: 0
  },
  {
    id: 'v3',
    ownerId: 'o3',
    ownerName: 'Roshan Fernando',
    ownerEmail: 'roshan@email.com',
    ownerPhone: '+94 77 555 1234',
    ownerVerified: false,
    make: 'Suzuki',
    model: 'Wagon R',
    year: 2020,
    registrationNumber: 'WP-9012',
    vehicleType: 'hatchback',
    seatingCapacity: 5,
    transmission: 'manual',
    fuelType: 'petrol',
    color: 'Silver',
    dailyRate: 30,
    weeklyRate: 180,
    withDriverDaily: 45,
    securityDeposit: 100,
    documents: [
      { type: 'registration', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400', status: 'rejected' },
      { type: 'insurance', url: '', status: 'pending' }
    ],
    photos: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400'
    ],
    city: 'Galle',
    serviceAreas: ['Galle', 'Matara'],
    status: 'pending_review',
    submittedAt: new Date('2025-11-27'),
    rating: 0,
    reviewCount: 0,
    totalBookings: 0
  }
];

const AdminVehicleApproval: React.FC = () => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<VehicleSubmission[]>(mockVehicles);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSubmission | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('pending_review');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter vehicles
  const filteredVehicles = vehicles.filter(v => {
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = async (vehicleId: string) => {
    setProcessingId(vehicleId);
    
    try {
      // In production, update Firebase
      // await updateDoc(doc(db, 'vehicles', vehicleId), {
      //   status: 'active',
      //   reviewedAt: serverTimestamp(),
      //   reviewedBy: 'admin'
      // });

      // Update local state
      setVehicles(prev => prev.map(v => 
        v.id === vehicleId 
          ? { ...v, status: 'active' as const, reviewedAt: new Date() }
          : v
      ));

      toast({
        title: 'Vehicle Approved',
        description: 'The vehicle is now active and can receive bookings.',
      });

      setSelectedVehicle(null);
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve vehicle',
        variant: 'destructive'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedVehicle || !rejectionReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a rejection reason',
        variant: 'destructive'
      });
      return;
    }

    setProcessingId(selectedVehicle.id);

    try {
      // Update local state
      setVehicles(prev => prev.map(v => 
        v.id === selectedVehicle.id 
          ? { ...v, status: 'rejected' as const, rejectionReason, reviewedAt: new Date() }
          : v
      ));

      toast({
        title: 'Vehicle Rejected',
        description: 'The owner has been notified of the rejection.',
      });

      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedVehicle(null);
    } catch (error) {
      console.error('Rejection error:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject vehicle',
        variant: 'destructive'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleVerifyDocument = async (vehicleId: string, docIndex: number, status: 'verified' | 'rejected') => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        const newDocs = [...v.documents];
        newDocs[docIndex] = { ...newDocs[docIndex], status };
        return { ...v, documents: newDocs };
      }
      return v;
    }));

    if (selectedVehicle?.id === vehicleId) {
      setSelectedVehicle(prev => {
        if (!prev) return null;
        const newDocs = [...prev.documents];
        newDocs[docIndex] = { ...newDocs[docIndex], status };
        return { ...prev, documents: newDocs };
      });
    }

    toast({
      title: status === 'verified' ? 'Document Verified' : 'Document Rejected',
      description: `Document has been ${status}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Active</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Rejected</span>;
      case 'suspended':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">Suspended</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Pending Review</span>;
    }
  };

  const getDocStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">Verified</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700">Rejected</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-yellow-100 text-yellow-700">Pending</span>;
    }
  };

  const stats = {
    pending: vehicles.filter(v => v.status === 'pending_review').length,
    active: vehicles.filter(v => v.status === 'active').length,
    rejected: vehicles.filter(v => v.status === 'rejected').length,
    suspended: vehicles.filter(v => v.status === 'suspended').length
  };

  return (
    <>
      <Helmet>
        <title>Vehicle Approval | Admin Panel</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vehicle Approval</h1>
                <p className="text-sm text-gray-500">Review and approve vehicle listings</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setLoading(true)}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div 
              className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all ${
                filterStatus === 'pending_review' ? 'border-yellow-400 bg-yellow-50' : 'border-transparent hover:border-gray-200'
              }`}
              onClick={() => setFilterStatus('pending_review')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-sm text-gray-500">Pending Review</p>
                </div>
              </div>
            </div>

            <div 
              className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all ${
                filterStatus === 'active' ? 'border-green-400 bg-green-50' : 'border-transparent hover:border-gray-200'
              }`}
              onClick={() => setFilterStatus('active')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  <p className="text-sm text-gray-500">Active</p>
                </div>
              </div>
            </div>

            <div 
              className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all ${
                filterStatus === 'rejected' ? 'border-red-400 bg-red-50' : 'border-transparent hover:border-gray-200'
              }`}
              onClick={() => setFilterStatus('rejected')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                  <p className="text-sm text-gray-500">Rejected</p>
                </div>
              </div>
            </div>

            <div 
              className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all ${
                filterStatus === 'all' ? 'border-purple-400 bg-purple-50' : 'border-transparent hover:border-gray-200'
              }`}
              onClick={() => setFilterStatus('all')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Car className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
                  <p className="text-sm text-gray-500">Total Vehicles</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by make, model, registration, or owner name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Vehicle List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Owner</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Documents</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Pricing</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Submitted</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredVehicles.map(vehicle => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                            {vehicle.photos[0] ? (
                              <img src={vehicle.photos[0]} alt={vehicle.make} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                            <p className="text-sm text-gray-500">{vehicle.registrationNumber} • {vehicle.vehicleType}</p>
                            <p className="text-xs text-gray-400">{vehicle.seatingCapacity} seats • {vehicle.transmission} • {vehicle.fuelType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            vehicle.ownerVerified ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                            <User className={`w-4 h-4 ${vehicle.ownerVerified ? 'text-green-600' : 'text-yellow-600'}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{vehicle.ownerName}</p>
                            <p className="text-xs text-gray-500">{vehicle.ownerPhone}</p>
                            {vehicle.ownerVerified ? (
                              <span className="text-xs text-green-600 flex items-center gap-1">
                                <Shield className="w-3 h-3" /> Verified
                              </span>
                            ) : (
                              <span className="text-xs text-yellow-600 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Not Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          {vehicle.documents.slice(0, 3).map((doc, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 w-24 truncate">{doc.type}</span>
                              {getDocStatusBadge(doc.status)}
                            </div>
                          ))}
                          {vehicle.documents.length > 3 && (
                            <p className="text-xs text-gray-400">+{vehicle.documents.length - 3} more</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">${vehicle.dailyRate}/day</p>
                          <p className="text-gray-500">${vehicle.withDriverDaily}/day with driver</p>
                          <p className="text-xs text-gray-400">Deposit: ${vehicle.securityDeposit}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(vehicle.status)}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{vehicle.submittedAt.toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{vehicle.city}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedVehicle(vehicle)}
                          >
                            <Eye className="w-4 h-4 mr-1" /> Review
                          </Button>
                          {vehicle.status === 'pending_review' && (
                            <>
                              <Button 
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprove(vehicle.id)}
                                disabled={processingId === vehicle.id}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedVehicle(vehicle);
                                  setShowRejectModal(true);
                                }}
                                disabled={processingId === vehicle.id}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredVehicles.length === 0 && (
                <div className="text-center py-12">
                  <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No vehicles found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && !showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                </h2>
                <p className="text-sm text-gray-500">{selectedVehicle.registrationNumber}</p>
              </div>
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Photos */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Image className="w-5 h-5" /> Vehicle Photos
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {selectedVehicle.photos.map((photo, idx) => (
                    <a 
                      key={idx} 
                      href={photo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="aspect-video rounded-lg overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity"
                    >
                      <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Car className="w-5 h-5" /> Vehicle Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type</span>
                      <span className="font-medium capitalize">{selectedVehicle.vehicleType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Year</span>
                      <span className="font-medium">{selectedVehicle.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Seats</span>
                      <span className="font-medium">{selectedVehicle.seatingCapacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Transmission</span>
                      <span className="font-medium capitalize">{selectedVehicle.transmission}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fuel</span>
                      <span className="font-medium capitalize">{selectedVehicle.fuelType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Color</span>
                      <span className="font-medium">{selectedVehicle.color}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" /> Pricing (USD)
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Daily Rate</span>
                      <span className="font-medium">${selectedVehicle.dailyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Weekly Rate</span>
                      <span className="font-medium">${selectedVehicle.weeklyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">With Driver (Daily)</span>
                      <span className="font-medium">${selectedVehicle.withDriverDaily}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Security Deposit</span>
                      <span className="font-medium">${selectedVehicle.securityDeposit}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" /> Owner Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedVehicle.ownerVerified ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        <User className={`w-6 h-6 ${selectedVehicle.ownerVerified ? 'text-green-600' : 'text-yellow-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedVehicle.ownerName}</p>
                        <p className="text-sm text-gray-500">{selectedVehicle.ownerEmail}</p>
                        <p className="text-sm text-gray-500">{selectedVehicle.ownerPhone}</p>
                      </div>
                    </div>
                    {selectedVehicle.ownerVerified ? (
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                        <Shield className="w-4 h-4" /> Verified Owner
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Pending Verification
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Documents
                </h3>
                <div className="space-y-3">
                  {selectedVehicle.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-white border flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{doc.type}</p>
                          {doc.expiryDate && (
                            <p className="text-xs text-gray-500">
                              Expires: {doc.expiryDate.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getDocStatusBadge(doc.status)}
                        {doc.url && (
                          <a 
                            href={doc.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-200 rounded-lg"
                            title="View document"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-500" />
                          </a>
                        )}
                        {doc.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleVerifyDocument(selectedVehicle.id, idx, 'verified')}
                              className="p-2 hover:bg-green-100 rounded-lg"
                              title="Verify document"
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </button>
                            <button 
                              onClick={() => handleVerifyDocument(selectedVehicle.id, idx, 'rejected')}
                              className="p-2 hover:bg-red-100 rounded-lg"
                              title="Reject document"
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Areas */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Service Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVehicle.serviceAreas.map((area, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            {selectedVehicle.status === 'pending_review' && (
              <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedVehicle(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => setShowRejectModal(true)}
                  disabled={processingId === selectedVehicle.id}
                >
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(selectedVehicle.id)}
                  disabled={processingId === selectedVehicle.id}
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Approve Vehicle
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Vehicle</h3>
              <p className="text-sm text-gray-500 mb-4">
                Please provide a reason for rejecting this vehicle. The owner will be notified.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Reason *
                </label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Documents are unclear, vehicle photos are insufficient..."
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || processingId === selectedVehicle.id}
                >
                  {processingId === selectedVehicle.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Reject Vehicle
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminVehicleApproval;
