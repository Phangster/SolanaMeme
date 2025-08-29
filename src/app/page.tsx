'use client';
import { useState, useEffect } from 'react';
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
  const { isMobile, isDesktop } = useWindowSize();

  // Force sidebar visibility based on screen size
  useEffect(() => {
    if (isDesktop) {
      // Force sidebar open on desktop
      setIsSidebarVisible(true);
    } else if (isMobile) {
      // Auto close sidebar on mobile
      setIsSidebarVisible(false);
    }
  }, [isMobile, isDesktop]);

  const toggleSidebar = () => {
    // Only allow toggle on mobile
    if (isMobile) {
      setIsSidebarVisible(!isSidebarVisible);
    }
  };

  const closeSidebar = () => {
    // Only allow closing on mobile
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  };

  // Function to handle navigation without page reload
  const handleNavigation = (route: string) => {
    setCurrentRoute(route);
    // Update the URL without page reload
    window.history.pushState({}, '', route);
    
    // Auto close sidebar on mobile after navigation
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  };

  // Function to render content based on current route
  const renderContent = () => {
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
  };

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
        <div className="flex-1 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
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
