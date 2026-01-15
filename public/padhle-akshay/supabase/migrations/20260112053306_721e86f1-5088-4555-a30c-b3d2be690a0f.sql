-- Remove the overly permissive public read policy
DROP POLICY IF EXISTS "Allow public read access to access_keys" ON public.access_keys;

-- Create a restrictive policy - only service role (edge functions) can access
-- No direct client access is allowed
CREATE POLICY "Deny all direct access to access_keys" 
ON public.access_keys 
FOR ALL 
USING (false);