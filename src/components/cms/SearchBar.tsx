import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getRegions, getCategories } from '@/lib/cms-queries';
import type { Region, Category } from '@/lib/firebase-cms';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void
  loading?: boolean
}

export interface SearchFilters {
  regions: string[]
  categories: string[]
  contentType: 'all' | 'destination' | 'article'
}

const SearchBar = ({ onSearch, loading }: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    regions: [],
    categories: [],
    contentType: 'all'
  })
  const [regions, setRegions] = useState<Region[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [regionsData, categoriesData] = await Promise.all([
          getRegions(),
          getCategories()
        ])
        setRegions(regionsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to load filter options:', error)
      }
    }
    loadFilters()
  }, [])

  const handleSearch = () => {
    onSearch(query, filters)
  }

  const addRegionFilter = (regionId: string) => {
    if (!filters.regions.includes(regionId)) {
      setFilters(prev => ({
        ...prev,
        regions: [...prev.regions, regionId]
      }))
    }
  }

  const removeRegionFilter = (regionId: string) => {
    setFilters(prev => ({
      ...prev,
      regions: prev.regions.filter(id => id !== regionId)
    }))
  }

  const addCategoryFilter = (categoryId: string) => {
    if (!filters.categories.includes(categoryId)) {
      setFilters(prev => ({
        ...prev,
        categories: [...prev.categories, categoryId]
      }))
    }
  }

  const removeCategoryFilter = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.filter(id => id !== categoryId)
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      regions: [],
      categories: [],
      contentType: 'all'
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search destinations, articles, guides..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="text-lg"
          />
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4 mr-2" />
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Select value={filters.contentType} onValueChange={(value: any) => 
          setFilters(prev => ({ ...prev, contentType: value }))
        }>
          <SelectTrigger>
            <SelectValue placeholder="Content Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Content</SelectItem>
            <SelectItem value="destination">Destinations</SelectItem>
            <SelectItem value="article">Articles</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={addRegionFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Add Region Filter" />
          </SelectTrigger>
          <SelectContent>
            {regions.map(region => (
              <SelectItem key={region.id} value={region.id}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={addCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Add Category Filter" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name} ({category.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(filters.regions.length > 0 || filters.categories.length > 0) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          
          {filters.regions.map(regionId => {
            const region = regions.find(r => r.id === regionId)
            return region ? (
              <Badge key={regionId} variant="secondary" className="cursor-pointer">
                {region.name}
                <X 
                  className="h-3 w-3 ml-1" 
                  onClick={() => removeRegionFilter(regionId)}
                />
              </Badge>
            ) : null
          })}

          {filters.categories.map(categoryId => {
            const category = categories.find(c => c.id === categoryId)
            return category ? (
              <Badge key={categoryId} variant="secondary" className="cursor-pointer">
                {category.name}
                <X 
                  className="h-3 w-3 ml-1" 
                  onClick={() => removeCategoryFilter(categoryId)}
                />
              </Badge>
            ) : null
          })}

          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}

export default SearchBar