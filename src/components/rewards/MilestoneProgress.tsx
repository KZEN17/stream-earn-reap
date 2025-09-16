import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, DollarSign, TrendingUp, Clock } from 'lucide-react';

interface MilestoneProgressProps {
  verifiedViews: number;
  milestonesPaid: number;
  ratePerK: number;
  nextPayoutAmount: number;
  escrowRemaining: number;
  payoutStatus: 'active' | 'paused' | 'depleted';
}

export const MilestoneProgress = ({ 
  verifiedViews, 
  milestonesPaid, 
  ratePerK, 
  nextPayoutAmount,
  escrowRemaining,
  payoutStatus 
}: MilestoneProgressProps) => {
  const currentMilestone = Math.floor(verifiedViews / 1000);
  const viewsToNextMilestone = 1000 - (verifiedViews % 1000);
  const milestoneProgress = (verifiedViews % 1000) / 1000 * 100;
  const pendingMilestones = currentMilestone - milestonesPaid;
  const totalEarned = milestonesPaid * ratePerK;

  const getStatusBadge = () => {
    switch (payoutStatus) {
      case 'active':
        return <Badge variant="default" className="gap-1"><Target className="w-3 h-3" />Active</Badge>;
      case 'paused':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Paused</Badge>;
      case 'depleted':
        return <Badge variant="destructive" className="gap-1">Depleted</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verified Views</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{verifiedViews.toLocaleString()}</div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress to next milestone</span>
              <span>{1000 - viewsToNextMilestone} / 1000</span>
            </div>
            <Progress value={milestoneProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {viewsToNextMilestone} views until +${ratePerK}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Milestones</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentMilestone}</div>
          <p className="text-xs text-muted-foreground">
            {milestonesPaid} paid • {pendingMilestones} pending
          </p>
          {pendingMilestones > 0 && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                ${(pendingMilestones * ratePerK).toFixed(2)} queued
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalEarned.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Rate: ${ratePerK} / 1K views
          </p>
          <p className="text-xs text-primary mt-1">
            Next: +${nextPayoutAmount.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payout Status</CardTitle>
          {getStatusBadge()}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${escrowRemaining.toFixed(0)}</div>
          <p className="text-xs text-muted-foreground">
            escrow remaining
          </p>
          {payoutStatus === 'depleted' && (
            <p className="text-xs text-destructive mt-1">
              Campaign budget exhausted
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};