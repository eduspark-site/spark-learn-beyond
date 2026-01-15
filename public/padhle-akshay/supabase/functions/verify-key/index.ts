import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation patterns
const TOKEN_REGEX = /^[a-f0-9]{64}$/;
const DEVICE_ID_REGEX = /^[a-f0-9]{32}$/;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { token, deviceId } = body;
    
    // Validate required parameters
    if (!token || typeof token !== 'string') {
      return new Response(
        JSON.stringify({ valid: false, error: 'Missing or invalid token parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!deviceId || typeof deviceId !== 'string') {
      return new Response(
        JSON.stringify({ valid: false, error: 'Missing or invalid deviceId parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate token format
    if (!TOKEN_REGEX.test(token)) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid token format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate deviceId format
    if (!DEVICE_ID_REGEX.test(deviceId)) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid deviceId format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find the key and activate it if valid
    const { data: keyData, error } = await supabase
      .from('access_keys')
      .select('*')
      .eq('token', token)
      .eq('device_id', deviceId)
      .maybeSingle();

    if (error || !keyData) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid or expired key' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if key is expired
    const expiresAt = new Date(keyData.expires_at);
    if (expiresAt < new Date()) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Key has expired' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Activate the key (set is_revoked to false)
    if (keyData.is_revoked) {
      await supabase
        .from('access_keys')
        .update({ is_revoked: false })
        .eq('id', keyData.id);
    }

    return new Response(
      JSON.stringify({ 
        valid: true, 
        expiresAt: keyData.expires_at,
        token: keyData.token
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ valid: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
