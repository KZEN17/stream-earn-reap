import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Shield, 
  Users, 
  Flag, 
  Eye, 
  EyeOff, 
  Ban, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const AdminPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - replace with real data from Supabase
  const campaigns = [
    {
      id: "1",
      title: "$ROCKET Launch Campaign",
      creator: "rocketmaster",
      status: "active",
      flagged: false,
      submissions: 45,
      reported: 2
    },
    {
      id: "2", 
      title: "Suspicious Campaign",
      creator: "badactor",
      status: "flagged",
      flagged: true,
      submissions: 100,
      reported: 15
    }
  ];

  const users = [
    {
      id: "1",
      username: "clipmaster",
      email: "clip@example.com",
      status: "active",
      reputation: 98,
      violations: 0,
      totalEarnings: 2500
    },
    {
      id: "2",
      username: "spammer",
      email: "spam@example.com", 
      status: "suspended",
      reputation: 12,
      violations: 5,
      totalEarnings: 0
    }
  ];

  const reports = [
    {
      id: "1",
      type: "campaign",
      targetId: "2",
      reason: "Misleading content",
      reporter: "user123",
      status: "pending",
      createdAt: "2024-12-20T10:00:00Z"
    },
    {
      id: "2",
      type: "user",
      targetId: "2",
      reason: "Spam behavior",
      reporter: "user456",
      status: "reviewing",
      createdAt: "2024-12-20T09:00:00Z"
    }
  ];

  const handleSuspendUser = async (userId: string, username: string) => {
    try {
      // Implement actual suspension logic with Supabase
      toast.success(`User ${username} has been suspended`);
    } catch (error) {
      toast.error("Failed to suspend user");
    }
  };

  const handleHideCampaign = async (campaignId: string, title: string) => {
    try {
      // Implement actual campaign hiding logic
      toast.success(`Campaign "${title}" has been hidden`);
    } catch (error) {
      toast.error("Failed to hide campaign");
    }
  };

  const handleResolveReport = async (reportId: string, action: "approved" | "rejected") => {
    try {
      // Implement report resolution logic
      toast.success(`Report ${action} successfully`);
    } catch (error) {
      toast.error("Failed to resolve report");
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { variant: "default" as const, label: "Active" },
      suspended: { variant: "destructive" as const, label: "Suspended" },
      flagged: { variant: "secondary" as const, label: "Flagged" },
      pending: { variant: "outline" as const, label: "Pending" },
      reviewing: { variant: "secondary" as const, label: "Reviewing" }
    };

    const statusConfig = config[status as keyof typeof config] || config.active;
    return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">
          Content moderation and platform management
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-500" />
              <span className="text-2xl font-bold">1,247</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Flag className="w-4 h-4 text-orange-500" />
              <span className="text-2xl font-bold">3</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-2xl font-bold">7</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Suspended Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Ban className="w-4 h-4 text-red-600" />
              <span className="text-2xl font-bold">12</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Campaign Management</CardTitle>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search campaigns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {campaign.flagged && <Flag className="w-4 h-4 text-red-500" />}
                          <span className="font-medium">{campaign.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>@{campaign.creator}</TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell>{campaign.submissions}</TableCell>
                      <TableCell>
                        {campaign.reported > 0 && (
                          <span className="text-red-600 font-medium">{campaign.reported}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {/* Navigate to campaign details */}}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleHideCampaign(campaign.id, campaign.title)}
                          >
                            <EyeOff className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reputation</TableHead>
                    <TableHead>Violations</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">@{user.username}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span>{user.reputation}%</span>
                          {user.reputation >= 90 && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {user.reputation < 50 && <XCircle className="w-4 h-4 text-red-500" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.violations > 0 ? (
                          <span className="text-red-600 font-medium">{user.violations}</span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </TableCell>
                      <TableCell>${user.totalEarnings}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {/* Navigate to user profile */}}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          {user.status === "active" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleSuspendUser(user.id, user.username)}
                            >
                              <Ban className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="capitalize">{report.type}</TableCell>
                      <TableCell>ID: {report.targetId}</TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>@{report.reporter}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResolveReport(report.id, "approved")}
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleResolveReport(report.id, "rejected")}
                          >
                            <XCircle className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Active Users</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New Signups (7d)</span>
                    <span className="font-medium text-green-600">+89</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suspension Rate</span>
                    <span className="font-medium">0.96%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Report Resolution Time</span>
                    <span className="font-medium">2.3 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Auto-flagged Content</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Manual Reviews</span>
                    <span className="font-medium">34</span>
                  </div>
                  <div className="flex justify-between">
                    <span>False Positive Rate</span>
                    <span className="font-medium">3.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Appeals Processed</span>
                    <span className="font-medium">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;