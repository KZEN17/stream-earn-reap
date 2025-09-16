import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Leaderboards from "./pages/Leaderboards";
import Calendar from "./pages/Calendar";
import RaidChat from "./pages/RaidChat";
import Rewards from "./pages/Rewards";
import Guide from "./pages/Guide";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const App = () => {
  console.log('App component is rendering');
  
  return (
    <div className="min-h-screen bg-background text-foreground">
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
    </div>
  );
};

export default App;
