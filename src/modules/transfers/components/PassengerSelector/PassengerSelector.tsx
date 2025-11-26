
import React from 'react';
import { Users, Package } from 'lucide-react';

interface PassengerSelectorProps {
  passengerCount: number;
  luggageCount: number;
  onPassengerChange: (count: number) => void;
  onLuggageChange: (count: number) => void;
}

export const PassengerSelector: React.FC<PassengerSelectorProps> = ({
  passengerCount,
  luggageCount,
  onPassengerChange,
  onLuggageChange
}) => {
  const Counter = ({ 
    label, 
    value, 
    onChange, 
    min = 1, 
    max = 8, 
    icon: Icon 
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5 text-gray-500" />
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -
        </button>
        
        <span className="w-8 text-center font-medium">{value}</span>
        
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Passengers & Luggage</h3>
      
      <Counter
        label="Passengers"
        value={passengerCount}
        onChange={onPassengerChange}
        min={1}
        max={8}
        icon={Users}
      />
      
      <Counter
        label="Luggage pieces"
        value={luggageCount}
        onChange={onLuggageChange}
        min={0}
        max={10}
        icon={Package}
      />
      
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p>💡 Tip: Include carry-on bags and large personal items in your luggage count for accurate vehicle selection.</p>
      </div>
    </div>
  );
};
