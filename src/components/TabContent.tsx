'use client';
import React from 'react';

interface TabContentProps {
  activeTab: string;
  tabId: string;
  children: React.ReactNode;
  className?: string;
  lazy?: boolean; // Only render when active
}

const TabContent: React.FC<TabContentProps> = ({ 
  activeTab, 
  tabId, 
  children, 
  className = '',
  lazy = false 
}) => {
  const isActive = activeTab === tabId;
  
  // If lazy loading is enabled, don't render inactive tabs
  if (lazy && !isActive) {
    return null;
  }
  
  return (
    <div 
      className={`${isActive ? 'block' : 'hidden'} ${className}`}
      role="tabpanel"
      aria-labelledby={`tab-${tabId}`}
    >
      {children}
    </div>
  );
};

export default TabContent;
