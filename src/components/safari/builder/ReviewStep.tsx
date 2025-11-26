
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ReviewStepProps {
  packageData: {
    name: string;
    startDate: Date;
    endDate: Date;
    participants: number;
    specialRequests: string;
  };
  selectedLodges: any[];
  selectedActivities: any[];
  totalPrice: number;
  onUpdateSpecialRequests: (requests: string) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ 
  packageData, 
  selectedLodges, 
  selectedActivities,
  totalPrice,
  onUpdateSpecialRequests
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Review & Finalize</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Package Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Package Name</Label>
                <p className="font-medium">{packageData.name || 'My Safari Package'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <p className="font-medium">{packageData.startDate.toDateString()}</p>
                </div>
                <div>
                  <Label>End Date</Label>
                  <p className="font-medium">{packageData.endDate.toDateString()}</p>
                </div>
              </div>
              <div>
                <Label>Participants</Label>
                <p className="font-medium">{packageData.participants} people</p>
              </div>
            </CardContent>
          </Card>

          <div>
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              value={packageData.specialRequests}
              onChange={(e) => onUpdateSpecialRequests(e.target.value)}
              placeholder="Any special dietary requirements, accessibility needs, or preferences..."
              rows={4}
            />
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Selected Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Lodges ({selectedLodges.length})</h4>
                {selectedLodges.map((lodge) => (
                  <div key={lodge.id} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm">{lodge.name}</span>
                    <span className="font-medium">${lodge.price_per_night * lodge.nights}</span>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Activities ({selectedActivities.length})</h4>
                {selectedActivities.map((activity) => (
                  <div key={activity.id} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm">{activity.name}</span>
                    <span className="font-medium">${activity.price_per_person * packageData.participants}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg">${totalPrice}</span>
                </div>
                <p className="text-sm text-gray-500">*Taxes and fees will be calculated at booking</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
