
import React from 'react'
import { Progress } from '@/components/ui/progress'
import { Brain, Sparkles } from 'lucide-react'

interface AIScoreDisplayProps {
  score: number
  className?: string
  showProgress?: boolean
  compact?: boolean
}

const AIScoreDisplay: React.FC<AIScoreDisplayProps> = ({ 
  score, 
  className = '',
  showProgress = true,
  compact = false
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.75) return 'text-purple-600'
    if (score >= 0.65) return 'text-blue-600'
    if (score >= 0.55) return 'text-green-600'
    return 'text-gray-500'
  }

  const getProgressColor = (score: number) => {
    if (score >= 0.75) return 'bg-purple-600'
    if (score >= 0.65) return 'bg-blue-600'
    if (score >= 0.55) return 'bg-green-600'
    return 'bg-gray-400'
  }

  const getScoreText = (score: number) => {
    if (score >= 0.85) return 'Perfect Match'
    if (score >= 0.75) return 'Excellent Match'
    if (score >= 0.65) return 'Good Match'
    if (score >= 0.55) return 'Fair Match'
    return 'Basic Match'
  }

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Brain className="w-4 h-4 text-purple-600" />
        <span className={`text-sm font-medium ${getScoreColor(score)}`}>
          {Math.round(score * 100)}%
        </span>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-1">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">AI Match</span>
        </div>
        <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
          {Math.round(score * 100)}%
        </span>
      </div>
      
      {showProgress && (
        <div className="space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(score)}`}
              style={{ width: `${score * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">{getScoreText(score)}</p>
        </div>
      )}
    </div>
  )
}

export default AIScoreDisplay
