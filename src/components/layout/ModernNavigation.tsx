import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Trophy, 
  Calendar, 
  Gift, 
  User, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Leaderboards", href: "/leaderboards", icon: Trophy },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Rewards", href: "/rewards", icon: Gift },
  { name: "Profile", href: "/profile", icon: User },
];

export function ModernSidebar({ className }: { className?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav className={cn(
      "flex flex-col h-full bg-sidebar border-r border-sidebar-border backdrop-blur-sm",
      "transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <h1 className="font-display font-bold text-xl text-gradient-modern">CLIP</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-sidebar-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent hover:shadow-glow",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                  : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export function ModernBottomNav({ className }: { className?: string }) {
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border",
      "flex items-center justify-around p-2 safe-area-inset-bottom",
      className
    )}>
      {navigationItems.slice(0, 5).map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200",
              "hover:bg-accent/10 min-w-0 flex-1",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          <item.icon className="h-5 w-5" />
          <span className="text-xs font-medium truncate">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}