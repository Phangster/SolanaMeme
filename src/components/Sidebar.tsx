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
      
      {/* Sidebar - Fixed on mobile, inline on desktop */}
      <nav className="fixed md:relative top-0 right-0 h-screen w-[275px] bg-white border-l border-gray-200 z-50 overflow-y-auto shadow-2xl md:shadow-none transition-all duration-300">
        <div className="pt-20 px-6 relative h-full">
          {/* Close Button for Mobile */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-black hover:text-gray-600 transition-all duration-200 font-pixel hover:scale-110 md:hidden"
          >
            close
          </button>
          
          {/* Navigation Items */}
          <div className="flex flex-col justify-between h-full">
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
            <button 
              onClick={() => window.location.href = '/how-to-buy'}
              className="inline-block bg-yellow-400 text-black px-8 py-4 text-xl font-bold rounded-lg hover:bg-yellow-300 transition-colors transform hover:scale-105 font-pixel mb-10"
            >
              BECOME A YAO NOW
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
