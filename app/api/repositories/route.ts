import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  addRepository,
  getRepositories,
  deleteRepository
} from '@/app/services/repository/repositoryService';
import prisma from '@/lib/prisma';

/**
 * GET /api/repositories
 * Get the user's repositories
 * Can filter by URL or ID
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const repoUrl = url.searchParams.get('url');
    const repoId = url.searchParams.get('id');

    if (repoId) {
      // Get a specific repository by ID
      const repository = await prisma.repository.findFirst({
        where: {
          id: repoId,
          userId: session.user.id
        }
      });

      if (!repository) {
        return NextResponse.json(
          { error: 'Repository not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ repository });
    } else if (repoUrl) {
      // Get a specific repository by URL
      const repository = await prisma.repository.findFirst({
        where: {
          url: repoUrl,
          userId: session.user.id
        }
      });

      return NextResponse.json({ repository: repository || null });
    } else {
      // Get all repositories for the user
      const repositories = await prisma.repository.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({ repositories });
    }
  } catch (error) {
    console.error('Error getting repositories:', error);
    return NextResponse.json(
      { error: 'Failed to get repositories' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/repositories
 * Save a repository
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if the repo already exists
    const existingRepo = await prisma.repository.findFirst({
      where: {
        url: body.url,
        userId: session.user.id
      }
    });

    if (existingRepo) {
      return NextResponse.json(existingRepo);
    }

    // Create a new repository
    const repository = await prisma.repository.create({
      data: {
        name: body.name,
        owner: body.owner,
        description: body.description || '',
        url: body.url,
        isPrivate: body.isPrivate || false,
        stars: body.stars || 0,
        forks: body.forks || 0,
        userId: session.user.id
      }
    });

    return NextResponse.json(repository, { status: 201 });
  } catch (error) {
    console.error('Error saving repository:', error);
    return NextResponse.json(
      { error: 'Failed to save repository' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/repositories/:id
 * Delete a repository
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Repository ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteRepository(id, userId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE /api/repositories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
