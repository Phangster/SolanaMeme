import React from 'react';
import Sidebar from './Sidebar';
import { useSidebar } from '@/hooks/useSidebar';

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentRoute }) => {
  const {
    isSidebarVisible,
    isMounted,
    contentRef,
    toggleSidebar,
    closeSidebar,
    handleNavigation,
  } = useSidebar();

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
      {!isSidebarVisible && (
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
          className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 overflow-auto h-screen"
        >
          {children}
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
};

export default Layout;
