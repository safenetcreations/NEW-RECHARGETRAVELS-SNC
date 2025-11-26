
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { getWildlifeActivities, type WildlifeActivity } from '@/services/wildlifeService';
import { SelectedItem } from './SafariBuilder';

interface SafariActivitiesProps {
  selectedItems: SelectedItem[];
  onAddItem: (item: SelectedItem) => void;
  onRemoveItem: (itemId: string) => void;
}

const SafariActivities: React.FC<SafariActivitiesProps> = ({ 
  selectedItems, 
  onAddItem, 
  onRemoveItem 
}) => {
  const [activities, setActivities] = useState<WildlifeActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      const { data } = await getWildlifeActivities();
      setActivities(data || []);
      setLoading(false);
    };
    
    loadActivities();
  }, []);

  const handleActivitySelection = (activity: WildlifeActivity) => {
    const itemId = `activity-${activity.id}`;
    const isSelected = selectedItems.some(item => item.id === itemId);

    if (isSelected) {
      onRemoveItem(itemId);
    } else {
      onAddItem({
        id: itemId,
        name: activity.name,
        price: activity.price_per_person,
        type: 'activity'
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading activities...</div>;
  }

  // Group activities by type
  const safariActivities = activities.filter(activity => 
    activity.activity_types?.slug === 'safari' || 
    activity.name.toLowerCase().includes('safari')
  );
  const waterActivities = activities.filter(activity => 
    activity.activity_types?.slug === 'marine' || 
    activity.name.toLowerCase().includes('whale') ||
    activity.name.toLowerCase().includes('boat')
  );

  const renderActivityGrid = (activityList: WildlifeActivity[], title: string) => (
    <div className="mb-12">
      <h3 className="font-lora text-2xl font-semibold mb-6 text-green-900">{title}</h3>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activityList.map((activity) => {
          const itemId = `activity-${activity.id}`;
          const isSelected = selectedItems.some(item => item.id === itemId);

          return (
            <Card 
              key={activity.id} 
              className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
              }`}
              onClick={() => handleActivitySelection(activity)}
            >
              <div className="relative h-48 bg-gradient-to-br from-blue-200 to-green-400 rounded-t-lg overflow-hidden">
                <Badge className="absolute top-3 right-3 bg-blue-600 text-white font-semibold">
                  ${activity.price_per_person}/person
                </Badge>
                {activity.is_featured && (
                  <Badge className="absolute top-3 left-3 bg-yellow-600 text-white">
                    Featured
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-lora text-lg font-semibold mb-2 text-green-900">
                  {activity.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{activity.location}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center text-sm text-blue-600 mb-4">
                  <Clock className="w-4 h-4 mr-1" />
                  {activity.duration}
                </div>
                
                <Button
                  className={`w-full ${
                    isSelected 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActivitySelection(activity);
                  }}
                >
                  {isSelected ? 'Selected' : 'Select Activity'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      {renderActivityGrid(safariActivities, 'Signature Safari Drives')}
      {renderActivityGrid(waterActivities, 'Water-Based Adventures')}
    </div>
  );
};

export default SafariActivities;
