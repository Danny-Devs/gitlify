import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';
import PRDDetail from '@/app/components/prd/PRDDetail';

export const dynamic = 'force-dynamic';

export default async function PRDPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // Fetch the PRD with all related data
  const prd = await prisma.pRD.findUnique({
    where: {
      id: params.id
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
        orderBy: {
          orderIndex: 'asc'
        },
        include: {
          diagrams: true
        }
      },
      diagrams: true,
      ratings: userId
        ? {
            where: {
              userId
            }
          }
        : false,
      comments: {
        where: {
          parentId: null
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          replies: {
            orderBy: {
              createdAt: 'asc'
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true
                }
              }
            }
          }
        }
      },
      _count: {
        select: {
          ratings: true,
          comments: true
        }
      }
    }
  });

  if (!prd) {
    notFound();
  }

  return <PRDDetail prd={prd} />;
}
