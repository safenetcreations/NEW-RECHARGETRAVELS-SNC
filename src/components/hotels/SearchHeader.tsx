
import React from 'react'
import { Search, Filter, Sparkles } from 'lucide-react'

interface SearchHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onToggleFilters: () => void
  onGetAIRecommendations: () => void
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onToggleFilters,
  onGetAIRecommendations
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
      <h1 className="text-4xl font-bold mb-4">Find Your Perfect Stay</h1>
      <p className="text-xl opacity-90 mb-6">Discover amazing hotels with AI-powered recommendations</p>
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by hotel name, city, or location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
        
        <button
          onClick={onToggleFilters}
          className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-lg hover:bg-opacity-30 transition-all flex items-center"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
        
        <button
          onClick={onGetAIRecommendations}
          className="bg-purple-500 px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          AI Recommendations
        </button>
      </div>
    </div>
  )
}

export default SearchHeader
