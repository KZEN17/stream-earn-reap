import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target,
  Eye,
  Instagram,
  Youtube,
  User as TikTokIcon
} from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  rewardPool: number;
  pointsPerClip: number;
  participants: number;
  maxParticipants: number;
  deadline: string;
  status: 'active' | 'upcoming' | 'ended';
  requirements: string[];
  tags: string[];
  progress: number;
  image?: string;
  totalEarned?: number;
  minPayout?: number;
  maxPayout?: number;
}

interface CampaignCardProps {
  campaign: Campaign;
  onJoin?: (campaignId: string) => void;
  onView?: (campaignId: string) => void;
}

export const CampaignCard = ({ campaign, onJoin, onView }: CampaignCardProps) => {
  // Calculate earnings and progress
  const totalEarned = (campaign.rewardPool * campaign.progress) / 100;
  const totalViews = Math.floor(Math.random() * 50000000) + 1000000; // Mock data for views
  const progressPercentage = Math.min(campaign.progress, 100);

  const handleCardClick = () => {
    onView?.(campaign.id);
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onJoin?.(campaign.id);
  };

  return (
    <Card className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden">
      <CardContent className="p-0 space-y-3" onClick={handleCardClick}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-foreground text-sm truncate max-w-[200px]">
              {campaign.title}
            </h3>
          </div>
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs font-medium">
            ${campaign.pointsPerClip.toFixed(2)} / 1000
          </Badge>
        </div>

        {/* Subtitle */}
        <div>
          <p className="text-sm text-muted-foreground">
            {campaign.title} (Earn ${campaign.pointsPerClip} per 1,000 Views)
          </p>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              ${totalEarned.toLocaleString()} of ${campaign.rewardPool.toLocaleString()} paid out
            </span>
            <span className="text-sm font-bold text-foreground">
              {progressPercentage}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <Progress 
            value={progressPercentage} 
            className="h-3" 
            animated={true}
            showGlow={true}
          />
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-4">
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Type:</span> Clipping
            </div>
            
            {/* Platform Icons */}
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-pink-600 rounded flex items-center justify-center">
                <Instagram className="w-3 h-3 text-white" />
              </div>
              <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                <TikTokIcon className="w-3 h-3 text-white" />
              </div>
              <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center">
                <Youtube className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Views:</span> {totalViews.toLocaleString()}
          </div>
        </div>

        {/* Action Buttons - Always visible for active campaigns */}
        {campaign.status === 'active' && (
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs bg-card border-border hover:bg-muted"
              onClick={handleCardClick}
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button 
              variant="hero"
              size="sm" 
              className="flex-1 text-xs"
              onClick={handleJoinClick}
            >
              <Target className="w-3 h-3 mr-1" />
              Join
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};