import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CampaignAnalytics as CampaignAnalyticsComponent } from '@/components/campaign/CampaignAnalytics';

export default function CampaignAnalytics() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();

  if (!campaignId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
          <p className="text-muted-foreground">The campaign you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CampaignAnalyticsComponent 
        campaignId={campaignId} 
        onBack={() => navigate('/profile')} 
      />
    </div>
  );
}