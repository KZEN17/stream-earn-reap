import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { campaignId } = await req.json();

    if (!campaignId) {
      return new Response(
        JSON.stringify({ error: 'Campaign ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get campaign requirements
    const { data: requirements, error: reqError } = await supabase
      .from('campaign_requirements')
      .select('platform, required')
      .eq('campaign_id', campaignId);

    if (reqError) {
      console.error('Error fetching campaign requirements:', reqError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch campaign requirements' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user profile with verification status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        instagram_verified,
        tiktok_verified,
        youtube_verified,
        twitter_verified,
        instagram_username,
        tiktok_username,
        youtube_channel_id,
        twitter_username
      `)
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check eligibility
    const eligibility: Record<string, any> = {
      eligible: true,
      missingPlatforms: [],
      connectedPlatforms: [],
      requiredPlatforms: []
    };

    if (requirements && requirements.length > 0) {
      for (const requirement of requirements) {
        if (requirement.required) {
          eligibility.requiredPlatforms.push(requirement.platform);
          
          const verified = profile?.[`${requirement.platform}_verified`] || false;
          const username = profile?.[`${requirement.platform}_username`] || profile?.[`${requirement.platform}_channel_id`] || '';
          
          if (verified && username) {
            eligibility.connectedPlatforms.push({
              platform: requirement.platform,
              username: username,
              verified: true
            });
          } else {
            eligibility.eligible = false;
            eligibility.missingPlatforms.push(requirement.platform);
          }
        }
      }
    } else {
      // If no specific requirements, check what platforms are connected
      const platforms = ['instagram', 'tiktok', 'youtube', 'twitter'];
      for (const platform of platforms) {
        const verified = profile?.[`${platform}_verified`] || false;
        const username = profile?.[`${platform}_username`] || profile?.[`${platform}_channel_id`] || '';
        
        if (verified && username) {
          eligibility.connectedPlatforms.push({
            platform: platform,
            username: username,
            verified: true
          });
        }
      }
    }

    return new Response(
      JSON.stringify(eligibility),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Campaign eligibility check error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});