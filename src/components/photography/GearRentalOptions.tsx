import { useState } from 'react'
import { Camera, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface GearOption {
  item: string
  price: number
}

interface GearRentalOptionsProps {
  gearOptions: any[] | null
}

const GearRentalOptions = ({ gearOptions }: GearRentalOptionsProps) => {
  const [selectedGear, setSelectedGear] = useState<string[]>([])

  if (!gearOptions || !Array.isArray(gearOptions) || gearOptions.length === 0) {
    return (
      <div className="text-center py-8">
        <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Gear rental information will be updated soon.</p>
      </div>
    )
  }

  const validGearOptions: GearOption[] = gearOptions.filter(
    (gear): gear is GearOption => 
      gear && typeof gear === 'object' && typeof gear.item === 'string' && typeof gear.price === 'number'
  )

  const toggleGearSelection = (gearItem: string) => {
    setSelectedGear(prev => 
      prev.includes(gearItem) 
        ? prev.filter(item => item !== gearItem)
        : [...prev, gearItem]
    )
  }

  const totalRentalCost = selectedGear.reduce((total, gearItem) => {
    const gear = validGearOptions.find(g => g.item === gearItem)
    return total + (gear?.price || 0)
  }, 0)

  const categorizeGear = (item: string) => {
    const lowerItem = item.toLowerCase()
    if (lowerItem.includes('camera') || lowerItem.includes('eos') || lowerItem.includes('canon') || lowerItem.includes('nikon')) {
      return 'camera'
    }
    if (lowerItem.includes('lens') || lowerItem.includes('mm') || lowerItem.includes('f/')) {
      return 'lens'
    }
    if (lowerItem.includes('tripod') || lowerItem.includes('support') || lowerItem.includes('stabilizer')) {
      return 'support'
    }
    return 'accessory'
  }

  const getGearIcon = (category: string) => {
    switch (category) {
      case 'camera':
        return '📷'
      case 'lens':
        return '🔍'
      case 'support':
        return '🎯'
      default:
        return '⚙️'
    }
  }

  const groupedGear = validGearOptions.reduce((acc, gear) => {
    const category = categorizeGear(gear.item)
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(gear)
    return acc
  }, {} as Record<string, GearOption[]>)

  const categoryNames = {
    camera: 'Cameras',
    lens: 'Lenses',
    support: 'Tripods & Support',
    accessory: 'Accessories'
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Professional Photography Equipment</h3>
        <p className="text-muted-foreground">
          High-quality gear available for rent to enhance your photography experience
        </p>
      </div>

      {/* Gear Categories */}
      <div className="space-y-6">
        {Object.entries(groupedGear).map(([category, gears]) => (
          <div key={category}>
            <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="text-xl">{getGearIcon(category)}</span>
              {categoryNames[category as keyof typeof categoryNames] || category}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gears.map((gear, index) => {
                const isSelected = selectedGear.includes(gear.item)
                return (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => toggleGearSelection(gear.item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-foreground mb-1">{gear.item}</h5>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              ${gear.price}/day
                            </Badge>
                            {isSelected && (
                              <Badge className="bg-green-500 text-white text-xs">
                                <Check className="w-3 h-3 mr-1" />
                                Selected
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'border-primary bg-primary' 
                              : 'border-muted-foreground'
                          }`}>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Rental Summary */}
      {selectedGear.length > 0 && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Rental Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedGear.map((gearItem, index) => {
                const gear = validGearOptions.find(g => g.item === gearItem)
                return gear ? (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{gear.item}</span>
                    <span className="text-sm font-medium">${gear.price}/day</span>
                  </div>
                ) : null
              })}
              
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total Rental Cost</span>
                  <span className="text-lg font-bold text-foreground">${totalRentalCost}/day</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rental Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rental Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">All equipment is professionally maintained and tested before each tour</span>
          </div>
          <div className="flex items-start gap-3">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">Memory cards and batteries included with camera rentals</span>
          </div>
          <div className="flex items-start gap-3">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">Basic insurance coverage included in rental fee</span>
          </div>
          <div className="flex items-start gap-3">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">Personal instruction included on equipment usage</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GearRentalOptions