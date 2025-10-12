
import React from 'react';
import { motion } from 'framer-motion';
import { Plane, MapPin, Camera, Heart } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
  variant?: 'default' | 'pulse' | 'dots' | 'travel' | 'gradient';
  theme?: 'light' | 'dark';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...', 
  fullScreen = false,
  variant = 'default',
  theme = 'light'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen bg-background flex items-center justify-center p-4'
    : 'flex items-center justify-center p-4';

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-600';

  const renderSpinner = () => {
    switch (variant) {
      case 'pulse':
        return (
          <motion.div
            className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`${size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4'} bg-blue-500 rounded-full`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        );

      case 'travel':
        return (
          <div className="relative">
            <motion.div
              className={`${sizeClasses[size]} border-2 border-blue-200 rounded-full`}
            />
            <motion.div
              className={`${size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4'} bg-blue-500 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2`}
              animate={{
                y: [0, size === 'sm' ? 8 : size === 'md' ? 12 : 16, 0],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -top-2 left-1/2 transform -translate-x-1/2"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Plane className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-6 w-6'} text-blue-500`} />
            </motion.div>
          </div>
        );

      case 'gradient':
        return (
          <motion.div
            className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500`}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              rotate: 360,
            }}
            transition={{
              backgroundPosition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              },
              rotate: {
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />
        );

      default:
        return (
          <motion.div
            className={`${sizeClasses[size]} border-2 border-gray-300 border-t-blue-500 rounded-full`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
    }
  };

  const renderTravelMessage = () => {
    const messages = [
      "Exploring Sri Lanka's wonders...",
      "Finding your perfect adventure...",
      "Loading amazing destinations...",
      "Preparing your journey...",
      "Discovering hidden gems...",
      "Mapping your route...",
      "Loading cultural treasures...",
      "Finding the best experiences..."
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className={containerClasses}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="mb-4">
          {renderSpinner()}
        </div>
        
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`${textColor} font-medium text-sm md:text-base`}
          >
            {variant === 'travel' ? renderTravelMessage() : message}
          </motion.p>
        )}

        {/* Travel-themed decorative elements */}
        {variant === 'travel' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center space-x-4 mt-4"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            >
              <MapPin className="h-4 w-4 text-blue-400" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Camera className="h-4 w-4 text-purple-400" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Heart className="h-4 w-4 text-red-400" />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
