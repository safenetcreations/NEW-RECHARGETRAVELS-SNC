import React from 'react';
import {
    LayoutDashboard,
    Calendar,
    DollarSign,
    Settings,
    LogOut,
    Bell,
    MessageSquare,
    Star,
    Users,
    TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const VendorDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Sidebar */}
            <aside className="fixed left-0 top-20 w-64 h-[calc(100vh-5rem)] bg-white border-r border-gray-200 overflow-y-auto hidden lg:block">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            RT
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Recharge Travels</h3>
                            <p className="text-xs text-gray-500">Vendor Portal</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start text-blue-600 bg-blue-50">
                            <LayoutDashboard className="w-5 h-5 mr-3" />
                            Dashboard
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                            <Calendar className="w-5 h-5 mr-3" />
                            Bookings
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                            <MessageSquare className="w-5 h-5 mr-3" />
                            Messages
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                            <DollarSign className="w-5 h-5 mr-3" />
                            Earnings
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                            <Star className="w-5 h-5 mr-3" />
                            Reviews
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                            <Settings className="w-5 h-5 mr-3" />
                            Settings
                        </Button>
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50">
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
                        <p className="text-gray-500">Here's what's happening with your business today.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="relative">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            + New Service
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">$1,240</h3>
                            <p className="text-sm text-gray-500">Total Earnings</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+5</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">24</h3>
                            <p className="text-sm text-gray-500">Active Bookings</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">+18%</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">156</h3>
                            <p className="text-sm text-gray-500">Total Guests</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Star className="w-6 h-6 text-yellow-600" />
                                </div>
                                <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">4.9</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">4.9/5</h3>
                            <p className="text-sm text-gray-500">Average Rating</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Bookings & Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Recent Bookings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/150?img=${i}`} alt="User" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                                                    <p className="text-sm text-gray-500">Half-Day City Tour • 2 Guests</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">$120.00</p>
                                                <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                                    Confirmed
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Earnings Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <div className="text-center text-gray-500">
                                        <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Chart Visualization</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VendorDashboard;
