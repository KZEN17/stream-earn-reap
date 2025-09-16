import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  UserPlus,
  Briefcase,
  ExternalLink,
  Plus,
  Eye,
  Star
} from 'lucide-react';

export const AgencyDashboard = () => {
  // Mock data - replace with real data from hooks
  const stats = {
    managedStreamers: 8,
    totalCampaigns: 15,
    totalEarnings: 24750.00,
    activeClippers: 45
  };

  const managedAccounts = [
    {
      id: 1,
      name: "Moon Master",
      type: "streamer",
      followers: 12500,
      launches: 3,
      earnings: 8450,
      status: "active",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Crypto Queen",
      type: "streamer", 
      followers: 8900,
      launches: 2,
      earnings: 5600,
      status: "active",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "ClipMaster99",
      type: "clipper",
      followers: 2300,
      clips: 45,
      earnings: 1240,
      status: "active",
      avatar: "/placeholder.svg"
    }
  ];

  const campaigns = [
    {
      id: 1,
      title: "Holiday Token Launch Series",
      streamers: 3,
      clippers: 12,
      totalViews: 125000,
      totalEarnings: 6200,
      status: "active",
      endDate: "2024-12-31"
    },
    {
      id: 2,
      title: "Gaming Highlights Campaign",
      streamers: 5,
      clippers: 18,
      totalViews: 89000,
      totalEarnings: 4500,
      status: "completed",
      endDate: "2024-12-15"
    }
  ];

  const recruitmentPipeline = [
    {
      name: "Potential Streamers",
      count: 12,
      color: "text-blue-500"
    },
    {
      name: "In Review",
      count: 5,
      color: "text-yellow-500"
    },
    {
      name: "Approved",
      count: 3,
      color: "text-green-500"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'completed': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">{stats.managedStreamers}</p>
                <p className="text-xs text-muted-foreground">Managed Streamers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-500">{stats.totalCampaigns}</p>
                <p className="text-xs text-muted-foreground">Total Campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-500">${(stats.totalEarnings / 1000).toFixed(1)}K</p>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <div>
                <p className="text-2xl font-bold text-accent">{stats.activeClippers}</p>
                <p className="text-xs text-muted-foreground">Active Clippers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accounts">Managed Accounts</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Managed Accounts</h3>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <UserPlus className="w-4 h-4 mr-2" />
              Recruit Creator
            </Button>
          </div>
          
          <div className="grid gap-4">
            {managedAccounts.map((account) => (
              <Card key={account.id} className="hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={account.avatar} />
                      <AvatarFallback>{account.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{account.name}</h4>
                        <Badge variant="outline" className="capitalize">
                          {account.type}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(account.status)}>
                          {account.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Followers:</span>
                          <p className="font-medium">{(account.followers / 1000).toFixed(1)}K</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {account.type === 'streamer' ? 'Launches:' : 'Clips:'}
                          </span>
                          <p className="font-medium">
                            {account.type === 'streamer' ? account.launches : (account as any).clips}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Earnings:</span>
                          <p className="font-medium text-green-600">${account.earnings.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          View Profile
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Campaign Management</h3>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
          
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{campaign.title}</h4>
                        <Badge variant="outline" className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Streamers:</span>
                          <p className="font-medium">{campaign.streamers}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Clippers:</span>
                          <p className="font-medium">{campaign.clippers}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Views:</span>
                          <p className="font-medium">{campaign.totalViews.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Revenue:</span>
                          <p className="font-medium text-green-600">${campaign.totalEarnings.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        End Date: {new Date(campaign.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recruitment" className="space-y-4">
          <h3 className="text-lg font-semibold">Recruitment Pipeline</h3>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {recruitmentPipeline.map((stage, index) => (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold mb-2">{stage.name}</h4>
                  <p className={`text-3xl font-bold ${stage.color}`}>{stage.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                Top Performers This Month
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">1</div>
                  <span>Moon Master</span>
                </div>
                <span className="text-green-600 font-semibold">$2,840 earned</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold">2</div>
                  <span>Crypto Queen</span>
                </div>
                <span className="text-green-600 font-semibold">$1,920 earned</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">3</div>
                  <span>ClipMaster99</span>
                </div>
                <span className="text-green-600 font-semibold">$1,240 earned</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};