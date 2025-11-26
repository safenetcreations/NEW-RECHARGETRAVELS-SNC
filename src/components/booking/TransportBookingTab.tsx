
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car, Calendar, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { TransportBookingData } from '@/types/booking';

interface TransportBookingTabProps {
  onLocationsChange?: (locations: { pickup: string; dropoff: string }) => void;
}

const TransportBookingTab = ({ onLocationsChange }: TransportBookingTabProps) => {
  const [transportData, setTransportData] = useState<TransportBookingData>({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    passengers: '2'
  });

  const handleTransportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Transport booking:', transportData);
    toast.success('Transport booking request sent!');
    onLocationsChange?.({ pickup: transportData.pickup, dropoff: transportData.dropoff });
  };

  return (
    <form onSubmit={handleTransportSubmit} className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center">
          <Car className="h-4 w-4 mr-1" />
          Pickup Location
        </label>
        <Input
          placeholder="Enter pickup location"
          value={transportData.pickup}
          onChange={(e) => setTransportData({...transportData, pickup: e.target.value})}
          className="text-sm"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Drop-off Location</label>
        <Input
          placeholder="Enter drop-off location"
          value={transportData.dropoff}
          onChange={(e) => setTransportData({...transportData, dropoff: e.target.value})}
          className="text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Date
          </label>
          <Input
            type="date"
            value={transportData.date}
            onChange={(e) => setTransportData({...transportData, date: e.target.value})}
            className="text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Time
          </label>
          <Input
            type="time"
            value={transportData.time}
            onChange={(e) => setTransportData({...transportData, time: e.target.value})}
            className="text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center">
          <Users className="h-4 w-4 mr-1" />
          Passengers
        </label>
        <select 
          value={transportData.passengers}
          onChange={(e) => setTransportData({...transportData, passengers: e.target.value})}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wild-orange"
        >
          {[1,2,3,4,5,6,7,8].map(num => (
            <option key={num} value={num.toString()}>{num} passenger{num > 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full bg-wild-orange hover:bg-wild-orange/90 text-white font-medium">
        Book Transport
      </Button>
    </form>
  );
};

export default TransportBookingTab;
