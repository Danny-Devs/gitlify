import { CoreAbstractionsNode } from '@/app/services/workflow/nodes/CoreAbstractionsNode';
import { NodeStatus } from '@/app/services/workflow/types';
import { createLLMClient } from '@/lib/llm/llmClient';
import {
  mockRepository,
  mockRepositoryContents
} from '../../../mocks/github-api';
import { server } from '../../../mocks/server';

// Mock the LLM client
jest.mock('@/lib/llm/llmClient', () => ({
  createLLMClient: jest.fn().mockReturnValue({
    complete: jest.fn().mockResolvedValue({
      text: `
Core abstractions for the example-repo repository:

1. User - Represents system users with authentication capabilities
2. Repository - GitHub code repository representation
3. File - Code file with content and metadata
4. Component - UI building block for web interface
5. Authentication - Security mechanisms for user validation
6. API - External interface for third-party services
7. Database - Data storage and retrieval mechanism
8. Cache - Temporary storage for improved performance
9. Logger - System for tracking and recording events
10. Configuration - Settings management for application behavior

These abstractions encapsulate the essential concepts in the system and form the foundation of the application architecture.
      `,
      usage: { totalTokens: 150 }
    })
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

describe('CoreAbstractionsNode', () => {
  const initialState = {
    nodeId: 'core-abstractions',
    status: NodeStatus.IDLE,
    data: {
      repositoryId: '123',
      repository: mockRepository,
      contents: mockRepositoryContents,
      llmConfig: {
        endpoint: 'http://localhost:11434/api/generate',
        modelName: 'codellama:7b',
        contextWindow: 4000
      }
    },
    error: null
  };

  let node: CoreAbstractionsNode;

  beforeEach(() => {
    node = new CoreAbstractionsNode(initialState);
  });

  test('initializes with correct state', () => {
    expect(node.getState()).toEqual(initialState);
  });

  test('prep phase completes successfully with required inputs', async () => {
    await node.prep();

    expect(node.getState().status).toBe(NodeStatus.READY);
  });

  test('prep phase fails with missing repository data', async () => {
    // Create node with missing repository data
    const nodeWithMissingData = new CoreAbstractionsNode({
      nodeId: 'core-abstractions',
      status: NodeStatus.IDLE,
      data: {
        repositoryId: '123',
        // Missing repository and contents
        llmConfig: {
          endpoint: 'http://localhost:11434/api/generate',
          modelName: 'codellama:7b',
          contextWindow: 4000
        }
      },
      error: null
    });

    await nodeWithMissingData.prep();

    expect(nodeWithMissingData.getState().status).toBe(NodeStatus.ERROR);
    expect(nodeWithMissingData.getState().error).toContain(
      'Missing required repository data'
    );
  });

  test('prep phase fails with missing LLM config', async () => {
    // Create node with missing LLM config
    const nodeWithMissingLLM = new CoreAbstractionsNode({
      nodeId: 'core-abstractions',
      status: NodeStatus.IDLE,
      data: {
        repositoryId: '123',
        repository: mockRepository,
        contents: mockRepositoryContents
        // Missing llmConfig
      },
      error: null
    });

    await nodeWithMissingLLM.prep();

    expect(nodeWithMissingLLM.getState().status).toBe(NodeStatus.ERROR);
    expect(nodeWithMissingLLM.getState().error).toContain(
      'Missing required LLM configuration'
    );
  });

  test('exec phase generates abstractions using LLM', async () => {
    await node.prep();
    await node.exec();

    // Verify LLM client was called correctly
    const llmClient = createLLMClient({
      baseUrl: 'http://localhost:11434/api/generate',
      model: 'codellama:7b'
    });
    expect(llmClient.complete).toHaveBeenCalled();
    expect(llmClient.complete).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('extract the core abstractions')
      })
    );

    // Verify state was updated correctly
    expect(node.getState().status).toBe(NodeStatus.COMPLETED);
    expect(node.getState().data.abstractions).toBeDefined();
    expect(node.getState().data.abstractions).toContain('Core abstractions');
    expect(node.getState().data.abstractions).toContain('User');
    expect(node.getState().data.abstractions).toContain('Repository');
  });

  test('exec phase handles LLM API errors', async () => {
    // Mock failure in LLM client
    const mockLLMClient = createLLMClient({
      baseUrl: 'http://localhost:11434/api/generate',
      model: 'codellama:7b'
    });
    // @ts-ignore - mocking
    mockLLMClient.complete.mockRejectedValue(new Error('LLM API error'));

    await node.prep();
    await node.exec();

    expect(node.getState().status).toBe(NodeStatus.ERROR);
    expect(node.getState().error).toContain(
      'Failed to extract core abstractions'
    );
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
    expect(node.getState().data.abstractions).toBeDefined();
    expect(node.getState().data.abstractions).toContain('Core abstractions');
  });
});
