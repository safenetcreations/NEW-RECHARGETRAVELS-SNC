
import React from 'react'

interface GuestSelectorProps {
  guests: { adults: number; children: number }
  onGuestsChange: (guests: { adults: number; children: number }) => void
}

const GuestSelector: React.FC<GuestSelectorProps> = ({
  guests,
  onGuestsChange
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-600">Adults</label>
          <select
            value={guests.adults}
            onChange={(e) => onGuestsChange({ ...guests, adults: parseInt(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-600">Children</label>
          <select
            value={guests.children}
            onChange={(e) => onGuestsChange({ ...guests, children: parseInt(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[0, 1, 2, 3, 4].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default GuestSelector
