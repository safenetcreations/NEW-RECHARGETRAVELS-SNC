
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { ActivityFilters, ActivityCategory } from '@/types/activity'

interface ActivityFiltersProps {
  filters: Partial<ActivityFilters>
  onFiltersChange: (filters: Partial<ActivityFilters>) => void
  categories: ActivityCategory[]
}

const ActivityFiltersComponent: React.FC<ActivityFiltersProps> = ({
  filters,
  onFiltersChange,
  categories
}) => {
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const currentCategories = filters.categories || []
    const newCategories = checked
      ? [...currentCategories, categoryId]
      : currentCategories.filter(id => id !== categoryId)
    
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    const currentDifficulty = filters.difficulty || []
    const newDifficulty = checked
      ? [...currentDifficulty, difficulty]
      : currentDifficulty.filter(d => d !== difficulty)
    
    onFiltersChange({ ...filters, difficulty: newDifficulty })
  }

  const handlePriceRangeChange = (range: number[]) => {
    onFiltersChange({ ...filters, priceRange: [range[0], range[1]] })
  }

  const handleRatingChange = (rating: number[]) => {
    onFiltersChange({ ...filters, rating: rating[0] })
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={filters.categories?.includes(category.id) || false}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category.id, checked as boolean)
                }
              />
              <label
                htmlFor={category.id}
                className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              min={0}
              max={500}
              step={10}
              value={filters.priceRange || [0, 500]}
              onValueChange={handlePriceRangeChange}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${filters.priceRange?.[0] || 0}</span>
              <span>${filters.priceRange?.[1] || 500}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Difficulty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {['easy', 'moderate', 'hard', 'extreme'].map((difficulty) => (
            <div key={difficulty} className="flex items-center space-x-2">
              <Checkbox
                id={difficulty}
                checked={filters.difficulty?.includes(difficulty) || false}
                onCheckedChange={(checked) => 
                  handleDifficultyChange(difficulty, checked as boolean)
                }
              />
              <label
                htmlFor={difficulty}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
              >
                {difficulty}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              min={0}
              max={5}
              step={0.5}
              value={[filters.rating || 0]}
              onValueChange={handleRatingChange}
              className="w-full"
            />
            <div className="text-sm text-gray-600">
              {filters.rating || 0}+ stars
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ActivityFiltersComponent
