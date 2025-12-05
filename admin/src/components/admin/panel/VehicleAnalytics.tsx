import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
    BarChart3, TrendingUp, DollarSign, Car, Calendar, Users, RefreshCw,
    ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Eye
} from 'lucide-react';

interface BookingData {
    id: string;
    customerName: string;
    categoryName: string;
    variantName: string;
    pickupDate: string;
    returnDate: string;
    totalDays: number;
    estimatedPrice: number;
    status: string;
    createdAt: any;
}

const VehicleAnalytics: React.FC = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const snap = await getDocs(query(collection(db, 'vehicleBookingRequests'), orderBy('createdAt', 'desc')));
            setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })) as BookingData[]);
        } catch (e) {
            toast({ title: 'Error loading data', variant: 'destructive' });
        }
        setLoading(false);
    };

    // Filter by date range
    const filteredBookings = useMemo(() => {
        if (dateRange === 'all') return bookings;
        const now = new Date();
        const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        return bookings.filter(b => {
            const created = b.createdAt?.toDate?.() || new Date(b.createdAt);
            return created >= cutoff;
        });
    }, [bookings, dateRange]);

    // Analytics calculations
    const analytics = useMemo(() => {
        const paid = filteredBookings.filter(b => b.status === 'paid' || b.status === 'completed');
        const revenue = paid.reduce((sum, b) => sum + (b.estimatedPrice || 0), 0);
        const avgBookingValue = paid.length > 0 ? revenue / paid.length : 0;
        const totalDays = paid.reduce((sum, b) => sum + (b.totalDays || 0), 0);

        // Category popularity
        const categoryCount: Record<string, number> = {};
        filteredBookings.forEach(b => {
            categoryCount[b.categoryName] = (categoryCount[b.categoryName] || 0) + 1;
        });
        const popularCategories = Object.entries(categoryCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Status breakdown
        const statusCount: Record<string, number> = {};
        filteredBookings.forEach(b => {
            statusCount[b.status] = (statusCount[b.status] || 0) + 1;
        });

        // Monthly revenue (for chart)
        const monthlyRevenue: Record<string, number> = {};
        paid.forEach(b => {
            const date = b.createdAt?.toDate?.() || new Date(b.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyRevenue[key] = (monthlyRevenue[key] || 0) + (b.estimatedPrice || 0);
        });

        return { revenue, avgBookingValue, totalDays, popularCategories, statusCount, monthlyRevenue, totalBookings: filteredBookings.length, paidBookings: paid.length };
    }, [filteredBookings]);

    // Calendar data
    const calendarBookings = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        const bookingsByDate: Record<string, BookingData[]> = {};
        bookings.forEach(b => {
            const start = new Date(b.pickupDate);
            const end = new Date(b.returnDate);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                if (d.getMonth() === month && d.getFullYear() === year) {
                    const key = d.getDate().toString();
                    if (!bookingsByDate[key]) bookingsByDate[key] = [];
                    bookingsByDate[key].push(b);
                }
            }
        });

        return { daysInMonth, firstDay, bookingsByDate };
    }, [bookings, currentMonth]);

    if (loading) {
        return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-amber-600" /></div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-amber-500" />
                        Vehicle Rental Analytics
                    </h1>
                    <p className="text-gray-500">Revenue, bookings, and calendar overview</p>
                </div>
                <div className="flex gap-2">
                    {(['7d', '30d', '90d', 'all'] as const).map(range => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${dateRange === range ? 'bg-amber-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            {range === 'all' ? 'All Time' : range.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total Revenue" value={`$${analytics.revenue.toLocaleString()}`} icon={DollarSign} color="green" change={12} />
                <StatCard title="Total Bookings" value={analytics.totalBookings.toString()} icon={Calendar} color="blue" />
                <StatCard title="Avg Booking" value={`$${Math.round(analytics.avgBookingValue)}`} icon={TrendingUp} color="purple" />
                <StatCard title="Rental Days" value={analytics.totalDays.toString()} icon={Car} color="amber" />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl p-6 border shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
                    <div className="h-48 flex items-end gap-2">
                        {Object.entries(analytics.monthlyRevenue).slice(-6).map(([month, value]) => {
                            const maxVal = Math.max(...Object.values(analytics.monthlyRevenue));
                            const height = maxVal > 0 ? (value / maxVal) * 100 : 0;
                            return (
                                <div key={month} className="flex-1 flex flex-col items-center gap-1">
                                    <div className="w-full bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-lg transition-all" style={{ height: `${height}%`, minHeight: '4px' }} />
                                    <span className="text-xs text-gray-500">{month.split('-')[1]}</span>
                                    <span className="text-xs font-medium">${(value / 1000).toFixed(1)}k</span>
                                </div>
                            );
                        })}
                        {Object.keys(analytics.monthlyRevenue).length === 0 && (
                            <p className="text-gray-400 text-center w-full">No revenue data yet</p>
                        )}
                    </div>
                </div>

                {/* Popular Categories */}
                <div className="bg-white rounded-xl p-6 border shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">Popular Vehicle Categories</h3>
                    <div className="space-y-3">
                        {analytics.popularCategories.map(([cat, count], i) => (
                            <div key={cat} className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{cat}</span>
                                        <span className="text-gray-500">{count} bookings</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(count / analytics.totalBookings) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {analytics.popularCategories.length === 0 && <p className="text-gray-400">No booking data yet</p>}
                    </div>
                </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Booking Status Breakdown</h3>
                <div className="flex flex-wrap gap-4">
                    {Object.entries(analytics.statusCount).map(([status, count]) => {
                        const colors: Record<string, string> = {
                            pending: 'bg-amber-100 text-amber-800',
                            confirmed: 'bg-blue-100 text-blue-800',
                            paid: 'bg-green-100 text-green-800',
                            completed: 'bg-emerald-100 text-emerald-800',
                            cancelled: 'bg-red-100 text-red-800',
                            alternative_offered: 'bg-purple-100 text-purple-800'
                        };
                        return (
                            <div key={status} className={`px-4 py-2 rounded-lg ${colors[status] || 'bg-gray-100'}`}>
                                <span className="font-medium capitalize">{status.replace('_', ' ')}</span>
                                <span className="ml-2 text-lg font-bold">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Calendar View */}
            <div className="bg-white rounded-xl p-6 border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Booking Calendar</h3>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="font-medium min-w-[140px] text-center">
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
                    ))}
                    {Array.from({ length: calendarBookings.firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                    {Array.from({ length: calendarBookings.daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dayBookings = calendarBookings.bookingsByDate[day.toString()] || [];
                        const hasBookings = dayBookings.length > 0;
                        return (
                            <div
                                key={day}
                                className={`aspect-square p-1 rounded-lg border text-center relative ${hasBookings ? 'bg-amber-50 border-amber-200' : 'border-gray-100 hover:bg-gray-50'}`}
                            >
                                <span className="text-sm font-medium">{day}</span>
                                {hasBookings && (
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {dayBookings.length}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: string; icon: any; color: string; change?: number }> = ({ title, value, icon: Icon, color, change }) => {
    const colors: Record<string, string> = {
        green: 'bg-green-50 text-green-600 border-green-200',
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200',
        amber: 'bg-amber-50 text-amber-600 border-amber-200'
    };
    return (
        <div className={`rounded-xl p-4 border ${colors[color]}`}>
            <div className="flex items-center gap-3">
                <Icon className="w-8 h-8" />
                <div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-sm">{title}</p>
                    {change !== undefined && (
                        <p className={`text-xs flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            {Math.abs(change)}% vs last period
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleAnalytics;
