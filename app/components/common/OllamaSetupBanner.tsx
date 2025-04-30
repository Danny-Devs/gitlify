import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Button } from '@/app/components/ui/button';
import { ServerOff, ArrowRight } from 'lucide-react';

interface OllamaSetupBannerProps {
  onSetupClick?: () => void;
}

export default function OllamaSetupBanner({
  onSetupClick
}: OllamaSetupBannerProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/llm/status');
      const data = await response.json();
      setIsConnected(data.connected);
    } catch (error) {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  // Don't show if connected or loading
  if (isConnected === true || isConnected === null || dismissed) {
    return null;
  }

  return (
    <Alert variant="warning" className="mt-4 mb-6">
      <ServerOff className="h-5 w-5" />
      <AlertTitle>Ollama Server Required</AlertTitle>
      <AlertDescription className="flex flex-col space-y-3">
        <p>
          Gitlify requires a local Ollama server to generate PRDs. PRD
          generation will fail until Ollama is installed and running.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              onSetupClick?.();
              document.getElementById('ollama-help-button')?.click();
            }}
          >
            View Setup Instructions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDismissed(true)}
          >
            Dismiss
          </Button>
          <Button size="sm" variant="ghost" onClick={checkConnection}>
            Check Again
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
