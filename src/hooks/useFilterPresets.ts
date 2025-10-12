
import { useState, useEffect } from 'react'
import { FilterOptions } from '@/types/hotel'

export interface FilterPreset {
  id: string
  name: string
  filters: FilterOptions
  createdAt: string
}

export const useFilterPresets = () => {
  const [presets, setPresets] = useState<FilterPreset[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load presets from localStorage on mount
  useEffect(() => {
    const savedPresets = localStorage.getItem('hotel-filter-presets')
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets))
      } catch (error) {
        console.error('Failed to load filter presets:', error)
      }
    }
  }, [])

  // Save presets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hotel-filter-presets', JSON.stringify(presets))
  }, [presets])

  const savePreset = (name: string, filters: FilterOptions) => {
    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name,
      filters: { ...filters },
      createdAt: new Date().toISOString()
    }
    setPresets(prev => [...prev, newPreset])
    return newPreset
  }

  const deletePreset = (id: string) => {
    setPresets(prev => prev.filter(preset => preset.id !== id))
  }

  const loadPreset = (id: string) => {
    const preset = presets.find(p => p.id === id)
    return preset?.filters || null
  }

  return {
    presets,
    isLoading,
    savePreset,
    deletePreset,
    loadPreset
  }
}
