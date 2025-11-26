import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Sample data for revenue chart
const revenueData = [
  { month: 'Jan', revenue: 4200, bookings: 120 },
  { month: 'Feb', revenue: 5100, bookings: 145 },
  { month: 'Mar', revenue: 6800, bookings: 189 },
  { month: 'Apr', revenue: 7500, bookings: 210 },
  { month: 'May', revenue: 8200, bookings: 245 },
  { month: 'Jun', revenue: 9100, bookings: 278 },
  { month: 'Jul', revenue: 10500, bookings: 312 },
  { month: 'Aug', revenue: 11200, bookings: 345 },
  { month: 'Sep', revenue: 9800, bookings: 298 },
  { month: 'Oct', revenue: 10800, bookings: 325 },
  { month: 'Nov', revenue: 12100, bookings: 367 },
  { month: 'Dec', revenue: 13500, bookings: 402 }
];

// Sample data for bookings by type
const bookingTypeData = [
  { name: 'Tours', value: 45, color: '#8b5cf6' },
  { name: 'Hotels', value: 30, color: '#ec4899' },
  { name: 'Transfers', value: 15, color: '#3b82f6' },
  { name: 'Experiences', value: 10, color: '#10b981' }
];

// Sample data for traffic sources
const trafficData = [
  { source: 'Organic', visitors: 4200 },
  { source: 'Social', visitors: 2800 },
  { source: 'Direct', visitors: 3100 },
  { source: 'Referral', visitors: 1900 },
  { source: 'Email', visitors: 1500 }
];

// Sample data for popular destinations
const destinationData = [
  { name: 'Sigiriya', bookings: 245 },
  { name: 'Ella', bookings: 198 },
  { name: 'Mirissa', bookings: 167 },
  { name: 'Kandy', bookings: 156 },
  { name: 'Galle', bookings: 134 }
];

interface DashboardChartsProps {
  timeRange?: 'today' | 'week' | 'month' | 'year';
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ timeRange = 'month' }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue & Bookings Trend */}
      <div className="admin-card p-6 col-span-1 lg:col-span-2">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">Revenue & Bookings Trend</h3>
          <p className="text-sm text-gray-500">Monthly performance overview</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Revenue ($)"
            />
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="#ec4899"
              fillOpacity={1}
              fill="url(#colorBookings)"
              name="Bookings"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bookings by Type (Pie Chart) */}
      <div className="admin-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">Bookings by Type</h3>
          <p className="text-sm text-gray-500">Distribution across services</p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={bookingTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {bookingTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {bookingTypeData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="admin-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">Traffic Sources</h3>
          <p className="text-sm text-gray-500">Visitor acquisition channels</p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="source" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="visitors" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Popular Destinations */}
      <div className="admin-card p-6 col-span-1 lg:col-span-2">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">Popular Destinations</h3>
          <p className="text-sm text-gray-500">Top booked destinations this month</p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={destinationData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis dataKey="name" type="category" stroke="#6b7280" width={80} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="bookings" fill="#10b981" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
