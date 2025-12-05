import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Settings,
  Ban,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import driverAvailabilityService, {
  DayAvailability,
  AvailabilityStatus,
  AvailabilitySettings,
  TimeSlot,
  BlockedPeriod
} from '@/services/driverAvailabilityService';

interface DriverAvailabilityCalendarProps {
  driverId: string;
  isEditable?: boolean;
  onDateSelect?: (date: string, availability: DayAvailability) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const StatusBadge: React.FC<{ status: AvailabilityStatus }> = ({ status }) => {
  const styles: Record<AvailabilityStatus, string> = {
    available: 'bg-green-500',
    booked: 'bg-blue-500',
    unavailable: 'bg-gray-400',
    tentative: 'bg-yellow-500'
  };

  return <span className={`w-2 h-2 rounded-full ${styles[status]}`} />;
};

export const DriverAvailabilityCalendar: React.FC<DriverAvailabilityCalendarProps> = ({
  driverId,
  isEditable = false,
  onDateSelect
}) => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendar, setCalendar] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayAvailability | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AvailabilitySettings | null>(null);
  const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    loadCalendar();
  }, [driverId, year, month]);

  const loadCalendar = async () => {
    setLoading(true);
    try {
      const [calendarData, settingsData, blocksData] = await Promise.all([
        driverAvailabilityService.getMonthCalendar(driverId, year, month),
        driverAvailabilityService.getSettings(driverId),
        driverAvailabilityService.getBlockedPeriods(driverId)
      ]);
      setCalendar(calendarData);
      setSettings(settingsData);
      setBlockedPeriods(blocksData);
    } catch (error) {
      console.error('Error loading calendar:', error);
      toast({
        title: 'Error',
        description: 'Failed to load availability calendar',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const handleDateClick = (day: DayAvailability) => {
    if (onDateSelect) {
      onDateSelect(day.date, day);
    }
    setSelectedDate(day.date);
    setSelectedDay(day);
  };

  const handleSlotChange = async (date: string, slot: TimeSlot, status: AvailabilityStatus) => {
    try {
      await driverAvailabilityService.setAvailability(driverId, date, {
        [slot]: status
      });
      await loadCalendar();
      toast({ title: 'Updated', description: 'Availability updated successfully' });
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to update availability',
        variant: 'destructive'
      });
    }
  };

  const handleFullDayChange = async (date: string, status: AvailabilityStatus) => {
    try {
      await driverAvailabilityService.setFullDayAvailability(driverId, date, status);
      await loadCalendar();
      toast({ title: 'Updated', description: 'Availability updated successfully' });
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to update availability',
        variant: 'destructive'
      });
    }
  };

  // Generate calendar grid
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendarGrid: (DayAvailability | null)[] = [];

  // Fill in empty cells before first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarGrid.push(null);
  }

  // Fill in days
  calendar.forEach((day) => {
    calendarGrid.push(day);
  });

  // Fill remaining cells
  while (calendarGrid.length % 7 !== 0) {
    calendarGrid.push(null);
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Availability
            </CardTitle>
            {isEditable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h3 className="font-semibold">
              {MONTHS[month - 1]} {year}
            </h3>
            <Button variant="ghost" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1">
              <StatusBadge status="available" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <StatusBadge status="booked" />
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-1">
              <StatusBadge status="unavailable" />
              <span>Unavailable</span>
            </div>
            <div className="flex items-center gap-1">
              <StatusBadge status="tentative" />
              <span>Partial</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-muted-foreground py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarGrid.map((day, index) => (
                  <div key={index}>
                    {day ? (
                      <button
                        onClick={() => handleDateClick(day)}
                        disabled={day.date < today}
                        className={`
                          w-full aspect-square rounded-lg p-1 text-sm
                          flex flex-col items-center justify-center gap-0.5
                          transition-colors relative
                          ${day.date === today ? 'ring-2 ring-primary' : ''}
                          ${day.date === selectedDate ? 'bg-primary/10' : ''}
                          ${day.date < today ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted cursor-pointer'}
                          ${day.is_blocked ? 'bg-red-50' : ''}
                        `}
                      >
                        <span className={day.date === today ? 'font-bold' : ''}>
                          {parseInt(day.date.split('-')[2])}
                        </span>
                        <StatusBadge status={day.status} />
                        {day.is_blocked && (
                          <Ban className="w-3 h-3 text-red-400 absolute top-0.5 right-0.5" />
                        )}
                      </button>
                    ) : (
                      <div className="w-full aspect-square" />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {isEditable && selectedDay && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {new Date(selectedDay.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={selectedDay.status === 'available' ? 'default' : 'outline'}
                  onClick={() => handleFullDayChange(selectedDay.date, 'available')}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Available All Day
                </Button>
                <Button
                  size="sm"
                  variant={selectedDay.status === 'unavailable' ? 'destructive' : 'outline'}
                  onClick={() => handleFullDayChange(selectedDay.date, 'unavailable')}
                >
                  <X className="w-4 h-4 mr-1" />
                  Mark Unavailable
                </Button>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Time Slots</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['morning', 'afternoon', 'evening'] as const).map((slot) => (
                    <div
                      key={slot}
                      className={`
                        p-3 rounded-lg border text-center cursor-pointer transition-colors
                        ${selectedDay.slots[slot] === 'available' ? 'bg-green-50 border-green-200' : ''}
                        ${selectedDay.slots[slot] === 'booked' ? 'bg-blue-50 border-blue-200' : ''}
                        ${selectedDay.slots[slot] === 'unavailable' ? 'bg-gray-50 border-gray-200' : ''}
                      `}
                      onClick={() => {
                        const newStatus = selectedDay.slots[slot] === 'available'
                          ? 'unavailable'
                          : 'available';
                        handleSlotChange(selectedDay.date, slot, newStatus);
                      }}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1" />
                      <p className="text-xs font-medium capitalize">{slot}</p>
                      <p className="text-xs text-muted-foreground">
                        {slot === 'morning' && '6AM - 12PM'}
                        {slot === 'afternoon' && '12PM - 6PM'}
                        {slot === 'evening' && '6PM - 10PM'}
                      </p>
                      <StatusBadge status={selectedDay.slots[slot]} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Dialog */}
      {isEditable && settings && (
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Availability Settings</DialogTitle>
            </DialogHeader>
            <AvailabilitySettingsForm
              settings={settings}
              driverId={driverId}
              onSave={async (newSettings) => {
                await driverAvailabilityService.saveSettings(driverId, newSettings);
                setSettings({ ...settings, ...newSettings });
                setShowSettings(false);
                loadCalendar();
                toast({ title: 'Settings saved' });
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Blocked Periods */}
      {isEditable && blockedPeriods.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Ban className="w-4 h-4" />
              Blocked Periods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {blockedPeriods.map((block) => (
                <div
                  key={block.id}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded"
                >
                  <div>
                    <p className="text-sm font-medium capitalize">{block.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(block.start_date).toLocaleDateString()} -{' '}
                      {new Date(block.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      await driverAvailabilityService.removeBlockedPeriod(block.id!);
                      loadCalendar();
                      toast({ title: 'Block removed' });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Settings Form Component
const AvailabilitySettingsForm: React.FC<{
  settings: AvailabilitySettings;
  driverId: string;
  onSave: (settings: Partial<AvailabilitySettings>) => Promise<void>;
}> = ({ settings, onSave }) => {
  const [workingDays, setWorkingDays] = useState(settings.working_days);
  const [defaultAvail, setDefaultAvail] = useState(settings.default_availability);
  const [advanceBooking, setAdvanceBooking] = useState(settings.advance_booking_days);
  const [minNotice, setMinNotice] = useState(settings.minimum_notice_hours);
  const [autoConfirm, setAutoConfirm] = useState(settings.auto_confirm);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      working_days: workingDays,
      default_availability: defaultAvail,
      advance_booking_days: advanceBooking,
      minimum_notice_hours: minNotice,
      auto_confirm: autoConfirm
    });
    setSaving(false);
  };

  const toggleDay = (day: number) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="space-y-4">
      {/* Working Days */}
      <div className="space-y-2">
        <Label>Working Days</Label>
        <div className="flex gap-1">
          {DAYS.map((day, index) => (
            <Button
              key={day}
              type="button"
              size="sm"
              variant={workingDays.includes(index) ? 'default' : 'outline'}
              className="w-10"
              onClick={() => toggleDay(index)}
            >
              {day.charAt(0)}
            </Button>
          ))}
        </div>
      </div>

      {/* Default Availability */}
      <div className="space-y-2">
        <Label>Default Availability</Label>
        <Select value={defaultAvail} onValueChange={(v) => setDefaultAvail(v as any)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advance Booking */}
      <div className="space-y-2">
        <Label>Advance Booking (days)</Label>
        <Input
          type="number"
          min={1}
          max={365}
          value={advanceBooking}
          onChange={(e) => setAdvanceBooking(parseInt(e.target.value))}
        />
        <p className="text-xs text-muted-foreground">
          How far in advance customers can book
        </p>
      </div>

      {/* Minimum Notice */}
      <div className="space-y-2">
        <Label>Minimum Notice (hours)</Label>
        <Input
          type="number"
          min={1}
          max={168}
          value={minNotice}
          onChange={(e) => setMinNotice(parseInt(e.target.value))}
        />
        <p className="text-xs text-muted-foreground">
          Minimum hours before trip to accept booking
        </p>
      </div>

      {/* Auto Confirm */}
      <div className="flex items-center justify-between">
        <div>
          <Label>Auto-confirm bookings</Label>
          <p className="text-xs text-muted-foreground">
            Automatically accept booking requests
          </p>
        </div>
        <Switch checked={autoConfirm} onCheckedChange={setAutoConfirm} />
      </div>

      <Button className="w-full" onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Save Settings
      </Button>
    </div>
  );
};

export default DriverAvailabilityCalendar;
