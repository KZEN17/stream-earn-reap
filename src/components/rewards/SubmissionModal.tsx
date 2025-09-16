import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  Link as LinkIcon, 
  Check, 
  AlertCircle, 
  X,
  Calendar,
  Users,
  Target,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle: string;
  campaignId: string;
}

export const SubmissionModal = ({ isOpen, onClose, campaignTitle }: SubmissionModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    socialLink: '',
    description: '',
    mediaFile: null as File | null
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, mediaFile: file }));
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

  const handleSubmit = () => {
    // Handle submission logic
    console.log('Submitting:', formData);
    onClose();
    setStep(1);
    setFormData({ socialLink: '', description: '', mediaFile: null });
    setIsVerified(false);
  };

  const canProceed = step === 1 ? formData.socialLink && isVerified : formData.mediaFile;

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
                <div>
                  <Label htmlFor="socialLink">Social Media Link *</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="socialLink"
                      placeholder="https://www.instagram.com/reel/1234567890"
                      value={formData.socialLink}
                      onChange={(e) => setFormData(prev => ({ ...prev, socialLink: e.target.value }))}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleVerifyLink}
                      disabled={!formData.socialLink || isVerifying || isVerified}
                      variant={isVerified ? "outline" : "default"}
                    >
                      {isVerifying ? "Verifying..." : isVerified ? <Check className="w-4 h-4" /> : "Verify"}
                    </Button>
                  </div>
                  {isVerified && (
                    <p className="text-sm text-green-600 mt-1 flex items-center">
                      <Check className="w-4 h-4 mr-1" />
                      Link verified successfully
                    </p>
                  )}
                </div>

                {isVerified && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Please verify account ownership to submit this post. 
                      <Button variant="link" className="text-red-800 p-0 h-auto ml-1">
                        Click here for verification.
                      </Button>
                    </AlertDescription>
                  </Alert>
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
                    {formData.mediaFile && (
                      <p className="text-sm text-green-600 mt-2 flex items-center">
                        <Check className="w-4 h-4 mr-1" />
                        {formData.mediaFile.name} uploaded successfully
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add any additional context about your submission..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!canProceed}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Submit Entry
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};