'use client';
import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import Sidebar from './Sidebar';
import { useSidebar } from '@/hooks/useSidebar';
import LoadingPage from './LoadingPage';
import Image from 'next/image';
import { truncateWallet } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: string;
  isLoading?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, currentRoute, isLoading = false }) => {
  const { connected, publicKey } = useWallet();
  const { isAuthenticated, user } = useWalletAuth();
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
        <LoadingPage message="Be Patient $YAO..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Toggle Button - Only show on mobile when sidebar is closed */}
      {!isSidebarVisible && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 right-4 z-50 bg-yellow-400 text-black px-4 py-2 h-10 rounded-lg hover:bg-yellow-300 transition-colors font-pixel md:hidden flex items-center gap-2"
        >
          {connected && isAuthenticated ? (
            <>
              <div className="relative group">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-black transition-all duration-300 group-hover:border-gray-600">
                  {user?.profilePicture?.secureUrl ? (
                    <Image
                      src={user.profilePicture.secureUrl}
                      alt="Profile"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                    />
                  ) : (
                    <Image
                      src="/default-avatar.png"
                      alt="Default Profile"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                    />
                  )}
                </div>
              </div>
              <span className="text-xs">
                {user?.wallet ? truncateWallet(user.wallet) : 
                 publicKey ? truncateWallet(publicKey.toString()) : 'Connected'}
              </span>
            </>
          ) : (
            <span>menu</span>
          )}
        </button>
      )}

      {/* Desktop Layout - Flexbox for sidebar and content */}
      <div className="flex">
        {/* Main Content Area - Scrollable */}
        <div 
          ref={contentRef}
          className="flex-1 sm:px-6 lg:px-8 overflow-y-auto h-screen"
        >
          {children}
        </div>
        
        {/* Sidebar - Inline on desktop, fixed on mobile - Hide on desktop during loading */}
        {isSidebarVisible && (
          <>
            {/* Mobile: Fixed overlay sidebar - Always show if visible */}
            <div className="md:hidden fixed right-0 top-20 h-[calc(100vh-5rem)] z-40">
              <Sidebar 
                currentRoute={currentRoute} 
                onNavigate={handleNavigation} 
                onClose={closeSidebar}
              />
            </div>
            
            {/* Desktop: Inline sidebar - Hide during loading */}
            {!isLoading && (
              <div className="hidden md:block">
                <Sidebar 
                  currentRoute={currentRoute} 
                  onNavigate={handleNavigation} 
                  onClose={closeSidebar}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Layout;
