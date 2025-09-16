import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target,
  Eye,
  Share2,
  Twitter,
  Music,
  Heart,
  Play,
  Copy,
  ExternalLink
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useLoginModal } from '@/contexts/LoginModalContext';
import { useAuth } from '@/contexts/AuthContext';

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
  const { requireAuth } = useLoginModal();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Calculate earnings and progress
  const totalEarned = (campaign.rewardPool * campaign.progress) / 100;
  const totalViews = Math.floor(Math.random() * 50000000) + 1000000; // Mock data for views
  const progressPercentage = Math.min(campaign.progress, 100);

  const handleCardClick = () => {
    onView?.(campaign.id);
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!requireAuth(() => onJoin?.(campaign.id))) return;
    onJoin?.(campaign.id);
  };

  const handleShare = async (e: React.MouseEvent, platform: string) => {
    e.stopPropagation();
    const url = window.location.origin + `/rewards?campaign=${campaign.id}`;
    const text = `Check out this campaign: ${campaign.title} - Earn $${campaign.pointsPerClip} per 1,000 views!`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied to clipboard!" });
        break;
      default:
        break;
    }
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
            <h3 className="font-semibold text-foreground text-sm truncate max-w-[150px]">
              {campaign.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-muted"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Share2 className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => handleShare(e, 'twitter')}>
                  <Twitter className="w-3 h-3 mr-2" />
                  Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleShare(e, 'copy')}>
                  <Copy className="w-3 h-3 mr-2" />
                  Copy Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs font-medium">
              ${campaign.pointsPerClip.toFixed(2)} / 1000
            </Badge>
          </div>
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
              <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                <Heart className="w-3 h-3 text-white" />
              </div>
              <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                <Music className="w-3 h-3 text-white" />
              </div>
              <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center">
                <Play className="w-3 h-3 text-white" />
              </div>
              <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                <Twitter className="w-3 h-3 text-white" />
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