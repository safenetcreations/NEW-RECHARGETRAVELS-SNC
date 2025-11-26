
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import TransportBookingTab from './booking/TransportBookingTab';
import DayTourBookingTab from './booking/DayTourBookingTab';
import MultiDayBookingTab from './booking/MultiDayBookingTab';
import { BookingWidgetProps } from '@/types/booking';

const TabbedBookingWidget = ({ onLocationsChange }: BookingWidgetProps) => {
  return (
    <Card className="w-full max-w-md border-2 border-jungle-green/20 shadow-xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-wild-orange to-jungle-green text-white">
        <CardTitle className="text-xl font-chakra font-bold flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Plan Your Adventure
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="transport" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="transport" className="text-xs">Transport</TabsTrigger>
            <TabsTrigger value="day-tour" className="text-xs">Day Tour</TabsTrigger>
            <TabsTrigger value="multi-day" className="text-xs">Multi-Day</TabsTrigger>
          </TabsList>

          <TabsContent value="transport">
            <TransportBookingTab onLocationsChange={onLocationsChange} />
          </TabsContent>

          <TabsContent value="day-tour">
            <DayTourBookingTab />
          </TabsContent>

          <TabsContent value="multi-day">
            <MultiDayBookingTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TabbedBookingWidget;
