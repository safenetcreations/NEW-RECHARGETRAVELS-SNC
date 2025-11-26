
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TourPackageWithTour {
  id: string
  package_name: string
  description?: string
  discount_percentage: number
  package_price?: number
  tour?: {
    title: string
    duration_days: number
    difficulty_level: string
  }
}

interface HotelTourPackagesProps {
  tourPackages: TourPackageWithTour[]
}

const HotelTourPackages: React.FC<HotelTourPackagesProps> = ({ tourPackages }) => {
  if (tourPackages.length === 0) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Available Tour Packages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tourPackages.map((tourPackage) => (
            <div key={tourPackage.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{tourPackage.package_name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{tourPackage.description}</p>
                  <div className="text-sm text-gray-600">
                    <p><strong>Tour:</strong> {tourPackage.tour?.title}</p>
                    <p><strong>Duration:</strong> {tourPackage.tour?.duration_days} days</p>
                    <p><strong>Difficulty:</strong> {tourPackage.tour?.difficulty_level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">${tourPackage.package_price}</div>
                  <div className="text-gray-600 text-sm">
                    {tourPackage.discount_percentage > 0 && (
                      <span className="text-red-500">Save {tourPackage.discount_percentage}%</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default HotelTourPackages
