
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

const HotelsSection: React.FC = () => {
  const [hotels] = useState([
    { id: 1, name: 'Luxury Beach Resort', location: 'Colombo', status: 'active', bookings: 45, rating: 4.8 },
    { id: 2, name: 'Mountain View Lodge', location: 'Kandy', status: 'active', bookings: 32, rating: 4.6 },
    { id: 3, name: 'Wildlife Safari Camp', location: 'Yala', status: 'inactive', bookings: 28, rating: 4.7 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Hotels & Lodges Management</h2>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Hotel
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search hotels..." className="pl-10" />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="all">All Locations</option>
              <option value="colombo">Colombo</option>
              <option value="kandy">Kandy</option>
              <option value="yala">Yala</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hotels Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Hotels ({hotels.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Hotel Name</th>
                  <th className="text-left p-4 font-semibold">Location</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Bookings</th>
                  <th className="text-left p-4 font-semibold">Rating</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel) => (
                  <tr key={hotel.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{hotel.name}</td>
                    <td className="p-4">{hotel.location}</td>
                    <td className="p-4">
                      <Badge variant={hotel.status === 'active' ? "default" : "secondary"}>
                        {hotel.status}
                      </Badge>
                    </td>
                    <td className="p-4">{hotel.bookings}</td>
                    <td className="p-4">⭐ {hotel.rating}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelsSection;
