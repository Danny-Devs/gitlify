import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';
import PRDCard from '@/app/components/prd/PRDCard';

export const dynamic = 'force-dynamic';

export default async function PRDsPage({
  searchParams
}: {
  searchParams: { tab?: string };
}) {
  const session = await getServerSession(authOptions);
  const activeTab = searchParams.tab || 'all';

  if (!session) {
    redirect('/auth/signin?callbackUrl=/prds');
  }

  // Fetch PRDs based on the active tab
  let prds;
  switch (activeTab) {
    case 'mine':
      prds = await prisma.pRD.findMany({
        where: {
          userId: session.user.id
        },
        include: {
          repository: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          chapters: {
            select: {
              id: true
            }
          },
          _count: {
            select: {
              ratings: true,
              comments: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });
      break;
    default:
      prds = await prisma.pRD.findMany({
        where: {
          status: 'published'
        },
        include: {
          repository: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          chapters: {
            select: {
              id: true
            }
          },
          _count: {
            select: {
              ratings: true,
              comments: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });
      break;
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

        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all" asChild>
              <Link href="/prds?tab=all">All PRDs</Link>
            </TabsTrigger>
            <TabsTrigger value="mine" asChild>
              <Link href="/prds?tab=mine">My PRDs</Link>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Suspense fallback={<p>Loading PRDs...</p>}>
              {prds.length > 0 ? (
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
                      chapterCount={prd.chapters.length}
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
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
