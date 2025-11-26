import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Don't scroll to top if there's a hash in the URL (e.g., #national-parks)
    // The hash navigation should be handled by the individual page components
    if (!hash) {
      // Smooth scroll to top when route changes
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop; 