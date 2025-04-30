'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ui/use-toast';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/app/components/ui/card';
import { parseGitHubUrl } from '@/app/services/repository/repositoryService';

interface AddRepositoryFormProps {
  onComplete?: () => void;
}

export default function AddRepositoryForm({
  onComplete
}: AddRepositoryFormProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate URL
    if (!url) {
      setError('Repository URL is required');
      return;
    }

    // Clear previous errors
    setError('');

    // Validate GitHub URL format
    try {
      parseGitHubUrl(url);
    } catch (error) {
      setError(
        'Invalid GitHub repository URL format. Please use a valid GitHub URL.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/repositories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add repository');
      }

      const repository = await response.json();

      toast({
        title: 'Repository added',
        description: `${repository.owner}/${repository.name} has been added to your list.`
      });

      // Clear form
      setUrl('');

      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }

      // Refresh the page to show the updated list
      router.refresh();
    } catch (error) {
      console.error('Error adding repository:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to add repository'
      );

      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to add repository',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add GitHub Repository</CardTitle>
        <CardDescription>
          Enter the URL of a GitHub repository you want to analyze
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="url">Repository URL</Label>
              <Input
                id="url"
                placeholder="https://github.com/owner/repo"
                value={url}
                onChange={e => setUrl(e.target.value)}
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setUrl('');
              setError('');
              if (onComplete) onComplete();
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Repository'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
