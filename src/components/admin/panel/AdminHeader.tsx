
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Search, User } from 'lucide-react';

interface AdminHeaderProps {
  activeSection: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ activeSection }) => {
  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard Overview',
      hotels: 'Hotels & Lodges Management',
      tours: 'Tours & Packages Management',
      activities: 'Activities Management',
      drivers: 'Drivers Management',
      bookings: 'Bookings Management',
      reviews: 'Reviews Management',
      users: 'User Management',
      content: 'Content Management',
      images: 'Image Gallery Management',
      analytics: 'Analytics & Reports',
      locations: 'Locations Management',
      media: 'Media Library',
      settings: 'System Settings',
    };
    return titles[section] || 'Dashboard';
  };

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {getSectionTitle(activeSection)}
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-gray-700 font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
