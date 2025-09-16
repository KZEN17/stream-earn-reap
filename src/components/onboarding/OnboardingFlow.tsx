import { useState } from 'react';
import { RoleSelection } from './RoleSelection';
import { ClipperOnboarding } from './ClipperOnboarding';
import { StreamerOnboarding } from './StreamerOnboarding';
import { AgencyOnboarding } from './AgencyOnboarding';
import { useAuth } from '@/contexts/AuthContext';

export const OnboardingFlow = () => {
  const [selectedRole, setSelectedRole] = useState<'clipper' | 'streamer' | 'agency' | null>(null);
  const { setNeedsOnboarding } = useAuth();

  const handleRoleSelect = (role: 'clipper' | 'streamer' | 'agency') => {
    setSelectedRole(role);
  };

  const handleOnboardingComplete = () => {
    setNeedsOnboarding(false);
  };

  if (!selectedRole) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  switch (selectedRole) {
    case 'clipper':
      return <ClipperOnboarding onComplete={handleOnboardingComplete} />;
    case 'streamer':
      return <StreamerOnboarding onComplete={handleOnboardingComplete} />;
    case 'agency':
      return <AgencyOnboarding onComplete={handleOnboardingComplete} />;
    default:
      return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }
};