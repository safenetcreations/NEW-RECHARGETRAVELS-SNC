import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, Star, Phone, Mail, Car, CheckCircle, XCircle } from 'lucide-react';
import { getDocs, collection, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseService';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  experience_years: number;
  languages: string[];
  rating: number;
  total_reviews: number;
  is_active: boolean;
  overall_verification_status: string;
  created_at: string;
}

const DriversSection: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const statusOptions = ['all', 'active', 'inactive', 'pending', 'verified'];

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'drivers'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Driver[];
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDriver = async (id: string) => {
    if (!confirm('Are you sure you want to delete this driver?')) return;
    
    try {
      await deleteDoc(doc(db, 'drivers', id));
      toast.success('Driver deleted successfully');
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Failed to delete driver');
    }
  };

  const toggleDriverStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'drivers', id), { is_active: !currentStatus });
      toast.success(`Driver ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchDrivers();
    } catch (error) {
      console.error('Error updating driver status:', error);
      toast.error('Failed to update driver status');
    }
  };

  const updateVerificationStatus = async (id: string, status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_update') => {
    try {
      await updateDoc(doc(db, 'drivers', id), { overall_verification_status: status });
      toast.success('Driver verification status updated successfully');
      fetchDrivers();
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast.error('Failed to update verification status');
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && driver.is_active) ||
                         (selectedStatus === 'inactive' && !driver.is_active) ||
                         (selectedStatus === 'verified' && driver.overall_verification_status === 'verified') ||
                         (selectedStatus === 'pending' && driver.overall_verification_status === 'pending');
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'verified': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Drivers Management</h2>
          <p className="text-gray-600">Manage driver profiles and verification</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Driver
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Car className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified Drivers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {drivers.filter(d => d.overall_verification_status === 'verified').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(drivers.reduce((sum, d) => sum + (d.rating || 0), 0) / drivers.length || 0).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <XCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-2xl font-bold text-gray-900">
                  {drivers.filter(d => d.overall_verification_status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search drivers..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Drivers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <Card key={driver.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">
                  {driver.name}
                </CardTitle>
                <div className="flex flex-col gap-1">
                  <Badge variant={driver.is_active ? "default" : "secondary"}>
                    {driver.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(driver.overall_verification_status)}>
                    {driver.overall_verification_status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {driver.email || 'No email'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {driver.phone || 'No phone'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Car className="w-4 h-4 mr-2" />
                  {driver.experience_years} years experience
                </div>
                {driver.rating > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                    {driver.rating.toFixed(1)} ({driver.total_reviews} reviews)
                  </div>
                )}
              </div>

              {driver.languages && driver.languages.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {driver.languages.map((lang, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleDriverStatus(driver.id, driver.is_active)}
                  >
                    {driver.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
                
                {driver.overall_verification_status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateVerificationStatus(driver.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                    >
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateVerificationStatus(driver.id, 'rejected')}
                      className="flex-1"
                    >
                      Reject
                    </Button>
                  </div>
                )}
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteDriver(driver.id)}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No drivers found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DriversSection;