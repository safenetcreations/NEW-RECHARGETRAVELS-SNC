
import React from 'react'
import { Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { TourFilters } from '@/types/tour'

interface TourFiltersProps {
  filters: TourFilters
  onFiltersChange: (filters: TourFilters) => void
}

const TourFiltersComponent: React.FC<TourFiltersProps> = ({ filters, onFiltersChange }) => {
  const updateFilter = (key: keyof TourFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      destination: '',
      tourType: '',
      difficulty: '',
      duration: '',
      priceRange: [0, 2000]
    })
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          Filter Tours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              type="text"
              placeholder="Search destination..."
              value={filters.destination}
              onChange={(e) => updateFilter('destination', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="tourType">Tour Type</Label>
            <select
              id="tourType"
              value={filters.tourType}
              onChange={(e) => updateFilter('tourType', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Types</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
              <option value="wildlife">Wildlife</option>
              <option value="luxury">Luxury</option>
              <option value="budget">Budget</option>
              <option value="family">Family</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <select
              id="difficulty"
              value={filters.difficulty}
              onChange={(e) => updateFilter('difficulty', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="duration">Duration</Label>
            <select
              id="duration"
              value={filters.duration}
              onChange={(e) => updateFilter('duration', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Any Duration</option>
              <option value="1-3">1-3 days</option>
              <option value="4-7">4-7 days</option>
              <option value="8-14">8-14 days</option>
              <option value="15">15+ days</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="priceRange">
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </Label>
            <input
              id="priceRange"
              type="range"
              min="0"
              max="2000"
              step="50"
              value={filters.priceRange[1]}
              onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default TourFiltersComponent
