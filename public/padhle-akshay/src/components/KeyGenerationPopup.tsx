import { useState } from 'react';
import { Key, Loader2, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useKeyGeneration } from '@/hooks/useKeyGeneration';

interface KeyGenerationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyActivated: () => void;
  subjectTitle?: string;
}

const KeyGenerationPopup = ({ isOpen, onClose, onKeyActivated, subjectTitle }: KeyGenerationPopupProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { deviceId, hasValidKey, timeRemaining } = useKeyGeneration();

  const handleGeneratePin = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const callbackUrl = `${window.location.origin}/verify-key`;

      const { data, error: fnError } = await supabase.functions.invoke('generate-key-url', {
        body: { callbackUrl, deviceId }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.shortUrl) {
        // Redirect to the shortener URL
        window.location.href = data.shortUrl;
      } else {
        throw new Error('Failed to generate short URL');
      }
    } catch (err) {
      console.error('Error generating key:', err);
      setError('Failed to generate PIN. Please try again.');
      setIsGenerating(false);
    }
  };

  if (hasValidKey) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <CheckCircle2 className="w-6 h-6" />
              Key Already Active
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
                <Key className="w-10 h-10 text-success" />
              </div>
              <p className="text-lg font-medium text-foreground mb-2">
                Your key is already active!
              </p>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{timeRemaining}</span>
              </div>
            </div>
            <Button 
              onClick={onKeyActivated} 
              className="w-full bg-primary hover:bg-primary/90"
            >
              Continue to {subjectTitle || 'Video'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Key className="w-6 h-6" />
            Generate Access Key
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Key className="w-10 h-10 text-primary" />
            </div>
            <p className="text-lg font-medium text-foreground mb-2">
              Unlock Ad-Free Learning
            </p>
            <p className="text-muted-foreground text-sm">
              Generate a key once and study for <span className="text-primary font-semibold">24 hours</span> without any ads!
            </p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-muted-foreground">24 hours of uninterrupted learning</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-muted-foreground">Access all videos & flashcards</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-muted-foreground">No interruptions while studying</span>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button 
            onClick={handleGeneratePin}
            disabled={isGenerating}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Generate PIN
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Complete all steps after clicking to activate your key
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyGenerationPopup;
