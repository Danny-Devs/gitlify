import {
  parseGitHubUrl,
  addRepository,
  getRepositories,
  getRepository,
  deleteRepository
} from '@/app/services/repository/repositoryService';
import prisma from '@/lib/prisma';
import { server } from '../../mocks/server';
import { mockRepository } from '../../mocks/github-api';

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  repository: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

// Close server after all tests
afterAll(() => server.close());

describe('Repository Service', () => {
  describe('parseGitHubUrl', () => {
    test('parses valid GitHub URL', () => {
      const result = parseGitHubUrl(
        'https://github.com/example-user/example-repo'
      );
      expect(result).toEqual({ owner: 'example-user', repo: 'example-repo' });
    });

    test('parses URL with trailing slash', () => {
      const result = parseGitHubUrl(
        'https://github.com/example-user/example-repo/'
      );
      expect(result).toEqual({ owner: 'example-user', repo: 'example-repo' });
    });

    test('parses URL with .git suffix', () => {
      const result = parseGitHubUrl(
        'https://github.com/example-user/example-repo.git'
      );
      expect(result).toEqual({ owner: 'example-user', repo: 'example-repo' });
    });

    test('parses SSH URL', () => {
      const result = parseGitHubUrl(
        'git@github.com:example-user/example-repo.git'
      );
      expect(result).toEqual({ owner: 'example-user', repo: 'example-repo' });
    });

    test('throws error for invalid URL', () => {
      expect(() => parseGitHubUrl('invalid-url')).toThrow(
        'Invalid GitHub repository URL'
      );
    });
  });

  describe('getRepositories', () => {
    test('returns repositories for user', async () => {
      const mockRepos = [
        { id: '1', name: 'repo1', owner: 'user1' },
        { id: '2', name: 'repo2', owner: 'user1' }
      ];

      // @ts-ignore - mocking
      prisma.repository.findMany.mockResolvedValue(mockRepos);

      const result = await getRepositories('user1');
      expect(result).toEqual({ success: true, data: mockRepos });
      expect(prisma.repository.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        orderBy: { updatedAt: 'desc' }
      });
    });

    test('handles errors', async () => {
      // @ts-ignore - mocking
      prisma.repository.findMany.mockRejectedValue(new Error('Database error'));

      const result = await getRepositories('user1');
      expect(result).toEqual({
        success: false,
        error: 'Failed to fetch repositories'
      });
    });
  });

  describe('getRepository', () => {
    test('returns repository by id', async () => {
      const mockRepo = { id: '1', name: 'repo1', owner: 'user1' };

      // @ts-ignore - mocking
      prisma.repository.findFirst.mockResolvedValue(mockRepo);

      const result = await getRepository('1', 'user1');
      expect(result).toEqual({ success: true, data: mockRepo });
      expect(prisma.repository.findFirst).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user1' }
      });
    });

    test('returns error when repository not found', async () => {
      // @ts-ignore - mocking
      prisma.repository.findFirst.mockResolvedValue(null);

      const result = await getRepository('1', 'user1');
      expect(result).toEqual({ success: false, error: 'Repository not found' });
    });

    test('handles errors', async () => {
      // @ts-ignore - mocking
      prisma.repository.findFirst.mockRejectedValue(
        new Error('Database error')
      );

      const result = await getRepository('1', 'user1');
      expect(result).toEqual({
        success: false,
        error: 'Failed to fetch repository'
      });
    });
  });

  describe('addRepository', () => {
    test('adds new repository', async () => {
      const mockRepoData = {
        id: '1',
        name: mockRepository.name,
        owner: mockRepository.owner.login,
        description: mockRepository.description,
        url: mockRepository.html_url,
        isPrivate: mockRepository.private,
        stars: mockRepository.stargazers_count,
        forks: mockRepository.forks_count,
        lastCommitSha: mockRepository.default_branch,
        userId: 'user1'
      };

      // @ts-ignore - mocking
      prisma.repository.findFirst.mockResolvedValue(null);
      // @ts-ignore - mocking
      prisma.repository.create.mockResolvedValue(mockRepoData);

      const result = await addRepository(
        'user1',
        'https://github.com/example-user/example-repo'
      );
      expect(result).toEqual({ success: true, data: mockRepoData });
      expect(prisma.repository.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: mockRepository.name,
          owner: mockRepository.owner.login,
          url: mockRepository.html_url,
          userId: 'user1'
        })
      });
    });

    test('returns existing repository if already exists', async () => {
      const mockExistingRepo = {
        id: '1',
        name: 'example-repo',
        owner: 'example-user'
      };

      // @ts-ignore - mocking
      prisma.repository.findFirst.mockResolvedValue(mockExistingRepo);

      const result = await addRepository(
        'user1',
        'https://github.com/example-user/example-repo'
      );
      expect(result).toEqual({ success: true, data: mockExistingRepo });
      expect(prisma.repository.create).not.toHaveBeenCalled();
    });

    test('handles invalid URL', async () => {
      const result = await addRepository('user1', 'invalid-url');
      expect(result).toEqual({
        success: false,
        error: 'Failed to add repository'
      });
    });
  });

  describe('deleteRepository', () => {
    test('deletes repository', async () => {
      const mockRepo = { id: '1', name: 'repo1', owner: 'user1' };

      // @ts-ignore - mocking
      prisma.repository.findFirst.mockResolvedValue(mockRepo);
      // @ts-ignore - mocking
      prisma.repository.delete.mockResolvedValue(mockRepo);

      const result = await deleteRepository('1', 'user1');
      expect(result).toEqual({ success: true });
      expect(prisma.repository.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });
    });

    test('returns error when repository not found', async () => {
      // @ts-ignore - mocking
      prisma.repository.findFirst.mockResolvedValue(null);

      const result = await deleteRepository('1', 'user1');
      expect(result).toEqual({ success: false, error: 'Repository not found' });
      expect(prisma.repository.delete).not.toHaveBeenCalled();
    });

    test('handles errors', async () => {
      const mockRepo = { id: '1', name: 'repo1', owner: 'user1' };

      // @ts-ignore - mocking
      prisma.repository.findFirst.mockResolvedValue(mockRepo);
      // @ts-ignore - mocking
      prisma.repository.delete.mockRejectedValue(new Error('Database error'));

      const result = await deleteRepository('1', 'user1');
      expect(result).toEqual({
        success: false,
        error: 'Failed to delete repository'
      });
    });
  });
});
