/**
 * Booking Calendar View Component
 * Visual calendar for managing vehicle bookings
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Car,
  User,
  Clock,
  MapPin,
  DollarSign,
  Eye,
  MessageSquare,
  Check,
  X,
  Filter,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { generateWhatsAppShareLink } from '@/services/vehicleRentalWhatsAppService';

// Types
interface Vehicle {
  id: string;
  make: string;
  model: string;
  registrationNumber: string;
  vehicleType: string;
}

interface Booking {
  id: string;
  vehicleId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  pickupLocation: string;
  returnLocation: string;
  bookingReference: string;
}

interface BookingCalendarViewProps {
  vehicles: Vehicle[];
  bookings: Booking[];
  onBookingClick?: (booking: Booking) => void;
  onApprove?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
  onViewDetails?: (bookingId: string) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  in_progress: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  completed: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
};

const BookingCalendarView: React.FC<BookingCalendarViewProps> = ({
  vehicles,
  bookings,
  onBookingClick,
  onApprove,
  onReject,
  onViewDetails
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      if (selectedVehicle !== 'all' && booking.vehicleId !== selectedVehicle) return false;
      if (selectedStatus !== 'all' && booking.status !== selectedStatus) return false;
      return true;
    });
  }, [bookings, selectedVehicle, selectedStatus]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (Date | null)[] = [];

    // Add empty days for previous month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [year, month]);

  // Get bookings for a specific day
  const getBookingsForDay = (date: Date): Booking[] => {
    return filteredBookings.filter(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      const checkDate = new Date(date);
      checkDate.setHours(12, 0, 0, 0);
      return checkDate >= start && checkDate <= end;
    });
  };

  // Navigation
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Handle booking click
  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
    onBookingClick?.(booking);
  };

  // Get vehicle info
  const getVehicle = (vehicleId: string): Vehicle | undefined => {
    return vehicles.find(v => v.id === vehicleId);
  };

  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Booking Calendar
            </CardTitle>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Vehicles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  {vehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goToPrevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>

            <h2 className="text-xl font-semibold">
              {MONTHS[month]} {year}
            </h2>

            <div className="flex items-center gap-2">
              {/* Legend */}
              <div className="hidden md:flex items-center gap-3 text-xs">
                {Object.entries(STATUS_COLORS).map(([status, colors]) => (
                  <div key={status} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded ${colors.bg} ${colors.border} border`} />
                    <span className="capitalize">{status.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="border rounded-lg overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b">
              {DAYS.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="min-h-[100px] bg-gray-50 border-b border-r" />;
                }

                const dayBookings = getBookingsForDay(day);
                const isToday = day.toDateString() === today.toDateString();
                const isPast = day < today;

                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-[100px] border-b border-r p-1 ${
                      isToday ? 'bg-blue-50' : isPast ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    {/* Day Number */}
                    <div className={`text-right mb-1 ${
                      isToday
                        ? 'text-blue-600 font-bold'
                        : isPast
                          ? 'text-gray-400'
                          : 'text-gray-700'
                    }`}>
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        isToday ? 'bg-blue-600 text-white' : ''
                      }`}>
                        {day.getDate()}
                      </span>
                    </div>

                    {/* Bookings */}
                    <div className="space-y-1">
                      {dayBookings.slice(0, 3).map(booking => {
                        const vehicle = getVehicle(booking.vehicleId);
                        const colors = STATUS_COLORS[booking.status] || STATUS_COLORS.pending;

                        return (
                          <TooltipProvider key={booking.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleBookingClick(booking)}
                                  className={`w-full text-left px-1.5 py-0.5 rounded text-xs truncate ${colors.bg} ${colors.text} ${colors.border} border hover:opacity-80 transition-opacity`}
                                >
                                  {vehicle ? `${vehicle.make} ${vehicle.model}` : booking.bookingReference}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <div className="space-y-1">
                                  <p className="font-medium">{booking.bookingReference}</p>
                                  <p className="text-xs">Customer: {booking.customerName}</p>
                                  <p className="text-xs">
                                    {formatDate(new Date(booking.startDate))} - {formatDate(new Date(booking.endDate))}
                                  </p>
                                  <p className="text-xs">Total: ${booking.totalAmount.toFixed(2)}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                      {dayBookings.length > 3 && (
                        <button
                          className="w-full text-xs text-gray-500 hover:text-gray-700 text-center"
                          onClick={() => {
                            // Could show a modal with all bookings for this day
                          }}
                        >
                          +{dayBookings.length - 3} more
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <Badge className={`${STATUS_COLORS[selectedBooking.status].bg} ${STATUS_COLORS[selectedBooking.status].text}`}>
                  {selectedBooking.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-500">{selectedBooking.bookingReference}</span>
              </div>

              {/* Vehicle Info */}
              {(() => {
                const vehicle = getVehicle(selectedBooking.vehicleId);
                return vehicle ? (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                      <p className="text-sm text-gray-500">{vehicle.registrationNumber}</p>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Customer Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{selectedBooking.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>
                    {formatDate(new Date(selectedBooking.startDate))} - {formatDate(new Date(selectedBooking.endDate))}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{selectedBooking.pickupLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>${selectedBooking.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {selectedBooking.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => {
                        onApprove?.(selectedBooking.id);
                        setShowBookingModal(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        onReject?.(selectedBooking.id);
                        setShowBookingModal(false);
                      }}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails?.(selectedBooking.id)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>

                {selectedBooking.customerPhone && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => {
                      const message = `Hi ${selectedBooking.customerName}, regarding your booking ${selectedBooking.bookingReference}...`;
                      window.open(generateWhatsAppShareLink(selectedBooking.customerPhone, message), '_blank');
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    WhatsApp
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-500">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </p>
            <p className="text-sm text-gray-500">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'in_progress').length}
            </p>
            <p className="text-sm text-gray-500">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-600">
              {bookings.filter(b => b.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-500">Completed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingCalendarView;
