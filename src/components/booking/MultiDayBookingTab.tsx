
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MultiDayBookingData } from '@/types/booking';

const MultiDayBookingTab = () => {
  const [multiDayData, setMultiDayData] = useState<MultiDayBookingData>({
    destinations: '',
    startDate: '',
    endDate: '',
    passengers: '2',
    accommodation: 'standard'
  });

  const handleMultiDaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Multi-day tour booking:', multiDayData);
    toast.success('Multi-day tour request sent!');
  };

  return (
    <form onSubmit={handleMultiDaySubmit} className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-medium">Tour Destinations</label>
        <Textarea
          placeholder="List your preferred destinations (e.g., Kandy, Ella, Galle)"
          value={multiDayData.destinations}
          onChange={(e) => setMultiDayData({...multiDayData, destinations: e.target.value})}
          className="text-sm h-16"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Input
            type="date"
            value={multiDayData.startDate}
            onChange={(e) => setMultiDayData({...multiDayData, startDate: e.target.value})}
            className="text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">End Date</label>
          <Input
            type="date"
            value={multiDayData.endDate}
            onChange={(e) => setMultiDayData({...multiDayData, endDate: e.target.value})}
            className="text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Travelers</label>
          <select 
            value={multiDayData.passengers}
            onChange={(e) => setMultiDayData({...multiDayData, passengers: e.target.value})}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-deep"
          >
            {[1,2,3,4,5,6,7,8].map(num => (
              <option key={num} value={num.toString()}>{num} traveler{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Accommodation</label>
          <select 
            value={multiDayData.accommodation}
            onChange={(e) => setMultiDayData({...multiDayData, accommodation: e.target.value})}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-deep"
          >
            <option value="budget">Budget</option>
            <option value="standard">Standard</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full bg-ocean-deep hover:bg-ocean-deep/90 text-white font-medium">
        Plan Multi-Day Tour
      </Button>
    </form>
  );
};

export default MultiDayBookingTab;
