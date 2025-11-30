
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Shield,
  CreditCard,
  Percent,
  Wallet,
  Waves,
  TreePine,
  Wind,
  Flame,
  Leaf,
  Navigation,
  Mountain,
  Droplets,
  Crown,
  UserCheck,
  Train
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
  path?: string; // Direct URL path for routing
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

  // Close mobile menu when section changes - now uses proper routing
  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  // Get the path for a menu item
  const getItemPath = (item: MenuItem): string => {
    return item.path || `/${item.id}`;
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
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
      ]
    },
    {
      title: 'Landing Page CMS',
      items: [
        { id: 'hero-section', label: 'Hero Section', icon: Layers, path: '/hero-section' },
        { id: 'featured-destinations', label: 'Featured Destinations', icon: Compass, path: '/featured-destinations' },
        ...destinations.map(dest => ({
          id: `destination-${dest.slug}`,
          label: dest.name,
          icon: MapPin,
          path: `/destinations?destination=${dest.slug}`
        })),
        { id: 'luxury-experiences', label: 'Luxury Experiences', icon: Sparkles, path: '/luxury-experiences' },
        { id: 'travel-packages', label: 'Travel Packages', icon: Sparkles, path: '/travel-packages' },
        { id: 'testimonials', label: 'Testimonials', icon: MessageCircle, path: '/testimonials' },
        { id: 'about-section', label: 'About Section', icon: Info, path: '/about-section' },
        { id: 'about-sri-lanka', label: 'About Sri Lanka', icon: Globe, path: '/about-sri-lanka' },
        { id: 'travel-guide', label: 'Travel Guide', icon: BookOpen, path: '/travel-guide' },
        { id: 'book-now', label: 'Book Now Page', icon: BookOpen, path: '/book-now' },
        { id: 'whale-booking', label: 'Whale Booking Page', icon: Waves, path: '/whale-booking' },
        { id: 'hot-air-balloon', label: 'Hot Air Balloon', icon: Navigation, path: '/hot-air-balloon' },
        { id: 'jungle-camping', label: 'Jungle Camping', icon: Flame, path: '/jungle-camping' },
        { id: 'kalpitiya-kitesurfing', label: 'Kalpitiya Kitesurfing', icon: Wind, path: '/kalpitiya-kitesurfing' },
        { id: 'private-charters', label: 'Private Charters', icon: Crown, path: '/private-charters' },
        { id: 'ramayana', label: 'Ramayana Trail', icon: BookOpen, path: '/ramayana' },
        { id: 'cooking-class', label: 'Cooking Class', icon: Flame, path: '/cooking-class' },
        { id: 'sea-cucumber-farming', label: 'Sea Cucumber Farming', icon: Droplets, path: '/sea-cucumber-farming' },
        { id: 'ayurveda-wellness', label: 'Ayurveda & Wellness', icon: Leaf, path: '/ayurveda-wellness' },
        { id: 'tea-trails', label: 'Tea Trails', icon: Leaf, path: '/tea-trails' },
        { id: 'pilgrimage-tours', label: 'Pilgrimage Tours', icon: Mountain, path: '/pilgrimage-tours' },
        { id: 'private-tours', label: 'Private Tours', icon: Car, path: '/private-tours' },
        { id: 'group-transport', label: 'Group Transport', icon: Bus, path: '/group-transport' },
        { id: 'train-booking', label: 'Train Booking', icon: Train, path: '/train-booking' },
        { id: 'why-choose-us', label: 'Why Choose Us', icon: CheckCircle, path: '/why-choose-us' },
        { id: 'homepage-stats', label: 'Homepage Stats', icon: TrendingUp, path: '/homepage-stats' },
      ]
    },
    {
      title: 'Blog System',
      items: [
        { id: 'blog-manager', label: 'Blog Manager', icon: Edit, path: '/blog-manager' },
        { id: 'ai-content-generator', label: 'AI Generator', icon: Sparkles, path: '/ai-content-generator' },
      ]
    },
    {
      title: 'Content',
      items: [
        { id: 'content-dashboard', label: 'Content Dashboard', icon: FileText, path: '/content-dashboard' },
        { id: 'pages', label: 'Pages', icon: FileText, path: '/pages' },
        { id: 'posts', label: 'Legacy Posts', icon: FileText, path: '/posts' },
        { id: 'media', label: 'Media Library', icon: Camera, path: '/media' },
        { id: 'social-media', label: 'Social Media', icon: Share2, path: '/social-media' },
        { id: 'trip-builder', label: 'Trip Builder', icon: Map, path: '/trip-builder' },
      ]
    },
    {
      title: 'Services',
      items: [
        { id: 'global-tours', label: 'Global Tours', icon: Globe, path: '/global-tours' },
        { id: 'global-tour-bookings', label: 'Tour Bookings', icon: Calendar, path: '/global-tour-bookings' },
        { id: 'hotels', label: 'Hotels & Lodges', icon: Hotel, path: '/hotels' },
        { id: 'tours', label: 'Tours & Packages', icon: MapPin, path: '/tours' },
        { id: 'nationalparks', label: 'National Parks', icon: TreePine, path: '/nationalparks' },
        { id: 'cultural-tours', label: 'Cultural Tours', icon: Mountain, path: '/cultural-tours' },
        { id: 'activities', label: 'Activities', icon: Zap, path: '/activities' },
        { id: 'drivers', label: 'Drivers', icon: Car, path: '/drivers' },
        { id: 'driver-verification', label: 'Driver Verification', icon: Shield, path: '/driver-verification' },
        { id: 'vendor-approvals', label: 'Vendor Approvals', icon: CheckCircle, path: '/vendor-approvals' },
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/bookings' },
        { id: 'group-transport-bookings', label: 'Group Transport Bookings', icon: Bus, path: '/group-transport-bookings' },
        { id: 'customers', label: 'Customer CRM', icon: UserCheck, path: '/customers' },
        { id: 'reviews', label: 'Reviews', icon: Star, path: '/reviews' },
        { id: 'users', label: 'User Management', icon: Users, path: '/users' },
      ]
    },
    {
      title: 'Finance',
      items: [
        { id: 'driver-analytics', label: 'Driver Analytics', icon: BarChart3, path: '/driver-analytics' },
        { id: 'commission-settings', label: 'Commission Settings', icon: Percent, path: '/commission-settings' },
        { id: 'payment-settlements', label: 'Payment Settlements', icon: CreditCard, path: '/payment-settlements' },
        { id: 'driver-wallets', label: 'Driver Wallets', icon: Wallet, path: '/driver-wallets' },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'email-templates', label: 'Email Templates', icon: Mail, path: '/email-templates' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
        { id: 'ai-test', label: 'AI Test', icon: Sparkles, path: '/ai-test' },
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
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300 overflow-hidden p-1">
                  <img src="/logo.png" alt="Recharge Travels" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">Recharge</h2>
                  <p className="text-xs text-purple-200 font-medium">Travels Admin</p>
                </div>
                {/* Mobile Close Button */}
                {isMobileMenuOpen && (
                  <button
                    onClick={onMobileMenuClose}
                    aria-label="Close navigation drawer"
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
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1">
                <img src="/logo.png" alt="Recharge" className="w-full h-full object-contain" />
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
                  const itemPath = getItemPath(item);
                  return (
                    <li key={item.id}>
                      <Link
                        to={itemPath}
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
                          aria-label={pinnedItems.includes(item.id) ? `Unpin ${item.label}` : `Pin ${item.label}`}
                          className="ml-2 p-1 rounded hover:bg-white/20 transition-colors"
                        >
                          <Pin className="w-3 h-3 fill-current" />
                        </button>
                      </Link>
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
                  const itemPath = getItemPath(item);
                  return (
                    <li key={item.id}>
                      <Link
                        to={itemPath}
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
                      </Link>
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
                  const itemPath = getItemPath(item);
                  return (
                    <li key={item.id}>
                      <Link
                        to={itemPath}
                        onClick={() => handleSectionChange(item.id)}
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
                              aria-label={isPinned ? `Unpin ${item.label}` : `Pin ${item.label}`}
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
                      </Link>
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
