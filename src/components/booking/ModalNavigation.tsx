
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ModalNavigationProps {
  step: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  isSubmitting: boolean;
}

const ModalNavigation = ({ step, totalSteps, onPrevStep, onNextStep, isSubmitting }: ModalNavigationProps) => {
  return (
    <div className="flex gap-4 pt-6 border-t">
      {step > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevStep}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
      )}
      
      <div className="flex-1" />
      
      {step < totalSteps ? (
        <Button
          type="button"
          onClick={onNextStep}
          className="bg-teal-green hover:bg-green-600 text-white flex items-center gap-2"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="submit"
          className="bg-sunset-orange hover:bg-yellow-500 text-white btn-ripple"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
        </Button>
      )}
    </div>
  );
};

export default ModalNavigation;
