
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Route, Clock, Milestone } from 'lucide-react';

interface RouteInfoProps {
  distance: string;
  duration: string;
}

const RouteInfo = ({ distance, duration }: RouteInfoProps) => {
  if (!distance || !duration) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Route className="h-6 w-6 mr-3 text-blue-600"/>
            Your Itinerary Route
          </CardTitle>
          <p className="text-gray-600">Your planned route will be displayed here.</p>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-md">
            <p>Enter pickup and drop-off locations in the transport form to see a preview of your route.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
       <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Route className="h-6 w-6 mr-3 text-blue-600"/>
            Your Itinerary Route
          </CardTitle>
          <p className="text-gray-600">Here is an estimate for your requested journey.</p>
        </CardHeader>
      <CardContent>
        <div className="flex items-center justify-around p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <Milestone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="font-semibold text-lg">{distance}</p>
            <p className="text-sm text-gray-600">Distance</p>
          </div>
          <div className="border-l-2 border-blue-200 h-16"></div>
          <div className="text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="font-semibold text-lg">{duration}</p>
            <p className="text-sm text-gray-600">Est. Duration</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteInfo;
