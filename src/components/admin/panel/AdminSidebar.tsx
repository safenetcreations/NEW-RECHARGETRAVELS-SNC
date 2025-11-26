
import React from 'react';
import {
  Home,
  FileText,
  Image,
  Hotel,
  Calendar,
  Users,
  Settings,
  BarChart3,
  Map,
  Camera,
  Car,
  MapPin,
  Star,
  Compass,
  Zap,
  Mail,
  Edit,
  Globe,
  Layout,
  Sparkles,
  Train,
  Bot
} from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'page-management', label: 'Page Management', icon: Layout },
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'about-sri-lanka', label: 'About Sri Lanka', icon: Globe },
    { id: 'custom-experience', label: 'Custom Experience', icon: Sparkles },
    { id: 'train-journeys', label: 'Train Journeys', icon: Train },
    { id: 'posts', label: 'Blog Posts', icon: Edit },
    { id: 'media', label: 'Media Library', icon: Camera },
    { id: 'hotels', label: 'Hotels & Lodges', icon: Hotel },
    { id: 'tours', label: 'Tours & Packages', icon: MapPin },
    { id: 'activities', label: 'Activities', icon: Zap },
    { id: 'drivers', label: 'Drivers', icon: Car },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'email-templates', label: 'Email Templates', icon: Mail },
    { id: 'ai-tools', label: 'AI Content Tools', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-orange-600">Admin Panel</h2>
        <p className="text-sm text-gray-600 mt-1">Recharge Travels</p>
      </div>
      
      <nav className="px-4 pb-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
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
