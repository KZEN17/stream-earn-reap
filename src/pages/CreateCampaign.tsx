import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignCreator } from '@/components/campaign/CampaignCreator';

export default function CreateCampaign() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <CampaignCreator onClose={() => navigate('/rewards')} />
    </div>
  );
}