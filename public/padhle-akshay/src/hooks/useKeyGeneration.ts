import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const KEY_CACHE = 'eduspark_access_key_cache';
const DEVICE_ID_KEY = 'eduspark_device_id';

interface KeyCache {
  token: string;
  expiresAt: number;
}

// Generate or retrieve a persistent device ID
const getDeviceId = (): string => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    deviceId = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};

export const useKeyGeneration = () => {
  const [hasValidKey, setHasValidKey] = useState(false);
  const [keyExpiresAt, setKeyExpiresAt] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isValidating, setIsValidating] = useState(true);
  const [deviceId] = useState<string>(getDeviceId);

  // Validate key against server
  const validateKeyWithServer = useCallback(async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('validate-key', {
        body: { deviceId }
      });

      if (error || !data?.valid) {
        // Clear local cache if server says invalid
        localStorage.removeItem(KEY_CACHE);
        setHasValidKey(false);
        setKeyExpiresAt(null);
        return false;
      }

      // Update local cache with server data
      const expiresAt = new Date(data.expiresAt).getTime();
      const cache: KeyCache = {
        token: data.token,
        expiresAt
      };
      localStorage.setItem(KEY_CACHE, JSON.stringify(cache));
      
      setHasValidKey(true);
      setKeyExpiresAt(expiresAt);
      return true;
    } catch (err) {
      console.error('Key validation error:', err);
      return false;
    }
  }, [deviceId]);

  // Quick check using local cache (for UX), followed by server validation
  const checkKeyValidity = useCallback(async () => {
    setIsValidating(true);
    
    // Quick local check first
    const cached = localStorage.getItem(KEY_CACHE);
    if (cached) {
      try {
        const cacheData: KeyCache = JSON.parse(cached);
        if (cacheData.expiresAt > Date.now()) {
          // Optimistically show as valid while we verify
          setHasValidKey(true);
          setKeyExpiresAt(cacheData.expiresAt);
        }
      } catch {
        localStorage.removeItem(KEY_CACHE);
      }
    }

    // Always validate with server
    await validateKeyWithServer();
    setIsValidating(false);
  }, [validateKeyWithServer]);

  // Verify and activate a key after returning from URL shortener
  const verifyAndActivateKey = useCallback(async (urlToken: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-key', {
        body: { token: urlToken, deviceId }
      });

      if (error || !data?.valid) {
        return false;
      }

      // Store in local cache
      const expiresAt = new Date(data.expiresAt).getTime();
      const cache: KeyCache = {
        token: data.token,
        expiresAt
      };
      localStorage.setItem(KEY_CACHE, JSON.stringify(cache));
      
      setHasValidKey(true);
      setKeyExpiresAt(expiresAt);
      return true;
    } catch (err) {
      console.error('Key activation error:', err);
      return false;
    }
  }, [deviceId]);

  const formatTimeRemaining = useCallback((expiresAt: number): string => {
    const now = Date.now();
    const diff = expiresAt - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  }, []);

  // Check key validity on mount and set up periodic server checks
  useEffect(() => {
    checkKeyValidity();
    
    // Re-validate with server every 5 minutes
    const interval = setInterval(() => {
      validateKeyWithServer();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkKeyValidity, validateKeyWithServer]);

  // Update time remaining display
  useEffect(() => {
    if (!keyExpiresAt) {
      setTimeRemaining('');
      return;
    }

    const updateTime = () => {
      const remaining = formatTimeRemaining(keyExpiresAt);
      setTimeRemaining(remaining);
      
      // If expired, trigger server re-validation
      if (remaining === 'Expired') {
        setHasValidKey(false);
        setKeyExpiresAt(null);
        localStorage.removeItem(KEY_CACHE);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [keyExpiresAt, formatTimeRemaining]);

  return {
    hasValidKey,
    keyExpiresAt,
    timeRemaining,
    isValidating,
    deviceId,
    verifyAndActivateKey,
    checkKeyValidity
  };
};
