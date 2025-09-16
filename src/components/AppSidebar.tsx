import { NavLink, useLocation } from "react-router-dom";
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
  Info
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
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const menuItems = [
  { 
    title: "Home", 
    url: "/", 
    icon: Home 
  },
  { 
    title: "Content Rewards", 
    url: "/rewards", 
    icon: DollarSign 
  },
  { 
    title: "RAIDCHAT", 
    url: "/raidchat", 
    icon: Zap 
  },
  { 
    title: "Launch", 
    url: "/calendar", 
    icon: Rocket 
  },
  { 
    title: "Leaderboards", 
    url: "/leaderboards", 
    icon: Trophy,
    submenu: [
      { title: "Clippers", url: "/leaderboards/clippers" },
      { title: "Streams", url: "/leaderboards/streams" },
    ]
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
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getNavClassName = (isActiveRoute: boolean) =>
    isActiveRoute 
      ? "bg-accent/30 text-accent font-black border-r-4 border-accent shadow-neon" 
      : "text-accent/90 hover:text-accent hover:bg-accent/20 transition-all duration-300";

  const getItemClassName = (itemTitle: string, isActiveRoute: boolean) => {
    const baseClass = getNavClassName(isActiveRoute);
    // Apply bold font (Leaderboard style) to all items
    return `${baseClass} font-bold`;
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  return (
    <Sidebar 
      className={`${collapsed ? "w-16" : "w-64"} !bg-sidebar border-sidebar-border`} 
      collapsible="icon"
      variant="sidebar"
      style={{ backgroundColor: 'hsl(225 15% 6%)', borderColor: 'hsl(225 15% 15%)' }}
    >
      <SidebarHeader 
        className="border-b border-sidebar-border !bg-sidebar" 
        style={{ backgroundColor: 'hsl(225 15% 6%)', borderColor: 'hsl(225 15% 15%)' }}
      >
        <div className="flex items-center space-x-2 px-4 py-3">
          <div className="w-8 h-8 bg-gradient-accent rounded-lg shadow-neon flex-shrink-0"></div>
          {!collapsed && <span className="text-xl font-black text-accent uppercase tracking-wider">CLIP</span>}
        </div>
      </SidebarHeader>

      <SidebarContent 
        className="!bg-sidebar" 
        style={{ backgroundColor: 'hsl(225 15% 6%)' }}
      >
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-accent font-black uppercase tracking-wider text-xs">NAVIGATION</SidebarGroupLabel>}
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu ? (
                    <Collapsible
                      open={openSubmenu === item.title}
                      onOpenChange={() => toggleSubmenu(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className={`w-full justify-between ${getItemClassName(item.title, isActive(item.url))}`}
                          tooltip={collapsed ? item.title : undefined}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {!collapsed && <span className="font-bold">{item.title}</span>}
                          </div>
                          {!collapsed && <ChevronDown className="h-5 w-5" />}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <NavLink 
                                  to={subItem.url}
                                  className={({ isActive }) => getNavClassName(isActive)}
                                >
                                  <span>{subItem.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild tooltip={collapsed ? item.title : undefined}>
                      <NavLink 
                        to={item.url}
                        end={item.url === "/"}
                        className={({ isActive }) => getItemClassName(item.title, isActive)}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span className="font-bold">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}