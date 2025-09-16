import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Star, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Trophy,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReputationData {
  score: number;
  level: string;
  totalEarnings: number;
  completedCampaigns: number;
  communityVotes: number;
  isVerified: boolean;
  kycCompleted: boolean;
  badges: string[];
}

export const ReputationScore = ({ userId }: { userId: string }) => {
  const [reputation, setReputation] = useState<ReputationData>({
    score: 98,
    level: "Trusted Creator",
    totalEarnings: 15420,
    completedCampaigns: 23,
    communityVotes: 145,
    isVerified: true,
    kycCompleted: true,
    badges: ["top_performer", "reliable", "innovative"]
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getLevelBadge = (level: string) => {
    const config = {
      "New Creator": { variant: "outline" as const, color: "text-gray-500" },
      "Rising Creator": { variant: "secondary" as const, color: "text-blue-500" },
      "Trusted Creator": { variant: "default" as const, color: "text-green-500" },
      "Elite Creator": { variant: "destructive" as const, color: "text-purple-500" }
    };
    const levelConfig = config[level as keyof typeof config] || config["New Creator"];
    return <Badge variant={levelConfig.variant}>{level}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="w-5 h-5 mr-2 text-primary" />
            Reputation Score
          </div>
          {reputation.isVerified && (
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">Verified</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(reputation.score)}`}>
            {reputation.score}
          </div>
          <div className="text-sm text-muted-foreground mb-2">Reputation Score</div>
          {getLevelBadge(reputation.level)}
        </div>

        {/* Progress to Next Level */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress to Elite Creator</span>
            <span>{reputation.score}/100</span>
          </div>
          <Progress value={reputation.score} className="h-2" />
        </div>

        {/* Reputation Factors */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
              Total Earnings
            </span>
            <span className="font-medium">${reputation.totalEarnings.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
              Completed Campaigns
            </span>
            <span className="font-medium">{reputation.completedCampaigns}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Community Votes
            </span>
            <span className="font-medium">{reputation.communityVotes}</span>
          </div>
        </div>

        {/* Verification Status */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Verification Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Identity Verified</span>
              {reputation.kycCompleted ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Social Accounts</span>
              {reputation.isVerified ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
          </div>
          
          {!reputation.kycCompleted && (
            <Button 
              size="sm" 
              className="w-full mt-3"
              onClick={() => {/* Navigate to KYC process */}}
            >
              Complete Identity Verification
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const TrustBadges = ({ userId }: { userId: string }) => {
  const badges = [
    {
      id: "top_performer",
      name: "Top Performer",
      description: "Consistently high-quality submissions",
      icon: Trophy,
      earned: true
    },
    {
      id: "reliable",
      name: "Reliable",
      description: "100% campaign completion rate",
      icon: Shield,
      earned: true
    },
    {
      id: "innovative", 
      name: "Innovative",
      description: "Creates unique and creative content",
      icon: Star,
      earned: true
    },
    {
      id: "community_favorite",
      name: "Community Favorite",
      description: "High community rating (>4.8/5)",
      icon: Heart,
      earned: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2 text-primary" />
          Trust Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => {
            const IconComponent = badge.icon;
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-lg border text-center ${
                  badge.earned 
                    ? 'border-primary/50 bg-primary/5' 
                    : 'border-muted bg-muted/20 opacity-60'
                }`}
              >
                <IconComponent className={`w-6 h-6 mx-auto mb-2 ${badge.earned ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="text-xs font-medium">{badge.name}</div>
                <div className="text-xs text-muted-foreground">{badge.description}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export const OnChainTransparency = ({ campaignId }: { campaignId: string }) => {
  const [txData, setTxData] = useState({
    contractAddress: "0x1234...abcd",
    totalPayouts: 15420,
    payoutCount: 45,
    lastUpdate: "2024-12-20T10:30:00Z",
    explorerUrl: "https://etherscan.io/address/0x1234567890abcdef"
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ExternalLink className="w-5 h-5 mr-2 text-primary" />
          On-Chain Transparency
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          All campaign data is recorded on-chain for full transparency
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm">Contract Address</span>
            <code className="text-xs bg-muted px-2 py-1 rounded">{txData.contractAddress}</code>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm">Total Payouts</span>
            <span className="font-medium">${txData.totalPayouts.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm">Payout Transactions</span>
            <span className="font-medium">{txData.payoutCount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm">Last Updated</span>
            <span className="text-xs">{new Date(txData.lastUpdate).toLocaleDateString()}</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => window.open(txData.explorerUrl, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Explorer
        </Button>
      </CardContent>
    </Card>
  );
};