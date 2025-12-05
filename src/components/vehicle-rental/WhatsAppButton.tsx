/**
 * WhatsApp Integration Button Component
 * One-click WhatsApp messaging for vehicle rentals
 */
import React, { useState } from 'react';
import { MessageCircle, Send, Phone, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  generateWhatsAppShareLink,
  previewWhatsAppTemplate,
  type WhatsAppMessageType,
  type VehicleWhatsAppData
} from '@/services/vehicleRentalWhatsAppService';

// Pre-defined message templates
const MESSAGE_TEMPLATES = {
  booking_inquiry: {
    label: 'Booking Inquiry',
    icon: '📋',
    getMessage: (data: VehicleWhatsAppData) => `
Hi ${data.customerName || 'there'},

Thank you for your interest in renting ${data.vehicleName}!

I wanted to follow up on your booking inquiry:
📅 Dates: ${data.pickupDate} - ${data.returnDate}
📍 Pick-up: ${data.pickupLocation}

Please let me know if you have any questions.

Best regards,
${data.ownerName || 'Vehicle Owner'}
    `.trim()
  },
  pickup_confirmation: {
    label: 'Pickup Confirmation',
    icon: '✅',
    getMessage: (data: VehicleWhatsAppData) => `
Hi ${data.customerName},

Your vehicle pickup is confirmed for tomorrow!

🚗 Vehicle: ${data.vehicleName}
📅 Date: ${data.pickupDate}
📍 Location: ${data.pickupLocation}
💰 Total: $${data.amount?.toFixed(2)}

Please bring:
• Valid driver's license
• Government ID/Passport
• Payment for security deposit

See you soon!
    `.trim()
  },
  payment_reminder: {
    label: 'Payment Reminder',
    icon: '💳',
    getMessage: (data: VehicleWhatsAppData) => `
Hi ${data.customerName},

This is a friendly reminder about your pending payment for booking ${data.bookingReference}.

💰 Amount Due: $${data.amount?.toFixed(2)}
🚗 Vehicle: ${data.vehicleName}
📅 Dates: ${data.pickupDate} - ${data.returnDate}

Please complete your payment to confirm the booking.

Thank you!
    `.trim()
  },
  return_reminder: {
    label: 'Return Reminder',
    icon: '⏰',
    getMessage: (data: VehicleWhatsAppData) => `
Hi ${data.customerName},

Just a reminder that your rental period ends tomorrow.

🚗 Vehicle: ${data.vehicleName}
📅 Return by: ${data.returnDate}
📍 Location: ${data.pickupLocation}

Please remember to:
• Fill fuel to same level
• Remove personal belongings
• Return keys and documents

Your deposit will be released after vehicle inspection.

Thank you for choosing us!
    `.trim()
  },
  thank_you: {
    label: 'Thank You',
    icon: '🙏',
    getMessage: (data: VehicleWhatsAppData) => `
Hi ${data.customerName},

Thank you for renting with us! We hope you enjoyed your experience.

If you have a moment, we would love to hear your feedback. Your review helps other travelers and supports our service.

We look forward to serving you again!

Best regards,
${data.ownerName || 'Vehicle Owner'}
    `.trim()
  },
  custom: {
    label: 'Custom Message',
    icon: '✏️',
    getMessage: () => ''
  }
};

type TemplateKey = keyof typeof MESSAGE_TEMPLATES;

interface WhatsAppButtonProps {
  phone: string;
  customerName?: string;
  ownerName?: string;
  vehicleName?: string;
  bookingReference?: string;
  pickupDate?: string;
  returnDate?: string;
  pickupLocation?: string;
  amount?: number;
  variant?: 'default' | 'outline' | 'ghost' | 'icon';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showDropdown?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phone,
  customerName = '',
  ownerName = '',
  vehicleName = '',
  bookingReference = '',
  pickupDate = '',
  returnDate = '',
  pickupLocation = '',
  amount,
  variant = 'outline',
  size = 'default',
  className = '',
  showDropdown = true
}) => {
  const { toast } = useToast();
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const data: VehicleWhatsAppData = {
    customerName,
    ownerName,
    vehicleName,
    bookingReference,
    pickupDate,
    returnDate,
    pickupLocation,
    amount
  };

  const sendWhatsAppMessage = (message: string) => {
    const link = generateWhatsAppShareLink(phone, message);
    window.open(link, '_blank');
    toast({
      title: 'Opening WhatsApp',
      description: 'Message ready to send'
    });
  };

  const handleTemplateClick = (templateKey: TemplateKey) => {
    if (templateKey === 'custom') {
      setShowCustomDialog(true);
      return;
    }

    const template = MESSAGE_TEMPLATES[templateKey];
    const message = template.getMessage(data);
    sendWhatsAppMessage(message);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied',
      description: 'Phone number copied to clipboard'
    });
  };

  const handleSendCustomMessage = () => {
    if (customMessage.trim()) {
      sendWhatsAppMessage(customMessage);
      setShowCustomDialog(false);
      setCustomMessage('');
    }
  };

  // Simple button without dropdown
  if (!showDropdown) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700 ${className}`}
        onClick={() => {
          const defaultMessage = `Hi ${customerName || 'there'}, `;
          sendWhatsAppMessage(defaultMessage);
        }}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={`text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700 ${className}`}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Template Messages */}
          {Object.entries(MESSAGE_TEMPLATES).map(([key, template]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => handleTemplateClick(key as TemplateKey)}
              className="cursor-pointer"
            >
              <span className="mr-2">{template.icon}</span>
              {template.label}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {/* Quick Actions */}
          <DropdownMenuItem onClick={handleCopyNumber} className="cursor-pointer">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Number
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => window.open(`tel:${phone}`, '_self')}
            className="cursor-pointer"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Directly
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom Message Dialog */}
      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Custom WhatsApp Message</DialogTitle>
            <DialogDescription>
              Send a personalized message to {customerName || phone}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customMessage">Message</Label>
              <Textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 text-right">
                {customMessage.length} characters
              </p>
            </div>

            {/* Quick Insert */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Quick Insert</Label>
              <div className="flex flex-wrap gap-1">
                {customerName && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setCustomMessage(prev => prev + customerName)}
                  >
                    Customer Name
                  </Button>
                )}
                {vehicleName && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setCustomMessage(prev => prev + vehicleName)}
                  >
                    Vehicle
                  </Button>
                )}
                {bookingReference && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setCustomMessage(prev => prev + bookingReference)}
                  >
                    Booking Ref
                  </Button>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendCustomMessage}
              disabled={!customMessage.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Send via WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Floating WhatsApp button for pages
interface FloatingWhatsAppButtonProps {
  phone: string;
  defaultMessage?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  phone,
  defaultMessage = 'Hi! I have a question about vehicle rental.',
  position = 'bottom-right'
}) => {
  const positionClasses = {
    'bottom-right': 'right-6 bottom-6',
    'bottom-left': 'left-6 bottom-6'
  };

  return (
    <button
      onClick={() => {
        const link = generateWhatsAppShareLink(phone, defaultMessage);
        window.open(link, '_blank');
      }}
      className={`fixed ${positionClasses[position]} z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110`}
      title="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </button>
  );
};

// WhatsApp share link generator component
interface WhatsAppShareLinkProps {
  phone: string;
  message: string;
  children?: React.ReactNode;
}

export const WhatsAppShareLink: React.FC<WhatsAppShareLinkProps> = ({
  phone,
  message,
  children
}) => {
  const link = generateWhatsAppShareLink(phone, message);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-green-600 hover:text-green-700"
    >
      {children || (
        <>
          <MessageCircle className="w-4 h-4 mr-1" />
          Open WhatsApp
        </>
      )}
    </a>
  );
};

export default WhatsAppButton;
