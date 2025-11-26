
import React from 'react'
import { Star, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BookingButtonsProps {
  availableTours: any[]
  isAnalyzing: boolean
  onAiSmartSelect: () => void
}

const BookingButtons: React.FC<BookingButtonsProps> = ({
  availableTours,
  isAnalyzing,
  onAiSmartSelect
}) => {
  return (
    <div className="space-y-2">
      <Button className="w-full">
        Book Hotel Only
      </Button>
      
      {availableTours.length > 0 && (
        <Button className="w-full bg-green-600 hover:bg-green-700">
          Book with Tour Package
        </Button>
      )}
      
      <Button 
        onClick={onAiSmartSelect}
        disabled={isAnalyzing}
        className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Star className="w-4 h-4 mr-2" />
            Let AI Choose Best Option
          </>
        )}
      </Button>
    </div>
  )
}

export default BookingButtons
