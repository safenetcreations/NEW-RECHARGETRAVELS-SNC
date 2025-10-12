
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { hotelDataService } from '@/services/hotelDataService'
import { insertSampleHotels } from '@/utils/sampleHotelData'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const HotelDebug: React.FC = () => {
  const { data: hotels = [], isLoading, error, refetch } = useQuery({
    queryKey: ['hotels-debug'],
    queryFn: () => hotelDataService.getAllHotels(),
  })

  const handleAddSampleData = async () => {
    const result = await insertSampleHotels()
    if (result.success) {
      alert('Sample hotels added successfully!')
      refetch()
    } else {
      alert('Error adding sample hotels: ' + JSON.stringify(result.error))
    }
  }

  return (
    <Card className="m-4 max-w-2xl">
      <CardHeader>
        <CardTitle>Hotel Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Status:</strong> {isLoading ? 'Loading...' : error ? 'Error' : 'Loaded'}
        </div>
        
        {error && (
          <div className="text-red-600">
            <strong>Error:</strong> {JSON.stringify(error)}
          </div>
        )}
        
        <div>
          <strong>Hotels Found:</strong> {hotels.length}
        </div>
        
        {hotels.length === 0 && (
          <Button onClick={handleAddSampleData} className="w-full">
            Add Sample Hotel Data
          </Button>
        )}
        
        <Button onClick={() => refetch()} variant="outline" className="w-full">
          Refresh Data
        </Button>
        
        {hotels.length > 0 && (
          <div className="text-sm">
            <strong>Hotels:</strong>
            <ul className="list-disc ml-6 mt-2">
              {hotels.slice(0, 5).map(hotel => (
                <li key={hotel.id}>{hotel.name} - ${hotel.base_price_per_night}/night</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default HotelDebug
