'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PRDForm from '@/app/components/prd/PRDForm';
import OllamaSetupBanner from '@/app/components/common/OllamaSetupBanner';

export default function NewPRDPage({
  searchParams
}: {
  searchParams: { repositoryId?: string };
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [repository, setRepository] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/prds/new');
      return;
    }

    // Redirect to repositories page if no repositoryId provided
    if (!searchParams.repositoryId) {
      router.push('/repositories');
      return;
    }

    // Fetch the repository
    async function fetchRepository() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/repositories?id=${searchParams.repositoryId}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            router.push('/repositories');
          }
          return;
        }

        const data = await response.json();
        setRepository(data.repository);
      } catch (error) {
        console.error('Error fetching repository:', error);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchRepository();
    }
  }, [searchParams.repositoryId, status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Generate PRD</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!repository) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Generate PRD</h1>
        <p className="text-muted-foreground mb-4">
          Create a comprehensive PRD for {repository.name} with chapter-based
          organization and visual diagrams.
        </p>

        <OllamaSetupBanner />

        <PRDForm repository={repository} />
      </div>
    </div>
  );
}
