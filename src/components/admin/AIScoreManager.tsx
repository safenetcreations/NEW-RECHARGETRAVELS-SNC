
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, RefreshCw, Clock, TrendingUp } from 'lucide-react'
import { useAIScoreUpdater } from '@/hooks/useAIScoreUpdater'

const AIScoreManager: React.FC = () => {
  const { updateAIScores, isUpdating, lastUpdate } = useAIScoreUpdater()

  const handleUpdateScores = async () => {
    await updateAIScores()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Score Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Recalculate AI Recommendation Scores</h3>
            <p className="text-sm text-gray-600">
              Update AI scores for all hotels based on current data
            </p>
          </div>
          <Button
            onClick={handleUpdateScores}
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Updating...' : 'Update Scores'}
          </Button>
        </div>

        {lastUpdate && (
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last Update Results
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Processed:</span>
                <Badge variant="outline" className="ml-2">
                  {lastUpdate.processed} hotels
                </Badge>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Updated:</span>
                <Badge variant="outline" className="ml-2">
                  {lastUpdate.updated} hotels
                </Badge>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Timestamp:</span>
              <span className="ml-2 font-mono text-xs">
                {new Date(lastUpdate.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">How AI Scoring Works</p>
              <p className="text-blue-700 mt-1">
                Scores are calculated based on price value, hotel type, ratings, amenities, 
                availability, and popularity. Higher scores indicate better AI recommendations.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AIScoreManager
