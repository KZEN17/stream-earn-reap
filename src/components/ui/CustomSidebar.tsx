import React from 'react';
import { 
  Home, 
  Calendar, 
  Trophy, 
  MessageSquare, 
  BarChart3, 
  BookOpen, 
  User, 
  Palette, 
  Boxes, 
  Download 
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'calendar', label: 'Launch Calendar', icon: Calendar, path: '/calendar' },
  { id: 'rewards', label: 'Rewards', icon: Trophy, path: '/rewards' },
  { id: 'raid-chat', label: 'Raid Chat', icon: MessageSquare, path: '/raidchat' },
  { id: 'leaderboards', label: 'Leaderboards', icon: BarChart3, path: '/leaderboards' },
  { id: 'guide', label: 'Guide', icon: BookOpen, path: '/guide' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  { id: 'brand-book', label: 'Brand Book', icon: Palette, path: '/brand-book' },
  { id: 'ui-kit', label: 'UI Kit', icon: Boxes, path: '/ui-kit' },
  { id: 'media-pack', label: 'Media Pack', icon: Download, path: '/media-pack' },
];

export const CustomSidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const isActive = (itemPath: string) => {
    if (itemPath === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(itemPath);
  };

  return (
    <div className="sidebar-container">
      {/* Top Section - Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center space-x-3">
          {/* Logo Box */}
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">C</span>
          </div>
          {/* Text Logo */}
          <div className="text-gradient-emerald-teal text-lg font-semibold tracking-wide">
            ClipStream
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="px-4 flex-1">
        <ul className="space-y-3">
          {navigationItems.map((item) => {
            const isItemActive = isActive(item.path);
            const Icon = item.icon;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.path)}
                  className={`
                    sidebar-nav-item
                    ${isItemActive ? 'sidebar-nav-active' : 'sidebar-nav-default'}
                  `}
                >
                  <div className="flex items-center space-x-3 relative z-10">
                    <Icon 
                      className={`
                        h-5 w-5 transition-colors duration-200
                        ${isItemActive ? 'text-emerald-400' : 'text-gray-400'}
                      `} 
                    />
                    <span className={`
                      font-medium text-sm transition-colors duration-200
                      ${isItemActive ? 'text-white' : 'text-gray-400'}
                    `}>
                      {item.label}
                    </span>
                  </div>
                  
                  {/* Active indicator bar */}
                  {isItemActive && (
                    <div className="sidebar-active-bar"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};