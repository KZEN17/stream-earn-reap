import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Leaderboards from "./pages/Leaderboards";
import Calendar from "./pages/Calendar";
import RaidChat from "./pages/RaidChat";
import Rewards from "./pages/Rewards";
import Guide from "./pages/Guide";
import About from "./pages/About";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const App = () => {
  const { user, loading } = useAuth();

  console.log('App rendering - user:', user ? 'logged in' : 'not logged in', 'loading:', loading);

  if (loading) {
    console.log('App showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    console.log('App showing auth page');
    return <Auth />;
  }

  console.log('App showing main app');
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/leaderboards/:type" element={<Leaderboards />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/raidchat" element={<RaidChat />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </TooltipProvider>
  );
};

export default App;
