
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Search, User, Menu } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

interface AdminHeaderProps {
  activeSection: string;
  onMobileMenuToggle?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ activeSection, onMobileMenuToggle }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const unreadCount = 3; // This would come from your state/Firebase
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
    <>
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-purple-100 px-4 sm:px-6 lg:px-8 py-4 lg:py-5 relative z-30">
        <div className="flex justify-between items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 transition-all duration-300 shadow-md"
          >
            <Menu className="w-5 h-5 text-purple-700" />
          </button>

          <div className="hidden lg:block">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {getSectionTitle(activeSection)}
            </h1>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">Manage your content with ease</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:shadow-md w-48 lg:w-64"
              />
            </div>

            {/* Mobile Search Button */}
            <button className="md:hidden p-2 sm:p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 transition-all duration-300 shadow-md">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" />
            </button>

            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 sm:p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-red-500 to-pink-500 rounded-full text-white text-xs font-bold flex items-center justify-center border-2 border-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2 lg:gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 lg:px-4 py-2 rounded-xl border-2 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                A
              </div>
              <div className="hidden md:block">
                <span className="text-gray-800 font-semibold block text-sm">Admin User</span>
                <span className="text-xs text-gray-500">Super Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
};

export default AdminHeader;
