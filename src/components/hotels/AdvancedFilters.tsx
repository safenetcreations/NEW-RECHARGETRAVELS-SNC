
import React from 'react'
import { Filter } from 'lucide-react'
import { FilterOptions } from '@/types/hotel'
import { useFilterPresets } from '@/hooks/useFilterPresets'
import { useHotelFilterData } from '@/hooks/useHotelFilterData'
import { useFilterHandlers } from './filters/useFilterHandlers'
import { useAmenitiesConfig } from './filters/useAmenitiesConfig'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// Import all the separated components
import FilterSection from './filters/FilterSection'
import StarRatingFilter from './filters/StarRatingFilter'
import PriceRangeFilter from './filters/PriceRangeFilter'
import HotelTypeFilter from './filters/HotelTypeFilter'
import AmenitiesFilter from './filters/AmenitiesFilter'
import LocationFilter from './filters/LocationFilter'
import AdvancedFiltersSection from './filters/AdvancedFiltersSection'
import FilterPresetsSection from './filters/FilterPresetsSection'
import ActiveFiltersSummary from './filters/ActiveFiltersSummary'

interface AdvancedFiltersProps {
  filters: FilterOptions
  onFilterChange: (newFilters: Partial<FilterOptions>) => void
  availableOptions?: {
    cities?: Array<{ id: string; name: string }>
    amenities?: Array<{ id: string; name: string; category: string }>
  }
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  filters, 
  onFilterChange,
  availableOptions = {}
}) => {
  const { amenities, cities } = useHotelFilterData()
  const amenitiesConfig = useAmenitiesConfig(amenities)
  const { presets, savePreset, deletePreset, loadPreset } = useFilterPresets()
  
  const {
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
  } = useFilterHandlers(filters, onFilterChange)

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast.error('Please enter a name for your preset')
      return
    }

    if (activeFiltersCount === 0) {
      toast.error('No filters are currently applied')
      return
    }

    savePreset(presetName.trim(), filters)
    setPresetName('')
    setShowPresetDialog(false)
    toast.success(`Filter preset "${presetName}" saved!`)
  }

  const handleLoadPreset = (presetId: string) => {
    const presetFilters = loadPreset(presetId)
    if (presetFilters) {
      onFilterChange(presetFilters)
      toast.success('Filter preset loaded')
    }
  }

  const handleDeletePreset = (presetId: string, presetName: string) => {
    deletePreset(presetId)
    toast.success(`Preset "${presetName}" deleted`)
  }

  const citiesToShow = cities?.length ? cities : availableOptions.cities || []

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl">
      {/* Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full animate-pulse">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            onClick={clearAllFilters}
            variant="outline"
            size="sm"
            className="text-blue-600 hover:text-blue-800 transition-all hover:scale-[1.02]"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="space-y-6">
        <FilterSection
          title="Filter Presets"
          isExpanded={expandedSections.presets}
          onToggle={() => toggleSection('presets')}
        >
          <FilterPresetsSection
            presets={presets}
            presetName={presetName}
            setPresetName={setPresetName}
            showPresetDialog={showPresetDialog}
            setShowPresetDialog={setShowPresetDialog}
            activeFiltersCount={activeFiltersCount}
            handleSavePreset={handleSavePreset}
            handleLoadPreset={handleLoadPreset}
            handleDeletePreset={handleDeletePreset}
          />
        </FilterSection>

        <FilterSection
          title="Price Range"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <PriceRangeFilter filters={filters} updateFilter={updateFilter} />
        </FilterSection>

        <FilterSection
          title="Star Rating"
          isExpanded={expandedSections.rating}
          onToggle={() => toggleSection('rating')}
        >
          <StarRatingFilter filters={filters} toggleArrayFilter={toggleArrayFilter} />
        </FilterSection>

        <FilterSection
          title="Hotel Type"
          isExpanded={expandedSections.type}
          onToggle={() => toggleSection('type')}
        >
          <HotelTypeFilter filters={filters} toggleArrayFilter={toggleArrayFilter} />
        </FilterSection>

        <FilterSection
          title="Location & Search"
          isExpanded={expandedSections.location}
          onToggle={() => toggleSection('location')}
        >
          <LocationFilter 
            filters={filters} 
            updateFilter={updateFilter} 
            cities={citiesToShow}
          />
        </FilterSection>

        <FilterSection
          title="Amenities"
          isExpanded={expandedSections.amenities}
          onToggle={() => toggleSection('amenities')}
        >
          <AmenitiesFilter 
            filters={filters} 
            amenitiesConfig={amenitiesConfig}
            toggleArrayFilter={toggleArrayFilter} 
          />
        </FilterSection>

        <FilterSection
          title="Advanced Filters"
          isExpanded={expandedSections.advanced}
          onToggle={() => toggleSection('advanced')}
        >
          <AdvancedFiltersSection 
            filters={filters} 
            toggleArrayFilter={toggleArrayFilter} 
          />
        </FilterSection>
      </div>

      {/* Active Filters Summary */}
      <ActiveFiltersSummary
        filters={filters}
        activeFiltersCount={activeFiltersCount}
        toggleArrayFilter={toggleArrayFilter}
        updateFilter={updateFilter}
      />
    </div>
  )
}

export default AdvancedFilters
