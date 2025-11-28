import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Car,
  Clock,
  Save,
  X,
  Check,
  AlertTriangle,
  Wrench,
  Ban,
  User,
  DollarSign,
  Edit2,
  Trash2,
  Plus,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { collection, doc, getDocs, query, where, updateDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AvailabilityStatus } from '@/types/vehicleRental';

interface DateAvailability {
  id: string;
  vehicleId: string;
  date: Date;
  status: AvailabilityStatus;
  note?: string;
  bookingId?: string;
  customPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BookingPreview {
  id: string;
  customerName: string;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'in_progress';
}

// Mock vehicle data
const mockVehicle = {
  id: 'v1',
  make: 'Toyota',
  model: 'Land Cruiser Prado',
  year: 2023,
  photo: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
  dailyRate: 85,
  registrationNumber: 'CAB-1234'
};

// Mock bookings for demo
const mockBookings: BookingPreview[] = [
  {
    id: 'bk1',
    customerName: 'John Smith',
    startDate: new Date(2024, 1, 15),
    endDate: new Date(2024, 1, 18),
    totalAmount: 340,
    status: 'confirmed'
  },
  {
    id: 'bk2',
    customerName: 'Sarah Johnson',
    startDate: new Date(2024, 1, 22),
    endDate: new Date(2024, 1, 25),
    totalAmount: 425,
    status: 'pending'
  }
];

// Generate initial availability data
const generateMockAvailability = (): DateAvailability[] => {
  const availability: DateAvailability[] = [];
  const today = new Date();
  
  // Set some maintenance days
  availability.push({
    id: 'av1',
    vehicleId: 'v1',
    date: new Date(today.getFullYear(), today.getMonth(), 10),
    status: 'maintenance',
    note: 'Scheduled service',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // Set some personal blocked days
  availability.push({
    id: 'av2',
    vehicleId: 'v1',
    date: new Date(today.getFullYear(), today.getMonth(), 28),
    status: 'personal',
    note: 'Family event',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // Add booked dates from mock bookings
  mockBookings.forEach(booking => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const current = new Date(start);
    
    while (current <= end) {
      availability.push({
        id: `bk-${booking.id}-${current.getTime()}`,
        vehicleId: 'v1',
        date: new Date(current),
        status: 'booked',
        bookingId: booking.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      current.setDate(current.getDate() + 1);
    }
  });
  
  return availability;
};

const VehicleAvailabilityCalendar: React.FC = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<DateAvailability[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<AvailabilityStatus>('available');
  const [bulkNote, setBulkNote] = useState('');
  const [customPrice, setCustomPrice] = useState<number | undefined>();
  const [bookings, setBookings] = useState<BookingPreview[]>(mockBookings);
  const [selectedDateInfo, setSelectedDateInfo] = useState<DateAvailability | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load availability data
    setAvailability(generateMockAvailability());
  }, [vehicleId]);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDates([]);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDates([]);
  };

  const getDateAvailability = (date: Date): DateAvailability | undefined => {
    return availability.find(a => 
      a.date.getDate() === date.getDate() &&
      a.date.getMonth() === date.getMonth() &&
      a.date.getFullYear() === date.getFullYear()
    );
  };

  const isDateSelected = (date: Date): boolean => {
    return selectedDates.some(d => 
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    );
  };

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const toggleDateSelection = (date: Date) => {
    if (isPastDate(date)) return;
    
    const dateInfo = getDateAvailability(date);
    
    // If clicking a booked date, show info instead of selecting
    if (dateInfo?.status === 'booked') {
      setSelectedDateInfo(dateInfo);
      return;
    }
    
    if (isDateSelected(date)) {
      setSelectedDates(prev => prev.filter(d => 
        !(d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear())
      ));
    } else {
      setSelectedDates(prev => [...prev, date]);
    }
  };

  const getStatusColor = (status: AvailabilityStatus | undefined): string => {
    switch (status) {
      case 'booked': return 'bg-blue-500 text-white';
      case 'maintenance': return 'bg-orange-500 text-white';
      case 'personal': return 'bg-purple-500 text-white';
      case 'blocked': return 'bg-red-500 text-white';
      case 'available':
      default: return 'bg-green-100 text-green-800 hover:bg-green-200';
    }
  };

  const getStatusIcon = (status: AvailabilityStatus | undefined) => {
    switch (status) {
      case 'booked': return <User className="h-3 w-3" />;
      case 'maintenance': return <Wrench className="h-3 w-3" />;
      case 'personal': return <Ban className="h-3 w-3" />;
      case 'blocked': return <X className="h-3 w-3" />;
      default: return <Check className="h-3 w-3" />;
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedDates.length === 0) {
      toast({
        title: "No Dates Selected",
        description: "Please select dates to update",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      // Remove existing availability for selected dates
      const newAvailability = availability.filter(a => 
        !selectedDates.some(d => 
          d.getDate() === a.date.getDate() &&
          d.getMonth() === a.date.getMonth() &&
          d.getFullYear() === a.date.getFullYear()
        )
      );
      
      // Add new availability entries
      if (bulkAction !== 'available') {
        selectedDates.forEach(date => {
          newAvailability.push({
            id: `av-${date.getTime()}`,
            vehicleId: vehicleId || 'v1',
            date: new Date(date),
            status: bulkAction,
            note: bulkNote || undefined,
            customPrice: customPrice,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });
      }
      
      setAvailability(newAvailability);
      setSelectedDates([]);
      setShowBulkModal(false);
      setBulkNote('');
      setCustomPrice(undefined);
      
      toast({
        title: "Availability Updated",
        description: `${selectedDates.length} dates have been updated`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetAvailable = () => {
    if (selectedDates.length === 0) return;
    
    const newAvailability = availability.filter(a => 
      !selectedDates.some(d => 
        d.getDate() === a.date.getDate() &&
        d.getMonth() === a.date.getMonth() &&
        d.getFullYear() === a.date.getFullYear() &&
        a.status !== 'booked'
      )
    );
    
    setAvailability(newAvailability);
    setSelectedDates([]);
    
    toast({
      title: "Dates Made Available",
      description: `${selectedDates.length} dates are now available for booking`,
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Render calendar days
  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateInfo = getDateAvailability(date);
      const isSelected = isDateSelected(date);
      const isPast = isPastDate(date);
      const status = dateInfo?.status || 'available';
      
      days.push(
        <div
          key={day}
          onClick={() => !isPast && toggleDateSelection(date)}
          className={`
            h-24 border border-gray-100 p-1 cursor-pointer transition-all relative
            ${isPast ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''}
            ${isSelected ? 'ring-2 ring-primary ring-inset' : ''}
            ${!isPast && !isSelected ? 'hover:bg-gray-50' : ''}
          `}
        >
          {/* Day number */}
          <div className={`
            text-sm font-medium mb-1
            ${isPast ? 'text-gray-400' : 'text-gray-900'}
          `}>
            {day}
          </div>
          
          {/* Status indicator */}
          {!isPast && (
            <div className={`
              flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium
              ${getStatusColor(status)}
            `}>
              {getStatusIcon(status)}
              <span className="truncate">
                {status === 'available' ? 'Open' : 
                 status === 'booked' ? 'Booked' :
                 status === 'maintenance' ? 'Service' :
                 status === 'personal' ? 'Personal' : 'Blocked'}
              </span>
            </div>
          )}
          
          {/* Custom price indicator */}
          {dateInfo?.customPrice && (
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {dateInfo.customPrice}
            </div>
          )}
          
          {/* Note indicator */}
          {dateInfo?.note && (
            <div className="absolute bottom-1 right-1">
              <Info className="h-3 w-3 text-gray-400" />
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <>
      <Helmet>
        <title>Vehicle Availability | {mockVehicle.make} {mockVehicle.model} - Recharge Travels</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/vehicle-rental/owner-dashboard')}
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src={mockVehicle.photo} 
                  alt={`${mockVehicle.make} ${mockVehicle.model}`}
                  className="w-20 h-14 object-cover rounded-lg"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {mockVehicle.make} {mockVehicle.model} ({mockVehicle.year})
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Availability Calendar
                    <span className="text-primary font-medium">${mockVehicle.dailyRate}/day</span>
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedDates([])}>
                  Clear Selection
                </Button>
                {selectedDates.length > 0 && (
                  <Button onClick={() => setShowBulkModal(true)} className="gap-2">
                    <Edit2 className="h-4 w-4" />
                    Update {selectedDates.length} Dates
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 bg-green-100 rounded flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-800" />
                </span>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 bg-blue-500 rounded flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </span>
                <span className="text-sm text-gray-600">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 bg-orange-500 rounded flex items-center justify-center">
                  <Wrench className="h-3 w-3 text-white" />
                </span>
                <span className="text-sm text-gray-600">Maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 bg-purple-500 rounded flex items-center justify-center">
                  <Ban className="h-3 w-3 text-white" />
                </span>
                <span className="text-sm text-gray-600">Personal Use</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 bg-red-500 rounded flex items-center justify-center">
                  <X className="h-3 w-3 text-white" />
                </span>
                <span className="text-sm text-gray-600">Blocked</span>
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-3 bg-white rounded-xl border shadow-sm overflow-hidden">
              {/* Month Navigation */}
              <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <button 
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold text-gray-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <button 
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600 bg-gray-50">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {renderCalendarDays()}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl border shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setBulkAction('maintenance');
                      setShowBulkModal(true);
                    }}
                    disabled={selectedDates.length === 0}
                  >
                    <Wrench className="h-4 w-4 text-orange-500" />
                    Block for Maintenance
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setBulkAction('personal');
                      setShowBulkModal(true);
                    }}
                    disabled={selectedDates.length === 0}
                  >
                    <Ban className="h-4 w-4 text-purple-500" />
                    Block for Personal Use
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={handleSetAvailable}
                    disabled={selectedDates.length === 0}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                    Make Available
                  </Button>
                </div>
              </div>
              
              {/* Selected Dates */}
              {selectedDates.length > 0 && (
                <div className="bg-white rounded-xl border shadow-sm p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Selected Dates ({selectedDates.length})
                  </h3>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {selectedDates.sort((a, b) => a.getTime() - b.getTime()).map((date, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-sm"
                      >
                        <span>{formatDate(date)}</span>
                        <button 
                          onClick={() => toggleDateSelection(date)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Remove date"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Upcoming Bookings */}
              <div className="bg-white rounded-xl border shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Upcoming Bookings</h3>
                {bookings.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No upcoming bookings</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.map(booking => (
                      <div 
                        key={booking.id}
                        className="p-3 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{booking.customerName}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </div>
                        <div className="text-sm font-medium text-green-600 mt-1">
                          ${booking.totalAmount}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Stats */}
              <div className="bg-white rounded-xl border shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3">This Month</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {getDaysInMonth(currentMonth) - availability.filter(a => 
                        a.date.getMonth() === currentMonth.getMonth() &&
                        a.date.getFullYear() === currentMonth.getFullYear()
                      ).length}
                    </div>
                    <div className="text-xs text-gray-600">Available</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {availability.filter(a => 
                        a.status === 'booked' &&
                        a.date.getMonth() === currentMonth.getMonth() &&
                        a.date.getFullYear() === currentMonth.getFullYear()
                      ).length}
                    </div>
                    <div className="text-xs text-gray-600">Booked</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {availability.filter(a => 
                        a.status === 'maintenance' &&
                        a.date.getMonth() === currentMonth.getMonth() &&
                        a.date.getFullYear() === currentMonth.getFullYear()
                      ).length}
                    </div>
                    <div className="text-xs text-gray-600">Maintenance</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {availability.filter(a => 
                        (a.status === 'personal' || a.status === 'blocked') &&
                        a.date.getMonth() === currentMonth.getMonth() &&
                        a.date.getFullYear() === currentMonth.getFullYear()
                      ).length}
                    </div>
                    <div className="text-xs text-gray-600">Blocked</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bulk Update Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Update Availability</h3>
              <button 
                onClick={() => setShowBulkModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Update {selectedDates.length} selected date(s)
            </p>
            
            {/* Status Selection */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'available', label: 'Available', icon: Check, color: 'green' },
                  { value: 'maintenance', label: 'Maintenance', icon: Wrench, color: 'orange' },
                  { value: 'personal', label: 'Personal', icon: Ban, color: 'purple' },
                  { value: 'blocked', label: 'Blocked', icon: X, color: 'red' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setBulkAction(option.value as AvailabilityStatus)}
                    className={`
                      flex items-center gap-2 p-3 border rounded-lg text-sm font-medium transition-all
                      ${bulkAction === option.value 
                        ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700` 
                        : 'border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Note */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Note (Optional)</label>
              <Textarea
                value={bulkNote}
                onChange={(e) => setBulkNote(e.target.value)}
                placeholder="Add a note for these dates..."
                rows={2}
              />
            </div>
            
            {/* Custom Price */}
            {bulkAction === 'available' && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Custom Price (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={customPrice || ''}
                    onChange={(e) => setCustomPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder={`${mockVehicle.dailyRate} (default)`}
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty to use default rate</p>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowBulkModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleBulkUpdate}
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Dates'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Date Info Modal */}
      {selectedDateInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Date Details</h3>
              <button 
                onClick={() => setSelectedDateInfo(null)}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="Close date details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Date:</span>
                <p className="font-medium">{formatDate(selectedDateInfo.date)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <p className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${getStatusColor(selectedDateInfo.status)}`}>
                  {getStatusIcon(selectedDateInfo.status)}
                  {selectedDateInfo.status.charAt(0).toUpperCase() + selectedDateInfo.status.slice(1)}
                </p>
              </div>
              {selectedDateInfo.note && (
                <div>
                  <span className="text-sm text-gray-600">Note:</span>
                  <p className="text-gray-900">{selectedDateInfo.note}</p>
                </div>
              )}
              {selectedDateInfo.bookingId && (
                <div>
                  <span className="text-sm text-gray-600">Booking:</span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary"
                    onClick={() => {
                      setSelectedDateInfo(null);
                      // Navigate to booking details
                    }}
                  >
                    View Booking Details
                  </Button>
                </div>
              )}
            </div>
            
            <Button 
              onClick={() => setSelectedDateInfo(null)}
              className="w-full mt-4"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleAvailabilityCalendar;
