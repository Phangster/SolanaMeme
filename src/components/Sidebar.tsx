'use client';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { truncateWallet } from '@/lib/utils';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onClose: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: string | null;
  description: string | null;
}

const Sidebar = ({ currentRoute, onNavigate, onClose }: SidebarProps) => {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { isAuthenticated, isLoading, user, forceUpdate } = useWalletAuth();

  // Track if authentication just completed for animation
  const [justAuthenticated, setJustAuthenticated] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [forceRender, setForceRender] = useState(0);
  
  // Force re-render when authentication state changes
  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [isAuthenticated, isLoading, forceUpdate]);

  // Set animation state when authentication completes
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setJustAuthenticated(true);
      // Reset animation after 2 seconds
      const timer = setTimeout(() => {
        setJustAuthenticated(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, forceUpdate]);

  // Also trigger animation when forceUpdate changes and user is authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading && forceUpdate > 0) {
      setJustAuthenticated(true);
      const timer = setTimeout(() => {
        setJustAuthenticated(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [forceUpdate, isAuthenticated, isLoading]);

  // Watch for forceUpdate changes specifically
  useEffect(() => {
    // Force a complete re-render when forceUpdate changes
    setRenderKey(prev => prev + 1);
    setForceRender(prev => prev + 1);
  }, [forceUpdate]);

  // Additional effect to force re-render when authentication completes
  useEffect(() => {
    if (isAuthenticated && !isLoading && forceUpdate > 0) {
      setRenderKey(prev => prev + 1);
      setForceRender(prev => prev + 1);
      // Force another re-render after a short delay
      setTimeout(() => {
        setRenderKey(prev => prev + 1);
        setForceRender(prev => prev + 1);
      }, 100);
    }
  }, [isAuthenticated, isLoading, forceUpdate]);


  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2';
  const solscanBaseUrl = process.env.NEXT_PUBLIC_SOLSCAN_BASE_URL || 'https://solscan.io/token/';
  const solscanUrl = `${solscanBaseUrl}${contractAddress}`;
  const navigationItems: NavItem[] = [
    {
      path: '/',
      label: 'home',
      icon: null,
      description: null
    },
    {
      path: '/how-to-buy',
      label: 'how to buy',
      icon: null,
      description: null
    },
    {
      path: '/origins',
      label: 'origins',
      icon: null,
      description: null
    },
    {
      path: '/shorts',
      label: 'shorts',
      icon: null,
      description: null
    },
    {
      path: '/feed',
      label: 'feed',
      icon: null,
      description: null
    },
    {
      path: '/chart',
      label: 'chart',
      icon: null,
      description: null
    }
  ];

  return (
    <>
      {/* Mobile Overlay - Only show on mobile */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar - Responsive positioning */}
      <nav className="md:relative md:top-0 md:h-full fixed top-0 right-0 h-full w-[320px] bg-white border-l border-gray-200 z-50 overflow-y-auto shadow-2xl md:shadow-none transition-all duration-300">
        <div className="pt-6 px-6 relative h-full">
          {/* Close Button - Visible on all screen sizes */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-black hover:text-gray-600 transition-all duration-200 font-pixel hover:scale-110 md:hidden"
          >
            close
          </button>
          
          {/* Navigation Items */}
          <div className="flex flex-col justify-between h-full pt-10 md:pt-0">
            <div className="space-y-4">
              {navigationItems.map((item) => {
                const isActive = currentRoute === item.path;
                return (
                  <div key={item.path} className="group">
                    <button 
                      onClick={() => onNavigate(item.path)}
                      className={`w-full p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                        isActive 
                          ? 'bg-yellow-400 text-black shadow-lg scale-105' 
                          : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-black'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon && (
                          <span className="text-2xl group-hover:animate-bounce">
                            {item.icon}
                          </span>
                        )}
                        <div className="text-left">
                          <div className={`font-pixel text-lg transition-all duration-200 ${
                            isActive ? 'font-bold' : 'font-normal'
                          }`}>
                            {item.label}
                          </div>
                          {item.description && (
                            <div className={`text-xs transition-all duration-200 ${
                              isActive ? 'text-black' : 'text-gray-400'
                            }`}>
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-yellow-500 rounded-r-full animate-pulse" />
                      )}
                    </button>
                    
                    {/* Hover Effect Line */}
                    <div className={`h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 transform scale-x-0 transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'group-hover:scale-x-100'
                    }`} />
                  </div>
                );
              })}
            </div>
            <div className="space-y-4 mb-4" key={`auth-container-${forceUpdate}-${forceRender}`}>
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-bold text-yellow-400 mb-2 font-pixel text-center">Contract Address</h3>
                  <div className="bg-gray-800 p-3 rounded-lg mb-3">
                    <p className="font-mono text-xs text-yellow-400 break-all text-center">
                      {contractAddress}
                    </p>
                  </div>
                  <button
                    onClick={() => window.open(solscanUrl, '_blank')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg font-pixel text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowTopRightOnSquareIcon className="size-5" />
                    View on Solscan
                  </button>
                </div>

              {connected && isAuthenticated ? (
                // Connected and authenticated - Show dashboard access
                <button 
                  key={`dashboard-${isAuthenticated}-${renderKey}-${forceUpdate}-${forceRender}`}
                  onClick={() => onNavigate('/dashboard')}
                  className={`w-full bg-yellow-400 text-black px-6 py-4 rounded-lg hover:bg-yellow-300 transition-all duration-500 transform hover:scale-105 font-pixel mb-10 border-2 border-yellow-500 ${
                    justAuthenticated ? 'animate-bounce shadow-lg shadow-yellow-400/50' : ''
                  }`}
                >
                  <div className="transition-all duration-300">
                    <div className="text-lg font-bold">
                      dashboard
                    </div>
                    <div className="text-xs opacity-80">
                      {user?.wallet && truncateWallet(user.wallet)}
                    </div>
                  </div>
                </button>
              ) : (
                // Not connected or not authenticated - Show connection button
                <button 
                  key={`connect-${connected}-${isAuthenticated}-${renderKey}-${forceUpdate}-${forceRender}`}
                  onClick={() => {
                    if (!connected) {
                      // Open wallet selection modal - authentication will happen automatically
                      setVisible(true);
                    }
                  }}
                  disabled={isLoading || (connected && !isAuthenticated)}
                  className="inline-block bg-yellow-400 text-black px-8 py-4 text-xl font-bold rounded-lg hover:bg-yellow-300 transition-all duration-500 transform hover:scale-105 font-pixel mb-10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'LOADING...' : 
                  !connected ? 'BECOME A YAO NOW' :
                  'CONNECTING'}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
