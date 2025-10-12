
import React from 'react'
import { RoomType } from '@/types/hotel'

interface SelectedRoomDisplayProps {
  selectedRoom: RoomType | null
}

const SelectedRoomDisplay: React.FC<SelectedRoomDisplayProps> = ({
  selectedRoom
}) => {
  if (!selectedRoom) return null

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <h4 className="font-semibold text-gray-900">{selectedRoom.name}</h4>
      <p className="text-sm text-gray-600">${selectedRoom.price_per_night}/night</p>
    </div>
  )
}

export default SelectedRoomDisplay
