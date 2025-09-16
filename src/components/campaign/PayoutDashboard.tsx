import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { usePayoutSystem } from '@/hooks/usePayoutSystem';
import { 
  DollarSign, 
  Target, 
  Pause, 
  Play, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PayoutDashboardProps {
  campaignId: string;
}

export const PayoutDashboard = ({ campaignId }: PayoutDashboardProps) => {
  const { 
    payoutTasks, 
    payoutTransactions, 
    campaignEscrow, 
    loading, 
    error,
    pausePayouts,
    setManualApproval,
    addEscrowFunds
  } = usePayoutSystem(campaignId);

  const [escrowAmount, setEscrowAmount] = useState('');
  const [addingFunds, setAddingFunds] = useState(false);

  const handleAddFunds = async () => {
    const amount = parseFloat(escrowAmount);
    if (amount > 0) {
      setAddingFunds(true);
      await addEscrowFunds(amount);
      setEscrowAmount('');
      setAddingFunds(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      queued: { variant: 'secondary' as const, icon: Clock },
      processing: { variant: 'default' as const, icon: Target },
      completed: { variant: 'default' as const, icon: CheckCircle2 },
      failed: { variant: 'destructive' as const, icon: AlertTriangle },
      cancelled: { variant: 'outline' as const, icon: AlertTriangle }
    };
    
    const config = variants[status as keyof typeof variants] || variants.queued;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return <div className="text-center p-8">Loading payout data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-destructive">Error: {error}</div>;
  }

  if (!campaignEscrow) {
    return <div className="text-center p-8">Campaign escrow data not found</div>;
  }

  const queuedTasks = payoutTasks.filter(task => task.status === 'queued');
  const completedTasks = payoutTasks.filter(task => task.status === 'completed');
  const totalQueued = queuedTasks.reduce((sum, task) => sum + task.amount_usdc, 0);

  return (
    <div className="space-y-6">
      {/* Escrow Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escrow Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${campaignEscrow.escrow_usdc.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              of ${campaignEscrow.escrow_cap_usdc.toFixed(2)} cap
            </p>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ 
                  width: `${Math.min(100, (campaignEscrow.escrow_usdc / campaignEscrow.escrow_cap_usdc) * 100)}%` 
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payout Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${campaignEscrow.rate_usd_per_k}</div>
            <p className="text-xs text-muted-foreground">per 1K verified views</p>
            <p className="text-xs text-primary mt-1">
              Next trigger: +1K views → +${campaignEscrow.rate_usd_per_k}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue Status</CardTitle>
            {campaignEscrow.payout_paused ? (
              <Pause className="h-4 w-4 text-orange-500" />
            ) : (
              <Play className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queuedTasks.length}</div>
            <p className="text-xs text-muted-foreground">queued payouts</p>
            <p className="text-xs text-primary mt-1">
              ${totalQueued.toFixed(2)} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Alerts */}
      {(campaignEscrow.payout_paused || campaignEscrow.anomaly_detected) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                {campaignEscrow.payout_paused && (
                  <p className="text-sm text-orange-800">Payouts are currently paused</p>
                )}
                {campaignEscrow.anomaly_detected && (
                  <p className="text-sm text-orange-800">Anomaly detected - manual review required</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pause-toggle">Pause Payouts</Label>
              <p className="text-xs text-muted-foreground">
                Temporarily halt all new payout tasks
              </p>
            </div>
            <Switch
              id="pause-toggle"
              checked={campaignEscrow.payout_paused}
              onCheckedChange={pausePayouts}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="manual-toggle">Manual Approval</Label>
              <p className="text-xs text-muted-foreground">
                Require manual review for anomalous activity
              </p>
            </div>
            <Switch
              id="manual-toggle"
              checked={campaignEscrow.manual_approval_required}
              onCheckedChange={setManualApproval}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="add-funds">Add Escrow Funds</Label>
            <div className="flex gap-2">
              <Input
                id="add-funds"
                type="number"
                placeholder="Amount in USDC"
                value={escrowAmount}
                onChange={(e) => setEscrowAmount(e.target.value)}
                min="0"
                step="0.01"
              />
              <Button 
                onClick={handleAddFunds}
                disabled={!escrowAmount || addingFunds}
                className="shrink-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Payout Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payout Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Milestone</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutTasks.slice(0, 10).map((task) => (
                <TableRow key={task.id}>
                  <TableCell>#{task.milestone_number}</TableCell>
                  <TableCell>${task.amount_usdc.toFixed(2)}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {task.creator_wallet.slice(0, 8)}...{task.creator_wallet.slice(-6)}
                  </TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell className="text-xs">
                    {new Date(task.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Batch Transactions */}
      {payoutTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Batch Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TX Hash</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payoutTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      {tx.tx_hash ? (
                        <a 
                          href={`https://etherscan.io/tx/${tx.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          {tx.tx_hash.slice(0, 8)}...
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Pending</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {tx.wallet_address.slice(0, 8)}...{tx.wallet_address.slice(-6)}
                    </TableCell>
                    <TableCell>${tx.total_amount_usdc.toFixed(2)}</TableCell>
                    <TableCell>{tx.task_count} tasks</TableCell>
                    <TableCell>{getStatusBadge(tx.status)}</TableCell>
                    <TableCell className="text-xs">
                      {new Date(tx.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};