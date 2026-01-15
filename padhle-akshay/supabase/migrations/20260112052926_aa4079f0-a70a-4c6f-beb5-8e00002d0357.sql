-- Create access_keys table for server-side key validation
CREATE TABLE public.access_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  device_id text NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  is_revoked boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE public.access_keys ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read their own keys (matched by device_id via edge function)
-- Keys are validated server-side via edge functions, so we use service role there
CREATE POLICY "Allow public read access to access_keys" 
ON public.access_keys 
FOR SELECT 
USING (true);

-- Index for faster token lookups
CREATE INDEX idx_access_keys_token ON public.access_keys(token);

-- Index for device_id lookups
CREATE INDEX idx_access_keys_device_id ON public.access_keys(device_id);

-- Index for expiry checks
CREATE INDEX idx_access_keys_expires_at ON public.access_keys(expires_at);