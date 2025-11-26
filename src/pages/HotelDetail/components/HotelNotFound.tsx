
import React from 'react'

interface HotelNotFoundProps {
  hotelId: string | undefined
}

const HotelNotFound: React.FC<HotelNotFoundProps> = ({ hotelId }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotel not found</h2>
        <p className="text-gray-600">The hotel you're looking for doesn't exist.</p>
        <p className="text-sm text-gray-500 mt-2">Hotel ID: {hotelId}</p>
        <p className="text-sm text-gray-500">Check the console for debugging information.</p>
      </div>
    </div>
  )
}

export default HotelNotFound
