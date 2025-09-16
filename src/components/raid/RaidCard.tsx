import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Crown, 
  Heart, 
  Users, 
  DollarSign, 
  ExternalLink, 
  Clock,
  Play,
  Share2,
  Copy,
  Twitter,
  MessageCircle
} from 'lucide-react';
import { RaidEvent } from '@/hooks/useRaidEvents';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RaidCardProps {
  raid: RaidEvent;
  onJoin?: (raidId: string) => void;
  showProgress?: boolean;
}

const MISSION_CONFIG = {
  mission: {
    label: 'Mission',
    icon: Target,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    badgeVariant: 'default' as const
  },
  takeover: {
    label: 'Take Over',
    icon: Crown,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    badgeVariant: 'secondary' as const
  },
  support: {
    label: 'Support',
    icon: Heart,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    badgeVariant: 'outline' as const
  }
};

export const RaidCard: React.FC<RaidCardProps> = ({ 
  raid, 
  onJoin,
  showProgress = true 
}) => {
  const missionConfig = MISSION_CONFIG[raid.mission_type || 'mission'];
  const Icon = missionConfig.icon;
  const { toast } = useToast();
  
  const isLive = raid.status === 'live';
  const isScheduled = raid.status === 'scheduled';
  const progressPercentage = raid.goal_amount && raid.goal_amount > 0 
    ? Math.min((raid.total_raised || 0) / raid.goal_amount * 100, 100)
    : 0;

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getTimeUntilStart = (startTime?: string) => {
    if (!startTime) return '';
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const diff = start - now;
    
    if (diff <= 0) return "Live Now";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleJoinRaid = () => {
    if (raid.target_url) {
      window.open(raid.target_url, '_blank', 'noopener,noreferrer');
    }
    onJoin?.(raid.id);
  };

  const handleShare = (platform: string) => {
    const shareUrl = window.location.href;
    const shareText = `Join the ${raid.title} RAID! 🚀`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'discord':
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast({
          title: "Copied to clipboard!",
          description: "Share link copied. Paste it in Discord!",
        });
        break;
      case 'copy':
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast({
          title: "Link copied!",
          description: "RAID link copied to clipboard",
        });
        break;
    }
  };

  return (
    <Card className={`hover-lift shadow-card transition-all ${isLive ? 'border-primary/50 shadow-glow' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center border-2 border-primary/20">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="space-y-3 flex-1">
              {/* Status and Mission Type */}
              <div className="flex items-center gap-2 flex-wrap">
                {isLive && (
                  <Badge variant="destructive" className="animate-pulse">
                    LIVE
                  </Badge>
                )}
                {isScheduled && (
                  <Badge variant="secondary">
                    <Clock className="w-3 h-3 mr-1" />
                    {getTimeUntilStart(raid.scheduled_time)}
                  </Badge>
                )}
                <Badge variant={missionConfig.badgeVariant} className={missionConfig.bgColor}>
                  <Icon className={`w-3 h-3 mr-1 ${missionConfig.color}`} />
                  {missionConfig.label}
                </Badge>
              </div>

              {/* Title and Description */}
              <div>
                <CardTitle className="text-lg mb-1">{raid.title}</CardTitle>
                {raid.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {raid.description}
                  </p>
                )}
              </div>

              {/* Target */}
              {raid.target_url && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate">
                    Target: {new URL(raid.target_url).hostname}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {showProgress && raid.goal_description && (
          <div className="space-y-2">
            <Progress 
              value={49} 
              className="h-3" 
              animated={true}
              showGlow={raid.status === 'live'}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>49% complete</span>
              {raid.goal_description && <span>{raid.goal_description}</span>}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {raid.scheduled_time && !isLive && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(raid.scheduled_time)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Share2 className="w-3 h-3" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleShare('twitter')}>
                  <Twitter className="w-4 h-4 mr-2" />
                  Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('discord')}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Share on Discord
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('copy')}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="hero" 
              size="sm"
              onClick={handleJoinRaid}
              className="gap-1"
            >
              <Play className="w-3 h-3" />
              Join Raid
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};