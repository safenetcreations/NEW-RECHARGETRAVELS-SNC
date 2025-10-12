import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText,
  children,
  className,
  disabled,
  variant = 'default',
  size = 'default',
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        loading && 'cursor-not-allowed',
        className
      )}
      {...props}
    >
      <motion.div
        className="flex items-center justify-center"
        initial={false}
        animate={loading ? { opacity: 0.7 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </motion.div>
        )}
        
        <motion.span
          animate={loading ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(loading && 'opacity-0')}
        >
          {loading && loadingText ? loadingText : children}
        </motion.span>
      </motion.div>
    </Button>
  );
};

export default LoadingButton; 