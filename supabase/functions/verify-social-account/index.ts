import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlatformConfig {
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
}

const getPlatformConfig = (platform: string): PlatformConfig => {
  const configs: Record<string, PlatformConfig> = {
    tiktok: {
      authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
      tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
      userInfoUrl: 'https://open.tiktokapis.com/v2/user/info/',
      clientId: Deno.env.get('TIKTOK_CLIENT_KEY')!,
      clientSecret: Deno.env.get('TIKTOK_CLIENT_SECRET')!,
      scopes: ['user.info.basic']
    },
    instagram: {
      authUrl: 'https://api.instagram.com/oauth/authorize',
      tokenUrl: 'https://api.instagram.com/oauth/access_token',
      userInfoUrl: 'https://graph.instagram.com/me',
      clientId: Deno.env.get('INSTAGRAM_CLIENT_ID')!,
      clientSecret: Deno.env.get('INSTAGRAM_CLIENT_SECRET')!,
      scopes: ['user_profile', 'user_media']
    },
    youtube: {
      authUrl: 'https://accounts.google.com/o/oauth2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
      clientId: Deno.env.get('YOUTUBE_CLIENT_ID')!,
      clientSecret: Deno.env.get('YOUTUBE_CLIENT_SECRET')!,
      scopes: ['https://www.googleapis.com/auth/youtube.readonly']
    },
    twitter: {
      authUrl: 'https://twitter.com/i/oauth2/authorize',
      tokenUrl: 'https://api.twitter.com/2/oauth2/token',
      userInfoUrl: 'https://api.twitter.com/2/users/me',
      clientId: Deno.env.get('TWITTER_CLIENT_ID')!,
      clientSecret: Deno.env.get('TWITTER_CLIENT_SECRET')!,
      scopes: ['tweet.read', 'users.read']
    }
  };

  return configs[platform];
};

const generateAuthUrl = (platform: string, redirectUri: string, state: string) => {
  const config = getPlatformConfig(platform);
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state: state
  });

  return `${config.authUrl}?${params.toString()}`;
};

const exchangeCodeForToken = async (platform: string, code: string, redirectUri: string) => {
  const config = getPlatformConfig(platform);
  
  const body = new FormData();
  body.append('client_id', config.clientId);
  body.append('client_secret', config.clientSecret);
  body.append('code', code);
  body.append('grant_type', 'authorization_code');
  body.append('redirect_uri', redirectUri);

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    body: body
  });

  return await response.json();
};

const getUserInfo = async (platform: string, accessToken: string) => {
  const config = getPlatformConfig(platform);
  
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${accessToken}`
  };

  const response = await fetch(config.userInfoUrl, {
    headers
  });

  return await response.json();
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

    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const platform = url.searchParams.get('platform');

    if (!platform || !['tiktok', 'instagram', 'youtube', 'twitter'].includes(platform)) {
      return new Response(
        JSON.stringify({ error: 'Invalid platform' }),
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

    if (action === 'auth') {
      // Generate authorization URL
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/verify-social-account?action=callback&platform=${platform}`;
      const state = `${user.id}-${Date.now()}`;
      const authUrl = generateAuthUrl(platform, redirectUri, state);

      return new Response(
        JSON.stringify({ authUrl, state }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      if (!code) {
        return new Response(
          JSON.stringify({ error: 'Authorization code required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/verify-social-account?action=callback&platform=${platform}`;
      
      // Exchange code for access token
      const tokenData = await exchangeCodeForToken(platform, code, redirectUri);
      
      if (tokenData.error) {
        console.error(`${platform} token exchange error:`, tokenData);
        return new Response(
          JSON.stringify({ error: `Failed to verify ${platform} account` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get user info with the access token
      const userInfo = await getUserInfo(platform, tokenData.access_token);
      
      if (userInfo.error) {
        console.error(`${platform} user info error:`, userInfo);
        return new Response(
          JSON.stringify({ error: `Failed to get ${platform} user info` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Extract platform-specific user data
      let username = '';
      let userId = '';

      switch (platform) {
        case 'tiktok':
          username = userInfo.data?.user?.username || '';
          userId = userInfo.data?.user?.open_id || '';
          break;
        case 'instagram':
          username = userInfo.username || '';
          userId = userInfo.id || '';
          break;
        case 'youtube':
          username = userInfo.items?.[0]?.snippet?.title || '';
          userId = userInfo.items?.[0]?.id || '';
          break;
        case 'twitter':
          username = userInfo.data?.username || '';
          userId = userInfo.data?.id || '';
          break;
      }

      // Update user profile with verification data
      const updateData: Record<string, any> = {};
      updateData[`${platform}_username`] = username;
      updateData[`${platform}_user_id`] = userId;
      updateData[`${platform}_access_token`] = tokenData.access_token;
      updateData[`${platform}_verified`] = true;
      updateData[`${platform}_connected`] = true;

      if (platform === 'youtube' && tokenData.refresh_token) {
        updateData[`${platform}_refresh_token`] = tokenData.refresh_token;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update profile' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Redirect back to the profile page with success
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `${req.headers.get('origin') || 'http://localhost:5173'}/profile?verified=${platform}`,
          ...corsHeaders
        }
      });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Social verification error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});