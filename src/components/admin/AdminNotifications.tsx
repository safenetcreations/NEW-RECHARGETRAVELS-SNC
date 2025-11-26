import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { dbService } from '@/lib/firebase-services'
import { useWhatsAppIntegration } from '@/hooks/useWhatsAppIntegration'
import { toast } from 'sonner'
import { Bell, CheckCircle, Clock, MessageSquare, Send, Users } from 'lucide-react'

type RecipientType = 'drivers' | 'customers' | 'all'

type NotificationRecord = {
  id: string
  type: 'verification_update' | 'booking_confirmation' | 'system_announcement'
  title: string
  message: string
  recipient_type: RecipientType
  status: 'pending' | 'sent' | 'failed'
  created_at?: string
  createdAt?: any
  sent_count?: number
  total_recipients?: number
}

type Notification = {
  id: string
  type: NotificationRecord['type']
  title: string
  message: string
  recipient_type: RecipientType
  status: NotificationRecord['status']
  created_at: string
  sent_count: number
  total_recipients: number
}

type Recipient = {
  id?: string
  whatsapp_number?: string
  first_name?: string
  last_name?: string
  displayName?: string
  phone?: string
  recipient_type?: RecipientType
}

const DEFAULT_NOTIFICATION: Notification = {
  id: '',
  type: 'system_announcement',
  title: '',
  message: '',
  recipient_type: 'all',
  status: 'pending',
  created_at: new Date().toISOString(),
  sent_count: 0,
  total_recipients: 0
}

const normalizeNotification = (record: NotificationRecord): Notification => {
  const createdSource = record.created_at ?? record.createdAt
  const createdAt =
    typeof createdSource === 'string'
      ? createdSource
      : createdSource?.toDate
        ? createdSource.toDate().toISOString()
        : new Date().toISOString()

  return {
    ...DEFAULT_NOTIFICATION,
    ...record,
    created_at: createdAt,
    sent_count: record.sent_count ?? 0,
    total_recipients: record.total_recipients ?? 0
  }
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    recipient_type: 'all' as RecipientType
  })
  const [isSending, setIsSending] = useState(false)
  const { sendWhatsAppMessage } = useWhatsAppIntegration()

  useEffect(() => {
    void fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const records = await dbService.list('admin_notifications')
      const normalized = (records as NotificationRecord[]).map(normalizeNotification)
      normalized.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      setNotifications(normalized)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const collectRecipients = async (recipientType: RecipientType): Promise<Recipient[]> => {
    const recipients: Recipient[] = []

    const safeList = async (
      collection: string,
      filters?: Array<{ field: string; operator: any; value: unknown }>
    ) => {
      try {
        return await dbService.list(collection, filters)
      } catch (error) {
        console.warn(`Unable to fetch ${collection}:`, error)
        return []
      }
    }

    if (recipientType === 'drivers' || recipientType === 'all') {
      const driverFilters =
        recipientType === 'drivers'
          ? [{ field: 'overall_verification_status', operator: '==', value: 'approved' }]
          : undefined

      const drivers = (await safeList('drivers', driverFilters)) as Recipient[]
      recipients.push(
        ...drivers.map((driver) => ({
          ...driver,
          recipient_type: 'drivers' as RecipientType
        }))
      )
    }

    if (recipientType === 'customers' || recipientType === 'all') {
      const userProfiles = (await safeList('user_profiles')) as Recipient[]
      const fallbackCustomers = (await safeList('customers')) as Recipient[]
      const customerList = userProfiles.length > 0 ? userProfiles : fallbackCustomers

      recipients.push(
        ...customerList.map((customer) => ({
          ...customer,
          recipient_type: 'customers' as RecipientType
        }))
      )
    }

    const uniqueByNumber = new Map<string, Recipient>()
    for (const recipient of recipients) {
      const phone = recipient.whatsapp_number ?? recipient.phone
      if (!phone) continue
      if (!uniqueByNumber.has(phone)) {
        uniqueByNumber.set(phone, recipient)
      }
    }

    return Array.from(uniqueByNumber.values())
  }

  const sendNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSending(true)

    try {
      const notificationRecord = await dbService.create('admin_notifications', {
        type: 'system_announcement',
        title: newNotification.title,
        message: newNotification.message,
        recipient_type: newNotification.recipient_type,
        status: 'pending',
        sent_count: 0,
        total_recipients: 0,
        created_at: new Date().toISOString()
      })

      const recipients = await collectRecipients(newNotification.recipient_type)

      let sentCount = 0
      for (const recipient of recipients) {
        const phone = recipient.whatsapp_number ?? recipient.phone
        if (!phone) continue

        try {
          const message = `*${newNotification.title}*\n\n${newNotification.message}\n\n*Recharge Travels Team*`
          await sendWhatsAppMessage({
            to: phone,
            message
          })
          sentCount++
        } catch (error) {
          console.error(`Failed to send to ${phone}:`, error)
        }
      }

      await dbService.update('admin_notifications', notificationRecord.id, {
        status: sentCount === recipients.length ? 'sent' : 'failed',
        sent_count: sentCount,
        total_recipients: recipients.length
      })

      toast.success(`Notification sent to ${sentCount}/${recipients.length} recipients`)

      setNewNotification({
        title: '',
        message: '',
        recipient_type: 'all'
      })

      await fetchNotifications()
    } catch (error) {
      console.error('Error sending notification:', error)
      toast.error('Failed to send notification')
    } finally {
      setIsSending(false)
    }
  }

  const statusStyles = useMemo(
    () => ({
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    }),
    []
  )

  const statusIcon = (status: Notification['status']) => {
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Send New Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Notification Title</label>
            <Input
              value={newNotification.title}
              onChange={(event) =>
                setNewNotification((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Enter notification title..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Message</label>
            <Textarea
              value={newNotification.message}
              onChange={(event) =>
                setNewNotification((prev) => ({ ...prev, message: event.target.value }))
              }
              placeholder="Enter your message here..."
              rows={4}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Recipients</label>
            <select
              value={newNotification.recipient_type}
              onChange={(event) =>
                setNewNotification((prev) => ({
                  ...prev,
                  recipient_type: event.target.value as RecipientType
                }))
              }
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="all">All Users</option>
              <option value="drivers">Approved Drivers Only</option>
              <option value="customers">Customers Only</option>
            </select>
          </div>

          <Button onClick={sendNotification} disabled={isSending} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            {isSending ? 'Sending…' : 'Send Notification'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Notification History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.length === 0 && (
            <p className="text-sm text-muted-foreground">No notifications sent yet.</p>
          )}

          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="rounded-xl border border-border bg-card/40 p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{notification.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={statusStyles[notification.status] ?? statusStyles.pending}
                >
                  <span className="mr-1">{statusIcon(notification.status)}</span>
                  {notification.status.toUpperCase()}
                </Badge>
              </div>

              <div className="mt-4 grid gap-2 text-xs text-muted-foreground md:grid-cols-3">
                <div>
                  <span className="font-medium">Recipients:</span>{' '}
                  {notification.recipient_type.toUpperCase()}
                </div>
                <div>
                  <span className="font-medium">Sent:</span>{' '}
                  {notification.sent_count}/{notification.total_recipients}
                </div>
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(notification.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminNotifications
