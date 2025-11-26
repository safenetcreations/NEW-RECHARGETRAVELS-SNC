
import React from 'react';

interface Step {
  number: number;
  title: string;
  icon: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
  onStepClick: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
  onStepClick
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div
              className={`flex items-center cursor-pointer ${
                currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
              }`}
              onClick={() => currentStep > step.number && onStepClick(step.number)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step.number
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <span className="text-lg">{step.icon}</span>
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
