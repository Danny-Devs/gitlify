'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu';
import {
  Eye,
  Star,
  GitFork,
  MoreVertical,
  Trash,
  FileText
} from 'lucide-react';
import { useToast } from '@/app/components/ui/use-toast';

interface RepositoryCardProps {
  repository: {
    id: string;
    name: string;
    owner: string;
    description: string;
    url: string;
    stars?: number;
    forks?: number;
  };
  onDelete?: (id: string) => void;
  onGeneratePRD?: (id: string) => void;
}

export default function RepositoryCard({
  repository,
  onDelete,
  onGeneratePRD
}: RepositoryCardProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(repository.id);
      toast({
        title: 'Repository deleted',
        description: `${repository.name} has been removed from your list.`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete repository.',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGeneratePRD = async () => {
    if (!onGeneratePRD) return;

    try {
      await onGeneratePRD(repository.id);
      toast({
        title: 'PRD generation started',
        description: 'Your PRD is being generated. This may take a few minutes.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start PRD generation.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Link
            href={repository.url}
            target="_blank"
            className="hover:underline flex-grow"
          >
            {repository.owner}/{repository.name}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleGeneratePRD}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate PRD
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="cursor-pointer text-destructive"
                disabled={isDeleting}
              >
                <Trash className="mr-2 h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {repository.description || 'No description provided'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground">
          <a
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {repository.url.replace(/^https?:\/\//, '')}
          </a>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {repository.stars !== undefined && (
            <div className="flex items-center">
              <Star className="mr-1 h-3.5 w-3.5" />
              {repository.stars.toLocaleString()}
            </div>
          )}

          {repository.forks !== undefined && (
            <div className="flex items-center">
              <GitFork className="mr-1 h-3.5 w-3.5" />
              {repository.forks.toLocaleString()}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={handleGeneratePRD}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate PRD
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
