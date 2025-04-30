'use server';

import prisma from '@/lib/prisma';
import { createGitHubClient } from '@/lib/github/githubClient';

/**
 * Repository Service
 *
 * This service handles operations related to repositories, including
 * adding, fetching, and analyzing repositories.
 */

/**
 * Extract owner and repo name from a GitHub URL
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } {
  // Clean up URL
  url = url.trim();

  // Remove trailing slash if present
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }

  // Try to match GitHub URL patterns
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/]+)$/,
    /github\.com\/([^\/]+)\/([^\/]+)\/$/,
    /github\.com\/([^\/]+)\/([^\/]+)(\.git)$/,
    /git@github\.com:([^\/]+)\/([^\/]+)(\.git)?$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match.length >= 3) {
      const owner = match[1];
      // Remove .git suffix if present
      const repo = match[2].replace(/\.git$/, '');
      return { owner, repo };
    }
  }

  throw new Error('Invalid GitHub repository URL');
}

/**
 * Get all repositories for a user
 */
export async function getRepositories(userId: string) {
  try {
    const repositories = await prisma.repository.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    return { success: true, data: repositories };
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return { success: false, error: 'Failed to fetch repositories' };
  }
}

/**
 * Get a single repository by ID
 */
export async function getRepository(id: string, userId: string) {
  try {
    const repository = await prisma.repository.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!repository) {
      return { success: false, error: 'Repository not found' };
    }

    return { success: true, data: repository };
  } catch (error) {
    console.error('Error fetching repository:', error);
    return { success: false, error: 'Failed to fetch repository' };
  }
}

/**
 * Get a repository by ID (throws error if not found)
 */
export async function getRepositoryById(id: string) {
  try {
    const repository = await prisma.repository.findUnique({
      where: { id }
    });

    if (!repository) {
      throw new Error(`Repository with ID ${id} not found`);
    }

    return repository;
  } catch (error) {
    console.error('Error getting repository by ID:', error);
    throw error;
  }
}

/**
 * Add a repository to the database
 */
export async function addRepository(userId: string, url: string) {
  try {
    // Parse GitHub URL
    const { owner, repo } = parseGitHubUrl(url);

    // Create GitHub client
    const githubClient = createGitHubClient({
      accessToken: process.env.GITHUB_ACCESS_TOKEN
    });

    // Fetch repository details from GitHub API
    const repoDetails = await githubClient.getRepo(owner, repo);

    // Check if repository already exists for this user
    const existingRepo = await prisma.repository.findFirst({
      where: {
        url: repoDetails.html_url,
        userId
      }
    });

    if (existingRepo) {
      return { success: true, data: existingRepo };
    }

    // Create new repository in database
    const repository = await prisma.repository.create({
      data: {
        name: repoDetails.name,
        owner: repoDetails.owner.login,
        description: repoDetails.description || '',
        url: repoDetails.html_url,
        isPrivate: repoDetails.private,
        stars: repoDetails.stargazers_count,
        forks: repoDetails.forks_count,
        lastCommitSha: repoDetails.default_branch,
        userId
      }
    });

    return { success: true, data: repository };
  } catch (error) {
    console.error('Error adding repository:', error);
    return { success: false, error: 'Failed to add repository' };
  }
}

/**
 * Update an existing repository
 */
export async function updateRepository(id: string, data: any, userId: string) {
  try {
    // Ensure the repository belongs to the user
    const repository = await prisma.repository.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!repository) {
      return { success: false, error: 'Repository not found' };
    }

    const updatedRepository = await prisma.repository.update({
      where: { id },
      data
    });

    return { success: true, data: updatedRepository };
  } catch (error) {
    console.error('Error updating repository:', error);
    return { success: false, error: 'Failed to update repository' };
  }
}

/**
 * Delete a repository
 */
export async function deleteRepository(id: string, userId: string) {
  try {
    // Check if repository exists and belongs to user
    const repository = await prisma.repository.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!repository) {
      return { success: false, error: 'Repository not found' };
    }

    // Delete repository
    await prisma.repository.delete({
      where: { id }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting repository:', error);
    return { success: false, error: 'Failed to delete repository' };
  }
}

/**
 * Search GitHub repositories
 */
export async function searchGitHubRepositories(query: string) {
  try {
    // Create GitHub client
    const githubClient = createGitHubClient({
      accessToken: process.env.GITHUB_ACCESS_TOKEN
    });

    // Search repositories
    const result = await githubClient.request<any>(
      `/search/repositories?q=${encodeURIComponent(
        query
      )}&sort=stars&order=desc`
    );

    // Format results
    const repositories = result.items.map((repo: any) => ({
      name: repo.name,
      owner: repo.owner.login,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language
    }));

    return { success: true, data: repositories };
  } catch (error) {
    console.error('Error searching GitHub repositories:', error);
    return { success: false, error: 'Failed to search repositories' };
  }
}
