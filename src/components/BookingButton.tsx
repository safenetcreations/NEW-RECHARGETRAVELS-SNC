import { Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  ref?: string;
  text?: string;
  showIcon?: boolean;
}

const BOOKING_ENGINE_URL = "https://c2acb8ea-28ac-4d08-ae89-258eec2849a6-00-1gr0z3okwsln1.kirk.replit.dev";

const BookingButton = ({ 
  variant = 'default',
  size = 'default',
  className = '',
  ref = 'main-website',
  text = 'Book Transportation Now',
  showIcon = true
}: BookingButtonProps) => {
  const handleClick = () => {
    window.open(`${BOOKING_ENGINE_URL}/?ref=${ref}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`${className} ${variant === 'default' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
    >
      {showIcon && <Calendar className="w-4 h-4 mr-2" />}
      {text}
      <ExternalLink className="w-3 h-3 ml-2" />
    </Button>
  );
};

export const FloatingBookingButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <BookingButton 
        size="lg"
        className="shadow-xl animate-pulse hover:animate-none"
        text="Book Now"
      />
    </div>
  );
};

export default BookingButton;