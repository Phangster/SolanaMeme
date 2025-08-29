'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import HomeContent from '@/components/HomeContent';
import HowToBuyContent from '@/components/HowToBuyContent';
import OriginsContent from '@/components/OriginsContent';
import ShortsContent from '@/components/ShortsContent';
import ChartContent from '@/components/ChartContent';
import Sidebar from '@/components/Sidebar';
import { useWindowSize } from '@/hooks/useWindowSize';

export default function Home() {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isMobile, isDesktop } = useWindowSize();
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Function to handle navigation without page reload
  const handleNavigation = useCallback((route: string) => {
    setCurrentRoute(route);
    // Update the URL without page reload
    window.history.pushState({}, '', route);
    
    // Scroll to top when navigating to new component
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    
    // Auto close sidebar on mobile after navigation
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  }, [isMobile]);

  // Function to render content based on current route
  const renderContent = useCallback(() => {
    switch (currentRoute) {
      case '/how-to-buy':
        return <HowToBuyContent />;
      case '/origins':
        return <OriginsContent onNavigate={handleNavigation} />;
      case '/shorts':
        return <ShortsContent />;
      case '/chart':
        return <ChartContent />;
      default:
        return <HomeContent onNavigate={handleNavigation} />;
    }
  }, [currentRoute, handleNavigation]);

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <main className="min-h-screen bg-black">
        <div className="flex">
          <div className="flex-1 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Toggle Button - Only show on mobile when sidebar is closed */}
      {isMobile && !isSidebarVisible && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 right-4 z-50 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-pixel"
        >
          menu
        </button>
      )}

      {/* Desktop Layout - Flexbox for sidebar and content */}
      <div className="flex">
        {/* Main Content Area - Takes remaining space */}
        <div 
          ref={contentRef}
          className="flex-1 pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-auto h-screen"
        >
          {renderContent()}
        </div>
        
        {/* Sidebar - Always visible on desktop, toggleable on mobile */}
        {isSidebarVisible && (
          <Sidebar 
            currentRoute={currentRoute} 
            onNavigate={handleNavigation} 
            onClose={closeSidebar}
          />
        )}
      </div>
    </main>
  );
}
