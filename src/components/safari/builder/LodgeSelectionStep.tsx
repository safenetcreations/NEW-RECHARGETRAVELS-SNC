
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Lodge } from '@/services/wildlifeService';

interface LodgeSelectionStepProps {
  lodges: Lodge[];
  selectedLodges: any[];
  onToggleLodge: (lodge: Lodge) => void;
}

const LodgeSelectionStep: React.FC<LodgeSelectionStepProps> = ({ 
  lodges, 
  selectedLodges, 
  onToggleLodge 
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Select Lodges</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lodges.map((lodge) => (
          <Card key={lodge.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{lodge.name}</CardTitle>
              <CardDescription>{lodge.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{lodge.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold">${lodge.price_per_night}/night</span>
                  <Button
                    size="sm"
                    onClick={() => onToggleLodge(lodge)}
                    variant={selectedLodges.some(l => l.id === lodge.id) ? "default" : "outline"}
                  >
                    {selectedLodges.some(l => l.id === lodge.id) ? "Selected" : "Select"}
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

export default LodgeSelectionStep;
