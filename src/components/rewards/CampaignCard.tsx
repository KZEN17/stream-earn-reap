import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  TrendingUp, 
  Award, 
  Users,
  Target,
  Eye
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
}

interface CampaignCardProps {
  campaign: Campaign;
  onJoin?: (campaignId: string) => void;
  onView?: (campaignId: string) => void;
}

export const CampaignCard = ({ campaign, onJoin, onView }: CampaignCardProps) => {
  const getStatusVariant = () => {
    switch (campaign.status) {
      case 'active': return 'default';
      case 'upcoming': return 'secondary';
      case 'ended': return 'outline';
      default: return 'default';
    }
  };

  const getStatusColor = () => {
    switch (campaign.status) {
      case 'active': return 'text-green-500';
      case 'upcoming': return 'text-yellow-500';
      case 'ended': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="hover-lift shadow-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant={getStatusVariant()} className="capitalize">
            {campaign.status}
          </Badge>
          <div className="text-right">
            <div className="text-lg font-bold text-gradient-primary">
              ${campaign.rewardPool.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Pool</div>
          </div>
        </div>
        <CardTitle className="text-xl line-clamp-2">{campaign.title}</CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-2">{campaign.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress and Participation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Participation</span>
            <span className="font-medium">
              {campaign.participants}/{campaign.maxParticipants}
            </span>
          </div>
          <Progress value={(campaign.participants / campaign.maxParticipants) * 100} className="h-2" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-primary" />
            <span>{campaign.pointsPerClip} pts/clip</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className={`w-4 h-4 ${getStatusColor()}`} />
            <span>{campaign.deadline}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {campaign.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onView?.(campaign.id)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Button>
          {campaign.status === 'active' && (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onJoin?.(campaign.id)}
            >
              <Users className="w-4 h-4 mr-1" />
              Join Campaign
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};