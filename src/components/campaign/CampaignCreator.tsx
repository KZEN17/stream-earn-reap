import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Upload, X, Plus, CalendarIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface CampaignCreatorProps {
  onClose: () => void;
}

export const CampaignCreator = ({ onClose }: CampaignCreatorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prize_pool: '',
    payout_per_1000_views: '1.30',
    max_payout_per_clip: '100',
    min_views_required: '1000',
    category: 'general',
    campaign_rules: '',
    gdrive_link: '',
    social_media_links: [] as string[],
    end_date: '',
    auto_approve: false,
  });

  const [newSocialLink, setNewSocialLink] = useState('');
  const [endDate, setEndDate] = useState<Date>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSocialLink = () => {
    if (newSocialLink && !formData.social_media_links.includes(newSocialLink)) {
      setFormData(prev => ({
        ...prev,
        social_media_links: [...prev.social_media_links, newSocialLink]
      }));
      setNewSocialLink('');
    }
  };

  const removeSocialLink = (link: string) => {
    setFormData(prev => ({
      ...prev,
      social_media_links: prev.social_media_links.filter(l => l !== link)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      
      let imageUrl = '';
      
      // Upload image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('campaign-images')
          .upload(fileName, imageFile);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('campaign-images')
          .getPublicUrl(fileName);
        
        imageUrl = data.publicUrl;
      }

      // Create campaign
      const { error } = await supabase
        .from('campaigns')
        .insert({
          title: formData.title,
          description: formData.description,
          campaign_rules: formData.campaign_rules,
          creator_id: user.id,
          campaign_image_url: imageUrl || null,
          prize_pool: parseFloat(formData.prize_pool) || 0,
          payout_per_1000_views: parseFloat(formData.payout_per_1000_views),
          max_payout_per_clip: parseFloat(formData.max_payout_per_clip),
          min_views_required: parseInt(formData.min_views_required),
          end_date: endDate ? endDate.toISOString() : null,
          auto_approve: formData.auto_approve,
          // Store social links and gdrive in admin_notes for now since these aren't database fields
          admin_notes: JSON.stringify({
            gdrive_link: formData.gdrive_link,
            social_media_links: formData.social_media_links
          })
        });

      if (error) throw error;

      toast({
        title: "Campaign Created!",
        description: "Your campaign has been submitted for review.",
      });

      onClose();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="campaign_rules">Campaign Conditions</Label>
                <Textarea
                  id="campaign_rules"
                  value={formData.campaign_rules}
                  onChange={(e) => setFormData(prev => ({ ...prev, campaign_rules: e.target.value }))}
                  placeholder="List all requirements and conditions for this campaign..."
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Campaign Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center space-y-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload campaign image</span>
                      <span className="text-xs text-muted-foreground">Recommended: 1200x630px (Max: 5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prize_pool">Prize Pool ($)</Label>
                  <Input
                    id="prize_pool"
                    type="number"
                    step="0.01"
                    value={formData.prize_pool}
                    onChange={(e) => setFormData(prev => ({ ...prev, prize_pool: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="payout_per_1000_views">Payout per 1k Views ($)</Label>
                  <Input
                    id="payout_per_1000_views"
                    type="number"
                    step="0.01"
                    value={formData.payout_per_1000_views}
                    onChange={(e) => setFormData(prev => ({ ...prev, payout_per_1000_views: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Campaign End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="gdrive_link">Google Drive Link</Label>
              <Input
                id="gdrive_link"
                type="url"
                placeholder="https://drive.google.com/drive/folders/..."
                value={formData.gdrive_link}
                onChange={(e) => setFormData(prev => ({ ...prev, gdrive_link: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional: Link to Google Drive folder with campaign assets
              </p>
            </div>

            <div>
              <Label>Social Media Links</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add social media or website link"
                  value={newSocialLink}
                  onChange={(e) => setNewSocialLink(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSocialLink())}
                />
                <Button type="button" onClick={addSocialLink} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.social_media_links.map(link => (
                  <Badge key={link} variant="secondary" className="cursor-pointer" onClick={() => removeSocialLink(link)}>
                    {link} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Add relevant social media profiles, websites, or other links
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Auto-approve Submissions</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve all submissions without manual review. Recommended for trusted creators only.
                  </p>
                </div>
                <Switch
                  checked={formData.auto_approve}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, auto_approve: checked }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};