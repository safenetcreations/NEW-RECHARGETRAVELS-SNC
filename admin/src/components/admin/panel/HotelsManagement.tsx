import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import HotelFormDialog from './HotelFormDialog';
import { firebaseHotelService, Hotel } from '../../../services/firebaseHotelService';

interface HotelsManagementProps {
  className?: string;
}

const HotelsManagement: React.FC<HotelsManagementProps> = ({ className }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    let filtered = hotels;

    if (searchTerm) {
      filtered = filtered.filter(
        hotel =>
          hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHotels(filtered);
  }, [hotels, searchTerm]);

  const loadHotels = async () => {
    setIsLoading(true);
    try {
      const data = await firebaseHotelService.getAllHotels();
      setHotels(data);
      setFilteredHotels(data);
      toast.success(`Loaded ${data.length} hotels successfully`);
    } catch (error) {
      console.error('Error loading hotels:', error);
      toast.error('Failed to load hotels');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedHotel(null);
    setIsFormOpen(true);
  };

  const handleEdit = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsFormOpen(true);
  };

  const handleDelete = async (hotelId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await firebaseHotelService.deleteHotel(hotelId);
      toast.success('Hotel deleted successfully');
      loadHotels();
    } catch (error) {
      console.error('Error deleting hotel:', error);
      toast.error('Failed to delete hotel');
    }
  };

  const handleFormSubmit = async (hotelData: Partial<Hotel>) => {
    try {
      if (selectedHotel) {
        await firebaseHotelService.updateHotel(selectedHotel.id, hotelData);
        toast.success('Hotel updated successfully');
      } else {
        await firebaseHotelService.createHotel(hotelData as Omit<Hotel, 'id' | 'created_at' | 'updated_at'>);
        toast.success('Hotel created successfully');
      }
      setIsFormOpen(false);
      loadHotels();
    } catch (error) {
      console.error('Error saving hotel:', error);
      toast.error('Failed to save hotel');
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
                Hotels Management
              </CardTitle>
              <p className="text-gray-600">
                Manage all hotel listings, bookings, and reviews
              </p>
            </div>
            <Button
              onClick={handleCreate}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Hotel
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
              placeholder="Search hotels by name, description, destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <Card
            key={hotel.id}
            className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group"
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {hotel.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(hotel)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(hotel.id, hotel.name)}
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

      {filteredHotels.length === 0 && (
        <Card className="shadow-md">
          <CardContent className="py-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Hotels Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your filters'
                : 'Get started by creating your first hotel'}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Hotel
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <HotelFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        hotel={selectedHotel}
      />
    </div>
  );
};

export default HotelsManagement;
