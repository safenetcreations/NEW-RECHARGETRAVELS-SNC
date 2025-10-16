import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, Star, Phone, Mail, Car, CheckCircle, XCircle } from 'lucide-react';

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
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp_number: '',
    experience_years: 0,
    languages: [] as string[],
    license_number: '',
    bio: '',
    is_active: true
  });

  const statusOptions = ['all', 'active', 'inactive', 'pending', 'verified'];

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const driversCollection = collection(db, 'drivers');
      const q = query(driversCollection, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Driver[];
      setDrivers(data || []);
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
      const driverDoc = doc(db, 'drivers', id);
      await deleteDoc(driverDoc);
      toast.success('Driver deleted successfully');
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Failed to delete driver');
    }
  };

  const toggleDriverStatus = async (id: string, currentStatus: boolean) => {
    try {
      const driverDoc = doc(db, 'drivers', id);
      await updateDoc(driverDoc, { is_active: !currentStatus });
      toast.success(`Driver ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchDrivers();
    } catch (error) {
      console.error('Error updating driver status:', error);
      toast.error('Failed to update driver status');
    }
  };

  const updateVerificationStatus = async (id: string, status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_update') => {
    try {
      const driverDoc = doc(db, 'drivers', id);
      await updateDoc(driverDoc, { overall_verification_status: status });
      toast.success('Driver verification status updated successfully');
      fetchDrivers();
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast.error('Failed to update verification status');
    }
  };

  const handleCreateDriver = async () => {
    try {
      await addDoc(collection(db, 'drivers'), {
        ...formData,
        rating: 0,
        total_reviews: 0,
        overall_verification_status: 'pending',
        created_at: new Date().toISOString(),
      });
      toast.success('Driver created successfully');
      fetchDrivers();
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error creating driver:', error);
      toast.error('Failed to create driver');
    }
  };

  const handleUpdateDriver = async () => {
    if (!editingDriver) return;
    
    try {
      const driverDoc = doc(db, 'drivers', editingDriver.id);
      await updateDoc(driverDoc, formData);
      toast.success('Driver updated successfully');
      fetchDrivers();
      setShowEditDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error updating driver:', error);
      toast.error('Failed to update driver');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      whatsapp_number: '',
      experience_years: 0,
      languages: [],
      license_number: '',
      bio: '',
      is_active: true
    });
    setEditingDriver(null);
  };

  const openEditDialog = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      email: driver.email || '',
      phone: driver.phone || '',
      whatsapp_number: driver.whatsapp_number || '',
      experience_years: driver.experience_years || 0,
      languages: driver.languages || [],
      license_number: '',
      bio: '',
      is_active: driver.is_active
    });
    setShowEditDialog(true);
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
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Driver
          </Button>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
              <DialogDescription>
                Register a new driver with their details
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+94 77 123 4567"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
                    placeholder="+94 77 123 4567"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({...formData, experience_years: Number(e.target.value)})}
                    placeholder="5"
                  />
                </div>
                <div>
                  <Label htmlFor="license">License Number</Label>
                  <Input
                    id="license"
                    value={formData.license_number}
                    onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                    placeholder="DL123456"
                  />
                </div>
              </div>
              <div>
                <Label>Languages Spoken</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['English', 'Sinhala', 'Tamil', 'German', 'French', 'Italian'].map(lang => (
                    <label key={lang} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(lang)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, languages: [...formData.languages, lang]});
                          } else {
                            setFormData({...formData, languages: formData.languages.filter(l => l !== lang)});
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio / Description</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Brief description about the driver's experience and expertise"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {setShowCreateDialog(false); resetForm();}}>Cancel</Button>
              <Button onClick={handleCreateDriver} className="bg-orange-600 hover:bg-orange-700">Create Driver</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                    onClick={() => openEditDialog(driver)}
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>
              Update driver information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+94 77 123 4567"
                />
              </div>
              <div>
                <Label htmlFor="edit-whatsapp">WhatsApp Number</Label>
                <Input
                  id="edit-whatsapp"
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
                  placeholder="+94 77 123 4567"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-experience">Years of Experience</Label>
                <Input
                  id="edit-experience"
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({...formData, experience_years: Number(e.target.value)})}
                  placeholder="5"
                />
              </div>
              <div>
                <Label htmlFor="edit-license">License Number</Label>
                <Input
                  id="edit-license"
                  value={formData.license_number}
                  onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                  placeholder="DL123456"
                />
              </div>
            </div>
            <div>
              <Label>Languages Spoken</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {['English', 'Sinhala', 'Tamil', 'German', 'French', 'Italian'].map(lang => (
                  <label key={lang} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(lang)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, languages: [...formData.languages, lang]});
                        } else {
                          setFormData({...formData, languages: formData.languages.filter(l => l !== lang)});
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{lang}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="edit-bio">Bio / Description</Label>
              <Textarea
                id="edit-bio"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Brief description about the driver's experience and expertise"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-active"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-active" className="text-sm font-normal">Driver is active and available for bookings</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowEditDialog(false); resetForm();}}>Cancel</Button>
            <Button onClick={handleUpdateDriver} className="bg-orange-600 hover:bg-orange-700">Update Driver</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriversSection;