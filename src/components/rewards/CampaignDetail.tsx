import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Award, 
  Clock, 
  Users, 
  Target,
  CheckCircle,
  TrendingUp,
  ArrowLeft
} from "lucide-react";

interface CampaignDetailProps {
  campaignId: string;
  onBack: () => void;
  onJoin: (campaignId: string) => void;
}

// Mock campaign detail data
const getCampaignDetail = (id: string) => ({
  id,
  title: "Holiday Crypto Clips Challenge",
  description: "Create viral clips featuring holiday-themed crypto content from top streamers. Focus on pump.fun launches, trading reactions, and festive crypto moments.",
  rewardPool: 5000,
  pointsPerClip: 100,
  bonusMultiplier: 2,
  participants: 89,
  maxParticipants: 200,
  deadline: "Dec 31, 2024",
  startDate: "Dec 1, 2024",
  status: 'active' as const,
  requirements: [
    "Clip must be 15-60 seconds long",
    "Must include holiday or festive elements",
    "Source must be from approved streamers list",
    "Original audio required (no music overlay)",
    "Minimum 720p quality"
  ],
  rewards: [
    { rank: "1st Place", amount: 1000, description: "Most viral clip" },
    { rank: "2nd Place", amount: 750, description: "Second most engagement" },
    { rank: "3rd Place", amount: 500, description: "Third highest views" },
    { rank: "Top 10", amount: 200, description: "Per clip in top 10" },
    { rank: "Participation", amount: 50, description: "For approved submissions" }
  ],
  rules: [
    "All clips must be original content",
    "No copyrighted music or content",
    "Must follow platform guidelines",
    "One submission per 24 hours",
    "Voting manipulation will result in disqualification"
  ],
  tags: ["Holiday", "Crypto", "Viral", "Bonus"],
  leaderboard: [
    { rank: 1, clipper: "CryptoClipKing", clips: 12, points: 2400, views: 45000 },
    { rank: 2, clipper: "ViralMoments", clips: 8, points: 1800, views: 32000 },
    { rank: 3, clipper: "ClipMaster2024", clips: 6, points: 1200, views: 28000 }
  ]
});

export const CampaignDetail = ({ campaignId, onBack, onJoin }: CampaignDetailProps) => {
  const campaign = getCampaignDetail(campaignId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>
      </div>

      {/* Campaign Overview */}
      <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Badge variant="default">Active Campaign</Badge>
              <CardTitle className="text-2xl">{campaign.title}</CardTitle>
              <p className="text-muted-foreground max-w-3xl">{campaign.description}</p>
            </div>
            <div className="text-right space-y-1">
              <div className="text-3xl font-bold text-gradient-primary">
                ${campaign.rewardPool.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Prize Pool</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-medium">Points per Clip</span>
              </div>
              <div className="text-2xl font-bold">
                {campaign.pointsPerClip} <span className="text-sm text-muted-foreground">base</span>
              </div>
              <Badge variant="secondary">
                {campaign.bonusMultiplier}x Holiday Bonus
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Time Remaining</span>
              </div>
              <div className="text-2xl font-bold">15 days</div>
              <div className="text-sm text-muted-foreground">Ends {campaign.deadline}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Participants</span>
              </div>
              <div className="text-2xl font-bold">{campaign.participants}</div>
              <Progress value={(campaign.participants / campaign.maxParticipants) * 100} className="h-2" />
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <Button size="lg" onClick={() => onJoin(campaign.id)}>
              <Users className="w-5 h-5 mr-2" />
              Join Campaign
            </Button>
            <Button variant="outline" size="lg">
              <Target className="w-5 h-5 mr-2" />
              Submit Clip
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Requirements & Rules */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Requirements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {campaign.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {campaign.rules.map((rule, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Rewards & Leaderboard */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>Reward Structure</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaign.rewards.map((reward, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium">{reward.rank}</div>
                      <div className="text-sm text-muted-foreground">{reward.description}</div>
                    </div>
                    <div className="text-lg font-bold text-gradient-primary">
                      ${reward.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Current Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaign.leaderboard.map((entry) => (
                  <div key={entry.rank} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {entry.rank}
                      </div>
                      <div>
                        <div className="font-medium">{entry.clipper}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.clips} clips • {entry.views.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{entry.points}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Full Leaderboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};