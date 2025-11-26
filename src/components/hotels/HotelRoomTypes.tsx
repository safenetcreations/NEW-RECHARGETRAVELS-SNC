
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RoomType } from '@/types/hotel'

interface HotelRoomTypesProps {
  roomTypes: RoomType[]
  selectedRoom: RoomType | null
  onRoomSelect: (room: RoomType) => void
}

const HotelRoomTypes: React.FC<HotelRoomTypesProps> = ({
  roomTypes,
  selectedRoom,
  onRoomSelect
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Room Types</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roomTypes?.map((room) => (
            <div
              key={room.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedRoom?.id === room.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onRoomSelect(room)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{room.description}</p>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <span>👥 Max {room.max_occupancy} guests</span>
                    <span>🛏️ {room.bed_type}</span>
                    {room.room_size && <span>📐 {room.room_size}m²</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">${room.price_per_night}</div>
                  <div className="text-gray-600 text-sm">per night</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default HotelRoomTypes
