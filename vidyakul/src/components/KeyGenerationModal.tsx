import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Clock, CheckCircle, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface KeyGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyGenerated: () => void;
}

const SHORTENER_API_KEY = '5ecfb2da1713b8b7f658156bb58df22bce31ee09';

const KeyGenerationModal = ({ isOpen, onClose, onKeyGenerated }: KeyGenerationModalProps) => {
  const { user, storePendingKey, generateKey, userKeyInfo } = useAuth();
  const [step, setStep] = useState<'intro' | 'redirecting' | 'verifying' | 'success' | 'failed'>('intro');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if returning from shortener with token
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('key_token');
    
    if (token && isOpen && user) {
      setStep('verifying');
      verifyToken(token);
    }
  }, [isOpen, user]);

  const verifyToken = async (token: string) => {
    try {
      const success = await generateKey(token);
      if (success) {
        setStep('success');
        // Remove token from URL
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => {
          onKeyGenerated();
        }, 2000);
      } else {
        setStep('failed');
        // Remove invalid token from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      setStep('failed');
    }
  };

  const handleGenerateKey = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Generate a unique token for verification
      const token = `${user.uid}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      // Store pending key request in Firebase
      await storePendingKey(token);
      
      // Create callback URL with token - use origin only for cleaner redirect
      const callbackUrl = `${window.location.origin}/?key_token=${token}`;
      
      setStep('redirecting');
      
      // Fetch shortened URL from API
      const apiUrl = `https://vplink.in/api?api=${SHORTENER_API_KEY}&url=${encodeURIComponent(callbackUrl)}`;
      
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.status === 'success' && data.shortenedUrl) {
          // Redirect to the shortened URL
          window.location.href = data.shortenedUrl;
        } else if (data.shortenedUrl) {
          window.location.href = data.shortenedUrl;
        } else {
          // Fallback: try direct redirect to shortener with URL
          window.location.href = `https://vplink.in/st?api=${SHORTENER_API_KEY}&url=${encodeURIComponent(callbackUrl)}`;
        }
      } catch (fetchError) {
        // Fallback: use direct shortener link format
        window.location.href = `https://vplink.in/st?api=${SHORTENER_API_KEY}&url=${encodeURIComponent(callbackUrl)}`;
      }
    } catch (error) {
      console.error('Key generation error:', error);
      setStep('failed');
      setIsLoading(false);
    }
  };

  const remainingTime = userKeyInfo ? getRemainingTime(userKeyInfo.expiresAt) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Key Generation
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-6 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Key className="w-10 h-10 text-primary" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Generate Access Key</h3>
              
              <p className="text-muted-foreground mb-6">
                एक बार key generate करने के बाद आप <strong className="text-primary">24 घंटे</strong> तक बिना ads के पढ़ सकते हो!
              </p>
              
              <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Valid for 24 hours</span>
              </div>
              
              <Button 
                onClick={handleGenerateKey}
                disabled={isLoading}
                className="w-full btn-primary"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Generate Key
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {step === 'redirecting' && (
            <motion.div
              key="redirecting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-10 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <ExternalLink className="w-8 h-8 text-primary animate-pulse" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Redirecting...</h3>
              
              <p className="text-muted-foreground mb-4">
                कृपया सभी steps पूरे करें और वापस आ जाएं
              </p>
              
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm">Please wait...</span>
              </div>
            </motion.div>
          )}

          {step === 'verifying' && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-10 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Verifying...</h3>
              
              <p className="text-muted-foreground">
                आपकी key verify हो रही है
              </p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-10 text-center"
            >
              <motion.div 
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                <CheckCircle className="w-10 h-10 text-green-500" />
              </motion.div>
              
              <h3 className="text-lg font-semibold mb-2 text-green-500">Key Generated!</h3>
              
              <p className="text-muted-foreground mb-4">
                🎉 अगले 24 घंटे तक आप बिना ads के पढ़ सकते हो!
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm bg-green-500/10 py-2 px-4 rounded-lg">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="text-green-500 font-medium">24 Hours Active</span>
              </div>
            </motion.div>
          )}

          {step === 'failed' && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-10 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2 text-destructive">Key Generation Failed</h3>
              
              <p className="text-muted-foreground mb-6">
                कृपया सभी steps पूरे करके वापस आएं
              </p>
              
              <Button 
                onClick={() => setStep('intro')}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

function getRemainingTime(expiresAt: Date): string {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m remaining`;
}

export default KeyGenerationModal;
