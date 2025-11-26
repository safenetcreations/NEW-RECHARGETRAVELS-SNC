import React, { useState } from 'react';
import { Bell, X, Check, AlertCircle, Info, CheckCircle2, MessageSquare } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionable?: boolean;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'New Booking',
      message: 'A new booking has been received for Sigiriya Rock Tour',
      time: '5 min ago',
      read: false,
      actionable: true
    },
    {
      id: '2',
      type: 'info',
      title: 'Review Submitted',
      message: 'A customer left a 5-star review for Ella Adventure Package',
      time: '15 min ago',
      read: false,
      actionable: true
    },
    {
      id: '3',
      type: 'warning',
      title: 'Payment Pending',
      message: 'Payment confirmation pending for booking #12345',
      time: '1 hour ago',
      read: true
    },
    {
      id: '4',
      type: 'success',
      title: 'Driver Registered',
      message: 'New driver application submitted for approval',
      time: '2 hours ago',
      read: true,
      actionable: true
    },
    {
      id: '5',
      type: 'info',
      title: 'Blog Post Published',
      message: 'Your article "Top 10 Destinations in Sri Lanka" is now live',
      time: '3 hours ago',
      read: true
    }
  ]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getBackgroundColor = (type: Notification['type'], read: boolean) => {
    if (read) return 'bg-gray-50';
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'info':
        return 'bg-blue-50';
      case 'warning':
        return 'bg-orange-50';
      case 'error':
        return 'bg-red-50';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Notification Panel */}
      <div className="fixed right-0 top-0 h-screen w-96 bg-white shadow-2xl z-50 overflow-hidden flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6" />
              <h2 className="text-xl font-bold">Notifications</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-purple-100">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-white hover:text-purple-100 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
              <Bell className="w-16 h-16 mb-4" />
              <p className="text-lg font-semibold">No notifications</p>
              <p className="text-sm text-center mt-2">
                You're all caught up! We'll notify you when something important happens.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    getBackgroundColor(notification.type, notification.read)
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="flex-shrink-0 text-purple-600 hover:text-purple-700 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                        {notification.actionable && (
                          <button className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                            View Details →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;
