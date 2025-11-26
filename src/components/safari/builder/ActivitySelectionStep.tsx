
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import type { WildlifeActivity } from '@/services/wildlifeService';

interface ActivitySelectionStepProps {
  activities: WildlifeActivity[];
  selectedActivities: any[];
  onToggleActivity: (activity: WildlifeActivity) => void;
}

const ActivitySelectionStep: React.FC<ActivitySelectionStepProps> = ({ 
  activities, 
  selectedActivities, 
  onToggleActivity 
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Select Activities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <Card key={activity.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{activity.name}</CardTitle>
              <CardDescription>{activity.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{activity.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {activity.duration}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold">${activity.price_per_person}/person</span>
                  <Button
                    size="sm"
                    onClick={() => onToggleActivity(activity)}
                    variant={selectedActivities.some(a => a.id === activity.id) ? "default" : "outline"}
                  >
                    {selectedActivities.some(a => a.id === activity.id) ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivitySelectionStep;
