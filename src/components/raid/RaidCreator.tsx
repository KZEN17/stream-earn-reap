import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRaidEvents } from '@/hooks/useRaidEvents';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Target, 
  Crown, 
  Heart, 
  DollarSign, 
  Users, 
  Calendar,
  X,
  Plus
} from 'lucide-react';

interface RaidCreatorProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const MISSION_TYPES = [
  {
    value: 'mission',
    label: 'Mission',
    description: 'Grow a launch/event',
    icon: Target,
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  {
    value: 'takeover',
    label: 'Take Over',
    description: 'Push into trending/top lists',
    icon: Crown,
    color: 'text-accent',
    bgColor: 'bg-accent/10'
  },
  {
    value: 'support',
    label: 'Support',
    description: 'Boost ally streamer/community',
    icon: Heart,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10'
  }
];

export const RaidCreator: React.FC<RaidCreatorProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetUrl: '',
    missionType: 'mission',
    description: '',
    goalAmount: '',
    goalDescription: '',
    scheduledTime: '',
    maxParticipants: 100
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createRaid } = useRaidEvents();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a raid.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createRaid({
        title: formData.title,
        description: formData.description,
        twitch_stream_url: formData.targetUrl,
        target_url: formData.targetUrl,
        mission_type: formData.missionType as 'mission' | 'takeover' | 'support',
        goal_amount: formData.goalAmount ? parseFloat(formData.goalAmount) : 0,
        goal_description: formData.goalDescription,
        scheduled_time: formData.scheduledTime || new Date().toISOString(),
        status: 'scheduled',
        max_participants: formData.maxParticipants,
        current_participants: 0,
        total_raised: 0,
        leader_id: user.id
      });
      
      toast({
        title: "RAID Created!",
        description: "Your raid has been created successfully.",
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: "Failed to Create RAID",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMission = MISSION_TYPES.find(m => m.value === formData.missionType);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gradient-primary">
              Create New RAID
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target URL */}
            <div className="space-y-2">
              <Label htmlFor="targetUrl">Target Stream URL</Label>
              <Input
                id="targetUrl"
                type="url"
                placeholder="https://twitch.tv/username or https://youtube.com/watch?v=..."
                value={formData.targetUrl}
                onChange={(e) => setFormData({...formData, targetUrl: e.target.value})}
                required
              />
            </div>

            {/* Mission Type */}
            <div className="space-y-4">
              <Label>Mission Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {MISSION_TYPES.map((mission) => {
                  const Icon = mission.icon;
                  const isSelected = formData.missionType === mission.value;
                  
                  return (
                    <div
                      key={mission.value}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover-lift ${
                        isSelected 
                          ? `border-primary bg-primary/5 ${mission.bgColor}` 
                          : 'border-muted hover:border-primary/50'
                      }`}
                      onClick={() => setFormData({...formData, missionType: mission.value})}
                    >
                      <div className="text-center space-y-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${mission.bgColor}`}>
                          <Icon className={`w-4 h-4 ${mission.color}`} />
                        </div>
                        <div className="font-semibold">{mission.label}</div>
                        <div className="text-xs text-muted-foreground">{mission.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RAID Title */}
            <div className="space-y-2">
              <Label htmlFor="title">RAID Title</Label>
              <Input
                id="title"
                placeholder="e.g., MEGA PUMP RAID, Holiday Support Mission"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            {/* Description (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the raid objectives..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>

            {/* Goal Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goalAmount">Goal Amount ($)</Label>
                <Input
                  id="goalAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="1000"
                  value={formData.goalAmount}
                  onChange={(e) => setFormData({...formData, goalAmount: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value) || 100})}
                />
              </div>
            </div>

            {/* Goal Description */}
            {formData.goalAmount && (
              <div className="space-y-2">
                <Label htmlFor="goalDescription">Goal Description</Label>
                <Input
                  id="goalDescription"
                  placeholder="e.g., Token launch support, Subscriber milestone"
                  value={formData.goalDescription}
                  onChange={(e) => setFormData({...formData, goalDescription: e.target.value})}
                />
              </div>
            )}

            {/* Scheduled Time */}
            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Start Time (Optional)</Label>
              <Input
                id="scheduledTime"
                type="datetime-local"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to start immediately
              </p>
            </div>

            {/* Preview */}
            {selectedMission && (
              <div className="p-4 rounded-lg bg-muted/30 border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <selectedMission.icon className={`w-4 h-4 ${selectedMission.color}`} />
                  Preview
                </h4>
                <div className="text-sm space-y-1">
                  <div><strong>Mission:</strong> {selectedMission.label}</div>
                  <div><strong>Target:</strong> {formData.targetUrl || 'Not set'}</div>
                  <div><strong>Title:</strong> {formData.title || 'Untitled RAID'}</div>
                  {formData.goalAmount && (
                    <div><strong>Goal:</strong> ${formData.goalAmount}</div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.targetUrl}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create RAID
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};