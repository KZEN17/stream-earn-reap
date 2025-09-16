import React from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-slide-up">
      <Alert className="bg-destructive/10 border-destructive/20 text-destructive">
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          You're offline. Some features may not be available.
        </AlertDescription>
      </Alert>
    </div>
  );
};