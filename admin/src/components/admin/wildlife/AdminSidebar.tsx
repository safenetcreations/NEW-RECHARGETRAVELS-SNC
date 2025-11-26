
import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Binoculars, 
  Car, 
  Landmark, 
  Calendar, 
  Users, 
  Settings,
  Shield,
  BarChart3
} from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'enhanced-dashboard', label: 'Enhanced Dashboard', icon: BarChart3 },
    { id: 'role-management', label: 'Role Management', icon: Shield },
    { id: 'dashboard', label: 'Classic Dashboard', icon: LayoutDashboard },
    { id: 'lodges', label: 'Lodges & Hotels', icon: Building2 },
    { id: 'activities', label: 'Wildlife Activities', icon: Binoculars },
    { id: 'transport', label: 'Transport Options', icon: Car },
    { id: 'cultural', label: 'Cultural Experiences', icon: Landmark },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-80 bg-gradient-to-b from-green-800 to-blue-800 text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🐆 RECHARGE ADMIN
        </h1>
      </div>

      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                    activeSection === item.id
                      ? 'bg-yellow-600 transform translate-x-1'
                      : 'hover:bg-white/10 hover:transform hover:translate-x-1'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
