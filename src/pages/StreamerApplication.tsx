import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useStreamerApplications } from '@/hooks/useStreamerApplications';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarDays, Upload, CalendarIcon, X } from 'lucide-react';

export default function StreamerApplication() {
  const navigate = useNavigate();
  const { submitApplication } = useStreamerApplications();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    streamer_name: '',
    twitch_username: '',
    youtube_channel: '',
    tiktok_username: '',
    instagram_username: '',
    discord_server: '',
    launch_title: '',
    launch_description: '',
    launch_game: '',
    scheduled_launch_date: '',
  });

  const [launchDate, setLaunchDate] = useState<Date>();
  const [tokenLogo, setTokenLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTokenLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let logoUrl = '';
      
      // Upload token logo if selected
      if (tokenLogo) {
        const fileExt = tokenLogo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('user-avatars')
          .upload(`token-logos/${fileName}`, tokenLogo);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('user-avatars')
          .getPublicUrl(`token-logos/${fileName}`);
        
        logoUrl = data.publicUrl;
      }

      await submitApplication({
        ...formData,
        launch_thumbnail_url: logoUrl || undefined,
        scheduled_launch_date: launchDate ? launchDate.toISOString() : undefined,
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
              <div>
                <Label htmlFor="streamer_name">Streamer Name</Label>
                <Input
                  id="streamer_name"
                  placeholder="Enter your streamer/brand name"
                  value={formData.streamer_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, streamer_name: e.target.value }))}
                  required
                />
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tiktok_username">TikTok Username</Label>
                  <Input
                    id="tiktok_username"
                    placeholder="Enter your TikTok username"
                    value={formData.tiktok_username}
                    onChange={(e) => setFormData(prev => ({ ...prev, tiktok_username: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="instagram_username">Instagram Username</Label>
                  <Input
                    id="instagram_username"
                    placeholder="Enter your Instagram username"
                    value={formData.instagram_username}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram_username: e.target.value }))}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="launch_title">Launch Title (Token / Streamer Name)</Label>
                      <Input
                        id="launch_title"
                        placeholder={`${formData.streamer_name ? `${formData.streamer_name} Token` : 'Enter your token launch title'}`}
                        value={formData.launch_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, launch_title: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label>Token Logo</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4">
                        {logoPreview ? (
                          <div className="relative">
                            <img src={logoPreview} alt="Token Logo" className="w-full h-20 object-contain rounded" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1"
                              onClick={() => {
                                setTokenLogo(null);
                                setLogoPreview('');
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center space-y-1">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Upload token logo</span>
                            <span className="text-xs text-muted-foreground">Recommended: 200x200px</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
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
                      <Label>Scheduled Launch Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !launchDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {launchDate ? format(launchDate, "PPP") : <span>Pick launch date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={launchDate}
                            onSelect={setLaunchDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
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