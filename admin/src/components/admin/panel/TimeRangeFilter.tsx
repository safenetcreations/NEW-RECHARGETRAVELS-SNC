import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface TimeRangeFilterProps {
  value: 'today' | 'week' | 'month' | 'year';
  onChange: (value: 'today' | 'week' | 'month' | 'year') => void;
}

const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({ value, onChange }) => {
  const options = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ] as const;

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-200 rounded-xl hover:border-purple-400 transition-colors cursor-pointer group">
        <Calendar className="w-4 h-4 text-purple-600" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as any)}
          className="appearance-none bg-transparent border-none outline-none cursor-pointer text-sm font-semibold text-gray-700 pr-6"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-purple-600 absolute right-3 pointer-events-none" />
      </div>
    </div>
  );
};

export default TimeRangeFilter;
