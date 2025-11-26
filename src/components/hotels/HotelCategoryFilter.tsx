
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { dbService, authService, storageService } from '@/lib/firebase-services'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HotelCategory, HotelStyle } from '@/types/hotel'

interface HotelCategoryFilterProps {
  selectedCategory?: string
  selectedStyles: string[]
  onCategoryChange: (categoryId: string) => void
  onStyleChange: (styles: string[]) => void
}

const HotelCategoryFilter: React.FC<HotelCategoryFilterProps> = ({
  selectedCategory,
  selectedStyles,
  onCategoryChange,
  onStyleChange
}) => {
  const { data: categories } = useQuery({
    queryKey: ['hotel-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotel_categories')
        .select('*')
        .order('name')

      if (error) throw error
      return data as HotelCategory[]
    }
  })

  const { data: styles } = useQuery({
    queryKey: ['hotel-styles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotel_styles')
        .select('*')
        .order('name')

      if (error) throw error
      return data as HotelStyle[]
    }
  })

  const handleStyleToggle = (styleName: string) => {
    const newStyles = selectedStyles.includes(styleName)
      ? selectedStyles.filter(s => s !== styleName)
      : [...selectedStyles, styleName]
    onStyleChange(newStyles)
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Hotel Categories</h3>
        <div className="space-y-2">
          <Button
            variant={!selectedCategory || selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange('all')}
            className="w-full justify-start"
          >
            All Categories
          </Button>
          {categories?.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className="w-full justify-start"
            >
              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Styles */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Hotel Styles</h3>
        <div className="flex flex-wrap gap-2">
          {styles?.map((style) => (
            <Badge
              key={style.id}
              variant={selectedStyles.includes(style.name) ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-teal-green hover:text-white"
              onClick={() => handleStyleToggle(style.name)}
            >
              {style.name.charAt(0).toUpperCase() + style.name.slice(1)}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HotelCategoryFilter
