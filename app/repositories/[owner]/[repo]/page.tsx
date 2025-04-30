'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Github,
  GitBranch,
  Star,
  GitFork,
  ExternalLink,
  FileCode,
  Book,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createGitHubClient } from '@/app/lib/github/githubClient';
import { RepoLoadingSkeleton } from './loading';
import Link from 'next/link';

interface RepositoryDetailPageProps {
  params: {
    owner: string;
    repo: string;
  };
}

export default function RepositoryDetailPage({
  params
}: RepositoryDetailPageProps) {
  const { owner, repo } = params;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [repository, setRepository] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    async function fetchRepositoryDetails() {
      setIsLoading(true);
      setError(null);

      try {
        const githubClient = createGitHubClient();
        const repoDetails = await githubClient.getRepo(owner, repo);

        setRepository(repoDetails);
      } catch (error) {
        console.error('Error fetching repository details:', error);
        setError(
          'Failed to load repository details. Please check the repository name and try again.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchRepositoryDetails();
  }, [owner, repo]);

  const handleStartAnalysis = async () => {
    if (!session) {
      // Redirect to sign in if not authenticated
      router.push(
        '/auth/signin?callbackUrl=' +
          encodeURIComponent(`/repositories/${owner}/${repo}`)
      );
      return;
    }

    setIsAnalyzing(true);

    // In a real implementation, we would:
    // 1. Save this repository to the user's repositories if not already saved
    // 2. Create a new analysis record in the database
    // 3. Start the analysis process (potentially redirect to an analysis page)

    try {
      // Mock delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirect to the analysis page
      router.push(`/analyses/new?owner=${owner}&repo=${repo}`);
    } catch (error) {
      console.error('Error starting analysis:', error);
      setError('Failed to start analysis. Please try again.');
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return <RepoLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert variant="destructive" className="mb-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (!repository) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert className="mb-8">
          <AlertTitle>Repository Not Found</AlertTitle>
          <AlertDescription>
            The repository {owner}/{repo} could not be found.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/repositories')}>
          Browse Repositories
        </Button>
      </div>
    );
  }

  const formattedDate = new Date(repository.updated_at).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/repositories" className="hover:underline">
            Repositories
          </Link>
          <span>/</span>
          <span>{owner}</span>
          <span>/</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {repo}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold flex items-center">
            <Github className="mr-2 h-8 w-8" />
            {owner}/{repo}
          </h1>

          <div className="flex items-center gap-3">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>View on GitHub</span>
            </a>

            <Button
              onClick={handleStartAnalysis}
              disabled={isAnalyzing}
              className="ml-2"
            >
              {isAnalyzing ? 'Starting Analysis...' : 'Start Analysis'}
            </Button>
          </div>
        </div>

        <p className="mt-3 text-gray-600 dark:text-gray-400">
          {repository.description || 'No description provided.'}
        </p>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Star className="h-4 w-4 mr-1" />
            <span>{repository.stargazers_count.toLocaleString()} stars</span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <GitFork className="h-4 w-4 mr-1" />
            <span>{repository.forks_count.toLocaleString()} forks</span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <GitBranch className="h-4 w-4 mr-1" />
            <span>{repository.default_branch}</span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            <span>Updated {formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Repository Overview</CardTitle>
              <CardDescription>
                Start an analysis to get comprehensive insights into this
                repository
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  CodeGrok will help you master this repository by analyzing its
                  structure, architecture, and code patterns. You'll get:
                </p>

                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <FileCode className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Multi-layered explanations from high-level architecture to
                      implementation details
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Book className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Comprehensive Project Requirement Document (PRD) extracted
                      from the codebase
                    </span>
                  </li>
                  <li className="flex items-start">
                    <GitBranch className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Visual diagrams of component relationships and data flow
                    </span>
                  </li>
                </ul>

                <div className="mt-6">
                  <p className="font-medium">
                    Language: {repository.language || 'Not specified'}
                  </p>
                  <p>License: {repository.license?.name || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleStartAnalysis}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing
                  ? 'Starting Analysis...'
                  : 'Start Comprehensive Analysis'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>About This Repository</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Owner
                  </h3>
                  <p className="mt-1">{repository.owner.login}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created
                  </h3>
                  <p className="mt-1">
                    {new Date(repository.created_at).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Size
                  </h3>
                  <p className="mt-1">
                    {(repository.size / 1024).toFixed(2)} MB
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Open Issues
                  </h3>
                  <p className="mt-1">{repository.open_issues_count}</p>
                </div>

                {repository.topics && repository.topics.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Topics
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {repository.topics.map((topic: string) => (
                        <span
                          key={topic}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
