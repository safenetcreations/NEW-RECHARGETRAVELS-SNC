import React from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AyurvedaHeaderProps {
  activeSection: string;
}

const sectionTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  hero: 'Hero Section',
  philosophy: 'Philosophy Section',
  retreats: 'Manage Retreats',
  treatments: 'Manage Treatments',
  testimonials: 'Manage Testimonials',
  cta: 'Call-to-Action Section',
  settings: 'Site Settings'
};

const AyurvedaHeader: React.FC<AyurvedaHeaderProps> = ({ activeSection }) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-emerald-100">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-emerald-900">
            {sectionTitles[activeSection] || 'Ayurveda & Wellness'}
          </h1>
          <p className="text-sm text-emerald-600/70 mt-0.5">
            Manage your Ayurveda & Wellness experience content
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/experiences/ayurveda', '_blank')}
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Live Site
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AyurvedaHeader;
