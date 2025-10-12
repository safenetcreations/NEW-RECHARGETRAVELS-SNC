
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useWhatsAppIntegration } from '@/hooks/useWhatsAppIntegration'
import { toast } from 'sonner'
import { getDocs, collection, query, orderBy, addDoc, updateDoc, doc, where } from 'firebase/firestore'
import { db } from '@/services/firebaseService'
import { 
  Bell, 
  MessageSquare, 
  Send,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react'

interface Notification {
  id: string
  type: 'verification_update' | 'booking_confirmation' | 'system_announcement'
  title: string
  message: string
  recipient_type: 'drivers' | 'customers' | 'all'
  status: 'pending' | 'sent' | 'failed'
  created_at: string
  sent_count: number
  total_recipients: number
}

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  experience_years: number;
  languages: string[];
  rating: number;
  total_reviews: number;
  is_active: boolean;
  overall_verification_status: string;
  created_at: string;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    recipient_type: 'all' as 'drivers' | 'customers' | 'all'
  })
  const [isSending, setIsSending] = useState(false)
  const { sendWhatsAppMessage } = useWhatsAppIntegration()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const q = query(collection(db, 'admin_notifications'), orderBy('created_at', 'desc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Notification[]
      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const sendNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSending(true)
    try {
      // Create notification record
      const notificationRef = await addDoc(collection(db, 'admin_notifications'), {
        type: 'system_announcement',
        title: newNotification.title,
        message: newNotification.message,
        recipient_type: newNotification.recipient_type,
        status: 'pending',
        created_at: new Date().toISOString(),
        sent_count: 0,
        total_recipients: 0
      })

      // Get recipient phone numbers
      let recipientQuery = query(collection(db, 'drivers'))
      
      if (newNotification.recipient_type === 'drivers') {
        recipientQuery = query(collection(db, 'drivers'), where('overall_verification_status', '==', 'approved'))
      }

      const recipientsSnapshot = await getDocs(recipientQuery)
      const recipients = recipientsSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Driver[]

      let sentCount = 0
      const totalRecipients = recipients.length

      // Send WhatsApp messages
      for (const recipient of recipients) {
        try {
          const message = `*${newNotification.title}*

${newNotification.message}

*Recharge Travels Team*`

          await sendWhatsAppMessage(recipient.whatsapp_number, message)
          sentCount++
        } catch (error) {
          console.error(`Failed to send to ${recipient.whatsapp_number}:`, error)
        }
      }

      // Update notification status
      await updateDoc(doc(db, 'admin_notifications', notificationRef.id), {
        status: sentCount === totalRecipients ? 'sent' : 'failed',
        sent_count: sentCount,
        total_recipients: totalRecipients
      })

      toast.success(`Notification sent to ${sentCount}/${totalRecipients} recipients`)
      
      // Reset form
      setNewNotification({
        title: '',
        message: '',
        recipient_type: 'all'
      })
      
      fetchNotifications()
    } catch (error) {
      console.error('Error sending notification:', error)
      toast.error('Failed to send notification')
    } finally {
      setIsSending(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4" />
      case 'failed':
        return <Bell className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Send New Notification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Send New Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Notification Title</label>
            <Input
              value={newNotification.title}
              onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter notification title..."
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Message</label>
            <Textarea
              value={newNotification.message}
              onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Enter your message here..."
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Recipients</label>
            <select
              value={newNotification.recipient_type}
              onChange={(e) => setNewNotification(prev => ({ 
                ...prev, 
                recipient_type: e.target.value as 'drivers' | 'customers' | 'all' 
              }))}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="all">All Users</option>
              <option value="drivers">Approved Drivers Only</option>
              <option value="customers">Customers Only</option>
            </select>
          </div>

          <Button 
            onClick={sendNotification} 
            disabled={isSending}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSending ? 'Sending...' : 'Send Notification'}
          </Button>
        </CardContent>
      </Card>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <Bell className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p>No notifications sent yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(notification.status)}
                      <Badge className={getStatusColor(notification.status)}>
                        {notification.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {notification.recipient_type}
                      </span>
                      <span>
                        {notification.sent_count}/{notification.total_recipients} sent
                      </span>
                    </div>
                    <span>
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminNotifications
