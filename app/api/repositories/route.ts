import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';

// Schema for repository validation
const repositorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  owner: z.string().min(1, 'Owner is required'),
  description: z.string().optional().nullable(),
  url: z.string().url('Repository URL must be valid'),
  isPrivate: z.boolean().default(false),
  stars: z.number().optional().nullable(),
  forks: z.number().optional().nullable()
});

// GET - Get repositories or a specific repository
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    // If URL is provided, look up a specific repository
    if (url) {
      const repository = await prisma.repository.findFirst({
        where: {
          url,
          userId: session.user.id
        }
      });

      return NextResponse.json({ repository });
    }

    // Otherwise, return all repositories for the user
    const repositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json({ repositories });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}

// POST - Create a new repository
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = repositorySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, owner, description, url, isPrivate, stars, forks } =
      validationResult.data;

    // Check if repository already exists for this user
    const existingRepository = await prisma.repository.findFirst({
      where: {
        url,
        userId: session.user.id
      }
    });

    if (existingRepository) {
      // Update the repository with new information
      const updatedRepository = await prisma.repository.update({
        where: {
          id: existingRepository.id
        },
        data: {
          name,
          owner,
          description,
          isPrivate,
          stars,
          forks,
          updatedAt: new Date()
        }
      });

      return NextResponse.json(updatedRepository);
    }

    // Create a new repository record
    const repository = await prisma.repository.create({
      data: {
        name,
        owner,
        description,
        url,
        isPrivate,
        stars,
        forks,
        userId: session.user.id
      }
    });

    return NextResponse.json(repository, { status: 201 });
  } catch (error) {
    console.error('Error creating repository:', error);
    return NextResponse.json(
      { error: 'Failed to create repository' },
      { status: 500 }
    );
  }
}
