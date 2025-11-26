
import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FilterSectionProps {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
  className?: string
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  isExpanded, 
  onToggle, 
  children, 
  className = "" 
}) => (
  <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full text-left font-semibold text-gray-900 hover:text-blue-600 transition-all duration-200 transform hover:scale-[1.02]"
    >
      <span>{title}</span>
      <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>
    </button>
    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
      isExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
    }`}>
      {children}
    </div>
  </div>
)

export default FilterSection
