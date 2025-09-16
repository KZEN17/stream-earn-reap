import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useStreamerApplications } from '@/hooks/useStreamerApplications';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Upload } from 'lucide-react';

export default function StreamerApplication() {
  const navigate = useNavigate();
  const { submitApplication } = useStreamerApplications();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    twitch_username: '',
    youtube_channel: '',
    discord_server: '',
    launch_title: '',
    launch_description: '',
    launch_game: '',
    scheduled_launch_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      await submitApplication({
        ...formData,
        scheduled_launch_date: formData.scheduled_launch_date 
          ? new Date(formData.scheduled_launch_date).toISOString() 
          : undefined,
      });

      toast({
        title: "Application Submitted!",
        description: "Your streamer application has been submitted for review. We'll notify you once it's approved.",
      });

      navigate('/calendar');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-6 w-6" />
              Apply to Stream & Launch
            </CardTitle>
            <p className="text-muted-foreground">
              Join our platform as a verified streamer and schedule your token launch event
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="twitch_username">Twitch Username</Label>
                  <Input
                    id="twitch_username"
                    placeholder="Enter your Twitch username"
                    value={formData.twitch_username}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitch_username: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="youtube_channel">YouTube Channel</Label>
                  <Input
                    id="youtube_channel"
                    placeholder="Enter your YouTube channel URL"
                    value={formData.youtube_channel}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtube_channel: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="discord_server">Discord Server (Optional)</Label>
                <Input
                  id="discord_server"
                  placeholder="Enter your Discord server invite"
                  value={formData.discord_server}
                  onChange={(e) => setFormData(prev => ({ ...prev, discord_server: e.target.value }))}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Token Launch Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="launch_title">Launch Title</Label>
                    <Input
                      id="launch_title"
                      placeholder="Enter your token launch title"
                      value={formData.launch_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, launch_title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="launch_description">Launch Description</Label>
                    <Textarea
                      id="launch_description"
                      placeholder="Describe your token launch event..."
                      value={formData.launch_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, launch_description: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="launch_game">Game/Category</Label>
                      <Input
                        id="launch_game"
                        placeholder="e.g., Crypto Discussion, Gaming"
                        value={formData.launch_game}
                        onChange={(e) => setFormData(prev => ({ ...prev, launch_game: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="scheduled_launch_date">Scheduled Launch Date</Label>
                      <Input
                        id="scheduled_launch_date"
                        type="datetime-local"
                        value={formData.scheduled_launch_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduled_launch_date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Next Steps</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your application will be reviewed by our team</li>
                  <li>• Once approved, your launch will appear in the calendar</li>
                  <li>• Community members can set reminders and follow your launch</li>
                  <li>• You'll gain access to streaming features and analytics</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/calendar')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}