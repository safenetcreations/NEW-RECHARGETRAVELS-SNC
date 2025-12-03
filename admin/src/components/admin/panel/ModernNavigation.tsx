import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import {
  Home, BarChart3, FileText, Image, Hotel, Calendar, Users, Settings,
  Map, Camera, Car, MapPin, Star, Compass, Zap, Mail, Edit, Sparkles,
  Layers, MessageCircle, Info, CheckCircle, TrendingUp, Globe, Menu, X,
  ChevronDown, LogOut, Bell, Search, User, Brain, Briefcase, CreditCard,
  Send, Bot, Palette, Shield, Train, Bus, Waves, Leaf, Mountain, Crown,
  TreePine, BookOpen, Share2, Percent, Wallet, UserCheck, Building2,
  LayoutDashboard, PenTool, ImagePlus, Database, Package, Heart
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: NavItem[];
}

const ModernNavigation: React.FC = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const signOut = authContext?.signOut;
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Navigation structure with mega-menu style
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      id: 'content',
      label: 'Content',
      icon: FileText,
      children: [
        { id: 'hero-section', label: 'Hero Section', icon: Layers, path: '/hero-section' },
        { id: 'featured-destinations', label: 'Destinations', icon: Compass, path: '/featured-destinations' },
        { id: 'luxury-experiences', label: 'Luxury Experiences', icon: Crown, path: '/luxury-experiences' },
        { id: 'travel-packages', label: 'Travel Packages', icon: Package, path: '/travel-packages' },
        { id: 'testimonials', label: 'Testimonials', icon: MessageCircle, path: '/testimonials' },
        { id: 'about-section', label: 'About Section', icon: Info, path: '/about-section' },
        { id: 'travel-guide', label: 'Travel Guide', icon: BookOpen, path: '/travel-guide' },
        { id: 'why-choose-us', label: 'Why Choose Us', icon: Heart, path: '/why-choose-us' },
        { id: 'homepage-stats', label: 'Homepage Stats', icon: TrendingUp, path: '/homepage-stats' },
      ]
    },
    {
      id: 'experiences',
      label: 'Experiences',
      icon: Sparkles,
      children: [
        { id: 'wild-tours', label: 'Wild Tours & Safaris', icon: Compass, path: '/wild-tours' },
        { id: 'whale-booking', label: 'Whale Watching', icon: Waves, path: '/whale-booking' },
        { id: 'hot-air-balloon', label: 'Hot Air Balloon', icon: Mountain, path: '/hot-air-balloon' },
        { id: 'jungle-camping', label: 'Jungle Camping', icon: TreePine, path: '/jungle-camping' },
        { id: 'kalpitiya-kitesurfing', label: 'Kitesurfing', icon: Waves, path: '/kalpitiya-kitesurfing' },
        { id: 'private-charters', label: 'Private Charters', icon: Crown, path: '/private-charters' },
        { id: 'ayurveda-wellness', label: 'Ayurveda & Wellness', icon: Leaf, path: '/ayurveda-wellness' },
        { id: 'tea-trails', label: 'Tea Trails', icon: Leaf, path: '/tea-trails' },
        { id: 'pilgrimage-tours', label: 'Pilgrimage Tours', icon: Mountain, path: '/pilgrimage-tours' },
        { id: 'cultural-tours', label: 'Cultural Tours', icon: Mountain, path: '/cultural-tours' },
        { id: 'nationalparks', label: 'National Parks', icon: TreePine, path: '/nationalparks' },
        { id: 'hikkaduwa-water-sports', label: 'Hikkaduwa Water Sports', icon: Waves, path: '/hikkaduwa-water-sports' },
        { id: 'island-getaways', label: 'Island Getaways', icon: Compass, path: '/island-getaways' },
        { id: 'train-journeys', label: 'Train Journeys', icon: Train, path: '/train-journeys' },
        { id: 'cooking-class', label: 'Cooking Classes', icon: Sparkles, path: '/cooking-class' },
        { id: 'custom-experience', label: 'Custom Trip Planner', icon: Compass, path: '/custom-experience' },
      ]
    },
    {
      id: 'services',
      label: 'Services',
      icon: Briefcase,
      children: [
        { id: 'global-tours', label: 'Global Tours', icon: Globe, path: '/global-tours' },
        { id: 'global-tour-bookings', label: 'Tour Bookings', icon: Calendar, path: '/global-tour-bookings' },
        { id: 'private-tours', label: 'Private Tours', icon: Car, path: '/private-tours' },
        { id: 'group-transport', label: 'Group Transport', icon: Bus, path: '/group-transport' },
        { id: 'train-booking', label: 'Train Booking', icon: Train, path: '/train-booking' },
        { id: 'hotels', label: 'Hotels & Lodges', icon: Hotel, path: '/hotels' },
        { id: 'fleet-vehicles', label: 'Fleet Vehicles', icon: Car, path: '/fleet-vehicles' },
        { id: 'activities', label: 'Activities', icon: Zap, path: '/activities' },
      ]
    },
    {
      id: 'management',
      label: 'Management',
      icon: Users,
      children: [
        { id: 'bookings', label: 'All Bookings', icon: Calendar, path: '/bookings' },
        { id: 'group-transport-bookings', label: 'Transport Bookings', icon: Bus, path: '/group-transport-bookings' },
        { id: 'customers', label: 'Customer CRM', icon: UserCheck, path: '/customers' },
        { id: 'drivers', label: 'Drivers', icon: Car, path: '/drivers' },
        { id: 'driver-verification', label: 'Driver Verification', icon: Shield, path: '/driver-verification' },
        { id: 'vendor-approvals', label: 'Vendor Approvals', icon: CheckCircle, path: '/vendor-approvals' },
        { id: 'reviews', label: 'Reviews', icon: Star, path: '/reviews' },
        { id: 'users', label: 'User Management', icon: Users, path: '/users' },
      ]
    },
    {
      id: 'b2b',
      label: 'B2B Portal',
      icon: Building2,
      children: [
        { id: 'b2b-dashboard', label: 'B2B Dashboard', icon: LayoutDashboard, path: '/b2b-dashboard' },
        { id: 'b2b-agencies', label: 'Agency Management', icon: Building2, path: '/b2b-agencies' },
        { id: 'b2b-bookings', label: 'B2B Bookings', icon: Calendar, path: '/b2b-bookings' },
        { id: 'b2b-tours', label: 'B2B Tours', icon: Globe, path: '/b2b-tours' },
        { id: 'b2b-analytics', label: 'B2B Analytics', icon: BarChart3, path: '/b2b-analytics' },
      ]
    },
    {
      id: 'ai-tools',
      label: 'AI Tools',
      icon: Brain,
      children: [
        { id: 'ai-content-generator', label: 'Content Generator', icon: PenTool, path: '/ai-content-generator' },
        { id: 'ai-image-generator', label: 'Image Generator', icon: ImagePlus, path: '/ai-image-generator' },
        { id: 'ai-seo-optimizer', label: 'SEO Optimizer', icon: TrendingUp, path: '/ai-seo-optimizer' },
        { id: 'ai-chatbot', label: 'Chatbot Manager', icon: Bot, path: '/ai-chatbot' },
        { id: 'yalu-manager', label: 'Yalu AI Assistant', icon: MessageCircle, path: '/yalu-manager' },
        { id: 'ai-test', label: 'AI Playground', icon: Sparkles, path: '/ai-test' },
      ]
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: Edit,
      children: [
        { id: 'blog-manager', label: 'Blog Manager', icon: Edit, path: '/blog-manager' },
        { id: 'posts', label: 'All Posts', icon: FileText, path: '/posts' },
        { id: 'media', label: 'Media Library', icon: Image, path: '/media' },
        { id: 'social-media', label: 'Social Media', icon: Share2, path: '/social-media' },
      ]
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: CreditCard,
      children: [
        { id: 'analytics', label: 'Revenue Analytics', icon: BarChart3, path: '/analytics' },
        { id: 'driver-analytics', label: 'Driver Analytics', icon: TrendingUp, path: '/driver-analytics' },
        { id: 'commission-settings', label: 'Commissions', icon: Percent, path: '/commission-settings' },
        { id: 'payment-settlements', label: 'Payments', icon: CreditCard, path: '/payment-settlements' },
        { id: 'driver-wallets', label: 'Driver Wallets', icon: Wallet, path: '/driver-wallets' },
      ]
    },
    {
      id: 'system',
      label: 'System',
      icon: Settings,
      children: [
        { id: 'email-templates', label: 'Email Templates', icon: Mail, path: '/email-templates' },
        { id: 'email-queue', label: 'Email Queue', icon: Send, path: '/email-queue' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
        { id: 'database', label: 'Database', icon: Database, path: '/database' },
      ]
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      if (signOut) await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;
  const isChildActive = (children: NavItem[]) => children?.some(child => isActive(child.path || ''));

  // Search functionality
  const allPages = navItems.flatMap(item => 
    item.children ? item.children : [item]
  );
  
  const filteredPages = allPages.filter(page => 
    page.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden p-1">
                <img src="/logo.png" alt="RT" className="w-full h-full object-contain" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Recharge Admin
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              {navItems.map((item) => (
                <div key={item.id} className="relative">
                  {item.children ? (
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isChildActive(item.children) || activeDropdown === item.id
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      to={item.path || '/'}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive(item.path || '')
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {item.children && activeDropdown === item.id && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          to={child.path || '/'}
                          onClick={() => setActiveDropdown(null)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                            isActive(child.path || '')
                              ? 'bg-emerald-50 text-emerald-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg ${
                            isActive(child.path || '') 
                              ? 'bg-emerald-100' 
                              : 'bg-gray-100'
                          }`}>
                            <child.icon className="w-3.5 h-3.5" />
                          </div>
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {user?.email?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {/* User Dropdown */}
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.displayName || 'Admin'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg max-h-[80vh] overflow-y-auto">
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.id}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50"
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-gray-400" />
                          <span className="font-medium">{item.label}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {activeDropdown === item.id && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              to={child.path || '/'}
                              onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); }}
                              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50"
                            >
                              <child.icon className="w-4 h-4 text-gray-400" />
                              <span>{child.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path || '/'}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                        isActive(item.path || '')
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl m-4 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages, settings, content..."
                  className="flex-1 text-lg outline-none"
                  autoFocus
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {searchQuery && (
                <div className="p-2">
                  {filteredPages.length > 0 ? (
                    filteredPages.map((page) => (
                      <Link
                        key={page.id}
                        to={page.path || '/'}
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <page.icon className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-700">{page.label}</span>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
              
              {!searchQuery && (
                <div className="p-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                    <Link
                      to="/bookings"
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Bookings</span>
                    </Link>
                    <Link
                      to="/ai-content-generator"
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">AI Generator</span>
                    </Link>
                    <Link
                      to="/analytics"
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                      <BarChart3 className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">Analytics</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">ESC</kbd> to close</span>
              <span>Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">⌘K</kbd> to open</span>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default ModernNavigation;
