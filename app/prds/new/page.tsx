import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';
import PRDForm from '@/app/components/prd/PRDForm';

export const dynamic = 'force-dynamic';

export default async function NewPRDPage({
  searchParams
}: {
  searchParams: { repositoryId?: string };
}) {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/auth/signin?callbackUrl=/prds/new');
  }

  // Redirect to repositories page if no repositoryId provided
  if (!searchParams.repositoryId) {
    redirect('/repositories');
  }

  // Fetch the repository
  const repository = await prisma.repository.findUnique({
    where: {
      id: searchParams.repositoryId,
      userId: session.user.id
    }
  });

  // Handle repository not found
  if (!repository) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Generate PRD</h1>
        <p className="text-muted-foreground mb-8">
          Create a comprehensive PRD for {repository.name} with chapter-based
          organization and visual diagrams.
        </p>

        <Suspense fallback={<p>Loading...</p>}>
          <PRDForm repository={repository} />
        </Suspense>
      </div>
    </div>
  );
}
