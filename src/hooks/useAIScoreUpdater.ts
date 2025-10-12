
import { useState } from 'react'
import { dbService, authService, storageService } from '@/lib/firebase-services'
import { toast } from 'sonner'

interface AIScoreUpdateResult {
  message: string
  processed: number
  updated: number
  timestamp: string
}

export const useAIScoreUpdater = () => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<AIScoreUpdateResult | null>(null)

  const updateAIScores = async (): Promise<boolean> => {
    if (isUpdating) return false

    setIsUpdating(true)
    
    try {
      const { data, error } = await supabase.functions.invoke('update-ai-scores')
      
      if (error) {
        console.error('Error updating AI scores:', error)
        toast.error('Failed to update AI scores')
        return false
      }

      const result = data as AIScoreUpdateResult
      setLastUpdate(result)
      
      toast.success(`AI scores updated! Processed ${result.processed} hotels, updated ${result.updated}`)
      return true
      
    } catch (error) {
      console.error('Unexpected error updating AI scores:', error)
      toast.error('Unexpected error updating AI scores')
      return false
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    updateAIScores,
    isUpdating,
    lastUpdate
  }
}
