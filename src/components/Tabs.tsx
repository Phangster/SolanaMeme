'use client';
import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: string | null;
  count?: number;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

const Tabs: React.FC<TabsProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = '',
  variant = 'underline'
}) => {
  const getTabClasses = (tab: TabItem, isActive: boolean) => {
    const baseClasses = "px-4 py-3 font-pixel text-sm font-bold transition-all duration-200 flex items-center gap-2";
    
    switch (variant) {
      case 'pills':
        return `${baseClasses} rounded-lg ${
          isActive 
            ? 'bg-yellow-400 text-black' 
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
        } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;
      
      case 'underline':
        return `${baseClasses} border-b-2 ${
          isActive 
            ? 'border-yellow-400 text-yellow-400' 
            : 'border-transparent text-gray-400 hover:text-white'
        } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;
      
      default:
        return `${baseClasses} ${
          isActive 
            ? 'bg-yellow-400 text-black' 
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
        } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;
    }
  };

  const handleTabClick = (tab: TabItem) => {
    if (!tab.disabled) {
      onTabChange(tab.id);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`flex ${variant === 'pills' ? 'gap-2' : 'border-b border-gray-700'}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={getTabClasses(tab, isActive)}
              disabled={tab.disabled}
            >
              {/* Icon */}
              {tab.icon && (
                <span className="text-lg">{tab.icon}</span>
              )}
              
              {/* Label */}
              <span>{tab.label}</span>
              
              {/* Count Badge */}
              {typeof tab.count === 'number' && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  isActive 
                    ? 'bg-black text-yellow-400' 
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
