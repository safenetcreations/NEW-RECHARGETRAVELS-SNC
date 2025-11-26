
import { useState, useEffect } from 'react'
import { FilterOptions } from '@/types/hotel'
import { SectionState } from './types'
import { toast } from 'sonner'

export const useFilterHandlers = (
  filters: FilterOptions,
  onFilterChange: (newFilters: Partial<FilterOptions>) => void
) => {
  const [expandedSections, setExpandedSections] = useState<SectionState>({
    price: true,
    rating: true,
    type: true,
    amenities: false,
    location: false,
    advanced: false,
    presets: false
  })

  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [presetName, setPresetName] = useState('')
  const [showPresetDialog, setShowPresetDialog] = useState(false)

  useEffect(() => {
    let count = 0
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++
    if (filters.starRating.length > 0) count++
    if (filters.hotelType.length > 0) count++
    if (filters.amenities.length > 0) count++
    if (filters.cityId && filters.cityId !== '') count++
    if (filters.searchQuery && filters.searchQuery !== '') count++
    
    setActiveFiltersCount(count)
  }, [filters])

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFilterChange({ [key]: value })
  }

  const toggleArrayFilter = (key: 'starRating' | 'hotelType' | 'amenities', value: any) => {
    const currentArray = filters[key] as any[]
    const newArray = currentArray.includes(value) 
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    onFilterChange({ [key]: newArray })
  }

  const clearAllFilters = () => {
    onFilterChange({
      priceRange: [0, 1000],
      starRating: [],
      hotelType: [],
      amenities: [],
      cityId: '',
      searchQuery: ''
    })
    toast.success('All filters cleared')
  }

  const toggleSection = (section: keyof SectionState) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return {
    expandedSections,
    activeFiltersCount,
    presetName,
    setPresetName,
    showPresetDialog,
    setShowPresetDialog,
    updateFilter,
    toggleArrayFilter,
    clearAllFilters,
    toggleSection
  }
}
