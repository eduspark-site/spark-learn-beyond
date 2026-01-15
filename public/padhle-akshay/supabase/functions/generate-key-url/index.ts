import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const KEY_EXPIRY_HOURS = 24;

// Allowed callback paths
const ALLOWED_CALLBACK_PATH = '/verify-key';

// Token validation regex - only alphanumeric, dash, underscore
const DEVICE_ID_REGEX = /^[a-f0-9]{32}$/;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { callbackUrl, deviceId } = body;
    
    // Validate required parameters exist and are strings
    if (!callbackUrl || typeof callbackUrl !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid callbackUrl parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!deviceId || typeof deviceId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid deviceId parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate deviceId format
    if (!DEVICE_ID_REGEX.test(deviceId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid deviceId format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate callback URL - must be a valid URL with allowed path
    let parsedCallbackUrl: URL;
    try {
      parsedCallbackUrl = new URL(callbackUrl);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid callback URL format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Only allow HTTPS in production (allow HTTP for localhost)
    const isLocalhost = parsedCallbackUrl.hostname === 'localhost' || parsedCallbackUrl.hostname === '127.0.0.1';
    if (!isLocalhost && parsedCallbackUrl.protocol !== 'https:') {
      return new Response(
        JSON.stringify({ error: 'Callback URL must use HTTPS' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate the path is the expected verify-key path
    if (parsedCallbackUrl.pathname !== ALLOWED_CALLBACK_PATH) {
      return new Response(
        JSON.stringify({ error: 'Invalid callback path' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('VPLINK_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate a cryptographically secure token
    const tokenBytes = new Uint8Array(32);
    crypto.getRandomValues(tokenBytes);
    const uniqueToken = Array.from(tokenBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Calculate expiry time
    const expiresAt = new Date(Date.now() + KEY_EXPIRY_HOURS * 60 * 60 * 1000);

    // Store the pending key in database (not activated yet)
    const { error: insertError } = await supabase
      .from('access_keys')
      .insert({
        token: uniqueToken,
        device_id: deviceId,
        expires_at: expiresAt.toISOString(),
        is_revoked: true, // Will be activated upon verification
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create key' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build destination URL safely using URL constructor
    const destinationUrl = new URL(callbackUrl);
    destinationUrl.searchParams.set('token', uniqueToken);
    
    // Call the VPLink API to create shortened URL
    const vpLinkUrl = `https://vplink.in/api?api=${apiKey}&url=${encodeURIComponent(destinationUrl.toString())}`;
    
    const response = await fetch(vpLinkUrl);
    const data = await response.json();
    
    if (data.status === 'success' || data.shortenedUrl) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          shortUrl: data.shortenedUrl || data.short_url || data.link,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Clean up the unused key
      await supabase.from('access_keys').delete().eq('token', uniqueToken);
      
      return new Response(
        JSON.stringify({ error: 'Failed to generate short URL', details: data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
