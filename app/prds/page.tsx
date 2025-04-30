'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/app/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/app/components/ui/tabs';
import { FileText, Loader2 } from 'lucide-react';
import PRDCard from '@/app/components/prd/PRDCard';

export default function PRDsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [prds, setPrds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeTab = searchParams?.get('tab') || 'all';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/prds');
    }

    if (status === 'authenticated') {
      fetchPRDs();
    }
  }, [status, activeTab]);

  async function fetchPRDs() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/prds?tab=${activeTab}`);
      if (!response.ok) {
        throw new Error('Failed to fetch PRDs');
      }
      const data = await response.json();
      setPrds(data);
    } catch (error) {
      console.error('Error fetching PRDs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // We're redirecting in the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Project Requirement Documents</h1>
          <Link href="/repositories">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Select Repository
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} className="w-full">
          <TabsList>
            <TabsTrigger
              value="all"
              onClick={() => router.push('/prds?tab=all')}
            >
              All PRDs
            </TabsTrigger>
            <TabsTrigger
              value="mine"
              onClick={() => router.push('/prds?tab=mine')}
            >
              My PRDs
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : prds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prds.map(prd => (
                  <PRDCard
                    key={prd.id}
                    id={prd.id}
                    title={prd.title}
                    summary={prd.summary}
                    status={prd.status}
                    createdAt={prd.createdAt}
                    updatedAt={prd.updatedAt}
                    repository={{
                      name: prd.repository.name,
                      owner: prd.repository.owner,
                      stars: prd.repository.stars,
                      forks: prd.repository.forks
                    }}
                    user={prd.user}
                    chapterCount={prd.chapters?.length || 0}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'mine'
                    ? "You haven't created any PRDs yet."
                    : 'No published PRDs available.'}
                </p>
                <Link href="/repositories">
                  <Button>Generate Your First PRD</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
