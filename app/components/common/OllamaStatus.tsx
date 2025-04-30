import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/components/ui/dialog';
import { Alert, AlertDescription } from '@/app/components/ui/alert';

export default function OllamaStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    try {
      const response = await fetch('/api/llm/status');
      const data = await response.json();
      setIsConnected(data.connected);
    } catch (error) {
      setIsConnected(false);
      console.error('Error checking Ollama status:', error);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    // Check every 30 seconds
    const interval = setInterval(() => {
      checkConnection();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center">
      <div className="flex items-center mr-2">
        {isConnected === null ? (
          <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
        ) : isConnected ? (
          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500 mr-2" />
        )}
        <span className="text-sm">
          {isConnected === null
            ? 'Checking Ollama...'
            : isConnected
            ? 'Ollama Connected'
            : 'Ollama Offline'}
        </span>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            id="ollama-help-button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Info className="h-4 w-4" />
            <span className="sr-only">Ollama Setup Instructions</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ollama Setup Instructions</DialogTitle>
            <DialogDescription>
              Gitlify requires a local Ollama server to generate PRDs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Alert variant="info">
              <AlertDescription>
                Ollama is used to run large language models locally on your
                machine, which means your code never leaves your computer.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-medium text-lg">Installation Steps:</h3>

              <div className="space-y-2">
                <h4 className="font-medium">1. Download and Install Ollama</h4>
                <p className="text-sm">
                  Visit{' '}
                  <a
                    href="https://ollama.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    https://ollama.ai
                  </a>{' '}
                  and download the installer for your operating system.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">2. Start Ollama</h4>
                <p className="text-sm">
                  Launch the Ollama application after installation.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">3. Install a Code-Capable Model</h4>
                <p className="text-sm">
                  Open a terminal or command prompt and run:
                </p>
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm font-mono">
                  ollama pull codellama:7b
                </div>
                <p className="text-sm text-muted-foreground">
                  (This is a smaller model. For better results with more
                  powerful hardware, try codellama:13b or codellama:34b)
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">4. Configure Gitlify</h4>
                <p className="text-sm">
                  In Gitlify Settings, add a new LLM configuration with:
                </p>
                <ul className="list-disc list-inside text-sm">
                  <li>Endpoint: http://localhost:11434/api/generate</li>
                  <li>Model Name: codellama:7b (or the model you installed)</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={checkConnection}
                disabled={checking}
              >
                {checking ? 'Checking...' : 'Check Connection'}
              </Button>
              <Button variant="default" asChild>
                <a href="/settings" target="_blank" rel="noopener noreferrer">
                  Open Settings
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
