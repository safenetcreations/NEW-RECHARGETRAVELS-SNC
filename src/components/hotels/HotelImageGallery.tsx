
import React from 'react'
import { ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HotelImageGalleryProps {
  images: string[]
  hotelName: string
  currentImageIndex: number
  onImageIndexChange: (index: number) => void
}

const HotelImageGallery: React.FC<HotelImageGalleryProps> = ({
  images,
  hotelName,
  currentImageIndex,
  onImageIndexChange
}) => {
  const hasMultipleImages = images.length > 1

  return (
    <div className="relative h-96 bg-gray-100">
      <img
                        src={images[currentImageIndex] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'}
        alt={hotelName}
        className="w-full h-full object-cover"
      />
      
      {hasMultipleImages && (
        <>
          <Button
            onClick={() => onImageIndexChange(
              currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
            )}
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-800 hover:bg-white shadow-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            onClick={() => onImageIndexChange(
              currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
            )}
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-800 hover:bg-white shadow-md"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}
      
      {hasMultipleImages && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white/80 px-3 py-2 rounded-full">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => onImageIndexChange(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
      
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button variant="ghost" size="icon" className="bg-white bg-opacity-90 hover:bg-opacity-100">
          <Heart className="w-5 h-5 text-gray-700" />
        </Button>
        <Button variant="ghost" size="icon" className="bg-white bg-opacity-90 hover:bg-opacity-100">
          <Share2 className="w-5 h-5 text-gray-700" />
        </Button>
      </div>
    </div>
  )
}

export default HotelImageGallery
