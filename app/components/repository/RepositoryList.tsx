'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ui/use-toast';
import RepositoryCard from './RepositoryCard';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { Repository } from '@/app/types/repository';

interface RepositoryListProps {
  repositories: Repository[];
  onAddRepository?: () => void;
  isLoading?: boolean;
}

export default function RepositoryList({
  repositories,
  onAddRepository,
  isLoading = false
}: RepositoryListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const filteredRepositories = repositories.filter(repo => {
    const searchLower = search.toLowerCase();
    return (
      repo.name.toLowerCase().includes(searchLower) ||
      repo.owner.toLowerCase().includes(searchLower) ||
      repo.description?.toLowerCase().includes(searchLower) ||
      `${repo.owner}/${repo.name}`.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/repositories?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete repository');
      }

      // Refresh the page to update the list
      router.refresh();
    } catch (error) {
      console.error('Error deleting repository:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete repository',
        variant: 'destructive'
      });
    }
  };

  const handleGeneratePRD = async (id: string) => {
    try {
      const response = await fetch('/api/prds/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ repositoryId: id })
      });

      if (!response.ok) {
        throw new Error('Failed to start PRD generation');
      }

      const data = await response.json();

      // Navigate to PRD progress page
      router.push(`/prds/new?workflowRunId=${data.workflowRunId}`);
    } catch (error) {
      console.error('Error generating PRD:', error);
      toast({
        title: 'Error',
        description: 'Failed to start PRD generation',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {onAddRepository && (
          <Button onClick={onAddRepository}>
            <Plus className="mr-2 h-4 w-4" />
            Add Repository
          </Button>
        )}
      </div>

      {filteredRepositories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {search
              ? 'No repositories match your search'
              : 'No repositories found'}
          </p>
          {onAddRepository && (
            <Button onClick={onAddRepository} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Repository
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepositories.map(repo => (
            <RepositoryCard
              key={repo.id}
              repository={repo}
              onDelete={handleDelete}
              onGeneratePRD={handleGeneratePRD}
            />
          ))}
        </div>
      )}
    </div>
  );
}
