import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

interface Filters {
  genre: string
  skillLevel: string
  durationType: string
  gearRental: boolean
}

interface PhotographyFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

const PhotographyFilters = ({ filters, onFiltersChange }: PhotographyFiltersProps) => {
  const genres = [
    { value: 'cultural_temples', label: 'Cultural & Temples' },
    { value: 'wildlife_nature', label: 'Wildlife & Nature' },
    { value: 'scenic_trains', label: 'Scenic Train Journeys' },
    { value: 'street_local', label: 'Street & Local Life' }
  ]

  const skillLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'pro', label: 'Professional' }
  ]

  const durations = [
    { value: 'half_day', label: 'Half Day' },
    { value: 'full_day', label: 'Full Day' },
    { value: 'multi_day', label: 'Multi Day' }
  ]

  const clearFilter = (filterKey: keyof Filters) => {
    onFiltersChange({
      ...filters,
      [filterKey]: filterKey === 'gearRental' ? false : ''
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      genre: '',
      skillLevel: '',
      durationType: '',
      gearRental: false
    })
  }

  const hasActiveFilters = filters.genre || filters.skillLevel || filters.durationType || filters.gearRental

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Genre Filter */}
        <div className="space-y-2">
          <Label htmlFor="genre">Photography Genre</Label>
          <Select value={filters.genre} onValueChange={(value) => onFiltersChange({ ...filters, genre: value })}>
            <SelectTrigger id="genre">
              <SelectValue placeholder="All genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre.value} value={genre.value}>
                  {genre.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skill Level Filter */}
        <div className="space-y-2">
          <Label htmlFor="skill-level">Skill Level</Label>
          <Select value={filters.skillLevel} onValueChange={(value) => onFiltersChange({ ...filters, skillLevel: value })}>
            <SelectTrigger id="skill-level">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All levels</SelectItem>
              {skillLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Duration Filter */}
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Select value={filters.durationType} onValueChange={(value) => onFiltersChange({ ...filters, durationType: value })}>
            <SelectTrigger id="duration">
              <SelectValue placeholder="Any duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any duration</SelectItem>
              {durations.map((duration) => (
                <SelectItem key={duration.value} value={duration.value}>
                  {duration.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gear Rental Filter */}
        <div className="space-y-2">
          <Label htmlFor="gear-rental">Camera Gear Rental</Label>
          <div className="flex items-center space-x-2 mt-3">
            <Switch
              id="gear-rental"
              checked={filters.gearRental}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, gearRental: checked })}
            />
            <Label htmlFor="gear-rental" className="text-sm font-normal">
              Available
            </Label>
          </div>
        </div>
      </div>

      {/* Active Filters and Clear Button */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          
          {filters.genre && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {genres.find(g => g.value === filters.genre)?.label}
              <button onClick={() => clearFilter('genre')} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.skillLevel && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {skillLevels.find(s => s.value === filters.skillLevel)?.label}
              <button onClick={() => clearFilter('skillLevel')} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.durationType && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {durations.find(d => d.value === filters.durationType)?.label}
              <button onClick={() => clearFilter('durationType')} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.gearRental && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Gear rental available
              <button onClick={() => clearFilter('gearRental')} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}

export default PhotographyFilters