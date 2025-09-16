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
  Eye,
  DollarSign,
  Calendar
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
    <Card className="hover-lift shadow-card overflow-hidden group">
      {/* Campaign Image Header */}
      {campaign.image && (
        <div className="h-32 bg-gradient-to-r from-pink-500 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-2 left-4 text-white">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {campaign.status === 'active' ? 'Live Campaign' : campaign.status}
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge variant={getStatusVariant()} className="capitalize">
            {campaign.status}
          </Badge>
          <div className="text-right">
            <div className="text-xl font-bold text-gradient-primary">
              ${campaign.rewardPool.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Pool</div>
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {campaign.title}
        </CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-2">{campaign.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Payout Range */}
        {campaign.minPayout && campaign.maxPayout && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Payout Range</span>
              <div className="text-sm font-bold">
                ${campaign.minPayout} - ${campaign.maxPayout}
              </div>
            </div>
          </div>
        )}

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

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2 bg-muted/30 rounded-lg p-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <div>
              <div className="font-medium">${campaign.pointsPerClip}</div>
              <div className="text-xs text-muted-foreground">per submission</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-muted/30 rounded-lg p-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <div>
              <div className="font-medium">{campaign.deadline}</div>
              <div className="text-xs text-muted-foreground">deadline</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {campaign.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
              {tag}
            </Badge>
          ))}
          {campaign.tags.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              +{campaign.tags.length - 3}
            </Badge>
          )}
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
              className="flex-1 bg-gradient-primary hover:opacity-90"
              onClick={() => onJoin?.(campaign.id)}
            >
              <Target className="w-4 h-4 mr-1" />
              Join Campaign
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};