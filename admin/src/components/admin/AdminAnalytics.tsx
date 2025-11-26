
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  Calendar,
  DollarSign 
} from 'lucide-react'

interface Driver {
  id: string
  overall_verification_status: string
  created_at: string
  experience_years: number
}

interface AdminStats {
  totalDrivers: number
  pendingVerifications: number
  approvedDrivers: number
  rejectedDrivers: number
  totalBookings: number
  completedBookings: number
  pendingBookings: number
  totalEarnings: number
}

interface AdminAnalyticsProps {
  drivers: Driver[]
  stats: AdminStats
}

const AdminAnalytics = ({ drivers, stats }: AdminAnalyticsProps) => {
  // Prepare data for charts
  const verificationStatusData = [
    { name: 'Approved', value: stats.approvedDrivers, color: '#10B981' },
    { name: 'Pending', value: stats.pendingVerifications, color: '#F59E0B' },
    { name: 'Rejected', value: stats.rejectedDrivers, color: '#EF4444' },
    { name: 'Under Review', value: drivers.filter(d => d.overall_verification_status === 'under_review').length, color: '#3B82F6' }
  ]

  // Registration trends (last 30 days)
  const getRegistrationTrends = () => {
    const last30Days = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      
      const count = drivers.filter(driver => 
        driver.created_at.split('T')[0] === dateString
      ).length
      
      last30Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        registrations: count
      })
    }
    return last30Days
  }

  const registrationTrends = getRegistrationTrends()

  // Experience level distribution
  const experienceData = [
    { range: '1-2 years', count: drivers.filter(d => d.experience_years >= 1 && d.experience_years <= 2).length },
    { range: '3-5 years', count: drivers.filter(d => d.experience_years >= 3 && d.experience_years <= 5).length },
    { range: '6-10 years', count: drivers.filter(d => d.experience_years >= 6 && d.experience_years <= 10).length },
    { range: '10+ years', count: drivers.filter(d => d.experience_years > 10).length }
  ]

  const kpiCards = [
    {
      title: 'Approval Rate',
      value: `${((stats.approvedDrivers / stats.totalDrivers) * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Avg. Processing Time',
      value: '2.5 days',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Drivers',
      value: stats.approvedDrivers.toString(),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Revenue Generated',
      value: `$${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="flex items-center p-6">
              <div className={`p-3 rounded-full ${kpi.bgColor} mr-4`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={verificationStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {verificationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Experience Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Experience Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={experienceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Registration Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Registration Trends (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={registrationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="registrations" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminAnalytics
