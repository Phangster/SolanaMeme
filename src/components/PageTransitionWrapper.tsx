'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import RaindropOverlay from './RaindropOverlay';

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({ children }) => {
  const [showOverlay, setShowOverlay] = useState(true); // Start with true to show on initial load
  const pathname = usePathname();

  useEffect(() => {
    // Show overlay on every route change
    setShowOverlay(true);
    
    // Hide overlay after 5 seconds
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {showOverlay && <RaindropOverlay key={pathname} />}
      {children}
    </>
  );
};

export default PageTransitionWrapper;
