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
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import PrivyAuth from "./pages/PrivyAuth";
import NotFound from "./pages/NotFound";
import StreamerApplication from "./pages/StreamerApplication";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignAnalytics from "./pages/CampaignAnalytics";
import SuccessStories from "./pages/SuccessStories";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { CTAAuditDashboard } from "./components/qa/CTAAuditDashboard";
import PrivyWrapper from "./contexts/SimpleWalletContext";
import { Loader2 } from "lucide-react";

const App = () => {
  const { user, loading, needsOnboarding } = useAuth();

  console.log('App rendering - user:', user ? 'logged in' : 'not logged in', 'loading:', loading, 'needsOnboarding:', needsOnboarding);

  if (loading) {
    console.log('App showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If user is logged in but needs onboarding, show onboarding flow
  if (user && needsOnboarding) {
    console.log('App showing onboarding flow');
    return <OnboardingFlow />;
  }

  // Show main app for everyone (authenticated or not)
  console.log('App showing main app');
  return (
    <PrivyWrapper>
      <div className="min-h-screen bg-background text-foreground">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <PWAInstallPrompt />
          <OfflineIndicator />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/leaderboards" element={<Leaderboards />} />
              <Route path="/leaderboards/:type" element={<Leaderboards />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/raid-chat" element={<RaidChat />} />
              <Route path="/raidchat" element={<RaidChat />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/privy-auth" element={<PrivyAuth />} />
              <Route path="/apply-streamer" element={<StreamerApplication />} />
              <Route path="/streamer-application" element={<StreamerApplication />} />
              <Route path="/create-campaign" element={<CreateCampaign />} />
              <Route path="/campaign-analytics/:campaignId" element={<CampaignAnalytics />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/qa-audit" element={<CTAAuditDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </TooltipProvider>
      </div>
    </PrivyWrapper>
  );
};

export default App;
