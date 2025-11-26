
import { X } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface ModalHeaderProps {
  onClose: () => void;
  type: 'tour' | 'transport' | 'custom';
  itemTitle?: string;
  step: number;
  totalSteps: number;
}

const ModalHeader = ({ onClose, type, itemTitle, step, totalSteps }: ModalHeaderProps) => {
  return (
    <CardHeader className="gradient-sri-lanka text-white relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-sunset-orange transition-colors"
      >
        <X className="h-6 w-6" />
      </button>
      <CardTitle className="text-2xl font-playfair">
        {type === 'custom' ? 'Create Custom Experience' : `Book Your ${type === 'tour' ? 'Tour' : 'Transport'}`}
      </CardTitle>
      {itemTitle && (
        <p className="text-blue-100 mt-2">{itemTitle}</p>
      )}
      
      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-blue-900/30 rounded-full h-2">
          <div 
            className="bg-sunset-orange h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </CardHeader>
  );
};

export default ModalHeader;
