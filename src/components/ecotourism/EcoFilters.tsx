import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface EcoFiltersProps {
  onFiltersChange: (filters: {
    category?: string
    priceRange?: [number, number]
    duration?: string
    featured?: boolean
  }) => void
  className?: string
}

const EcoFilters = ({ onFiltersChange, className }: EcoFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 500] as [number, number],
    duration: '',
    featured: false
  })

  const categories = [
    { value: 'wildlife_conservation', label: 'Wildlife Conservation' },
    { value: 'agro_tourism', label: 'Agro-Tourism' },
    { value: 'community_homestays', label: 'Community Homestays' },
    { value: 'marine_protection', label: 'Marine Protection' },
    { value: 'forest_treks', label: 'Forest Treks' }
  ]

  const durations = [
    { value: 'short', label: '1-3 Days' },
    { value: 'medium', label: '4-7 Days' },
    { value: 'long', label: '8+ Days' }
  ]

  const updateFilters = (newFilters: typeof filters) => {
    setFilters(newFilters)
    
    const cleanFilters: any = {}
    if (newFilters.category) cleanFilters.category = newFilters.category
    if (newFilters.duration) cleanFilters.duration = newFilters.duration
    if (newFilters.featured) cleanFilters.featured = newFilters.featured
    if (newFilters.priceRange[0] > 0 || newFilters.priceRange[1] < 500) {
      cleanFilters.priceRange = newFilters.priceRange
    }
    
    onFiltersChange(cleanFilters)
  }

  const clearFilters = () => {
    const resetFilters = {
      category: '',
      priceRange: [0, 500] as [number, number],
      duration: '',
      featured: false
    }
    updateFilters(resetFilters)
  }

  const hasActiveFilters = filters.category || filters.duration || filters.featured || 
    filters.priceRange[0] > 0 || filters.priceRange[1] < 500

  return (
    <div className={className}>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button 
          variant="outline" 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters {hasActiveFilters && '(Active)'}
        </Button>
      </div>

      {/* Filter Content */}
      <Card className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filter Eco Tours</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => updateFilters({ ...filters, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration Filter */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select
              value={filters.duration}
              onValueChange={(value) => updateFilters({ ...filters, duration: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Duration</SelectItem>
                {durations.map((duration) => (
                  <SelectItem key={duration.value} value={duration.value}>
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-4">
            <Label>Price Range (USD)</Label>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilters({ ...filters, priceRange: value as [number, number] })}
                max={500}
                min={0}
                step={25}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Featured Tours Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={filters.featured}
              onCheckedChange={(checked) => updateFilters({ ...filters, featured: checked })}
            />
            <Label htmlFor="featured">Featured Tours Only</Label>
          </div>

          {/* Quick Category Buttons */}
          <div className="space-y-3">
            <Label>Quick Filters</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={filters.category === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilters({ 
                    ...filters, 
                    category: filters.category === category.value ? '' : category.value 
                  })}
                  className="text-xs"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EcoFilters