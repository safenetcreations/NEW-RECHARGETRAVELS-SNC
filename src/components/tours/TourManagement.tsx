
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import TourPackageList from './TourPackageList';
import { Button } from '@/components/ui/button';
import { Loader2, Database } from 'lucide-react';
import { tourPackageService } from '@/services/tourPackageService';

const TourManagement: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedData = async () => {
    setIsSeeding(true);
    await tourPackageService.seedSampleData();
    setIsSeeding(false);
  };

  return (
    <>
      <Helmet>
        <title>Tour Packages - Recharge Travels</title>
        <meta name="description" content="Discover amazing tour packages in Sri Lanka" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Sri Lanka Tour Packages
              </h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Curated experiences to discover the wonder of Sri Lanka
              </p>
              
              {/* Admin button to seed data - This would be protected in production */}
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/40"
                  onClick={handleSeedData}
                  disabled={isSeeding}
                >
                  {isSeeding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Seeding Data...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Seed Sample Data
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tour Package List */}
        <TourPackageList />
      </div>
    </>
  );
};

export default TourManagement;
