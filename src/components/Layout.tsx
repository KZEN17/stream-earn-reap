import { Button } from "@/components/ui/button";
import { Sidebar } from "./Sidebar";
import { FontToggle } from "./FontToggle";
import { ThemeToggle } from "./ThemeToggle";
import TargetCursor from "@/components/ui/TargetCursor";
import GradualBlur from "@/components/ui/GradualBlur";
import { NotificationCenter } from "./layout/NotificationCenter";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { useNavigate, useLocation } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth();
  const { openModal } = useLoginModal();
  const navigate = useNavigate();
  const location = useLocation();

  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen grid grid-cols-[18rem_1fr] bg-bg text-text">
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
        targetSelector="button, a, [role='button'], [role='link'], .cursor-target, input[type='button'], input[type='submit']"
      />
      <Sidebar currentPath={location.pathname} onNavigate={navigate} />
      
      <main className="border-l border-line flex flex-col relative z-10">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-end px-6 border-b border-line bg-surface/50 backdrop-blur-sm">
          {/* Theme Toggle & User Menu */}
          <div className="flex items-center space-x-3">
            <NotificationCenter />
            <FontToggle />
            <ThemeToggle />
              
            {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 hover:bg-accent">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {getUserInitials(user.email || '')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {user.email?.split('@')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="w-48 bg-popover/95 backdrop-blur-lg border border-border shadow-glow z-50">
                     <DropdownMenuItem 
                       onClick={() => navigate('/profile')} 
                       className="cursor-pointer hover:bg-accent focus-glow interactive"
                     >
                       <User className="mr-2 h-4 w-4" />
                       Profile
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={signOut} className="cursor-pointer hover:bg-accent focus-glow interactive">
                       <LogOut className="mr-2 h-4 w-4" />
                       Sign Out
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={openModal}
                    className="text-sm hover:bg-accent"
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm"
                    onClick={openModal}
                    className="bg-gradient-primary hover:opacity-90 text-white font-semibold"
                  >
                    Sign Up
                  </Button>
                </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 relative" style={{ position: 'relative', minHeight: '500px' }}>
          <div style={{ padding: '2rem', minHeight: '800px' }}>
            {children}
          </div>
        </div>
        
        {/* Fixed GradualBlur attached to viewport */}
        <GradualBlur
          target="page"
          position="bottom"
          height="8rem"
          strength={4}
          divCount={8}
          curve="bezier"
          exponential={true}
          opacity={1}
        />

        {/* Footer */}
        <footer className="bg-surface/30 border-t border-line mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-accent rounded-lg"></div>
                  <span className="font-bold text-accent">CLIP</span>
                </div>
                <div className="flex space-x-4 text-sm text-muted">
                  <a href="#" className="hover:text-text transition-colors">Discord</a>
                  <a href="#" className="hover:text-text transition-colors">Twitter</a>
                  <a href="/terms" className="hover:text-text transition-colors">Terms</a>
                  <a href="#" className="hover:text-text transition-colors">DMCA</a>
                  <a href="#" className="hover:text-text transition-colors">Contact</a>
                </div>
              </div>
              <p className="text-sm text-muted">
                © 2024 CLIP. Entertainment becomes finance.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Layout;