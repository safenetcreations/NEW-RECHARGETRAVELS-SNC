
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface TimeSliderProps {
  value: number[];
  onChange: (value: number[]) => void;
}

const TimeSlider: React.FC<TimeSliderProps> = ({ value, onChange }) => {
  return (
    <div className="relative pointer-events-auto bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg w-full max-w-sm mx-auto mb-4">
      <label className="block text-sm font-medium text-gray-700 text-center mb-2">
        1686 ᐊ⎯⎯⎯⎯ Map Era ⎯⎯⎯⎯ᐅ Today
      </label>
      <Slider
        value={value}
        onValueChange={onChange}
        max={100}
        step={1}
        className="w-full"
      />
    </div>
  );
};

export default TimeSlider;
