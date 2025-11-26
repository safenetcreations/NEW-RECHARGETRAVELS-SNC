
import React from 'react'

interface BookingDateSelectorProps {
  checkIn: string
  checkOut: string
  onCheckInChange: (value: string) => void
  onCheckOutChange: (value: string) => void
}

const BookingDateSelector: React.FC<BookingDateSelectorProps> = ({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => onCheckInChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => onCheckOutChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}

export default BookingDateSelector
