'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Star, GitFork, FileText, UserCircle } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/app/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/app/components/ui/tooltip';

interface PRDCardProps {
  id: string;
  title: string;
  summary: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  repository: {
    name: string;
    owner: string;
    stars?: number | null;
    forks?: number | null;
  };
  user: {
    name?: string | null;
    image?: string | null;
  };
  chapterCount: number;
}

export default function PRDCard({
  id,
  title,
  summary,
  status,
  createdAt,
  updatedAt,
  repository,
  user,
  chapterCount
}: PRDCardProps) {
  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/prds/${id}`} className="block h-full">
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={getStatusColor(status)} variant="outline">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock size={14} />
              {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {summary}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <div className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md flex items-center">
              <Link
                href={`/repositories/${repository.owner}/${repository.name}`}
                className="hover:underline"
              >
                {repository.owner}/{repository.name}
              </Link>
            </div>

            {repository.stars !== null && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs flex items-center gap-1 text-muted-foreground">
                    <Star size={12} />
                    {repository.stars}
                  </div>
                </TooltipTrigger>
                <TooltipContent>Stars</TooltipContent>
              </Tooltip>
            )}

            {repository.forks !== null && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs flex items-center gap-1 text-muted-foreground">
                    <GitFork size={12} />
                    {repository.forks}
                  </div>
                </TooltipTrigger>
                <TooltipContent>Forks</TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-sm flex items-center gap-1 text-muted-foreground">
              <FileText size={14} />
              {chapterCount} {chapterCount === 1 ? 'chapter' : 'chapters'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs flex items-center gap-1 text-muted-foreground">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'User'}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <UserCircle size={14} />
              )}
              {user.name || 'Anonymous'}
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
