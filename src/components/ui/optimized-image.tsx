import React, { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  onLoad?: () => void;
}

// Generate optimized Unsplash URLs with different sizes
const getOptimizedUrl = (url: string, width: number = 800): string => {
  if (!url) return '';

  // For Unsplash images, use their optimization parameters
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=${width}&q=75&auto=format&fit=crop`;
  }

  return url;
};

// Generate srcset for responsive images
const generateSrcSet = (url: string): string => {
  if (!url || !url.includes('unsplash.com')) return '';

  const baseUrl = url.split('?')[0];
  const sizes = [400, 800, 1200, 1920];

  return sizes
    .map(size => `${baseUrl}?w=${size}&q=75&auto=format&fit=crop ${size}w`)
    .join(', ');
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  width,
  height,
  sizes = '100vw',
  onLoad
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const optimizedSrc = getOptimizedUrl(src, width || 1200);
  const srcSet = generateSrcSet(src);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {/* Blur placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"
          style={{ width, height }}
        />
      )}

      {isInView && (
        <img
          src={optimizedSrc}
          srcSet={srcSet || undefined}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        />
      )}
    </div>
  );
};

// Preload critical images
export const preloadImage = (url: string): void => {
  if (!url) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = getOptimizedUrl(url, 1920);
  document.head.appendChild(link);
};

// Hook for preloading hero images
export const usePreloadImages = (images: string[]) => {
  useEffect(() => {
    images.slice(0, 2).forEach(preloadImage);
  }, [images]);
};

export default OptimizedImage;
