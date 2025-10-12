
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  getLodges, 
  getWildlifeActivities,
  createSafariPackage 
} from '@/services/wildlifeService';
import StepNavigation from '@/components/safari/builder/StepNavigation';
import PackageDetailsStep from '@/components/safari/builder/PackageDetailsStep';
import LodgeSelectionStep from '@/components/safari/builder/LodgeSelectionStep';
import ActivitySelectionStep from '@/components/safari/builder/ActivitySelectionStep';
import ReviewStep from '@/components/safari/builder/ReviewStep';
import StepButtons from '@/components/safari/builder/StepButtons';

const SafariPackageBuilder: React.FC = () => {
  const [step, setStep] = useState(1);
  const [packageData, setPackageData] = useState({
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    participants: 2,
    selectedLodges: [],
    selectedActivities: [],
    specialRequests: ''
  });
  const [lodges, setLodges] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lodgesResult, activitiesResult] = await Promise.all([
        getLodges(),
        getWildlifeActivities()
      ]);

      setLodges(lodgesResult.data || []);
      setActivities(activitiesResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const updatePackageData = (updates: Partial<typeof packageData>) => {
    setPackageData(prev => ({ ...prev, ...updates }));
  };

  const toggleLodge = (lodge: any) => {
    const isSelected = packageData.selectedLodges.some(l => l.id === lodge.id);
    if (isSelected) {
      updatePackageData({
        selectedLodges: packageData.selectedLodges.filter(l => l.id !== lodge.id)
      });
    } else {
      updatePackageData({
        selectedLodges: [...packageData.selectedLodges, { ...lodge, nights: 2 }]
      });
    }
  };

  const toggleActivity = (activity: any) => {
    const isSelected = packageData.selectedActivities.some(a => a.id === activity.id);
    if (isSelected) {
      updatePackageData({
        selectedActivities: packageData.selectedActivities.filter(a => a.id !== activity.id)
      });
    } else {
      updatePackageData({
        selectedActivities: [...packageData.selectedActivities, activity]
      });
    }
  };

  const calculateTotal = () => {
    const lodgeTotal = packageData.selectedLodges.reduce((sum, lodge) => 
      sum + (lodge.price_per_night * lodge.nights), 0);
    const activityTotal = packageData.selectedActivities.reduce((sum, activity) => 
      sum + (activity.price_per_person * packageData.participants), 0);
    return lodgeTotal + activityTotal;
  };

  const handleSavePackage = async () => {
    setLoading(true);
    try {
      const total = calculateTotal();
      const taxes = total * 0.1;
      
      const { error } = await createSafariPackage({
        name: packageData.name || 'My Safari Package',
        start_date: packageData.startDate.toISOString().split('T')[0],
        end_date: packageData.endDate.toISOString().split('T')[0],
        total_participants: packageData.participants,
        package_data: {
          lodges: packageData.selectedLodges,
          activities: packageData.selectedActivities,
          special_requests: packageData.specialRequests
        },
        subtotal: total,
        taxes: taxes,
        total_amount: total + taxes
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Package Saved!",
        description: "Your safari package has been saved successfully.",
      });

      setStep(1);
      setPackageData({
        name: '',
        startDate: new Date(),
        endDate: new Date(),
        participants: 2,
        selectedLodges: [],
        selectedActivities: [],
        specialRequests: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save package. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <PackageDetailsStep 
            packageData={packageData}
            onUpdatePackageData={updatePackageData}
          />
        );
      case 2:
        return (
          <LodgeSelectionStep 
            lodges={lodges}
            selectedLodges={packageData.selectedLodges}
            onToggleLodge={toggleLodge}
          />
        );
      case 3:
        return (
          <ActivitySelectionStep 
            activities={activities}
            selectedActivities={packageData.selectedActivities}
            onToggleActivity={toggleActivity}
          />
        );
      case 4:
        return (
          <ReviewStep 
            packageData={packageData}
            selectedLodges={packageData.selectedLodges}
            selectedActivities={packageData.selectedActivities}
            totalPrice={calculateTotal()}
            onUpdateSpecialRequests={(requests) => updatePackageData({ specialRequests: requests })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Safari Package Builder | Recharge Travels</title>
        <meta name="description" content="Build your custom Sri Lankan safari package with our interactive package builder." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <StepNavigation currentStep={step} totalSteps={4} />

          <Card className="max-w-6xl mx-auto">
            <CardContent className="p-8">
              {renderStepContent()}
            </CardContent>
          </Card>

          <StepButtons
            currentStep={step}
            totalSteps={4}
            loading={loading}
            onPrevious={() => setStep(Math.max(1, step - 1))}
            onNext={() => setStep(Math.min(4, step + 1))}
            onSave={handleSavePackage}
          />
        </div>
      </div>
    </>
  );
};

export default SafariPackageBuilder;
