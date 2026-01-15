import { useState, useEffect } from "react";
import { X, Key, ExternalLink, Loader2, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useKeyGeneration } from "@/hooks/useKeyGeneration";

interface KeyGenerationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const KeyGenerationPopup = ({ isOpen, onClose, onSuccess }: KeyGenerationPopupProps) => {
  const { isValid, isLoading, keyUrl, error, generateKeyUrl, expiresAt } = useKeyGeneration();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (isOpen && isValid) {
      onSuccess();
    }
  }, [isOpen, isValid, onSuccess]);

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    const url = await generateKeyUrl();
    setIsGenerating(false);
    
    if (url) {
      setShowInstructions(true);
      // Open URL in new tab
      window.open(url, '_blank');
    }
  };

  const formatExpiry = (dateStr: string) => {
    const date = new Date(dateStr);
    const hours = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60));
    return `${hours} hours`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-br from-primary/20 to-primary/5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Key className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl">Access Key Required</h2>
              <p className="text-sm text-muted-foreground">Generate a key to watch videos</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="mt-3 text-muted-foreground">Checking access...</p>
            </div>
          ) : isValid ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-semibold text-lg">Access Granted!</h3>
              {expiresAt && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4" />
                  Valid for {formatExpiry(expiresAt)}
                </p>
              )}
            </div>
          ) : showInstructions ? (
            <div className="space-y-4">
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <h4 className="font-medium text-warning flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Complete These Steps:
                </h4>
                <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>A new tab has opened with a link</li>
                  <li>Wait for the timer (if any)</li>
                  <li>Click "Get Link" or similar button</li>
                  <li>You'll be redirected back automatically</li>
                </ol>
              </div>
              
              <button
                onClick={handleGenerateKey}
                className="w-full py-3 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open Link Again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground text-center">
                To access premium video content, you need to generate an access key. 
                This key will be valid for <span className="text-primary font-medium">24 hours</span>.
              </p>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <button
                onClick={handleGenerateKey}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    Generate Access Key
                  </>
                )}
              </button>

              <p className="text-xs text-center text-muted-foreground">
                By generating a key, you agree to our terms of service
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeyGenerationPopup;
