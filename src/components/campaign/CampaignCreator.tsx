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
import { Upload, X, Plus } from 'lucide-react';

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
    target_countries: [] as string[],
    tags: [] as string[],
    end_date: '',
  });

  const [newTag, setNewTag] = useState('');
  const [newCountry, setNewCountry] = useState('');
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

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addCountry = () => {
    if (newCountry && !formData.target_countries.includes(newCountry)) {
      setFormData(prev => ({
        ...prev,
        target_countries: [...prev.target_countries, newCountry]
      }));
      setNewCountry('');
    }
  };

  const removeCountry = (country: string) => {
    setFormData(prev => ({
      ...prev,
      target_countries: prev.target_countries.filter(c => c !== country)
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
          ...formData,
          creator_id: user.id,
          campaign_image_url: imageUrl || null,
          prize_pool: parseFloat(formData.prize_pool) || 0,
          payout_per_1000_views: parseFloat(formData.payout_per_1000_views),
          max_payout_per_clip: parseFloat(formData.max_payout_per_clip),
          min_views_required: parseInt(formData.min_views_required),
          end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
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
                <Label htmlFor="campaign_rules">Campaign Rules</Label>
                <Textarea
                  id="campaign_rules"
                  value={formData.campaign_rules}
                  onChange={(e) => setFormData(prev => ({ ...prev, campaign_rules: e.target.value }))}
                  placeholder="List all requirements and rules for this campaign..."
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
                <Label htmlFor="end_date">Campaign End Date</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Target Countries</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a country"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCountry())}
                />
                <Button type="button" onClick={addCountry} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.target_countries.map(country => (
                  <Badge key={country} variant="outline" className="cursor-pointer" onClick={() => removeCountry(country)}>
                    {country} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
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