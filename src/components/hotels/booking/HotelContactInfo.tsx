
import React from 'react'
import { Phone, Mail, Globe, Clock } from 'lucide-react'
import { Hotel } from '@/types/hotel'

interface HotelContactInfoProps {
  hotel: Hotel
}

const HotelContactInfo: React.FC<HotelContactInfoProps> = ({ hotel }) => {
  return (
    <>
      {/* Contact Info */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h4 className="font-semibold text-gray-900 mb-2">Contact Hotel</h4>
        <div className="space-y-2 text-sm">
          {hotel.phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              <span>{hotel.phone}</span>
            </div>
          )}
          {hotel.email && (
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <span>{hotel.email}</span>
            </div>
          )}
          {hotel.website && (
            <div className="flex items-center text-gray-600">
              <Globe className="w-4 h-4 mr-2" />
              <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Visit Website
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Check-in/Check-out Times */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-semibold text-gray-900 mb-2">Hotel Policies</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>Check-in: {hotel.check_in_time}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>Check-out: {hotel.check_out_time}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default HotelContactInfo
