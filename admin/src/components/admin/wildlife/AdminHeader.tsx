
import React from 'react';

interface AdminHeaderProps {
  activeSection: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ activeSection }) => {
  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      lodges: 'Lodges & Hotels',
      activities: 'Wildlife Activities',
      transport: 'Transport Options',
      cultural: 'Cultural Experiences',
      bookings: 'Bookings',
      users: 'Users',
      settings: 'Settings',
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
          <span className="text-gray-600">Welcome, Admin</span>
          <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
