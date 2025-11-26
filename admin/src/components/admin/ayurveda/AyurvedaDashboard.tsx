import React, { useEffect, useState } from 'react';
import { Tent, Sparkles, MessageSquareQuote, Activity, Database, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  getAyurvedaDashboardStats,
  seedDefaultData,
  AyurvedaStats
} from '@/services/ayurveda/ayurvedaService';

const AyurvedaDashboard: React.FC = () => {
  const [stats, setStats] = useState<AyurvedaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const { data, error } = await getAyurvedaDashboardStats();
    if (error) {
      toast.error('Failed to load dashboard stats');
    } else {
      setStats(data);
    }
    setLoading(false);
  };

  const handleSeedData = async () => {
    if (!confirm('This will add default Ayurveda & Wellness data to your database. Continue?')) {
      return;
    }

    setSeeding(true);
    const { error } = await seedDefaultData();

    if (error) {
      toast.error('Failed to seed default data');
    } else {
      toast.success('Default data seeded successfully!');
      loadStats();
    }
    setSeeding(false);
  };

  const statCards = [
    {
      title: 'Total Retreats',
      value: stats?.totalRetreats || 0,
      icon: Tent,
      color: 'emerald',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Treatments',
      value: stats?.totalTreatments || 0,
      icon: Sparkles,
      color: 'amber',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Testimonials',
      value: stats?.totalTestimonials || 0,
      icon: MessageSquareQuote,
      color: 'orange',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Status',
      value: 'Active',
      icon: Activity,
      color: 'green',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-900">
            <Activity className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
              onClick={() => {
                const event = new CustomEvent('changeSection', { detail: 'retreats' });
                window.dispatchEvent(event);
              }}
            >
              <Tent className="w-5 h-5 text-emerald-600" />
              <span>Add Retreat</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
              onClick={() => {
                const event = new CustomEvent('changeSection', { detail: 'treatments' });
                window.dispatchEvent(event);
              }}
            >
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Add Treatment</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              onClick={() => {
                const event = new CustomEvent('changeSection', { detail: 'testimonials' });
                window.dispatchEvent(event);
              }}
            >
              <MessageSquareQuote className="w-5 h-5 text-orange-600" />
              <span>Add Testimonial</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
              onClick={handleSeedData}
              disabled={seeding}
            >
              <Database className="w-5 h-5 text-purple-600" />
              <span>{seeding ? 'Seeding...' : 'Initialize Data'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-emerald-50 to-amber-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900">Preview Your Changes</h3>
              <p className="text-sm text-emerald-700/70 mt-1">
                All changes you make here will be reflected on the live Ayurveda & Wellness experiences page.
                Use the "View Live Site" button in the header to preview your changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AyurvedaDashboard;
