'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RepositoryList from '../components/repository/RepositoryList';
import AddRepositoryForm from '../components/repository/AddRepositoryForm';
import { getRepositories } from '../services/repository/repositoryService';

export default function RepositoriesPage() {
  const { data: session, status } = useSession();
  const [userRepos, setUserRepos] = useState<any[]>([]);
  const [isLoadingUserRepos, setIsLoadingUserRepos] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('your-repos');

  useEffect(() => {
    fetchUserRepositories();
  }, [session]);

  async function fetchUserRepositories() {
    if (session?.user) {
      setIsLoadingUserRepos(true);
      try {
        const response = await fetch('/api/repositories');

        if (response.ok) {
          const data = await response.json();
          setUserRepos(data);
        } else {
          console.error('Failed to fetch repositories');
        }
      } catch (error) {
        console.error('Error fetching repositories:', error);
      } finally {
        setIsLoadingUserRepos(false);
      }
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
