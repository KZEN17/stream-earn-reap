import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Trophy, 
  Calendar as CalendarIcon, 
  Zap, 
  DollarSign, 
  BookOpen, 
  Rocket,
  TrendingUp,
  ChevronDown,
  Info,
  User,
  LogOut,
  Settings
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginModal } from "@/contexts/LoginModalContext";

const menuItems = [
  { 
    title: "Home", 
    url: "/", 
    icon: Home 
  },
  { 
    title: "Launch Stream", 
    url: "/calendar", 
    icon: Rocket 
  },
  { 
    title: "Creator Rewards", 
    url: "/rewards", 
    icon: DollarSign 
  },
  { 
    title: "RAID Chat", 
    url: "/raidchat", 
    icon: Zap 
  },
  { 
    title: "Tournament", 
    url: "/leaderboards", 
    icon: Trophy
  },
  { 
    title: "Guide", 
    url: "/guide", 
    icon: BookOpen 
  },
  { 
    title: "About", 
    url: "/about", 
    icon: Info 
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const { openModal } = useLoginModal();
  
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getNavClassName = (isActiveRoute: boolean) =>
    isActiveRoute 
      ? "bg-primary/30 text-primary font-black border-r-4 border-primary shadow-glow" 
      : "text-sidebar-foreground hover:text-primary hover:bg-primary/20 transition-all duration-300";

  const getItemClassName = (itemTitle: string, isActiveRoute: boolean) => {
    const baseClass = getNavClassName(isActiveRoute);
    // Apply bold font (Leaderboard style) to all items
    return `${baseClass} font-bold`;
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <Sidebar 
      className={`${collapsed ? "w-16" : "w-64"} gaming-sidebar`} 
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="gaming-sidebar-header">
        <div className="flex items-center space-x-3 px-4 py-4">
          <div className="w-10 h-10 bg-gradient-gaming rounded-xl glow-primary flex-shrink-0 animate-pulse-glow"></div>
          {!collapsed && (
            <span className="text-2xl font-black text-gradient-gaming font-gaming tracking-wider animate-stagger">
              CLIP
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gaming-sidebar-content">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-gradient-accent font-black uppercase tracking-widest text-sm px-6 py-4 animate-stagger">
              ⚡ NAVIGATION
            </SidebarGroupLabel>
          )}
          
          <SidebarGroupContent className="px-3">
            <SidebarMenu className="space-y-2">
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={collapsed ? item.title : undefined}
                    className="gaming-nav-item"
                  >
                    <NavLink 
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover-lift ${
                          isActive 
                            ? 'bg-gradient-primary text-white shadow-glow-primary border border-primary/30 animate-micro-bounce' 
                            : 'text-muted-foreground hover:text-white hover:bg-accent/20 hover:border-accent/30 border border-transparent'
                        }`
                      }
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <item.icon className={`h-5 w-5 flex-shrink-0 ${collapsed ? '' : 'animate-float'}`} />
                      {!collapsed && (
                        <span className="font-gaming text-base tracking-wide">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter 
        className="border-t border-sidebar-border !bg-sidebar p-2" 
        style={{ backgroundColor: 'hsl(225 15% 6%)', borderColor: 'hsl(225 15% 15%)' }}
      >
        {user ? (
          // Logged in user menu
          <>
            {collapsed ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full h-12 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {user?.email ? getUserInitials(user.email) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                 <DropdownMenuContent side="right" className="w-56 bg-popover/95 backdrop-blur-lg shadow-glow">
                   <DropdownMenuLabel className="font-normal">
                     <div className="flex flex-col space-y-1">
                       <p className="text-sm font-medium leading-none">
                         {user?.email?.split('@')[0]}
                       </p>
                       <p className="text-xs leading-none text-muted-foreground">
                         {user?.email}
                       </p>
                     </div>
                   </DropdownMenuLabel>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem onClick={() => navigate('/profile')} className="focus-glow interactive">
                     <User className="mr-2 h-4 w-4" />
                     Profile Settings
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={signOut} className="focus-glow interactive">
                     <LogOut className="mr-2 h-4 w-4" />
                     Log out
                   </DropdownMenuItem>
                 </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {user?.email ? getUserInitials(user.email) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {user?.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                   <DropdownMenuContent side="top" className="w-56 bg-popover/95 backdrop-blur-lg shadow-glow">
                     <DropdownMenuItem onClick={() => navigate('/profile')} className="focus-glow interactive">
                       <User className="mr-2 h-4 w-4" />
                       Profile Settings
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={signOut} className="focus-glow interactive">
                       <LogOut className="mr-2 h-4 w-4" />
                       Log out
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </>
        ) : (
          // Not logged in - show login button
          <div className="p-2">
            <Button 
              onClick={openModal}
              className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold"
              size={collapsed ? "sm" : "default"}
            >
              {collapsed ? <User className="h-4 w-4" /> : "Sign In"}
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}