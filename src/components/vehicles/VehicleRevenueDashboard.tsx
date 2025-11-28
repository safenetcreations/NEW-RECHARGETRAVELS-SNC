import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Users,
  Car,
  Shield,
  Navigation,
  Wifi,
  Fuel,
  Sparkles,
  Baby,
  ArrowUp,
  ArrowDown,
  Plane,
  Building,
  Calendar,
  ChevronDown,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// Mock revenue data - In production, this would come from Firebase
const mockRevenueData = {
  period: 'This Month',
  totalRevenue: 45680,
  previousPeriodRevenue: 38420,
  totalBookings: 156,
  averageBookingValue: 293,
  
  // Revenue breakdown by source
  revenueBreakdown: {
    baseRental: 28500,
    rentalCommission: 4275, // 15% of base
    serviceFees: 2850, // 10% of base
    insuranceRevenue: 6420,
    insuranceCommission: 1284, // ~20% avg
    deliveryRevenue: 3890,
    deliveryCommission: 3890, // 100%
    additionalServices: 4020,
    servicesCommission: 1206, // ~30% avg
  },
  
  // Insurance package breakdown
  insuranceStats: {
    basic: { count: 42, revenue: 1512, commission: 151 },
    silver: { count: 78, revenue: 3276, commission: 655 },
    gold: { count: 36, revenue: 1620, commission: 243 }
  },
  
  // Delivery breakdown
  deliveryStats: {
    airport: { count: 45, revenue: 2025 },
    hotel: { count: 32, revenue: 1120 },
    city: { count: 28, revenue: 700 },
    custom: { count: 9, revenue: 450 }
  },
  
  // Additional services breakdown
  servicesStats: {
    gps: { count: 89, revenue: 1068, commission: 320 },
    child_seat: { count: 34, revenue: 510, commission: 204 },
    wifi_hotspot: { count: 67, revenue: 1206, commission: 422 },
    fuel_delivery: { count: 23, revenue: 345, commission: 138 },
    vehicle_wash: { count: 45, revenue: 540, commission: 162 },
    extra_driver: { count: 31, revenue: 930, commission: 232 }
  },
  
  // Payout stats
  payoutStats: {
    totalOwnerPayouts: 32890,
    pendingPayouts: 4560,
    completedPayouts: 28330,
    firstPayouts: 2280, // 50% pending first payouts
    secondPayouts: 2280, // 50% pending second payouts
  },
  
  // Take rate calculation
  takeRate: {
    overall: 28.2, // Platform takes 28.2% overall
    rentalOnly: 15,
    withAddons: 35.4
  }
};

// Recent payouts data
const mockRecentPayouts = [
  { id: 1, owner: 'Nuwan Perera', vehicle: 'Toyota Prius', amount: 238, status: 'paid', type: 'first', date: '2025-01-15' },
  { id: 2, owner: 'Saman Silva', vehicle: 'Honda Civic', amount: 315, status: 'pending', type: 'second', date: '2025-01-16' },
  { id: 3, owner: 'Kamal Fernando', vehicle: 'Toyota Hiace', amount: 520, status: 'processing', type: 'first', date: '2025-01-15' },
  { id: 4, owner: 'Priya Dias', vehicle: 'Suzuki Swift', amount: 142, status: 'paid', type: 'second', date: '2025-01-14' },
  { id: 5, owner: 'Ranjan Kumar', vehicle: 'Toyota Alphard', amount: 680, status: 'pending', type: 'first', date: '2025-01-16' },
];

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color?: string;
  prefix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color = 'amber', prefix = '$' }) => {
  const colorClasses: Record<string, string> = {
    amber: 'bg-amber-500/10 text-amber-600',
    green: 'bg-green-500/10 text-green-600',
    blue: 'bg-blue-500/10 text-blue-600',
    purple: 'bg-purple-500/10 text-purple-600',
  };
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span>{Math.abs(change)}% vs last period</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const VehicleRevenueDashboard: React.FC = () => {
  const [period, setPeriod] = useState('month');
  const data = mockRevenueData;
  
  const totalPlatformRevenue = 
    data.revenueBreakdown.rentalCommission +
    data.revenueBreakdown.serviceFees +
    data.revenueBreakdown.insuranceCommission +
    data.revenueBreakdown.deliveryCommission +
    data.revenueBreakdown.servicesCommission;

  const revenueChange = ((data.totalRevenue - data.previousPeriodRevenue) / data.previousPeriodRevenue * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Rental Revenue</h1>
          <p className="text-gray-500">Commission breakdown and payout tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-400/50"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gross Revenue"
          value={data.totalRevenue}
          change={Number(revenueChange)}
          icon={DollarSign}
          color="amber"
        />
        <StatCard
          title="Platform Earnings"
          value={totalPlatformRevenue}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Total Bookings"
          value={data.totalBookings}
          icon={Car}
          color="blue"
          prefix=""
        />
        <StatCard
          title="Average Take Rate"
          value={`${data.takeRate.overall}%`}
          icon={PieChart}
          color="purple"
          prefix=""
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission Sources */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission Breakdown</h2>
          
          <div className="space-y-4">
            {/* Rental Commission */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Base Rental (15%)</p>
                  <p className="text-sm text-gray-500">${data.revenueBreakdown.baseRental.toLocaleString()} gross</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${data.revenueBreakdown.rentalCommission.toLocaleString()}</p>
                <p className="text-xs text-gray-500">commission</p>
              </div>
            </div>

            {/* Service Fee */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Guest Service Fee (10%)</p>
                  <p className="text-sm text-gray-500">Charged to customers</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${data.revenueBreakdown.serviceFees.toLocaleString()}</p>
                <p className="text-xs text-gray-500">100% platform</p>
              </div>
            </div>

            {/* Insurance */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Insurance (10-20%)</p>
                  <p className="text-sm text-gray-500">${data.revenueBreakdown.insuranceRevenue.toLocaleString()} sold</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${data.revenueBreakdown.insuranceCommission.toLocaleString()}</p>
                <p className="text-xs text-gray-500">commission</p>
              </div>
            </div>

            {/* Delivery */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Plane className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Delivery (100%)</p>
                  <p className="text-sm text-gray-500">{data.deliveryStats.airport.count + data.deliveryStats.hotel.count + data.deliveryStats.city.count + data.deliveryStats.custom.count} deliveries</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${data.revenueBreakdown.deliveryCommission.toLocaleString()}</p>
                <p className="text-xs text-green-600">100% platform</p>
              </div>
            </div>

            {/* Add-on Services */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Add-on Services (25-40%)</p>
                  <p className="text-sm text-gray-500">${data.revenueBreakdown.additionalServices.toLocaleString()} sold</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${data.revenueBreakdown.servicesCommission.toLocaleString()}</p>
                <p className="text-xs text-gray-500">commission</p>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="font-semibold text-gray-900">Total Platform Revenue</div>
              <div className="text-xl font-bold text-amber-600">${totalPlatformRevenue.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Insurance & Delivery Stats */}
        <div className="space-y-6">
          {/* Insurance Packages */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Insurance Packages</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-sm text-gray-600">Basic ($6/day)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{data.insuranceStats.basic.count} bookings</span>
                  <span className="font-medium">${data.insuranceStats.basic.revenue}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-sm text-gray-600">Silver ($14/day) ⭐</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{data.insuranceStats.silver.count} bookings</span>
                  <span className="font-medium">${data.insuranceStats.silver.revenue}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span className="text-sm text-gray-600">Gold ($30/day)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{data.insuranceStats.gold.count} bookings</span>
                  <span className="font-medium">${data.insuranceStats.gold.revenue}</span>
                </div>
              </div>
            </div>

            {/* Insurance bar chart */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-end gap-2 h-20">
                <div className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gray-200 rounded-t" 
                    style={{ height: `${(data.insuranceStats.basic.count / data.insuranceStats.silver.count) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">Basic</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-400 rounded-t" 
                    style={{ height: '100%' }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">Silver</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-amber-400 rounded-t" 
                    style={{ height: `${(data.insuranceStats.gold.count / data.insuranceStats.silver.count) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">Gold</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Revenue</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <Plane className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">${data.deliveryStats.airport.revenue}</p>
                <p className="text-xs text-gray-500">Airport ({data.deliveryStats.airport.count})</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <Building className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">${data.deliveryStats.hotel.revenue}</p>
                <p className="text-xs text-gray-500">Hotel ({data.deliveryStats.hotel.count})</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <Navigation className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">${data.deliveryStats.city.revenue}</p>
                <p className="text-xs text-gray-500">City ({data.deliveryStats.city.count})</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg text-center">
                <TrendingUp className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">${data.deliveryStats.custom.revenue}</p>
                <p className="text-xs text-gray-500">Custom ({data.deliveryStats.custom.count})</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Tracking */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Owner Payouts (50/50 System)</h2>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-gray-500">Paid</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-gray-500">Processing</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-gray-500">Pending</span>
            </div>
          </div>
        </div>

        {/* Payout Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Payouts</p>
            <p className="text-xl font-bold text-gray-900">${data.payoutStats.totalOwnerPayouts.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-xl font-bold text-green-600">${data.payoutStats.completedPayouts.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-gray-500">First Payout (6hr)</p>
            <p className="text-xl font-bold text-amber-600">${data.payoutStats.firstPayouts.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-500">Second Payout (72hr)</p>
            <p className="text-xl font-bold text-blue-600">${data.payoutStats.secondPayouts.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Payouts Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Owner</th>
                <th className="pb-3 font-medium">Vehicle</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {mockRecentPayouts.map((payout) => (
                <tr key={payout.id} className="border-b border-gray-50">
                  <td className="py-3 font-medium text-gray-900">{payout.owner}</td>
                  <td className="py-3 text-gray-600">{payout.vehicle}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payout.type === 'first' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {payout.type === 'first' ? '50% (6hr)' : '50% (72hr)'}
                    </span>
                  </td>
                  <td className="py-3 font-medium">${payout.amount}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      payout.status === 'paid' ? 'bg-green-100 text-green-700' :
                      payout.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {payout.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                      {payout.status === 'processing' && <Clock className="w-3 h-3" />}
                      {payout.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(payout.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add-on Services Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add-on Services Performance</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(data.servicesStats).map(([key, stats]) => {
            const icons: Record<string, React.ElementType> = {
              gps: Navigation,
              child_seat: Baby,
              wifi_hotspot: Wifi,
              fuel_delivery: Fuel,
              vehicle_wash: Sparkles,
              extra_driver: Users
            };
            const labels: Record<string, string> = {
              gps: 'GPS',
              child_seat: 'Child Seat',
              wifi_hotspot: 'WiFi',
              fuel_delivery: 'Fuel',
              vehicle_wash: 'Wash',
              extra_driver: 'Extra Driver'
            };
            const Icon = icons[key] || Wifi;
            
            return (
              <div key={key} className="p-4 bg-gray-50 rounded-lg text-center">
                <Icon className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="font-bold text-gray-900">${stats.revenue}</p>
                <p className="text-xs text-gray-500">{labels[key]}</p>
                <p className="text-xs text-green-600 mt-1">+${stats.commission} comm</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Take Rate Analysis */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Take Rate Analysis</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold">{data.takeRate.rentalOnly}%</p>
            <p className="text-sm opacity-80">Rental Only</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold">{data.takeRate.overall}%</p>
            <p className="text-sm opacity-80">Overall Average</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold">{data.takeRate.withAddons}%</p>
            <p className="text-sm opacity-80">With All Add-ons</p>
          </div>
        </div>
        <p className="text-sm mt-4 opacity-80">
          💡 Tip: Promoting insurance and delivery services can increase take rate from 15% to over 35%
        </p>
      </div>
    </div>
  );
};

export default VehicleRevenueDashboard;
