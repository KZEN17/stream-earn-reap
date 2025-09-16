import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Upload, 
  CheckCircle, 
  Loader2, 
  Link, 
  Play,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useClips } from "@/hooks/useClips";
import { useToast } from "@/hooks/use-toast";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle: string;
  campaignId: string;
}

export const SubmissionModal = ({ isOpen, onClose, campaignTitle, campaignId }: SubmissionModalProps) => {
  const [step, setStep] = useState(1);
  const [socialLink, setSocialLink] = useState('');
  const [description, setDescription] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  
  const { submitClip } = useClips();
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
    }
  };

  const handleVerifyLink = async () => {
    setIsVerifying(true);
    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 2000);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a title for your clip",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Determine which platform the link is from
      let clipData: any = {
        campaign_id: campaignId,
        title: title.trim(),
        description: description.trim() || undefined,
        video_file: mediaFile || undefined
      };

      if (socialLink.includes('instagram.com')) {
        clipData.instagram_url = socialLink;
      } else if (socialLink.includes('tiktok.com')) {
        clipData.tiktok_url = socialLink;
      } else if (socialLink.includes('youtube.com') || socialLink.includes('youtu.be')) {
        clipData.youtube_url = socialLink;
      }

      await submitClip(clipData);
      
      toast({
        title: "Success!",
        description: "Your clip has been submitted successfully",
      });
      
      onClose();
      
      // Reset form
      setStep(1);
      setSocialLink('');
      setDescription('');
      setMediaFile(null);
      setIsVerified(false);
      setTitle('');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit clip",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = step === 1 ? title.trim() : step === 2 ? (mediaFile || socialLink) : false;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Submit Content</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Campaign Info */}
          <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg">{campaignTitle}</h3>
              <p className="text-sm opacity-90">Follow the requirements below to earn rewards</p>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Only posts submitted after joining count towards payout. Register as soon as you create content to be eligible for all your posts.
            </AlertDescription>
          </Alert>

          {/* Step Progress */}
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
            }`}>
              1
            </div>
            <div className="flex-1 h-2 bg-muted rounded">
              <div className={`h-full bg-primary rounded transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Submit Your Social Media Post</h3>
                <p className="text-muted-foreground mb-4">
                  Share the link to your post and upload the original image or video. 
                  You'll receive rewards based on your content's performance.
                </p>
              </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Clip Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter a catchy title for your clip"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialLink">Social Media Link (Optional)</Label>
                <div className="relative">
                  <Link className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="socialLink"
                    placeholder="https://instagram.com/p/... or https://tiktok.com/@..."
                    value={socialLink}
                    onChange={(e) => setSocialLink(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Paste your Instagram, TikTok, or YouTube link here (optional if uploading file)
                </p>
              </div>

              {socialLink && !isVerified && (
                <Button
                  onClick={handleVerifyLink}
                  disabled={isVerifying}
                  className="w-full"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying Link...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify Link
                    </>
                  )}
                </Button>
              )}

              {isVerified && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700 dark:text-green-400">
                    Link verified successfully!
                  </span>
                </div>
              )}
            </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => setStep(2)}
                  disabled={!canProceed}
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Upload Media</h3>
                <p className="text-muted-foreground mb-4">
                  Upload the original media file you published (no screenshots). 
                  For videos, upload the video file. For multi-file posts, upload the first file.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="media">Media File *</Label>
                  <div className="mt-2">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop your file here, or click to browse
                      </p>
                      <Button variant="outline" asChild>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Media
                        </label>
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                      />
                    </div>
                    {mediaFile && (
                      <p className="text-sm text-green-600 mt-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {mediaFile.name} uploaded successfully
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Add any additional context about your submission..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-2"
                      />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                  <Button
                    onClick={step === 2 ? handleSubmit : () => setStep(2)}
                    disabled={!canProceed || isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : step === 2 ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Submit Entry
                      </>
                    ) : (
                      <>
                        Next Step
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};