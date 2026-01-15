import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useKeyGeneration } from "@/hooks/useKeyGeneration";

const VerifyKey = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { validateToken } = useKeyGeneration();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your access key...');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('No token provided');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    const verify = async () => {
      const success = await validateToken(token);
      
      if (success) {
        setStatus('success');
        setMessage('Access granted! Redirecting...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setStatus('error');
        setMessage('Invalid or expired key. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    verify();
  }, [searchParams, validateToken, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-card border border-border">
          {status === 'loading' && (
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          )}
          {status === 'success' && (
            <CheckCircle className="w-10 h-10 text-success" />
          )}
          {status === 'error' && (
            <XCircle className="w-10 h-10 text-destructive" />
          )}
        </div>
        
        <h1 className="font-heading font-bold text-2xl">
          {status === 'loading' && 'Verifying...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Error'}
        </h1>
        
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default VerifyKey;
