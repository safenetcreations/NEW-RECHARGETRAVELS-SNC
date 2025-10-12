import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, Star, Clock, Tag, Users } from 'lucide-react';
import { getDocs, collection, query, orderBy, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseService';
import TravelPackageForm from './TravelPackageForm';

interface TravelPackage {
  id: string;
  name: string;
  duration: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  rating: number;
  reviews: number;
  destinations: string[];
  highlights: string[];
  bestFor: string;
  is_active: boolean;
  created_at: string;
}

const TravelPackagesSection: React.FC = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TravelPackage | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'travel_packages'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as TravelPackage[];
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async (packageData: Omit<TravelPackage, 'id' | 'created_at'>) => {
    try {
      await addDoc(collection(db, 'travel_packages'), { ...packageData, created_at: new Date().toISOString() });
      toast.success('Package created successfully');
      fetchPackages();
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating package:', error);
      toast.error('Failed to create package');
    }
  };

  const handleUpdatePackage = async (id: string, updates: Partial<TravelPackage>) => {
    try {
      await updateDoc(doc(db, 'travel_packages', id), updates);
      toast.success('Package updated successfully');
      fetchPackages();
      setEditingPackage(null);
    } catch (error) {
      console.error('Error updating package:', error);
      toast.error('Failed to update package');
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    
    try {
      await deleteDoc(doc(db, 'travel_packages', id));
      toast.success('Package deleted successfully');
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = (pkg.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showCreateForm || editingPackage ? (
        <TravelPackageForm
          travelPackage={editingPackage}
          onSubmit={editingPackage ? (data) => handleUpdatePackage(editingPackage.id, data) : handleCreatePackage}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingPackage(null);
          }}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Travel Packages</h2>
              <p className="text-gray-600">Manage best value deals and travel packages</p>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Package
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search packages..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Packages List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="relative h-40 w-full mb-4">
                    <img src={pkg.image} alt={pkg.name} className="rounded-t-lg object-cover w-full h-full"/>
                    <Badge className="absolute top-2 right-2 bg-red-500">{pkg.discount}</Badge>
                  </div>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {pkg.name}
                    </CardTitle>
                    <Badge variant={pkg.is_active ? "default" : "secondary"}>
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Star className="w-4 h-4 mr-2" />
                    {pkg.rating} ({pkg.reviews} reviews)
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Users className="w-4 h-4 mr-2" />
                    {pkg.bestFor}
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-bold">{pkg.price}</span>
                    <span className="text-sm line-through">{pkg.originalPrice}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingPackage(pkg)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletePackage(pkg.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPackages.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">No packages found.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default TravelPackagesSection;
