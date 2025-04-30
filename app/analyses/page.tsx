'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Plus, Search, Filter, Clock, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for analyses
const MOCK_ANALYSES = [
  {
    id: 'analysis-123',
    repositoryId: 'repo-1',
    repositoryName: 'facebook/react',
    repositoryOwner: 'facebook',
    status: 'completed',
    type: 'comprehensive',
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 15) // 15 mins after started
  },
  {
    id: 'analysis-456',
    repositoryId: 'repo-2',
    repositoryName: 'vercel/next.js',
    repositoryOwner: 'vercel',
    status: 'completed',
    type: 'architecture',
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 5 + 1000 * 60 * 10) // 10 mins after started
  },
  {
    id: 'analysis-789',
    repositoryId: 'repo-3',
    repositoryName: 'tailwindlabs/tailwindcss',
    repositoryOwner: 'tailwindlabs',
    status: 'completed',
    type: 'prd',
    startedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    completedAt: new Date(Date.now() - 1000 * 60 * 30 + 1000 * 60 * 8) // 8 mins after started
  }
];

export default function AnalysesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/analyses');
      return;
    }

    // In a real app, we would fetch analyses from API
    const fetchAnalyses = async () => {
      setIsLoading(true);
      try {
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnalyses(MOCK_ANALYSES);
      } catch (error) {
        console.error('Error fetching analyses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchAnalyses();
    }
  }, [status, router]);

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch =
      searchQuery === '' ||
      analysis.repositoryName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      selectedTab === 'all' ||
      (selectedTab === 'completed' && analysis.status === 'completed') ||
      (selectedTab === 'in-progress' && analysis.status === 'in-progress') ||
      (selectedTab === 'failed' && analysis.status === 'failed');

    return matchesSearch && matchesTab;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAnalysisTypeLabel = (type: string) => {
    switch (type) {
      case 'comprehensive':
        return 'Comprehensive';
      case 'architecture':
        return 'Architecture Focus';
      case 'prd':
        return 'PRD Extraction';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading your analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Your Analyses</h1>
          <p className="text-gray-500 dark:text-gray-400">
            View and manage your repository analyses
          </p>
        </div>

        <Button onClick={() => router.push('/repositories')}>
          <Plus className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search analyses..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button variant="outline" className="sm:w-auto w-full flex">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredAnalyses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No analyses found.
          </p>
          <Button onClick={() => router.push('/repositories')}>
            Start a New Analysis
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredAnalyses.map(analysis => (
            <Card key={analysis.id} className="overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b">
                <div className="flex items-center">
                  <Github className="h-5 w-5 mr-3 text-gray-700 dark:text-gray-300" />
                  <div>
                    <h3 className="font-medium">{analysis.repositoryName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Analyzed {formatDate(analysis.startedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      analysis.status === 'completed'
                        ? 'default'
                        : analysis.status === 'failed'
                        ? 'destructive'
                        : 'outline'
                    }
                  >
                    {analysis.status === 'completed'
                      ? 'Completed'
                      : analysis.status === 'in-progress'
                      ? 'In Progress'
                      : 'Failed'}
                  </Badge>
                  <Badge variant="outline">
                    {getAnalysisTypeLabel(analysis.type)}
                  </Badge>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-gray-500">
                        Processing time:{' '}
                        {analysis.status === 'completed'
                          ? `${Math.round(
                              (analysis.completedAt.getTime() -
                                analysis.startedAt.getTime()) /
                                1000 /
                                60
                            )} minutes`
                          : 'In progress'}
                      </span>
                    </div>
                  </div>
                  <Link href={`/analyses/${analysis.id}`}>
                    <Button>View Results</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
