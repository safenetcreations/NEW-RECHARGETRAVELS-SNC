import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Phone, 
  Smartphone,
  Save,
  Check,
  AlertCircle,
  Settings,
  DollarSign,
  Calendar,
  Car,
  MessageCircle,
  Shield,
  Info,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationChannel {
  id: 'email' | 'whatsapp' | 'sms' | 'push';
  name: string;
  icon: React.ElementType;
  description: string;
  enabled: boolean;
  verified: boolean;
  contactInfo?: string;
}

interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  notifications: NotificationType[];
}

interface NotificationType {
  id: string;
  name: string;
  description: string;
  channels: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
    push: boolean;
  };
  required?: boolean;
}

const VehicleNotificationPreferences: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'channels' | 'notifications'>('channels');

  // Notification channels state
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      description: 'Receive notifications via email',
      enabled: true,
      verified: true,
      contactInfo: 'john.doe@example.com',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageSquare,
      description: 'Get instant updates on WhatsApp',
      enabled: true,
      verified: true,
      contactInfo: '+94 77 772 1999',
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: Phone,
      description: 'Text message alerts',
      enabled: false,
      verified: true,
      contactInfo: '+94 77 772 1999',
    },
    {
      id: 'push',
      name: 'Push Notifications',
      icon: Smartphone,
      description: 'Browser and mobile app notifications',
      enabled: true,
      verified: true,
    },
  ]);

  // Notification categories and types
  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: 'bookings',
      name: 'Booking Updates',
      description: 'Notifications about your vehicle bookings',
      icon: Calendar,
      color: 'blue',
      notifications: [
        {
          id: 'booking_confirmation',
          name: 'Booking Confirmation',
          description: 'When a booking is confirmed',
          channels: { email: true, whatsapp: true, sms: false, push: true },
          required: true,
        },
        {
          id: 'booking_status',
          name: 'Booking Status Changes',
          description: 'When booking status is updated (approved, rejected, cancelled)',
          channels: { email: true, whatsapp: true, sms: false, push: true },
        },
        {
          id: 'pickup_reminder',
          name: 'Pick-up Reminders',
          description: 'Reminder before your scheduled pick-up',
          channels: { email: true, whatsapp: true, sms: true, push: true },
        },
        {
          id: 'return_reminder',
          name: 'Return Reminders',
          description: 'Reminder before your rental return date',
          channels: { email: true, whatsapp: true, sms: true, push: true },
        },
      ],
    },
    {
      id: 'payments',
      name: 'Payments & Payouts',
      description: 'Financial transaction notifications',
      icon: DollarSign,
      color: 'green',
      notifications: [
        {
          id: 'payment_received',
          name: 'Payment Received',
          description: 'When your payment is successfully processed',
          channels: { email: true, whatsapp: true, sms: false, push: true },
          required: true,
        },
        {
          id: 'payment_failed',
          name: 'Payment Failed',
          description: 'When a payment attempt fails',
          channels: { email: true, whatsapp: true, sms: true, push: true },
          required: true,
        },
        {
          id: 'payout_processed',
          name: 'Payout Processed',
          description: 'When your earnings are sent to your account',
          channels: { email: true, whatsapp: true, sms: false, push: true },
        },
        {
          id: 'deposit_status',
          name: 'Deposit Updates',
          description: 'Security deposit held, released, or deducted',
          channels: { email: true, whatsapp: true, sms: false, push: true },
        },
      ],
    },
    {
      id: 'messages',
      name: 'Messages',
      description: 'Chat and communication notifications',
      icon: MessageCircle,
      color: 'purple',
      notifications: [
        {
          id: 'new_message',
          name: 'New Messages',
          description: 'When you receive a new message',
          channels: { email: true, whatsapp: false, sms: false, push: true },
        },
        {
          id: 'message_reply',
          name: 'Message Replies',
          description: 'When someone replies to your message',
          channels: { email: true, whatsapp: false, sms: false, push: true },
        },
      ],
    },
    {
      id: 'vehicle',
      name: 'Vehicle Updates',
      description: 'Notifications for vehicle owners',
      icon: Car,
      color: 'orange',
      notifications: [
        {
          id: 'new_booking_request',
          name: 'New Booking Requests',
          description: 'When someone requests to book your vehicle',
          channels: { email: true, whatsapp: true, sms: true, push: true },
        },
        {
          id: 'vehicle_review',
          name: 'New Reviews',
          description: 'When someone leaves a review for your vehicle',
          channels: { email: true, whatsapp: false, sms: false, push: true },
        },
        {
          id: 'listing_expiry',
          name: 'Listing Expiry',
          description: 'Reminders when your vehicle listing is about to expire',
          channels: { email: true, whatsapp: false, sms: false, push: true },
        },
      ],
    },
    {
      id: 'security',
      name: 'Security & Account',
      description: 'Important security notifications',
      icon: Shield,
      color: 'red',
      notifications: [
        {
          id: 'login_alert',
          name: 'New Login Alerts',
          description: 'When your account is accessed from a new device',
          channels: { email: true, whatsapp: false, sms: true, push: true },
          required: true,
        },
        {
          id: 'password_change',
          name: 'Password Changes',
          description: 'When your password is changed',
          channels: { email: true, whatsapp: false, sms: false, push: true },
          required: true,
        },
        {
          id: 'account_updates',
          name: 'Account Updates',
          description: 'Important changes to your account or profile',
          channels: { email: true, whatsapp: false, sms: false, push: true },
        },
      ],
    },
  ]);

  const toggleChannel = (channelId: NotificationChannel['id']) => {
    setChannels(prev => prev.map(ch => 
      ch.id === channelId ? { ...ch, enabled: !ch.enabled } : ch
    ));
    setSavedMessage(null);
  };

  const toggleNotification = (
    categoryId: string, 
    notificationId: string, 
    channelId: keyof NotificationType['channels']
  ) => {
    // Don't allow toggling if the channel is disabled globally
    const channel = channels.find(ch => ch.id === channelId);
    if (!channel?.enabled) return;

    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        notifications: cat.notifications.map(notif => {
          if (notif.id !== notificationId) return notif;
          // Don't toggle required notifications off
          if (notif.required && notif.channels[channelId]) return notif;
          return {
            ...notif,
            channels: {
              ...notif.channels,
              [channelId]: !notif.channels[channelId],
            },
          };
        }),
      };
    }));
    setSavedMessage(null);
  };

  const enableAllForCategory = (categoryId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        notifications: cat.notifications.map(notif => ({
          ...notif,
          channels: {
            email: channels.find(c => c.id === 'email')?.enabled ?? false,
            whatsapp: channels.find(c => c.id === 'whatsapp')?.enabled ?? false,
            sms: channels.find(c => c.id === 'sms')?.enabled ?? false,
            push: channels.find(c => c.id === 'push')?.enabled ?? false,
          },
        })),
      };
    }));
  };

  const disableAllForCategory = (categoryId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        notifications: cat.notifications.map(notif => ({
          ...notif,
          channels: {
            email: notif.required ? notif.channels.email : false,
            whatsapp: notif.required ? notif.channels.whatsapp : false,
            sms: notif.required ? notif.channels.sms : false,
            push: notif.required ? notif.channels.push : false,
          },
        })),
      };
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, save to Firestore
      const preferences = {
        channels: channels.reduce((acc, ch) => ({
          ...acc,
          [ch.id]: { enabled: ch.enabled, contactInfo: ch.contactInfo },
        }), {}),
        notifications: categories.reduce((acc, cat) => ({
          ...acc,
          [cat.id]: cat.notifications.reduce((notifAcc, notif) => ({
            ...notifAcc,
            [notif.id]: notif.channels,
          }), {}),
        }), {}),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Saving preferences:', preferences);
      setSavedMessage('Preferences saved successfully!');
      
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSavedMessage('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/vehicle-rental/notifications"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  Notification Preferences
                </h1>
                <p className="text-sm text-gray-500">Manage how and when you receive notifications</p>
              </div>
            </div>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg 
                       hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab('channels')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors
                ${activeTab === 'channels' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Notification Channels
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors
                ${activeTab === 'notifications' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Notification Types
            </button>
          </div>
        </div>
      </div>

      {/* Saved Message */}
      {savedMessage && (
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
            savedMessage.includes('success') 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {savedMessage.includes('success') ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {savedMessage}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'channels' ? (
          /* Channels Tab */
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Enable the channels</strong> you want to receive notifications on. 
                  Disabling a channel will turn off all notifications for that channel.
                </p>
              </div>
            </div>

            {channels.map((channel) => (
              <div
                key={channel.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                      ${channel.enabled ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                      <channel.icon className={`w-6 h-6 
                        ${channel.enabled ? 'text-emerald-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                        {channel.verified && (
                          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{channel.description}</p>
                      {channel.contactInfo && (
                        <p className="text-sm text-gray-700 mt-1 font-medium">
                          {channel.contactInfo}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleChannel(channel.id)}
                    title={`Toggle ${channel.name} notifications`}
                    className={`relative w-14 h-7 rounded-full transition-colors
                      ${channel.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform
                      ${channel.enabled ? 'left-8' : 'left-1'}`} />
                  </button>
                </div>

                {!channel.verified && (
                  <div className="mt-4 pt-4 border-t">
                    <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                      Verify {channel.name}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Notifications Tab */
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Customize notifications</strong> for each category. 
                  Some notifications are required and cannot be disabled.
                </p>
              </div>
            </div>

            {categories.map((category) => {
              const colorClasses = getColorClasses(category.color);
              const CategoryIcon = category.icon;
              
              return (
                <div key={category.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Category Header */}
                  <div className={`p-4 ${colorClasses.bg} ${colorClasses.border} border-b`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CategoryIcon className={`w-5 h-5 ${colorClasses.text}`} />
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => enableAllForCategory(category.id)}
                          className="text-xs px-3 py-1 bg-white rounded-lg border hover:bg-gray-50"
                        >
                          Enable All
                        </button>
                        <button
                          onClick={() => disableAllForCategory(category.id)}
                          className="text-xs px-3 py-1 bg-white rounded-lg border hover:bg-gray-50"
                        >
                          Disable All
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Channel Headers */}
                  <div className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 p-4 border-b bg-gray-50 text-sm font-medium text-gray-600">
                    <span>Notification</span>
                    <span className="w-16 text-center">Email</span>
                    <span className="w-16 text-center">WhatsApp</span>
                    <span className="w-16 text-center">SMS</span>
                    <span className="w-16 text-center">Push</span>
                  </div>

                  {/* Notification Types */}
                  <div className="divide-y">
                    {category.notifications.map((notification) => (
                      <div key={notification.id} className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 p-4 items-center hover:bg-gray-50">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{notification.name}</span>
                            {notification.required && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{notification.description}</p>
                        </div>
                        
                        {(['email', 'whatsapp', 'sms', 'push'] as const).map((channelId) => {
                          const channel = channels.find(c => c.id === channelId);
                          const isEnabled = notification.channels[channelId];
                          const isChannelDisabled = !channel?.enabled;
                          const isRequired = notification.required && isEnabled;
                          
                          return (
                            <div key={channelId} className="w-16 flex justify-center">
                              <button
                                onClick={() => toggleNotification(category.id, notification.id, channelId)}
                                disabled={isChannelDisabled || isRequired}
                                className={`p-1 rounded transition-colors
                                  ${isChannelDisabled 
                                    ? 'opacity-30 cursor-not-allowed' 
                                    : isRequired 
                                      ? 'cursor-not-allowed'
                                      : 'hover:bg-gray-200 cursor-pointer'}`}
                                title={
                                  isChannelDisabled 
                                    ? `${channel?.name} is disabled` 
                                    : isRequired 
                                      ? 'This notification is required'
                                      : ''
                                }
                              >
                                {isEnabled ? (
                                  <ToggleRight className={`w-8 h-8 ${
                                    isChannelDisabled ? 'text-gray-300' : 'text-emerald-500'
                                  }`} />
                                ) : (
                                  <ToggleLeft className="w-8 h-8 text-gray-300" />
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quiet Hours Section */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            Quiet Hours
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Mute non-urgent notifications during specific hours. Critical notifications like payment failures will still be delivered.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-emerald-600 rounded" 
                title="Enable quiet hours"
              />
              <span className="text-sm text-gray-700">Enable quiet hours</span>
            </label>
            <div className="flex items-center gap-2">
              <label htmlFor="quiet-hours-from" className="text-sm text-gray-600">From</label>
              <input 
                id="quiet-hours-from"
                type="time" 
                defaultValue="22:00"
                className="px-3 py-1.5 border rounded-lg text-sm"
                title="Quiet hours start time"
              />
              <label htmlFor="quiet-hours-to" className="text-sm text-gray-600">to</label>
              <input 
                id="quiet-hours-to"
                type="time" 
                defaultValue="08:00"
                className="px-3 py-1.5 border rounded-lg text-sm"
                title="Quiet hours end time"
              />
            </div>
          </div>
        </div>

        {/* Unsubscribe All */}
        <div className="mt-6 p-4 border border-red-200 rounded-xl bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-red-800">Unsubscribe from All</h4>
              <p className="text-sm text-red-600">
                Stop receiving all non-essential notifications. This cannot be undone easily.
              </p>
            </div>
            <button 
              className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              title="Unsubscribe from all notifications"
            >
              Unsubscribe All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleNotificationPreferences;
