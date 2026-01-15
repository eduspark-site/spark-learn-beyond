import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface KeyData {
  token: string;
  expiresAt: string;
  deviceId: string;
}

const STORAGE_KEY = "padhle_akshay_key";

// Generate a unique device ID based on browser fingerprinting
const generateDeviceId = (): string => {
  const nav = navigator;
  const screen = window.screen;
  const fingerprint = [
    nav.userAgent,
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    nav.hardwareConcurrency || 0,
  ].join("|");
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(16).padStart(32, '0').slice(0, 32);
};

export const useKeyGeneration = () => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [keyUrl, setKeyUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deviceId = generateDeviceId();

  // Check if stored key is still valid
  const checkStoredKey = useCallback(async () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setIsValid(false);
      setIsLoading(false);
      return;
    }

    try {
      const keyData: KeyData = JSON.parse(stored);
      
      // Check if key is expired locally first
      if (new Date(keyData.expiresAt) < new Date()) {
        localStorage.removeItem(STORAGE_KEY);
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      // Verify with server
      const { data, error } = await supabase.functions.invoke('verify-key', {
        body: { token: keyData.token, deviceId }
      });

      if (error || !data?.valid) {
        localStorage.removeItem(STORAGE_KEY);
        setIsValid(false);
      } else {
        setIsValid(true);
        setExpiresAt(data.expiresAt);
      }
    } catch (e) {
      console.error('Error checking key:', e);
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  }, [deviceId]);

  // Generate new key URL
  const generateKeyUrl = useCallback(async () => {
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-key-url', {
        body: { deviceId }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate key URL');
      }

      if (data?.url) {
        setKeyUrl(data.url);
        return data.url;
      } else {
        throw new Error('No URL returned');
      }
    } catch (e: any) {
      console.error('Error generating key URL:', e);
      setError(e.message || 'Failed to generate key');
      return null;
    }
  }, [deviceId]);

  // Validate a token (called after redirect)
  const validateToken = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-key', {
        body: { token, deviceId }
      });

      if (error || !data?.valid) {
        throw new Error(data?.error || 'Invalid or expired key');
      }

      // Store the key
      const keyData: KeyData = {
        token: data.token,
        expiresAt: data.expiresAt,
        deviceId
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keyData));
      setIsValid(true);
      setExpiresAt(data.expiresAt);
      return true;
    } catch (e: any) {
      console.error('Error validating token:', e);
      setError(e.message || 'Validation failed');
      setIsValid(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [deviceId]);

  // Clear stored key
  const clearKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsValid(false);
    setExpiresAt(null);
  }, []);

  // Check key on mount
  useEffect(() => {
    checkStoredKey();
  }, [checkStoredKey]);

  return {
    isValid,
    isLoading,
    keyUrl,
    expiresAt,
    error,
    generateKeyUrl,
    validateToken,
    clearKey,
    checkStoredKey
  };
};
