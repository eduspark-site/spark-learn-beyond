import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <div className="error-card fade-in">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
      <p className="text-muted-foreground mb-6">{message}</p>
      <button onClick={onRetry} className="btn-primary inline-flex items-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;
