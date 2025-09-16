import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import PixelBlast from "@/components/ui/PixelBlast";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative">
        <div className="absolute inset-0 z-0">
          <PixelBlast
            variant="circle"
            pixelSize={6}
            color="#DCFF00"
            patternScale={3}
            patternDensity={1.2}
            pixelSizeJitter={0.5}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.6}
            edgeFade={0.25}
            transparent
          />
        </div>
        <AppSidebar />
        
        <div className="flex-1 flex flex-col relative z-10">
          {/* Top Header */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/80 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                Login
              </Button>
              <Button variant="hero" size="sm" className="shadow-glow">
                Sign Up
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 bg-background/80 backdrop-blur-sm">
            {children}
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