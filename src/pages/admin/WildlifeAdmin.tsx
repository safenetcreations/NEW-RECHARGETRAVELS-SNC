
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminSidebar from '@/components/admin/wildlife/AdminSidebar';
import AdminHeader from '@/components/admin/wildlife/AdminHeader';
import DashboardSection from '@/components/admin/wildlife/DashboardSection';
import LodgesSection from '@/components/admin/wildlife/LodgesSection';
import ActivitiesSection from '@/components/admin/wildlife/ActivitiesSection';
import BookingsSection from '@/components/admin/wildlife/BookingsSection';
import EnhancedAdminDashboard from '@/components/admin/enhanced/EnhancedAdminDashboard';
import RoleManagement from '@/components/admin/enhanced/RoleManagement';

const WildlifeAdmin: React.FC = () => {
  const [activeSection, setActiveSection] = useState('enhanced-dashboard');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'enhanced-dashboard':
        return <EnhancedAdminDashboard />;
      case 'role-management':
        return <RoleManagement />;
      case 'dashboard':
        return <DashboardSection />;
      case 'lodges':
        return <LodgesSection />;
      case 'activities':
        return <ActivitiesSection />;
      case 'bookings':
        return <BookingsSection />;
      default:
        return <EnhancedAdminDashboard />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Wildlife Admin Panel - Recharge Travels</title>
        <meta name="description" content="Manage wildlife lodges, activities, and bookings" />
      </Helmet>

      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="flex-1 overflow-y-auto">
          <AdminHeader activeSection={activeSection} />
          <div className="p-6">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </>
  );
};

export default WildlifeAdmin;
