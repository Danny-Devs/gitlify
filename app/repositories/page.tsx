'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/app/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/app/components/ui/tabs';
import RepositoryList from '@/app/components/repository/RepositoryList';
import AddRepositoryForm from '@/app/components/repository/AddRepositoryForm';
import { useToast } from '@/app/components/ui/use-toast';
import { Repository } from '@/app/types/repository';

export default function RepositoriesPage() {
  const { data: session, status } = useSession();
  const [userRepos, setUserRepos] = useState<Repository[]>([]);
  const [isLoadingUserRepos, setIsLoadingUserRepos] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch repositories on mount and when session changes
  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserRepositories();
    }
  }, [status]);

  async function fetchUserRepositories() {
    setIsLoadingUserRepos(true);
    setError(null);

    try {
      const response = await fetch('/api/repositories');

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const data = await response.json();
      setUserRepos(data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to fetch repositories'
      );
      toast({
        title: 'Error',
        description: 'Failed to fetch repositories. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingUserRepos(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Your Repositories</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Your Repositories</h1>
          <p className="text-muted-foreground mb-4">
            Please sign in to view and manage your repositories.
          </p>
          <Button asChild>
            <a href="/api/auth/signin">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Repositories</h1>
        <p className="text-muted-foreground">
          Manage GitHub repositories to generate PRDs from
        </p>
      </div>

      {error && (
        <div className="bg-destructive/15 p-4 rounded-md mb-6">
          <p className="text-destructive font-medium">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUserRepositories}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {showAddForm ? (
        <div className="mb-8">
          <AddRepositoryForm
            onComplete={() => {
              setShowAddForm(false);
              fetchUserRepositories();
            }}
          />
        </div>
      ) : (
        <div className="mb-8">
          <RepositoryList
            repositories={userRepos}
            onAddRepository={() => setShowAddForm(true)}
            isLoading={isLoadingUserRepos}
          />
        </div>
      )}
    </div>
  );
}
