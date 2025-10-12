
import React from 'react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, index) => index + 1).map((stepNumber) => (
        <div key={stepNumber} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= stepNumber
                ? 'bg-green-600 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {stepNumber}
          </div>
          {stepNumber < totalSteps && (
            <div
              className={`w-16 h-1 ${
                currentStep > stepNumber ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepNavigation;
