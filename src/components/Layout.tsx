import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import TargetCursor from "@/components/ui/TargetCursor";
import GradualBlur from "@/components/ui/GradualBlur";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative">
        <TargetCursor 
          spinDuration={2}
          hideDefaultCursor={true}
        />
        <AppSidebar />
        
        <div className="flex-1 flex flex-col relative z-10">
          {/* Top Header */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <button className="cursor-target bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Login
              </button>
              <button className="cursor-target bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Sign Up
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 relative" style={{ position: 'relative', overflow: 'hidden' }}>
            {children}
            <GradualBlur
              target="parent"
              position="bottom"
              height="6rem"
              strength={2}
              divCount={5}
              curve="bezier"
              exponential={true}
              opacity={1}
            />
          </main>

          {/* Footer */}
          <footer className="bg-muted/30 border-t border-border mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-primary rounded-lg"></div>
                    <span className="font-bold text-gradient-primary">CLIP</span>
                  </div>
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-foreground transition-colors">Discord</a>
                    <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
                    <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                    <a href="#" className="hover:text-foreground transition-colors">DMCA</a>
                    <a href="#" className="hover:text-foreground transition-colors">Contact</a>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  © 2024 CLIP. Entertainment becomes finance.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;