import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isDesktop: boolean;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
    isMobile: false,
    isDesktop: false,
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isDesktop = width >= 768;

      setWindowSize({
        width,
        height,
        isMobile,
        isDesktop,
      });
    }

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
