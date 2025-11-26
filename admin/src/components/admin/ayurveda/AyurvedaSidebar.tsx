import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  BookOpen,
  Tent,
  Sparkles,
  MessageSquareQuote,
  Megaphone,
  Settings,
  ArrowLeft,
  Leaf
} from 'lucide-react';

interface AyurvedaSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AyurvedaSidebar: React.FC<AyurvedaSidebarProps> = ({
  activeSection,
  onSectionChange
}) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'divider1', type: 'divider', label: 'Content Management' },
    { id: 'hero', label: 'Hero Section', icon: Image },
    { id: 'philosophy', label: 'Philosophy', icon: BookOpen },
    { id: 'retreats', label: 'Retreats', icon: Tent },
    { id: 'treatments', label: 'Treatments', icon: Sparkles },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'cta', label: 'CTA Section', icon: Megaphone },
    { id: 'divider2', type: 'divider', label: 'Settings' },
    { id: 'settings', label: 'Site Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-emerald-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="font-semibold text-amber-400 tracking-wide">AYURVEDA</h1>
            <p className="text-xs text-emerald-300/70">& Wellness Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          if (item.type === 'divider') {
            return (
              <div key={item.id} className="px-5 py-3 mt-2">
                <span className="text-xs font-medium text-emerald-400/60 uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
            );
          }

          const Icon = item.icon!;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all duration-200 border-l-4 ${
                isActive
                  ? 'bg-emerald-700/50 border-amber-400 text-white'
                  : 'border-transparent text-emerald-200/70 hover:bg-emerald-700/30 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Back Button */}
      <div className="p-4 border-t border-emerald-700/50">
        <button
          onClick={() => navigate('/panel')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-700/50 hover:bg-emerald-700 rounded-lg transition-colors text-emerald-200 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Admin</span>
        </button>
      </div>
    </aside>
  );
};

export default AyurvedaSidebar;
