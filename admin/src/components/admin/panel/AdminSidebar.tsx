
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
  Sparkles,
  Layers,
  MessageCircle,
  Info,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  section?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Landing Page CMS',
      items: [
        { id: 'hero-section', label: 'Hero Section', icon: Layers },
        { id: 'featured-destinations', label: 'Featured Destinations', icon: Compass },
        { id: 'travel-packages', label: 'Travel Packages', icon: Sparkles },
        { id: 'testimonials', label: 'Testimonials', icon: MessageCircle },
        { id: 'about-section', label: 'About Section', icon: Info },
        { id: 'why-choose-us', label: 'Why Choose Us', icon: CheckCircle },
        { id: 'homepage-stats', label: 'Homepage Stats', icon: TrendingUp },
      ]
    },
    {
      title: 'Content',
      items: [
        { id: 'pages', label: 'Pages', icon: FileText },
        { id: 'posts', label: 'Blog Posts', icon: Edit },
        { id: 'media', label: 'Media Library', icon: Camera },
      ]
    },
    {
      title: 'Services',
      items: [
        { id: 'hotels', label: 'Hotels & Lodges', icon: Hotel },
        { id: 'tours', label: 'Tours & Packages', icon: MapPin },
        { id: 'activities', label: 'Activities', icon: Zap },
        { id: 'experiences', label: 'Luxury Experiences', icon: Sparkles },
        { id: 'drivers', label: 'Drivers', icon: Car },
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'users', label: 'User Management', icon: Users },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'email-templates', label: 'Email Templates', icon: Mail },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'ai-test', label: 'AI Test', icon: Sparkles },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-orange-600 to-orange-700 shadow-lg border-r overflow-y-auto h-screen">
      <div className="p-6 sticky top-0 bg-gradient-to-b from-orange-600 to-orange-700 border-b border-orange-500">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
            <span className="text-2xl">⚡</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Recharge</h2>
            <p className="text-xs text-orange-100">Travels</p>
          </div>
        </div>
        <div className="bg-orange-500/30 rounded-lg px-3 py-2 backdrop-blur-sm">
          <p className="text-xs font-semibold text-white uppercase tracking-wider">Admin Panel</p>
        </div>
      </div>

      <nav className="px-4 pb-6">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mt-6">
            {/* Section Title */}
            <h3 className="px-4 text-xs font-semibold text-orange-200 uppercase tracking-wider mb-2">
              {section.title}
            </h3>

            {/* Section Items */}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onSectionChange(item.id)}
                      className={`w-full flex items-center px-4 py-2.5 text-left text-sm rounded-lg transition-all ${
                        activeSection === item.id
                          ? 'bg-white text-orange-700 font-medium shadow-md'
                          : 'text-white hover:bg-white/10 hover:backdrop-blur-sm'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
