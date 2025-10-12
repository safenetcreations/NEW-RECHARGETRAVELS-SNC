
import { Card, CardContent } from '@/components/ui/card'
import { 
  Calendar, 
  CheckCircle, 
  DollarSign,
  Star
} from 'lucide-react'

interface DriverStats {
  totalBookings: number
  completedBookings: number
  pendingBookings: number
  totalEarnings: number
  averageRating: number
  verificationStatus: string
}

interface DriverStatsCardsProps {
  stats: DriverStats
}

const DriverStatsCards = ({ stats }: DriverStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="flex items-center p-6">
          <Calendar className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Bookings</p>
            <p className="text-2xl font-bold">{stats.totalBookings}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold">{stats.completedBookings}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <DollarSign className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Earnings</p>
            <p className="text-2xl font-bold">${stats.totalEarnings}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <Star className="h-8 w-8 text-yellow-500 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-600">Rating</p>
            <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DriverStatsCards
