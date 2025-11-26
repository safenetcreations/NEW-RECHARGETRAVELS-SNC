
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Minus } from 'lucide-react';

interface PackageDetailsStepProps {
  packageData: {
    name: string;
    startDate: Date;
    endDate: Date;
    participants: number;
  };
  onUpdatePackageData: (updates: Partial<any>) => void;
}

const PackageDetailsStep: React.FC<PackageDetailsStepProps> = ({ 
  packageData, 
  onUpdatePackageData 
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Package Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="packageName">Package Name</Label>
          <Input
            id="packageName"
            value={packageData.name}
            onChange={(e) => onUpdatePackageData({ name: e.target.value })}
            placeholder="My Amazing Safari"
          />
        </div>
        <div>
          <Label htmlFor="participants">Number of Participants</Label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdatePackageData({ 
                participants: Math.max(1, packageData.participants - 1) 
              })}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              id="participants"
              value={packageData.participants}
              readOnly
              className="text-center w-20"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdatePackageData({ 
                participants: packageData.participants + 1 
              })}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Start Date</Label>
          <Calendar
            mode="single"
            selected={packageData.startDate}
            onSelect={(date) => date && onUpdatePackageData({ startDate: date })}
            className="rounded-md border"
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Calendar
            mode="single"
            selected={packageData.endDate}
            onSelect={(date) => date && onUpdatePackageData({ endDate: date })}
            className="rounded-md border"
          />
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsStep;
