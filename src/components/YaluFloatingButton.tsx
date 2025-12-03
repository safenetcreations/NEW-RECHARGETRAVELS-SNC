import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Mic, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import YaluVoiceAgent from './YaluVoiceAgent';

interface YaluFloatingButtonProps {
  className?: string;
}

const YaluFloatingButton: React.FC<YaluFloatingButtonProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip after 5 seconds if user hasn't interacted
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted && !isOpen) {
        setShowTooltip(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [hasInteracted, isOpen]);

  // Hide tooltip after 8 seconds
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setHasInteracted(true);
    setShowTooltip(false);
    setShowPulse(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className={cn('fixed bottom-6 right-6 z-[9998]', className)}>
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              className="absolute bottom-full right-0 mb-3 w-64"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🐆</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Hi! I'm Yalu 👋</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Your Sri Lankan travel companion. Ask me anything about beaches, safaris, or planning your trip!
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggle}
                  className="mt-3 w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-xl hover:opacity-90 transition"
                >
                  Start Chat 💬
                </button>
                {/* Arrow */}
                <div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-white border-r border-b border-amber-100 transform rotate-45" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onClick={handleToggle}
          className={cn(
            'relative w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300',
            isOpen
              ? 'bg-slate-800 hover:bg-slate-700'
              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pulse rings */}
          {showPulse && !isOpen && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-amber-400"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-amber-400"
                animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}

          {/* Icon */}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-7 w-7 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                {/* Leopard icon */}
                <span className="text-2xl">🐆</span>
                
                {/* Voice indicator */}
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Mic className="w-2.5 h-2.5 text-white" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Label */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span className="text-xs font-medium text-slate-600 bg-white px-2 py-1 rounded-full shadow-sm border border-amber-100">
              Ask Yalu 🎙️
            </span>
          </motion.div>
        )}
      </div>

      {/* Voice Agent Modal */}
      <YaluVoiceAgent isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default YaluFloatingButton;







