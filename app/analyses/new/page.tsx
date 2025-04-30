'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2, Github, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { createGitHubClient } from '@/app/lib/github/githubClient';
import Link from 'next/link';

export default function NewAnalysisPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [owner, setOwner] = useState<string>(searchParams.get('owner') || '');
  const [repo, setRepo] = useState<string>(searchParams.get('repo') || '');
  const [repository, setRepository] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<string>('comprehensive');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState<string>('');
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(
        '/auth/signin?callbackUrl=' +
          encodeURIComponent(`/analyses/new?owner=${owner}&repo=${repo}`)
      );
    }
  }, [status, router, owner, repo]);

  // Fetch repository details
  useEffect(() => {
    if (!owner || !repo) {
      setError(
        'Repository information is missing. Please provide owner and repo name.'
      );
      setIsLoading(false);
      return;
    }

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

    if (status === 'authenticated') {
      fetchRepositoryDetails();
    }
  }, [owner, repo, status]);

  // Mock function to simulate analysis progress
  const simulateAnalysisProgress = () => {
    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisStage('Initializing analysis...');

    // Analysis stages simulation
    const stages = [
      { progress: 10, message: 'Cloning repository...' },
      { progress: 20, message: 'Parsing file structure...' },
      { progress: 30, message: 'Analyzing code patterns...' },
      { progress: 50, message: 'Generating architectural overview...' },
      { progress: 60, message: 'Identifying component relationships...' },
      { progress: 70, message: 'Extracting project requirements...' },
      { progress: 80, message: 'Creating implementation guides...' },
      { progress: 90, message: 'Finalizing analysis...' },
      { progress: 100, message: 'Analysis complete!' }
    ];

    // Simulate progress through stages
    let stageIndex = 0;
    const progressInterval = setInterval(() => {
      if (stageIndex < stages.length) {
        const stage = stages[stageIndex];
        setProgress(stage.progress);
        setAnalysisStage(stage.message);
        stageIndex++;
      } else {
        clearInterval(progressInterval);
        setAnalysisComplete(true);
        setAnalysisId('analysis-123'); // In a real app, this would be the ID from the database
      }
    }, 2000); // Update every 2 seconds for demonstration

    return () => clearInterval(progressInterval);
  };

  const handleStartAnalysis = async () => {
    // In a real implementation, we would:
    // 1. Save this repository to the user's repositories if not already saved
    // 2. Create a new analysis record in the database
    // 3. Start the analysis process

    try {
      simulateAnalysisProgress();
    } catch (error) {
      console.error('Error starting analysis:', error);
      setError('Failed to start analysis. Please try again.');
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading repository information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (analysisComplete && analysisId) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Analysis Complete!</CardTitle>
            </div>
            <CardDescription>
              Your repository has been successfully analyzed. You can now
              explore the results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-lg">
                The {analysisType} analysis of{' '}
                <strong>
                  {owner}/{repo}
                </strong>{' '}
                is ready for exploration.
              </p>
              <div className="flex justify-center mt-6">
                <Link href={`/analyses/${analysisId}`}>
                  <Button size="lg">View Analysis Results</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Analyzing Repository</CardTitle>
            <CardDescription>
              {owner}/{repo}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{analysisStage}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border text-sm font-mono h-32 overflow-y-auto">
                <p className="text-gray-500">
                  $ Initializing analysis engine...
                </p>
                {progress >= 10 && (
                  <p className="text-gray-500">
                    $ Cloning repository {owner}/{repo}...
                  </p>
                )}
                {progress >= 20 && (
                  <p className="text-gray-500">$ Parsing file structure...</p>
                )}
                {progress >= 30 && (
                  <p className="text-gray-500">
                    $ Analyzing code patterns in{' '}
                    {repository?.language || 'code'}...
                  </p>
                )}
                {progress >= 50 && (
                  <p className="text-gray-500">
                    $ Generating architectural overview...
                  </p>
                )}
                {progress >= 60 && (
                  <p className="text-gray-500">
                    $ Mapping component relationships...
                  </p>
                )}
                {progress >= 70 && (
                  <p className="text-gray-500">
                    $ Extracting project requirements from implementation...
                  </p>
                )}
                {progress >= 80 && (
                  <p className="text-gray-500">
                    $ Creating implementation guides...
                  </p>
                )}
                {progress >= 90 && (
                  <p className="text-gray-500">
                    $ Finalizing analysis and preparing results...
                  </p>
                )}
                {progress >= 100 && (
                  <p className="text-green-500">
                    $ Analysis complete! Preparing results...
                  </p>
                )}
              </div>

              <p className="text-sm text-gray-500 italic">
                This process may take several minutes depending on the size and
                complexity of the repository.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Github className="h-5 w-5" />
            <CardTitle>New Repository Analysis</CardTitle>
          </div>
          <CardDescription>
            Configure your analysis options for {owner}/{repo}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">
                Repository Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Owner</p>
                    <p className="font-medium">{owner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Repository</p>
                    <p className="font-medium">{repo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Language</p>
                    <p className="font-medium">
                      {repository?.language || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-medium">
                      {repository
                        ? `${(repository.size / 1024).toFixed(2)} MB`
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Analysis Type</h3>
              <RadioGroup
                value={analysisType}
                onValueChange={setAnalysisType}
                className="space-y-3"
              >
                <div className="flex items-start space-x-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-md border">
                  <RadioGroupItem value="comprehensive" id="comprehensive" />
                  <div className="grid gap-1.5">
                    <Label className="font-medium" htmlFor="comprehensive">
                      Comprehensive Analysis
                    </Label>
                    <p className="text-sm text-gray-500">
                      Complete analysis including architecture, patterns,
                      detailed explanations, PRD extraction, and implementation
                      guides.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-md border">
                  <RadioGroupItem value="architecture" id="architecture" />
                  <div className="grid gap-1.5">
                    <Label className="font-medium" htmlFor="architecture">
                      Architecture Focus
                    </Label>
                    <p className="text-sm text-gray-500">
                      Focus on high-level architecture, component relationships,
                      and data flow. Less detail about implementation specifics.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-md border">
                  <RadioGroupItem value="prd" id="prd" />
                  <div className="grid gap-1.5">
                    <Label className="font-medium" htmlFor="prd">
                      PRD Extraction
                    </Label>
                    <p className="text-sm text-gray-500">
                      Focus on extracting detailed project requirements and
                      specifications from the codebase for reimplementation.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleStartAnalysis}>Start Analysis</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
