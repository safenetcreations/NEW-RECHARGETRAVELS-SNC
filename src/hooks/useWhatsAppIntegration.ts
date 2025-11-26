
import { useState } from 'react'
import { dbService, authService, storageService } from '@/lib/firebase-services'
import { toast } from 'sonner'

interface WhatsAppMessage {
  to: string
  message: string
  templateName?: string
  templateParams?: Record<string, string>
}

export const useWhatsAppIntegration = () => {
  const [isSending, setIsSending] = useState(false)

  const sendWhatsAppMessage = async (messageData: WhatsAppMessage) => {
    setIsSending(true)
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-message', {
        body: messageData
      })

      if (error) throw error

      console.log('WhatsApp message sent:', data)
      toast.success('WhatsApp message sent successfully!')
      return data
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
      toast.error('Failed to send WhatsApp message')
      throw error
    } finally {
      setIsSending(false)
    }
  }

  const sendBookingConfirmation = async (
    customerPhone: string,
    driverName: string,
    driverPhone: string,
    pickupLocation: string,
    pickupDate: string,
    pickupTime: string
  ) => {
    const message = `🚗 *Booking Confirmed - Recharge Travels*

Hello! Your driver booking has been confirmed.

*Driver Details:*
👨‍💼 Name: ${driverName}
📱 Phone: ${driverPhone}

*Trip Details:*
📍 Pickup: ${pickupLocation}
📅 Date: ${pickupDate}
🕐 Time: ${pickupTime}

Your driver will contact you soon to finalize the details. Have a safe journey!

*Recharge Travels Team*`

    return sendWhatsAppMessage({
      to: customerPhone,
      message
    })
  }

  const sendDriverNotification = async (
    driverPhone: string,
    customerName: string,
    customerPhone: string,
    pickupLocation: string,
    pickupDate: string,
    pickupTime: string
  ) => {
    const message = `🚗 *New Booking - Recharge Travels*

You have a new booking request!

*Customer Details:*
👤 Name: ${customerName}
📱 Phone: ${customerPhone}

*Trip Details:*
📍 Pickup: ${pickupLocation}
📅 Date: ${pickupDate}
🕐 Time: ${pickupTime}

Please contact the customer to confirm details and provide your quote.

*Recharge Travels Team*`

    return sendWhatsAppMessage({
      to: driverPhone,
      message
    })
  }

  const sendVerificationUpdate = async (
    driverPhone: string,
    driverName: string,
    status: 'approved' | 'rejected' | 'under_review',
    adminNotes?: string
  ) => {
    let message = `🚗 *Verification Update - Recharge Travels*

Hello ${driverName},

Your driver verification status has been updated: *${status.toUpperCase().replace('_', ' ')}*`

    if (status === 'approved') {
      message += `

🎉 Congratulations! You are now a verified driver on Recharge Travels.

You can now:
✅ Receive booking requests
✅ Connect with customers
✅ Start earning with us

Log in to your driver dashboard to manage your bookings.`
    } else if (status === 'rejected') {
      message += `

Unfortunately, your application needs some updates.`
      if (adminNotes) {
        message += `

*Admin Notes:*
${adminNotes}`
      }
      message += `

You can update your documents and resubmit for review.`
    } else {
      message += `

Your documents are currently being reviewed by our team. We'll notify you once the review is complete.`
    }

    message += `

*Recharge Travels Team*`

    return sendWhatsAppMessage({
      to: driverPhone,
      message
    })
  }

  return {
    isSending,
    sendWhatsAppMessage,
    sendBookingConfirmation,
    sendDriverNotification,
    sendVerificationUpdate
  }
}
