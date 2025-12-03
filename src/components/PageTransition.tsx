import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Optimized page transition - faster animations for better UX
const PageTransition: React.FC<PageTransitionProps> = memo(({ children, className = '' }) => {
  const location = useLocation();

  // Memoize variants to prevent recreation
  const pageVariants = useMemo(() => ({
    initial: {
      opacity: 0,
      y: 8, // Reduced from 20 for subtler effect
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -8, // Reduced from -20
    }
  }), []);

  // Ultra-fast transition for snappy feel
  const pageTransition = useMemo(() => ({
    type: 'tween' as const,
    ease: 'easeOut' as const, // Fast easing
    duration: 0.15 // Reduced from 0.4 to 0.15
  }), []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});

PageTransition.displayName = 'PageTransition';

export default PageTransition; 