import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Check, 
  CheckCheck,
  X,
  Car,
  DollarSign,
  Calendar,
  MessageSquare,
  AlertTriangle,
  Info,
  Shield,
  Gift,
  Settings,
  Trash2,
  Filter,
  Clock,
  ChevronRight,
  RefreshCw,
  MailOpen,
  Mail
} from 'lucide-react';

// Notification types
type NotificationType = 
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'payment_received'
  | 'payout_completed'
  | 'vehicle_approved'
  | 'vehicle_rejected'
  | 'new_message'
  | 'review_received'
  | 'document_verified'
  | 'deposit_released'
  | 'deposit_held'
  | 'system_alert'
  | 'promotion';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    bookingId?: string;
    vehicleId?: string;
    vehicleName?: string;
    amount?: number;
    conversationId?: string;
    link?: string;
  };
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

interface NotificationGroup {
  date: string;
  notifications: Notification[];
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockNotifications: Notification[] = [
        {
          id: 'notif-001',
          type: 'booking_confirmed',
          title: 'Booking Confirmed!',
          message: 'Your booking for Toyota Land Cruiser has been confirmed for Dec 1-4, 2025.',
          data: {
            bookingId: 'booking-001',
            vehicleId: 'vehicle-001',
            vehicleName: '2024 Toyota Land Cruiser',
            link: '/vehicle-rental/booking-confirmation/booking-001'
          },
          isRead: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: 'notif-002',
          type: 'payment_received',
          title: 'Payment Successful',
          message: 'Your payment of $690.10 has been processed successfully.',
          data: {
            bookingId: 'booking-001',
            amount: 690.10,
            link: '/vehicle-rental/invoice/booking-001'
          },
          isRead: false,
          createdAt: new Date(Date.now() - 45 * 60 * 1000)
        },
        {
          id: 'notif-003',
          type: 'new_message',
          title: 'New Message from Sunil Perera',
          message: 'Would you like to proceed with the booking?',
          data: {
            conversationId: 'conv-001',
            vehicleName: 'Toyota Land Cruiser',
            link: '/vehicle-rental/messages/conv-001'
          },
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: 'notif-004',
          type: 'payout_completed',
          title: 'Payout Processed',
          message: 'Your payout of $191.25 (first 50%) has been transferred to your bank account.',
          data: {
            bookingId: 'booking-002',
            amount: 191.25,
            link: '/vehicle-rental/owner/payouts'
          },
          isRead: true,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
        },
        {
          id: 'notif-005',
          type: 'vehicle_approved',
          title: 'Vehicle Approved!',
          message: 'Your Honda CR-V has been approved and is now live on the platform.',
          data: {
            vehicleId: 'vehicle-002',
            vehicleName: 'Honda CR-V',
            link: '/vehicle-rental/vehicle/vehicle-002'
          },
          isRead: true,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'notif-006',
          type: 'document_verified',
          title: 'Documents Verified',
          message: 'Your owner registration documents have been verified successfully.',
          data: {
            link: '/vehicle-rental/owner/documents'
          },
          isRead: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'notif-007',
          type: 'review_received',
          title: 'New Review Received',
          message: 'John Anderson left a 5-star review for your Toyota Land Cruiser.',
          data: {
            vehicleId: 'vehicle-001',
            vehicleName: 'Toyota Land Cruiser',
            link: '/vehicle-rental/vehicle/vehicle-001#reviews'
          },
          isRead: true,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'notif-008',
          type: 'deposit_released',
          title: 'Security Deposit Released',
          message: 'Your security deposit of $200 has been released back to your payment method.',
          data: {
            bookingId: 'booking-003',
            amount: 200,
            link: '/vehicle-rental/owner/deposits'
          },
          isRead: true,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'notif-009',
          type: 'promotion',
          title: 'Special Offer! 🎉',
          message: 'Use code HOLIDAY20 for 20% off your next vehicle rental booking.',
          data: {
            link: '/vehicle-rental/browse'
          },
          isRead: false,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshNotifications = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllRead = () => {
    setNotifications(prev => prev.filter(n => !n.isRead));
  };

  const getNotificationIcon = (type: NotificationType) => {
    const iconClass = "h-5 w-5";
    const icons: Record<NotificationType, { icon: React.ReactNode; bgColor: string; iconColor: string }> = {
      booking_confirmed: { 
        icon: <Calendar className={iconClass} />, 
        bgColor: 'bg-green-100', 
        iconColor: 'text-green-600' 
      },
      booking_cancelled: { 
        icon: <X className={iconClass} />, 
        bgColor: 'bg-red-100', 
        iconColor: 'text-red-600' 
      },
      payment_received: { 
        icon: <DollarSign className={iconClass} />, 
        bgColor: 'bg-emerald-100', 
        iconColor: 'text-emerald-600' 
      },
      payout_completed: { 
        icon: <DollarSign className={iconClass} />, 
        bgColor: 'bg-blue-100', 
        iconColor: 'text-blue-600' 
      },
      vehicle_approved: { 
        icon: <Car className={iconClass} />, 
        bgColor: 'bg-green-100', 
        iconColor: 'text-green-600' 
      },
      vehicle_rejected: { 
        icon: <Car className={iconClass} />, 
        bgColor: 'bg-red-100', 
        iconColor: 'text-red-600' 
      },
      new_message: { 
        icon: <MessageSquare className={iconClass} />, 
        bgColor: 'bg-blue-100', 
        iconColor: 'text-blue-600' 
      },
      review_received: { 
        icon: <Check className={iconClass} />, 
        bgColor: 'bg-yellow-100', 
        iconColor: 'text-yellow-600' 
      },
      document_verified: { 
        icon: <CheckCheck className={iconClass} />, 
        bgColor: 'bg-green-100', 
        iconColor: 'text-green-600' 
      },
      deposit_released: { 
        icon: <Shield className={iconClass} />, 
        bgColor: 'bg-green-100', 
        iconColor: 'text-green-600' 
      },
      deposit_held: { 
        icon: <Shield className={iconClass} />, 
        bgColor: 'bg-orange-100', 
        iconColor: 'text-orange-600' 
      },
      system_alert: { 
        icon: <AlertTriangle className={iconClass} />, 
        bgColor: 'bg-red-100', 
        iconColor: 'text-red-600' 
      },
      promotion: { 
        icon: <Gift className={iconClass} />, 
        bgColor: 'bg-purple-100', 
        iconColor: 'text-purple-600' 
      }
    };
    return icons[type] || { icon: <Info className={iconClass} />, bgColor: 'bg-gray-100', iconColor: 'text-gray-600' };
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const groupNotificationsByDate = (notifs: Notification[]): NotificationGroup[] => {
    const groups: Record<string, Notification[]> = {};
    
    notifs.forEach(notif => {
      const date = new Date(notif.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupKey: string;
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday';
      } else {
        groupKey = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notif);
    });

    return Object.entries(groups).map(([date, notifications]) => ({
      date,
      notifications
    }));
  };

  const getFilteredNotifications = () => {
    let filtered = [...notifications];

    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();
  const groupedNotifications = groupNotificationsByDate(filteredNotifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bell className="h-12 w-12 text-emerald-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Bell className="h-8 w-8 mr-3" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-3 bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h1>
              <p className="mt-1 text-emerald-100">Stay updated on your rentals and bookings</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={refreshNotifications}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Refresh notifications"
                disabled={refreshing}
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <Link
                to="/vehicle-rental/notification-settings"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Notification settings"
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filter === 'all' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center ${
                    filter === 'unread' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Unread
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                title="Filter by notification type"
              >
                <option value="all">All Types</option>
                <option value="booking_confirmed">Bookings</option>
                <option value="payment_received">Payments</option>
                <option value="new_message">Messages</option>
                <option value="vehicle_approved">Vehicles</option>
                <option value="promotion">Promotions</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <MailOpen className="h-4 w-4 mr-1" />
                  Mark all read
                </button>
              )}
              {notifications.some(n => n.isRead) && (
                <button
                  onClick={clearAllRead}
                  className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
            <p className="text-gray-500 mt-1">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedNotifications.map((group) => (
              <div key={group.date}>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {group.date}
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
                  {group.notifications.map((notification) => {
                    const iconConfig = getNotificationIcon(notification.type);
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.isRead ? 'bg-emerald-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2.5 rounded-full ${iconConfig.bgColor}`}>
                            <span className={iconConfig.iconColor}>
                              {iconConfig.icon}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-0.5">
                                  {notification.message}
                                </p>
                                {notification.data?.amount && (
                                  <p className="text-sm font-semibold text-emerald-600 mt-1">
                                    ${notification.data.amount.toFixed(2)}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                  {formatTime(notification.createdAt)}
                                </span>
                                {!notification.isRead && (
                                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 mt-3">
                              {notification.data?.link && (
                                <Link
                                  to={notification.data.link}
                                  onClick={() => markAsRead(notification.id)}
                                  className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                  View Details
                                  <ChevronRight className="h-4 w-4 ml-0.5" />
                                </Link>
                              )}
                              {!notification.isRead && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                  Mark as read
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="text-sm text-gray-400 hover:text-red-500"
                                title="Delete notification"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
