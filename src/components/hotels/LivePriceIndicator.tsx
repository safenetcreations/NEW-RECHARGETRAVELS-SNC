
import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface LivePriceIndicatorProps {
  currentPrice: number
  hotelId: string
}

const LivePriceIndicator: React.FC<LivePriceIndicatorProps> = ({ currentPrice, hotelId }) => {
  const [currentDisplayPrice, setCurrentDisplayPrice] = useState<number>(currentPrice)
  const [previousPrice, setPreviousPrice] = useState<number>(currentPrice)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // Generate a unique base price for each hotel based on hotelId
    const hashCode = (str: string) => {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
      }
      return Math.abs(hash)
    }

    const hotelHash = hashCode(hotelId)
    const baseVariation = (hotelHash % 200) + 50 // $50-250 base variation
    const initialPrice = Math.max(currentPrice + baseVariation - 100, 25)
    
    setCurrentDisplayPrice(initialPrice)
    setPreviousPrice(initialPrice)

    const interval = setInterval(() => {
      setIsUpdating(true)
      
      setTimeout(() => {
        setPreviousPrice(prev => {
          const variation = (Math.random() - 0.5) * 0.15 // ±7.5% variation
          const newPrice = Math.round(prev * (1 + variation))
          const finalPrice = Math.max(newPrice, 25) // Minimum $25
          
          setCurrentDisplayPrice(finalPrice)
          setIsUpdating(false)
          return finalPrice
        })
      }, 500)
    }, 15000) // Update every 15 seconds for more noticeable changes

    return () => clearInterval(interval)
  }, [currentPrice, hotelId])

  const priceChange = currentDisplayPrice - previousPrice

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <DollarSign className="h-4 w-4 text-green-600" />
        <span className={`font-bold text-lg ${isUpdating ? 'animate-pulse text-blue-600' : ''}`}>
          {currentDisplayPrice}
        </span>
      </div>
      
      {Math.abs(priceChange) > 0 && (
        <Badge 
          variant={priceChange > 0 ? "destructive" : "default"}
          className="text-xs flex items-center gap-1"
        >
          {priceChange > 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          ${Math.abs(priceChange)}
        </Badge>
      )}
      
      {isUpdating && (
        <Badge variant="outline" className="text-xs animate-pulse">
          Live Update...
        </Badge>
      )}
    </div>
  )
}

export default LivePriceIndicator
