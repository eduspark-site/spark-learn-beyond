import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Key, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useKeyGeneration } from '@/hooks/useKeyGeneration';

const VerifyKey = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyAndActivateKey, timeRemaining } = useKeyGeneration();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [activatedTimeRemaining, setActivatedTimeRemaining] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('failed');
      return;
    }

    // Small delay to show verification animation
    const timer = setTimeout(async () => {
      const isValid = await verifyAndActivateKey(token);
      setStatus(isValid ? 'success' : 'failed');
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams, verifyAndActivateKey]);

  // Update time remaining after activation
  useEffect(() => {
    if (status === 'success' && timeRemaining) {
      setActivatedTimeRemaining(timeRemaining);
    }
  }, [status, timeRemaining]);

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {status === 'verifying' && (
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
              Verifying Your Key...
            </h1>
            <p className="text-muted-foreground">
              Please wait while we verify your access key
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-success mb-2">
              Key Generated Successfully!
            </h1>
            <p className="text-muted-foreground mb-4">
              Your 24-hour ad-free access is now active
            </p>
            
            <div className="bg-secondary/50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Key className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Access Key Active</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{activatedTimeRemaining || timeRemaining || '24h remaining'}</span>
              </div>
            </div>

            <Button 
              onClick={handleContinue}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Start Learning
            </Button>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-destructive mb-2">
              Key Generation Failed
            </h1>
            <p className="text-muted-foreground mb-6">
              Please complete all the steps on the verification page to generate your key.
            </p>
            
            <Button 
              onClick={handleContinue}
              variant="outline"
              className="w-full"
            >
              Go Back & Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyKey;
