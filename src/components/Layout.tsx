import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Trophy, 
  Calendar, 
  Zap, 
  Gift, 
  BookOpen, 
  Info, 
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { 
      name: "Leaderboards", 
      href: "/leaderboards", 
      icon: Trophy,
      dropdown: [
        { name: "Clips", href: "/leaderboards/clips" },
        { name: "Clippers", href: "/leaderboards/clippers" },
        { name: "Fees", href: "/leaderboards/fees" },
      ]
    },
    { name: "Launch Calendar", href: "/calendar", icon: Calendar },
    { name: "RAIDCHAT", href: "/raidchat", icon: Zap },
    { name: "Rewards", href: "/rewards", icon: Gift },
    { name: "Guide", href: "/guide", icon: BookOpen },
    { name: "About", href: "/about", icon: Info },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg shadow-glow"></div>
              <span className="text-xl font-bold text-gradient-primary">CLIP</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  {item.dropdown ? (
                    <div className="flex items-center space-x-1 cursor-pointer">
                      <Link
                        to={item.href}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                          isActive(item.href) 
                            ? "text-primary font-medium" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                        <ChevronDown className="w-3 h-3" />
                      </Link>
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-1 w-48 bg-card rounded-lg shadow-card border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        {item.dropdown.map((dropItem) => (
                          <Link
                            key={dropItem.name}
                            to={dropItem.href}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                          >
                            {dropItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.href) 
                          ? "text-primary font-medium" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                Login
              </Button>
              <Button variant="hero" size="sm" className="shadow-glow">
                Sign Up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card border-t border-border">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href) 
                        ? "text-primary font-medium bg-primary/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                  {item.dropdown && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.dropdown.map((dropItem) => (
                        <Link
                          key={dropItem.name}
                          to={dropItem.href}
                          className="block px-3 py-1 text-sm text-muted-foreground hover:text-foreground rounded transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {dropItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-border space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Login
                </Button>
                <Button variant="hero" size="sm" className="w-full shadow-glow">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-primary rounded-lg"></div>
                <span className="font-bold text-gradient-primary">CLIP</span>
              </Link>
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
  );
};

export default Layout;