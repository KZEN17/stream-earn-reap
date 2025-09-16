import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X } from 'lucide-react';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (url: string) => void;
}

export const ProfileImageUpload = ({ currentImageUrl, onImageUpdate }: ProfileImageUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', user?.id);

      if (updateError) {
        throw updateError;
      }

      onImageUpdate(data.publicUrl);
      toast({
        title: "Profile image updated",
        description: "Your profile image has been successfully updated.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    try {
      setUploading(true);
      
      // Update profile to remove avatar URL
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', user?.id);

      if (error) throw error;

      onImageUpdate('');
      toast({
        title: "Profile image removed",
        description: "Your profile image has been removed.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove profile image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={previewUrl || currentImageUrl} />
        <AvatarFallback className="text-lg">
          {user?.email ? getUserInitials(user.email) : 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => document.getElementById('avatar-upload')?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : 'Change Photo'}
        </Button>
        
        {currentImageUrl && (
          <Button
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={removeImage}
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        )}
      </div>

      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
};