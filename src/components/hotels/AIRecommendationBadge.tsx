
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Brain, Star } from 'lucide-react'

interface AIRecommendationBadgeProps {
  score: number
  className?: string
  showScore?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const AIRecommendationBadge: React.FC<AIRecommendationBadgeProps> = ({ 
  score, 
  className = '', 
  showScore = true,
  size = 'md'
}) => {
  const getScoreLevel = (score: number) => {
    if (score >= 0.85) return { level: 'excellent', color: 'bg-purple-600', text: 'AI Top Pick' }
    if (score >= 0.75) return { level: 'high', color: 'bg-blue-600', text: 'AI Recommended' }
    if (score >= 0.65) return { level: 'good', color: 'bg-green-600', text: 'Good Match' }
    if (score >= 0.55) return { level: 'fair', color: 'bg-yellow-600', text: 'Fair Match' }
    return { level: 'low', color: 'bg-gray-500', text: 'Basic Match' }
  }

  const getIcon = (level: string) => {
    switch (level) {
      case 'excellent':
        return <Sparkles className="w-3 h-3 mr-1" />
      case 'high':
        return <Brain className="w-3 h-3 mr-1" />
      default:
        return <Star className="w-3 h-3 mr-1" />
    }
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1'
      case 'lg':
        return 'text-sm px-3 py-2'
      default:
        return 'text-xs px-2 py-1'
    }
  }

  const scoreInfo = getScoreLevel(score)
  const sizeClasses = getSizeClasses(size)

  // Lower threshold to show more badges with the new sample data
  if (score < 0.5) {
    return null
  }

  return (
    <Badge 
      className={`${scoreInfo.color} text-white ${sizeClasses} flex items-center ${className}`}
    >
      {getIcon(scoreInfo.level)}
      <span>{scoreInfo.text}</span>
      {showScore && (
        <span className="ml-1 font-semibold">
          {Math.round(score * 100)}%
        </span>
      )}
    </Badge>
  )
}

export default AIRecommendationBadge
