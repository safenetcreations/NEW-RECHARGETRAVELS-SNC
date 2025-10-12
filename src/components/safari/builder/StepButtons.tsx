
import React from 'react';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

interface StepButtonsProps {
  currentStep: number;
  totalSteps: number;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
}

const StepButtons: React.FC<StepButtonsProps> = ({
  currentStep,
  totalSteps,
  loading,
  onPrevious,
  onNext,
  onSave
}) => {
  return (
    <div className="flex justify-between items-center mt-8 max-w-6xl mx-auto">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
      >
        Previous
      </Button>
      
      <div className="flex space-x-4">
        {currentStep < totalSteps ? (
          <Button
            onClick={onNext}
            className="bg-green-600 hover:bg-green-700"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={onSave}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Saving...' : 'Save Package'}
            <Package className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepButtons;
