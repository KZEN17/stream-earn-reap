import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Users, 
  Building2,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';

interface RoleSelectionProps {
  onRoleSelect: (role: 'clipper' | 'streamer' | 'agency') => void;
}

export const RoleSelection = ({ onRoleSelect }: RoleSelectionProps) => {
  const [selectedRole, setSelectedRole] = useState<'clipper' | 'streamer' | 'agency' | null>(null);

  const roles = [
    {
      id: 'clipper' as const,
      title: 'Clipper',
      subtitle: 'Create viral clips & earn rewards',
      icon: Video,
      description: 'Turn streams into shareable moments and get paid for views',
      features: ['Earn per 1K views', 'Join campaigns', 'Social rewards'],
      gradient: 'from-primary to-secondary',
      badge: 'Most Popular'
    },
    {
      id: 'streamer' as const,
      title: 'Streamer',
      subtitle: 'Launch tokens & grow your community',
      icon: TrendingUp,
      description: 'Host interactive token launches and build your audience',
      features: ['Token launches', 'Community growth', 'Stream monetization'],
      gradient: 'from-secondary to-accent',
      badge: 'Creator'
    },
    {
      id: 'agency' as const,
      title: 'Agency',
      subtitle: 'Manage creators & scale operations',
      icon: Building2,
      description: 'Recruit clippers, manage streamers, and run large campaigns',
      features: ['Team management', 'Campaign oversight', 'Bulk operations'],
      gradient: 'from-accent to-primary',
      badge: 'Enterprise'
    }
  ];

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-gradient-rainbow">Welcome to CLIP!</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Who are you? Choose your path and let's get you set up.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-glow relative overflow-hidden ${
                  isSelected 
                    ? 'ring-4 ring-primary shadow-glow bg-gradient-to-br from-primary/5 to-secondary/5' 
                    : 'hover:scale-105'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                {role.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant="outline" 
                      className="bg-primary/10 text-primary border-primary/30"
                    >
                      {role.badge}
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-6 space-y-4 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{role.title}</h3>
                    <p className="text-lg text-muted-foreground">{role.subtitle}</p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {role.description}
                  </p>
                  
                  <div className="space-y-2">
                    {role.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-center gap-2 text-sm">
                        <Zap className="w-3 h-3 text-accent" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {isSelected && (
                    <div className="pt-2">
                      <div className="w-8 h-8 mx-auto rounded-full bg-primary flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue Setup
          </Button>
          
          {selectedRole && (
            <p className="text-sm text-muted-foreground mt-2">
              Setting up your {selectedRole} profile...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};