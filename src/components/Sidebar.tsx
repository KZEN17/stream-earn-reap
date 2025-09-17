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

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const isActive = (itemPath: string) => {
    if (itemPath === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(itemPath);
  };

  return (
    <div className="bg-bg h-full w-72 flex flex-col">
      {/* Top Section - Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center space-x-3">
          {/* Logo Box */}
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-bg font-bold text-sm">C</span>
          </div>
          {/* Text Logo with Emerald to Teal Gradient */}
          <div className="text-lg font-semibold tracking-wide bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
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
                    w-full flex items-center space-x-3 py-3 px-4 rounded-lg text-sm font-medium 
                    transition-all duration-200 relative group
                    ${isItemActive 
                      ? 'bg-line text-white' 
                      : 'text-muted hover:bg-line'
                    }
                  `}
                >
                  <Icon 
                    className={`
                      h-5 w-5 transition-colors duration-200
                      ${isItemActive ? 'text-accent' : 'text-muted'}
                    `} 
                  />
                  <span className="font-medium">
                    {item.label}
                  </span>
                  
                  {/* Active indicator bar */}
                  {isItemActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-accent rounded-l-full shadow-[0_0_8px_rgba(16,242,138,0.6)]"></div>
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