
import React from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AIRecommendation } from '@/types/aiRecommendation'

interface AIRecommendationDisplayProps {
  aiRecommendation: AIRecommendation
  onBookRecommendation: () => void
}

const AIRecommendationDisplay: React.FC<AIRecommendationDisplayProps> = ({
  aiRecommendation,
  onBookRecommendation
}) => {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-center mb-2">
        <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
        <h4 className="font-semibold text-purple-900">AI Recommendation</h4>
        <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
          aiRecommendation.confidence === 'high' ? 'bg-green-100 text-green-800' :
          aiRecommendation.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {aiRecommendation.confidence} confidence
        </span>
      </div>
      
      <p className="text-sm text-purple-700 mb-3">{aiRecommendation.reasoning}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">AI Score:</span>
          <span className="text-sm text-purple-600 font-bold">
            {Math.round(aiRecommendation.score * 100)}%
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Booking Type:</span>
          <span className="text-sm capitalize">
            {aiRecommendation.booking_type.replace('_', ' ')}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total Price:</span>
          <span className="text-sm font-bold">${aiRecommendation.total_price}</span>
        </div>
        
        {aiRecommendation.room && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Recommended Room:</span>
            <span className="text-sm">{aiRecommendation.room.name}</span>
          </div>
        )}
      </div>
      
      <Button 
        onClick={onBookRecommendation}
        className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
      >
        Book AI Recommendation
      </Button>
    </div>
  )
}

export default AIRecommendationDisplay
