
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
  TrendingUp,
  Globe,
  ChevronLeft,
  ChevronRight,
  Pin,
  Clock,
  X,
  Menu,
  BookOpen,
  Share2,
  Bus,
  Shield
} from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  section?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSectionChange,
  isMobileMenuOpen = false,
  onMobileMenuClose
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<string[]>([]);
  const [recentItems, setRecentItems] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const q = query(collection(db, 'destinations'), orderBy('name'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          slug: doc.data().slug,
        }));
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations for sidebar:', error);
      }
    };

    fetchDestinations();
  }, []);

  // Close mobile menu when section changes
  const handleSectionChange = (section: string, path?: string) => {
    if (path) {
      window.location.href = `/admin${path}`;
    } else {
      onSectionChange(section);
    }
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  // Load pinned items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin-pinned-items');
    if (saved) {
      setPinnedItems(JSON.parse(saved));
    }
    const savedRecent = localStorage.getItem('admin-recent-items');
    if (savedRecent) {
      setRecentItems(JSON.parse(savedRecent));
    }
  }, []);

  // Save pinned items to localStorage
  useEffect(() => {
    localStorage.setItem('admin-pinned-items', JSON.stringify(pinnedItems));
  }, [pinnedItems]);

  // Update recent items when section changes
  useEffect(() => {
    if (activeSection && !recentItems.includes(activeSection)) {
      const updated = [activeSection, ...recentItems.slice(0, 4)];
      setRecentItems(updated);
      localStorage.setItem('admin-recent-items', JSON.stringify(updated));
    }
  }, [activeSection]);

  const togglePin = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
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
        ...destinations.map(dest => ({
          id: `destination-${dest.slug}`,
          label: dest.name,
          icon: MapPin,
          section: `/destinations?destination=${dest.slug}`
        })),
        { id: 'luxury-experiences', label: 'Luxury Experiences', icon: Sparkles },
        { id: 'travel-packages', label: 'Travel Packages', icon: Sparkles },
        { id: 'testimonials', label: 'Testimonials', icon: MessageCircle },
        { id: 'about-section', label: 'About Section', icon: Info },
        { id: 'about-sri-lanka', label: 'About Sri Lanka', icon: Globe },
        { id: 'travel-guide', label: 'Travel Guide', icon: BookOpen },
        { id: 'why-choose-us', label: 'Why Choose Us', icon: CheckCircle },
        { id: 'homepage-stats', label: 'Homepage Stats', icon: TrendingUp },
      ]
    },
    {
      title: 'Blog System',
      items: [
        { id: 'blog-manager', label: 'Blog Manager', icon: Edit },
        { id: 'ai-content-generator', label: 'AI Generator', icon: Sparkles },
      ]
    },
    {
      title: 'Content',
      items: [
        { id: 'content-dashboard', label: 'Content Dashboard', icon: FileText },
        { id: 'pages', label: 'Pages', icon: FileText },
        { id: 'posts', label: 'Legacy Posts', icon: FileText },
        { id: 'media', label: 'Media Library', icon: Camera },
        { id: 'social-media', label: 'Social Media', icon: Share2 },
        { id: 'trip-builder', label: 'Trip Builder', icon: Map },
      ]
    },
    {
      title: 'Services',
      items: [
        { id: 'hotels', label: 'Hotels & Lodges', icon: Hotel },
        { id: 'tours', label: 'Tours & Packages', icon: MapPin },
        { id: 'activities', label: 'Activities', icon: Zap },
        { id: 'drivers', label: 'Drivers', icon: Car },
        { id: 'driver-verification', label: 'Driver Verification', icon: Shield },
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'group-transport-bookings', label: 'Group Transport Bookings', icon: Bus },
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

  // Get all menu items for pinned/recent sections
  const allMenuItems = menuSections.flatMap(section => section.items);
  const pinnedMenuItems = allMenuItems.filter(item => pinnedItems.includes(item.id));
  const recentMenuItems = allMenuItems.filter(item => recentItems.includes(item.id));

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={onMobileMenuClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        ${isCollapsed ? 'w-20' : 'w-64'}
        bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600
        shadow-2xl border-r border-white/10 overflow-y-auto h-screen
        transition-all duration-300 ease-in-out relative
        lg:relative
        ${isMobileMenuOpen ? 'fixed z-50 left-0 top-0' : 'fixed -left-64 lg:left-0 z-50 lg:z-auto'}
      `}>
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 z-50 w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 border-2 border-white"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3 text-white" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-white" />
          )}
        </button>

        <div className="p-6 sticky top-0 bg-gradient-to-br from-indigo-600/95 via-purple-600/95 to-pink-600/95 backdrop-blur-md border-b border-white/10 z-10">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">Recharge</h2>
                  <p className="text-xs text-purple-200 font-medium">Travels Admin</p>
                </div>
                {/* Mobile Close Button */}
                {isMobileMenuOpen && (
                  <button
                    onClick={onMobileMenuClose}
                    className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 shadow-inner">
                <p className="text-xs font-bold text-white uppercase tracking-widest text-center">Control Panel</p>
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">⚡</span>
              </div>
            </div>
          )}
        </div>

        <nav className="px-4 pb-6">
          {/* Pinned Items Section */}
          {!isCollapsed && pinnedMenuItems.length > 0 && (
            <div className="mt-6">
              <h3 className="px-4 text-xs font-bold text-white/80 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Pin className="w-3 h-3" />
                Pinned
              </h3>
              <ul className="space-y-1.5">
                {pinnedMenuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleSectionChange(item.id)}
                        className={`w-full flex items-center px-4 py-3 text-left text-sm rounded-xl transition-all duration-300 transform group relative ${activeSection === item.id
                          ? 'bg-gradient-to-r from-white to-purple-50 text-indigo-700 font-semibold shadow-lg scale-105 border border-white/20'
                          : 'text-white hover:bg-white/15 hover:backdrop-blur-sm hover:scale-102 hover:shadow-md border border-transparent'
                          }`}
                      >
                        <div className={`p-1.5 rounded-lg mr-3 flex-shrink-0 transition-all duration-300 ${activeSection === item.id
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md'
                          : 'bg-white/10 text-white group-hover:bg-white/20 group-hover:scale-110'
                          }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="truncate flex-1">{item.label}</span>
                        <button
                          onClick={(e) => togglePin(item.id, e)}
                          className="ml-2 p-1 rounded hover:bg-white/20 transition-colors"
                        >
                          <Pin className="w-3 h-3 fill-current" />
                        </button>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Recent Items Section */}
          {!isCollapsed && recentMenuItems.length > 0 && (
            <div className="mt-6">
              <h3 className="px-4 text-xs font-bold text-white/80 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Recent
              </h3>
              <ul className="space-y-1.5">
                {recentMenuItems.slice(0, 3).map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleSectionChange(item.id)}
                        className={`w-full flex items-center px-4 py-3 text-left text-sm rounded-xl transition-all duration-300 transform group ${activeSection === item.id
                          ? 'bg-gradient-to-r from-white to-purple-50 text-indigo-700 font-semibold shadow-lg scale-105 border border-white/20'
                          : 'text-white hover:bg-white/15 hover:backdrop-blur-sm hover:scale-102 hover:shadow-md border border-transparent'
                          }`}
                      >
                        <div className={`p-1.5 rounded-lg mr-3 flex-shrink-0 transition-all duration-300 ${activeSection === item.id
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md'
                          : 'bg-white/10 text-white group-hover:bg-white/20 group-hover:scale-110'
                          }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* All Menu Sections */}
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mt-6">
              {/* Section Title */}
              {!isCollapsed && (
                <h3 className="px-4 text-xs font-bold text-white/80 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="h-0.5 w-4 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"></div>
                  {section.title}
                </h3>
              )}

              {/* Section Items */}
              <ul className="space-y-1.5">
                {section.items.map((item) => {
                  const IconComponent = item.icon;
                  const isPinned = pinnedItems.includes(item.id);
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleSectionChange(item.id, item.section)}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-left text-sm rounded-xl transition-all duration-300 transform group relative ${activeSection === item.id
                          ? 'bg-gradient-to-r from-white to-purple-50 text-indigo-700 font-semibold shadow-lg scale-105 border border-white/20'
                          : 'text-white hover:bg-white/15 hover:backdrop-blur-sm hover:scale-102 hover:shadow-md border border-transparent'
                          }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isCollapsed ? '' : 'mr-3'} flex-shrink-0 transition-all duration-300 ${activeSection === item.id
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md'
                          : 'bg-white/10 text-white group-hover:bg-white/20 group-hover:scale-110'
                          }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        {!isCollapsed && (
                          <>
                            <span className="truncate flex-1">{item.label}</span>
                            <button
                              onClick={(e) => togglePin(item.id, e)}
                              className={`ml-2 p-1 rounded hover:bg-white/20 transition-colors ${isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}
                            >
                              <Pin className={`w-3 h-3 ${isPinned ? 'fill-current' : ''}`} />
                            </button>
                          </>
                        )}
                        {activeSection === item.id && !isCollapsed && (
                          <div className="ml-2 w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg animate-pulse"></div>
                        )}
                        {activeSection === item.id && isCollapsed && (
                          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full shadow-lg"></div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
