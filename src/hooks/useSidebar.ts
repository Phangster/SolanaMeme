import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWindowSize } from './useWindowSize';

interface UseSidebarReturn {
  isSidebarVisible: boolean;
  isMounted: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  handleNavigation: (route: string) => void;
}

export function useSidebar(): UseSidebarReturn {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isMobile, isDesktop } = useWindowSize();
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Ensure component is mounted before rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Force sidebar visibility based on screen size
  useEffect(() => {
    if (isMounted) {
      if (isDesktop) {
        // Force sidebar open on desktop
        setIsSidebarVisible(true);
      } else if (isMobile) {
        // Auto close sidebar on mobile
        setIsSidebarVisible(false);
      }
    }
  }, [isMounted, isMobile, isDesktop]);

  const toggleSidebar = useCallback(() => {
    // Only allow toggle on mobile
    if (isMobile) {
      setIsSidebarVisible(!isSidebarVisible);
    }
  }, [isMobile, isSidebarVisible]);

  const closeSidebar = useCallback(() => {
    // Only allow closing on mobile
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  }, [isMobile]);

  // Function to handle navigation using Next.js router
  const handleNavigation = useCallback((route: string) => {
    // Navigate to the new route using Next.js router
    router.push(route);
    
    // Auto close sidebar on mobile after navigation
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  }, [isMobile, router]);

  return {
    isSidebarVisible,
    isMounted,
    contentRef,
    toggleSidebar,
    closeSidebar,
    handleNavigation,
  };
}
