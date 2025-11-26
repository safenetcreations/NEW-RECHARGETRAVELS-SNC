
import React from 'react'
import HotelCard from './HotelCard'
import { Hotel } from '@/types/hotel'
import { Loader2, MapPin, Globe } from 'lucide-react'

interface HotelSearchResultsProps {
  hotels: Hotel[]
  loading: boolean
  searchQuery: string
  usingGoogleAPI?: boolean
}

const HotelSearchResults: React.FC<HotelSearchResultsProps> = ({
  hotels,
  loading,
  searchQuery,
  usingGoogleAPI = false
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-4" />
        <p className="text-gray-600">
          {usingGoogleAPI ? 'Searching Google Hotels for Sri Lankan accommodations...' : 'Searching Sri Lankan hotels...'}
        </p>
      </div>
    )
  }

  if (hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Sri Lankan hotels found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? `No hotels found for "${searchQuery}" in Sri Lanka. Try different search terms.`
              : 'No hotels in Sri Lanka match your current search criteria. Try adjusting your filters.'
            }
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> We search both our local database and Google Hotels for Sri Lankan accommodations.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sri Lankan Hotels & Accommodations
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              {hotels.length} hotel{hotels.length !== 1 ? 's' : ''} found
            </span>
            {usingGoogleAPI && (
              <div className="flex items-center gap-1 text-blue-600">
                <Globe className="h-4 w-4" />
                <span>Powered by Google Hotels</span>
              </div>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-1">
              Search results for "{searchQuery}" in Sri Lanka
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>

      {hotels.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Showing {hotels.length} Sri Lankan hotel{hotels.length !== 1 ? 's' : ''}
            {usingGoogleAPI && ' via Google Hotels API'}
          </p>
        </div>
      )}
    </div>
  )
}

export default HotelSearchResults
