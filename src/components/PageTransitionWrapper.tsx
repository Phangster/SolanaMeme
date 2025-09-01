'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import RaindropOverlay from './RaindropOverlay';

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({ children }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show overlay on every route change
    setShowOverlay(true);
    
    // Hide overlay after 10 seconds
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {showOverlay && <RaindropOverlay />}
      {children}
    </>
  );
};

export default PageTransitionWrapper;
