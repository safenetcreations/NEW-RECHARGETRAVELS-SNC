
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { DayTourBookingData } from '@/types/booking';

const DayTourBookingTab = () => {
  const [dayTourData, setDayTourData] = useState<DayTourBookingData>({
    destination: '',
    date: '',
    passengers: '2',
    preferences: ''
  });

  const handleDayTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Day tour booking:', dayTourData);
    toast.success('Day tour request sent!');
  };

  return (
    <form onSubmit={handleDayTourSubmit} className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-medium">Preferred Destination</label>
        <select 
          value={dayTourData.destination}
          onChange={(e) => setDayTourData({...dayTourData, destination: e.target.value})}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jungle-green"
        >
          <option value="">Select destination</option>
          <option value="sigiriya">Sigiriya Rock Fortress</option>
          <option value="kandy">Kandy Cultural Tour</option>
          <option value="ella">Ella Hill Country</option>
          <option value="galle">Galle Fort & Beaches</option>
          <option value="yala">Yala Safari</option>
          <option value="pinnawala">Pinnawala Elephant Orphanage</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tour Date</label>
          <Input
            type="date"
            value={dayTourData.date}
            onChange={(e) => setDayTourData({...dayTourData, date: e.target.value})}
            className="text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Travelers</label>
          <select 
            value={dayTourData.passengers}
            onChange={(e) => setDayTourData({...dayTourData, passengers: e.target.value})}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jungle-green"
          >
            {[1,2,3,4,5,6,7,8].map(num => (
              <option key={num} value={num.toString()}>{num} traveler{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Special Preferences</label>
        <Textarea
          placeholder="Any specific interests or requirements?"
          value={dayTourData.preferences}
          onChange={(e) => setDayTourData({...dayTourData, preferences: e.target.value})}
          className="text-sm h-16"
        />
      </div>

      <Button type="submit" className="w-full bg-jungle-green hover:bg-jungle-green/90 text-white font-medium">
        Book Day Tour
      </Button>
    </form>
  );
};

export default DayTourBookingTab;
