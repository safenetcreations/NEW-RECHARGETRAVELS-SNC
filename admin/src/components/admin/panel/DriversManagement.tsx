import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import DriverFormDialog from './DriverFormDialog';
import { firebaseDriverService, Driver } from '../../../services/firebaseDriverService';

interface DriversManagementProps {
  className?: string;
}

const DriversManagement: React.FC<DriversManagementProps> = ({ className }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  useEffect(() => {
    loadDrivers();
  }, []);

  useEffect(() => {
    let filtered = drivers;

    if (searchTerm) {
      filtered = filtered.filter(
        driver =>
          driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDrivers(filtered);
  }, [drivers, searchTerm]);

  const loadDrivers = async () => {
    setIsLoading(true);
    try {
      const data = await firebaseDriverService.getAllDrivers();
      setDrivers(data);
      setFilteredDrivers(data);
      toast.success(`Loaded ${data.length} drivers successfully`);
    } catch (error) {
      console.error('Error loading drivers:', error);
      toast.error('Failed to load drivers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedDriver(null);
    setIsFormOpen(true);
  };

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsFormOpen(true);
  };

  const handleDelete = async (driverId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await firebaseDriverService.deleteDriver(driverId);
      toast.success('Driver deleted successfully');
      loadDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Failed to delete driver');
    }
  };

  const handleFormSubmit = async (driverData: Partial<Driver>) => {
    try {
      if (selectedDriver) {
        await firebaseDriverService.updateDriver(selectedDriver.id, driverData);
        toast.success('Driver updated successfully');
      } else {
        await firebaseDriverService.createDriver(driverData as Omit<Driver, 'id' | 'createdAt'>);
        toast.success('Driver created successfully');
      }
      setIsFormOpen(false);
      loadDrivers();
    } catch (error) {
      console.error('Error saving driver:', error);
      toast.error('Failed to save driver');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="mb-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Drivers Management
              </CardTitle>
              <p className="text-gray-600">
                Manage all drivers
              </p>
            </div>
            <Button
              onClick={handleCreate}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Driver
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-6 shadow-md">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search drivers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <Card
            key={driver.id}
            className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group"
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {driver.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{driver.email}</p>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(driver)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(driver.id, driver.name)}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <Card className="shadow-md">
          <CardContent className="py-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Drivers Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your filters'
                : 'Get started by creating your first driver'}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Driver
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <DriverFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        driver={selectedDriver}
      />
    </div>
  );
};

export default DriversManagement;
