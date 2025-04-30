import { RepositoryAnalysisNode } from '@/app/services/workflow/nodes/RepositoryAnalysisNode';
import { NodeStatus } from '@/app/services/workflow/types';
import { createGitHubClient } from '@/lib/github/githubClient';
import {
  mockRepository,
  mockRepositoryContents
} from '../../../mocks/github-api';
import { server } from '../../../mocks/server';

// Mock the GitHub client
jest.mock('@/lib/github/githubClient', () => ({
  createGitHubClient: jest.fn().mockReturnValue({
    getRepo: jest.fn().mockResolvedValue(mockRepository),
    getRepoContents: jest.fn().mockResolvedValue(mockRepositoryContents),
    request: jest.fn()
  })
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

describe('RepositoryAnalysisNode', () => {
  const initialState = {
    nodeId: 'repo-analysis',
    status: NodeStatus.IDLE,
    data: {
      repositoryId: '123',
      owner: 'example-user',
      repo: 'example-repo',
      accessToken: 'test-token'
    },
    error: null
  };

  let node: RepositoryAnalysisNode;

  beforeEach(() => {
    node = new RepositoryAnalysisNode(initialState);
  });

  test('initializes with correct state', () => {
    expect(node.getState()).toEqual(initialState);
  });

  test('prep phase completes successfully with required inputs', async () => {
    await node.prep();

    expect(node.getState().status).toBe(NodeStatus.READY);
  });

  test('prep phase fails with missing inputs', async () => {
    // Create node with missing owner/repo
    const nodeWithMissingData = new RepositoryAnalysisNode({
      nodeId: 'repo-analysis',
      status: NodeStatus.IDLE,
      data: {
        repositoryId: '123',
        // Missing owner and repo
        accessToken: 'test-token'
      },
      error: null
    });

    await nodeWithMissingData.prep();

    expect(nodeWithMissingData.getState().status).toBe(NodeStatus.ERROR);
    expect(nodeWithMissingData.getState().error).toContain(
      'Missing required data'
    );
  });

  test('exec phase fetches repository details and contents', async () => {
    await node.prep();
    await node.exec();

    // Verify GitHub client was called correctly
    const githubClient = createGitHubClient({ accessToken: 'test-token' });
    expect(githubClient.getRepo).toHaveBeenCalledWith(
      'example-user',
      'example-repo'
    );
    expect(githubClient.getRepoContents).toHaveBeenCalledWith(
      'example-user',
      'example-repo'
    );

    // Verify state was updated correctly
    expect(node.getState().status).toBe(NodeStatus.COMPLETED);
    expect(node.getState().data.repository).toEqual(mockRepository);
    expect(node.getState().data.contents).toEqual(mockRepositoryContents);
  });

  test('exec phase handles GitHub API errors', async () => {
    // Mock failure in GitHub client
    const mockGithubClient = createGitHubClient({ accessToken: 'test-token' });
    // @ts-ignore - mocking
    mockGithubClient.getRepo.mockRejectedValue(new Error('GitHub API error'));

    await node.prep();
    await node.exec();

    expect(node.getState().status).toBe(NodeStatus.ERROR);
    expect(node.getState().error).toContain('Failed to fetch repository data');
  });

  test('post phase completes successfully', async () => {
    await node.prep();
    await node.exec();
    await node.post();

    expect(node.getState().status).toBe(NodeStatus.COMPLETED);
    // Post phase doesn't modify the state for this node
  });

  test('complete workflow execution succeeds', async () => {
    await node.run();

    expect(node.getState().status).toBe(NodeStatus.COMPLETED);
    expect(node.getState().data.repository).toEqual(mockRepository);
    expect(node.getState().data.contents).toEqual(mockRepositoryContents);
  });
});
