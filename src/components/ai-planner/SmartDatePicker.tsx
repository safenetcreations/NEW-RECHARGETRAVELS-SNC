import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sun, Cloud,
  Umbrella, Star, Info, Sparkles, PartyPopper, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getTravelDateSuggestions, getSriLankaEvents } from '@/services/geminiTripPlannerService';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore, addMonths, subMonths } from 'date-fns';

interface SmartDatePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
  interests?: string[];
}

const SmartDatePicker = ({ startDate, endDate, onDateChange, interests = [] }: SmartDatePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const today = new Date();
  const suggestions = getTravelDateSuggestions(interests);
  const events = getSriLankaEvents(currentMonth.getFullYear());

  // Get days for current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week offset for first day
  const startDayOfWeek = monthStart.getDay();

  // Check if date has an event
  const getEventForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.find(e => e.date === dateStr);
  };

  // Get season info for a month
  const getSeasonInfo = (month: number) => {
    // West coast best: Nov-April, East coast best: May-Sept
    if (month >= 11 || month <= 3) {
      return { icon: Sun, color: 'text-amber-500', label: 'Peak Season (West Coast)' };
    } else if (month >= 5 && month <= 8) {
      return { icon: Sun, color: 'text-blue-500', label: 'Peak Season (East Coast)' };
    } else {
      return { icon: Cloud, color: 'text-gray-500', label: 'Shoulder Season' };
    }
  };

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today)) return;

    if (!selectingEnd || !startDate) {
      onDateChange(date, null);
      setSelectingEnd(true);
    } else {
      if (isBefore(date, startDate)) {
        onDateChange(date, null);
      } else {
        onDateChange(startDate, date);
        setSelectingEnd(false);
        setIsOpen(false);
      }
    }
  };

  const isInRange = (date: Date) => {
    if (!startDate) return false;
    const end = endDate || hoveredDate;
    if (!end) return false;
    return isAfter(date, startDate) && isBefore(date, end);
  };

  const isSelected = (date: Date) => {
    return (startDate && isSameDay(date, startDate)) || (endDate && isSameDay(date, endDate));
  };

  const quickSelectDays = (days: number) => {
    const start = addDays(today, 7); // Start a week from now
    const end = addDays(start, days);
    onDateChange(start, end);
    setIsOpen(false);
  };

  const seasonInfo = getSeasonInfo(currentMonth.getMonth());
  const SeasonIcon = seasonInfo.icon;

  const duration = startDate && endDate
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-4">
      {/* Date Display */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal h-14 rounded-xl border-2 border-gray-200 hover:border-purple-400"
          >
            <CalendarIcon className="mr-3 h-5 w-5 text-purple-500" />
            {startDate ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold">{format(startDate, 'MMM d, yyyy')}</span>
                {endDate && (
                  <>
                    <span className="text-gray-400">→</span>
                    <span className="font-semibold">{format(endDate, 'MMM d, yyyy')}</span>
                    <Badge className="ml-2 bg-purple-100 text-purple-700">{duration} days</Badge>
                  </>
                )}
              </div>
            ) : (
              <span className="text-gray-500">Select your travel dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 bg-white rounded-xl shadow-xl min-w-[360px]">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <h3 className="font-bold text-lg">{format(currentMonth, 'MMMM yyyy')}</h3>
                <div className="flex items-center justify-center gap-1 text-sm">
                  <SeasonIcon className={`h-4 w-4 ${seasonInfo.color}`} />
                  <span className={seasonInfo.color}>{seasonInfo.label}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Selection Status */}
            {selectingEnd && startDate && (
              <div className="mb-3 p-2 bg-purple-50 rounded-lg text-sm text-purple-700 text-center">
                <Sparkles className="inline h-4 w-4 mr-1" />
                Now select your end date
              </div>
            )}

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for offset */}
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10" />
              ))}

              {/* Days */}
              {daysInMonth.map(date => {
                const event = getEventForDate(date);
                const isPast = isBefore(date, today);
                const selected = isSelected(date);
                const inRange = isInRange(date);

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => selectingEnd && setHoveredDate(date)}
                    onMouseLeave={() => setHoveredDate(null)}
                    disabled={isPast}
                    className={`
                      relative h-10 w-10 rounded-lg text-sm font-medium transition-all
                      ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-purple-100 cursor-pointer'}
                      ${selected ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white' : ''}
                      ${inRange ? 'bg-purple-100' : ''}
                      ${isSameDay(date, today) && !selected ? 'ring-2 ring-purple-400' : ''}
                    `}
                  >
                    {date.getDate()}
                    {event && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Events Legend */}
            {events.filter(e => {
              const eventDate = new Date(e.date);
              return isSameMonth(eventDate, currentMonth);
            }).length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                  <PartyPopper className="h-3 w-3" /> Events this month:
                </p>
                <div className="space-y-1">
                  {events
                    .filter(e => {
                      const eventDate = new Date(e.date);
                      return isSameMonth(eventDate, currentMonth);
                    })
                    .slice(0, 3)
                    .map(event => (
                      <div key={event.date} className="flex items-center gap-2 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span className="text-gray-600">
                          {format(new Date(event.date), 'MMM d')}: {event.name}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Quick Select Buttons */}
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Quick select:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { days: 5, label: '5 Days', desc: 'Quick highlights' },
            { days: 7, label: '7 Days', desc: 'Classic tour' },
            { days: 10, label: '10 Days', desc: 'Comprehensive' },
            { days: 14, label: '14 Days', desc: 'Full experience' },
          ].map(option => (
            <button
              key={option.days}
              onClick={() => quickSelectDays(option.days)}
              className={`px-4 py-2 rounded-xl border-2 transition-all ${
                duration === option.days
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="font-semibold text-sm">{option.label}</div>
              <div className="text-xs text-gray-500">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h4 className="font-semibold text-gray-800">Best Times to Visit</h4>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, i) => (
              <div key={i} className="flex items-start gap-3 p-2 bg-white/50 rounded-lg">
                <div className="flex">
                  {Array.from({ length: suggestion.rating }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <div>
                  <span className="font-medium text-purple-700">{suggestion.month}</span>
                  <p className="text-xs text-gray-600">{suggestion.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Dates Summary */}
      {startDate && endDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 rounded-xl border border-green-200"
        >
          <div className="flex items-center gap-2 text-green-700">
            <Check className="h-5 w-5" />
            <span className="font-semibold">
              {duration}-day trip: {format(startDate, 'MMMM d')} - {format(endDate, 'MMMM d, yyyy')}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SmartDatePicker;
