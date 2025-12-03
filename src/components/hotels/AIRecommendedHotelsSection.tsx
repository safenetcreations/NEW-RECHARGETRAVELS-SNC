
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Settings, TrendingUp } from 'lucide-react'
import { Hotel } from '@/types/hotel'
import { aiRecommendationService } from '@/services/aiRecommendationService'
import { UserPreferences, AIRecommendation } from '@/types/aiRecommendation'
import UserPreferencesForm from './UserPreferencesForm'
import HotelCard from './HotelCard'
import { Badge } from '@/components/ui/badge'

interface AIRecommendedHotelsSectionProps {
  hotels: Hotel[]
  guests: { adults: number; children: number }
  availableTours?: any[]
}

const AIRecommendedHotelsSection: React.FC<AIRecommendedHotelsSectionProps> = ({
  hotels,
  guests,
  availableTours = []
}) => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null)
  const [showPreferencesForm, setShowPreferencesForm] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (userPreferences && hotels.length > 0) {
      generateAIRecommendations()
    }
  }, [userPreferences, hotels])

  const generateAIRecommendations = async () => {
    if (!userPreferences) return
    
    setIsAnalyzing(true)
    try {
      const recommendations = hotels.map(hotel => {
        return aiRecommendationService.getBestRecommendation(
          hotel,
          availableTours,
          userPreferences,
          userPreferences.trip_duration
        )
      })

      // Sort by score and take top 6
      const sortedRecommendations = recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)

      setAiRecommendations(sortedRecommendations)
    } catch (error) {
      console.error('Error generating AI recommendations:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handlePreferencesChange = (preferences: UserPreferences) => {
    setUserPreferences(preferences)
    setShowPreferencesForm(false)
  }

  if (showPreferencesForm) {
    return (
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <UserPreferencesForm
          onPreferencesChange={handlePreferencesChange}
          onClose={() => setShowPreferencesForm(false)}
          guests={guests}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI-Powered Hotel Recommendations
          </CardTitle>
          <p className="text-gray-600">
            {userPreferences 
              ? "Personalized recommendations based on your preferences"
              : "Get personalized hotel recommendations tailored to your travel style"
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowPreferencesForm(true)}
              variant={userPreferences ? "outline" : "default"}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {userPreferences ? "Update Preferences" : "Set Travel Preferences"}
            </Button>
            
            {userPreferences && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {userPreferences.travel_style} style
                </Badge>
                <Badge variant="secondary">
                  ${userPreferences.budget_range[0]}-${userPreferences.budget_range[1]}
                </Badge>
                <Badge variant="secondary">
                  {userPreferences.trip_duration} nights
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations Grid */}
      {userPreferences && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Top AI Recommendations
              {isAnalyzing && <span className="text-sm text-gray-500 font-normal">(Analyzing...)</span>}
            </h3>
            {aiRecommendations.length > 0 && (
              <Badge variant="outline" className="text-purple-600 border-purple-200">
                {aiRecommendations.length} matches found
              </Badge>
            )}
          </div>

          {isAnalyzing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : aiRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiRecommendations.map((recommendation) => (
                <div key={recommendation.hotel.id} className="relative">
                  <HotelCard hotel={recommendation.hotel} />
                  
                  {/* AI Score Overlay */}
                  <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {Math.round(recommendation.score * 100)}% match
                  </div>
                  
                  {/* AI Reasoning Card */}
                  <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm text-purple-800">
                      <strong>Why this hotel:</strong> {recommendation.reasoning}
                    </p>
                    {recommendation.total_price !== (recommendation.hotel.base_price_per_night || 0) * userPreferences.trip_duration && (
                      <p className="text-xs text-green-600 mt-1">
                        💡 Package deal available: ${recommendation.total_price} total
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500">
                No hotels match your current preferences. Try adjusting your filters or preferences.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default AIRecommendedHotelsSection
