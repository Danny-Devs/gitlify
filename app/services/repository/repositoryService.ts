'use server';

import { Repository, ApiResponse } from '../../types';
import prisma from '../../lib/prisma';

/**
 * Get all repositories for the current user
 */
export async function getRepositories(
  userId: string
): Promise<ApiResponse<Repository[]>> {
  try {
    const repositories = await prisma.repository.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    return {
      success: true,
      data: repositories
    };
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return {
      success: false,
      error: 'Failed to fetch repositories'
    };
  }
}

/**
 * Get a single repository by ID
 */
export async function getRepository(
  id: string,
  userId: string
): Promise<ApiResponse<Repository>> {
  try {
    const repository = await prisma.repository.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!repository) {
      return {
        success: false,
        error: 'Repository not found'
      };
    }

    return {
      success: true,
      data: repository
    };
  } catch (error) {
    console.error('Error fetching repository:', error);
    return {
      success: false,
      error: 'Failed to fetch repository'
    };
  }
}

/**
 * Add a new repository
 */
export async function addRepository(
  repository: Omit<Repository, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string
): Promise<ApiResponse<Repository>> {
  try {
    const newRepository = await prisma.repository.create({
      data: {
        ...repository,
        userId
      }
    });

    return {
      success: true,
      data: newRepository
    };
  } catch (error) {
    console.error('Error adding repository:', error);
    return {
      success: false,
      error: 'Failed to add repository'
    };
  }
}

/**
 * Update an existing repository
 */
export async function updateRepository(
  id: string,
  data: Partial<Repository>,
  userId: string
): Promise<ApiResponse<Repository>> {
  try {
    // Ensure the repository belongs to the user
    const repository = await prisma.repository.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!repository) {
      return {
        success: false,
        error: 'Repository not found'
      };
    }

    const updatedRepository = await prisma.repository.update({
      where: { id },
      data
    });

    return {
      success: true,
      data: updatedRepository
    };
  } catch (error) {
    console.error('Error updating repository:', error);
    return {
      success: false,
      error: 'Failed to update repository'
    };
  }
}

/**
 * Delete a repository
 */
export async function deleteRepository(
  id: string,
  userId: string
): Promise<ApiResponse<void>> {
  try {
    // Ensure the repository belongs to the user
    const repository = await prisma.repository.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!repository) {
      return {
        success: false,
        error: 'Repository not found'
      };
    }

    await prisma.repository.delete({
      where: { id }
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting repository:', error);
    return {
      success: false,
      error: 'Failed to delete repository'
    };
  }
}
