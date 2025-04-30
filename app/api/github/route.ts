import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createGitHubClient } from '@/app/lib/github/githubClient';

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
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Use GitHub API to search
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(
        query
      )}+language:typescript+language:javascript&sort=stars&order=desc`
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      items: data.items || [],
      total_count: data.total_count || 0
    });
  } catch (error) {
    console.error('Error searching GitHub repositories:', error);
    return NextResponse.json(
      { error: 'Failed to search repositories' },
      { status: 500 }
    );
  }
}
